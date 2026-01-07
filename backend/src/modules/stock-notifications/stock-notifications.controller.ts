import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { StockNotificationsService } from './stock-notifications.service';
import { SubscribeStockNotificationDto } from './dto/subscribe-stock-notification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products/:productId/notify-stock')
export class StockNotificationsController {
  constructor(
    private readonly stockNotificationsService: StockNotificationsService,
  ) {}

  /**
   * POST /products/:productId/notify-stock
   * S'abonner aux notifications de stock
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async subscribe(
    @Param('productId') productId: string,
    @Body() subscribeDto: SubscribeStockNotificationDto,
  ) {
    return this.stockNotificationsService.subscribe(productId, subscribeDto);
  }

  /**
   * GET /products/:productId/notify-stock?email=...&variantId=...
   * Vérifier si un utilisateur est déjà inscrit
   */
  @Get()
  async checkSubscription(
    @Param('productId') productId: string,
    @Query('email') email: string,
    @Query('variantId') variantId?: string,
  ) {
    if (!email) {
      return { isSubscribed: false, notification: null };
    }

    return this.stockNotificationsService.checkSubscription(
      productId,
      email,
      variantId,
    );
  }
}

/**
 * Controller admin pour gérer les notifications de stock
 */
@Controller('admin/stock-notifications')
@UseGuards(JwtAuthGuard)
export class StockNotificationsAdminController {
  constructor(
    private readonly stockNotificationsService: StockNotificationsService,
  ) {}

  /**
   * POST /admin/stock-notifications/check
   * Déclencher manuellement la vérification du stock et l'envoi des notifications
   * (Utile pour les tests)
   */
  @Post('check')
  @HttpCode(HttpStatus.OK)
  async triggerStockCheck() {
    await this.stockNotificationsService.checkAndNotifyAll();
    return {
      message: 'Stock check and notifications triggered successfully',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Endpoint public temporaire pour les tests (à supprimer en production)
 */
@Controller('test/stock-notifications')
export class StockNotificationsTestController {
  constructor(
    private readonly stockNotificationsService: StockNotificationsService,
  ) {}

  /**
   * POST /test/stock-notifications/check
   * Déclencher manuellement la vérification du stock (PUBLIC - pour tests uniquement)
   */
  @Post('check')
  @HttpCode(HttpStatus.OK)
  async triggerStockCheck() {
    await this.stockNotificationsService.checkAndNotifyAll();
    return {
      message: 'Stock check and notifications triggered successfully',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * POST /test/stock-notifications/test-email
   * Envoyer un email de test avec logo et image produit (PUBLIC - pour tests uniquement)
   */
  @Post('test-email')
  @HttpCode(HttpStatus.OK)
  async sendTestEmail(@Body() body: { email?: string }) {
    const testEmail = body.email || 'zxransounds@gmail.com';
    
    // Appeler directement le service stock-notifications qui a accès à emailService
    await this.stockNotificationsService.sendTestEmail(testEmail);
    
    return {
      message: 'Test email sent successfully',
      email: testEmail,
      timestamp: new Date().toISOString(),
    };
  }
}

