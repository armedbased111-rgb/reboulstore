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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  reference: string | null; // Référence produit (ex: REF-001, SKU-12345)

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'int', nullable: true, name: 'shop_id' })
  shopId: number | null;

  @ManyToOne(() => Shop, (shop) => shop.products)
  @JoinColumn({ name: 'shop_id' })
  shop: Shop | null;

  @Column({ type: 'int', nullable: true, name: 'brand_id' })
  brandId: number | null;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand | null;

  @Column({ type: 'int', nullable: true, name: 'collection_id' })
  collectionId: number | null;

  @ManyToOne(() => Collection, (collection) => collection.products)
  @JoinColumn({ name: 'collection_id' })
  collection: Collection | null;

  @Column({ type: 'boolean', name: 'is_published', default: true })
  isPublished: boolean;

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];

  @OneToMany(() => Variant, (variant) => variant.product)
  variants: Variant[];

  /** Texte éditable dans DBeaver (une ligne par variant : couleur;taille;stock;sku), sync vers table variants via trigger */
  @Column({ type: 'text', nullable: true, name: 'variants' })
  variantsData: string | null;

  /**
   * Informations spécifiques au produit
   */
  @Column({ type: 'text', nullable: true })
  materials: string | null; // Ex: "100% Cotton"

  @Column({ type: 'text', nullable: true, name: 'care_instructions' })
  careInstructions: string | null; // Ex: "Machine wash cold"

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'made_in' })
  madeIn: string | null; // Ex: "France"

  /**
   * Size chart custom pour ce produit (override celui de la catégorie)
   * Si null, le produit utilise le size chart de sa catégorie
   */
  @Column({ type: 'jsonb', nullable: true, name: 'custom_size_chart' })
  customSizeChart: Array<{
    size: string;
    chest?: number;
    length?: number;
    waist?: number;
    hip?: number;
  }> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
