import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  IsArray,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @IsInt()
  @IsOptional()
  shopId?: number;

  @IsInt()
  @IsOptional()
  brandId?: number;

  @IsInt()
  @IsOptional()
  collectionId?: number;

  // Informations spécifiques au produit
  @IsString()
  @IsOptional()
  materials?: string;

  @IsString()
  @IsOptional()
  careInstructions?: string;

  @IsString()
  @IsOptional()
  madeIn?: string;

  // Size chart custom (override celui de la catégorie)
  @IsArray()
  @IsOptional()
  customSizeChart?: Array<{
    size: string;
    chest?: number;
    length?: number;
    waist?: number;
    hip?: number;
  }>;
}
