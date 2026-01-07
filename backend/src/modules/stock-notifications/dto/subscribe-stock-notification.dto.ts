import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class SubscribeStockNotificationDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUUID()
  variantId?: string;
}

