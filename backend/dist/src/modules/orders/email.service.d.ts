import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Order } from '../../entities/order.entity';
import { OrderEmail } from '../../entities/order-email.entity';
export declare class EmailService {
    private mailerService;
    private configService;
    private orderEmailRepository;
    private frontendUrl;
    private readonly logger;
    constructor(mailerService: MailerService, configService: ConfigService, orderEmailRepository: Repository<OrderEmail>);
    sendRegistrationConfirmation(email: string, firstName: string): Promise<void>;
    sendOrderReceived(order: Order): Promise<void>;
    sendOrderConfirmation(order: Order): Promise<void>;
    sendShippingNotification(order: Order): Promise<void>;
    sendOrderDelivered(order: Order): Promise<void>;
    sendOrderCancelled(order: Order): Promise<void>;
    private persistEmail;
    sendStockAvailableNotification(email: string, product: {
        id: number;
        name: string;
        slug: string;
        imageUrl?: string | null;
    }, variant?: {
        id: number;
        color?: string;
        size?: string;
    }): Promise<void>;
    private getStatusLabel;
}
