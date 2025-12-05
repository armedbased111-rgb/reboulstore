import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';
import { Image } from '../../entities/image.entity';
import { Variant } from '../../entities/variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Image, Variant]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}