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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column({ default: 'France' })
  country: string;

  @Column({ nullable: true })
  additionalInfo: string; // Complément d'adresse (bâtiment, étage, etc.)

  @Column({ default: false })
  isDefault: boolean; // Adresse par défaut

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
