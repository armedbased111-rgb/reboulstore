export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    categoryId: number;
    shopId?: number;
    brandId?: number;
    collectionId?: number;
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
