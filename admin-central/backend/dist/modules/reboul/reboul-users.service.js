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
exports.ReboulUsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const order_entity_1 = require("./entities/order.entity");
let ReboulUsersService = class ReboulUsersService {
    userRepository;
    orderRepository;
    constructor(userRepository, orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }
    async findAll(page = 1, limit = 20, filters) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.role) {
            where.role = filters.role;
        }
        if (filters?.search) {
            where.email = (0, typeorm_2.ILike)(`%${filters.search}%`);
        }
        const [users, total] = await this.userRepository.findAndCount({
            where,
            relations: ['addresses', 'orders'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        const usersWithoutPassword = users.map((user) => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        return {
            data: usersWithoutPassword,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['addresses', 'orders'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async updateRole(id, role) {
        const user = await this.findOne(id);
        if (role === user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.BadRequestException('Impossible de promouvoir un utilisateur en SUPER_ADMIN depuis cette interface');
        }
        user.role = role;
        return this.userRepository.save(user);
    }
    async remove(id) {
        const user = await this.findOne(id);
        const activeOrders = await this.orderRepository.count({
            where: [
                { userId: id, status: order_entity_1.OrderStatus.PENDING },
                { userId: id, status: order_entity_1.OrderStatus.PAID },
                { userId: id, status: order_entity_1.OrderStatus.PROCESSING },
            ],
        });
        if (activeOrders > 0) {
            throw new common_1.BadRequestException(`Impossible de supprimer l'utilisateur : ${activeOrders} commande(s) en cours`);
        }
        await this.userRepository.remove(user);
        return { message: `Utilisateur ${id} supprimé avec succès` };
    }
    async getStats() {
        const total = await this.userRepository.count();
        const byRole = await this.userRepository
            .createQueryBuilder('user')
            .select('user.role', 'role')
            .addSelect('COUNT(*)', 'count')
            .groupBy('user.role')
            .getRawMany();
        const withOrders = await this.userRepository
            .createQueryBuilder('user')
            .innerJoin('user.orders', 'order')
            .getCount();
        return {
            total,
            byRole,
            withOrders,
            withoutOrders: total - withOrders,
        };
    }
};
exports.ReboulUsersService = ReboulUsersService;
exports.ReboulUsersService = ReboulUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User, 'reboul')),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order, 'reboul')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReboulUsersService);
//# sourceMappingURL=reboul-users.service.js.map