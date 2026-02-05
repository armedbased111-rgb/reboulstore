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
exports.ReboulProductsController = void 0;
const common_1 = require("@nestjs/common");
const reboul_products_service_1 = require("./reboul-products.service");
const admin_jwt_auth_guard_1 = require("../../shared/auth/admin-jwt-auth.guard");
const roles_guard_1 = require("../../shared/auth/roles.guard");
const roles_decorator_1 = require("../../shared/auth/roles.decorator");
const admin_user_entity_1 = require("../../shared/auth/admin-user.entity");
let ReboulProductsController = class ReboulProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    async findAll(page, limit, categoryId, brandId, search, minPrice, maxPrice) {
        const filters = {
            categoryId,
            brandId,
            search,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        };
        return this.productsService.findAll(page, limit, filters);
    }
    async getCategories() {
        return this.productsService.getCategories();
    }
    async getBrands() {
        return this.productsService.getBrands();
    }
    async getStats() {
        return this.productsService.getStats();
    }
    async findOne(id) {
        return this.productsService.findOne(id);
    }
    async importFromPaste(body) {
        if (!body?.pastedText || typeof body.pastedText !== 'string') {
            throw new common_1.BadRequestException('pastedText requis');
        }
        return this.productsService.importFromPaste(body.pastedText);
    }
    async create(createProductDto) {
        const { images, variants, ...productData } = createProductDto;
        if (images || variants) {
            return this.productsService.createWithImages(productData, images, variants);
        }
        return this.productsService.create(productData);
    }
    async update(id, updateProductDto) {
        const { images, variants, ...productData } = updateProductDto;
        if (images !== undefined || variants !== undefined) {
            return this.productsService.updateWithImages(id, productData, images, variants);
        }
        return this.productsService.update(id, productData);
    }
    async addImage(productId, imageData) {
        return this.productsService.addImage(productId, imageData);
    }
    async removeImage(productId, imageId) {
        return this.productsService.removeImage(productId, imageId);
    }
    async updateImagesOrder(productId, body) {
        return this.productsService.updateImagesOrder(productId, body.images);
    }
    async remove(id) {
        return this.productsService.remove(id);
    }
};
exports.ReboulProductsController = ReboulProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('categoryId')),
    __param(3, (0, common_1.Query)('brandId')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('minPrice')),
    __param(6, (0, common_1.Query)('maxPrice')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReboulProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReboulProductsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('brands'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReboulProductsController.prototype, "getBrands", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReboulProductsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReboulProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('import-from-paste'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReboulProductsController.prototype, "importFromPaste", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReboulProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReboulProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReboulProductsController.prototype, "addImage", null);
__decorate([
    (0, common_1.Delete)(':id/images/:imageId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReboulProductsController.prototype, "removeImage", null);
__decorate([
    (0, common_1.Patch)(':id/images/order'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReboulProductsController.prototype, "updateImagesOrder", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReboulProductsController.prototype, "remove", null);
exports.ReboulProductsController = ReboulProductsController = __decorate([
    (0, common_1.Controller)('admin/reboul/products'),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(admin_user_entity_1.AdminRole.ADMIN, admin_user_entity_1.AdminRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [reboul_products_service_1.ReboulProductsService])
], ReboulProductsController);
//# sourceMappingURL=reboul-products.controller.js.map