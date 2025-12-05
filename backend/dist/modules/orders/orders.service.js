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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../../entities/order.entity");
const cart_entity_1 = require("../../entities/cart.entity");
const cart_item_entity_1 = require("../../entities/cart-item.entity");
const variant_entity_1 = require("../../entities/variant.entity");
let OrdersService = class OrdersService {
    orderRepository;
    cartRepository;
    cartItemRepository;
    variantRepository;
    constructor(orderRepository, cartRepository, cartItemRepository, variantRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.variantRepository = variantRepository;
    }
    async create(createOrderDto) {
        const cart = await this.cartRepository.findOne({
            where: { id: createOrderDto.cartId },
            relations: ['items', 'items.variant', 'items.variant.product'],
        });
        if (!cart) {
            throw new common_1.NotFoundException(`Cart with ID ${createOrderDto.cartId} not found`);
        }
        if (!cart.items || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        for (const item of cart.items) {
            const variant = await this.variantRepository.findOne({
                where: { id: item.variantId },
            });
            if (!variant) {
                throw new common_1.NotFoundException(`Variant with ID ${item.variantId} not found`);
            }
            if (variant.stock < item.quantity) {
                throw new common_1.BadRequestException(`Stock insuffisant pour ${variant.sku}. Stock disponible : ${variant.stock}, quantité demandée : ${item.quantity}`);
            }
        }
        const total = cart.items.reduce((sum, item) => {
            const price = parseFloat(item.variant.product.price.toString());
            return sum + price * item.quantity;
        }, 0);
        const order = this.orderRepository.create({
            cartId: createOrderDto.cartId,
            status: order_entity_1.OrderStatus.PENDING,
            total,
            customerInfo: createOrderDto.customerInfo,
        });
        const savedOrder = await this.orderRepository.save(order);
        for (const item of cart.items) {
            const variant = await this.variantRepository.findOne({
                where: { id: item.variantId },
            });
            if (variant) {
                variant.stock -= item.quantity;
                await this.variantRepository.save(variant);
            }
        }
        return this.findOne(savedOrder.id);
    }
    async findOne(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['cart', 'cart.items', 'cart.items.variant', 'cart.items.variant.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return {
            id: order.id,
            cartId: order.cartId,
            status: order.status,
            total: parseFloat(order.total.toString()),
            customerInfo: order.customerInfo,
            cart: order.cart
                ? {
                    id: order.cart.id,
                    sessionId: order.cart.sessionId,
                    items: order.cart.items?.map((item) => ({
                        id: item.id,
                        variantId: item.variantId,
                        quantity: item.quantity,
                        variant: {
                            id: item.variant.id,
                            color: item.variant.color,
                            size: item.variant.size,
                            sku: item.variant.sku,
                            product: {
                                id: item.variant.product.id,
                                name: item.variant.product.name,
                                price: item.variant.product.price.toString(),
                            },
                        },
                    })) || [],
                }
                : undefined,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }
    async findAll() {
        const orders = await this.orderRepository.find({
            relations: ['cart', 'cart.items', 'cart.items.variant', 'cart.items.variant.product'],
            order: { createdAt: 'DESC' },
        });
        return orders.map((order) => ({
            id: order.id,
            cartId: order.cartId,
            status: order.status,
            total: parseFloat(order.total.toString()),
            customerInfo: order.customerInfo,
            cart: order.cart
                ? {
                    id: order.cart.id,
                    sessionId: order.cart.sessionId,
                    items: order.cart.items?.map((item) => ({
                        id: item.id,
                        variantId: item.variantId,
                        quantity: item.quantity,
                        variant: {
                            id: item.variant.id,
                            color: item.variant.color,
                            size: item.variant.size,
                            sku: item.variant.sku,
                            product: {
                                id: item.variant.product.id,
                                name: item.variant.product.name,
                                price: item.variant.product.price.toString(),
                            },
                        },
                    })) || [],
                }
                : undefined,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        }));
    }
    async updateStatus(id, updateStatusDto) {
        const order = await this.orderRepository.findOne({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        order.status = updateStatusDto.status;
        await this.orderRepository.save(order);
        return this.findOne(id);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(2, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(3, (0, typeorm_1.InjectRepository)(variant_entity_1.Variant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map