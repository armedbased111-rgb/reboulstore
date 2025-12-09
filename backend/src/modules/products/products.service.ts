import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, Between } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { Variant } from '../../entities/variant.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Image } from '../../entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageOrderDto } from './dto/update-image-order.dto';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

// Type pour les fichiers uploadés (basé sur multer)
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async findAll(query: ProductQueryDto) {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const where: FindOptionsWhere<Product> = {};

    // Filtre par catégorie
    if (category) {
      where.categoryId = category;
    }

    // Filtre par prix
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = Between(
        minPrice ?? 0,
        maxPrice ?? Number.MAX_SAFE_INTEGER,
      );
    }

    // Recherche par nom ou description
    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [products, total] = await this.productRepository.findAndCount({
      where,
      relations: ['category', 'shop', 'images', 'variants'],
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'shop', 'images', 'variants'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findByCategory(categoryId: string, query: ProductQueryDto) {
    const {
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const where: FindOptionsWhere<Product> = {
      categoryId,
    };

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = Between(
        minPrice ?? 0,
        maxPrice ?? Number.MAX_SAFE_INTEGER,
      );
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [products, total] = await this.productRepository.findAndCount({
      where,
      relations: ['category', 'shop', 'images', 'variants'],
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Vérifier que la catégorie existe
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createProductDto.categoryId} not found`,
      );
    }

    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // Si categoryId est fourni, vérifier qu'elle existe
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateProductDto.categoryId} not found`,
        );
      }
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async findVariantsByProduct(productId: string): Promise<Variant[]> {
    // Vérifier que le produit existe
    await this.findOne(productId);
    
    return this.variantRepository.find({
      where: { productId },
      order: { color: 'ASC', size: 'ASC' },
    });
  }

  async findVariantById(id: string): Promise<Variant> {
    const variant = await this.variantRepository.findOne({
        where : { id },
        relations: ['product'],
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    return variant;
  }

  async createVariant(
    productId: string,
    createVariantDto: CreateVariantDto,
  ): Promise<Variant> {
    // Vérifier que le produit existe
    await this.findOne(productId);

    // Vérifier l'unicité du SKU
    const existingVariant = await this.variantRepository.findOne({
      where: { sku: createVariantDto.sku },
    });

    if (existingVariant) {
      throw new BadRequestException(
        `Variant with SKU ${createVariantDto.sku} already exists`,
      );
    }

    const variant = this.variantRepository.create({
      ...createVariantDto,
      productId,
    });
    return this.variantRepository.save(variant);
  }

  async updateVariant(
  id: string,
  updateVariantDto: UpdateVariantDto,
): Promise<Variant> {
  const variant = await this.findVariantById(id);

  // Si SKU est fourni, vérifier qu'il n'existe pas déjà (sauf pour cette variante)
  if (updateVariantDto.sku) {
    const existingVariant = await this.variantRepository.findOne({
      where: { sku: updateVariantDto.sku },
    });

    if (existingVariant && existingVariant.id !== id) {
      throw new BadRequestException(
        `Variant with SKU ${updateVariantDto.sku} already exists`,
      );
    }
  }
    Object.assign(variant, updateVariantDto);
    return this.variantRepository.save(variant);
}

async checkStock(variantId: string, quantity: number): Promise<{
  available: boolean;
  variantId: string;
  currentStock: number;
  requestedQuantity: number;
}> {
  const variant = await this.findVariantById(variantId);
  return {
    available: variant.stock >= quantity,
    variantId: variant.id,
    currentStock: variant.stock,
    requestedQuantity: quantity,
  };
}

async updateStock(variantId: string, quantity: number): Promise<Variant> {
    const variant = await this.findVariantById(variantId);

    if (variant.stock + quantity < 0) {
        throw new BadRequestException('Stock insuffisant');
    }

    variant.stock += quantity;
    return this.variantRepository.save(variant);
  }

  async findImagesByProduct(productId: string): Promise<Image[]> {
    // Vérifier que le produit existe
    await this.findOne(productId);

    return this.imageRepository.find({
      where: { productId },
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async createImage(
    productId: string,
    file: MulterFile,
    createImageDto: CreateImageDto,
  ): Promise<Image> {
    // Vérifier que le produit existe
    await this.findOne(productId);

    // Construire l'URL relative du fichier
    const fileUrl = `/uploads/${file.filename}`;

    // Récupérer le dernier ordre pour ce produit
    const lastImage = await this.imageRepository.findOne({
      where: { productId },
      order: { order: 'DESC' },
    });

    const order = createImageDto.order ?? (lastImage ? lastImage.order + 1 : 0);

    const image = this.imageRepository.create({
      productId,
      url: fileUrl,
      alt: createImageDto.alt || null,
      order,
    });

    return this.imageRepository.save(image);
  }

  async deleteImage(id: string): Promise<void> {
    const image = await this.imageRepository.findOne({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    // Supprimer le fichier physique
    const filePath = join(process.cwd(), image.url);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    // Supprimer l'entrée en base de données
    await this.imageRepository.remove(image);
  }

  async updateImageOrder(
    id: string,
    updateOrderDto: UpdateImageOrderDto,
  ): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    image.order = updateOrderDto.order;
    return this.imageRepository.save(image);
  }

}