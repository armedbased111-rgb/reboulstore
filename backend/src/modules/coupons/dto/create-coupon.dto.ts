import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { DiscountType } from '../../../entities/coupon.entity';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(DiscountType)
  discountType: DiscountType;

  @IsNumber()
  @Min(0)
  discountValue: number;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxUses?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minPurchaseAmount?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

