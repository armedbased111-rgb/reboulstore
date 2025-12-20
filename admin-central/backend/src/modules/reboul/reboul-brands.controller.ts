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
import { ReboulBrandsService } from './reboul-brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AdminJwtAuthGuard } from '../../shared/auth/admin-jwt-auth.guard';
import { RolesGuard } from '../../shared/auth/roles.guard';
import { Roles } from '../../shared/auth/roles.decorator';
import { AdminRole } from '../../shared/auth/admin-user.entity';

/**
 * Controller pour gérer les marques Reboul depuis l'Admin Centrale
 * 
 * Routes : /admin/reboul/brands
 * 
 * ⚠️ Toutes les routes sont protégées par authentification admin
 */
@Controller('admin/reboul/brands')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
export class ReboulBrandsController {
  constructor(private readonly brandsService: ReboulBrandsService) {}

  /**
   * GET /admin/reboul/brands
   * Liste toutes les marques Reboul avec pagination et filtres
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

    return this.brandsService.findAll(page, limit, filters);
  }

  /**
   * GET /admin/reboul/brands/:id
   * Récupérer une marque Reboul par ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  /**
   * POST /admin/reboul/brands
   * Créer une nouvelle marque Reboul
   */
  @Post()
  async create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  /**
   * PATCH /admin/reboul/brands/:id
   * Mettre à jour une marque Reboul
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, updateBrandDto);
  }

  /**
   * DELETE /admin/reboul/brands/:id
   * Supprimer une marque Reboul
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
