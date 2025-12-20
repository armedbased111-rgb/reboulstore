import { IsString, IsOptional, IsUrl } from 'class-validator';

/**
 * DTO pour créer une marque
 */
export class CreateBrandDto {
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
  logoUrl?: string;

  @IsUrl()
  @IsOptional()
  megaMenuImage1?: string;

  @IsUrl()
  @IsOptional()
  megaMenuImage2?: string;

  @IsUrl()
  @IsOptional()
  megaMenuVideo1?: string;

  @IsUrl()
  @IsOptional()
  megaMenuVideo2?: string;
}
