export declare class ProductQueryDto {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'price' | 'createdAt';
    sortOrder?: 'ASC' | 'DESC';
}
