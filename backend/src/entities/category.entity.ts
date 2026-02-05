import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'image_url' })
  imageUrl: string | null;

  /**
   * URL de la vidéo pour le hero section
   * Si fournie, sera affichée en priorité sur imageUrl
   */
  @Column({ type: 'varchar', length: 500, nullable: true, name: 'video_url' })
  videoUrl: string | null;

  /**
   * Size chart par défaut pour tous les produits de cette catégorie
   * Structure JSON avec tableau de tailles
   */
  @Column({ type: 'jsonb', nullable: true, name: 'size_chart' })
  sizeChart: Array<{
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
