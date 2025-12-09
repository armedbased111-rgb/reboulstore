import { IsString, IsNotEmpty, IsOptional, MaxLength, IsObject } from 'class-validator';

export class CreateShopDto {
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

  @IsObject()
  @IsOptional()
  shippingPolicy?: {
    freeShippingThreshold?: number;
    deliveryTime?: string;
    internationalShipping?: boolean;
    shippingCost?: string;
    description?: string;
  };

  @IsObject()
  @IsOptional()
  returnPolicy?: {
    returnWindow?: number;
    returnShippingFree?: boolean;
    conditions?: string;
  };
}
