import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Variant } from './entities/variant.entity';
import { Image } from './entities/image.entity';
import { Brand } from './entities/brand.entity';
import { Collection } from './entities/collection.entity';
export declare class ReboulProductsService {
    private productRepository;
    private categoryRepository;
    private variantRepository;
    private imageRepository;
    private brandRepository;
    private collectionRepository;
    constructor(productRepository: Repository<Product>, categoryRepository: Repository<Category>, variantRepository: Repository<Variant>, imageRepository: Repository<Image>, brandRepository: Repository<Brand>, collectionRepository: Repository<Collection>);
    findAll(page?: number, limit?: number, filters?: {
        categoryId?: string;
        brandId?: string;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<{
        data: Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Product>;
    create(productData: Partial<Product>): Promise<Product>;
    update(id: string, updateData: Partial<Product>): Promise<Product>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getCategories(): Promise<Category[]>;
    getBrands(): Promise<Brand[]>;
    getStats(): Promise<{
        total: number;
        withStock: number;
        outOfStock: number;
    }>;
    addImage(productId: string, imageData: {
        url: string;
        publicId?: string;
        alt?: string;
        order: number;
    }): Promise<Image>;
    removeImage(productId: string, imageId: string): Promise<{
        message: string;
    }>;
    updateImagesOrder(productId: string, images: Array<{
        id: string;
        order: number;
    }>): Promise<Product>;
    createWithImages(productData: Partial<Product>, images?: Array<{
        url: string;
        publicId?: string;
        alt?: string;
        order: number;
    }>, variants?: Array<{
        color: string;
        size: string;
        stock: number;
        sku: string;
    }>): Promise<Product>;
    updateWithImages(id: string, updateData: Partial<Product>, images?: Array<{
        id?: string;
        url: string;
        publicId?: string;
        alt?: string;
        order: number;
    }>, variants?: Array<{
        id?: string;
        color: string;
        size: string;
        stock: number;
        sku: string;
    }>): Promise<Product>;
}
