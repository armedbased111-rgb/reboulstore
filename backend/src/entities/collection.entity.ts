import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string; // Ex: "SS2025", "AW2025", "current"

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'display_name' })
  displayName: string | null; // Ex: "Printemps-Été 2025", "Automne-Hiver 2025"

  @Column({ type: 'boolean', default: false, name: 'is_active' })
  isActive: boolean; // Seule une collection peut être active à la fois

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @OneToMany(() => Product, (product) => product.collection)
  products: Product[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

