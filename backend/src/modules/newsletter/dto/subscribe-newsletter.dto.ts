import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class SubscribeNewsletterDto {
  @IsEmail()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  source?: string;
}
