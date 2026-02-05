import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { QueryFailedError } from 'typeorm';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';

/**
 * Service pour gérer les catégories Reboul depuis l'Admin Centrale
 * 
 * ⚠️ IMPORTANT : Tous les repositories utilisent la connexion 'reboul'
 */
@Injectable()
export class ReboulCategoriesService {
  constructor(
    @InjectRepository(Category, 'reboul')
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product, 'reboul')
    private productRepository: Repository<Product>,
  ) {}

  /**
   * Récupérer toutes les catégories Reboul avec pagination et filtres
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: {
      search?: string;
    },
  ) {
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<Category> = {};

    if (filters?.search) {
      where.name = ILike(`%${filters.search}%`);
    }

    const [categories, total] = await this.categoryRepository.findAndCount({
      where,
      relations: ['products'],
      skip,
      take: limit,
      order: { name: 'ASC' },
    });

    // Compter le nombre de produits par catégorie
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productsCount = await this.productRepository.count({
          where: { categoryId: category.id },
        });
        return {
          ...category,
          productsCount,
        };
      }),
    );

    return {
      data: categoriesWithCount,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Récupérer une catégorie Reboul par ID
   */
  async findOne(id: number | string) {
    const numId = Number(id);
    const category = await this.categoryRepository.findOne({
      where: { id: numId },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
    }

    const productsCount = await this.productRepository.count({
      where: { categoryId: numId },
    });

    return {
      ...category,
      productsCount,
    };
  }

  /**
   * Créer une nouvelle catégorie Reboul
   */
  async create(categoryData: Partial<Category>) {
    const slugProvided = categoryData.slug?.trim();
    if (slugProvided) {
      const existing = await this.categoryRepository.findOne({
        where: { slug: slugProvided },
      });
      if (existing) {
        throw new BadRequestException(
          `Une catégorie avec le slug "${slugProvided}" existe déjà`,
        );
      }
    }

    if (!slugProvided) {
      categoryData.slug = categoryData.name
        ? categoryData.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || undefined
        : undefined;
      if (!categoryData.slug) categoryData.slug = `category-${Date.now()}`;
    } else {
      categoryData.slug = slugProvided;
    }

    const category = this.categoryRepository.create(categoryData);
    try {
      return await this.categoryRepository.save(category);
    } catch (err) {
      const code = err instanceof QueryFailedError ? err.driverError?.code : (err as any)?.code;
      if (code === '23505') {
        throw new BadRequestException(
          'Une catégorie avec ce nom ou ce slug existe déjà.',
        );
      }
      throw err;
    }
  }

  /**
   * Mettre à jour une catégorie Reboul
   */
  async update(id: string, updateData: Partial<Category>) {
    const category = await this.findOne(id);

    // Vérifier que le slug est unique si modifié
    if (updateData.slug && updateData.slug !== category.slug) {
      const existing = await this.categoryRepository.findOne({
        where: { slug: updateData.slug },
      });
      if (existing) {
        throw new BadRequestException(
          `Une catégorie avec le slug "${updateData.slug}" existe déjà`,
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

    Object.assign(category, updateData);
    return this.categoryRepository.save(category);
  }

  /**
   * Supprimer une catégorie Reboul
   */
  async remove(id: number | string) {
    const category = await this.findOne(id);
    const numId = Number(id);
    const productsCount = await this.productRepository.count({
      where: { categoryId: numId },
    });

    if (productsCount > 0) {
      throw new BadRequestException(
        `Impossible de supprimer la catégorie : ${productsCount} produit(s) associé(s)`,
      );
    }

    await this.categoryRepository.remove(category);
    return { message: `Catégorie ${id} supprimée avec succès` };
  }
}
