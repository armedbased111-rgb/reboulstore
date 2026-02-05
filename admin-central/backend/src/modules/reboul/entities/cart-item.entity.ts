import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Variant } from './variant.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'cart_id' })
  cartId: number;

  @Column({ type: 'int', name: 'variant_id' })
  variantId: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Variant)
  @JoinColumn({ name: 'variant_id' })
  variant: Variant;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
