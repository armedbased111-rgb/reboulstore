import { Cart } from './cart.entity';
import { User } from './user.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: string;
    cartId: string;
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
    userId: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
