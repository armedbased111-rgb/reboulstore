import { CartItem } from './cart-item.entity';
export declare class Cart {
    id: number;
    sessionId: string;
    items: CartItem[];
    createdAt: Date;
    updatedAt: Date;
}
