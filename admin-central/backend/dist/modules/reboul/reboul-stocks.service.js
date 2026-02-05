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
exports.ReboulStocksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const variant_entity_1 = require("./entities/variant.entity");
const product_entity_1 = require("./entities/product.entity");
let ReboulStocksService = class ReboulStocksService {
    variantRepository;
    productRepository;
    constructor(variantRepository, productRepository) {
        this.variantRepository = variantRepository;
        this.productRepository = productRepository;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.productId != null) {
            where.productId = Number(filters.productId);
        }
        if (filters?.outOfStock) {
            where.stock = 0;
        }
        else if (filters?.lowStock) {
            where.stock = (0, typeorm_2.LessThanOrEqual)(5);
        }
        const variants = await this.variantRepository.find({
            where,
            relations: ['product', 'product.brand', 'product.category'],
            order: { stock: 'ASC' },
        });
        return variants;
    }
    async findOne(variantId) {
        const numId = Number(variantId);
        const variant = await this.variantRepository.findOne({
            where: { id: numId },
            relations: ['product'],
        });
        if (!variant) {
            throw new common_1.NotFoundException(`Variant avec l'ID ${variantId} non trouvé`);
        }
        return variant;
    }
    async updateStock(variantId, stock) {
        if (stock < 0) {
            throw new Error('Le stock ne peut pas être négatif');
        }
        const variant = await this.findOne(variantId);
        variant.stock = stock;
        return this.variantRepository.save(variant);
    }
    async getStats() {
        const total = await this.variantRepository.count();
        const outOfStock = await this.variantRepository.count({
            where: { stock: 0 },
        });
        const lowStock = await this.variantRepository.count({
            where: { stock: (0, typeorm_2.LessThanOrEqual)(5) },
        });
        const inStock = total - outOfStock;
        return {
            total,
            inStock,
            lowStock,
            outOfStock,
        };
    }
};
exports.ReboulStocksService = ReboulStocksService;
exports.ReboulStocksService = ReboulStocksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(variant_entity_1.Variant, 'reboul')),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product, 'reboul')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReboulStocksService);
//# sourceMappingURL=reboul-stocks.service.js.map