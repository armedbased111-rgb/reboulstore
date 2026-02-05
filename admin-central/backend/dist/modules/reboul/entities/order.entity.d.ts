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
    id: number;
    cartId: number | null;
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
    userId: number | null;
    user: User;
    shippingAddress: Record<string, unknown> | null;
    billingAddress: Record<string, unknown> | null;
    paymentIntentId: string;
    items: Array<{
        variantId: number;
        quantity: number;
    }> | null;
    trackingNumber: string;
    couponId: number | null;
    discountAmount: number | null;
    paidAt: Date;
    shippedAt: Date;
    deliveredAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
