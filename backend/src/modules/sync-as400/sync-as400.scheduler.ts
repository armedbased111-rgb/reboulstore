import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { SyncAs400Service } from './sync-as400.service';

@Injectable()
export class SyncAs400Scheduler {
  private readonly logger = new Logger(SyncAs400Scheduler.name);

  constructor(
    private readonly syncAs400Service: SyncAs400Service,
    private readonly configService: ConfigService,
  ) {}

  @Cron('0 * * * *')
  async exportSortantHourly(): Promise<void> {
    if (!this.isCronEnabled()) {
      return;
    }

    this.logger.log('Cron job: AS400 sortant export (hourly)');

    try {
      const result = await this.syncAs400Service.exportSortant(false);
      this.logger.log(
        `AS400 cron export done (${result.mode}): ${result.lineCount} lines ` +
          `(${result.updateCount} update, ${result.deleteCount} delete) → ${result.path}`,
      );
    } catch (error) {
      this.logger.error('AS400 cron export failed:', error);
    }

    try {
      const cmdResult = await this.syncAs400Service.exportCommandes();
      this.logger.log(
        `AS400 cron commandes done: ${cmdResult.orderCount} commandes, ` +
          `${cmdResult.lineCount} lignes → ${cmdResult.path}`,
      );
    } catch (error) {
      this.logger.error('AS400 cron commandes export failed:', error);
    }
  }

  private isCronEnabled(): boolean {
    const flag = this.configService.get<string>('AS400_EXPORT_CRON_ENABLED');
    return flag !== 'false' && flag !== '0';
  }
}
