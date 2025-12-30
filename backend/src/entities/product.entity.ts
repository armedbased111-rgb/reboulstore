import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Image } from './image.entity';
import { Variant } from './variant.entity';
import { Shop } from './shop.entity';
import { Brand } from './brand.entity';
import { Collection } from './collection.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'uuid', nullable: true })
  shopId: string | null;

  @ManyToOne(() => Shop, (shop) => shop.products)
  @JoinColumn({ name: 'shopId' })
  shop: Shop | null;

  @Column({ type: 'uuid', nullable: true })
  brandId: string | null;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brandId' })
  brand: Brand | null;

  @Column({ type: 'uuid', nullable: true })
  collectionId: string | null;

  @ManyToOne(() => Collection, (collection) => collection.products)
  @JoinColumn({ name: 'collectionId' })
  collection: Collection | null;

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];

  @OneToMany(() => Variant, (variant) => variant.product)
  variants: Variant[];

  /**
   * Informations spécifiques au produit
   */
  @Column({ type: 'text', nullable: true })
  materials: string | null; // Ex: "100% Cotton"

  @Column({ type: 'text', nullable: true })
  careInstructions: string | null; // Ex: "Machine wash cold"

  @Column({ type: 'varchar', length: 100, nullable: true })
  madeIn: string | null; // Ex: "France"

  /**
   * Size chart custom pour ce produit (override celui de la catégorie)
   * Si null, le produit utilise le size chart de sa catégorie
   */
  @Column({ type: 'jsonb', nullable: true })
  customSizeChart: Array<{
    size: string;
    chest?: number;
    length?: number;
    waist?: number;
    hip?: number;
  }> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
