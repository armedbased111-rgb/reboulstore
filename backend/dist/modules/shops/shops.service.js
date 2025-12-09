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
exports.ShopsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shop_entity_1 = require("../../entities/shop.entity");
let ShopsService = class ShopsService {
    shopRepository;
    constructor(shopRepository) {
        this.shopRepository = shopRepository;
    }
    async findAll() {
        return this.shopRepository.find({
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        const shop = await this.shopRepository.findOne({
            where: { id },
        });
        if (!shop) {
            throw new common_1.NotFoundException(`Shop with ID ${id} not found`);
        }
        return shop;
    }
    async findBySlug(slug) {
        const shop = await this.shopRepository.findOne({
            where: { slug },
        });
        if (!shop) {
            throw new common_1.NotFoundException(`Shop with slug ${slug} not found`);
        }
        return shop;
    }
    async create(createShopDto) {
        const shop = this.shopRepository.create(createShopDto);
        return this.shopRepository.save(shop);
    }
    async update(id, updateShopDto) {
        const shop = await this.findOne(id);
        Object.assign(shop, updateShopDto);
        return this.shopRepository.save(shop);
    }
    async remove(id) {
        const shop = await this.findOne(id);
        await this.shopRepository.remove(shop);
    }
};
exports.ShopsService = ShopsService;
exports.ShopsService = ShopsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shop_entity_1.Shop)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ShopsService);
//# sourceMappingURL=shops.service.js.map