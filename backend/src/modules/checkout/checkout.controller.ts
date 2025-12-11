import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CheckoutSessionResponseDto } from './dto/checkout-session-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  /**
   * Crée une session Stripe Checkout
   * Accessible avec ou sans authentification (guest checkout supporté)
   */
  @Post('create-session')
  @HttpCode(HttpStatus.OK)
  async createSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
    @Request() req,
  ): Promise<CheckoutSessionResponseDto> {
    // Récupérer userId si l'utilisateur est connecté, sinon null pour guest checkout
    const userId = req.user?.id || null;
    return this.checkoutService.createCheckoutSession(
      createCheckoutSessionDto,
      userId,
    );
  }

  /**
   * Webhook Stripe pour recevoir les events
   * IMPORTANT: Ce endpoint doit être exclu de la validation de body
   * car Stripe envoie du raw body pour vérifier la signature
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Request() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!req.rawBody) {
      throw new Error('Raw body is required for webhook verification');
    }
    return this.checkoutService.handleWebhook(
      req.rawBody,
      signature,
    );
  }
}
