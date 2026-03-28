import { Module } from '@nestjs/common';
import { OgController } from './og.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [OgController],
})
export class OgModule {}
