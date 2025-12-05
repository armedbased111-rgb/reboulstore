import { Product } from './product.entity';
export declare class Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
