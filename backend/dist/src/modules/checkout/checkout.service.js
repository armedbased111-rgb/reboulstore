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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CheckoutService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stripe_1 = __importDefault(require("stripe"));
const variant_entity_1 = require("../../entities/variant.entity");
const stock_service_1 = require("../orders/stock.service");
const orders_service_1 = require("../orders/orders.service");
let CheckoutService = CheckoutService_1 = class CheckoutService {
    configService;
    variantRepository;
    stockService;
    ordersService;
    stripe;
    logger = new common_1.Logger(CheckoutService_1.name);
    constructor(configService, variantRepository, stockService, ordersService) {
        this.configService = configService;
        this.variantRepository = variantRepository;
        this.stockService = stockService;
        this.ordersService = ordersService;
        const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
            throw new Error('STRIPE_SECRET_KEY is not configured');
        }
        this.stripe = new stripe_1.default(stripeSecretKey, {
            apiVersion: '2025-11-17.clover',
        });
    }
    async createCheckoutSession(dto, userId) {
        if (!dto.items || dto.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
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
            throw new common_1.NotFoundException('One or more variants not found');
        }
        for (const item of dto.items) {
            await this.stockService.checkStockAvailability(item.variantId, item.quantity);
        }
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
        const port = this.configService.get('PORT') || '3001';
        const apiBaseUrl = `http://localhost:${port}`;
        const getImageUrl = (imageUrl) => {
            if (!imageUrl)
                return null;
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
        const lineItems = dto.items.map((item) => {
            const variant = variants.find((v) => v.id === item.variantId);
            if (!variant || !variant.product) {
                throw new common_1.NotFoundException(`Variant ${item.variantId} or product not found`);
            }
            const product = variant.product;
            const priceInCents = Math.round(parseFloat(product.price.toString()) * 100);
            let productImage = null;
            if (product.images && product.images.length > 0) {
                const colorImage = product.images.find((img) => img.alt?.toLowerCase().includes(variant.color.toLowerCase()));
                if (colorImage) {
                    productImage = getImageUrl(colorImage.url);
                }
                else {
                    const firstImage = product.images.find((img) => img.order === 0) ||
                        product.images[0];
                    productImage = getImageUrl(firstImage.url);
                }
            }
            const descriptionParts = [
                product.name,
                product.brand?.name,
                product.category?.name,
                `${variant.color} - Size ${variant.size}`,
            ].filter(Boolean);
            const description = descriptionParts.join(' | ');
            const maxDescriptionLength = 500;
            const finalDescription = description.length > maxDescriptionLength
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
        const total = variants.reduce((sum, variant) => {
            const item = dto.items.find((i) => i.variantId === variant.id);
            if (!item)
                return sum;
            const price = parseFloat(variant.product.price.toString());
            return sum + price * item.quantity;
        }, 0);
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            payment_intent_data: {
                capture_method: 'manual',
            },
            shipping_address_collection: {
                allowed_countries: ['FR', 'BE', 'CH', 'DE', 'ES', 'IT', 'GB'],
            },
            phone_number_collection: {
                enabled: true,
            },
            success_url: `${frontendUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/cart`,
            metadata: {
                userId: userId || 'anonymous',
                total: total.toString(),
                itemCount: dto.items.length.toString(),
                items: JSON.stringify(dto.items.map((item) => ({
                    variantId: item.variantId,
                    quantity: item.quantity,
                }))),
            },
        });
        return { url: session.url || '' };
    }
    async handleWebhook(rawBody, signature) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        const isDevelopment = this.configService.get('NODE_ENV') !== 'production';
        let event;
        try {
            if (webhookSecret && signature) {
                event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
            }
            else if (isDevelopment) {
                this.logger.warn('STRIPE_WEBHOOK_SECRET not configured, parsing webhook without verification (DEV MODE)');
                event = JSON.parse(rawBody.toString());
            }
            else {
                throw new common_1.BadRequestException('STRIPE_WEBHOOK_SECRET is required in production');
            }
        }
        catch (err) {
            this.logger.error(`Webhook signature verification failed: ${err.message}`);
            throw new common_1.BadRequestException(`Webhook Error: ${err.message}`);
        }
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
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
    async handleCheckoutCompleted(session) {
        try {
            const userId = session.metadata?.userId;
            const itemsJson = session.metadata?.items;
            if (!userId) {
                this.logger.warn(`Checkout session ${session.id} has no userId in metadata`);
                return;
            }
            if (!itemsJson) {
                this.logger.error(`Checkout session ${session.id} has no items in metadata`);
                return;
            }
            const paymentIntentId = typeof session.payment_intent === 'string'
                ? session.payment_intent
                : session.payment_intent?.id;
            if (!paymentIntentId) {
                this.logger.error(`Checkout session ${session.id} has no payment_intent`);
                return;
            }
            const items = JSON.parse(itemsJson);
            const customerEmail = session.customer_details?.email || session.customer_email || '';
            const customerName = session.customer_details?.name || '';
            const customerPhone = session.customer_details?.phone || undefined;
            let shippingAddress = null;
            const shippingDetails = session.shipping_details;
            if (shippingDetails?.address) {
                const shipping = shippingDetails;
                const address = shipping.address;
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
            let billingAddress = null;
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
            }
            else if (shippingAddress) {
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
            const amountTotal = session.amount_total
                ? session.amount_total / 100
                : null;
            await this.ordersService.createFromStripeCheckout(items, userId === 'anonymous' ? null : userId, paymentIntentId, customerEmail, customerName, shippingAddress, billingAddress, amountTotal);
            this.logger.log(`Order created successfully from checkout session ${session.id} with status PENDING (awaiting capture)`);
        }
        catch (error) {
            this.logger.error(`Error handling checkout.session.completed: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.CheckoutService = CheckoutService;
exports.CheckoutService = CheckoutService = CheckoutService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(variant_entity_1.Variant)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        stock_service_1.StockService,
        orders_service_1.OrdersService])
], CheckoutService);
//# sourceMappingURL=checkout.service.js.map