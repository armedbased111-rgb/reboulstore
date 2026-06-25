import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { SyncAs400Service } from './sync-as400.service';
import { SyncAs400ExportGuard } from './sync-as400-export.guard';
import { ExportSortantResultDto } from './dto/export-sortant-result.dto';
import { ExportCommandesResultDto } from './dto/export-commandes-result.dto';

@Controller('sync-as400')
export class SyncAs400Controller {
  constructor(private readonly syncAs400Service: SyncAs400Service) {}

  @Post('export')
  @UseGuards(SyncAs400ExportGuard)
  async exportSortant(
    @Query('full') full?: string,
  ): Promise<ExportSortantResultDto> {
    const forceFull = full === 'true' || full === '1';
    return this.syncAs400Service.exportSortant(forceFull);
  }

  @Post('export-commandes')
  @UseGuards(SyncAs400ExportGuard)
  async exportCommandes(): Promise<ExportCommandesResultDto> {
    return this.syncAs400Service.exportCommandes();
  }
}
