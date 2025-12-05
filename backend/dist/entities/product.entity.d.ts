import { Category } from './category.entity';
import { Image } from './image.entity';
import { Variant } from './variant.entity';
export declare class Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    categoryId: string;
    category: Category;
    images: Image[];
    variants: Variant[];
    createdAt: Date;
    updatedAt: Date;
}
