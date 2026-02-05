declare class CheckoutItemDto {
    variantId: number;
    quantity: number;
}
export declare class CreateCheckoutSessionDto {
    items: CheckoutItemDto[];
    couponCode?: string;
}
export {};
