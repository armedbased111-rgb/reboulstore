import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<import("./dto/order-response.dto").OrderResponseDto>;
    applyCoupon(applyCouponDto: ApplyCouponDto): Promise<{
        code: string;
        discountAmount: number;
        totalBeforeDiscount: number;
        totalAfterDiscount: number;
    }>;
    findAll(): Promise<import("./dto/order-response.dto").OrderResponseDto[]>;
    findOne(id: number): Promise<import("./dto/order-response.dto").OrderResponseDto>;
    updateStatus(id: number, updateStatusDto: UpdateOrderStatusDto): Promise<import("./dto/order-response.dto").OrderResponseDto>;
    capturePayment(id: number): Promise<import("./dto/order-response.dto").OrderResponseDto>;
}
