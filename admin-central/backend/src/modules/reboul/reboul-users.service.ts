import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { Order, OrderStatus } from './entities/order.entity';

/**
 * Service pour gérer les utilisateurs Reboul depuis l'Admin Centrale
 * 
 * ⚠️ IMPORTANT : Tous les repositories utilisent la connexion 'reboul'
 */
@Injectable()
export class ReboulUsersService {
  constructor(
    @InjectRepository(User, 'reboul')
    private userRepository: Repository<User>,
    @InjectRepository(Order, 'reboul')
    private orderRepository: Repository<Order>,
  ) {}

  /**
   * Récupérer tous les utilisateurs Reboul avec pagination et filtres
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: {
      role?: UserRole;
      search?: string;
    },
  ) {
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<User> = {};

    if (filters?.role) {
      where.role = filters.role;
    }

    if (filters?.search) {
      where.email = ILike(`%${filters.search}%`);
    }

    const [users, total] = await this.userRepository.findAndCount({
      where,
      relations: ['addresses', 'orders'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    // Ne pas retourner les mots de passe
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return {
      data: usersWithoutPassword,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Récupérer un utilisateur Reboul par ID
   */
  async findOne(id: number | string) {
    const numId = Number(id);
    const user = await this.userRepository.findOne({
      where: { id: numId },
      relations: ['addresses', 'orders'],
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    // Ne pas retourner le mot de passe
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Changer le rôle d'un utilisateur Reboul
   */
  async updateRole(id: number | string, role: UserRole) {
    const user = await this.findOne(id);

    // Validation : ne pas permettre de changer le rôle en SUPER_ADMIN depuis l'admin normale
    // (seul un SUPER_ADMIN peut le faire)
    if (role === UserRole.SUPER_ADMIN) {
      throw new BadRequestException(
        'Impossible de promouvoir un utilisateur en SUPER_ADMIN depuis cette interface',
      );
    }

    user.role = role;
    return this.userRepository.save(user);
  }

  /**
   * Supprimer un utilisateur Reboul
   */
  async remove(id: number | string) {
    const user = await this.findOne(id);
    const numId = Number(id);
    const activeOrders = await this.orderRepository.count({
      where: [
        { userId: numId, status: OrderStatus.PENDING },
        { userId: numId, status: OrderStatus.PAID },
        { userId: numId, status: OrderStatus.PROCESSING },
      ],
    });

    if (activeOrders > 0) {
      throw new BadRequestException(
        `Impossible de supprimer l'utilisateur : ${activeOrders} commande(s) en cours`,
      );
    }

    await this.userRepository.remove(user);
    return { message: `Utilisateur ${id} supprimé avec succès` };
  }

  /**
   * Statistiques utilisateurs Reboul
   */
  async getStats() {
    const total = await this.userRepository.count();
    const byRole = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    const withOrders = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.orders', 'order')
      .getCount();

    return {
      total,
      byRole,
      withOrders,
      withoutOrders: total - withOrders,
    };
  }
}
