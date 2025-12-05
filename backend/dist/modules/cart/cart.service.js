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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("../../entities/cart.entity");
const cart_item_entity_1 = require("../../entities/cart-item.entity");
const variant_entity_1 = require("../../entities/variant.entity");
let CartService = class CartService {
    cartRepository;
    cartItemRepository;
    variantRepository;
    constructor(cartRepository, cartItemRepository, variantRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.variantRepository = variantRepository;
    }
    async getOrCreate(sessionId) {
        let cart = await this.cartRepository.findOne({
            where: { sessionId },
            relations: ['items', 'items.variant', 'items.variant.product', 'items.variant.product.images'],
        });
        if (!cart) {
            cart = this.cartRepository.create({ sessionId });
            cart = await this.cartRepository.save(cart);
        }
        return cart;
    }
    async findOne(sessionId) {
        const cart = await this.getOrCreate(sessionId);
        const total = await this.calculateTotal(cart.id);
        return {
            id: cart.id,
            sessionId: cart.sessionId,
            items: cart.items?.map((item) => ({
                id: item.id,
                variantId: item.variantId,
                quantity: item.quantity,
                variant: {
                    id: item.variant.id,
                    color: item.variant.color,
                    size: item.variant.size,
                    stock: item.variant.stock,
                    sku: item.variant.sku,
                    product: {
                        id: item.variant.product.id,
                        name: item.variant.product.name,
                        price: item.variant.product.price.toString(),
                        images: item.variant.product.images?.map((img) => ({
                            url: img.url,
                            alt: img.alt,
                        })),
                    },
                },
                createdAt: item.createdAt,
            })) || [],
            total,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
        };
    }
    async addItem(sessionId, addToCartDto) {
        const cart = await this.getOrCreate(sessionId);
        const variant = await this.variantRepository.findOne({
            where: { id: addToCartDto.variantId },
            relations: ['product'],
        });
        if (!variant) {
            throw new common_1.NotFoundException(`Variant with ID ${addToCartDto.variantId} not found`);
        }
        if (variant.stock < addToCartDto.quantity) {
            throw new common_1.BadRequestException(`Stock insuffisant. Stock disponible : ${variant.stock}`);
        }
        const existingItem = await this.cartItemRepository.findOne({
            where: {
                cartId: cart.id,
                variantId: addToCartDto.variantId,
            },
        });
        if (existingItem) {
            const newQuantity = existingItem.quantity + addToCartDto.quantity;
            if (variant.stock < newQuantity) {
                throw new common_1.BadRequestException(`Stock insuffisant. Stock disponible : ${variant.stock}, quantité demandée : ${newQuantity}`);
            }
            existingItem.quantity = newQuantity;
            return this.cartItemRepository.save(existingItem);
        }
        const cartItem = this.cartItemRepository.create({
            cartId: cart.id,
            variantId: addToCartDto.variantId,
            quantity: addToCartDto.quantity,
        });
        return this.cartItemRepository.save(cartItem);
    }
    async updateItem(itemId, updateCartItemDto) {
        const cartItem = await this.cartItemRepository.findOne({
            where: { id: itemId },
            relations: ['variant'],
        });
        if (!cartItem) {
            throw new common_1.NotFoundException(`Cart item with ID ${itemId} not found`);
        }
        if (!cartItem.variant) {
            throw new common_1.NotFoundException(`Variant not found for cart item ${itemId}`);
        }
        if (cartItem.variant.stock < updateCartItemDto.quantity) {
            throw new common_1.BadRequestException(`Stock insuffisant. Stock disponible : ${cartItem.variant.stock}`);
        }
        cartItem.quantity = updateCartItemDto.quantity;
        return this.cartItemRepository.save(cartItem);
    }
    async removeItem(itemId) {
        const cartItem = await this.cartItemRepository.findOne({
            where: { id: itemId },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException(`Cart item with ID ${itemId} not found`);
        }
        await this.cartItemRepository.remove(cartItem);
    }
    async clear(sessionId) {
        const cart = await this.cartRepository.findOne({
            where: { sessionId },
            relations: ['items'],
        });
        if (cart && cart.items) {
            await this.cartItemRepository.remove(cart.items);
        }
    }
    async calculateTotal(cartId) {
        const items = await this.cartItemRepository.find({
            where: { cartId },
            relations: ['variant', 'variant.product'],
        });
        return items.reduce((total, item) => {
            const price = parseFloat(item.variant.product.price.toString());
            return total + price * item.quantity;
        }, 0);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(2, (0, typeorm_1.InjectRepository)(variant_entity_1.Variant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart.service.js.map