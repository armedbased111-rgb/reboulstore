import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockNotificationsController, StockNotificationsAdminController, StockNotificationsTestController } from './stock-notifications.controller';
import { StockNotificationsService } from './stock-notifications.service';
import { StockNotificationsScheduler } from './stock-notifications.scheduler';
import { StockNotification } from '../../entities/stock-notification.entity';
import { Product } from '../../entities/product.entity';
import { Variant } from '../../entities/variant.entity';
import { Image } from '../../entities/image.entity';
import { OrdersModule } from '../orders/orders.module'; // Pour accéder à EmailService

@Module({
  imports: [
    TypeOrmModule.forFeature([StockNotification, Product, Variant, Image]),
    OrdersModule, // Pour utiliser EmailService
  ],
  controllers: [StockNotificationsController, StockNotificationsAdminController, StockNotificationsTestController],
  providers: [StockNotificationsService, StockNotificationsScheduler],
  exports: [StockNotificationsService],
})
export class StockNotificationsModule {}

