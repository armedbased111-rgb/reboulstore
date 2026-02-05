import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(sessionIdHeader?: string, sessionIdQuery?: string): Promise<import("./dto/cart-response.dto").CartResponseDto>;
    addItem(addToCartDto: AddToCartDto, sessionIdHeader?: string, sessionIdQuery?: string): Promise<import("../../entities/cart-item.entity").CartItem>;
    updateItem(itemId: number, updateCartItemDto: UpdateCartItemDto): Promise<import("../../entities/cart-item.entity").CartItem>;
    removeItem(itemId: number): Promise<void>;
    clear(sessionIdHeader?: string, sessionIdQuery?: string): Promise<void>;
    private generateSessionId;
}
