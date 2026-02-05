import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class SubscribeStockNotificationDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsInt()
  variantId?: number;
}

