import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../orders/email.service';
import { SmsService } from '../sms/sms.service';
export declare class AuthService {
    private userRepository;
    private jwtService;
    private emailService;
    private smsService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, emailService: EmailService, smsService: SmsService);
    register(registerDto: RegisterDto): Promise<{
        user: User;
        access_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: User;
        access_token: string;
    }>;
    validateUser(userId: string): Promise<User>;
    requestPasswordResetBySMS(phoneNumber: string): Promise<string>;
    resetPasswordByToken(token: string, newPassword: string): Promise<void>;
}
