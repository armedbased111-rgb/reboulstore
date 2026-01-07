import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { getEmailConfig } from './config/email.config';
import { getCacheConfig } from './config/cache.config';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ShopsModule } from './modules/shops/shops.module';
import { BrandsModule } from './modules/brands/brands.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { ImagesOptimizationModule } from './modules/images-optimization/images-optimization.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SmsModule } from './modules/sms/sms.module';
import { StockNotificationsModule } from './modules/stock-notifications/stock-notifications.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getEmailConfig,
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getCacheConfig,
      inject: [ConfigService],
      isGlobal: true, // Cache disponible globalement
    }),
    CategoriesModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ShopsModule,
    BrandsModule,
    AuthModule,
    UsersModule,
    CheckoutModule,
    CloudinaryModule,
    CollectionsModule,
    ImagesOptimizationModule,
    CouponsModule,
    NotificationsModule,
    SmsModule,
    StockNotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
