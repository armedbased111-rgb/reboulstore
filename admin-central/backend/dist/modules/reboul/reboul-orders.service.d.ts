import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { User } from './entities/user.entity';
export declare class ReboulOrdersService {
    private orderRepository;
    private userRepository;
    constructor(orderRepository: Repository<Order>, userRepository: Repository<User>);
    findAll(page?: number, limit?: number, filters?: {
        status?: OrderStatus;
        userId?: number | string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        data: Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number | string): Promise<Order>;
    updateStatus(id: number | string, status: OrderStatus): Promise<Order>;
    addTracking(id: string, trackingNumber: string): Promise<Order>;
    getStats(): Promise<{
        total: number;
        byStatus: any[];
        totalRevenue: number;
    }>;
}
