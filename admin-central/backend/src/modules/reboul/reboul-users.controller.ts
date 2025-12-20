import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { ReboulUsersService } from './reboul-users.service';
import { UserRole } from './entities/user.entity';
import { AdminJwtAuthGuard } from '../../shared/auth/admin-jwt-auth.guard';
import { RolesGuard } from '../../shared/auth/roles.guard';
import { Roles } from '../../shared/auth/roles.decorator';
import { AdminRole } from '../../shared/auth/admin-user.entity';

/**
 * Controller pour gérer les utilisateurs Reboul depuis l'Admin Centrale
 * 
 * Routes : /admin/reboul/users
 * 
 * ⚠️ Toutes les routes sont protégées par authentification admin
 */
@Controller('admin/reboul/users')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
export class ReboulUsersController {
  constructor(private readonly usersService: ReboulUsersService) {}

  /**
   * GET /admin/reboul/users
   * Liste tous les utilisateurs Reboul avec pagination et filtres
   */
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('role') role?: UserRole,
    @Query('search') search?: string,
  ) {
    const filters = {
      role,
      search,
    };

    return this.usersService.findAll(page, limit, filters);
  }

  /**
   * GET /admin/reboul/users/stats
   * Statistiques utilisateurs Reboul
   */
  @Get('stats')
  async getStats() {
    return this.usersService.getStats();
  }

  /**
   * GET /admin/reboul/users/:id
   * Récupérer un utilisateur Reboul par ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /admin/reboul/users/:id/role
   * Changer le rôle d'un utilisateur Reboul
   */
  @Patch(':id/role')
  async updateRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ) {
    return this.usersService.updateRole(id, role);
  }

  /**
   * DELETE /admin/reboul/users/:id
   * Supprimer un utilisateur Reboul
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
