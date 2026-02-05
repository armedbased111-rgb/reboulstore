import { Repository } from 'typeorm';
import type { Cache } from 'cache-manager';
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private categoryRepository;
    private cacheManager;
    constructor(categoryRepository: Repository<Category>, cacheManager: Cache);
    findAll(): Promise<Category[]>;
    findOne(id: number): Promise<Category>;
    findBySlug(slug: string): Promise<Category>;
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    remove(id: number): Promise<void>;
    private invalidateCategoriesCache;
}
