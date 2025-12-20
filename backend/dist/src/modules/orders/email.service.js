"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const order_email_entity_1 = require("../../entities/order-email.entity");
let EmailService = EmailService_1 = class EmailService {
    mailerService;
    configService;
    orderEmailRepository;
    frontendUrl;
    logger = new common_1.Logger(EmailService_1.name);
    constructor(mailerService, configService, orderEmailRepository) {
        this.mailerService = mailerService;
        this.configService = configService;
        this.orderEmailRepository = orderEmailRepository;
        this.frontendUrl =
            this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    }
    async sendRegistrationConfirmation(email, firstName) {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Bienvenue sur Reboul Store',
                template: 'registration-confirmation',
                context: {
                    firstName,
                    email,
                    frontendUrl: this.frontendUrl,
                    currentYear: new Date().getFullYear(),
                },
            });
        }
        catch (error) {
            console.error('Error sending registration confirmation email:', error);
        }
    }
    async sendOrderReceived(order) {
        const subject = `Commande reçue #${order.id.substring(0, 8)}`;
        try {
            const customerEmail = order.customerInfo?.email || order.user?.email || '';
            if (!customerEmail) {
                this.logger.warn(`No email found for order ${order.id}`);
                return;
            }
            await this.mailerService.sendMail({
                to: customerEmail,
                subject,
                template: 'order-received',
                context: {
                    customerName: order.customerInfo?.name || 'Client',
                    orderId: order.id.substring(0, 8),
                    orderDate: new Date(order.createdAt).toLocaleDateString('fr-FR'),
                    total: parseFloat(order.total.toString()).toFixed(2),
                    orderUrl: `${this.frontendUrl}/orders/${order.id}`,
                    frontendUrl: this.frontendUrl,
                    currentYear: new Date().getFullYear(),
                },
            });
            await this.persistEmail(order.id, order_email_entity_1.EmailType.ORDER_RECEIVED, customerEmail, subject);
        }
        catch (error) {
            this.logger.error(`Error sending order received email for order ${order.id}:`, error);
            await this.persistEmail(order.id, order_email_entity_1.EmailType.ORDER_RECEIVED, order.customerInfo?.email || order.user?.email || '', subject, false, error?.message || 'Unknown error');
        }
    }
    async sendOrderConfirmation(order) {
        const subject = `Confirmation de commande #${order.id.substring(0, 8)}`;
        try {
            const customerEmail = order.customerInfo?.email || order.user?.email || '';
            if (!customerEmail) {
                this.logger.warn(`No email found for order ${order.id}`);
                return;
            }
            await this.mailerService.sendMail({
                to: customerEmail,
                subject,
                template: 'order-confirmation',
                context: {
                    customerName: order.customerInfo?.name || 'Client',
                    orderId: order.id.substring(0, 8),
                    orderDate: new Date(order.createdAt).toLocaleDateString('fr-FR'),
                    total: parseFloat(order.total.toString()).toFixed(2),
                    status: this.getStatusLabel(order.status),
                    orderUrl: `${this.frontendUrl}/orders/${order.id}`,
                    currentYear: new Date().getFullYear(),
                },
            });
            await this.persistEmail(order.id, order_email_entity_1.EmailType.ORDER_CONFIRMED, customerEmail, subject);
        }
        catch (error) {
            this.logger.error(`Error sending order confirmation email for order ${order.id}:`, error);
            await this.persistEmail(order.id, order_email_entity_1.EmailType.ORDER_CONFIRMED, order.customerInfo?.email || order.user?.email || '', subject, false, error?.message || 'Unknown error');
        }
    }
    async sendShippingNotification(order) {
        const subject = `Votre commande #${order.id.substring(0, 8)} a été expédiée`;
        try {
            const customerEmail = order.customerInfo?.email || order.user?.email || '';
            if (!customerEmail) {
                this.logger.warn(`No email found for order ${order.id}`);
                return;
            }
            await this.mailerService.sendMail({
                to: customerEmail,
                subject,
                template: 'shipping-notification',
                context: {
                    customerName: order.customerInfo?.name || 'Client',
                    orderId: order.id.substring(0, 8),
                    trackingNumber: order.trackingNumber || null,
                    orderUrl: `${this.frontendUrl}/orders/${order.id}`,
                    currentYear: new Date().getFullYear(),
                },
            });
            await this.persistEmail(order.id, order_email_entity_1.EmailType.ORDER_SHIPPED, customerEmail, subject);
        }
        catch (error) {
            this.logger.error(`Error sending shipping notification email for order ${order.id}:`, error);
            await this.persistEmail(order.id, order_email_entity_1.EmailType.ORDER_SHIPPED, order.customerInfo?.email || order.user?.email || '', subject, false, error.message);
        }
    }
    async sendOrderDelivered(order) {
        const subject = `Votre commande #${order.id.substring(0, 8)} a été livrée`;
        try {
            const customerEmail = order.customerInfo?.email || order.user?.email || '';
            if (!customerEmail) {
                this.logger.warn(`No email found for order ${order.id}`);
                return;
            }
            await this.mailerService.sendMail({
                to: customerEmail,
                subject,
                template: 'order-delivered',
                context: {
                    customerName: order.customerInfo?.name || 'Client',
                    orderId: order.id.substring(0, 8),
                    orderUrl: `${this.frontendUrl}/orders/${order.id}`,
                    frontendUrl: this.frontendUrl,
                    currentYear: new Date().getFullYear(),
                },
            });
            await this.persistEmail(order.id, order_email_entity_1.EmailType.ORDER_DELIVERED, customerEmail, subject);
        }
        catch (error) {
            this.logger.error(`Error sending order delivered email for order ${order.id}:`, error);
            await this.persistEmail(order.id, order_email_entity_1.EmailType.ORDER_DELIVERED, order.customerInfo?.email || order.user?.email || '', subject, false, error?.message || 'Unknown error');
        }
    }
    async sendOrderCancelled(order) {
        const subject = `Commande #${order.id.substring(0, 8)} annulée`;
        try {
            const customerEmail = order.customerInfo?.email || order.user?.email || '';
            if (!customerEmail) {
                this.logger.warn(`No email found for order ${order.id}`);
                return;
            }
            const refundAmount = order.status === 'refunded'
                ? parseFloat(order.total.toString()).toFixed(2)
                : null;
            await this.mailerService.sendMail({
                to: customerEmail,
                subject,
                template: 'order-cancelled',
                context: {
                    customerName: order.customerInfo?.name || 'Client',
                    orderId: order.id.substring(0, 8),
                    cancellationDate: new Date().toLocaleDateString('fr-FR'),
                    refundAmount,
                    frontendUrl: this.frontendUrl,
                    currentYear: new Date().getFullYear(),
                },
            });
            await this.persistEmail(order.id, order_email_entity_1.EmailType.ORDER_CANCELLED, customerEmail, subject);
        }
        catch (error) {
            this.logger.error(`Error sending order cancelled email for order ${order.id}:`, error);
            await this.persistEmail(order.id, order_email_entity_1.EmailType.ORDER_CANCELLED, order.customerInfo?.email || order.user?.email || '', subject, false, error?.message || 'Unknown error');
        }
    }
    async persistEmail(orderId, emailType, recipientEmail, subject, sent = true, errorMessage = null) {
        try {
            const orderEmail = this.orderEmailRepository.create({
                orderId,
                emailType,
                recipientEmail,
                subject,
                sent,
                errorMessage,
                sentAt: sent ? new Date() : null,
            });
            await this.orderEmailRepository.save(orderEmail);
        }
        catch (error) {
            this.logger.error(`Error persisting email record for order ${orderId}:`, error);
        }
    }
    getStatusLabel(status) {
        const labels = {
            pending: 'En attente de paiement',
            paid: 'Payée',
            processing: 'En cours de traitement',
            confirmed: 'Confirmée',
            shipped: 'Expédiée',
            delivered: 'Livrée',
            cancelled: 'Annulée',
            refunded: 'Remboursée',
        };
        return labels[status] || status;
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(order_email_entity_1.OrderEmail)),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService,
        typeorm_2.Repository])
], EmailService);
//# sourceMappingURL=email.service.js.map