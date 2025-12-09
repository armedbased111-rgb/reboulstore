import { IsString, IsNotEmpty, IsOptional, MaxLength, IsArray } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  imageUrl?: string;

  // Size chart par défaut pour cette catégorie
  @IsArray()
  @IsOptional()
  sizeChart?: Array<{
    size: string;
    chest?: number;
    length?: number;
    waist?: number;
    hip?: number;
  }>;
}