import { ReboulStocksService } from './reboul-stocks.service';
export declare class ReboulStocksController {
    private readonly stocksService;
    constructor(stocksService: ReboulStocksService);
    findAll(lowStock?: string, outOfStock?: string, productId?: string): Promise<import("./entities/variant.entity").Variant[]>;
    getStats(): Promise<{
        total: number;
        inStock: number;
        lowStock: number;
        outOfStock: number;
    }>;
    findOne(variantId: string): Promise<import("./entities/variant.entity").Variant>;
    updateStock(variantId: string, stock: number): Promise<import("./entities/variant.entity").Variant>;
}
