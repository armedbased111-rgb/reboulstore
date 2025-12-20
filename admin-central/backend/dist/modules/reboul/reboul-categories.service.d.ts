import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
export declare class ReboulCategoriesService {
    private categoryRepository;
    private productRepository;
    constructor(categoryRepository: Repository<Category>, productRepository: Repository<Product>);
    findAll(page?: number, limit?: number, filters?: {
        search?: string;
    }): Promise<{
        data: {
            productsCount: number;
            id: string;
            name: string;
            slug: string;
            description: string | null;
            products: Product[];
            imageUrl: string | null;
            videoUrl: string | null;
            sizeChart: Array<{
                size: string;
                chest?: number;
                length?: number;
                waist?: number;
                hip?: number;
            }> | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        productsCount: number;
        id: string;
        name: string;
        slug: string;
        description: string | null;
        products: Product[];
        imageUrl: string | null;
        videoUrl: string | null;
        sizeChart: Array<{
            size: string;
            chest?: number;
            length?: number;
            waist?: number;
            hip?: number;
        }> | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(categoryData: Partial<Category>): Promise<Category>;
    update(id: string, updateData: Partial<Category>): Promise<{
        productsCount: number;
        id: string;
        name: string;
        slug: string;
        description: string | null;
        products: Product[];
        imageUrl: string | null;
        videoUrl: string | null;
        sizeChart: Array<{
            size: string;
            chest?: number;
            length?: number;
            waist?: number;
            hip?: number;
        }> | null;
        createdAt: Date;
        updatedAt: Date;
    } & Category>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
