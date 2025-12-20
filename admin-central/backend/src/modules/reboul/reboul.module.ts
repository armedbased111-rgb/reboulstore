import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { User } from './entities/user.entity';
import { Variant } from './entities/variant.entity';
import { Category } from './entities/category.entity';
import { Image } from './entities/image.entity';
import { Brand } from './entities/brand.entity';
import { Shop } from './entities/shop.entity';
import { Address } from './entities/address.entity';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ReboulProductsService } from './reboul-products.service';
import { ReboulProductsController } from './reboul-products.controller';
import { ReboulOrdersService } from './reboul-orders.service';
import { ReboulOrdersController } from './reboul-orders.controller';
import { ReboulUsersService } from './reboul-users.service';
import { ReboulUsersController } from './reboul-users.controller';
import { ReboulStocksService } from './reboul-stocks.service';
import { ReboulStocksController } from './reboul-stocks.controller';
import { ReboulCategoriesService } from './reboul-categories.service';
import { ReboulCategoriesController } from './reboul-categories.controller';
import { ReboulBrandsService } from './reboul-brands.service';
import { ReboulBrandsController } from './reboul-brands.controller';
import { ReboulSettingsService } from './reboul-settings.service';
import { ReboulSettingsController } from './reboul-settings.controller';

/**
 * Module Reboul pour l'Admin Centrale
 * 
 * Ce module regroupe tous les services et controllers pour gérer
 * les données Reboul depuis l'admin centrale.
 * 
 * ⚠️ IMPORTANT : Toutes les entités utilisent la connexion 'reboul'
 * via @InjectRepository(Entity, 'reboul')
 */
@Module({
  imports: [
    // ⚠️ Spécifier le nom de la connexion ('reboul')
    // Toutes les entités Reboul sont enregistrées avec cette connexion
    TypeOrmModule.forFeature(
      [
        Product,
        Order,
        User,
        Variant,
        Category,
        Image,
        Brand,
        Shop,
        Address,
        Cart,
        CartItem,
      ],
      'reboul', // ⚠️ Nom de la connexion TypeORM
    ),
  ],
  providers: [
    ReboulProductsService, // ✅ Phase 16 - Service produits créé
    ReboulOrdersService, // ✅ Phase 16 - Service commandes créé
    ReboulUsersService, // ✅ Phase 16 - Service utilisateurs créé
    ReboulStocksService, // ✅ Phase 16 - Service stocks créé
    ReboulCategoriesService, // ✅ Phase 17.7 - Service catégories créé
    ReboulBrandsService, // ✅ Phase 17.7 - Service marques créé
    ReboulSettingsService, // ✅ Phase 17.8 - Service settings créé
  ],
  controllers: [
    ReboulProductsController, // ✅ Phase 16 - Controller produits créé
    ReboulOrdersController, // ✅ Phase 16 - Controller commandes créé
    ReboulUsersController, // ✅ Phase 16 - Controller utilisateurs créé
    ReboulStocksController, // ✅ Phase 16 - Controller stocks créé
    ReboulCategoriesController, // ✅ Phase 17.7 - Controller catégories créé
    ReboulBrandsController, // ✅ Phase 17.7 - Controller marques créé
    ReboulSettingsController, // ✅ Phase 17.8 - Controller settings créé
  ],
  exports: [
    // Exporter les services pour utilisation dans d'autres modules si besoin
    // ReboulProductsService,
    // ReboulOrdersService,
    // ReboulUsersService,
  ],
})
export class ReboulModule {}
