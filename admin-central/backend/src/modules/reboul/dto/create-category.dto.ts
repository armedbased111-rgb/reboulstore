import { IsString, IsOptional, IsArray, ValidateNested, IsUrl, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';

const emptyStrToUndefined = ({ value }: { value: unknown }) =>
  value === '' ? undefined : value;

/**
 * DTO pour créer une catégorie
 */
export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  @Transform(emptyStrToUndefined)
  slug?: string;

  @IsString()
  @IsOptional()
  @Transform(emptyStrToUndefined)
  description?: string;

  @IsUrl()
  @IsOptional()
  @Transform(emptyStrToUndefined)
  imageUrl?: string;

  @IsUrl()
  @IsOptional()
  @Transform(emptyStrToUndefined)
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
