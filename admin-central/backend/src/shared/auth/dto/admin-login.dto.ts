import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO pour la connexion admin
 */
export class AdminLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
