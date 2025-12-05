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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  cartId: string;

  @Column({ type: 'uuid' })
  variantId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ManyToOne(() => Variant)
  @JoinColumn({ name: 'variantId' })
  variant: Variant;

  @CreateDateColumn()
  createdAt: Date;
}