import { IsString, IsOptional, IsArray, ValidateNested, IsUrl, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO pour créer une catégorie
 */
export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SizeChartItem)
  sizeChart?: SizeChartItem[];
}

/**
 * Item du size chart
 */
export class SizeChartItem {
  @IsString()
  size: string;

  @IsNumber()
  @IsOptional()
  chest?: number;

  @IsNumber()
  @IsOptional()
  length?: number;

  @IsNumber()
  @IsOptional()
  waist?: number;

  @IsNumber()
  @IsOptional()
  hip?: number;
}
