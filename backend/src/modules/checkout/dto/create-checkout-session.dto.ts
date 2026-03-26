import {
  IsArray,
  IsInt,
  Min,
  ValidateNested,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class CheckoutItemDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  variantId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateCheckoutSessionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];

  @IsString()
  @IsOptional()
  couponCode?: string;
}
