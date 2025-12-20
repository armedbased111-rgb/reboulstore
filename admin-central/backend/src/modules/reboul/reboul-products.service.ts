import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, Between } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Variant } from './entities/variant.entity';
import { Image } from './entities/image.entity';
import { Brand } from './entities/brand.entity';

/**
 * Service pour gérer les produits Reboul depuis l'Admin Centrale
 * 
 * ⚠️ IMPORTANT : Tous les repositories utilisent la connexion 'reboul'
 * via @InjectRepository(Entity, 'reboul')
 */
@Injectable()
export class ReboulProductsService {
  constructor(
    // ⚠️ Spécifier le nom de la connexion ('reboul')
    @InjectRepository(Product, 'reboul')
    private productRepository: Repository<Product>,
    @InjectRepository(Category, 'reboul')
    private categoryRepository: Repository<Category>,
    @InjectRepository(Variant, 'reboul')
    private variantRepository: Repository<Variant>,
    @InjectRepository(Image, 'reboul')
    private imageRepository: Repository<Image>,
    @InjectRepository(Brand, 'reboul')
    private brandRepository: Repository<Brand>,
  ) {}

  /**
   * Récupérer tous les produits Reboul avec pagination et filtres
   */
  async findAll(page: number = 1, limit: number = 20, filters?: {
    categoryId?: string;
    brandId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<Product> = {};

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.brandId) {
      where.brandId = filters.brandId;
    }

    if (filters?.search) {
      where.name = ILike(`%${filters.search}%`);
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = Between(
        filters.minPrice ?? 0,
        filters.maxPrice ?? Number.MAX_SAFE_INTEGER,
      );
    }

    const [products, total] = await this.productRepository.findAndCount({
      where,
      relations: ['category', 'brand', 'images', 'variants'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Récupérer un produit Reboul par ID
   */
  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'brand', 'images', 'variants'],
    });

    if (!product) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }

    return product;
  }

  /**
   * Créer un nouveau produit Reboul
   * TODO: Implémenter la création complète avec variants et images
   */
  async create(productData: Partial<Product>) {
    // Vérifier que la catégorie existe
    if (productData.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: productData.categoryId },
      });
      if (!category) {
        throw new BadRequestException(
          `Catégorie avec l'ID ${productData.categoryId} non trouvée`,
        );
      }
    }

    // Vérifier que la marque existe si fournie
    if (productData.brandId) {
      const brand = await this.brandRepository.findOne({
        where: { id: productData.brandId },
      });
      if (!brand) {
        throw new BadRequestException(
          `Marque avec l'ID ${productData.brandId} non trouvée`,
        );
      }
    }

    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  /**
   * Mettre à jour un produit Reboul
   */
  async update(id: string, updateData: Partial<Product>) {
    const product = await this.findOne(id);

    Object.assign(product, updateData);
    return this.productRepository.save(product);
  }

  /**
   * Supprimer un produit Reboul
   */
  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: `Produit ${id} supprimé avec succès` };
  }

  /**
   * Récupérer toutes les catégories (pour les filtres)
   */
  async getCategories() {
    return this.categoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Récupérer toutes les marques (pour les filtres)
   */
  async getBrands() {
    return this.brandRepository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Statistiques produits Reboul
   */
  async getStats() {
    const total = await this.productRepository.count();
    const withStock = await this.productRepository
      .createQueryBuilder('product')
      .innerJoin('product.variants', 'variant')
      .where('variant.stock > 0')
      .getCount();

    return {
      total,
      withStock,
      outOfStock: total - withStock,
    };
  }

  /**
   * Ajouter une image à un produit
   */
  async addImage(productId: string, imageData: { url: string; publicId?: string; alt?: string; order: number }) {
    const product = await this.findOne(productId);
    
    const image = this.imageRepository.create({
      productId: product.id,
      url: imageData.url,
      publicId: imageData.publicId || null,
      alt: imageData.alt || null,
      order: imageData.order,
    });

    return this.imageRepository.save(image);
  }

  /**
   * Supprimer une image d'un produit
   */
  async removeImage(productId: string, imageId: string) {
    const product = await this.findOne(productId);
    
    const image = await this.imageRepository.findOne({
      where: { id: imageId, productId: product.id },
    });

    if (!image) {
      throw new NotFoundException(`Image avec l'ID ${imageId} non trouvée pour ce produit`);
    }

    await this.imageRepository.remove(image);
    return { message: 'Image supprimée avec succès' };
  }

  /**
   * Mettre à jour l'ordre des images d'un produit
   */
  async updateImagesOrder(productId: string, images: Array<{ id: string; order: number }>) {
    const product = await this.findOne(productId);

    // Mettre à jour chaque image
    await Promise.all(
      images.map((img) =>
        this.imageRepository.update(
          { id: img.id, productId: product.id },
          { order: img.order },
        ),
      ),
    );

    return this.findOne(productId);
  }

  /**
   * Créer un produit avec ses images et variants
   */
  async createWithImages(productData: Partial<Product>, images?: Array<{ url: string; publicId?: string; alt?: string; order: number }>, variants?: Array<{ color: string; size: string; stock: number; sku: string }>) {
    // Créer le produit d'abord
    const product = await this.create(productData);

    // Ajouter les images si fournies
    if (images && images.length > 0) {
      await Promise.all(
        images.map((img) =>
          this.addImage(product.id, img),
        ),
      );
    }

    // Ajouter les variants si fournis
    if (variants && variants.length > 0) {
      await Promise.all(
        variants.map((variant) => {
          const variantEntity = this.variantRepository.create({
            productId: product.id,
            color: variant.color,
            size: variant.size,
            stock: variant.stock,
            sku: variant.sku,
          });
          return this.variantRepository.save(variantEntity);
        }),
      );
    }

    return this.findOne(product.id);
  }

  /**
   * Mettre à jour un produit et ses images/variants
   */
  async updateWithImages(
    id: string,
    updateData: Partial<Product>,
    images?: Array<{ id?: string; url: string; publicId?: string; alt?: string; order: number }>,
    variants?: Array<{ id?: string; color: string; size: string; stock: number; sku: string }>,
  ) {
    // Mettre à jour le produit
    await this.update(id, updateData);
    const product = await this.findOne(id);

    // Si des images sont fournies, les gérer
    if (images !== undefined) {
      const existingImages = product.images || [];

      // Identifier les images à supprimer (celles qui ne sont plus dans la liste)
      const newImageIds = images.filter((img) => img.id).map((img) => img.id!);
      const imagesToDelete = existingImages.filter((img) => !newImageIds.includes(img.id));

      // Supprimer les images retirées
      if (imagesToDelete.length > 0) {
        await Promise.all(
          imagesToDelete.map((img) => this.imageRepository.remove(img)),
        );
      }

      // Ajouter ou mettre à jour les images
      await Promise.all(
        images.map(async (img) => {
          if (img.id) {
            // Mettre à jour l'image existante
            await this.imageRepository.update(
              { id: img.id, productId: product.id },
              { url: img.url, publicId: img.publicId || null, alt: img.alt || null, order: img.order },
            );
          } else {
            // Ajouter une nouvelle image
            await this.addImage(product.id, img);
          }
        }),
      );
    }

    // Si des variants sont fournis, les gérer
    if (variants !== undefined) {
      const existingVariants = product.variants || [];

      // Identifier les variants à supprimer (ceux qui ne sont plus dans la liste)
      const newVariantIds = variants.filter((v) => v.id).map((v) => v.id!);
      const variantsToDelete = existingVariants.filter((v) => !newVariantIds.includes(v.id));

      // Supprimer les variants retirés
      if (variantsToDelete.length > 0) {
        await Promise.all(
          variantsToDelete.map((v) => this.variantRepository.remove(v)),
        );
      }

      // Ajouter ou mettre à jour les variants
      await Promise.all(
        variants.map(async (variant) => {
          if (variant.id) {
            // Mettre à jour le variant existant
            await this.variantRepository.update(
              { id: variant.id, productId: product.id },
              { color: variant.color, size: variant.size, stock: variant.stock, sku: variant.sku },
            );
          } else {
            // Ajouter un nouveau variant
            const variantEntity = this.variantRepository.create({
              productId: product.id,
              color: variant.color,
              size: variant.size,
              stock: variant.stock,
              sku: variant.sku,
            });
            await this.variantRepository.save(variantEntity);
          }
        }),
      );
    }

    return this.findOne(id);
  }
}
