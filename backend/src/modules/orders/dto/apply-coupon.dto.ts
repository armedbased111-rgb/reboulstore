import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ApplyCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsUUID()
  @IsNotEmpty()
  cartId: string;
}

