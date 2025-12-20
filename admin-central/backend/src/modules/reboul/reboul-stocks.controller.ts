import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ReboulStocksService } from './reboul-stocks.service';
import { AdminJwtAuthGuard } from '../../shared/auth/admin-jwt-auth.guard';
import { RolesGuard } from '../../shared/auth/roles.guard';
import { Roles } from '../../shared/auth/roles.decorator';
import { AdminRole } from '../../shared/auth/admin-user.entity';

/**
 * Controller pour gérer les stocks Reboul depuis l'Admin Centrale
 * 
 * Routes : /admin/reboul/stocks
 * 
 * ⚠️ Toutes les routes sont protégées par authentification admin
 */
@Controller('admin/reboul/stocks')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
export class ReboulStocksController {
  constructor(private readonly stocksService: ReboulStocksService) {}

  /**
   * GET /admin/reboul/stocks
   * Liste tous les stocks Reboul avec filtres
   */
  @Get()
  async findAll(
    @Query('lowStock') lowStock?: string,
    @Query('outOfStock') outOfStock?: string,
    @Query('productId') productId?: string,
  ) {
    const filters = {
      lowStock: lowStock === 'true',
      outOfStock: outOfStock === 'true',
      productId,
    };

    return this.stocksService.findAll(filters);
  }

  /**
   * GET /admin/reboul/stocks/stats
   * Statistiques stocks Reboul
   */
  @Get('stats')
  async getStats() {
    return this.stocksService.getStats();
  }

  /**
   * GET /admin/reboul/stocks/:variantId
   * Récupérer le stock d'un variant spécifique
   */
  @Get(':variantId')
  async findOne(@Param('variantId') variantId: string) {
    return this.stocksService.findOne(variantId);
  }

  /**
   * PATCH /admin/reboul/stocks/:variantId
   * Mettre à jour le stock d'un variant
   */
  @Patch(':variantId')
  async updateStock(
    @Param('variantId') variantId: string,
    @Body('stock', ParseIntPipe) stock: number,
  ) {
    return this.stocksService.updateStock(variantId, stock);
  }
}
