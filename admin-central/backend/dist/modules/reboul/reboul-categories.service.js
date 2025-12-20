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
exports.ReboulCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./entities/category.entity");
const product_entity_1 = require("./entities/product.entity");
let ReboulCategoriesService = class ReboulCategoriesService {
    categoryRepository;
    productRepository;
    constructor(categoryRepository, productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }
    async findAll(page = 1, limit = 20, filters) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.search) {
            where.name = (0, typeorm_2.ILike)(`%${filters.search}%`);
        }
        const [categories, total] = await this.categoryRepository.findAndCount({
            where,
            relations: ['products'],
            skip,
            take: limit,
            order: { name: 'ASC' },
        });
        const categoriesWithCount = await Promise.all(categories.map(async (category) => {
            const productsCount = await this.productRepository.count({
                where: { categoryId: category.id },
            });
            return {
                ...category,
                productsCount,
            };
        }));
        return {
            data: categoriesWithCount,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['products'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
        }
        const productsCount = await this.productRepository.count({
            where: { categoryId: id },
        });
        return {
            ...category,
            productsCount,
        };
    }
    async create(categoryData) {
        if (categoryData.slug) {
            const existing = await this.categoryRepository.findOne({
                where: { slug: categoryData.slug },
            });
            if (existing) {
                throw new common_1.BadRequestException(`Une catégorie avec le slug "${categoryData.slug}" existe déjà`);
            }
        }
        if (!categoryData.slug && categoryData.name) {
            categoryData.slug = categoryData.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }
        const category = this.categoryRepository.create(categoryData);
        return this.categoryRepository.save(category);
    }
    async update(id, updateData) {
        const category = await this.findOne(id);
        if (updateData.slug && updateData.slug !== category.slug) {
            const existing = await this.categoryRepository.findOne({
                where: { slug: updateData.slug },
            });
            if (existing) {
                throw new common_1.BadRequestException(`Une catégorie avec le slug "${updateData.slug}" existe déjà`);
            }
        }
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
    async remove(id) {
        const category = await this.findOne(id);
        const productsCount = await this.productRepository.count({
            where: { categoryId: id },
        });
        if (productsCount > 0) {
            throw new common_1.BadRequestException(`Impossible de supprimer la catégorie : ${productsCount} produit(s) associé(s)`);
        }
        await this.categoryRepository.remove(category);
        return { message: `Catégorie ${id} supprimée avec succès` };
    }
};
exports.ReboulCategoriesService = ReboulCategoriesService;
exports.ReboulCategoriesService = ReboulCategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category, 'reboul')),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product, 'reboul')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReboulCategoriesService);
//# sourceMappingURL=reboul-categories.service.js.map