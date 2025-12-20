"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartResponseDto = exports.CartItemResponseDto = void 0;
class CartItemResponseDto {
    id;
    variantId;
    quantity;
    variant;
    createdAt;
}
exports.CartItemResponseDto = CartItemResponseDto;
class CartResponseDto {
    id;
    sessionId;
    items;
    total;
    createdAt;
    updatedAt;
}
exports.CartResponseDto = CartResponseDto;
//# sourceMappingURL=cart-response.dto.js.map