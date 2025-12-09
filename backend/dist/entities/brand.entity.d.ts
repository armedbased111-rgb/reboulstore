import { Product } from './product.entity';
export declare class Brand {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logoUrl: string | null;
    megaMenuImage1: string | null;
    megaMenuImage2: string | null;
    megaMenuVideo1: string | null;
    megaMenuVideo2: string | null;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
