import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { getLoggerConfig } from './config/logger.config';
import { GlobalExceptionLoggingFilter } from './common/filters/global-exception-logging.filter';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
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
import { CheckoutModule } from './modules/checkout/checkout.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { ImagesOptimizationModule } from './modules/images-optimization/images-optimization.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SmsModule } from './modules/sms/sms.module';
import { StockNotificationsModule } from './modules/stock-notifications/stock-notifications.module';
import { HeroModule } from './modules/hero/hero.module';
import { OgModule } from './modules/og/og.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    WinstonModule.forRoot(getLoggerConfig()),
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
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requêtes/min par IP (endpoints classiques)
      },
    ]),
    CategoriesModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ShopsModule,
    BrandsModule,
    AuthModule,
    CheckoutModule,
    CloudinaryModule,
    CollectionsModule,
    ImagesOptimizationModule,
    CouponsModule,
    NotificationsModule,
    SmsModule,
    StockNotificationsModule,
    HeroModule,
    OgModule,
    NewsletterModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionLoggingFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
  ],
})
export class AppModule {}
