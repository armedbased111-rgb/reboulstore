import { AdminRole } from '../admin-user.entity';
export declare class AdminRegisterDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: AdminRole;
}
