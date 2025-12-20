import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  publicId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alt: string | null;

  @Column({ type: 'int', default: 0 })
  order: number;

  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}
