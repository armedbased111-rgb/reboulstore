import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../../entities/cart.entity';
import { CartItem } from '../../entities/cart-item.entity';
import { Variant } from '../../entities/variant.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
  ) {}

  /**
   * Récupère un panier existant ou en crée un nouveau
   */
  async getOrCreate(sessionId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { sessionId },
      relations: [
        'items',
        'items.variant',
        'items.variant.product',
        'items.variant.product.images',
      ],
    });

    if (!cart) {
      cart = this.cartRepository.create({ sessionId });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  /**
   * Récupère un panier avec toutes ses relations
   */
  async findOne(sessionId: string): Promise<CartResponseDto> {
    const cart = await this.getOrCreate(sessionId);

    const total = await this.calculateTotal(cart.id);

    return {
      id: cart.id,
      sessionId: cart.sessionId,
      items:
        cart.items?.map((item) => ({
          id: item.id,
          variantId: item.variantId,
          quantity: item.quantity,
          variant: {
            id: item.variant.id,
            color: item.variant.color,
            size: item.variant.size,
            stock: item.variant.stock,
            sku: item.variant.sku,
            product: {
              id: item.variant.product.id,
              name: item.variant.product.name,
              price: item.variant.product.price.toString(),
              images: item.variant.product.images?.map((img) => ({
                url: img.url,
                alt: img.alt,
              })),
            },
          },
          createdAt: item.createdAt,
        })) || [],
      total,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  /**
   * Ajoute un article au panier
   */
  async addItem(
    sessionId: string,
    addToCartDto: AddToCartDto,
  ): Promise<CartItem> {
    const cart = await this.getOrCreate(sessionId);

    // Vérifier que la variante existe
    const variant = await this.variantRepository.findOne({
      where: { id: addToCartDto.variantId },
      relations: ['product'],
    });

    if (!variant) {
      throw new NotFoundException(
        `Variant with ID ${addToCartDto.variantId} not found`,
      );
    }

    // Vérifier le stock disponible
    if (variant.stock < addToCartDto.quantity) {
      throw new BadRequestException(
        `Stock insuffisant. Stock disponible : ${variant.stock}`,
      );
    }

    // Vérifier si l'article existe déjà dans le panier
    const existingItem = await this.cartItemRepository.findOne({
      where: {
        cartId: cart.id,
        variantId: addToCartDto.variantId,
      },
    });

    if (existingItem) {
      // Mettre à jour la quantité
      const newQuantity = existingItem.quantity + addToCartDto.quantity;

      // Vérifier le stock total
      if (variant.stock < newQuantity) {
        throw new BadRequestException(
          `Stock insuffisant. Stock disponible : ${variant.stock}, quantité demandée : ${newQuantity}`,
        );
      }

      existingItem.quantity = newQuantity;
      return this.cartItemRepository.save(existingItem);
    }

    // Créer un nouvel article
    const cartItem = this.cartItemRepository.create({
      cartId: cart.id,
      variantId: addToCartDto.variantId,
      quantity: addToCartDto.quantity,
    });

    return this.cartItemRepository.save(cartItem);
  }

  /**
   * Met à jour la quantité d'un article
   */
  async updateItem(
    itemId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId },
      relations: ['variant'],
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    if (!cartItem.variant) {
      throw new NotFoundException(`Variant not found for cart item ${itemId}`);
    }

    // Vérifier le stock disponible
    if (cartItem.variant.stock < updateCartItemDto.quantity) {
      throw new BadRequestException(
        `Stock insuffisant. Stock disponible : ${cartItem.variant.stock}`,
      );
    }

    cartItem.quantity = updateCartItemDto.quantity;
    return this.cartItemRepository.save(cartItem);
  }

  /**
   * Supprime un article du panier
   */
  async removeItem(itemId: number): Promise<void> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    await this.cartItemRepository.remove(cartItem);
  }

  /**
   * Vide le panier
   */
  async clear(sessionId: string): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { sessionId },
      relations: ['items'],
    });

    if (cart && cart.items) {
      await this.cartItemRepository.remove(cart.items);
    }
  }

  /**
   * Calcule le total du panier
   */
  async calculateTotal(cartId: number): Promise<number> {
    const items = await this.cartItemRepository.find({
      where: { cartId },
      relations: ['variant', 'variant.product'],
    });

    return items.reduce((total, item) => {
      const price = parseFloat(item.variant.product.price.toString());
      return total + price * item.quantity;
    }, 0);
  }
}
