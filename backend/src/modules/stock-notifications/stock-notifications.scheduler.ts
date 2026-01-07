import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StockNotificationsService } from './stock-notifications.service';

/**
 * Scheduler pour vérifier le stock et notifier les utilisateurs
 * Exécuté quotidiennement à 9h du matin
 */
@Injectable()
export class StockNotificationsScheduler {
  private readonly logger = new Logger(StockNotificationsScheduler.name);

  constructor(
    private readonly stockNotificationsService: StockNotificationsService,
  ) {}

  /**
   * Vérifie le stock de tous les produits et notifie les utilisateurs inscrits
   * Exécuté tous les jours à 9h du matin
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleStockCheck() {
    this.logger.log('Starting daily stock check and notification...');

    try {
      await this.stockNotificationsService.checkAndNotifyAll();
      this.logger.log('Stock check and notification completed successfully');
    } catch (error) {
      this.logger.error('Error during stock check and notification:', error);
    }
  }

  /**
   * Vérifie le stock toutes les heures (pour tests ou production intensive)
   * Désactivé par défaut - décommenter si nécessaire
   */
  // @Cron(CronExpression.EVERY_HOUR)
  // async handleHourlyStockCheck() {
  //   this.logger.log('Starting hourly stock check...');
  //   try {
  //     await this.stockNotificationsService.checkAndNotifyAll();
  //   } catch (error) {
  //     this.logger.error('Error during hourly stock check:', error);
  //   }
  // }
}

