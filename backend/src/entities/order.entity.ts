import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { User } from './user.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  CONFIRMED = 'confirmed', // @deprecated - Utiliser PAID ou PROCESSING à la place
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true, name: 'cart_id' })
  cartId: number | null;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'jsonb', name: 'customer_info' })
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
  };

  @ManyToOne(() => Cart)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column({ type: 'int', nullable: true, name: 'user_id' })
  userId: number | null;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'jsonb', nullable: true, name: 'shipping_address' })
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  } | null;

  @Column({ type: 'jsonb', nullable: true, name: 'billing_address' })
  billingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  } | null;

  // Paiement Stripe
  @Column({ nullable: true, name: 'payment_intent_id' })
  paymentIntentId: string;

  // Items de la commande (stockés pour les commandes depuis Stripe Checkout sans cart)
  @Column({ type: 'jsonb', nullable: true })
  items: Array<{
    variantId: number;
    quantity: number;
  }> | null;

  // Suivi colis
  @Column({ nullable: true, name: 'tracking_number' })
  trackingNumber: string;

  // Code promo
  @Column({ type: 'int', nullable: true, name: 'coupon_id' })
  couponId: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'discount_amount' })
  discountAmount: number | null;

  // Dates de suivi
  @Column({ type: 'timestamp', nullable: true, name: 'paid_at' })
  paidAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'shipped_at' })
  shippedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'delivered_at' })
  deliveredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
