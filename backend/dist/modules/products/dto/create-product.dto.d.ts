export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    shopId?: string;
    materials?: string;
    careInstructions?: string;
    madeIn?: string;
    customSizeChart?: Array<{
        size: string;
        chest?: number;
        length?: number;
        waist?: number;
        hip?: number;
    }>;
}
