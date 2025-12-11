import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { EmailService } from './email.service';
export declare class OrdersController {
    private readonly ordersService;
    private readonly emailService;
    constructor(ordersService: OrdersService, emailService: EmailService);
    create(createOrderDto: CreateOrderDto): Promise<import("./dto/order-response.dto").OrderResponseDto>;
    findMyOrders(req: any): Promise<import("./dto/order-response.dto").OrderResponseDto[]>;
    findAll(): Promise<import("./dto/order-response.dto").OrderResponseDto[]>;
    findOne(id: string, req: any): Promise<import("./dto/order-response.dto").OrderResponseDto>;
    testEmail(body: {
        type: string;
        email: string;
        firstName?: string;
    }): Promise<{
        message: string;
        error?: undefined;
        stack?: undefined;
    } | {
        error: string;
        message?: undefined;
        stack?: undefined;
    } | {
        error: any;
        stack: any;
        message?: undefined;
    }>;
    cancel(id: string, req: any): Promise<import("./dto/order-response.dto").OrderResponseDto>;
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<import("./dto/order-response.dto").OrderResponseDto>;
    capturePayment(id: string): Promise<import("./dto/order-response.dto").OrderResponseDto>;
}
