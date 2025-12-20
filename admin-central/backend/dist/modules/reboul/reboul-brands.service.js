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
exports.ReboulBrandsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const brand_entity_1 = require("./entities/brand.entity");
const product_entity_1 = require("./entities/product.entity");
let ReboulBrandsService = class ReboulBrandsService {
    brandRepository;
    productRepository;
    constructor(brandRepository, productRepository) {
        this.brandRepository = brandRepository;
        this.productRepository = productRepository;
    }
    async findAll(page = 1, limit = 20, filters) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.search) {
            where.name = (0, typeorm_2.ILike)(`%${filters.search}%`);
        }
        const [brands, total] = await this.brandRepository.findAndCount({
            where,
            relations: ['products'],
            skip,
            take: limit,
            order: { name: 'ASC' },
        });
        const brandsWithCount = await Promise.all(brands.map(async (brand) => {
            const productsCount = await this.productRepository.count({
                where: { brandId: brand.id },
            });
            return {
                ...brand,
                productsCount,
            };
        }));
        return {
            data: brandsWithCount,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const brand = await this.brandRepository.findOne({
            where: { id },
            relations: ['products'],
        });
        if (!brand) {
            throw new common_1.NotFoundException(`Marque avec l'ID ${id} non trouvée`);
        }
        const productsCount = await this.productRepository.count({
            where: { brandId: id },
        });
        return {
            ...brand,
            productsCount,
        };
    }
    async create(brandData) {
        if (brandData.slug) {
            const existing = await this.brandRepository.findOne({
                where: { slug: brandData.slug },
            });
            if (existing) {
                throw new common_1.BadRequestException(`Une marque avec le slug "${brandData.slug}" existe déjà`);
            }
        }
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
    async update(id, updateData) {
        const brand = await this.findOne(id);
        if (updateData.slug && updateData.slug !== brand.slug) {
            const existing = await this.brandRepository.findOne({
                where: { slug: updateData.slug },
            });
            if (existing) {
                throw new common_1.BadRequestException(`Une marque avec le slug "${updateData.slug}" existe déjà`);
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
        Object.assign(brand, updateData);
        return this.brandRepository.save(brand);
    }
    async remove(id) {
        const brand = await this.findOne(id);
        const productsCount = await this.productRepository.count({
            where: { brandId: id },
        });
        if (productsCount > 0) {
            throw new common_1.BadRequestException(`Impossible de supprimer la marque : ${productsCount} produit(s) associé(s)`);
        }
        await this.brandRepository.remove(brand);
        return { message: `Marque ${id} supprimée avec succès` };
    }
    async getStats() {
        const brands = await this.brandRepository.find({
            relations: ['products'],
        });
        const stats = await Promise.all(brands.map(async (brand) => {
            const productsCount = await this.productRepository.count({
                where: { brandId: brand.id },
            });
            return {
                brandId: brand.id,
                brandName: brand.name,
                productsCount,
            };
        }));
        return stats;
    }
};
exports.ReboulBrandsService = ReboulBrandsService;
exports.ReboulBrandsService = ReboulBrandsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(brand_entity_1.Brand, 'reboul')),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product, 'reboul')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReboulBrandsService);
//# sourceMappingURL=reboul-brands.service.js.map