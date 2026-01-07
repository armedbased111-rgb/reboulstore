import { Repository } from 'typeorm';
import { Variant } from '../../entities/variant.entity';
import { Order } from '../../entities/order.entity';
import { CartItem } from '../../entities/cart-item.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { Product } from '../../entities/product.entity';
export declare class StockService {
    private variantRepository;
    private orderRepository;
    private cartItemRepository;
    private productRepository;
    private notificationsGateway;
    private readonly STOCK_LOW_THRESHOLD;
    constructor(variantRepository: Repository<Variant>, orderRepository: Repository<Order>, cartItemRepository: Repository<CartItem>, productRepository: Repository<Product>, notificationsGateway: NotificationsGateway);
    checkStockAvailability(variantId: string, quantity: number): Promise<Variant>;
    decrementStock(variantId: string, quantity: number): Promise<Variant>;
    incrementStock(variantId: string, quantity: number): Promise<Variant>;
    decrementStockForOrder(orderId: string): Promise<void>;
    incrementStockForOrder(orderId: string): Promise<void>;
}
