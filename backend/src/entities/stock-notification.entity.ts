import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Variant } from './variant.entity';

/**
 * Entité StockNotification
 * Permet aux utilisateurs de s'inscrire pour être notifiés quand un produit revient en stock
 */
@Entity('stock_notifications')
export class StockNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'product_id' })
  productId: number;

  @Column({ type: 'int', nullable: true, name: 'variant_id' })
  variantId: number | null;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'boolean', default: false, name: 'is_notified' })
  isNotified: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'notified_at' })
  notifiedAt: Date | null;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Variant, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'variant_id' })
  variant: Variant | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

