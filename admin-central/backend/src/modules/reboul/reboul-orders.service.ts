import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { User } from './entities/user.entity';

/**
 * Service pour gérer les commandes Reboul depuis l'Admin Centrale
 * 
 * ⚠️ IMPORTANT : Tous les repositories utilisent la connexion 'reboul'
 */
@Injectable()
export class ReboulOrdersService {
  constructor(
    @InjectRepository(Order, 'reboul')
    private orderRepository: Repository<Order>,
    @InjectRepository(User, 'reboul')
    private userRepository: Repository<User>,
  ) {}

  /**
   * Récupérer toutes les commandes Reboul avec pagination et filtres
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: OrderStatus;
      userId?: number | string;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<Order> = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.userId != null) {
      where.userId = Number(filters.userId);
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = Between(
        filters.startDate ?? new Date(0),
        filters.endDate ?? new Date(),
      );
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['user', 'cart', 'cart.items', 'cart.items.variant', 'cart.items.variant.product'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Récupérer une commande Reboul par ID
   */
  async findOne(id: number | string) {
    const numId = Number(id);
    const order = await this.orderRepository.findOne({
      where: { id: numId },
      relations: ['user', 'cart', 'cart.items', 'cart.items.variant', 'cart.items.variant.product'],
    });

    if (!order) {
      throw new NotFoundException(`Commande avec l'ID ${id} non trouvée`);
    }

    return order;
  }

  /**
   * Changer le statut d'une commande Reboul
   */
  async updateStatus(id: number | string, status: OrderStatus) {
    const order = await this.findOne(id);

    // Validation des transitions de statut
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
      [OrderStatus.PAID]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED, OrderStatus.REFUNDED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: [],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED], // @deprecated mais toujours dans l'enum
    };

    const allowedStatuses = validTransitions[order.status];
    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException(
        `Transition de statut invalide : ${order.status} → ${status}`,
      );
    }

    order.status = status;

    // Mettre à jour les dates selon le statut
    if (status === OrderStatus.PAID && !order.paidAt) {
      order.paidAt = new Date();
    } else if (status === OrderStatus.SHIPPED && !order.shippedAt) {
      order.shippedAt = new Date();
    } else if (status === OrderStatus.DELIVERED && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    return this.orderRepository.save(order);
  }

  /**
   * Ajouter un numéro de tracking à une commande
   */
  async addTracking(id: string, trackingNumber: string) {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.SHIPPED && order.status !== OrderStatus.PROCESSING) {
      throw new BadRequestException(
        `Impossible d'ajouter un tracking : la commande doit être en statut SHIPPED ou PROCESSING`,
      );
    }

    order.trackingNumber = trackingNumber;
    if (order.status === OrderStatus.PROCESSING) {
      order.status = OrderStatus.SHIPPED;
      order.shippedAt = new Date();
    }

    return this.orderRepository.save(order);
  }

  /**
   * Statistiques commandes Reboul
   */
  async getStats() {
    const total = await this.orderRepository.count();
    const byStatus = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(order.total)', 'total')
      .groupBy('order.status')
      .getRawMany();

    const totalRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.status IN (:...statuses)', {
        statuses: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
      })
      .getRawOne();

    return {
      total,
      byStatus,
      totalRevenue: parseFloat(totalRevenue?.total || '0'),
    };
  }
}
