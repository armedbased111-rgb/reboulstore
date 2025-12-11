import { Cart } from './cart.entity';
import { User } from './user.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    PAID = "paid",
    PROCESSING = "processing",
    CONFIRMED = "confirmed",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare class Order {
    id: string;
    cartId: string | null;
    status: OrderStatus;
    total: number;
    customerInfo: {
        name: string;
        email: string;
        phone?: string;
        address: {
            street: string;
            city: string;
            postalCode: string;
            country: string;
        };
    };
    cart: Cart;
    userId: string | null;
    user: User;
    shippingAddress: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
        phone?: string;
    } | null;
    billingAddress: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
        phone?: string;
    } | null;
    paymentIntentId: string;
    items: Array<{
        variantId: string;
        quantity: number;
    }> | null;
    trackingNumber: string;
    paidAt: Date;
    shippedAt: Date;
    deliveredAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
