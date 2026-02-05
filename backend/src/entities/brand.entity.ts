import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';

/**
 * Entité Brand - Représente une marque (Nike, Adidas, A-COLD-WALL*, etc.)
 *
 * Contient les infos de la marque et les images pour le mega menu
 */
@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'logo_url' })
  logoUrl: string | null;

  /**
   * Images pour le mega menu (2 images par marque)
   * Ces images s'affichent à droite du mega menu au hover
   */
  @Column({ type: 'varchar', length: 500, nullable: true, name: 'mega_menu_image_1' })
  megaMenuImage1: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'mega_menu_image_2' })
  megaMenuImage2: string | null;

  /**
   * Vidéos pour le mega menu (2 vidéos par marque)
   * Si fournies, seront affichées en priorité sur les images au hover
   */
  @Column({ type: 'varchar', length: 500, nullable: true, name: 'mega_menu_video_1' })
  megaMenuVideo1: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'mega_menu_video_2' })
  megaMenuVideo2: string | null;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
