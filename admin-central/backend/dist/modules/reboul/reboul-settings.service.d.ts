import { Repository } from 'typeorm';
import { Shop } from './entities/shop.entity';
export declare class ReboulSettingsService {
    private shopRepository;
    constructor(shopRepository: Repository<Shop>);
    getSettings(): Promise<Shop>;
    updateSettings(updateData: Partial<Shop>): Promise<Shop>;
}
