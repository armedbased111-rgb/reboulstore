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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_config_1 = require("./multer.config");
const update_image_order_dto_1 = require("./dto/update-image-order.dto");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const product_query_dto_1 = require("./dto/product-query.dto");
const create_variant_dto_1 = require("./dto/create-variant.dto");
const update_variant_dto_1 = require("./dto/update-variant.dto");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    findImagesByProduct(id) {
        return this.productsService.findImagesByProduct(id);
    }
    createImage(productId, file, body) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const createImageDto = {
            alt: body.alt,
            order: body.order ? Number(body.order) : undefined,
        };
        return this.productsService.createImage(productId, file, createImageDto);
    }
    deleteImage(productId, imageId) {
        return this.productsService.deleteImage(imageId);
    }
    updateImageOrder(productId, imageId, updateOrderDto) {
        return this.productsService.updateImageOrder(imageId, updateOrderDto);
    }
    create(createProductDto) {
        return this.productsService.create(createProductDto);
    }
    findAll(query) {
        return this.productsService.findAll(query);
    }
    findVariantsByProduct(id) {
        return this.productsService.findVariantsByProduct(id);
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    findByCategory(categoryId, query) {
        return this.productsService.findByCategory(categoryId, query);
    }
    update(id, updateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    remove(id) {
        return this.productsService.remove(id);
    }
    findVariantById(productId, variantId) {
        return this.productsService.findVariantById(variantId);
    }
    createVariant(productId, createVariantDto) {
        return this.productsService.createVariant(productId, createVariantDto);
    }
    updateVariant(productId, variantId, updateVariantDto) {
        return this.productsService.updateVariant(variantId, updateVariantDto);
    }
    checkStock(productId, variantId, quantity) {
        const quantityNum = +quantity;
        if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
            throw new common_1.BadRequestException('Quantity must be a positive number');
        }
        return this.productsService.checkStock(variantId, quantityNum);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(':id/images'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findImagesByProduct", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multer_config_1.multerConfig)),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createImage", null);
__decorate([
    (0, common_1.Delete)(':productId/images/:imageId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Patch)(':productId/images/:imageId/order'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('imageId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_image_order_dto_1.UpdateImageOrderDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "updateImageOrder", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_query_dto_1.ProductQueryDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/variants'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findVariantsByProduct", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('category/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_query_dto_1.ProductQueryDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':productId/variants/:variantId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('variantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findVariantById", null);
__decorate([
    (0, common_1.Post)(':id/variants'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_variant_dto_1.CreateVariantDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createVariant", null);
__decorate([
    (0, common_1.Patch)(':productId/variants/:variantId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('variantId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_variant_dto_1.UpdateVariantDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "updateVariant", null);
__decorate([
    (0, common_1.Get)(':productId/variants/:variantId/stock'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('variantId')),
    __param(2, (0, common_1.Query)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "checkStock", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map