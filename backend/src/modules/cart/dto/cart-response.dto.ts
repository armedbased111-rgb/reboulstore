import { Cart } from '../../../entities/cart.entity';
import { CartItem } from '../../../entities/cart-item.entity';

export class CartItemResponseDto {
  id: number;
  variantId: number;
  quantity: number;
  variant: {
    id: number;
    color: string;
    size: string;
    stock: number;
    sku: string;
    product: {
      id: number;
      name: string;
      price: string;
      images?: Array<{ url: string; alt: string | null }>;
    };
  };
  createdAt: Date;
}

export class CartResponseDto {
  id: number;
  sessionId: string;
  items: CartItemResponseDto[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
