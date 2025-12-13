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
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmailService } from './email.service';
import { InvoiceService } from './invoice.service';
import type { Response } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly emailService: EmailService,
    private readonly invoiceService: InvoiceService,
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
   * Télécharge la facture d'une commande (PDF)
   */
  @Get(':id/invoice')
  @UseGuards(JwtAuthGuard)
  async downloadInvoice(
    @Param('id') id: string,
    @Request() req,
    @Res({ passthrough: false }) res: Response,
  ) {
    try {
      // Récupérer l'entité Order complète avec toutes les relations pour le PDF
      const order = await this.ordersService.findOneEntity(id, req.user.id);

      // Générer le PDF
      const pdfBuffer = await this.invoiceService.generateInvoicePDF(order);

      // Configurer les headers pour le téléchargement
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=facture-${order.id.slice(0, 8)}.pdf`,
        'Content-Length': pdfBuffer.length,
      });

      // Envoyer le PDF
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Erreur génération facture:', error);
      res.status(500).json({ message: 'Erreur lors de la génération de la facture' });
    }
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
