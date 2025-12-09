import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, Min, IsArray } from 'class-validator';

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

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsUUID()
  @IsOptional()
  shopId?: string;

  @IsUUID()
  @IsOptional()
  brandId?: string;

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