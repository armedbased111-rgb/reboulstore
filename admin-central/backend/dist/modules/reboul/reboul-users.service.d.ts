import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { Order } from './entities/order.entity';
export declare class ReboulUsersService {
    private userRepository;
    private orderRepository;
    constructor(userRepository: Repository<User>, orderRepository: Repository<Order>);
    findAll(page?: number, limit?: number, filters?: {
        role?: UserRole;
        search?: string;
    }): Promise<{
        data: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            role: UserRole;
            isVerified: boolean;
            addresses: import("./entities/address.entity").Address[];
            orders: Order[];
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number | string): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: UserRole;
        isVerified: boolean;
        addresses: import("./entities/address.entity").Address[];
        orders: Order[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateRole(id: number | string, role: UserRole): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: UserRole;
        isVerified: boolean;
        addresses: import("./entities/address.entity").Address[];
        orders: Order[];
        createdAt: Date;
        updatedAt: Date;
    } & User>;
    remove(id: number | string): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        total: number;
        byRole: any[];
        withOrders: number;
        withoutOrders: number;
    }>;
}
