import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Enum des rôles admin
 * 
 * ADMIN : Gestionnaire standard (peut gérer produits, commandes, utilisateurs)
 * SUPER_ADMIN : Administrateur complet (peut tout faire + gérer autres admins)
 */
export enum AdminRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

/**
 * Entité AdminUser - Comptes administrateurs de l'Admin Centrale
 * 
 * Cette entité est séparée de User (clients) pour :
 * - Séparer les comptes admin des comptes clients
 * - Permettre une base de données distincte si besoin
 * - Gérer des permissions différentes
 * 
 * Pour le MVP, on utilise la même base Reboul, mais l'entité est séparée.
 */
@Entity('admin_users')
export class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Ne pas retourner le password par défaut
  password: string; // Hash bcrypt

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({
    type: 'enum',
    enum: AdminRole,
    default: AdminRole.ADMIN,
  })
  role: AdminRole;

  @Column({ default: false })
  isActive: boolean; // Permet de désactiver un compte admin sans le supprimer

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
