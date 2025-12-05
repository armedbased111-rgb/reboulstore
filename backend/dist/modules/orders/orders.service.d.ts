import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { Cart } from '../../entities/cart.entity';
import { CartItem } from '../../entities/cart-item.entity';
import { Variant } from '../../entities/variant.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private orderRepository;
    private cartRepository;
    private cartItemRepository;
    private variantRepository;
    constructor(orderRepository: Repository<Order>, cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, variantRepository: Repository<Variant>);
    create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto>;
    findOne(id: string): Promise<OrderResponseDto>;
    findAll(): Promise<OrderResponseDto[]>;
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<OrderResponseDto>;
}
