import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, LessThanOrEqual } from 'typeorm';
import { Variant } from './entities/variant.entity';
import { Product } from './entities/product.entity';

/**
 * Service pour gérer les stocks Reboul depuis l'Admin Centrale
 * 
 * ⚠️ IMPORTANT : Tous les repositories utilisent la connexion 'reboul'
 */
@Injectable()
export class ReboulStocksService {
  constructor(
    @InjectRepository(Variant, 'reboul')
    private variantRepository: Repository<Variant>,
    @InjectRepository(Product, 'reboul')
    private productRepository: Repository<Product>,
  ) {}

  /**
   * Récupérer tous les stocks Reboul avec filtres
   */
  async findAll(filters?: {
    lowStock?: boolean; // Stock ≤ 5
    outOfStock?: boolean; // Stock = 0
    productId?: string;
  }) {
    const where: FindOptionsWhere<Variant> = {};

    if (filters?.productId) {
      where.productId = filters.productId;
    }

    if (filters?.outOfStock) {
      where.stock = 0;
    } else if (filters?.lowStock) {
      where.stock = LessThanOrEqual(5);
    }

    const variants = await this.variantRepository.find({
      where,
      relations: ['product', 'product.brand', 'product.category'],
      order: { stock: 'ASC' },
    });

    return variants;
  }

  /**
   * Récupérer le stock d'un variant spécifique
   */
  async findOne(variantId: string) {
    const variant = await this.variantRepository.findOne({
      where: { id: variantId },
      relations: ['product'],
    });

    if (!variant) {
      throw new NotFoundException(`Variant avec l'ID ${variantId} non trouvé`);
    }

    return variant;
  }

  /**
   * Mettre à jour le stock d'un variant
   */
  async updateStock(variantId: string, stock: number) {
    if (stock < 0) {
      throw new Error('Le stock ne peut pas être négatif');
    }

    const variant = await this.findOne(variantId);
    variant.stock = stock;
    return this.variantRepository.save(variant);
  }

  /**
   * Statistiques stocks Reboul
   */
  async getStats() {
    const total = await this.variantRepository.count();
    const outOfStock = await this.variantRepository.count({
      where: { stock: 0 },
    });
    const lowStock = await this.variantRepository.count({
      where: { stock: LessThanOrEqual(5) },
    });
    const inStock = total - outOfStock;

    return {
      total,
      inStock,
      lowStock,
      outOfStock,
    };
  }
}
