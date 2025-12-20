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
exports.ReboulStocksController = void 0;
const common_1 = require("@nestjs/common");
const reboul_stocks_service_1 = require("./reboul-stocks.service");
const admin_jwt_auth_guard_1 = require("../../shared/auth/admin-jwt-auth.guard");
const roles_guard_1 = require("../../shared/auth/roles.guard");
const roles_decorator_1 = require("../../shared/auth/roles.decorator");
const admin_user_entity_1 = require("../../shared/auth/admin-user.entity");
let ReboulStocksController = class ReboulStocksController {
    stocksService;
    constructor(stocksService) {
        this.stocksService = stocksService;
    }
    async findAll(lowStock, outOfStock, productId) {
        const filters = {
            lowStock: lowStock === 'true',
            outOfStock: outOfStock === 'true',
            productId,
        };
        return this.stocksService.findAll(filters);
    }
    async getStats() {
        return this.stocksService.getStats();
    }
    async findOne(variantId) {
        return this.stocksService.findOne(variantId);
    }
    async updateStock(variantId, stock) {
        return this.stocksService.updateStock(variantId, stock);
    }
};
exports.ReboulStocksController = ReboulStocksController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('lowStock')),
    __param(1, (0, common_1.Query)('outOfStock')),
    __param(2, (0, common_1.Query)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReboulStocksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReboulStocksController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':variantId'),
    __param(0, (0, common_1.Param)('variantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReboulStocksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':variantId'),
    __param(0, (0, common_1.Param)('variantId')),
    __param(1, (0, common_1.Body)('stock', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ReboulStocksController.prototype, "updateStock", null);
exports.ReboulStocksController = ReboulStocksController = __decorate([
    (0, common_1.Controller)('admin/reboul/stocks'),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(admin_user_entity_1.AdminRole.ADMIN, admin_user_entity_1.AdminRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [reboul_stocks_service_1.ReboulStocksService])
], ReboulStocksController);
//# sourceMappingURL=reboul-stocks.controller.js.map