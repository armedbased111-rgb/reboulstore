import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon, DiscountType } from './entities/coupon.entity';

/**
 * Service pour gérer les coupons Reboul depuis l'Admin Centrale
 * 
 * ⚠️ IMPORTANT : Tous les repositories utilisent la connexion 'reboul'
 */
@Injectable()
export class ReboulCouponsService {
  constructor(
    @InjectRepository(Coupon, 'reboul')
    private couponRepository: Repository<Coupon>,
  ) {}

  /**
   * Récupère tous les coupons
   */
  async findAll() {
    return this.couponRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Récupère un coupon par son ID
   */
  async findOne(id: string) {
    const coupon = await this.couponRepository.findOne({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon non trouvé');
    }

    return coupon;
  }

  /**
   * Crée un nouveau coupon
   */
  async create(data: {
    code: string;
    discountType: DiscountType;
    discountValue: number;
    expiresAt?: Date | null;
    maxUses?: number;
    minPurchaseAmount?: number | null;
    isActive?: boolean;
  }) {
    // Vérifier que le code n'existe pas déjà
    const existingCoupon = await this.couponRepository.findOne({
      where: { code: data.code.toUpperCase() },
    });

    if (existingCoupon) {
      throw new BadRequestException('Ce code promo existe déjà');
    }

    const coupon = this.couponRepository.create({
      ...data,
      code: data.code.toUpperCase(),
      maxUses: data.maxUses || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
    });

    return this.couponRepository.save(coupon);
  }

  /**
   * Met à jour un coupon
   */
  async update(id: string, data: Partial<{
    code: string;
    discountType: DiscountType;
    discountValue: number;
    expiresAt?: Date | null;
    maxUses?: number;
    minPurchaseAmount?: number | null;
    isActive?: boolean;
  }>) {
    const coupon = await this.findOne(id);

    // Si le code change, vérifier qu'il n'existe pas déjà
    if (data.code && data.code.toUpperCase() !== coupon.code) {
      const existingCoupon = await this.couponRepository.findOne({
        where: { code: data.code.toUpperCase() },
      });

      if (existingCoupon) {
        throw new BadRequestException('Ce code promo existe déjà');
      }
    }

    Object.assign(coupon, {
      ...data,
      code: data.code ? data.code.toUpperCase() : coupon.code,
    });

    return this.couponRepository.save(coupon);
  }

  /**
   * Supprime un coupon
   */
  async remove(id: string) {
    const coupon = await this.findOne(id);
    await this.couponRepository.remove(coupon);
  }
}

