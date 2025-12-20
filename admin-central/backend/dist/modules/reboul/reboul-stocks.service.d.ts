import { Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';
import { Product } from './entities/product.entity';
export declare class ReboulStocksService {
    private variantRepository;
    private productRepository;
    constructor(variantRepository: Repository<Variant>, productRepository: Repository<Product>);
    findAll(filters?: {
        lowStock?: boolean;
        outOfStock?: boolean;
        productId?: string;
    }): Promise<Variant[]>;
    findOne(variantId: string): Promise<Variant>;
    updateStock(variantId: string, stock: number): Promise<Variant>;
    getStats(): Promise<{
        total: number;
        inStock: number;
        lowStock: number;
        outOfStock: number;
    }>;
}
