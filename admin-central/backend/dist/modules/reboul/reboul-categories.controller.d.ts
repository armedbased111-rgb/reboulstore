import { ReboulCategoriesService } from './reboul-categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class ReboulCategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: ReboulCategoriesService);
    findAll(page: number, limit: number, search?: string): Promise<{
        data: {
            productsCount: number;
            id: string;
            name: string;
            slug: string;
            description: string | null;
            products: import("./entities/product.entity").Product[];
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
        products: import("./entities/product.entity").Product[];
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
    create(createCategoryDto: CreateCategoryDto): Promise<import("./entities/category.entity").Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        productsCount: number;
        id: string;
        name: string;
        slug: string;
        description: string | null;
        products: import("./entities/product.entity").Product[];
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
    } & import("./entities/category.entity").Category>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
