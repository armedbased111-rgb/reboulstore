import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Variant } from '../../entities/variant.entity';
import { ExportSortantResultDto } from './dto/export-sortant-result.dto';

const CSV_HEADER = 'reference;name;price;sku;size;color;stock';

interface SortantRow {
  reference: string;
  name: string;
  price: string;
  sku: string;
  size: string;
  color: string;
  stock: string;
}

@Injectable()
export class SyncAs400Service {
  private readonly logger = new Logger(SyncAs400Service.name);

  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    private readonly configService: ConfigService,
  ) {}

  async exportSortant(): Promise<ExportSortantResultDto> {
    const sortantDir =
      this.configService.get<string>('AS400_SORTANT_DIR') ??
      '/tmp/as400-sortant';
    const filename =
      this.configService.get<string>('AS400_EXPORT_FILENAME') ??
      'produits_reboul.csv';
    const outputPath = join(sortantDir, filename);

    const rows = await this.fetchPublishedVariantRows();
    const csv = this.buildCsv(rows);

    await fs.mkdir(sortantDir, { recursive: true });
    await fs.writeFile(outputPath, csv, 'utf-8');

    this.logger.log(
      `AS400 sortant export: ${rows.length} lines → ${outputPath}`,
    );

    return {
      path: outputPath,
      lineCount: rows.length,
      generatedAt: new Date().toISOString(),
    };
  }

  private async fetchPublishedVariantRows(): Promise<SortantRow[]> {
    const raw = await this.variantRepository
      .createQueryBuilder('v')
      .innerJoin('v.product', 'p')
      .where('p.is_published = :published', { published: true })
      .andWhere('p.reference IS NOT NULL')
      .andWhere("TRIM(p.reference) <> ''")
      .select('p.reference', 'reference')
      .addSelect('p.name', 'name')
      .addSelect('p.price', 'price')
      .addSelect('v.sku', 'sku')
      .addSelect('v.size', 'size')
      .addSelect('v.color', 'color')
      .addSelect('v.stock', 'stock')
      .orderBy('p.reference', 'ASC')
      .addOrderBy('v.sku', 'ASC')
      .getRawMany<{
        reference: string;
        name: string;
        price: string;
        sku: string;
        size: string;
        color: string;
        stock: number;
      }>();

    return raw.map((r) => ({
      reference: String(r.reference ?? '').trim(),
      name: String(r.name ?? '').trim(),
      price: this.formatPrice(r.price),
      sku: String(r.sku ?? '').trim(),
      size: String(r.size ?? '').trim(),
      color: String(r.color ?? '').trim(),
      stock: String(r.stock ?? 0),
    }));
  }

  private formatPrice(price: string | number): string {
    const n = typeof price === 'number' ? price : parseFloat(String(price));
    if (Number.isNaN(n)) {
      return '0.00';
    }
    return n.toFixed(2);
  }

  private buildCsv(rows: SortantRow[]): string {
    const lines = [
      CSV_HEADER,
      ...rows.map((r) =>
        [r.reference, r.name, r.price, r.sku, r.size, r.color, r.stock]
          .map(escapeCsvField)
          .join(';'),
      ),
    ];
    return lines.join('\n') + '\n';
  }
}

function escapeCsvField(value: string): string {
  if (/[;"\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
