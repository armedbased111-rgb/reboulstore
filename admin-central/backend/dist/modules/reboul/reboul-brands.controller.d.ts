import { ReboulBrandsService } from './reboul-brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class ReboulBrandsController {
    private readonly brandsService;
    constructor(brandsService: ReboulBrandsService);
    findAll(page: number, limit: number, search?: string): Promise<{
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
            products: import("./entities/product.entity").Product[];
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
        products: import("./entities/product.entity").Product[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(createBrandDto: CreateBrandDto): Promise<import("./entities/brand.entity").Brand>;
    update(id: string, updateBrandDto: UpdateBrandDto): Promise<{
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
        products: import("./entities/product.entity").Product[];
        createdAt: Date;
        updatedAt: Date;
    } & import("./entities/brand.entity").Brand>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
