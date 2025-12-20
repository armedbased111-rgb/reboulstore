import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { Product } from './entities/product.entity';
export declare class ReboulBrandsService {
    private brandRepository;
    private productRepository;
    constructor(brandRepository: Repository<Brand>, productRepository: Repository<Product>);
    findAll(page?: number, limit?: number, filters?: {
        search?: string;
    }): Promise<{
        data: {
            productsCount: number;
            id: string;
            name: string;
            slug: string;
            description: string | null;
            logoUrl: string | null;
            megaMenuImage1: string | null;
            megaMenuImage2: string | null;
            megaMenuVideo1: string | null;
            megaMenuVideo2: string | null;
            products: Product[];
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
        logoUrl: string | null;
        megaMenuImage1: string | null;
        megaMenuImage2: string | null;
        megaMenuVideo1: string | null;
        megaMenuVideo2: string | null;
        products: Product[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(brandData: Partial<Brand>): Promise<Brand>;
    update(id: string, updateData: Partial<Brand>): Promise<{
        productsCount: number;
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        megaMenuImage1: string | null;
        megaMenuImage2: string | null;
        megaMenuVideo1: string | null;
        megaMenuVideo2: string | null;
        products: Product[];
        createdAt: Date;
        updatedAt: Date;
    } & Brand>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        brandId: string;
        brandName: string;
        productsCount: number;
    }[]>;
}
