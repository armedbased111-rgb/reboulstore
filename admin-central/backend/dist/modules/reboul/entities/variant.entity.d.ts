import { Product } from './product.entity';
export declare class Variant {
    id: string;
    productId: string;
    color: string;
    size: string;
    stock: number;
    sku: string;
    product: Product;
    createdAt: Date;
    updatedAt: Date;
}
