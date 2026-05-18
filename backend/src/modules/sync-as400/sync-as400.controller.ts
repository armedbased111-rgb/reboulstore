import { Controller, Post, UseGuards } from '@nestjs/common';
import { SyncAs400Service } from './sync-as400.service';
import { SyncAs400ExportGuard } from './sync-as400-export.guard';
import { ExportSortantResultDto } from './dto/export-sortant-result.dto';

@Controller('sync-as400')
export class SyncAs400Controller {
  constructor(private readonly syncAs400Service: SyncAs400Service) {}

  @Post('export')
  @UseGuards(SyncAs400ExportGuard)
  async exportSortant(): Promise<ExportSortantResultDto> {
    return this.syncAs400Service.exportSortant();
  }
}
