import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { Product } from './entities/product.entity';

/**
 * Service pour gérer les collections Reboul depuis l'Admin Centrale
 * 
 * ⚠️ IMPORTANT : Tous les repositories utilisent la connexion 'reboul'
 */
@Injectable()
export class ReboulCollectionsService {
  constructor(
    @InjectRepository(Collection, 'reboul')
    private collectionRepository: Repository<Collection>,
    @InjectRepository(Product, 'reboul')
    private productRepository: Repository<Product>,
  ) {}

  /**
   * Récupérer toutes les collections
   */
  async findAll(): Promise<Collection[]> {
    const collections = await this.collectionRepository.find({
      relations: ['products'],
      order: { createdAt: 'DESC' },
    });

    // Compter le nombre de produits par collection
    const collectionsWithCount = await Promise.all(
      collections.map(async (collection) => {
        const productsCount = await this.productRepository.count({
          where: { collectionId: collection.id },
        });
        return {
          ...collection,
          productsCount,
        };
      }),
    );

    return collectionsWithCount as any[];
  }

  /**
   * Récupérer la collection active
   */
  async findActive(): Promise<Collection | null> {
    return this.collectionRepository.findOne({
      where: { isActive: true },
      relations: ['products'],
    });
  }

  /**
   * Récupérer une collection par ID
   */
  async findOne(id: number | string): Promise<Collection> {
    const numId = Number(id);
    const collection = await this.collectionRepository.findOne({
      where: { id: numId },
      relations: ['products'],
    });

    if (!collection) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }

    const productsCount = await this.productRepository.count({
      where: { collectionId: collection.id },
    });

    return {
      ...collection,
      productsCount,
    } as any;
  }

  /**
   * Créer une nouvelle collection
   */
  async create(data: {
    name: string;
    displayName?: string;
    description?: string;
    isActive?: boolean;
  }): Promise<Collection> {
    // Vérifier que le nom n'existe pas déjà
    const existing = await this.collectionRepository.findOne({
      where: { name: data.name },
    });

    if (existing) {
      throw new BadRequestException(
        `Collection with name "${data.name}" already exists`,
      );
    }

    // Si on active cette collection, désactiver toutes les autres
    if (data.isActive) {
      await this.deactivateAll();
    }

    const collection = this.collectionRepository.create({
      ...data,
      isActive: data.isActive ?? false,
    });

    return this.collectionRepository.save(collection);
  }

  /**
   * Mettre à jour une collection
   */
  async update(
    id: number | string,
    data: {
      name?: string;
      displayName?: string;
      description?: string;
      isActive?: boolean;
    },
  ): Promise<Collection> {
    const collection = await this.findOne(id);

    // Si on change le nom, vérifier qu'il n'existe pas déjà
    if (data.name && data.name !== collection.name) {
      const existing = await this.collectionRepository.findOne({
        where: { name: data.name },
      });
      if (existing) {
        throw new BadRequestException(
          `Collection with name "${data.name}" already exists`,
        );
      }
    }

    // Si on active cette collection, désactiver toutes les autres
    if (data.isActive === true && !collection.isActive) {
      await this.deactivateAll();
    }

    Object.assign(collection, data);
    return this.collectionRepository.save(collection);
  }

  /**
   * Activer une collection (désactive automatiquement les autres)
   */
  async activate(id: number | string): Promise<Collection> {
    const collection = await this.findOne(id);

    // Désactiver toutes les autres collections
    await this.deactivateAll();

    // Activer cette collection
    collection.isActive = true;
    return this.collectionRepository.save(collection);
  }

  /**
   * Archiver une collection (désactiver)
   */
  async archive(id: number | string): Promise<Collection> {
    const collection = await this.findOne(id);

    // Si c'est la collection active, on ne peut pas l'archiver directement
    if (collection.isActive) {
      throw new BadRequestException(
        'Cannot archive the active collection. Please activate another collection first.',
      );
    }

    // Archiver = désactiver (déjà fait si pas active)
    collection.isActive = false;
    return this.collectionRepository.save(collection);
  }

  /**
   * Supprimer une collection
   */
  async remove(id: number | string): Promise<void> {
    const collection = await this.findOne(id);

    // Ne pas permettre de supprimer la collection active
    if (collection.isActive) {
      throw new BadRequestException(
        'Cannot delete the active collection. Please activate another collection first.',
      );
    }

    // Vérifier qu'il n'y a pas de produits associés
    const productsCount = await this.productRepository.count({
      where: { collectionId: collection.id },
    });

    if (productsCount > 0) {
      throw new BadRequestException(
        'Cannot delete collection with associated products. Please reassign products first.',
      );
    }

    await this.collectionRepository.remove(collection);
  }

  /**
   * Désactiver toutes les collections
   */
  private async deactivateAll(): Promise<void> {
    await this.collectionRepository.update({ isActive: true }, { isActive: false });
  }
}

