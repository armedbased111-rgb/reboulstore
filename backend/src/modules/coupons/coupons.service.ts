import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon, DiscountType } from '../../entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CouponResponseDto } from './dto/coupon-response.dto';
import { CouponValidationDto } from './dto/coupon-validation.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  /**
   * Crée un nouveau coupon
   */
  async create(createCouponDto: CreateCouponDto): Promise<CouponResponseDto> {
    // Vérifier que le code n'existe pas déjà
    const existingCoupon = await this.couponRepository.findOne({
      where: { code: createCouponDto.code.toUpperCase() },
    });

    if (existingCoupon) {
      throw new BadRequestException(
        `Coupon with code ${createCouponDto.code} already exists`,
      );
    }

    // Valider la valeur de réduction selon le type
    if (createCouponDto.discountType === DiscountType.PERCENTAGE) {
      if (createCouponDto.discountValue < 0 || createCouponDto.discountValue > 100) {
        throw new BadRequestException(
          'Percentage discount must be between 0 and 100',
        );
      }
    } else if (createCouponDto.discountType === DiscountType.FIXED_AMOUNT) {
      if (createCouponDto.discountValue < 0) {
        throw new BadRequestException(
          'Fixed amount discount must be positive',
        );
      }
    }

    const coupon = this.couponRepository.create({
      ...createCouponDto,
      code: createCouponDto.code.toUpperCase(),
      expiresAt: createCouponDto.expiresAt
        ? new Date(createCouponDto.expiresAt)
        : null,
      maxUses: createCouponDto.maxUses || 0,
      isActive: createCouponDto.isActive !== undefined ? createCouponDto.isActive : true,
    });

    const savedCoupon = await this.couponRepository.save(coupon);
    return this.toResponseDto(savedCoupon);
  }

  /**
   * Récupère tous les coupons
   */
  async findAll(): Promise<CouponResponseDto[]> {
    const coupons = await this.couponRepository.find({
      order: { createdAt: 'DESC' },
    });
    return coupons.map((coupon) => this.toResponseDto(coupon));
  }

  /**
   * Récupère uniquement les coupons actifs (public - pour affichage page d'accueil)
   */
  async findActive(): Promise<CouponResponseDto[]> {
    const now = new Date();
    const coupons = await this.couponRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    // Filtrer les coupons valides (non expirés, pas atteint limite)
    return coupons
      .filter((coupon) => {
        // Vérifier expiration
        if (coupon.expiresAt && new Date(coupon.expiresAt) <= now) {
          return false;
        }
        // Vérifier limite d'utilisations
        if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
          return false;
        }
        return true;
      })
      .map((coupon) => this.toResponseDto(coupon));
  }

  /**
   * Récupère un coupon par son ID
   */
  async findOne(id: string): Promise<CouponResponseDto> {
    const coupon = await this.couponRepository.findOne({ where: { id } });

    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }

    return this.toResponseDto(coupon);
  }

  /**
   * Récupère un coupon par son code
   */
  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with code ${code} not found`);
    }

    return coupon;
  }

  /**
   * Valide un coupon et calcule la réduction pour un montant donné
   */
  async validateCoupon(
    code: string,
    cartTotal: number,
  ): Promise<CouponValidationDto> {
    try {
      const coupon = await this.findByCode(code);

      // Vérifier si le coupon est actif
      if (!coupon.isActive) {
        return {
          isValid: false,
          discountAmount: 0,
          message: 'This coupon is not active',
        };
      }

      // Vérifier si le coupon a expiré
      if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        return {
          isValid: false,
          discountAmount: 0,
          message: 'This coupon has expired',
        };
      }

      // Vérifier si le coupon a atteint son nombre maximum d'utilisations
      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
        return {
          isValid: false,
          discountAmount: 0,
          message: 'This coupon has reached its maximum number of uses',
        };
      }

      // Vérifier le montant minimum d'achat
      if (
        coupon.minPurchaseAmount &&
        cartTotal < parseFloat(coupon.minPurchaseAmount.toString())
      ) {
        return {
          isValid: false,
          discountAmount: 0,
          message: `Minimum purchase amount of ${coupon.minPurchaseAmount}€ required`,
        };
      }

      // Calculer la réduction
      let discountAmount = 0;

      if (coupon.discountType === DiscountType.PERCENTAGE) {
        discountAmount =
          (cartTotal * parseFloat(coupon.discountValue.toString())) / 100;
      } else if (coupon.discountType === DiscountType.FIXED_AMOUNT) {
        discountAmount = parseFloat(coupon.discountValue.toString());
        // La réduction ne peut pas dépasser le montant du panier
        if (discountAmount > cartTotal) {
          discountAmount = cartTotal;
        }
      }

      return {
        isValid: true,
        discountAmount: Math.round(discountAmount * 100) / 100,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          isValid: false,
          discountAmount: 0,
          message: 'Invalid coupon code',
        };
      }
      throw error;
    }
  }

  /**
   * Applique un coupon (incrémente le compteur d'utilisations)
   */
  async applyCoupon(code: string): Promise<void> {
    const coupon = await this.findByCode(code);
    coupon.usedCount += 1;
    await this.couponRepository.save(coupon);
  }

  /**
   * Met à jour un coupon
   */
  async update(
    id: string,
    updateCouponDto: UpdateCouponDto,
  ): Promise<CouponResponseDto> {
    const coupon = await this.couponRepository.findOne({ where: { id } });

    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }

    // Si le code est modifié, vérifier qu'il n'existe pas déjà
    if (updateCouponDto.code && updateCouponDto.code !== coupon.code) {
      const existingCoupon = await this.couponRepository.findOne({
        where: { code: updateCouponDto.code.toUpperCase() },
      });

      if (existingCoupon) {
        throw new BadRequestException(
          `Coupon with code ${updateCouponDto.code} already exists`,
        );
      }
    }

    // Valider la valeur de réduction selon le type
    if (updateCouponDto.discountType === DiscountType.PERCENTAGE) {
      if (
        updateCouponDto.discountValue !== undefined &&
        (updateCouponDto.discountValue < 0 ||
          updateCouponDto.discountValue > 100)
      ) {
        throw new BadRequestException(
          'Percentage discount must be between 0 and 100',
        );
      }
    } else if (updateCouponDto.discountType === DiscountType.FIXED_AMOUNT) {
      if (
        updateCouponDto.discountValue !== undefined &&
        updateCouponDto.discountValue < 0
      ) {
        throw new BadRequestException(
          'Fixed amount discount must be positive',
        );
      }
    }

    // Mettre à jour les champs
    if (updateCouponDto.code) {
      coupon.code = updateCouponDto.code.toUpperCase();
    }
    if (updateCouponDto.discountType) {
      coupon.discountType = updateCouponDto.discountType;
    }
    if (updateCouponDto.discountValue !== undefined) {
      coupon.discountValue = updateCouponDto.discountValue;
    }
    if (updateCouponDto.expiresAt !== undefined) {
      coupon.expiresAt = updateCouponDto.expiresAt
        ? new Date(updateCouponDto.expiresAt)
        : null;
    }
    if (updateCouponDto.maxUses !== undefined) {
      coupon.maxUses = updateCouponDto.maxUses;
    }
    if (updateCouponDto.minPurchaseAmount !== undefined) {
      coupon.minPurchaseAmount = updateCouponDto.minPurchaseAmount;
    }
    if (updateCouponDto.isActive !== undefined) {
      coupon.isActive = updateCouponDto.isActive;
    }

    const savedCoupon = await this.couponRepository.save(coupon);
    return this.toResponseDto(savedCoupon);
  }

  /**
   * Supprime un coupon
   */
  async remove(id: string): Promise<void> {
    const coupon = await this.couponRepository.findOne({ where: { id } });

    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }

    await this.couponRepository.remove(coupon);
  }

  /**
   * Convertit une entité Coupon en DTO
   */
  private toResponseDto(coupon: Coupon): CouponResponseDto {
    return {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: parseFloat(coupon.discountValue.toString()),
      expiresAt: coupon.expiresAt,
      maxUses: coupon.maxUses,
      usedCount: coupon.usedCount,
      minPurchaseAmount: coupon.minPurchaseAmount
        ? parseFloat(coupon.minPurchaseAmount.toString())
        : null,
      isActive: coupon.isActive,
      createdAt: coupon.createdAt,
      updatedAt: coupon.updatedAt,
    };
  }
}

