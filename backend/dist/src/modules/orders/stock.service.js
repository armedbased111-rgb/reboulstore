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
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const variant_entity_1 = require("../../entities/variant.entity");
const order_entity_1 = require("../../entities/order.entity");
const cart_item_entity_1 = require("../../entities/cart-item.entity");
let StockService = class StockService {
    variantRepository;
    orderRepository;
    cartItemRepository;
    constructor(variantRepository, orderRepository, cartItemRepository) {
        this.variantRepository = variantRepository;
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
    }
    async checkStockAvailability(variantId, quantity) {
        const variant = await this.variantRepository.findOne({
            where: { id: variantId },
        });
        if (!variant) {
            throw new common_1.NotFoundException(`Variant with ID ${variantId} not found`);
        }
        if (variant.stock < quantity) {
            throw new common_1.BadRequestException(`Stock insuffisant pour ${variant.sku}. Stock disponible : ${variant.stock}, quantité demandée : ${quantity}`);
        }
        return variant;
    }
    async decrementStock(variantId, quantity) {
        const variant = await this.checkStockAvailability(variantId, quantity);
        variant.stock -= quantity;
        await this.variantRepository.save(variant);
        return variant;
    }
    async incrementStock(variantId, quantity) {
        const variant = await this.variantRepository.findOne({
            where: { id: variantId },
        });
        if (!variant) {
            throw new common_1.NotFoundException(`Variant with ID ${variantId} not found`);
        }
        variant.stock += quantity;
        await this.variantRepository.save(variant);
        return variant;
    }
    async decrementStockForOrder(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['cart', 'cart.items'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
        }
        if (!order.cart || !order.cart.items) {
            return;
        }
        for (const item of order.cart.items) {
            await this.decrementStock(item.variantId, item.quantity);
        }
    }
    async incrementStockForOrder(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['cart', 'cart.items'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
        }
        if (!order.cart || !order.cart.items) {
            return;
        }
        for (const item of order.cart.items) {
            await this.incrementStock(item.variantId, item.quantity);
        }
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(variant_entity_1.Variant)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StockService);
//# sourceMappingURL=stock.service.js.map