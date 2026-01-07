import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { StockService } from './stock.service';
import { EmailService } from './email.service';
import { InvoiceService } from './invoice.service';
import { Order } from '../../entities/order.entity';
import { Cart } from '../../entities/cart.entity';
import { CartItem } from '../../entities/cart-item.entity';
import { Variant } from '../../entities/variant.entity';
import { Product } from '../../entities/product.entity';
import { User } from '../../entities/user.entity';
import { OrderEmail } from '../../entities/order-email.entity';
import { CouponsModule } from '../coupons/coupons.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Cart,
      CartItem,
      Variant,
      Product,
      User,
      OrderEmail,
    ]),
    ConfigModule, // Pour accéder aux variables d'environnement dans OrdersService
    CouponsModule, // Pour utiliser CouponsService
    NotificationsModule, // Pour les notifications WebSocket
    SmsModule, // Pour l'envoi de SMS
  ],
  controllers: [OrdersController],
  providers: [OrdersService, StockService, EmailService, InvoiceService],
  exports: [OrdersService, StockService, EmailService, InvoiceService],
})
export class OrdersModule {}
