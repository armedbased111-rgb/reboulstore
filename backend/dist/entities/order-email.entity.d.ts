import { Order } from './order.entity';
export declare enum EmailType {
    ORDER_RECEIVED = "order_received",
    ORDER_CONFIRMED = "order_confirmed",
    ORDER_SHIPPED = "order_shipped",
    ORDER_DELIVERED = "order_delivered",
    ORDER_CANCELLED = "order_cancelled"
}
export declare class OrderEmail {
    id: string;
    orderId: string;
    order: Order;
    emailType: EmailType;
    recipientEmail: string;
    subject: string;
    sent: boolean;
    errorMessage: string | null;
    sentAt: Date | null;
    createdAt: Date;
}
