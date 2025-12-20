import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AdminAuthService } from './admin-auth.service';
import { AdminUser } from './admin-user.entity';

/**
 * Stratégie JWT pour l'authentification admin
 * 
 * Extrait le token JWT du header Authorization
 * Valide le token et récupère l'admin correspondant
 */
@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    private configService: ConfigService,
    private adminAuthService: AdminAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'admin-secret-key-change-in-production',
    });
  }

  /**
   * Valide le payload JWT et retourne l'admin
   */
  async validate(payload: any): Promise<AdminUser> {
    const adminUser = await this.adminAuthService.validateUser(payload.sub);

    if (!adminUser) {
      throw new UnauthorizedException('Admin non trouvé ou compte désactivé');
    }

    return adminUser;
  }
}
