import { Repository } from 'typeorm';
import { Shop } from '../../entities/shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
export declare class ShopsService {
    private shopRepository;
    constructor(shopRepository: Repository<Shop>);
    findAll(): Promise<Shop[]>;
    findOne(id: number): Promise<Shop>;
    findBySlug(slug: string): Promise<Shop>;
    create(createShopDto: CreateShopDto): Promise<Shop>;
    update(id: number, updateShopDto: UpdateShopDto): Promise<Shop>;
    remove(id: number): Promise<void>;
}
