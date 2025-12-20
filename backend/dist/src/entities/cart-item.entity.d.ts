import { Cart } from './cart.entity';
import { Variant } from './variant.entity';
export declare class CartItem {
    id: string;
    cartId: string;
    variantId: string;
    quantity: number;
    cart: Cart;
    variant: Variant;
    createdAt: Date;
}
