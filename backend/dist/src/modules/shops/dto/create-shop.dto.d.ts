export declare class CreateShopDto {
    name: string;
    slug: string;
    description?: string;
    shippingPolicy?: {
        freeShippingThreshold?: number;
        deliveryTime?: string;
        internationalShipping?: boolean;
        shippingCost?: string;
        description?: string;
    };
    returnPolicy?: {
        returnWindow?: number;
        returnShippingFree?: boolean;
        conditions?: string;
    };
}
