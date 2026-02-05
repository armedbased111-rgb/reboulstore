import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Order, OrderStatus } from '../../entities/order.entity';
import { OrderEmail, EmailType } from '../../entities/order-email.entity';

@Injectable()
export class EmailService {
  private frontendUrl: string;
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    @InjectRepository(OrderEmail)
    private orderEmailRepository: Repository<OrderEmail>,
  ) {
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  }

  /**
   * Envoie un email de confirmation d'inscription
   */
  async sendRegistrationConfirmation(
    email: string,
    firstName: string,
  ): Promise<void> {
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
    } catch (error) {
      console.error('Error sending registration confirmation email:', error);
      // Ne pas throw pour ne pas bloquer l'inscription si l'email échoue
    }
  }

  /**
   * Envoie un email de réception de commande (PENDING - commande reçue)
   */
  async sendOrderReceived(order: Order): Promise<void> {
    const subject = `Commande reçue #${String(order.id)}`;
    try {
      const customerEmail =
        order.customerInfo?.email || order.user?.email || '';
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
          orderId: String(order.id),
          orderDate: new Date(order.createdAt).toLocaleDateString('fr-FR'),
          total: parseFloat(order.total.toString()).toFixed(2),
          orderUrl: `${this.frontendUrl}/orders/${order.id}`,
          frontendUrl: this.frontendUrl,
          currentYear: new Date().getFullYear(),
        },
      });

      // Persister l'email envoyé
      await this.persistEmail(
        order.id,
        EmailType.ORDER_RECEIVED,
        customerEmail,
        subject,
      );
    } catch (error: any) {
      this.logger.error(
        `Error sending order received email for order ${order.id}:`,
        error,
      );
      // Persister l'erreur
      await this.persistEmail(
        order.id,
        EmailType.ORDER_RECEIVED,
        order.customerInfo?.email || order.user?.email || '',
        subject,
        false,
        error?.message || 'Unknown error',
      );
    }
  }

  /**
   * Envoie un email de confirmation de commande (PAID - paiement confirmé)
   */
  async sendOrderConfirmation(order: Order): Promise<void> {
    const subject = `Confirmation de commande #${String(order.id)}`;
    try {
      const customerEmail =
        order.customerInfo?.email || order.user?.email || '';
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
          orderId: String(order.id),
          orderDate: new Date(order.createdAt).toLocaleDateString('fr-FR'),
          total: parseFloat(order.total.toString()).toFixed(2),
          status: this.getStatusLabel(order.status),
          orderUrl: `${this.frontendUrl}/orders/${order.id}`,
          currentYear: new Date().getFullYear(),
        },
      });

      // Persister l'email envoyé
      await this.persistEmail(
        order.id,
        EmailType.ORDER_CONFIRMED,
        customerEmail,
        subject,
      );
    } catch (error: any) {
      this.logger.error(
        `Error sending order confirmation email for order ${order.id}:`,
        error,
      );
      // Persister l'erreur
      await this.persistEmail(
        order.id,
        EmailType.ORDER_CONFIRMED,
        order.customerInfo?.email || order.user?.email || '',
        subject,
        false,
        error?.message || 'Unknown error',
      );
    }
  }

  /**
   * Envoie un email de notification d'expédition
   */
  async sendShippingNotification(order: Order): Promise<void> {
    const subject = `Votre commande #${String(order.id)} a été expédiée`;
    try {
      const customerEmail =
        order.customerInfo?.email || order.user?.email || '';
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
          orderId: String(order.id),
          trackingNumber: order.trackingNumber || null,
          orderUrl: `${this.frontendUrl}/orders/${order.id}`,
          currentYear: new Date().getFullYear(),
        },
      });

      // Persister l'email envoyé
      await this.persistEmail(
        order.id,
        EmailType.ORDER_SHIPPED,
        customerEmail,
        subject,
      );
    } catch (error) {
      this.logger.error(
        `Error sending shipping notification email for order ${order.id}:`,
        error,
      );
      await this.persistEmail(
        order.id,
        EmailType.ORDER_SHIPPED,
        order.customerInfo?.email || order.user?.email || '',
        subject,
        false,
        error.message,
      );
    }
  }

  /**
   * Envoie un email de confirmation de livraison
   */
  async sendOrderDelivered(order: Order): Promise<void> {
    const subject = `Votre commande #${String(order.id)} a été livrée`;
    try {
      const customerEmail =
        order.customerInfo?.email || order.user?.email || '';
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
          orderId: String(order.id),
          orderUrl: `${this.frontendUrl}/orders/${order.id}`,
          frontendUrl: this.frontendUrl,
          currentYear: new Date().getFullYear(),
        },
      });

      // Persister l'email envoyé
      await this.persistEmail(
        order.id,
        EmailType.ORDER_DELIVERED,
        customerEmail,
        subject,
      );
    } catch (error: any) {
      this.logger.error(
        `Error sending order delivered email for order ${order.id}:`,
        error,
      );
      await this.persistEmail(
        order.id,
        EmailType.ORDER_DELIVERED,
        order.customerInfo?.email || order.user?.email || '',
        subject,
        false,
        error?.message || 'Unknown error',
      );
    }
  }

  /**
   * Envoie un email d'annulation/remboursement
   */
  async sendOrderCancelled(order: Order): Promise<void> {
    const subject = `Commande #${String(order.id)} annulée`;
    try {
      const customerEmail =
        order.customerInfo?.email || order.user?.email || '';
      if (!customerEmail) {
        this.logger.warn(`No email found for order ${order.id}`);
        return;
      }

      const refundAmount =
        order.status === 'refunded'
          ? parseFloat(order.total.toString()).toFixed(2)
          : null;

      await this.mailerService.sendMail({
        to: customerEmail,
        subject,
        template: 'order-cancelled',
        context: {
          customerName: order.customerInfo?.name || 'Client',
          orderId: String(order.id),
          cancellationDate: new Date().toLocaleDateString('fr-FR'),
          refundAmount,
          frontendUrl: this.frontendUrl,
          currentYear: new Date().getFullYear(),
        },
      });

      // Persister l'email envoyé
      await this.persistEmail(
        order.id,
        EmailType.ORDER_CANCELLED,
        customerEmail,
        subject,
      );
    } catch (error: any) {
      this.logger.error(
        `Error sending order cancelled email for order ${order.id}:`,
        error,
      );
      await this.persistEmail(
        order.id,
        EmailType.ORDER_CANCELLED,
        order.customerInfo?.email || order.user?.email || '',
        subject,
        false,
        error?.message || 'Unknown error',
      );
    }
  }

  /**
   * Persiste un email envoyé en base de données
   */
  private async persistEmail(
    orderId: number,
    emailType: EmailType,
    recipientEmail: string,
    subject: string,
    sent: boolean = true,
    errorMessage: string | null = null,
  ): Promise<void> {
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
    } catch (error) {
      // Log l'erreur mais ne throw pas pour ne pas bloquer l'envoi d'email
      this.logger.error(
        `Error persisting email record for order ${orderId}:`,
        error,
      );
    }
  }

  /**
   * Envoie un email de notification de disponibilité de stock
   * @param email - Email du destinataire
   * @param product - Produit concerné
   * @param variant - Variante concernée (optionnel)
   */
  async sendStockAvailableNotification(
    email: string,
    product: { id: number; name: string; slug: string; imageUrl?: string | null },
    variant?: { id: number; color?: string; size?: string },
  ): Promise<void> {
    const productUrl = `${this.frontendUrl}/products/${product.slug}`;
    const productName = variant
      ? `${product.name} - ${variant.color || ''} ${variant.size || ''}`.trim()
      : product.name;

    // Logo Reboul Store (utiliser le logo noir depuis Cloudinary)
    const logoUrl = 'https://res.cloudinary.com/dxen69pdo/image/upload/v1767632540/logo_black_lbwe46.png';

    try {
      this.logger.debug(`Sending stock notification email to ${email} with logoUrl: ${logoUrl}`);
      const result = await this.mailerService.sendMail({
        to: email,
        subject: `Votre produit est de nouveau disponible - ${productName}`,
        template: 'stock-available',
        context: {
          productName,
          productUrl,
          productImageUrl: product.imageUrl || null,
          logoUrl: logoUrl || null,
          variant: variant
            ? `${variant.color || ''} ${variant.size || ''}`.trim()
            : null,
        },
      });

      this.logger.log(`Stock available notification sent to ${email} for product ${product.id}`);
      this.logger.debug(`Email result: ${JSON.stringify(result)}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to send stock available notification to ${email}:`,
        error?.message || error,
        error?.stack,
      );
      // Ne pas throw pour ne pas bloquer le processus si l'email échoue
      // L'utilisateur pourra être notifié lors de la prochaine vérification
    }
  }

  /**
   * Convertit le statut de commande en libellé français
   */
  private getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
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
}
