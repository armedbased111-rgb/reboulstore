import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Headers,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Récupère le panier
   * Le sessionId peut être passé en header X-Session-Id ou en query param
   */
  @Get()
  async getCart(
    @Headers('x-session-id') sessionIdHeader?: string,
    @Query('sessionId') sessionIdQuery?: string,
  ) {
    const sessionId = sessionIdHeader || sessionIdQuery || this.generateSessionId();
    return this.cartService.findOne(sessionId);
  }

  /**
   * Ajoute un article au panier
   */
  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  async addItem(
    @Body() addToCartDto: AddToCartDto,
    @Headers('x-session-id') sessionIdHeader?: string,
    @Query('sessionId') sessionIdQuery?: string,
  ) {
    const sessionId = sessionIdHeader || sessionIdQuery || this.generateSessionId();
    return this.cartService.addItem(sessionId, addToCartDto);
  }

  /**
   * Met à jour la quantité d'un article
   */
  @Put('items/:id')
  async updateItem(
    @Param('id') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(itemId, updateCartItemDto);
  }

  /**
   * Supprime un article du panier
   */
  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeItem(@Param('id') itemId: string) {
    return this.cartService.removeItem(itemId);
  }

  /**
   * Vide le panier
   */
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async clear(
    @Headers('x-session-id') sessionIdHeader?: string,
    @Query('sessionId') sessionIdQuery?: string,
  ) {
    const sessionId = sessionIdHeader || sessionIdQuery || this.generateSessionId();
    return this.cartService.clear(sessionId);
  }

  /**
   * Génère un sessionId temporaire (pour les tests)
   * En production, cela devrait venir du frontend (cookie, localStorage, etc.)
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}
