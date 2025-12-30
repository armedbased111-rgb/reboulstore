import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ReboulCollectionsService } from './reboul-collections.service';
import { AdminJwtAuthGuard } from '../../shared/auth/admin-jwt-auth.guard';
import { RolesGuard } from '../../shared/auth/roles.guard';
import { Roles } from '../../shared/auth/roles.decorator';
import { AdminRole } from '../../shared/auth/admin-user.entity';

/**
 * Controller pour gérer les collections Reboul depuis l'Admin Centrale
 * 
 * Routes : /admin/reboul/collections
 * 
 * ⚠️ Toutes les routes sont protégées par authentification admin
 */
@Controller('admin/reboul/collections')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
export class ReboulCollectionsController {
  constructor(private readonly collectionsService: ReboulCollectionsService) {}

  /**
   * GET /admin/reboul/collections
   * Liste toutes les collections
   */
  @Get()
  async findAll() {
    return this.collectionsService.findAll();
  }

  /**
   * GET /admin/reboul/collections/active
   * Récupère la collection active
   */
  @Get('active')
  async findActive() {
    return this.collectionsService.findActive();
  }

  /**
   * GET /admin/reboul/collections/:id
   * Récupère une collection par ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(id);
  }

  /**
   * POST /admin/reboul/collections
   * Créer une nouvelle collection
   */
  @Post()
  async create(@Body() data: {
    name: string;
    displayName?: string;
    description?: string;
    isActive?: boolean;
  }) {
    return this.collectionsService.create(data);
  }

  /**
   * PATCH /admin/reboul/collections/:id
   * Mettre à jour une collection
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: {
      name?: string;
      displayName?: string;
      description?: string;
      isActive?: boolean;
    },
  ) {
    return this.collectionsService.update(id, data);
  }

  /**
   * POST /admin/reboul/collections/:id/activate
   * Activer une collection (désactive automatiquement les autres)
   */
  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id') id: string) {
    return this.collectionsService.activate(id);
  }

  /**
   * POST /admin/reboul/collections/:id/archive
   * Archiver une collection (désactiver)
   */
  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  async archive(@Param('id') id: string) {
    return this.collectionsService.archive(id);
  }

  /**
   * DELETE /admin/reboul/collections/:id
   * Supprimer une collection
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.collectionsService.remove(id);
  }
}

