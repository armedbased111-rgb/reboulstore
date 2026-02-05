import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<Category[]> {
    const cacheKey = 'categories:all';
    
    // Vérifier le cache
    const cached = await this.cacheManager.get<Category[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const categories = await this.categoryRepository.find({
      order: { name: 'ASC' },
    });

    // Mettre en cache (TTL 10 minutes = 600 secondes)
    await this.cacheManager.set(cacheKey, categories, 600);

    return categories;
  }

  async findOne(id: number): Promise<Category> {
    const cacheKey = `category:${id}`;
    
    // Vérifier le cache
    const cached = await this.cacheManager.get<Category>(cacheKey);
    if (cached) {
      return cached;
    }

    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Mettre en cache (TTL 10 minutes = 600 secondes)
    await this.cacheManager.set(cacheKey, category, 600);

    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const cacheKey = `category:slug:${slug}`;
    
    // Vérifier le cache
    const cached = await this.cacheManager.get<Category>(cacheKey);
    if (cached) {
      return cached;
    }

    const category = await this.categoryRepository.findOne({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    // Mettre en cache (TTL 10 minutes = 600 secondes)
    await this.cacheManager.set(cacheKey, category, 600);

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);
    
    // Invalider le cache des catégories
    await this.invalidateCategoriesCache();
    
    return savedCategory;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);
    
    // Invalider le cache de la catégorie spécifique et de la liste
    await this.cacheManager.del(`category:${id}`);
    if (category.slug) {
      await this.cacheManager.del(`category:slug:${category.slug}`);
    }
    await this.invalidateCategoriesCache();
    
    return savedCategory;
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    
    // Invalider le cache de la catégorie spécifique et de la liste
    await this.cacheManager.del(`category:${id}`);
    if (category.slug) {
      await this.cacheManager.del(`category:slug:${category.slug}`);
    }
    await this.invalidateCategoriesCache();
  }

  /**
   * Invalide le cache de toutes les catégories
   * Utilisé après create, update, delete
   */
  private async invalidateCategoriesCache(): Promise<void> {
    await this.cacheManager.del('categories:all');
  }
}
