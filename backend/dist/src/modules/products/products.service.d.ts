import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';
import { Collection } from '../../entities/collection.entity';
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
    private readonly cloudinaryService;
    constructor(productRepository: Repository<Product>, categoryRepository: Repository<Category>, variantRepository: Repository<Variant>, imageRepository: Repository<Image>, collectionRepository: Repository<Collection>, cloudinaryService: CloudinaryService);
    findAll(query: ProductQueryDto): Promise<{
        products: Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Product>;
    findByCategory(categoryId: string, query: ProductQueryDto): Promise<{
        products: Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    create(createProductDto: CreateProductDto): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
    findVariantsByProduct(productId: string): Promise<Variant[]>;
    findVariantById(id: string): Promise<Variant>;
    createVariant(productId: string, createVariantDto: CreateVariantDto): Promise<Variant>;
    updateVariant(id: string, updateVariantDto: UpdateVariantDto): Promise<Variant>;
    checkStock(variantId: string, quantity: number): Promise<{
        available: boolean;
        variantId: string;
        currentStock: number;
        requestedQuantity: number;
    }>;
    updateStock(variantId: string, quantity: number): Promise<Variant>;
    findImagesByProduct(productId: string): Promise<Image[]>;
    createImage(productId: string, file: MulterFile, createImageDto: CreateImageDto): Promise<Image>;
    createImagesBulk(productId: string, files: MulterFile[], createImageDtos: CreateImageDto[]): Promise<Image[]>;
    deleteImage(id: string): Promise<void>;
    updateImageOrder(id: string, updateOrderDto: UpdateImageOrderDto): Promise<Image>;
}
export {};
