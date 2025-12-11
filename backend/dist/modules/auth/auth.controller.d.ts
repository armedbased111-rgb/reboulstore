import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: import("../../entities/user.entity").User;
        access_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: import("../../entities/user.entity").User;
        access_token: string;
    }>;
    getMe(req: any): Promise<any>;
}
