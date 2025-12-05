declare class AddressDto {
    street: string;
    city: string;
    postalCode: string;
    country: string;
}
declare class CustomerInfoDto {
    name: string;
    email: string;
    phone?: string;
    address: AddressDto;
}
export declare class CreateOrderDto {
    cartId: string;
    customerInfo: CustomerInfoDto;
}
export {};
