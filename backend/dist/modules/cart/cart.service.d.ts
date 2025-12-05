import { Repository } from 'typeorm';
import { Cart } from '../../entities/cart.entity';
import { CartItem } from '../../entities/cart-item.entity';
import { Variant } from '../../entities/variant.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
export declare class CartService {
    private cartRepository;
    private cartItemRepository;
    private variantRepository;
    constructor(cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, variantRepository: Repository<Variant>);
    getOrCreate(sessionId: string): Promise<Cart>;
    findOne(sessionId: string): Promise<CartResponseDto>;
    addItem(sessionId: string, addToCartDto: AddToCartDto): Promise<CartItem>;
    updateItem(itemId: string, updateCartItemDto: UpdateCartItemDto): Promise<CartItem>;
    removeItem(itemId: string): Promise<void>;
    clear(sessionId: string): Promise<void>;
    calculateTotal(cartId: string): Promise<number>;
}
