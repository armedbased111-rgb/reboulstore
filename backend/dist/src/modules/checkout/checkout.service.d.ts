import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Variant } from '../../entities/variant.entity';
import { StockService } from '../orders/stock.service';
import { OrdersService } from '../orders/orders.service';
import { CouponsService } from '../coupons/coupons.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
export declare class CheckoutService {
    private configService;
    private variantRepository;
    private stockService;
    private ordersService;
    private couponsService;
    private stripe;
    private readonly logger;
    constructor(configService: ConfigService, variantRepository: Repository<Variant>, stockService: StockService, ordersService: OrdersService, couponsService: CouponsService);
    createCheckoutSession(dto: CreateCheckoutSessionDto, userId?: string): Promise<{
        url: string;
    }>;
    handleWebhook(rawBody: Buffer, signature: string): Promise<{
        received: boolean;
    }>;
    private handleCheckoutCompleted;
}
