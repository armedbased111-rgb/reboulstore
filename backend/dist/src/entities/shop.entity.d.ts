import { Product } from './product.entity';
export declare class Shop {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    shippingPolicy: {
        freeShippingThreshold?: number;
        deliveryTime?: string;
        internationalShipping?: boolean;
        shippingCost?: string;
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
