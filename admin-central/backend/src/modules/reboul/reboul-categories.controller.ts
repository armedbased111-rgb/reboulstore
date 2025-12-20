import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { ReboulCategoriesService } from './reboul-categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AdminJwtAuthGuard } from '../../shared/auth/admin-jwt-auth.guard';
import { RolesGuard } from '../../shared/auth/roles.guard';
import { Roles } from '../../shared/auth/roles.decorator';
import { AdminRole } from '../../shared/auth/admin-user.entity';

/**
 * Controller pour gérer les catégories Reboul depuis l'Admin Centrale
 * 
 * Routes : /admin/reboul/categories
 * 
 * ⚠️ Toutes les routes sont protégées par authentification admin
 */
@Controller('admin/reboul/categories')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
export class ReboulCategoriesController {
  constructor(private readonly categoriesService: ReboulCategoriesService) {}

  /**
   * GET /admin/reboul/categories
   * Liste toutes les catégories Reboul avec pagination et filtres
   */
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    const filters = {
      search,
    };

    return this.categoriesService.findAll(page, limit, filters);
  }

  /**
   * GET /admin/reboul/categories/:id
   * Récupérer une catégorie Reboul par ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  /**
   * POST /admin/reboul/categories
   * Créer une nouvelle catégorie Reboul
   */
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * PATCH /admin/reboul/categories/:id
   * Mettre à jour une catégorie Reboul
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * DELETE /admin/reboul/categories/:id
   * Supprimer une catégorie Reboul
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
