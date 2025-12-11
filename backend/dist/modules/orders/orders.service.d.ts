import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Order } from '../../entities/order.entity';
import { Cart } from '../../entities/cart.entity';
import { CartItem } from '../../entities/cart-item.entity';
import { Variant } from '../../entities/variant.entity';
import { User } from '../../entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { StockService } from './stock.service';
import { EmailService } from './email.service';
export declare class OrdersService {
    private orderRepository;
    private cartRepository;
    private cartItemRepository;
    private variantRepository;
    private userRepository;
    private stockService;
    private emailService;
    private configService;
    private stripe;
    private readonly logger;
    constructor(orderRepository: Repository<Order>, cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, variantRepository: Repository<Variant>, userRepository: Repository<User>, stockService: StockService, emailService: EmailService, configService: ConfigService);
    create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto>;
    private checkOrderAccess;
    findOne(id: string, userId?: string): Promise<OrderResponseDto>;
    findAll(): Promise<OrderResponseDto[]>;
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<OrderResponseDto>;
    findByUser(userId: string): Promise<OrderResponseDto[]>;
    cancel(id: string, userId: string): Promise<OrderResponseDto>;
    refund(id: string, userId: string): Promise<OrderResponseDto>;
    createFromStripeCheckout(items: Array<{
        variantId: string;
        quantity: number;
    }>, userId: string | null, paymentIntentId: string, customerEmail: string, customerName?: string, shippingAddress?: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
        phone?: string;
    } | null, billingAddress?: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
        phone?: string;
    } | null, amountTotal?: number | null): Promise<OrderResponseDto>;
    capturePayment(orderId: string): Promise<OrderResponseDto>;
}
