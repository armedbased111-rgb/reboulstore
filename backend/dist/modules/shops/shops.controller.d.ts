import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
export declare class ShopsController {
    private readonly shopsService;
    constructor(shopsService: ShopsService);
    create(createShopDto: CreateShopDto): Promise<import("../../entities/shop.entity").Shop>;
    findAll(): Promise<import("../../entities/shop.entity").Shop[]>;
    findOne(id: string): Promise<import("../../entities/shop.entity").Shop>;
    findBySlug(slug: string): Promise<import("../../entities/shop.entity").Shop>;
    update(id: string, updateShopDto: UpdateShopDto): Promise<import("../../entities/shop.entity").Shop>;
    remove(id: string): Promise<void>;
}
