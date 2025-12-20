"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReboulModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entities/product.entity");
const order_entity_1 = require("./entities/order.entity");
const user_entity_1 = require("./entities/user.entity");
const variant_entity_1 = require("./entities/variant.entity");
const category_entity_1 = require("./entities/category.entity");
const image_entity_1 = require("./entities/image.entity");
const brand_entity_1 = require("./entities/brand.entity");
const shop_entity_1 = require("./entities/shop.entity");
const address_entity_1 = require("./entities/address.entity");
const cart_entity_1 = require("./entities/cart.entity");
const cart_item_entity_1 = require("./entities/cart-item.entity");
const reboul_products_service_1 = require("./reboul-products.service");
const reboul_products_controller_1 = require("./reboul-products.controller");
const reboul_orders_service_1 = require("./reboul-orders.service");
const reboul_orders_controller_1 = require("./reboul-orders.controller");
const reboul_users_service_1 = require("./reboul-users.service");
const reboul_users_controller_1 = require("./reboul-users.controller");
const reboul_stocks_service_1 = require("./reboul-stocks.service");
const reboul_stocks_controller_1 = require("./reboul-stocks.controller");
const reboul_categories_service_1 = require("./reboul-categories.service");
const reboul_categories_controller_1 = require("./reboul-categories.controller");
const reboul_brands_service_1 = require("./reboul-brands.service");
const reboul_brands_controller_1 = require("./reboul-brands.controller");
const reboul_settings_service_1 = require("./reboul-settings.service");
const reboul_settings_controller_1 = require("./reboul-settings.controller");
let ReboulModule = class ReboulModule {
};
exports.ReboulModule = ReboulModule;
exports.ReboulModule = ReboulModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                product_entity_1.Product,
                order_entity_1.Order,
                user_entity_1.User,
                variant_entity_1.Variant,
                category_entity_1.Category,
                image_entity_1.Image,
                brand_entity_1.Brand,
                shop_entity_1.Shop,
                address_entity_1.Address,
                cart_entity_1.Cart,
                cart_item_entity_1.CartItem,
            ], 'reboul'),
        ],
        providers: [
            reboul_products_service_1.ReboulProductsService,
            reboul_orders_service_1.ReboulOrdersService,
            reboul_users_service_1.ReboulUsersService,
            reboul_stocks_service_1.ReboulStocksService,
            reboul_categories_service_1.ReboulCategoriesService,
            reboul_brands_service_1.ReboulBrandsService,
            reboul_settings_service_1.ReboulSettingsService,
        ],
        controllers: [
            reboul_products_controller_1.ReboulProductsController,
            reboul_orders_controller_1.ReboulOrdersController,
            reboul_users_controller_1.ReboulUsersController,
            reboul_stocks_controller_1.ReboulStocksController,
            reboul_categories_controller_1.ReboulCategoriesController,
            reboul_brands_controller_1.ReboulBrandsController,
            reboul_settings_controller_1.ReboulSettingsController,
        ],
        exports: [],
    })
], ReboulModule);
//# sourceMappingURL=reboul.module.js.map