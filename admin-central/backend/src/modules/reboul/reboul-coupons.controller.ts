import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ReboulCouponsService } from './reboul-coupons.service';
import { AdminJwtAuthGuard } from '../../shared/auth/admin-jwt-auth.guard';
import { RolesGuard } from '../../shared/auth/roles.guard';
import { Roles } from '../../shared/auth/roles.decorator';
import { AdminRole } from '../../shared/auth/admin-user.entity';

/**
 * Controller pour gérer les coupons Reboul depuis l'Admin Centrale
 * 
 * Routes : /admin/reboul/coupons
 * 
 * ⚠️ Toutes les routes sont protégées par authentification admin
 */
@Controller('admin/reboul/coupons')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
export class ReboulCouponsController {
  constructor(private readonly couponsService: ReboulCouponsService) {}

  /**
   * GET /admin/reboul/coupons
   * Liste tous les coupons Reboul
   */
  @Get()
  async findAll() {
    return this.couponsService.findAll();
  }

  /**
   * GET /admin/reboul/coupons/:id
   * Récupère un coupon par son ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  /**
   * POST /admin/reboul/coupons
   * Crée un nouveau coupon
   */
  @Post()
  async create(@Body() createCouponDto: any) {
    return this.couponsService.create(createCouponDto);
  }

  /**
   * PATCH /admin/reboul/coupons/:id
   * Met à jour un coupon
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCouponDto: any) {
    return this.couponsService.update(id, updateCouponDto);
  }

  /**
   * DELETE /admin/reboul/coupons/:id
   * Supprime un coupon
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.couponsService.remove(id);
    return { message: 'Coupon supprimé avec succès' };
  }
}

