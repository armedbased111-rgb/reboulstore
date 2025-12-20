import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { ReboulOrdersService } from './reboul-orders.service';
import { OrderStatus } from './entities/order.entity';
import { AdminJwtAuthGuard } from '../../shared/auth/admin-jwt-auth.guard';
import { RolesGuard } from '../../shared/auth/roles.guard';
import { Roles } from '../../shared/auth/roles.decorator';
import { AdminRole } from '../../shared/auth/admin-user.entity';

/**
 * Controller pour gérer les commandes Reboul depuis l'Admin Centrale
 * 
 * Routes : /admin/reboul/orders
 * 
 * ⚠️ Toutes les routes sont protégées par authentification admin
 */
@Controller('admin/reboul/orders')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
export class ReboulOrdersController {
  constructor(private readonly ordersService: ReboulOrdersService) {}

  /**
   * GET /admin/reboul/orders
   * Liste toutes les commandes Reboul avec pagination et filtres
   */
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: OrderStatus,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters = {
      status,
      userId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return this.ordersService.findAll(page, limit, filters);
  }

  /**
   * GET /admin/reboul/orders/stats
   * Statistiques commandes Reboul
   */
  @Get('stats')
  async getStats() {
    return this.ordersService.getStats();
  }

  /**
   * GET /admin/reboul/orders/:id
   * Récupérer une commande Reboul par ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  /**
   * PATCH /admin/reboul/orders/:id/status
   * Changer le statut d'une commande Reboul
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  /**
   * POST /admin/reboul/orders/:id/tracking
   * Ajouter un numéro de tracking à une commande
   */
  @Post(':id/tracking')
  async addTracking(
    @Param('id') id: string,
    @Body('trackingNumber') trackingNumber: string,
  ) {
    return this.ordersService.addTracking(id, trackingNumber);
  }
}
