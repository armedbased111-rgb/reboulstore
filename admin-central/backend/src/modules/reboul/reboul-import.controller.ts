import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReboulImportService, CsvRow, ImportPreview, ImportResult } from './reboul-import.service';
import { AdminJwtAuthGuard } from '../../shared/auth/admin-jwt-auth.guard';
import { RolesGuard } from '../../shared/auth/roles.guard';
import { Roles } from '../../shared/auth/roles.decorator';
import { AdminRole } from '../../shared/auth/admin-user.entity';

@Controller('admin/reboul/import')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
export class ReboulImportController {
  constructor(private readonly importService: ReboulImportService) {}

  @Post('preview')
  async preview(
    @Body() body: { rows?: CsvRow[]; collectionId?: number | string },
  ): Promise<ImportPreview> {
    const { rows, collectionId } = body ?? {};
    if (!rows?.length) throw new BadRequestException('Aucune donnée à prévisualiser (rows requis)');
    return this.importService.preview(rows, collectionId);
  }

  @Post('execute')
  async execute(
    @Body() body: { rows: CsvRow[]; collectionId?: number | string },
  ): Promise<ImportResult> {
    const { rows, collectionId } = body ?? {};
    if (!rows?.length) throw new BadRequestException('Aucune donnée à importer (rows requis)');
    return this.importService.execute(rows, collectionId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('collectionId') collectionId?: number | string,
  ): Promise<{ rows: CsvRow[]; preview: ImportPreview }> {
    if (!file?.buffer) throw new BadRequestException('Fichier CSV requis');
    const rows = this.importService.parseCsv(file.buffer);
    if (!rows.length) throw new BadRequestException('Aucune ligne valide dans le CSV');
    const preview = await this.importService.preview(rows, collectionId);
    return { rows, preview };
  }
}
