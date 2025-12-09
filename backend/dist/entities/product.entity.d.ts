import { Category } from './category.entity';
import { Image } from './image.entity';
import { Variant } from './variant.entity';
import { Shop } from './shop.entity';
export declare class Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    categoryId: string;
    category: Category;
    shopId: string | null;
    shop: Shop | null;
    images: Image[];
    variants: Variant[];
    materials: string | null;
    careInstructions: string | null;
    madeIn: string | null;
    customSizeChart: Array<{
        size: string;
        chest?: number;
        length?: number;
        waist?: number;
        hip?: number;
    }> | null;
    createdAt: Date;
    updatedAt: Date;
}
