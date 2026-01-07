import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    return req.user; // User ajouté par JwtStrategy
  }

  @Post('password-reset/sms')
  async requestPasswordResetBySMS(@Body() body: { phoneNumber: string }) {
    const token = await this.authService.requestPasswordResetBySMS(
      body.phoneNumber,
    );
    return { message: 'SMS sent successfully', token }; // Token retourné pour tests, en prod on ne le retourne pas
  }

  @Post('password-reset/confirm')
  async resetPasswordByToken(
    @Body() body: { token: string; newPassword: string },
  ) {
    await this.authService.resetPasswordByToken(
      body.token,
      body.newPassword,
    );
    return { message: 'Password reset successfully' };
  }
}
