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
exports.ReboulOrdersController = void 0;
const common_1 = require("@nestjs/common");
const reboul_orders_service_1 = require("./reboul-orders.service");
const order_entity_1 = require("./entities/order.entity");
const admin_jwt_auth_guard_1 = require("../../shared/auth/admin-jwt-auth.guard");
const roles_guard_1 = require("../../shared/auth/roles.guard");
const roles_decorator_1 = require("../../shared/auth/roles.decorator");
const admin_user_entity_1 = require("../../shared/auth/admin-user.entity");
let ReboulOrdersController = class ReboulOrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async findAll(page, limit, status, userId, startDate, endDate) {
        const filters = {
            status,
            userId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        };
        return this.ordersService.findAll(page, limit, filters);
    }
    async getStats() {
        return this.ordersService.getStats();
    }
    async findOne(id) {
        return this.ordersService.findOne(id);
    }
    async updateStatus(id, status) {
        return this.ordersService.updateStatus(id, status);
    }
    async addTracking(id, trackingNumber) {
        return this.ordersService.addTracking(id, trackingNumber);
    }
};
exports.ReboulOrdersController = ReboulOrdersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('userId')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReboulOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReboulOrdersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReboulOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReboulOrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/tracking'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('trackingNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReboulOrdersController.prototype, "addTracking", null);
exports.ReboulOrdersController = ReboulOrdersController = __decorate([
    (0, common_1.Controller)('admin/reboul/orders'),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(admin_user_entity_1.AdminRole.ADMIN, admin_user_entity_1.AdminRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [reboul_orders_service_1.ReboulOrdersService])
], ReboulOrdersController);
//# sourceMappingURL=reboul-orders.controller.js.map