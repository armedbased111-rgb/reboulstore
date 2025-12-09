import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '../../entities/shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
  ) {}

  async findAll(): Promise<Shop[]> {
    return this.shopRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Shop> {
    const shop = await this.shopRepository.findOne({
      where: { id },
    });

    if (!shop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }

    return shop;
  }

  async findBySlug(slug: string): Promise<Shop> {
    const shop = await this.shopRepository.findOne({
      where: { slug },
    });

    if (!shop) {
      throw new NotFoundException(`Shop with slug ${slug} not found`);
    }

    return shop;
  }

  async create(createShopDto: CreateShopDto): Promise<Shop> {
    const shop = this.shopRepository.create(createShopDto);
    return this.shopRepository.save(shop);
  }

  async update(id: string, updateShopDto: UpdateShopDto): Promise<Shop> {
    const shop = await this.findOne(id);
    Object.assign(shop, updateShopDto);
    return this.shopRepository.save(shop);
  }

  async remove(id: string): Promise<void> {
    const shop = await this.findOne(id);
    await this.shopRepository.remove(shop);
  }
}
