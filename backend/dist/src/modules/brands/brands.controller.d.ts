import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    create(createBrandDto: CreateBrandDto): Promise<import("../../entities/brand.entity").Brand>;
    findAll(): Promise<import("../../entities/brand.entity").Brand[]>;
    findBySlug(slug: string): Promise<import("../../entities/brand.entity").Brand>;
    findOne(id: number): Promise<import("../../entities/brand.entity").Brand>;
    update(id: number, updateBrandDto: UpdateBrandDto): Promise<import("../../entities/brand.entity").Brand>;
    remove(id: number): Promise<void>;
}
