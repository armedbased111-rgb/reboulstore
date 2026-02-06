import { Category } from './category.entity';
import { Image } from './image.entity';
import { Variant } from './variant.entity';
import { Shop } from './shop.entity';
import { Brand } from './brand.entity';
import { Collection } from './collection.entity';
export declare class Product {
    id: number;
    name: string;
    reference: string | null;
    description: string | null;
    price: number;
    categoryId: number;
    category: Category;
    shopId: number | null;
    shop: Shop | null;
    brandId: number | null;
    brand: Brand | null;
    collectionId: number | null;
    collection: Collection | null;
    isPublished: boolean;
    images: Image[];
    variants: Variant[];
    variantsData: string | null;
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
