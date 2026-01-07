import { DiscountType } from '../../../entities/coupon.entity';

export class CouponResponseDto {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expiresAt: Date | null;
  maxUses: number;
  usedCount: number;
  minPurchaseAmount: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

