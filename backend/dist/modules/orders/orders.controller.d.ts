import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<import("./dto/order-response.dto").OrderResponseDto>;
    findOne(id: string): Promise<import("./dto/order-response.dto").OrderResponseDto>;
    findAll(): Promise<import("./dto/order-response.dto").OrderResponseDto[]>;
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<import("./dto/order-response.dto").OrderResponseDto>;
}
