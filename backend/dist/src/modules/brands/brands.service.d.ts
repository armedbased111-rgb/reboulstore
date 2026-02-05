import { Repository } from 'typeorm';
import { Brand } from '../../entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsService {
    private brandRepository;
    constructor(brandRepository: Repository<Brand>);
    findAll(): Promise<Brand[]>;
    findOne(id: number): Promise<Brand>;
    findBySlug(slug: string): Promise<Brand>;
    create(createBrandDto: CreateBrandDto): Promise<Brand>;
    update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand>;
    remove(id: number): Promise<void>;
}
