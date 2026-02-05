import { Cart } from './cart.entity';
import { Variant } from './variant.entity';
export declare class CartItem {
    id: number;
    cartId: number;
    variantId: number;
    quantity: number;
    cart: Cart;
    variant: Variant;
    createdAt: Date;
}
