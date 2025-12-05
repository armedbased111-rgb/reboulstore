import { Product } from './product.entity';
export declare class Image {
    id: string;
    productId: string;
    url: string;
    alt: string | null;
    order: number;
    product: Product;
    createdAt: Date;
}
