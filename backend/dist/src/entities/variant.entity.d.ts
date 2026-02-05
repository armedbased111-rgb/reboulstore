import { Product } from './product.entity';
export declare class Variant {
    id: number;
    productId: number;
    color: string;
    size: string;
    stock: number;
    sku: string;
    product: Product;
    createdAt: Date;
    updatedAt: Date;
}
