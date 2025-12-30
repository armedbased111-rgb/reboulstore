import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ImagesOptimizationService } from './images-optimization.service';

/**
 * Scheduler pour l'optimisation automatique des images
 * 
 * Cron jobs :
 * - Quotidien à 3h du matin : Optimiser toutes les nouvelles images (24h)
 * - Hebdomadaire (dimanche 4h) : Optimiser toutes les images non optimisées
 */
@Injectable()
export class ImagesOptimizationScheduler {
  private readonly logger = new Logger(ImagesOptimizationScheduler.name);

  constructor(
    private readonly optimizationService: ImagesOptimizationService,
  ) {}

  /**
   * Optimiser les nouvelles images quotidiennement
   * Exécuté tous les jours à 3h du matin
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async optimizeNewImagesDaily() {
    this.logger.log('🔄 Cron job: Optimisation images quotidienne (nouvelles images 24h)');
    
    try {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // Dernières 24h
      const stats = await this.optimizationService.optimizeNewImages(since);
      
      this.logger.log(
        `✅ Optimisation quotidienne terminée: ${stats.optimized} optimisées, ${stats.skipped} ignorées, ${stats.errors} erreurs`,
      );
    } catch (error) {
      this.logger.error('❌ Erreur lors de l\'optimisation quotidienne:', error);
    }
  }

  /**
   * Optimiser toutes les images non optimisées hebdomadairement
   * Exécuté tous les dimanches à 4h du matin
   */
  @Cron('0 4 * * 0') // Dimanche à 4h
  async optimizeAllImagesWeekly() {
    this.logger.log('🔄 Cron job: Optimisation images hebdomadaire (toutes les images)');
    
    try {
      const stats = await this.optimizationService.optimizeAllImages();
      
      this.logger.log(
        `✅ Optimisation hebdomadaire terminée: ${stats.optimized} optimisées, ${stats.skipped} ignorées, ${stats.errors} erreurs`,
      );
    } catch (error) {
      this.logger.error('❌ Erreur lors de l\'optimisation hebdomadaire:', error);
    }
  }
}

