import { Address } from './address.entity';
import { Order } from './order.entity';
export declare enum UserRole {
    CLIENT = "CLIENT",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}
export declare class User {
    id: string;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    isVerified: boolean;
    addresses: Address[];
    orders: Order[];
    createdAt: Date;
    updatedAt: Date;
}
