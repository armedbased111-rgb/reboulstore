import { Cart } from '../../../entities/cart.entity';
import { CartItem } from '../../../entities/cart-item.entity';

export class CartItemResponseDto {
  id: string;
  variantId: string;
  quantity: number;
  variant: {
    id: string;
    color: string;
    size: string;
    stock: number;
    sku: string;
    product: {
      id: string;
      name: string;
      price: string;
      images?: Array<{ url: string; alt: string | null }>;
    };
  };
  createdAt: Date;
}

export class CartResponseDto {
  id: string;
  sessionId: string;
  items: CartItemResponseDto[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
