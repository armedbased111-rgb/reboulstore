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
exports.ReboulOrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const user_entity_1 = require("./entities/user.entity");
let ReboulOrdersService = class ReboulOrdersService {
    orderRepository;
    userRepository;
    constructor(orderRepository, userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }
    async findAll(page = 1, limit = 20, filters) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.userId) {
            where.userId = filters.userId;
        }
        if (filters?.startDate || filters?.endDate) {
            where.createdAt = (0, typeorm_2.Between)(filters.startDate ?? new Date(0), filters.endDate ?? new Date());
        }
        const [orders, total] = await this.orderRepository.findAndCount({
            where,
            relations: ['user', 'cart', 'cart.items', 'cart.items.variant', 'cart.items.variant.product'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            data: orders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'cart', 'cart.items', 'cart.items.variant', 'cart.items.variant.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Commande avec l'ID ${id} non trouvée`);
        }
        return order;
    }
    async updateStatus(id, status) {
        const order = await this.findOne(id);
        const validTransitions = {
            [order_entity_1.OrderStatus.PENDING]: [order_entity_1.OrderStatus.PAID, order_entity_1.OrderStatus.CANCELLED],
            [order_entity_1.OrderStatus.PAID]: [order_entity_1.OrderStatus.PROCESSING, order_entity_1.OrderStatus.CANCELLED, order_entity_1.OrderStatus.REFUNDED],
            [order_entity_1.OrderStatus.PROCESSING]: [order_entity_1.OrderStatus.SHIPPED, order_entity_1.OrderStatus.CANCELLED],
            [order_entity_1.OrderStatus.SHIPPED]: [order_entity_1.OrderStatus.DELIVERED],
            [order_entity_1.OrderStatus.DELIVERED]: [],
            [order_entity_1.OrderStatus.CANCELLED]: [],
            [order_entity_1.OrderStatus.REFUNDED]: [],
            [order_entity_1.OrderStatus.CONFIRMED]: [order_entity_1.OrderStatus.PROCESSING, order_entity_1.OrderStatus.CANCELLED],
        };
        const allowedStatuses = validTransitions[order.status];
        if (!allowedStatuses.includes(status)) {
            throw new common_1.BadRequestException(`Transition de statut invalide : ${order.status} → ${status}`);
        }
        order.status = status;
        if (status === order_entity_1.OrderStatus.PAID && !order.paidAt) {
            order.paidAt = new Date();
        }
        else if (status === order_entity_1.OrderStatus.SHIPPED && !order.shippedAt) {
            order.shippedAt = new Date();
        }
        else if (status === order_entity_1.OrderStatus.DELIVERED && !order.deliveredAt) {
            order.deliveredAt = new Date();
        }
        return this.orderRepository.save(order);
    }
    async addTracking(id, trackingNumber) {
        const order = await this.findOne(id);
        if (order.status !== order_entity_1.OrderStatus.SHIPPED && order.status !== order_entity_1.OrderStatus.PROCESSING) {
            throw new common_1.BadRequestException(`Impossible d'ajouter un tracking : la commande doit être en statut SHIPPED ou PROCESSING`);
        }
        order.trackingNumber = trackingNumber;
        if (order.status === order_entity_1.OrderStatus.PROCESSING) {
            order.status = order_entity_1.OrderStatus.SHIPPED;
            order.shippedAt = new Date();
        }
        return this.orderRepository.save(order);
    }
    async getStats() {
        const total = await this.orderRepository.count();
        const byStatus = await this.orderRepository
            .createQueryBuilder('order')
            .select('order.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(order.total)', 'total')
            .groupBy('order.status')
            .getRawMany();
        const totalRevenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.total)', 'total')
            .where('order.status IN (:...statuses)', {
            statuses: [order_entity_1.OrderStatus.PAID, order_entity_1.OrderStatus.PROCESSING, order_entity_1.OrderStatus.SHIPPED, order_entity_1.OrderStatus.DELIVERED],
        })
            .getRawOne();
        return {
            total,
            byStatus,
            totalRevenue: parseFloat(totalRevenue?.total || '0'),
        };
    }
};
exports.ReboulOrdersService = ReboulOrdersService;
exports.ReboulOrdersService = ReboulOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order, 'reboul')),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User, 'reboul')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReboulOrdersService);
//# sourceMappingURL=reboul-orders.service.js.map