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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
const order_entity_1 = require("../../entities/order.entity");
const cart_entity_1 = require("../../entities/cart.entity");
const cart_item_entity_1 = require("../../entities/cart-item.entity");
const variant_entity_1 = require("../../entities/variant.entity");
const user_entity_1 = require("../../entities/user.entity");
const stock_service_1 = require("./stock.service");
const email_service_1 = require("./email.service");
let OrdersService = OrdersService_1 = class OrdersService {
    orderRepository;
    cartRepository;
    cartItemRepository;
    variantRepository;
    userRepository;
    stockService;
    emailService;
    configService;
    stripe;
    logger = new common_1.Logger(OrdersService_1.name);
    constructor(orderRepository, cartRepository, cartItemRepository, variantRepository, userRepository, stockService, emailService, configService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.variantRepository = variantRepository;
        this.userRepository = userRepository;
        this.stockService = stockService;
        this.emailService = emailService;
        this.configService = configService;
        const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (stripeSecretKey) {
            this.stripe = new stripe_1.default(stripeSecretKey, {
                apiVersion: '2025-11-17.clover',
            });
        }
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
            await this.stockService.checkStockAvailability(item.variantId, item.quantity);
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
        const orderWithRelations = await this.orderRepository.findOne({
            where: { id: savedOrder.id },
            relations: ['user'],
        });
        if (orderWithRelations) {
            this.emailService.sendOrderConfirmation(orderWithRelations);
        }
        return this.findOne(savedOrder.id);
    }
    async checkOrderAccess(order, userId) {
        if (!userId) {
            return;
        }
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.ForbiddenException('User not found');
        }
        if (user.role === user_entity_1.UserRole.ADMIN || user.role === user_entity_1.UserRole.SUPER_ADMIN) {
            return;
        }
        if (order.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this order');
        }
    }
    async findOneEntity(id, userId) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: [
                'cart',
                'cart.items',
                'cart.items.variant',
                'cart.items.variant.product',
                'user',
            ],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        if (userId) {
            await this.checkOrderAccess(order, userId);
        }
        return order;
    }
    async findOne(id, userId) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: [
                'cart',
                'cart.items',
                'cart.items.variant',
                'cart.items.variant.product',
                'user',
            ],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        if (userId) {
            await this.checkOrderAccess(order, userId);
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
            relations: ['cart', 'cart.items'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        const oldStatus = order.status;
        const newStatus = updateStatusDto.status;
        if (newStatus === order_entity_1.OrderStatus.PAID && oldStatus !== order_entity_1.OrderStatus.PAID) {
            await this.stockService.decrementStockForOrder(id);
            order.paidAt = new Date();
        }
        if ((newStatus === order_entity_1.OrderStatus.CANCELLED ||
            newStatus === order_entity_1.OrderStatus.REFUNDED) &&
            (oldStatus === order_entity_1.OrderStatus.PAID || oldStatus === order_entity_1.OrderStatus.PROCESSING)) {
            await this.stockService.incrementStockForOrder(id);
        }
        if (newStatus === order_entity_1.OrderStatus.SHIPPED && oldStatus !== order_entity_1.OrderStatus.SHIPPED) {
            order.shippedAt = new Date();
        }
        if (newStatus === order_entity_1.OrderStatus.DELIVERED &&
            oldStatus !== order_entity_1.OrderStatus.DELIVERED) {
            order.deliveredAt = new Date();
        }
        order.status = newStatus;
        const savedOrder = await this.orderRepository.save(order);
        const orderWithRelations = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'cart', 'cart.items'],
        });
        if (orderWithRelations) {
            if (newStatus === order_entity_1.OrderStatus.SHIPPED) {
                this.emailService.sendShippingNotification(orderWithRelations);
            }
            else if (newStatus === order_entity_1.OrderStatus.DELIVERED) {
                this.emailService.sendOrderDelivered(orderWithRelations);
            }
            else if (newStatus === order_entity_1.OrderStatus.CANCELLED ||
                newStatus === order_entity_1.OrderStatus.REFUNDED) {
                this.emailService.sendOrderCancelled(orderWithRelations);
            }
        }
        return this.findOne(id);
    }
    async findByUser(userId) {
        const orders = await this.orderRepository.find({
            where: { userId },
            relations: [
                'cart',
                'cart.items',
                'cart.items.variant',
                'cart.items.variant.product',
            ],
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
    async cancel(id, userId) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        await this.checkOrderAccess(order, userId);
        if (order.status === order_entity_1.OrderStatus.CANCELLED ||
            order.status === order_entity_1.OrderStatus.DELIVERED ||
            order.status === order_entity_1.OrderStatus.REFUNDED) {
            throw new common_1.BadRequestException(`Order with ID ${id} cannot be cancelled (current status: ${order.status})`);
        }
        if (order.status === order_entity_1.OrderStatus.PAID ||
            order.status === order_entity_1.OrderStatus.PROCESSING) {
            await this.stockService.incrementStockForOrder(id);
        }
        order.status = order_entity_1.OrderStatus.CANCELLED;
        await this.orderRepository.save(order);
        const orderWithRelations = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'cart', 'cart.items'],
        });
        if (orderWithRelations) {
            this.emailService.sendOrderCancelled(orderWithRelations);
        }
        return this.findOne(id, userId);
    }
    async refund(id, userId) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        await this.checkOrderAccess(order, userId);
        if (order.status !== order_entity_1.OrderStatus.PAID && order.status !== order_entity_1.OrderStatus.PROCESSING) {
            throw new common_1.BadRequestException(`Order with ID ${id} cannot be refunded (current status: ${order.status})`);
        }
        await this.stockService.incrementStockForOrder(id);
        order.status = order_entity_1.OrderStatus.REFUNDED;
        await this.orderRepository.save(order);
        const orderWithRelations = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'cart', 'cart.items'],
        });
        if (orderWithRelations) {
            this.emailService.sendOrderCancelled(orderWithRelations);
        }
        return this.findOne(id, userId);
    }
    async createFromStripeCheckout(items, userId, paymentIntentId, customerEmail, customerName, shippingAddress, billingAddress, amountTotal) {
        const variantIds = items.map((item) => item.variantId);
        const variants = await this.variantRepository.find({
            where: variantIds.map((id) => ({ id })),
            relations: ['product'],
        });
        if (variants.length !== variantIds.length) {
            throw new common_1.NotFoundException('One or more variants not found');
        }
        for (const item of items) {
            await this.stockService.checkStockAvailability(item.variantId, item.quantity);
        }
        const total = items.reduce((sum, item) => {
            const variant = variants.find((v) => v.id === item.variantId);
            if (!variant || !variant.product)
                return sum;
            const price = parseFloat(variant.product.price.toString());
            return sum + price * item.quantity;
        }, 0);
        if (amountTotal !== null && amountTotal !== undefined) {
            const calculatedTotal = Math.round(total * 100) / 100;
            const stripeTotal = Math.round(amountTotal * 100) / 100;
            if (Math.abs(calculatedTotal - stripeTotal) > 0.01) {
                throw new common_1.BadRequestException(`Total mismatch: calculated ${calculatedTotal}, Stripe ${stripeTotal}`);
            }
        }
        const user = userId
            ? await this.userRepository.findOne({ where: { id: userId } })
            : null;
        const customerInfoName = customerName ||
            (shippingAddress
                ? `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim()
                : '') ||
            (user ? `${user.firstName} ${user.lastName}`.trim() : '') ||
            customerEmail;
        const newOrder = new order_entity_1.Order();
        newOrder.cartId = null;
        newOrder.userId = userId;
        newOrder.status = order_entity_1.OrderStatus.PENDING;
        newOrder.total = total;
        newOrder.paymentIntentId = paymentIntentId;
        newOrder.customerInfo = {
            name: customerInfoName,
            email: customerEmail,
            phone: shippingAddress?.phone || billingAddress?.phone || undefined,
            address: shippingAddress
                ? {
                    street: shippingAddress.street,
                    city: shippingAddress.city,
                    postalCode: shippingAddress.postalCode,
                    country: shippingAddress.country,
                }
                : {
                    street: '',
                    city: '',
                    postalCode: '',
                    country: 'FR',
                },
        };
        newOrder.shippingAddress = shippingAddress
            ? {
                ...shippingAddress,
                phone: shippingAddress.phone ?? undefined,
            }
            : null;
        const finalBillingAddress = billingAddress ?? shippingAddress;
        newOrder.billingAddress = finalBillingAddress
            ? {
                ...finalBillingAddress,
                phone: finalBillingAddress.phone ?? undefined,
            }
            : null;
        newOrder.items = items;
        const savedOrder = await this.orderRepository.save(newOrder);
        const orderWithRelations = await this.orderRepository.findOne({
            where: { id: savedOrder.id },
            relations: ['user'],
        });
        if (orderWithRelations) {
            this.emailService.sendOrderReceived(orderWithRelations);
        }
        this.logger.log(`Order ${savedOrder.id} created in PENDING status (awaiting admin capture)`);
        return this.findOne(savedOrder.id);
    }
    async capturePayment(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['cart', 'cart.items', 'cart.items.variant'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
        }
        if (order.status !== order_entity_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException(`Order is not in PENDING status (current: ${order.status})`);
        }
        if (!order.paymentIntentId) {
            throw new common_1.BadRequestException('Order does not have a paymentIntentId (not from Stripe Checkout)');
        }
        let items = [];
        if (order.cart && order.cart.items) {
            items = order.cart.items.map((item) => ({
                variantId: item.variantId,
                quantity: item.quantity,
            }));
        }
        else if (order.items && order.items.length > 0) {
            items = order.items;
        }
        else {
            throw new common_1.BadRequestException('Order has no items to verify stock. Cannot proceed with capture.');
        }
        if (items.length > 0) {
            for (const item of items) {
                try {
                    await this.stockService.checkStockAvailability(item.variantId, item.quantity);
                }
                catch (error) {
                    this.logger.warn(`Stock not available for variant ${item.variantId}, cancelling payment`);
                    try {
                        await this.stripe.paymentIntents.cancel(order.paymentIntentId);
                        this.logger.log(`PaymentIntent ${order.paymentIntentId} cancelled due to insufficient stock`);
                    }
                    catch (cancelError) {
                        this.logger.error(`Error cancelling PaymentIntent: ${cancelError.message}`);
                    }
                    order.status = order_entity_1.OrderStatus.CANCELLED;
                    await this.orderRepository.save(order);
                    const orderWithRelations = await this.orderRepository.findOne({
                        where: { id: order.id },
                        relations: ['user'],
                    });
                    if (orderWithRelations) {
                        this.emailService.sendOrderCancelled(orderWithRelations);
                    }
                    throw new common_1.BadRequestException(`Insufficient stock for variant ${item.variantId}. Order cancelled.`);
                }
            }
        }
        try {
            const paymentIntent = await this.stripe.paymentIntents.capture(order.paymentIntentId);
            if (paymentIntent.status === 'succeeded') {
                order.status = order_entity_1.OrderStatus.PAID;
                order.paidAt = new Date();
                await this.orderRepository.save(order);
                if (items.length > 0) {
                    for (const item of items) {
                        await this.stockService.decrementStock(item.variantId, item.quantity);
                    }
                }
                const orderWithRelations = await this.orderRepository.findOne({
                    where: { id: order.id },
                    relations: ['user'],
                });
                if (orderWithRelations) {
                    this.emailService.sendOrderConfirmation(orderWithRelations);
                }
                this.logger.log(`Payment captured successfully for order ${orderId}, status updated to PAID`);
                return this.findOne(order.id);
            }
            else {
                throw new common_1.BadRequestException(`Payment capture failed: ${paymentIntent.status}`);
            }
        }
        catch (error) {
            this.logger.error(`Error capturing payment for order ${orderId}: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to capture payment: ${error.message}`);
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(2, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(3, (0, typeorm_1.InjectRepository)(variant_entity_1.Variant)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        stock_service_1.StockService,
        email_service_1.EmailService,
        config_1.ConfigService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map