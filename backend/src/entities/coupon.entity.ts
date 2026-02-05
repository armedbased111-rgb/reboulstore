import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
}

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: DiscountType,
    default: DiscountType.PERCENTAGE,
    name: 'discount_type',
  })
  discountType: DiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'discount_value' })
  discountValue: number;

  @Column({ type: 'timestamp', nullable: true, name: 'expires_at' })
  expiresAt: Date | null;

  @Column({ type: 'int', default: 0, name: 'max_uses' })
  maxUses: number;

  @Column({ type: 'int', default: 0, name: 'used_count' })
  usedCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'min_purchase_amount' })
  minPurchaseAmount: number | null;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

