import { IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @IsUUID()
  variantId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;
}
