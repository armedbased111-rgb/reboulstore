import { ReboulOrdersService } from './reboul-orders.service';
import { OrderStatus } from './entities/order.entity';
export declare class ReboulOrdersController {
    private readonly ordersService;
    constructor(ordersService: ReboulOrdersService);
    findAll(page: number, limit: number, status?: OrderStatus, userId?: string, startDate?: string, endDate?: string): Promise<{
        data: import("./entities/order.entity").Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getStats(): Promise<{
        total: number;
        byStatus: any[];
        totalRevenue: number;
    }>;
    findOne(id: string): Promise<import("./entities/order.entity").Order>;
    updateStatus(id: string, status: OrderStatus): Promise<import("./entities/order.entity").Order>;
    addTracking(id: string, trackingNumber: string): Promise<import("./entities/order.entity").Order>;
}
