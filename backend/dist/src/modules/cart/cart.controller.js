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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
const add_to_cart_dto_1 = require("./dto/add-to-cart.dto");
const update_cart_item_dto_1 = require("./dto/update-cart-item.dto");
let CartController = class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    async getCart(sessionIdHeader, sessionIdQuery) {
        const sessionId = sessionIdHeader || sessionIdQuery || this.generateSessionId();
        return this.cartService.findOne(sessionId);
    }
    async addItem(addToCartDto, sessionIdHeader, sessionIdQuery) {
        const sessionId = sessionIdHeader || sessionIdQuery || this.generateSessionId();
        return this.cartService.addItem(sessionId, addToCartDto);
    }
    async updateItem(itemId, updateCartItemDto) {
        return this.cartService.updateItem(itemId, updateCartItemDto);
    }
    async removeItem(itemId) {
        return this.cartService.removeItem(itemId);
    }
    async clear(sessionIdHeader, sessionIdQuery) {
        const sessionId = sessionIdHeader || sessionIdQuery || this.generateSessionId();
        return this.cartService.clear(sessionId);
    }
    generateSessionId() {
        return `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('x-session-id')),
    __param(1, (0, common_1.Query)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('items'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __param(2, (0, common_1.Query)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_to_cart_dto_1.AddToCartDto, String, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Put)('items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cart_item_dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Headers)('x-session-id')),
    __param(1, (0, common_1.Query)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clear", null);
exports.CartController = CartController = __decorate([
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map