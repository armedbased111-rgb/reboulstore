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
            id: string;
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
    findOne(id: string): Promise<{
        id: string;
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
    updateRole(id: string, role: UserRole): Promise<{
        id: string;
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
    remove(id: string): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        total: number;
        byRole: any[];
        withOrders: number;
        withoutOrders: number;
    }>;
}
