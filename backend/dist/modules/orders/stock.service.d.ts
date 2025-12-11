import { Repository } from 'typeorm';
import { Variant } from '../../entities/variant.entity';
import { Order } from '../../entities/order.entity';
import { CartItem } from '../../entities/cart-item.entity';
export declare class StockService {
    private variantRepository;
    private orderRepository;
    private cartItemRepository;
    constructor(variantRepository: Repository<Variant>, orderRepository: Repository<Order>, cartItemRepository: Repository<CartItem>);
    checkStockAvailability(variantId: string, quantity: number): Promise<Variant>;
    decrementStock(variantId: string, quantity: number): Promise<Variant>;
    incrementStock(variantId: string, quantity: number): Promise<Variant>;
    decrementStockForOrder(orderId: string): Promise<void>;
    incrementStockForOrder(orderId: string): Promise<void>;
}
