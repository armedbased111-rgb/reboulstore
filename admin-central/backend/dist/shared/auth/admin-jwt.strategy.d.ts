import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AdminAuthService } from './admin-auth.service';
import { AdminUser } from './admin-user.entity';
declare const AdminJwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithoutRequest] | [opt: import("passport-jwt").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class AdminJwtStrategy extends AdminJwtStrategy_base {
    private configService;
    private adminAuthService;
    constructor(configService: ConfigService, adminAuthService: AdminAuthService);
    validate(payload: any): Promise<AdminUser>;
}
export {};
