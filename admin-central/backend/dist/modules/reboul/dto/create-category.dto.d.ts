export declare class CreateCategoryDto {
    name: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    videoUrl?: string;
    sizeChart?: SizeChartItem[];
}
export declare class SizeChartItem {
    size: string;
    chest?: number;
    length?: number;
    waist?: number;
    hip?: number;
}
