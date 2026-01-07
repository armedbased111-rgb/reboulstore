"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const category_entity_1 = require("../../entities/category.entity");
let CategoriesService = class CategoriesService {
    categoryRepository;
    cacheManager;
    constructor(categoryRepository, cacheManager) {
        this.categoryRepository = categoryRepository;
        this.cacheManager = cacheManager;
    }
    async findAll() {
        const cacheKey = 'categories:all';
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const categories = await this.categoryRepository.find({
            order: { name: 'ASC' },
        });
        await this.cacheManager.set(cacheKey, categories, 600);
        return categories;
    }
    async findOne(id) {
        const cacheKey = `category:${id}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const category = await this.categoryRepository.findOne({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        await this.cacheManager.set(cacheKey, category, 600);
        return category;
    }
    async findBySlug(slug) {
        const cacheKey = `category:slug:${slug}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const category = await this.categoryRepository.findOne({
            where: { slug },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with slug ${slug} not found`);
        }
        await this.cacheManager.set(cacheKey, category, 600);
        return category;
    }
    async create(createCategoryDto) {
        const category = this.categoryRepository.create(createCategoryDto);
        const savedCategory = await this.categoryRepository.save(category);
        await this.invalidateCategoriesCache();
        return savedCategory;
    }
    async update(id, updateCategoryDto) {
        const category = await this.findOne(id);
        Object.assign(category, updateCategoryDto);
        const savedCategory = await this.categoryRepository.save(category);
        await this.cacheManager.del(`category:${id}`);
        if (category.slug) {
            await this.cacheManager.del(`category:slug:${category.slug}`);
        }
        await this.invalidateCategoriesCache();
        return savedCategory;
    }
    async remove(id) {
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category);
        await this.cacheManager.del(`category:${id}`);
        if (category.slug) {
            await this.cacheManager.del(`category:slug:${category.slug}`);
        }
        await this.invalidateCategoriesCache();
    }
    async invalidateCategoriesCache() {
        await this.cacheManager.del('categories:all');
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map