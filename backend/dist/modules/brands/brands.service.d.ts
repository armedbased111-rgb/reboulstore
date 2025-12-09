import { Repository } from 'typeorm';
import { Brand } from '../../entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsService {
    private brandRepository;
    constructor(brandRepository: Repository<Brand>);
    findAll(): Promise<Brand[]>;
    findOne(id: string): Promise<Brand>;
    findBySlug(slug: string): Promise<Brand>;
    create(createBrandDto: CreateBrandDto): Promise<Brand>;
    update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand>;
    remove(id: string): Promise<void>;
}
