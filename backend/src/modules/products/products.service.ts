import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { Repository, FindOptionsWhere, ILike, Between } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';
import { Collection } from '../../entities/collection.entity';
import { Brand } from '../../entities/brand.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { Variant } from '../../entities/variant.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Image } from '../../entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageOrderDto } from './dto/update-image-order.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

// Type pour les fichiers uploadés (basé sur multer)
interface MulterFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
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
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    private readonly cloudinaryService: CloudinaryService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(query: ProductQueryDto) {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    // Générer une clé de cache unique basée sur les paramètres de requête
    const cacheKey = `products:${JSON.stringify(query)}`;
    
    // Vérifier le cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Trouver la collection active
    const activeCollection = await this.collectionRepository.findOne({
      where: { isActive: true },
    });

    // Si aucune collection active, retourner un résultat vide (sécurité)
    if (!activeCollection) {
      return {
        products: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const where: FindOptionsWhere<Product> = {
      collectionId: activeCollection.id,
    };

    // Filtre par catégorie
    if (category) {
      const categoryId = typeof category === 'string' ? parseInt(category, 10) : category;
      if (!isNaN(categoryId)) where.categoryId = categoryId;
    }

    // Filtre par marque (accepte id ou slug)
    if (brand) {
      const brandIdNum = typeof brand === 'string' ? parseInt(brand, 10) : brand;
      if (!isNaN(brandIdNum)) {
        where.brandId = brandIdNum;
      } else {
        // C'est un slug, chercher la marque par slug
        const brandEntity = await this.brandRepository.findOne({
          where: { slug: brand as string },
        });
        
        if (brandEntity) {
          where.brandId = brandEntity.id;
        } else {
          // Marque non trouvée, retourner un résultat vide
          return {
            products: [],
            total: 0,
            page,
            limit,
            totalPages: 0,
          };
        }
      }
    }

    // Filtre par prix
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = Between(minPrice ?? 0, maxPrice ?? Number.MAX_SAFE_INTEGER);
    }

    // Recherche par nom ou description
    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [products, total] = await this.productRepository.findAndCount({
      where,
      relations: ['category', 'shop', 'brand', 'collection', 'images', 'variants'],
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

  async findOne(id: number): Promise<Product> {
    const cacheKey = `product:${id}`;
    
    // Vérifier le cache
    const cached = await this.cacheManager.get<Product>(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'shop', 'brand', 'collection', 'images', 'variants'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Mettre en cache le produit (TTL 5 minutes = 300 secondes)
    await this.cacheManager.set(cacheKey, product, 300);

    return product;
  }

  async findByCategory(categoryId: number, query: ProductQueryDto) {
    const {
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    // Trouver la collection active
    const activeCollection = await this.collectionRepository.findOne({
      where: { isActive: true },
    });

    // Si aucune collection active, retourner un résultat vide (sécurité)
    if (!activeCollection) {
      return {
        products: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const where: FindOptionsWhere<Product> = {
      categoryId,
      collectionId: activeCollection.id,
    };

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = Between(minPrice ?? 0, maxPrice ?? Number.MAX_SAFE_INTEGER);
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [products, total] = await this.productRepository.findAndCount({
      where,
      relations: ['category', 'shop', 'brand', 'collection', 'images', 'variants'],
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

    // Si collectionId n'est pas fourni, assigner à la collection active
    let collectionId = createProductDto.collectionId;
    if (!collectionId) {
      const activeCollection = await this.collectionRepository.findOne({
        where: { isActive: true },
      });
      if (activeCollection) {
        collectionId = activeCollection.id;
      } else {
        throw new BadRequestException(
          'No active collection found. Please activate a collection first.',
        );
      }
    } else {
      // Vérifier que la collection existe
      const collection = await this.collectionRepository.findOne({
        where: { id: collectionId },
      });
      if (!collection) {
        throw new NotFoundException(
          `Collection with ID ${collectionId} not found`,
        );
      }
    }

    const product = this.productRepository.create({
      ...createProductDto,
      collectionId,
    });
    const savedProduct = await this.productRepository.save(product);
    
    // Note: Le cache expire automatiquement après 5 minutes (TTL)
    // Pour une invalidation complète, on pourrait utiliser redis directement avec un pattern
    
    return savedProduct;
  }

  async update(
    id: number,
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

    // Si collectionId est fourni, vérifier qu'elle existe
    if (updateProductDto.collectionId) {
      const collection = await this.collectionRepository.findOne({
        where: { id: updateProductDto.collectionId },
      });

      if (!collection) {
        throw new NotFoundException(
          `Collection with ID ${updateProductDto.collectionId} not found`,
        );
      }
    }

    Object.assign(product, updateProductDto);
    const savedProduct = await this.productRepository.save(product);
    
    // Invalider le cache du produit spécifique
    await this.cacheManager.del(`product:${id}`);
    // Note: Le cache de la liste expire automatiquement après 5 minutes (TTL)
    
    return savedProduct;
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    
    // Invalider le cache du produit spécifique
    await this.cacheManager.del(`product:${id}`);
    // Note: Le cache de la liste expire automatiquement après 5 minutes (TTL)
  }

  async findVariantsByProduct(productId: number): Promise<Variant[]> {
    // Vérifier que le produit existe
    await this.findOne(productId);

    return this.variantRepository.find({
      where: { productId },
      order: { color: 'ASC', size: 'ASC' },
    });
  }

  async findVariantById(id: number): Promise<Variant> {
    const variant = await this.variantRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    return variant;
  }

  async createVariant(
    productId: number,
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
    id: number,
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

  async checkStock(
    variantId: number,
    quantity: number,
  ): Promise<{
    available: boolean;
    variantId: number;
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

  async updateStock(variantId: number, quantity: number): Promise<Variant> {
    const variant = await this.findVariantById(variantId);

    if (variant.stock + quantity < 0) {
      throw new BadRequestException('Stock insuffisant');
    }

    variant.stock += quantity;
    return this.variantRepository.save(variant);
  }

  async findImagesByProduct(productId: number): Promise<Image[]> {
    // Vérifier que le produit existe
    await this.findOne(productId);

    return this.imageRepository.find({
      where: { productId },
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async createImage(
    productId: number,
    file: MulterFile,
    createImageDto: CreateImageDto,
  ): Promise<Image> {
    // Vérifier que le produit existe
    await this.findOne(productId);

    // Uploader l'image sur Cloudinary
    const uploadResult = await this.cloudinaryService.uploadImage(
      {
        buffer: file.buffer,
        mimetype: file.mimetype,
        originalname: file.originalname,
      },
      {
        folder: 'products',
      },
    );

    const lastImage = await this.imageRepository.findOne({
      where: { productId },
      order: { order: 'DESC' },
    });

    const order = createImageDto.order ?? (lastImage ? lastImage.order + 1 : 0);

    const image = this.imageRepository.create({
      productId,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      alt: createImageDto.alt || null,
      order,
    });

    return this.imageRepository.save(image);
  }

  async createImagesBulk(
    productId: number,
    files: MulterFile[],
    createImageDtos: CreateImageDto[],
  ): Promise<Image[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image file is required');
    }

    if (files.length > 7) {
      throw new BadRequestException('You can upload up to 7 images at once');
    }

    // Vérifier que le produit existe
    await this.findOne(productId);

    const lastImage = await this.imageRepository.findOne({
      where: { productId },
      order: { order: 'DESC' },
    });

    let nextOrder = lastImage ? lastImage.order + 1 : 0;

    const createdImages: Image[] = [];

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const dto = createImageDtos[i] ?? {};

      // Vérification taille max 10MB par image
      if (file.size > 10 * 1024 * 1024) {
        throw new BadRequestException(
          `File ${file.originalname} exceeds the 10MB size limit`,
        );
      }

      const uploadResult = await this.cloudinaryService.uploadImage(
        {
          buffer: file.buffer,
          mimetype: file.mimetype,
          originalname: file.originalname,
        },
        {
          folder: 'products',
        },
      );

      const order =
        dto.order !== undefined && dto.order !== null
          ? dto.order
          : nextOrder;

      if (dto.order === undefined || dto.order === null) {
        nextOrder += 1;
      }

      const image = this.imageRepository.create({
        productId,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        alt: dto.alt || null,
        order,
      });

      const savedImage = await this.imageRepository.save(image);
      createdImages.push(savedImage);
    }

    return createdImages;
  }

  async deleteImage(id: number): Promise<void> {
    const image = await this.imageRepository.findOne({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    // Supprimer l'image de Cloudinary si un publicId est présent
    if (image.publicId) {
      await this.cloudinaryService.deleteImage(image.publicId);
    }

    // Supprimer l'entrée en base de données
    await this.imageRepository.remove(image);
  }

  async updateImageOrder(
    id: number,
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
