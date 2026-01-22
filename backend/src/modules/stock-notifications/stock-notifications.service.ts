import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { StockNotification } from '../../entities/stock-notification.entity';
import { Product } from '../../entities/product.entity';
import { Variant } from '../../entities/variant.entity';
import { Image } from '../../entities/image.entity';
import { SubscribeStockNotificationDto } from './dto/subscribe-stock-notification.dto';
import { EmailService } from '../orders/email.service';

@Injectable()
export class StockNotificationsService {
  private readonly logger = new Logger(StockNotificationsService.name);

  constructor(
    @InjectRepository(StockNotification)
    private stockNotificationRepository: Repository<StockNotification>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private emailService: EmailService,
  ) {}

  /**
   * S'abonner aux notifications de stock pour un produit
   */
  async subscribe(
    productId: string,
    subscribeDto: SubscribeStockNotificationDto,
  ): Promise<StockNotification> {
    // Vérifier que le produit existe
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Si variantId est fourni, vérifier qu'il existe et appartient au produit
    if (subscribeDto.variantId) {
      const variant = await this.variantRepository.findOne({
        where: { id: subscribeDto.variantId, productId },
      });

      if (!variant) {
        throw new NotFoundException(
          `Variant with ID ${subscribeDto.variantId} not found for this product`,
        );
      }
    }

    // Vérifier si l'utilisateur n'est pas déjà inscrit
    const whereCondition: any = {
      productId,
      email: subscribeDto.email,
      isNotified: false, // Seulement si pas encore notifié
    };
    
    if (subscribeDto.variantId) {
      whereCondition.variantId = subscribeDto.variantId;
    } else {
      whereCondition.variantId = IsNull();
    }
    
    const existingSubscription = await this.stockNotificationRepository.findOne({
      where: whereCondition,
    });

    if (existingSubscription) {
      throw new ConflictException(
        'You are already subscribed to notifications for this product',
      );
    }

    // Créer la notification
    const notification = this.stockNotificationRepository.create({
      productId,
      variantId: subscribeDto.variantId || null,
      email: subscribeDto.email,
      phone: subscribeDto.phone || null,
      isNotified: false,
    });

    return this.stockNotificationRepository.save(notification);
  }

  /**
   * Vérifier si un utilisateur est déjà inscrit
   */
  async checkSubscription(
    productId: string,
    email: string,
    variantId?: string,
  ): Promise<{ isSubscribed: boolean; notification: StockNotification | null }> {
    const whereCondition: any = {
      productId,
      email,
      isNotified: false,
    };
    
    if (variantId) {
      whereCondition.variantId = variantId;
    } else {
      whereCondition.variantId = IsNull();
    }
    
    const notification = await this.stockNotificationRepository.findOne({
      where: whereCondition,
    });

    return {
      isSubscribed: !!notification,
      notification: notification || null,
    };
  }

  /**
   * Notifier tous les utilisateurs inscrits pour un produit/variant qui est de nouveau en stock
   */
  async notifyAll(productId: string, variantId?: string): Promise<void> {
    const whereCondition: any = {
      productId,
      isNotified: false,
    };
    
    if (variantId) {
      whereCondition.variantId = variantId;
    } else {
      whereCondition.variantId = IsNull();
    }
    
    const notifications = await this.stockNotificationRepository.find({
      where: whereCondition,
      relations: ['product', 'variant'],
    });

    for (const notification of notifications) {
      try {
        const productImages = await this.imageRepository.find({
          where: { productId: notification.product.id },
          order: { order: 'ASC' },
          take: 1,
        });
        const productImageUrl = productImages.length > 0 ? productImages[0].url : null;

        // Envoyer l'email de notification
        await this.emailService.sendStockAvailableNotification(
          notification.email,
          {
            id: notification.product.id,
            name: notification.product.name,
            slug: notification.product.id, // Utiliser l'ID comme slug (Product n'a pas de slug)
            imageUrl: productImageUrl,
          },
          notification.variant || undefined,
        );

        // Marquer comme notifié
        notification.isNotified = true;
        notification.notifiedAt = new Date();
        await this.stockNotificationRepository.save(notification);
      } catch (error) {
        console.error(
          `Failed to send stock notification to ${notification.email}:`,
          error,
        );
        // Continue avec les autres notifications même si une échoue
      }
    }
  }

  /**
   * Vérifier le stock de tous les produits et notifier les utilisateurs si nécessaire
   * Cette méthode est appelée par le job cron
   */
  async checkAndNotifyAll(): Promise<void> {
    const activeNotifications = await this.stockNotificationRepository.find({
      where: { isNotified: false },
      relations: ['product', 'variant'],
    });

    this.logger.log(`Found ${activeNotifications.length} active notifications to check`);

    for (const notification of activeNotifications) {
      // Vérifier le stock
      let isInStock = false;
      let currentStock = 0;

      if (notification.variantId) {
        // Vérifier le stock de la variante
        const variant = await this.variantRepository.findOne({
          where: { id: notification.variantId },
        });
        currentStock = variant?.stock || 0;
        isInStock = currentStock > 0;
        this.logger.debug(`Checking variant ${notification.variantId} for product ${notification.productId}: stock=${currentStock}, isInStock=${isInStock}`);
      } else {
        // Vérifier le stock du produit (toutes les variantes)
        const variants = await this.variantRepository.find({
          where: { productId: notification.productId },
        });
        const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
        isInStock = variants.some((v) => v.stock > 0);
        this.logger.debug(`Checking product ${notification.productId} (all variants): totalStock=${totalStock}, isInStock=${isInStock}`);
      }

      // Si en stock, notifier
      if (isInStock) {
        this.logger.log(`Product ${notification.productId} is in stock, sending notifications...`);
        const productImages = await this.imageRepository.find({
          where: { productId: notification.productId },
          order: { order: 'ASC' },
          take: 1,
        });
        const productImageUrl = productImages.length > 0 ? productImages[0].url : null;

        // Notifier avec l'image du produit
        await this.notifyAllWithImage(
          notification.productId,
          notification.variantId || undefined,
          productImageUrl,
        );
      } else {
        this.logger.debug(`Product ${notification.productId} is out of stock (stock=${currentStock}), skipping notification`);
      }
    }

    this.logger.log(`Stock check completed for ${activeNotifications.length} notifications`);
  }

  /**
   * Notifier tous les utilisateurs avec l'image du produit
   */
  private async notifyAllWithImage(
    productId: string,
    variantId?: string,
    productImageUrl?: string | null,
  ): Promise<void> {
    const whereCondition: any = {
      productId,
      isNotified: false,
    };
    
    if (variantId) {
      whereCondition.variantId = variantId;
    } else {
      whereCondition.variantId = IsNull();
    }
    
    const notifications = await this.stockNotificationRepository.find({
      where: whereCondition,
      relations: ['product', 'variant'],
    });

    for (const notification of notifications) {
      try {
        // Envoyer l'email de notification avec l'image
        await this.emailService.sendStockAvailableNotification(
          notification.email,
          {
            id: notification.product.id,
            name: notification.product.name,
            slug: notification.product.id,
            imageUrl: productImageUrl,
          },
          notification.variant || undefined,
        );

        // Marquer comme notifié
        notification.isNotified = true;
        notification.notifiedAt = new Date();
        await this.stockNotificationRepository.save(notification);
      } catch (error) {
        console.error(
          `Failed to send stock notification to ${notification.email}:`,
          error,
        );
        // Continue avec les autres notifications même si une échoue
      }
    }
  }

  /**
   * Envoyer un email de test avec logo et image produit
   * (Pour tests uniquement)
   */
  async sendTestEmail(email: string): Promise<void> {
    const products = await this.productRepository.find({
      relations: ['images'],
      take: 1,
    });

    if (products.length === 0) {
      throw new Error('No products found for test email');
    }

    const product = products[0];
    const productImages = await this.imageRepository.find({
      where: { productId: product.id },
      order: { order: 'ASC' },
      take: 1,
    });
    const productImageUrl = productImages.length > 0 ? productImages[0].url : null;

    // Envoyer l'email de test
    await this.emailService.sendStockAvailableNotification(
      email,
      {
        id: product.id,
        name: product.name,
        slug: product.id,
        imageUrl: productImageUrl,
      },
      undefined, // Pas de variante pour le test
    );

    this.logger.log(`Test email sent to ${email}`);
  }
}

