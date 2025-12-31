import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
      where.categoryId = category;
    }

    // Filtre par marque (accepte UUID ou slug)
    if (brand) {
      // Vérifier si c'est un UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(brand);
      
      if (isUUID) {
        // C'est un UUID, utiliser directement
        where.brandId = brand;
      } else {
        // C'est un slug, chercher la marque par slug
        const brandEntity = await this.brandRepository.findOne({
          where: { slug: brand },
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

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'shop', 'brand', 'collection', 'images', 'variants'],
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
      where: { id },
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

  async checkStock(
    variantId: string,
    quantity: number,
  ): Promise<{
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

    // Récupérer le dernier ordre pour ce produit
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
    productId: string,
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

    // Récupérer le dernier ordre pour ce produit
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

  async deleteImage(id: string): Promise<void> {
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
