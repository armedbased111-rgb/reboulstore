import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  variantId: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;
}
