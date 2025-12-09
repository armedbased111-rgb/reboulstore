import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateBrandDto {
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
  logoUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  megaMenuImage1?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  megaMenuImage2?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  megaMenuVideo1?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  megaMenuVideo2?: string;
}
