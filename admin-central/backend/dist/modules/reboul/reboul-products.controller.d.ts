import { ReboulProductsService } from './reboul-products.service';
export declare class ReboulProductsController {
    private readonly productsService;
    constructor(productsService: ReboulProductsService);
    findAll(page: number, limit: number, categoryId?: string, brandId?: string, search?: string, minPrice?: string, maxPrice?: string): Promise<{
        data: import("./entities/product.entity").Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getCategories(): Promise<import("./entities/category.entity").Category[]>;
    getBrands(): Promise<import("./entities/brand.entity").Brand[]>;
    getStats(): Promise<{
        total: number;
        withStock: number;
        outOfStock: number;
    }>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
    importFromPaste(body: {
        pastedText: string;
    }): Promise<{
        created: number;
        updated: number;
        errors: {
            row: number;
            message: string;
        }[];
    }>;
    create(createProductDto: any): Promise<import("./entities/product.entity").Product>;
    update(id: string, updateProductDto: any): Promise<import("./entities/product.entity").Product>;
    addImage(productId: string, imageData: {
        url: string;
        publicId?: string;
        alt?: string;
        order: number;
    }): Promise<import("./entities/image.entity").Image>;
    removeImage(productId: string, imageId: string): Promise<{
        message: string;
    }>;
    updateImagesOrder(productId: string, body: {
        images: Array<{
            id: string;
            order: number;
        }>;
    }): Promise<import("./entities/product.entity").Product>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
