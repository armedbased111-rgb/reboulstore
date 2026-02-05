import type { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
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
interface MulterFile {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
    size: number;
}
export declare class ProductsService {
    private productRepository;
    private categoryRepository;
    private variantRepository;
    private imageRepository;
    private collectionRepository;
    private brandRepository;
    private readonly cloudinaryService;
    private cacheManager;
    constructor(productRepository: Repository<Product>, categoryRepository: Repository<Category>, variantRepository: Repository<Variant>, imageRepository: Repository<Image>, collectionRepository: Repository<Collection>, brandRepository: Repository<Brand>, cloudinaryService: CloudinaryService, cacheManager: Cache);
    findAll(query: ProductQueryDto): Promise<{}>;
    findOne(id: number): Promise<Product>;
    findByCategory(categoryId: number, query: ProductQueryDto): Promise<{
        products: Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    create(createProductDto: CreateProductDto): Promise<Product>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<void>;
    findVariantsByProduct(productId: number): Promise<Variant[]>;
    findVariantById(id: number): Promise<Variant>;
    createVariant(productId: number, createVariantDto: CreateVariantDto): Promise<Variant>;
    updateVariant(id: number, updateVariantDto: UpdateVariantDto): Promise<Variant>;
    checkStock(variantId: number, quantity: number): Promise<{
        available: boolean;
        variantId: number;
        currentStock: number;
        requestedQuantity: number;
    }>;
    updateStock(variantId: number, quantity: number): Promise<Variant>;
    findImagesByProduct(productId: number): Promise<Image[]>;
    createImage(productId: number, file: MulterFile, createImageDto: CreateImageDto): Promise<Image>;
    createImagesBulk(productId: number, files: MulterFile[], createImageDtos: CreateImageDto[]): Promise<Image[]>;
    deleteImage(id: number): Promise<void>;
    updateImageOrder(id: number, updateOrderDto: UpdateImageOrderDto): Promise<Image>;
}
export {};
