import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AdminUser } from './admin-user.entity';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminJwtStrategy } from './admin-jwt.strategy';
import { RolesGuard } from './roles.guard';

/**
 * Module d'authentification admin
 * 
 * Gère :
 * - Entité AdminUser
 * - Service AdminAuthService (register, login, validateUser)
 * - Strategy JWT AdminJwtStrategy
 * - Guards AdminJwtAuthGuard et RolesGuard
 * - Controller AdminAuthController
 */
@Module({
  imports: [
    // Enregistrer AdminUser avec la connexion 'reboul'
    TypeOrmModule.forFeature([AdminUser], 'reboul'),
    
    // Module JWT pour générer et valider les tokens
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'admin-secret-key-change-in-production',
        signOptions: { expiresIn: '7d' }, // Token valide 7 jours
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AdminAuthService,
    AdminJwtStrategy, // Strategy JWT pour valider les tokens
    RolesGuard, // Guard pour vérifier les rôles
  ],
  controllers: [AdminAuthController],
  exports: [AdminAuthService, RolesGuard], // Exporter pour utilisation dans d'autres modules
})
export class AdminAuthModule {}
