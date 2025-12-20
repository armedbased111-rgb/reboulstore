import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { Product } from './entities/product.entity';

/**
 * Service pour gérer les marques Reboul depuis l'Admin Centrale
 * 
 * ⚠️ IMPORTANT : Tous les repositories utilisent la connexion 'reboul'
 */
@Injectable()
export class ReboulBrandsService {
  constructor(
    @InjectRepository(Brand, 'reboul')
    private brandRepository: Repository<Brand>,
    @InjectRepository(Product, 'reboul')
    private productRepository: Repository<Product>,
  ) {}

  /**
   * Récupérer toutes les marques Reboul avec pagination et filtres
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: {
      search?: string;
    },
  ) {
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<Brand> = {};

    if (filters?.search) {
      where.name = ILike(`%${filters.search}%`);
    }

    const [brands, total] = await this.brandRepository.findAndCount({
      where,
      relations: ['products'],
      skip,
      take: limit,
      order: { name: 'ASC' },
    });

    // Compter le nombre de produits par marque
    const brandsWithCount = await Promise.all(
      brands.map(async (brand) => {
        const productsCount = await this.productRepository.count({
          where: { brandId: brand.id },
        });
        return {
          ...brand,
          productsCount,
        };
      }),
    );

    return {
      data: brandsWithCount,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Récupérer une marque Reboul par ID
   */
  async findOne(id: string) {
    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!brand) {
      throw new NotFoundException(`Marque avec l'ID ${id} non trouvée`);
    }

    // Compter le nombre de produits
    const productsCount = await this.productRepository.count({
      where: { brandId: id },
    });

    return {
      ...brand,
      productsCount,
    };
  }

  /**
   * Créer une nouvelle marque Reboul
   */
  async create(brandData: Partial<Brand>) {
    // Vérifier que le slug est unique
    if (brandData.slug) {
      const existing = await this.brandRepository.findOne({
        where: { slug: brandData.slug },
      });
      if (existing) {
        throw new BadRequestException(
          `Une marque avec le slug "${brandData.slug}" existe déjà`,
        );
      }
    }

    // Générer le slug depuis le nom si non fourni
    if (!brandData.slug && brandData.name) {
      brandData.slug = brandData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const brand = this.brandRepository.create(brandData);
    return this.brandRepository.save(brand);
  }

  /**
   * Mettre à jour une marque Reboul
   */
  async update(id: string, updateData: Partial<Brand>) {
    const brand = await this.findOne(id);

    // Vérifier que le slug est unique si modifié
    if (updateData.slug && updateData.slug !== brand.slug) {
      const existing = await this.brandRepository.findOne({
        where: { slug: updateData.slug },
      });
      if (existing) {
        throw new BadRequestException(
          `Une marque avec le slug "${updateData.slug}" existe déjà`,
        );
      }
    }

    // Générer le slug depuis le nom si modifié et slug non fourni
    if (updateData.name && !updateData.slug) {
      updateData.slug = updateData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    Object.assign(brand, updateData);
    return this.brandRepository.save(brand);
  }

  /**
   * Supprimer une marque Reboul
   */
  async remove(id: string) {
    const brand = await this.findOne(id);

    // Vérifier qu'il n'y a pas de produits associés
    const productsCount = await this.productRepository.count({
      where: { brandId: id },
    });

    if (productsCount > 0) {
      throw new BadRequestException(
        `Impossible de supprimer la marque : ${productsCount} produit(s) associé(s)`,
      );
    }

    await this.brandRepository.remove(brand);
    return { message: `Marque ${id} supprimée avec succès` };
  }

  /**
   * Statistiques par marque (nombre produits)
   */
  async getStats() {
    const brands = await this.brandRepository.find({
      relations: ['products'],
    });

    const stats = await Promise.all(
      brands.map(async (brand) => {
        const productsCount = await this.productRepository.count({
          where: { brandId: brand.id },
        });
        return {
          brandId: brand.id,
          brandName: brand.name,
          productsCount,
        };
      }),
    );

    return stats;
  }
}
