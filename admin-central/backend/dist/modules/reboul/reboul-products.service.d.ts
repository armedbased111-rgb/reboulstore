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
        categoryId?: number | string;
        brandId?: number | string;
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
    findOne(id: number | string): Promise<Product>;
    create(productData: Partial<Product>): Promise<Product>;
    update(id: number | string, updateData: Partial<Product>): Promise<Product>;
    remove(id: number | string): Promise<{
        message: string;
    }>;
    getCategories(): Promise<Category[]>;
    getBrands(): Promise<Brand[]>;
    getStats(): Promise<{
        total: number;
        withStock: number;
        outOfStock: number;
    }>;
    addImage(productId: number | string, imageData: {
        url: string;
        publicId?: string;
        alt?: string;
        order: number;
    }): Promise<Image>;
    removeImage(productId: number | string, imageId: number | string): Promise<{
        message: string;
    }>;
    updateImagesOrder(productId: number | string, images: Array<{
        id: number | string;
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
    upsertWithVariants(productData: Partial<Product>, images: Array<{
        url: string;
        publicId?: string;
        alt?: string;
        order: number;
    }>, variants: Array<{
        color: string;
        size: string;
        stock: number;
        sku: string;
    }>): Promise<{
        action: 'created' | 'updated';
        product: Product;
        variantsCreated: number;
        variantsUpdated: number;
    }>;
    updateWithImages(id: number | string, updateData: Partial<Product>, images?: Array<{
        id?: number | string;
        url: string;
        publicId?: string;
        alt?: string;
        order: number;
    }>, variants?: Array<{
        id?: number | string;
        color: string;
        size: string;
        stock: number;
        sku: string;
    }>): Promise<Product>;
    importFromPaste(pastedText: string): Promise<{
        created: number;
        updated: number;
        errors: {
            row: number;
            message: string;
        }[];
    }>;
}
