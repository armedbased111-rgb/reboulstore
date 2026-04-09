import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('newsletter_subscriptions')
export class NewsletterSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  /** ex. modal_v1 */
  @Column({ type: 'varchar', length: 64, nullable: true, name: 'source' })
  source: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
