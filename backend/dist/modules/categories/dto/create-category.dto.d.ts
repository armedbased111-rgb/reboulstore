export declare class CreateCategoryDto {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    videoUrl?: string;
    sizeChart?: Array<{
        size: string;
        chest?: number;
        length?: number;
        waist?: number;
        hip?: number;
    }>;
}
