import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from '../../entities/cart.entity';
import { CartItem } from '../../entities/cart-item.entity';
import { Variant } from '../../entities/variant.entity';
import { Product } from '../../entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Variant, Product])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
