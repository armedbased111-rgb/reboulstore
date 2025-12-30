import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from '../../entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
  ) {}

  async findAll(): Promise<Collection[]> {
    return this.collectionRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Collection> {
    const collection = await this.collectionRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!collection) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }

    return collection;
  }

  async findByName(name: string): Promise<Collection | null> {
    return this.collectionRepository.findOne({
      where: { name },
    });
  }

  async findActive(): Promise<Collection | null> {
    return this.collectionRepository.findOne({
      where: { isActive: true },
    });
  }

  async create(createCollectionDto: CreateCollectionDto): Promise<Collection> {
    // Vérifier que le nom n'existe pas déjà
    const existing = await this.findByName(createCollectionDto.name);
    if (existing) {
      throw new BadRequestException(
        `Collection with name "${createCollectionDto.name}" already exists`,
      );
    }

    // Si on active cette collection, désactiver toutes les autres
    if (createCollectionDto.isActive) {
      await this.deactivateAll();
    }

    const collection = this.collectionRepository.create({
      ...createCollectionDto,
      isActive: createCollectionDto.isActive ?? false,
    });

    return this.collectionRepository.save(collection);
  }

  async update(
    id: string,
    updateCollectionDto: UpdateCollectionDto,
  ): Promise<Collection> {
    const collection = await this.findOne(id);

    // Si on change le nom, vérifier qu'il n'existe pas déjà
    if (updateCollectionDto.name && updateCollectionDto.name !== collection.name) {
      const existing = await this.findByName(updateCollectionDto.name);
      if (existing) {
        throw new BadRequestException(
          `Collection with name "${updateCollectionDto.name}" already exists`,
        );
      }
    }

    // Si on active cette collection, désactiver toutes les autres
    if (updateCollectionDto.isActive === true && !collection.isActive) {
      await this.deactivateAll();
    }

    Object.assign(collection, updateCollectionDto);
    return this.collectionRepository.save(collection);
  }

  async activate(id: string): Promise<Collection> {
    const collection = await this.findOne(id);

    // Désactiver toutes les autres collections
    await this.deactivateAll();

    // Activer cette collection
    collection.isActive = true;
    return this.collectionRepository.save(collection);
  }

  async archive(id: string): Promise<Collection> {
    const collection = await this.findOne(id);

    // Si c'est la collection active, on ne peut pas l'archiver directement
    // Il faut d'abord activer une autre collection
    if (collection.isActive) {
      throw new BadRequestException(
        'Cannot archive the active collection. Please activate another collection first.',
      );
    }

    // Archiver = désactiver (déjà fait si pas active)
    collection.isActive = false;
    return this.collectionRepository.save(collection);
  }

  async remove(id: string): Promise<void> {
    const collection = await this.findOne(id);

    // Ne pas permettre de supprimer la collection active
    if (collection.isActive) {
      throw new BadRequestException(
        'Cannot delete the active collection. Please activate another collection first.',
      );
    }

    // Vérifier qu'il n'y a pas de produits associés
    const productsCount = await this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoin('collection.products', 'product')
      .where('collection.id = :id', { id })
      .select('COUNT(product.id)', 'count')
      .getRawOne();

    if (parseInt(productsCount.count, 10) > 0) {
      throw new BadRequestException(
        'Cannot delete collection with associated products. Please reassign products first.',
      );
    }

    await this.collectionRepository.remove(collection);
  }

  /**
   * Désactiver toutes les collections
   * Utilisé avant d'activer une nouvelle collection
   */
  private async deactivateAll(): Promise<void> {
    await this.collectionRepository.update({ isActive: true }, { isActive: false });
  }
}

