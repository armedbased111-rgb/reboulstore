import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmailService } from './email.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Crée une commande depuis un panier
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  /**
   * Récupère les commandes de l'utilisateur connecté
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findMyOrders(@Request() req) {
    return this.ordersService.findByUser(req.user.id);
  }

  /**
   * Récupère toutes les commandes (non protégé - peut être protégé plus tard pour admin uniquement)
   */
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  /**
   * Récupère une commande par son ID (protégé)
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findOne(id, req.user.id);
  }

  /**
   * TEST : Endpoint pour tester l'envoi d'emails
   * @deprecated À supprimer en production
   */
  @Post('test-email')
  @HttpCode(HttpStatus.OK)
  async testEmail(@Body() body: { type: string; email: string; firstName?: string }) {
    if (process.env.NODE_ENV === 'production') {
      return { message: 'This endpoint is disabled in production' };
    }

    try {
      switch (body.type) {
        case 'registration':
          await this.emailService.sendRegistrationConfirmation(
            body.email,
            body.firstName || 'Test User',
          );
          return { message: 'Registration email sent successfully to ' + body.email };
        
        default:
          return { error: 'Invalid email type. Use: registration' };
      }
    } catch (error) {
      return { error: error.message, stack: error.stack };
    }
  }

  /**
   * Annule une commande
   */
  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string, @Request() req) {
    return this.ordersService.cancel(id, req.user.id);
  }

  /**
   * Met à jour le statut d'une commande
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateStatusDto);
  }

  /**
   * Capture le paiement d'une commande PENDING (admin uniquement)
   * TODO Phase 16 : Ajouter guard admin
   */
  @Post(':id/capture')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async capturePayment(@Param('id') id: string) {
    return this.ordersService.capturePayment(id);
  }
}
