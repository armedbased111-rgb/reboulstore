import { Order, OrderStatus } from '../../../entities/order.entity';
import { Cart } from '../../../entities/cart.entity';

export class OrderResponseDto {
  id: string;
  cartId: string | null;
  status: OrderStatus;
  total: number;
  couponId?: string | null;
  discountAmount?: number | null;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
  };
  cart?: {
    id: string;
    sessionId: string;
    items: Array<{
      id: string;
      variantId: string;
      quantity: number;
      variant: {
        id: string;
        color: string;
        size: string;
        sku: string;
        product: {
          id: string;
          name: string;
          price: string;
        };
      };
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}
