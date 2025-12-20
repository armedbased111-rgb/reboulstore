import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { AdminRole } from '../admin-user.entity';

/**
 * DTO pour l'inscription admin
 * 
 * ⚠️ Sécurité : Seul un SUPER_ADMIN peut créer d'autres admins
 */
export class AdminRegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;
}
