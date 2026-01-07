import { IsEmail } from 'class-validator';

export class CheckSubscriptionDto {
  @IsEmail()
  email: string;
}

