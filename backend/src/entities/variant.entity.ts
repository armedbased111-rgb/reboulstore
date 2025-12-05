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

@Entity('variants')
export class Variant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'varchar', length: 100 })
  color: string;

  @Column({ type: 'varchar', length: 50 })
  size: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}