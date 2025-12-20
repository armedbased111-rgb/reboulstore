import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Variant } from '../../entities/variant.entity';
import { StockService } from '../orders/stock.service';
import { OrdersService } from '../orders/orders.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Injectable()
export class CheckoutService {
  private stripe: Stripe;

  private readonly logger = new Logger(CheckoutService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    private stockService: StockService,
    private ordersService: OrdersService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover',
    });
  }

  /**
   * Crée une session Stripe Checkout
   */
  async createCheckoutSession(
    dto: CreateCheckoutSessionDto,
    userId?: string,
  ): Promise<{ url: string }> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Récupérer les variants avec leurs produits, images, marques et catégories
    const variantIds = dto.items.map((item) => item.variantId);
    const variants = await this.variantRepository.find({
      where: variantIds.map((id) => ({ id })),
      relations: [
        'product',
        'product.images',
        'product.brand',
        'product.category',
      ],
    });

    if (variants.length !== variantIds.length) {
      throw new NotFoundException('One or more variants not found');
    }

    // Vérifier le stock pour chaque item
    for (const item of dto.items) {
      await this.stockService.checkStockAvailability(
        item.variantId,
        item.quantity,
      );
    }

    // URL de base pour les images
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    // URL de l'API backend pour construire les URLs d'images complètes
    const port = this.configService.get<string>('PORT') || '3001';
    const apiBaseUrl = `http://localhost:${port}`;

    // Fonction pour construire l'URL d'image complète
    const getImageUrl = (
      imageUrl: string | null | undefined,
    ): string | null => {
      if (!imageUrl) return null;
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
      }
      const cleanBaseUrl = apiBaseUrl.endsWith('/')
        ? apiBaseUrl.slice(0, -1)
        : apiBaseUrl;
      const cleanImageUrl = imageUrl.startsWith('/')
        ? imageUrl
        : `/${imageUrl}`;
      return `${cleanBaseUrl}${cleanImageUrl}`;
    };

    // Préparer les line_items pour Stripe avec images et description enrichie
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      dto.items.map((item) => {
        const variant = variants.find((v) => v.id === item.variantId);
        if (!variant || !variant.product) {
          throw new NotFoundException(
            `Variant ${item.variantId} or product not found`,
          );
        }

        const product = variant.product;
        const priceInCents = Math.round(
          parseFloat(product.price.toString()) * 100,
        );

        // Trouver l'image du produit
        // Priorité : image correspondant à la couleur du variant, sinon première image
        let productImage: string | null = null;
        if (product.images && product.images.length > 0) {
          // Chercher une image correspondant à la couleur (si alt contient la couleur)
          const colorImage = product.images.find((img) =>
            img.alt?.toLowerCase().includes(variant.color.toLowerCase()),
          );
          if (colorImage) {
            productImage = getImageUrl(colorImage.url);
          } else {
            // Sinon prendre la première image (order = 0 ou première)
            const firstImage =
              product.images.find((img) => img.order === 0) ||
              product.images[0];
            productImage = getImageUrl(firstImage.url);
          }
        }

        // Construire la description enrichie : Nom Produit | Marque | Catégorie | Color - Size
        const descriptionParts = [
          product.name,
          product.brand?.name,
          product.category?.name,
          `${variant.color} - Size ${variant.size}`,
        ].filter(Boolean);
        const description = descriptionParts.join(' | ');

        // Limiter la description à 500 caractères (limite Stripe)
        const maxDescriptionLength = 500;
        const finalDescription =
          description.length > maxDescriptionLength
            ? description.substring(0, maxDescriptionLength - 3) + '...'
            : description;

        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product.name,
              description: finalDescription,
              images: productImage ? [productImage] : undefined,
            },
            unit_amount: priceInCents,
          },
          quantity: item.quantity,
        };
      });

    // Calculer le total (pour les métadonnées)
    const total = variants.reduce((sum, variant) => {
      const item = dto.items.find((i) => i.variantId === variant.id);
      if (!item) return sum;
      const price = parseFloat(variant.product.price.toString());
      return sum + price * item.quantity;
    }, 0);

    // Créer la session Stripe Checkout avec capture manuelle
    // Note: Stripe limite les metadata à 500 caractères, on stocke les items sérialisés
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      // Capture manuelle : le paiement sera capturé seulement quand l'admin valide la commande
      payment_intent_data: {
        capture_method: 'manual',
      },
      // Collecter l'adresse de livraison
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'DE', 'ES', 'IT', 'GB'], // Pays autorisés
      },
      // Collecter le téléphone si nécessaire
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${frontendUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cart`,
      metadata: {
        userId: userId || 'anonymous',
        total: total.toString(),
        itemCount: dto.items.length.toString(),
        // Stocker les items comme JSON string dans metadata
        items: JSON.stringify(
          dto.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        ),
      },
    });

    return { url: session.url || '' };
  }

  /**
   * Gère les webhooks Stripe
   */
  async handleWebhook(
    rawBody: Buffer,
    signature: string,
  ): Promise<{ received: boolean }> {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    // En développement avec Stripe CLI, le secret peut changer
    // En production, il doit être configuré
    const isDevelopment =
      this.configService.get<string>('NODE_ENV') !== 'production';

    let event: Stripe.Event;

    try {
      // Vérifier la signature du webhook si le secret est configuré
      if (webhookSecret && signature) {
        event = this.stripe.webhooks.constructEvent(
          rawBody,
          signature,
          webhookSecret,
        );
      } else if (isDevelopment) {
        // En développement local avec Stripe CLI, parser sans vérification si pas de secret
        this.logger.warn(
          'STRIPE_WEBHOOK_SECRET not configured, parsing webhook without verification (DEV MODE)',
        );
        event = JSON.parse(rawBody.toString()) as Stripe.Event;
      } else {
        // En production, le secret est obligatoire
        throw new BadRequestException(
          'STRIPE_WEBHOOK_SECRET is required in production',
        );
      }
    } catch (err) {
      this.logger.error(
        `Webhook signature verification failed: ${err.message}`,
      );
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Gérer les différents types d'événements
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        // Avec capture manuelle, payment_status sera 'unpaid' initialement
        // On crée la commande en PENDING même si payment_status n'est pas 'paid'
        // Le paiement sera capturé plus tard par l'admin
        await this.handleCheckoutCompleted(session);
        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object;
        await this.handleCheckoutCompleted(session);
        break;
      }

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  /**
   * Gère l'événement checkout.session.completed
   * Extrait toutes les données et crée la commande en PENDING (capture manuelle)
   */
  private async handleCheckoutCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    try {
      const userId = session.metadata?.userId;
      const itemsJson = session.metadata?.items;

      // userId peut être 'anonymous' pour les guests
      if (!userId) {
        this.logger.warn(
          `Checkout session ${session.id} has no userId in metadata`,
        );
        return;
      }

      if (!itemsJson) {
        this.logger.error(
          `Checkout session ${session.id} has no items in metadata`,
        );
        return;
      }

      // Récupérer le PaymentIntent ID (nécessaire pour la capture manuelle)
      const paymentIntentId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id;

      if (!paymentIntentId) {
        this.logger.error(
          `Checkout session ${session.id} has no payment_intent`,
        );
        return;
      }

      // Parser les items
      const items = JSON.parse(itemsJson) as Array<{
        variantId: string;
        quantity: number;
      }>;

      // Récupérer les informations du client depuis Stripe
      const customerEmail =
        session.customer_details?.email || session.customer_email || '';
      const customerName = session.customer_details?.name || '';
      const customerPhone = session.customer_details?.phone || undefined;

      // Type pour les adresses
      type AddressType = {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
        phone?: string;
      };

      // Extraire l'adresse de livraison (shipping address)
      let shippingAddress: AddressType | null = null;
      const shippingDetails = (session as any).shipping_details;
      if (shippingDetails?.address) {
        const shipping = shippingDetails;
        const address = shipping.address;
        // Parser le nom (peut être "John Doe" ou "John" ou "John Doe | Company")
        const nameParts = (shipping.name || customerName || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        shippingAddress = {
          firstName,
          lastName,
          street: address.line1 || '',
          city: address.city || '',
          postalCode: address.postal_code || '',
          country: address.country?.toUpperCase() || 'FR',
          phone: customerPhone || undefined,
        };
      }

      // Extraire l'adresse de facturation (billing address)
      let billingAddress: AddressType | null = null;
      if (session.customer_details?.address) {
        const address = session.customer_details.address;
        const nameParts = (customerName || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        billingAddress = {
          firstName,
          lastName,
          street: address.line1 || '',
          city: address.city || '',
          postalCode: address.postal_code || '',
          country: address.country?.toUpperCase() || 'FR',
          phone: customerPhone || undefined,
        };
      } else if (shippingAddress) {
        // Si pas d'adresse de facturation distincte, utiliser l'adresse de livraison
        billingAddress = {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          street: shippingAddress.street,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
        };
      }

      // Récupérer le montant total payé (en centimes depuis Stripe, convertir en euros)
      const amountTotal = session.amount_total
        ? session.amount_total / 100
        : null;

      // Créer la commande en PENDING (pas PAID) car capture manuelle
      await this.ordersService.createFromStripeCheckout(
        items,
        userId === 'anonymous' ? null : userId,
        paymentIntentId, // Utiliser paymentIntentId au lieu de session.id
        customerEmail,
        customerName,
        shippingAddress,
        billingAddress,
        amountTotal,
      );

      this.logger.log(
        `Order created successfully from checkout session ${session.id} with status PENDING (awaiting capture)`,
      );
    } catch (error) {
      this.logger.error(
        `Error handling checkout.session.completed: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
