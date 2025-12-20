import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AdminUser, AdminRole } from './admin-user.entity';
export declare class AdminAuthService {
    private adminUserRepository;
    private jwtService;
    constructor(adminUserRepository: Repository<AdminUser>, jwtService: JwtService);
    register(email: string, password: string, firstName?: string, lastName?: string, role?: AdminRole): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: AdminRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(email: string, password: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: AdminRole;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    validateUser(userId: string): Promise<AdminUser | null>;
}
