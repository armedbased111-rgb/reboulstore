declare class CheckoutItemDto {
    variantId: string;
    quantity: number;
}
export declare class CreateCheckoutSessionDto {
    items: CheckoutItemDto[];
}
export {};
