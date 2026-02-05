import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column({ name: 'postal_code' })
  postalCode: string;

  @Column({ default: 'France' })
  country: string;

  @Column({ nullable: true, name: 'additional_info' })
  additionalInfo: string; // Complément d'adresse (bâtiment, étage, etc.)

  @Column({ default: false, name: 'is_default' })
  isDefault: boolean; // Adresse par défaut

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
