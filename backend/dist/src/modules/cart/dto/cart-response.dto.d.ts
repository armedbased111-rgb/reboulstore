export declare class CartItemResponseDto {
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
            images?: Array<{
                url: string;
                alt: string | null;
            }>;
        };
    };
    createdAt: Date;
}
export declare class CartResponseDto {
    id: number;
    sessionId: string;
    items: CartItemResponseDto[];
    total: number;
    createdAt: Date;
    updatedAt: Date;
}
