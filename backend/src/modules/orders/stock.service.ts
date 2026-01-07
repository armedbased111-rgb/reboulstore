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
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { Product } from '../../entities/product.entity';

@Injectable()
export class StockService {
  private readonly STOCK_LOW_THRESHOLD = 10; // Seuil pour considérer le stock comme faible

  constructor(
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private notificationsGateway: NotificationsGateway,
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
  async decrementStock(variantId: string, quantity: number): Promise<Variant> {
    const variant = await this.checkStockAvailability(variantId, quantity);

    variant.stock -= quantity;
    const savedVariant = await this.variantRepository.save(variant);

    // Vérifier si le stock est maintenant faible et notifier les admins
    if (savedVariant.stock <= this.STOCK_LOW_THRESHOLD) {
      const product = await this.productRepository.findOne({
        where: { id: savedVariant.productId },
      });

      if (product) {
        this.notificationsGateway.notifyProductStockLow({
          id: product.id,
          name: product.name,
          variantId: savedVariant.id,
          variantName: `${savedVariant.color} - ${savedVariant.size}`,
          stock: savedVariant.stock,
        });
      }
    }

    return savedVariant;
  }

  /**
   * Incrémente le stock d'une variante
   * @param variantId - ID de la variante
   * @param quantity - Quantité à incrémenter
   * @returns La variante mise à jour
   * @throws NotFoundException si la variante n'existe pas
   */
  async incrementStock(variantId: string, quantity: number): Promise<Variant> {
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

    // Pour les commandes depuis Stripe Checkout (sans cart), utiliser order.items
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        await this.decrementStock(item.variantId, item.quantity);
      }
      return;
    }

    // Pour les commandes depuis un panier, utiliser cart.items
    if (order.cart && order.cart.items && order.cart.items.length > 0) {
      for (const item of order.cart.items) {
        await this.decrementStock(item.variantId, item.quantity);
      }
      return;
    }

    // Aucun item trouvé
    throw new BadRequestException(
      `Order ${orderId} has no items (neither in cart nor in items field)`,
    );
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

    // Pour les commandes depuis Stripe Checkout (sans cart), utiliser order.items
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        await this.incrementStock(item.variantId, item.quantity);
      }
      return;
    }

    // Pour les commandes depuis un panier, utiliser cart.items
    if (order.cart && order.cart.items && order.cart.items.length > 0) {
      for (const item of order.cart.items) {
        await this.incrementStock(item.variantId, item.quantity);
      }
      return;
    }

    // Aucun item trouvé
    throw new BadRequestException(
      `Order ${orderId} has no items (neither in cart nor in items field)`,
    );
  }
}
