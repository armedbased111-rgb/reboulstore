import { OrderStatus } from '../../../entities/order.entity';
export declare class OrderResponseDto {
    id: number;
    cartId: number | null;
    status: OrderStatus;
    total: number;
    couponId?: number | null;
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
        id: number;
        sessionId: string;
        items: Array<{
            id: number;
            variantId: number;
            quantity: number;
            variant: {
                id: number;
                color: string;
                size: string;
                sku: string;
                product: {
                    id: number;
                    name: string;
                    price: string;
                };
            };
        }>;
    };
    createdAt: Date;
    updatedAt: Date;
}
