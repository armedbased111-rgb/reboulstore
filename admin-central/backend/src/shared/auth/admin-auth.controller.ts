import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminJwtAuthGuard } from './admin-jwt-auth.guard';
import { AdminRole } from './admin-user.entity';

/**
 * Controller pour l'authentification admin
 * 
 * Routes : /admin/auth/*
 */
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  /**
   * POST /admin/auth/register
   * Inscription d'un nouvel admin
   * 
   * ⚠️ Sécurité : Devrait être protégé par SUPER_ADMIN uniquement
   * Pour le MVP, on peut créer le premier SUPER_ADMIN manuellement en BDD
   */
  @Post('register')
  async register(@Body() registerDto: AdminRegisterDto) {
    return this.adminAuthService.register(
      registerDto.email,
      registerDto.password,
      registerDto.firstName,
      registerDto.lastName,
      registerDto.role || AdminRole.ADMIN,
    );
  }

  /**
   * POST /admin/auth/login
   * Connexion admin
   */
  @Post('login')
  async login(@Body() loginDto: AdminLoginDto) {
    return this.adminAuthService.login(loginDto.email, loginDto.password);
  }

  /**
   * GET /admin/auth/me
   * Récupérer le profil de l'admin connecté
   */
  @UseGuards(AdminJwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    // L'admin est ajouté à req.user par AdminJwtAuthGuard
    return req.user;
  }
}
