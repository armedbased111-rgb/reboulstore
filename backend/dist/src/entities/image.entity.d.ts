import { Product } from './product.entity';
export declare class Image {
    id: number;
    productId: number;
    url: string;
    publicId: string | null;
    alt: string | null;
    order: number;
    product: Product;
    createdAt: Date;
}
