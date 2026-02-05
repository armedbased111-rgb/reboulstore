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
import { CouponsService } from '../coupons/coupons.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { SmsService } from '../sms/sms.service';
export declare class OrdersService {
    private orderRepository;
    private cartRepository;
    private cartItemRepository;
    private variantRepository;
    private userRepository;
    private stockService;
    private emailService;
    private configService;
    private couponsService;
    private notificationsGateway;
    private smsService;
    private stripe;
    private readonly logger;
    constructor(orderRepository: Repository<Order>, cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, variantRepository: Repository<Variant>, userRepository: Repository<User>, stockService: StockService, emailService: EmailService, configService: ConfigService, couponsService: CouponsService, notificationsGateway: NotificationsGateway, smsService: SmsService);
    create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto>;
    private checkOrderAccess;
    findOneEntity(id: number, userId?: number): Promise<Order>;
    findOne(id: number, userId?: number): Promise<OrderResponseDto>;
    findAll(): Promise<OrderResponseDto[]>;
    updateStatus(id: number, updateStatusDto: UpdateOrderStatusDto): Promise<OrderResponseDto>;
    findByUser(userId: number): Promise<OrderResponseDto[]>;
    cancel(id: number, userId: number): Promise<OrderResponseDto>;
    refund(id: number, userId: number): Promise<OrderResponseDto>;
    createFromStripeCheckout(items: Array<{
        variantId: number;
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
    } | null, amountTotal?: number | null, couponId?: number | null, discountAmount?: number): Promise<OrderResponseDto>;
    capturePayment(orderId: number): Promise<OrderResponseDto>;
    applyCoupon(code: string, cartId: number): Promise<{
        code: string;
        discountAmount: number;
        totalBeforeDiscount: number;
        totalAfterDiscount: number;
    }>;
}
