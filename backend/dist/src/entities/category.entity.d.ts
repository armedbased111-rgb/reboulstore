import { Product } from './product.entity';
export declare class Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    products: Product[];
    imageUrl: string | null;
    videoUrl: string | null;
    sizeChart: Array<{
        size: string;
        chest?: number;
        length?: number;
        waist?: number;
        hip?: number;
    }> | null;
    createdAt: Date;
    updatedAt: Date;
}
