import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../../entities/image.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export interface OptimizationStats {
  total: number;
  optimized: number;
  skipped: number;
  errors: number;
  details: {
    optimized: string[];
    skipped: string[];
    errors: string[];
  };
}

/**
 * Service d'optimisation automatique des images
 * 
 * Convertit les images JPG/PNG en WebP via Cloudinary
 * Met à jour les URLs pour utiliser les versions optimisées
 */
@Injectable()
export class ImagesOptimizationService {
  private readonly logger = new Logger(ImagesOptimizationService.name);

  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private cloudinaryService: CloudinaryService,
    private configService: ConfigService,
  ) {
    // Configurer Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Vérifier si une URL est déjà optimisée (WebP)
   */
  private isWebPUrl(url: string): boolean {
    return url.includes('.webp') || url.includes('f_webp');
  }

  /**
   * Vérifier si une URL est une image Cloudinary
   */
  private isCloudinaryUrl(url: string): boolean {
    return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
  }

  /**
   * Extraire le publicId depuis une URL Cloudinary
   */
  private extractPublicId(url: string): string | null {
    try {
      // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567/folder/image.jpg
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
      if (match && match[1]) {
        // Retirer l'extension si présente
        return match[1].replace(/\.(jpg|jpeg|png|webp)$/i, '');
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Générer l'URL WebP optimisée depuis un publicId Cloudinary
   * 
   * Note : Cloudinary sert automatiquement WebP si le navigateur le supporte
   * via fetch_format: 'auto', mais on force WebP ici pour garantir l'optimisation.
   * Les navigateurs modernes supportent WebP nativement.
   */
  private generateWebPUrl(publicId: string): string {
    return cloudinary.url(publicId, {
      fetch_format: 'webp',
      quality: 'auto',
      secure: true,
      transformation: [
        {
          quality: 'auto',
          fetch_format: 'webp',
        },
      ],
    });
  }

  /**
   * Optimiser une image
   */
  private async optimizeImage(image: Image): Promise<{
    success: boolean;
    newUrl?: string;
    error?: string;
  }> {
    try {
      // Vérifier si déjà optimisée
      if (this.isWebPUrl(image.url)) {
        return {
          success: false,
          error: 'Déjà en WebP',
        };
      }

      // Vérifier si c'est une image Cloudinary
      if (!this.isCloudinaryUrl(image.url)) {
        return {
          success: false,
          error: 'URL non Cloudinary',
        };
      }

      // Extraire le publicId
      const publicId = this.extractPublicId(image.url);
      if (!publicId) {
        return {
          success: false,
          error: 'Impossible d\'extraire le publicId',
        };
      }

      // Vérifier que l'image existe sur Cloudinary
      try {
        await cloudinary.api.resource(publicId);
      } catch {
        return {
          success: false,
          error: 'Image non trouvée sur Cloudinary',
        };
      }

      // Générer l'URL WebP optimisée
      const webPUrl = this.generateWebPUrl(publicId);

      return {
        success: true,
        newUrl: webPUrl,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Optimiser toutes les images non optimisées
   */
  async optimizeAllImages(limit?: number): Promise<OptimizationStats> {
    this.logger.log('🚀 Début optimisation images...');

    const stats: OptimizationStats = {
      total: 0,
      optimized: 0,
      skipped: 0,
      errors: 0,
      details: {
        optimized: [],
        skipped: [],
        errors: [],
      },
    };

    try {
      const query = this.imageRepository
        .createQueryBuilder('image')
        .where("image.url NOT LIKE '%.webp'")
        .andWhere("image.url NOT LIKE '%f_webp%'")
        .andWhere("image.url LIKE '%cloudinary.com%'");

      if (limit) {
        query.limit(limit);
      }

      const images = await query.getMany();
      stats.total = images.length;

      this.logger.log(`📸 ${images.length} image(s) à optimiser`);

      // Optimiser chaque image
      for (const image of images) {
        const result = await this.optimizeImage(image);

        if (result.success && result.newUrl) {
          // Mettre à jour l'URL en base de données
          image.url = result.newUrl;
          await this.imageRepository.save(image);
          stats.optimized++;
          stats.details.optimized.push(image.id);
          this.logger.debug(`✅ Optimisé: ${image.id}`);
        } else if (result.error === 'Déjà en WebP' || result.error === 'URL non Cloudinary') {
          stats.skipped++;
          stats.details.skipped.push(`${image.id}: ${result.error}`);
        } else {
          stats.errors++;
          stats.details.errors.push(`${image.id}: ${result.error}`);
          this.logger.warn(`❌ Erreur ${image.id}: ${result.error}`);
        }
      }

      this.logger.log(
        `✅ Optimisation terminée: ${stats.optimized} optimisées, ${stats.skipped} ignorées, ${stats.errors} erreurs`,
      );

      return stats;
    } catch (error) {
      this.logger.error('❌ Erreur lors de l\'optimisation:', error);
      throw error;
    }
  }

  /**
   * Optimiser les nouvelles images (depuis une date)
   */
  async optimizeNewImages(since: Date): Promise<OptimizationStats> {
    this.logger.log(`🚀 Optimisation images depuis ${since.toISOString()}...`);

    const stats: OptimizationStats = {
      total: 0,
      optimized: 0,
      skipped: 0,
      errors: 0,
      details: {
        optimized: [],
        skipped: [],
        errors: [],
      },
    };

    try {
      const images = await this.imageRepository
        .createQueryBuilder('image')
        .where('image.createdAt >= :since', { since })
        .andWhere("image.url NOT LIKE '%.webp'")
        .andWhere("image.url NOT LIKE '%f_webp%'")
        .andWhere("image.url LIKE '%cloudinary.com%'")
        .getMany();

      stats.total = images.length;
      this.logger.log(`📸 ${images.length} nouvelle(s) image(s) à optimiser`);

      for (const image of images) {
        const result = await this.optimizeImage(image);

        if (result.success && result.newUrl) {
          image.url = result.newUrl;
          await this.imageRepository.save(image);
          stats.optimized++;
          stats.details.optimized.push(image.id);
        } else if (result.error === 'Déjà en WebP' || result.error === 'URL non Cloudinary') {
          stats.skipped++;
          stats.details.skipped.push(`${image.id}: ${result.error}`);
        } else {
          stats.errors++;
          stats.details.errors.push(`${image.id}: ${result.error}`);
        }
      }

      return stats;
    } catch (error) {
      this.logger.error('❌ Erreur lors de l\'optimisation:', error);
      throw error;
    }
  }
}

