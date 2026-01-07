import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './entities/shop.entity';

/**
 * Service pour gérer les paramètres Reboul
 */
@Injectable()
export class ReboulSettingsService {
  constructor(
    @InjectRepository(Shop, 'reboul')
    private shopRepository: Repository<Shop>,
  ) {}

  /**
   * Récupérer les paramètres du shop Reboul
   * Par défaut, on utilise le shop avec slug 'reboul'
   */
  async getSettings() {
    const shop = await this.shopRepository.findOne({
      where: { slug: 'reboul' },
    });

    if (!shop) {
      // Créer le shop Reboul par défaut s'il n'existe pas
      const newShop = this.shopRepository.create({
        name: 'Reboul',
        slug: 'reboul',
        description: null,
        shippingPolicy: null,
        returnPolicy: null,
      });
      return this.shopRepository.save(newShop);
    }

    return shop;
  }

  /**
   * Mettre à jour les paramètres du shop Reboul
   */
  async updateSettings(updateData: Partial<Shop>) {
    const shop = await this.getSettings();
    Object.assign(shop, updateData);
    return this.shopRepository.save(shop);
  }
}
