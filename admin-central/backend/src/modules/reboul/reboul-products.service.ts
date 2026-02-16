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
import { Collection } from './entities/collection.entity';

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
    @InjectRepository(Collection, 'reboul')
    private collectionRepository: Repository<Collection>,
  ) {}

  /**
   * Récupérer tous les produits Reboul avec pagination et filtres
   */
  async findAll(page: number = 1, limit: number = 20, filters?: {
    categoryId?: number | string;
    brandId?: number | string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<Product> = {};

    if (filters?.categoryId != null) {
      where.categoryId = Number(filters.categoryId);
    }

    if (filters?.brandId != null) {
      where.brandId = Number(filters.brandId);
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
  async findOne(id: number | string) {
    const numId = Number(id);
    const product = await this.productRepository.findOne({
      where: { id: numId },
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

    // Si collectionId n'est pas fourni, assigner à la collection active
    let collectionId = productData.collectionId;
    if (!collectionId) {
      const activeCollection = await this.collectionRepository.findOne({
        where: { isActive: true },
      });
      if (activeCollection) {
        collectionId = activeCollection.id;
      } else {
        throw new BadRequestException(
          'Aucune collection active trouvée. Veuillez activer une collection d\'abord.',
        );
      }
    } else {
      // Vérifier que la collection existe
      const collection = await this.collectionRepository.findOne({
        where: { id: collectionId },
      });
      if (!collection) {
        throw new BadRequestException(
          `Collection avec l'ID ${collectionId} non trouvée`,
        );
      }
    }

    const product = this.productRepository.create({
      ...productData,
      collectionId,
    });
    return this.productRepository.save(product);
  }

  /**
   * Mettre à jour un produit Reboul
   */
  async update(id: number | string, updateData: Partial<Product>) {
    const product = await this.findOne(id);

    Object.assign(product, updateData);
    return this.productRepository.save(product);
  }

  /**
   * Supprimer un produit Reboul
   */
  async remove(id: number | string) {
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
  async addImage(productId: number | string, imageData: { url: string; publicId?: string; alt?: string; order: number }) {
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
  async removeImage(productId: number | string, imageId: number | string) {
    const product = await this.findOne(productId);
    const numImageId = Number(imageId);
    const image = await this.imageRepository.findOne({
      where: { id: numImageId, productId: product.id },
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
  async updateImagesOrder(productId: number | string, images: Array<{ id: number | string; order: number }>) {
    const product = await this.findOne(productId);

    await Promise.all(
      images.map((img) =>
        this.imageRepository.update(
          { id: Number(img.id), productId: product.id },
          { order: img.order },
        ),
      ),
    );

    return this.findOne(product.id);
  }

  /**
   * Créer un produit avec ses images et variants
   */
  async createWithImages(productData: Partial<Product>, images?: Array<{ url: string; publicId?: string; alt?: string; order: number }>, variants?: Array<{ color: string; size: string; stock: number; sku: string }>) {
    const product = await this.create(productData);

    if (images && images.length > 0) {
      await Promise.all(
        images.map((img) =>
          this.addImage(product.id, img),
        ),
      );
    }

    if (variants && variants.length > 0) {
      for (const variant of variants) {
        const variantEntity = this.variantRepository.create({
          productId: product.id,
          color: variant.color,
          size: variant.size,
          stock: variant.stock,
          sku: variant.sku,
        });
        await this.variantRepository.save(variantEntity);
      }
    }

    return this.findOne(product.id);
  }

  /**
   * Upsert : si le produit (par reference) existe, met à jour le stock des variants existants
   * et crée les nouveaux variants. Sinon, crée le produit + variants.
   */
  async upsertWithVariants(
    productData: Partial<Product>,
    images: Array<{ url: string; publicId?: string; alt?: string; order: number }>,
    variants: Array<{ color: string; size: string; stock: number; sku: string }>,
  ): Promise<{ action: 'created' | 'updated'; product: Product; variantsCreated: number; variantsUpdated: number }> {
    const existing = productData.reference
      ? await this.productRepository.findOne({
          where: { reference: productData.reference },
          relations: ['variants'],
        })
      : null;

    if (existing) {
      let variantsCreated = 0;
      let variantsUpdated = 0;

      for (const v of variants) {
        const existingVariant = await this.variantRepository.findOne({
          where: { sku: v.sku },
        });
        if (existingVariant) {
          existingVariant.stock = v.stock;
          await this.variantRepository.save(existingVariant);
          variantsUpdated++;
        } else {
          const newVariant = this.variantRepository.create({
            productId: existing.id,
            color: v.color,
            size: v.size,
            stock: v.stock,
            sku: v.sku,
          });
          await this.variantRepository.save(newVariant);
          variantsCreated++;
        }
      }

      const product = await this.findOne(existing.id);
      return { action: 'updated', product, variantsCreated, variantsUpdated };
    }

    const product = await this.createWithImages(productData, images, variants);
    return { action: 'created', product, variantsCreated: variants.length, variantsUpdated: 0 };
  }

  /**
   * Mettre à jour un produit et ses images/variants
   */
  async updateWithImages(
    id: number | string,
    updateData: Partial<Product>,
    images?: Array<{ id?: number | string; url: string; publicId?: string; alt?: string; order: number }>,
    variants?: Array<{ id?: number | string; color: string; size: string; stock: number; sku: string }>,
  ) {
    await this.update(id, updateData);
    const product = await this.findOne(id);

    if (images !== undefined) {
      const existingImages = product.images || [];
      const newImageIds = images.filter((img) => img.id != null).map((img) => Number(img.id));
      const imagesToDelete = existingImages.filter((img) => !newImageIds.includes(img.id));

      if (imagesToDelete.length > 0) {
        await Promise.all(
          imagesToDelete.map((img) => this.imageRepository.remove(img)),
        );
      }

      await Promise.all(
        images.map(async (img) => {
          if (img.id != null) {
            await this.imageRepository.update(
              { id: Number(img.id), productId: product.id },
              { url: img.url, publicId: img.publicId || null, alt: img.alt || null, order: img.order },
            );
          } else {
            await this.addImage(product.id, img);
          }
        }),
      );
    }

    if (variants !== undefined) {
      const existingVariants = product.variants || [];
      const newVariantIds = variants.filter((v) => v.id != null).map((v) => Number(v.id));
      const variantsToDelete = existingVariants.filter((v) => !newVariantIds.includes(v.id));

      if (variantsToDelete.length > 0) {
        await Promise.all(
          variantsToDelete.map((v) => this.variantRepository.remove(v)),
        );
      }

      await Promise.all(
        variants.map(async (variant) => {
          if (variant.id != null) {
            const existingVariant = await this.variantRepository.findOne({
              where: { id: Number(variant.id), productId: product.id },
            });
            if (existingVariant) {
              existingVariant.color = variant.color;
              existingVariant.size = variant.size;
              existingVariant.stock = variant.stock;
              existingVariant.sku = variant.sku;
              await this.variantRepository.save(existingVariant);
            }
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

    return this.findOne(product.id);
  }

  /**
   * Importer des produits depuis un tableau collé (fiche Edite : Marque, Genre, Reference, Stock).
   * 1 ligne = 1 article = 1 variant. Taille extraite de la Reference. Prix = 0, nom = Reference (à compléter après).
   */
  async importFromPaste(pastedText: string): Promise<{ created: number; updated: number; errors: { row: number; message: string }[] }> {
    const errors: { row: number; message: string }[] = [];
    let created = 0;
    let updated = 0;

    const lines = pastedText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      throw new BadRequestException('Aucune ligne à importer.');
    }

    const detectDelimiter = (line: string): string => {
      if (line.includes('\t')) return '\t';
      if (line.includes(';')) return ';';
      return ',';
    };
    const delimiter = detectDelimiter(lines[0]);
    const splitRow = (line: string): string[] =>
      line.split(delimiter).map((c) => c.trim());

    const headerRow = splitRow(lines[0]).map((c) => c.toLowerCase());
    const iMarque = headerRow.findIndex((h) => /marque/i.test(h));
    const iGenre = headerRow.findIndex((h) => /genre/i.test(h));
    const iRef = headerRow.findIndex((h) => /reference|référence/i.test(h));
    const iStock = headerRow.findIndex((h) => /stock/i.test(h));
    const hasHeader = [iMarque, iGenre, iRef, iStock].some((i) => i >= 0);
    const dataStart = hasHeader && lines.length > 1 ? 1 : 0;
    const col = (row: string[], i: number, fallback: number): string =>
      (i >= 0 ? row[i] : row[fallback])?.trim() ?? '';
    const getMarque = (row: string[]) => col(row, iMarque, 0);
    const getGenre = (row: string[]) => col(row, iGenre, 1);
    const getRef = (row: string[]) => col(row, iRef, 2);
    const getStock = (row: string[]) => col(row, iStock, 3);

    const activeCollection = await this.collectionRepository.findOne({ where: { isActive: true } });
    if (!activeCollection) {
      throw new BadRequestException('Aucune collection active. Activez une collection dans Admin > Collections.');
    }

    for (let r = dataStart; r < lines.length; r++) {
      const row = splitRow(lines[r]);
      const marque = getMarque(row);
      const genre = getGenre(row);
      const reference = getRef(row);
      const stockStr = getStock(row);

      if (!reference) {
        errors.push({ row: r + 1, message: 'Reference manquante' });
        continue;
      }
      const stock = parseInt(stockStr, 10);
      if (isNaN(stock) || stock < 0) {
        errors.push({ row: r + 1, message: `Stock invalide: ${stockStr}` });
        continue;
      }

      let categoryId: number;
      if (genre) {
        const cat = await this.categoryRepository.findOne({
          where: { name: ILike(genre) },
        });
        if (!cat) {
          errors.push({ row: r + 1, message: `Catégorie non trouvée: "${genre}"` });
          continue;
        }
        categoryId = cat.id;
      } else {
        errors.push({ row: r + 1, message: 'Genre (catégorie) manquant' });
        continue;
      }

      let brandId: number | null = null;
      if (marque) {
        const brand = await this.brandRepository.findOne({
          where: { name: ILike(marque) },
        });
        if (brand) brandId = brand.id;
      }

      const size = reference.split(/[- ]/).pop() || reference;
      const sku = reference;

      const existingSku = await this.variantRepository.findOne({ where: { sku } });
      if (existingSku) {
        existingSku.stock = stock;
        await this.variantRepository.save(existingSku);
        updated++;
        continue;
      }

      try {
        const product = await this.create({
          name: reference,
          price: 0,
          categoryId,
          brandId,
          collectionId: activeCollection.id,
          reference,
        });
        const variantEntity = this.variantRepository.create({
          productId: product.id,
          color: '—',
          size,
          stock,
          sku,
        });
        await this.variantRepository.save(variantEntity);
        created++;
      } catch (e: any) {
        errors.push({ row: r + 1, message: e?.message || 'Erreur création produit' });
      }
    }

    return { created, updated, errors };
  }
}
