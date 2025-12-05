import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entities/order.entity';
import { Cart } from '../../entities/cart.entity';
import { CartItem } from '../../entities/cart-item.entity';
import { Variant } from '../../entities/variant.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
  ) {}

  /**
   * Crée une commande depuis un panier
   */
  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    // Vérifier que le panier existe et récupérer ses items
    const cart = await this.cartRepository.findOne({
      where: { id: createOrderDto.cartId },
      relations: ['items', 'items.variant', 'items.variant.product'],
    });

    if (!cart) {
      throw new NotFoundException(
        `Cart with ID ${createOrderDto.cartId} not found`,
      );
    }

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Vérifier le stock disponible pour tous les articles
    for (const item of cart.items) {
      const variant = await this.variantRepository.findOne({
        where: { id: item.variantId },
      });

      if (!variant) {
        throw new NotFoundException(
          `Variant with ID ${item.variantId} not found`,
        );
      }

      if (variant.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuffisant pour ${variant.sku}. Stock disponible : ${variant.stock}, quantité demandée : ${item.quantity}`,
        );
      }
    }

    // Calculer le total
    const total = cart.items.reduce((sum, item) => {
      const price = parseFloat(item.variant.product.price.toString());
      return sum + price * item.quantity;
    }, 0);

    // Créer la commande
    const order = this.orderRepository.create({
      cartId: createOrderDto.cartId,
      status: OrderStatus.PENDING,
      total,
      customerInfo: createOrderDto.customerInfo,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Déduire le stock pour chaque variante
    for (const item of cart.items) {
      const variant = await this.variantRepository.findOne({
        where: { id: item.variantId },
      });

      if (variant) {
        variant.stock -= item.quantity;
        await this.variantRepository.save(variant);
      }
    }

    // Retourner la commande avec les relations
    return this.findOne(savedOrder.id);
  }

  /**
   * Récupère une commande par son ID
   */
  async findOne(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['cart', 'cart.items', 'cart.items.variant', 'cart.items.variant.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return {
      id: order.id,
      cartId: order.cartId,
      status: order.status,
      total: parseFloat(order.total.toString()),
      customerInfo: order.customerInfo,
      cart: order.cart
        ? {
            id: order.cart.id,
            sessionId: order.cart.sessionId,
            items: order.cart.items?.map((item) => ({
              id: item.id,
              variantId: item.variantId,
              quantity: item.quantity,
              variant: {
                id: item.variant.id,
                color: item.variant.color,
                size: item.variant.size,
                sku: item.variant.sku,
                product: {
                  id: item.variant.product.id,
                  name: item.variant.product.name,
                  price: item.variant.product.price.toString(),
                },
              },
            })) || [],
          }
        : undefined,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  /**
   * Récupère toutes les commandes
   */
  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      relations: ['cart', 'cart.items', 'cart.items.variant', 'cart.items.variant.product'],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => ({
      id: order.id,
      cartId: order.cartId,
      status: order.status,
      total: parseFloat(order.total.toString()),
      customerInfo: order.customerInfo,
      cart: order.cart
        ? {
            id: order.cart.id,
            sessionId: order.cart.sessionId,
            items: order.cart.items?.map((item) => ({
              id: item.id,
              variantId: item.variantId,
              quantity: item.quantity,
              variant: {
                id: item.variant.id,
                color: item.variant.color,
                size: item.variant.size,
                sku: item.variant.sku,
                product: {
                  id: item.variant.product.id,
                  name: item.variant.product.name,
                  price: item.variant.product.price.toString(),
                },
              },
            })) || [],
          }
        : undefined,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  }

  /**
   * Met à jour le statut d'une commande
   */
  async updateStatus(
    id: string,
    updateStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    order.status = updateStatusDto.status;
    await this.orderRepository.save(order);

    return this.findOne(id);
  }
}
