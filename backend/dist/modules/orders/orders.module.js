"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const orders_controller_1 = require("./orders.controller");
const orders_service_1 = require("./orders.service");
const stock_service_1 = require("./stock.service");
const email_service_1 = require("./email.service");
const order_entity_1 = require("../../entities/order.entity");
const cart_entity_1 = require("../../entities/cart.entity");
const cart_item_entity_1 = require("../../entities/cart-item.entity");
const variant_entity_1 = require("../../entities/variant.entity");
const product_entity_1 = require("../../entities/product.entity");
const user_entity_1 = require("../../entities/user.entity");
const order_email_entity_1 = require("../../entities/order-email.entity");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                order_entity_1.Order,
                cart_entity_1.Cart,
                cart_item_entity_1.CartItem,
                variant_entity_1.Variant,
                product_entity_1.Product,
                user_entity_1.User,
                order_email_entity_1.OrderEmail,
            ]),
            config_1.ConfigModule,
        ],
        controllers: [orders_controller_1.OrdersController],
        providers: [orders_service_1.OrdersService, stock_service_1.StockService, email_service_1.EmailService],
        exports: [orders_service_1.OrdersService, stock_service_1.StockService, email_service_1.EmailService],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map