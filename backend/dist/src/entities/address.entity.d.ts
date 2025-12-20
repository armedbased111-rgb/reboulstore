import { User } from './user.entity';
export declare class Address {
    id: string;
    userId: string;
    user: User;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    additionalInfo: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
