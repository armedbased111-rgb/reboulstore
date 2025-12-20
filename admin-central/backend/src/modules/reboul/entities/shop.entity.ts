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
 * Entité Shop - Représente un shop/boutique (Reboul Adult, Reboul Kids, etc.)
 *
 * Contient les politiques globales de livraison et retour pour le shop
 */
@Entity('shops')
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  /**
   * Informations de contact du shop
   */
  @Column({ type: 'jsonb', nullable: true })
  contactInfo: {
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };
  } | null;

  /**
   * Configuration Stripe
   */
  @Column({ type: 'jsonb', nullable: true })
  stripeConfig: {
    accountId?: string; // Stripe Account ID
    dashboardUrl?: string; // URL du dashboard Stripe
  } | null;

  /**
   * Politique de livraison du shop
   * Structure JSON avec infos globales de livraison
   */
  @Column({ type: 'jsonb', nullable: true })
  shippingPolicy: {
    freeShippingThreshold?: number; // Ex: 50 (€50)
    deliveryTime?: string; // Ex: "3-5 business days"
    internationalShipping?: boolean;
    standardShipping?: {
      cost: number; // Ex: 5.99 (€)
      name?: string; // Ex: "Livraison standard"
      description?: string;
    };
    expressShipping?: {
      cost: number; // Ex: 9.99 (€)
      name?: string; // Ex: "Livraison express"
      description?: string;
    };
    description?: string; // Description complète
  } | null;

  /**
   * Politique de retour du shop
   * Structure JSON avec infos globales de retour
   */
  @Column({ type: 'jsonb', nullable: true })
  returnPolicy: {
    returnWindow?: number; // Ex: 30 (jours)
    returnShippingFree?: boolean;
    conditions?: string; // Conditions complètes
  } | null;

  @OneToMany(() => Product, (product) => product.shop)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
