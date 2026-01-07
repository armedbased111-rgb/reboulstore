import { Category } from './category.entity';
import { Image } from './image.entity';
import { Variant } from './variant.entity';
import { Shop } from './shop.entity';
import { Brand } from './brand.entity';
import { Collection } from './collection.entity';
export declare class Product {
    id: string;
    name: string;
    reference: string | null;
    description: string | null;
    price: number;
    categoryId: string;
    category: Category;
    shopId: string | null;
    shop: Shop | null;
    brandId: string | null;
    brand: Brand | null;
    collectionId: string | null;
    collection: Collection | null;
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
