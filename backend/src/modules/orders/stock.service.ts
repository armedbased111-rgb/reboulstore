import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from '../../entities/variant.entity';
import { Order } from '../../entities/order.entity';
import { CartItem } from '../../entities/cart-item.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  /**
   * Vérifie que le stock est disponible pour une variante
   * @param variantId - ID de la variante
   * @param quantity - Quantité demandée
   * @returns La variante avec le stock vérifié
   * @throws NotFoundException si la variante n'existe pas
   * @throws BadRequestException si le stock est insuffisant
   */
  async checkStockAvailability(
    variantId: string,
    quantity: number,
  ): Promise<Variant> {
    const variant = await this.variantRepository.findOne({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }

    if (variant.stock < quantity) {
      throw new BadRequestException(
        `Stock insuffisant pour ${variant.sku}. Stock disponible : ${variant.stock}, quantité demandée : ${quantity}`,
      );
    }

    return variant;
  }

  /**
   * Décrémente le stock d'une variante
   * @param variantId - ID de la variante
   * @param quantity - Quantité à décrémenter
   * @returns La variante mise à jour
   * @throws NotFoundException si la variante n'existe pas
   * @throws BadRequestException si le stock est insuffisant
   */
  async decrementStock(
    variantId: string,
    quantity: number,
  ): Promise<Variant> {
    const variant = await this.checkStockAvailability(variantId, quantity);

    variant.stock -= quantity;
    await this.variantRepository.save(variant);

    return variant;
  }

  /**
   * Incrémente le stock d'une variante
   * @param variantId - ID de la variante
   * @param quantity - Quantité à incrémenter
   * @returns La variante mise à jour
   * @throws NotFoundException si la variante n'existe pas
   */
  async incrementStock(
    variantId: string,
    quantity: number,
  ): Promise<Variant> {
    const variant = await this.variantRepository.findOne({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }

    variant.stock += quantity;
    await this.variantRepository.save(variant);

    return variant;
  }

  /**
   * Décrémente le stock pour tous les items d'une commande
   * @param orderId - ID de la commande
   * @throws NotFoundException si la commande n'existe pas
   */
  async decrementStockForOrder(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['cart', 'cart.items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (!order.cart || !order.cart.items) {
      return;
    }

    for (const item of order.cart.items) {
      await this.decrementStock(item.variantId, item.quantity);
    }
  }

  /**
   * Incrémente le stock pour tous les items d'une commande (remboursement/annulation)
   * @param orderId - ID de la commande
   * @throws NotFoundException si la commande n'existe pas
   */
  async incrementStockForOrder(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['cart', 'cart.items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (!order.cart || !order.cart.items) {
      return;
    }

    for (const item of order.cart.items) {
      await this.incrementStock(item.variantId, item.quantity);
    }
  }
}
