import { ReboulUsersService } from './reboul-users.service';
import { UserRole } from './entities/user.entity';
export declare class ReboulUsersController {
    private readonly usersService;
    constructor(usersService: ReboulUsersService);
    findAll(page: number, limit: number, role?: UserRole, search?: string): Promise<{
        data: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            role: UserRole;
            isVerified: boolean;
            addresses: import("./entities/address.entity").Address[];
            orders: import("./entities/order.entity").Order[];
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getStats(): Promise<{
        total: number;
        byRole: any[];
        withOrders: number;
        withoutOrders: number;
    }>;
    findOne(id: string): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: UserRole;
        isVerified: boolean;
        addresses: import("./entities/address.entity").Address[];
        orders: import("./entities/order.entity").Order[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateRole(id: string, role: UserRole): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: UserRole;
        isVerified: boolean;
        addresses: import("./entities/address.entity").Address[];
        orders: import("./entities/order.entity").Order[];
        createdAt: Date;
        updatedAt: Date;
    } & import("./entities/user.entity").User>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
