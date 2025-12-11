import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum EmailType {
  ORDER_RECEIVED = 'order_received', // Commande reçue (PENDING)
  ORDER_CONFIRMED = 'order_confirmed', // Commande confirmée (PAID)
  ORDER_SHIPPED = 'order_shipped', // Commande expédiée (SHIPPED)
  ORDER_DELIVERED = 'order_delivered', // Commande livrée (DELIVERED)
  ORDER_CANCELLED = 'order_cancelled', // Commande annulée (CANCELLED/REFUNDED)
}

@Entity('order_emails')
export class OrderEmail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({
    type: 'enum',
    enum: EmailType,
  })
  emailType: EmailType;

  @Column()
  recipientEmail: string;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'boolean', default: true })
  sent: boolean;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
