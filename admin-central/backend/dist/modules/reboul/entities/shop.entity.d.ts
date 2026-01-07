import { Product } from './product.entity';
export declare class Shop {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    shippingPolicy: {
        freeShippingThreshold?: number;
        deliveryTime?: string;
        internationalShipping?: boolean;
        standardShipping?: {
            cost: number;
            name?: string;
            description?: string;
        };
        expressShipping?: {
            cost: number;
            name?: string;
            description?: string;
        };
        description?: string;
    } | null;
    returnPolicy: {
        returnWindow?: number;
        returnShippingFree?: boolean;
        conditions?: string;
    } | null;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
