import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { Variant } from '../../entities/variant.entity';
import { Product } from '../../entities/product.entity';
import { OrdersModule } from '../orders/orders.module';
import { CouponsModule } from '../coupons/coupons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Variant, Product]), // Ajouter Product pour relations
    OrdersModule, // Pour accéder à StockService et OrdersService
    CouponsModule, // Pour accéder à CouponsService
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
