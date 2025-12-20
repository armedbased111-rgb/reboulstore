import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ReboulSettingsService } from './reboul-settings.service';
import { AdminJwtAuthGuard } from '../../shared/auth/admin-jwt-auth.guard';
import { RolesGuard } from '../../shared/auth/roles.guard';
import { Roles } from '../../shared/auth/roles.decorator';
import { AdminRole } from '../../shared/auth/admin-user.entity';

/**
 * Controller pour gérer les paramètres Reboul
 * 
 * Routes : /admin/reboul/settings
 * 
 * ⚠️ Toutes les routes sont protégées par authentification admin
 */
@Controller('admin/reboul/settings')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
export class ReboulSettingsController {
  constructor(private readonly settingsService: ReboulSettingsService) {}

  /**
   * GET /admin/reboul/settings
   * Récupérer les paramètres Reboul
   */
  @Get()
  async getSettings() {
    return this.settingsService.getSettings();
  }

  /**
   * PATCH /admin/reboul/settings
   * Mettre à jour les paramètres Reboul
   */
  @Patch()
  async updateSettings(@Body() updateData: any) {
    return this.settingsService.updateSettings(updateData);
  }
}
