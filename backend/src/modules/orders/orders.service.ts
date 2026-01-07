import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Order, OrderStatus } from '../../entities/order.entity';
import { Cart } from '../../entities/cart.entity';
import { CartItem } from '../../entities/cart-item.entity';
import { Variant } from '../../entities/variant.entity';
import { User, UserRole } from '../../entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { StockService } from './stock.service';
import { EmailService } from './email.service';
import { CouponsService } from '../coupons/coupons.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class OrdersService {
  private stripe: Stripe;
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private stockService: StockService,
    private emailService: EmailService,
    private configService: ConfigService,
    private couponsService: CouponsService,
    private notificationsGateway: NotificationsGateway,
    private smsService: SmsService,
  ) {
    // Initialiser Stripe pour la capture manuelle
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeSecretKey) {
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2025-11-17.clover',
      });
    }
  }

  /**
   * Crée une commande depuis un panier
   */
  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    // Vérifier que le panier existe et récupérer ses items
    const cart = await this.cartRepository.findOne({
      where: { id: createOrderDto.cartId },
      relations: ['items', 'items.variant', 'items.variant.product'],
    });

    if (!cart) {
      throw new NotFoundException(
        `Cart with ID ${createOrderDto.cartId} not found`,
      );
    }

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Vérifier le stock disponible pour tous les articles (sans décrémenter)
    for (const item of cart.items) {
      await this.stockService.checkStockAvailability(
        item.variantId,
        item.quantity,
      );
    }

    // Calculer le total
    const cartTotal = cart.items.reduce((sum, item) => {
      const price = parseFloat(item.variant.product.price.toString());
      return sum + price * item.quantity;
    }, 0);

    // Valider et appliquer le coupon si fourni
    let discountAmount = 0;
    let couponId: string | null = null;

    if (createOrderDto.couponCode) {
      const validation = await this.couponsService.validateCoupon(
        createOrderDto.couponCode,
        cartTotal,
      );

      if (!validation.isValid) {
        throw new BadRequestException(
          validation.message || 'Invalid coupon code',
        );
      }

      discountAmount = validation.discountAmount;
      const coupon = await this.couponsService.findByCode(
        createOrderDto.couponCode,
      );
      couponId = coupon.id;

      // Incrémenter le compteur d'utilisations
      await this.couponsService.applyCoupon(createOrderDto.couponCode);
    }

    // Calculer le total final avec réduction
    const total = Math.round((cartTotal - discountAmount) * 100) / 100;

    // Créer la commande (statut PENDING - le stock sera décrémenté après paiement)
    const order = this.orderRepository.create({
      cartId: createOrderDto.cartId,
      status: OrderStatus.PENDING,
      total,
      customerInfo: createOrderDto.customerInfo,
      couponId,
      discountAmount: discountAmount > 0 ? discountAmount : null,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Le stock sera décrémenté uniquement quand le statut passera à PAID
    // (via updateStatus ou webhook Stripe)

    // Envoyer email de confirmation de commande
    const orderWithRelations = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['user'],
    });
    if (orderWithRelations) {
      this.emailService.sendOrderConfirmation(orderWithRelations);
    }

    // Retourner la commande avec les relations
    const orderResponse = await this.findOne(savedOrder.id);

    // Notifier les admins via WebSocket qu'une nouvelle commande a été créée
    if (orderResponse) {
      try {
        // Générer un numéro de commande basé sur l'ID (premiers 8 caractères)
        const orderNumber = `ORD-${orderResponse.id.substring(0, 8).toUpperCase()}`;
        
        // Extraire firstName et lastName depuis customerInfo.name
        const customerName = orderResponse.customerInfo?.name || 'Client';
        const nameParts = customerName.split(' ');
        const firstName = nameParts[0] || 'Client';
        const lastName = nameParts.slice(1).join(' ') || '';

        this.notificationsGateway.notifyOrderCreated({
          id: orderResponse.id,
          orderNumber,
          total: parseFloat(orderResponse.total.toString()),
          customerInfo: {
            firstName,
            lastName,
            email: orderResponse.customerInfo?.email || '',
          },
          createdAt: orderResponse.createdAt,
        });
      } catch (error) {
        this.logger.error('Error sending order created notification:', error);
        // Ne pas bloquer la création de commande si la notification échoue
      }
    }

    return orderResponse;
  }

  /**
   * Vérifie que l'utilisateur peut accéder à la commande (propriétaire ou admin)
   */
  private async checkOrderAccess(order: Order, userId: string): Promise<void> {
    // Si pas de userId, pas de vérification (route publique, déconseillé)
    if (!userId) {
      return;
    }

    // Récupérer l'utilisateur pour vérifier son rôle
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Admin ou Super Admin peut tout voir
    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
      return;
    }

    // Vérifier que l'utilisateur est propriétaire de la commande
    if (order.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this order',
      );
    }
  }

  /**
   * Récupère l'entité Order complète avec toutes les relations (pour génération PDF)
   */
  async findOneEntity(id: string, userId?: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'cart',
        'cart.items',
        'cart.items.variant',
        'cart.items.variant.product',
        'user',
      ],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Vérifier les droits d'accès si userId fourni
    if (userId) {
      await this.checkOrderAccess(order, userId);
    }

    return order;
  }

  /**
   * Récupère une commande par son ID
   * @param id - ID de la commande
   * @param userId - ID de l'utilisateur (optionnel, pour vérification de sécurité)
   */
  async findOne(id: string, userId?: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'cart',
        'cart.items',
        'cart.items.variant',
        'cart.items.variant.product',
        'user',
      ],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Vérifier les droits d'accès si userId fourni
    if (userId) {
      await this.checkOrderAccess(order, userId);
    }

    return {
      id: order.id,
      cartId: order.cartId,
      status: order.status,
      total: parseFloat(order.total.toString()),
      couponId: order.couponId,
      discountAmount: order.discountAmount
        ? parseFloat(order.discountAmount.toString())
        : null,
      customerInfo: order.customerInfo,
      cart: order.cart
        ? {
            id: order.cart.id,
            sessionId: order.cart.sessionId,
            items:
              order.cart.items?.map((item) => ({
                id: item.id,
                variantId: item.variantId,
                quantity: item.quantity,
                variant: {
                  id: item.variant.id,
                  color: item.variant.color,
                  size: item.variant.size,
                  sku: item.variant.sku,
                  product: {
                    id: item.variant.product.id,
                    name: item.variant.product.name,
                    price: item.variant.product.price.toString(),
                  },
                },
              })) || [],
          }
        : undefined,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  /**
   * Récupère toutes les commandes
   */
  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      relations: [
        'cart',
        'cart.items',
        'cart.items.variant',
        'cart.items.variant.product',
      ],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => ({
      id: order.id,
      cartId: order.cartId,
      status: order.status,
      total: parseFloat(order.total.toString()),
      couponId: order.couponId,
      discountAmount: order.discountAmount
        ? parseFloat(order.discountAmount.toString())
        : null,
      customerInfo: order.customerInfo,
      cart: order.cart
        ? {
            id: order.cart.id,
            sessionId: order.cart.sessionId,
            items:
              order.cart.items?.map((item) => ({
                id: item.id,
                variantId: item.variantId,
                quantity: item.quantity,
                variant: {
                  id: item.variant.id,
                  color: item.variant.color,
                  size: item.variant.size,
                  sku: item.variant.sku,
                  product: {
                    id: item.variant.product.id,
                    name: item.variant.product.name,
                    price: item.variant.product.price.toString(),
                  },
                },
              })) || [],
          }
        : undefined,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  }

  /**
   * Met à jour le statut d'une commande
   * Gère automatiquement le stock selon le statut :
   * - PAID : décrémente le stock
   * - CANCELLED/REFUNDED : incrémente le stock (si la commande était payée)
   */
  async updateStatus(
    id: string,
    updateStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['cart', 'cart.items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const oldStatus = order.status;
    const newStatus = updateStatusDto.status;

    // Décrémenter le stock si on passe à PAID
    if (newStatus === OrderStatus.PAID && oldStatus !== OrderStatus.PAID) {
      await this.stockService.decrementStockForOrder(id);
      order.paidAt = new Date();
    }

    // Incrémenter le stock si on annule/rembourse une commande qui était payée
    if (
      (newStatus === OrderStatus.CANCELLED ||
        newStatus === OrderStatus.REFUNDED) &&
      (oldStatus === OrderStatus.PAID || oldStatus === OrderStatus.PROCESSING)
    ) {
      await this.stockService.incrementStockForOrder(id);
    }

    // Mettre à jour les dates selon le statut
    if (
      newStatus === OrderStatus.SHIPPED &&
      oldStatus !== OrderStatus.SHIPPED
    ) {
      order.shippedAt = new Date();
    }

    if (
      newStatus === OrderStatus.DELIVERED &&
      oldStatus !== OrderStatus.DELIVERED
    ) {
      order.deliveredAt = new Date();
    }

    order.status = newStatus;
    const savedOrder = await this.orderRepository.save(order);

    // Envoyer les emails selon le nouveau statut
    const orderWithRelations = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'cart', 'cart.items'],
    });

    if (orderWithRelations) {
      // Notifier l'utilisateur via WebSocket du changement de statut
      if (orderWithRelations.userId) {
        // Générer un numéro de commande basé sur l'ID (premiers 8 caractères)
        const orderNumber = `ORD-${orderWithRelations.id.substring(0, 8).toUpperCase()}`;
        
        this.notificationsGateway.notifyOrderStatusChanged({
          id: orderWithRelations.id,
          orderNumber,
          status: newStatus,
          userId: orderWithRelations.userId,
        });
      }

      // Email selon le statut
      if (newStatus === OrderStatus.SHIPPED) {
        this.emailService.sendShippingNotification(orderWithRelations);

        // Envoyer SMS de notification d'expédition si numéro de téléphone disponible
        const phoneNumber = orderWithRelations.customerInfo?.phone || orderWithRelations.user?.phone;
        if (phoneNumber) {
          try {
            const orderNumber = `ORD-${orderWithRelations.id.substring(0, 8).toUpperCase()}`;
            await this.smsService.sendOrderShippedSMS(
              phoneNumber,
              orderNumber,
              orderWithRelations.trackingNumber || undefined,
              undefined, // Carrier optionnel
            );
          } catch (error) {
            this.logger.error('Failed to send shipping SMS:', error);
            // Ne pas bloquer la mise à jour du statut si l'SMS échoue
          }
        }
      } else if (newStatus === OrderStatus.DELIVERED) {
        this.emailService.sendOrderDelivered(orderWithRelations);
      } else if (
        newStatus === OrderStatus.CANCELLED ||
        newStatus === OrderStatus.REFUNDED
      ) {
        this.emailService.sendOrderCancelled(orderWithRelations);
      }
    }

    return this.findOne(id);
  }
  /**
   * Récupère les commandes d'un utilisateur
   */
  async findByUser(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: { userId },
      relations: [
        'cart',
        'cart.items',
        'cart.items.variant',
        'cart.items.variant.product',
      ],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => ({
      id: order.id,
      cartId: order.cartId,
      status: order.status,
      total: parseFloat(order.total.toString()),
      couponId: order.couponId,
      discountAmount: order.discountAmount
        ? parseFloat(order.discountAmount.toString())
        : null,
      customerInfo: order.customerInfo,
      cart: order.cart
        ? {
            id: order.cart.id,
            sessionId: order.cart.sessionId,
            items:
              order.cart.items?.map((item) => ({
                id: item.id,
                variantId: item.variantId,
                quantity: item.quantity,
                variant: {
                  id: item.variant.id,
                  color: item.variant.color,
                  size: item.variant.size,
                  sku: item.variant.sku,
                  product: {
                    id: item.variant.product.id,
                    name: item.variant.product.name,
                    price: item.variant.product.price.toString(),
                  },
                },
              })) || [],
          }
        : undefined,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  }

  /**
   * Annule une commande
   * @param id - ID de la commande
   * @param userId - ID de l'utilisateur (pour vérification de sécurité)
   */
  async cancel(id: string, userId: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Vérifier les droits d'accès
    await this.checkOrderAccess(order, userId);

    // Vérifier que la commande peut être annulée
    if (
      order.status === OrderStatus.CANCELLED ||
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.REFUNDED
    ) {
      throw new BadRequestException(
        `Order with ID ${id} cannot be cancelled (current status: ${order.status})`,
      );
    }

    // Si la commande était payée ou en traitement, ré-incrémenter le stock
    if (
      order.status === OrderStatus.PAID ||
      order.status === OrderStatus.PROCESSING
    ) {
      await this.stockService.incrementStockForOrder(id);
    }

    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);

    // Envoyer email d'annulation
    const orderWithRelations = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'cart', 'cart.items'],
    });
    if (orderWithRelations) {
      this.emailService.sendOrderCancelled(orderWithRelations);
    }

    return this.findOne(id, userId);
  }

  /**
   * Rembourse une commande
   * @param id - ID de la commande
   * @param userId - ID de l'utilisateur (pour vérification de sécurité)
   */
  async refund(id: string, userId: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Vérifier les droits d'accès
    await this.checkOrderAccess(order, userId);

    // Vérifier que la commande peut être remboursée
    if (
      order.status !== OrderStatus.PAID &&
      order.status !== OrderStatus.PROCESSING
    ) {
      throw new BadRequestException(
        `Order with ID ${id} cannot be refunded (current status: ${order.status})`,
      );
    }

    // Ré-incrémenter le stock car on rembourse
    await this.stockService.incrementStockForOrder(id);

    order.status = OrderStatus.REFUNDED;
    await this.orderRepository.save(order);

    // Envoyer email de remboursement
    const orderWithRelations = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'cart', 'cart.items'],
    });
    if (orderWithRelations) {
      this.emailService.sendOrderCancelled(orderWithRelations);
    }

    return this.findOne(id, userId);
  }

  /**
   * Crée une commande depuis une session Stripe Checkout
   * Utilisé par les webhooks Stripe
   * Avec capture manuelle, la commande est créée en PENDING (pas PAID)
   */
  async createFromStripeCheckout(
    items: Array<{ variantId: string; quantity: number }>,
    userId: string | null, // Peut être null pour guest checkout
    paymentIntentId: string,
    customerEmail: string,
    customerName?: string,
    shippingAddress?: {
      firstName: string;
      lastName: string;
      street: string;
      city: string;
      postalCode: string;
      country: string;
      phone?: string;
    } | null,
    billingAddress?: {
      firstName: string;
      lastName: string;
      street: string;
      city: string;
      postalCode: string;
      country: string;
      phone?: string;
    } | null,
    amountTotal?: number | null, // Montant total depuis Stripe (pour validation)
    couponId?: string | null, // ID du coupon appliqué
    discountAmount?: number, // Montant de la réduction
  ): Promise<OrderResponseDto> {
    // Récupérer les variants avec leurs produits
    const variantIds = items.map((item) => item.variantId);
    const variants = await this.variantRepository.find({
      where: variantIds.map((id) => ({ id })),
      relations: ['product'],
    });

    if (variants.length !== variantIds.length) {
      throw new NotFoundException('One or more variants not found');
    }

    // Vérifier le stock (sans décrémenter encore - on attend la validation admin)
    for (const item of items) {
      await this.stockService.checkStockAvailability(
        item.variantId,
        item.quantity,
      );
    }

    // Calculer le subtotal
    const subtotal = items.reduce((sum, item) => {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant || !variant.product) return sum;
      const price = parseFloat(variant.product.price.toString());
      return sum + price * item.quantity;
    }, 0);

    // Calculer le total avec réduction
    const finalDiscountAmount = discountAmount || 0;
    const total = Math.max(0, subtotal - finalDiscountAmount);

    // Valider que le montant correspond (si fourni)
    if (amountTotal !== null && amountTotal !== undefined) {
      const calculatedTotal = Math.round(total * 100) / 100;
      const stripeTotal = Math.round(amountTotal * 100) / 100;
      if (Math.abs(calculatedTotal - stripeTotal) > 0.01) {
        throw new BadRequestException(
          `Total mismatch: calculated ${calculatedTotal}, Stripe ${stripeTotal}`,
        );
      }
    }

    // Récupérer l'utilisateur si userId fourni
    const user = userId
      ? await this.userRepository.findOne({ where: { id: userId } })
      : null;

    // Construire customerInfo depuis les adresses
    const customerInfoName =
      customerName ||
      (shippingAddress
        ? `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim()
        : '') ||
      (user ? `${user.firstName} ${user.lastName}`.trim() : '') ||
      customerEmail;

    // Créer la commande en PENDING (pas PAID) car capture manuelle
    // Le stock ne sera pas décrémenté et l'email ne sera pas envoyé
    // Tout cela se fera quand l'admin capturera le paiement
    const newOrder = new Order();
    newOrder.cartId = null;
    newOrder.userId = userId; // Peut être null pour guest checkout
    newOrder.status = OrderStatus.PENDING;
    newOrder.total = total;
    newOrder.paymentIntentId = paymentIntentId;
    newOrder.customerInfo = {
      name: customerInfoName,
      email: customerEmail,
      phone: shippingAddress?.phone || billingAddress?.phone || undefined,
      address: shippingAddress
        ? {
            street: shippingAddress.street,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
          }
        : {
            street: '',
            city: '',
            postalCode: '',
            country: 'FR',
          },
    };
    // Convertir les adresses en s'assurant que phone est undefined plutôt que null
    newOrder.shippingAddress = shippingAddress
      ? {
          ...shippingAddress,
          phone: shippingAddress.phone ?? undefined,
        }
      : null;
    const finalBillingAddress = billingAddress ?? shippingAddress;
    newOrder.billingAddress = finalBillingAddress
      ? {
          ...finalBillingAddress,
          phone: finalBillingAddress.phone ?? undefined,
        }
      : null;
    newOrder.items = items;

    const savedOrder: Order = await this.orderRepository.save(newOrder);

    // ⚠️ NE PAS décrémenter le stock maintenant (on attend la validation admin)
    // ⚠️ NE PAS envoyer l'email de confirmation de paiement maintenant (on l'enverra après capture)
    // ✅ MAIS envoyer un email de réception de commande (PENDING)

    // Envoyer email de réception de commande
    const orderWithRelations = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['user'],
    });
    if (orderWithRelations) {
      this.emailService.sendOrderReceived(orderWithRelations);
    }

    this.logger.log(
      `Order ${savedOrder.id} created in PENDING status (awaiting admin capture)`,
    );

    return this.findOne(savedOrder.id);
  }

  /**
   * Capture le paiement d'une commande PENDING (admin uniquement)
   * Vérifie le stock avant de capturer
   * Si stock OK : capture le paiement, passe à PAID, décrémente stock, envoie email
   * Si stock KO : annule le PaymentIntent, passe à CANCELLED
   */
  async capturePayment(orderId: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['cart', 'cart.items', 'cart.items.variant'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Vérifier que la commande est en PENDING
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Order is not in PENDING status (current: ${order.status})`,
      );
    }

    // Vérifier qu'on a un PaymentIntent ID
    if (!order.paymentIntentId) {
      throw new BadRequestException(
        'Order does not have a paymentIntentId (not from Stripe Checkout)',
      );
    }

    // Récupérer les items de la commande (depuis cart ou depuis order.items)
    let items: Array<{ variantId: string; quantity: number }> = [];

    if (order.cart && order.cart.items) {
      // Si on a un cart, utiliser ses items
      items = order.cart.items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));
    } else if (order.items && order.items.length > 0) {
      // Sinon, utiliser les items stockés dans la commande (depuis Stripe Checkout)
      items = order.items;
    } else {
      // Pas d'items disponibles
      throw new BadRequestException(
        'Order has no items to verify stock. Cannot proceed with capture.',
      );
    }

    // Vérifier le stock pour chaque item (si on a les items)
    if (items.length > 0) {
      for (const item of items) {
        try {
          await this.stockService.checkStockAvailability(
            item.variantId,
            item.quantity,
          );
        } catch (error) {
          // Stock pas disponible : annuler le paiement et la commande
          this.logger.warn(
            `Stock not available for variant ${item.variantId}, cancelling payment`,
          );

          try {
            // Annuler le PaymentIntent
            await this.stripe.paymentIntents.cancel(order.paymentIntentId);
            this.logger.log(
              `PaymentIntent ${order.paymentIntentId} cancelled due to insufficient stock`,
            );
          } catch (cancelError) {
            this.logger.error(
              `Error cancelling PaymentIntent: ${cancelError.message}`,
            );
          }

          // Mettre à jour la commande en CANCELLED
          order.status = OrderStatus.CANCELLED;
          await this.orderRepository.save(order);

          // Envoyer email d'annulation
          const orderWithRelations = await this.orderRepository.findOne({
            where: { id: order.id },
            relations: ['user'],
          });
          if (orderWithRelations) {
            this.emailService.sendOrderCancelled(orderWithRelations);
          }

          throw new BadRequestException(
            `Insufficient stock for variant ${item.variantId}. Order cancelled.`,
          );
        }
      }
    }

    // Stock OK : capturer le paiement
    try {
      const paymentIntent = await this.stripe.paymentIntents.capture(
        order.paymentIntentId,
      );

      if (paymentIntent.status === 'succeeded') {
        // Paiement capturé avec succès
        order.status = OrderStatus.PAID;
        order.paidAt = new Date();
        await this.orderRepository.save(order);

        // Décrémenter le stock maintenant que le paiement est capturé
        if (items.length > 0) {
          for (const item of items) {
            await this.stockService.decrementStock(
              item.variantId,
              item.quantity,
            );
          }
        }

        // Envoyer email de confirmation
        const orderWithRelations = await this.orderRepository.findOne({
          where: { id: order.id },
          relations: ['user'],
        });
        if (orderWithRelations) {
          this.emailService.sendOrderConfirmation(orderWithRelations);
        }

        this.logger.log(
          `Payment captured successfully for order ${orderId}, status updated to PAID`,
        );

        return this.findOne(order.id);
      } else {
        throw new BadRequestException(
          `Payment capture failed: ${paymentIntent.status}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error capturing payment for order ${orderId}: ${error.message}`,
      );
      throw new BadRequestException(
        `Failed to capture payment: ${error.message}`,
      );
    }
  }

  /**
   * Valide et applique un code promo pour un panier
   * @param code - Code promo à valider
   * @param cartId - ID du panier
   */
  async applyCoupon(code: string, cartId: string) {
    // Récupérer le panier avec ses items
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.variant', 'items.variant.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Calculer le total du panier
    const cartTotal = cart.items.reduce((sum, item) => {
      const price = parseFloat(item.variant.product.price.toString());
      return sum + price * item.quantity;
    }, 0);

    // Valider le coupon
    const validation = await this.couponsService.validateCoupon(
      code,
      cartTotal,
    );

    if (!validation.isValid) {
      throw new BadRequestException(
        validation.message || 'Invalid coupon code',
      );
    }

    return {
      code,
      discountAmount: validation.discountAmount,
      totalBeforeDiscount: cartTotal,
      totalAfterDiscount: Math.round((cartTotal - validation.discountAmount) * 100) / 100,
    };
  }
}
