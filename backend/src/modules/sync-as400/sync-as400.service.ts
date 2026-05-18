import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Variant } from '../../entities/variant.entity';
import { ExportSortantResultDto } from './dto/export-sortant-result.dto';
import {
  As400ExportState,
  SortantDeltaLine,
  SortantLine,
} from './sync-as400-export.types';

const FULL_CSV_HEADER = 'reference;name;price;sku;size;color;stock';
const DELTA_CSV_HEADER =
  'change_type;reference;name;price;sku;size;color;stock';
const STATE_FILENAME = '.as400-export-state.json';

@Injectable()
export class SyncAs400Service {
  private readonly logger = new Logger(SyncAs400Service.name);

  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    private readonly configService: ConfigService,
  ) {}

  async exportSortant(forceFull = false): Promise<ExportSortantResultDto> {
    const sortantDir =
      this.configService.get<string>('AS400_SORTANT_DIR') ??
      '/tmp/as400-sortant';
    const filename =
      this.configService.get<string>('AS400_EXPORT_FILENAME') ??
      'produits_reboul.csv';
    const outputPath = join(sortantDir, filename);
    const statePath = join(sortantDir, STATE_FILENAME);
    const weeklyFullDays = this.getWeeklyFullDays();

    const current = await this.fetchPublishedVariantRows();
    const currentBySku = new Map(current.map((r) => [r.sku, r]));
    const previousState = await this.loadState(statePath);
    const useFull = this.shouldRunFullExport(
      forceFull,
      previousState,
      weeklyFullDays,
    );

    let exportLines: SortantDeltaLine[];
    let mode: 'full' | 'delta';

    if (useFull) {
      mode = 'full';
      exportLines = current.map((r) => ({
        ...r,
        changeType: 'update' as const,
      }));
    } else {
      mode = 'delta';
      exportLines = this.buildDeltaLines(currentBySku, previousState!.lines);
    }

    const csv = this.buildCsv(exportLines, mode);
    await fs.mkdir(sortantDir, { recursive: true });
    await fs.writeFile(outputPath, csv, 'utf-8');

    const now = new Date().toISOString();
    const nextState: As400ExportState = {
      lastExportAt: now,
      lastFullExportAt: useFull ? now : previousState!.lastFullExportAt,
      lines: Object.fromEntries(currentBySku),
    };
    await this.saveState(statePath, nextState);

    const updateCount = exportLines.filter(
      (l) => l.changeType === 'update',
    ).length;
    const deleteCount = exportLines.filter(
      (l) => l.changeType === 'delete',
    ).length;

    this.logger.log(
      `AS400 sortant export (${mode}): ${exportLines.length} lines (${updateCount} update, ${deleteCount} delete) → ${outputPath}`,
    );

    return {
      path: outputPath,
      lineCount: exportLines.length,
      generatedAt: now,
      mode,
      updateCount,
      deleteCount,
    };
  }

  private getWeeklyFullDays(): number {
    const raw = this.configService.get<string>('AS400_WEEKLY_FULL_DAYS');
    const n = raw ? parseInt(raw, 10) : 7;
    return Number.isFinite(n) && n > 0 ? n : 7;
  }

  private shouldRunFullExport(
    forceFull: boolean,
    previous: As400ExportState | null,
    weeklyFullDays: number,
  ): boolean {
    if (forceFull || !previous) {
      return true;
    }
    const lastFull = new Date(previous.lastFullExportAt).getTime();
    if (Number.isNaN(lastFull)) {
      return true;
    }
    const daysSinceFull = (Date.now() - lastFull) / (24 * 60 * 60 * 1000);
    return daysSinceFull >= weeklyFullDays;
  }

  private buildDeltaLines(
    currentBySku: Map<string, SortantLine>,
    previousLines: Record<string, SortantLine>,
  ): SortantDeltaLine[] {
    const out: SortantDeltaLine[] = [];

    for (const [sku, row] of currentBySku) {
      const prev = previousLines[sku];
      if (!prev || !this.linesEqual(row, prev)) {
        out.push({ ...row, changeType: 'update' });
      }
    }

    for (const [sku, prev] of Object.entries(previousLines)) {
      if (!currentBySku.has(sku)) {
        out.push({ ...prev, changeType: 'delete', stock: '0' });
      }
    }

    out.sort((a, b) => {
      const ref = a.reference.localeCompare(b.reference);
      if (ref !== 0) {
        return ref;
      }
      return a.sku.localeCompare(b.sku);
    });

    return out;
  }

  private linesEqual(a: SortantLine, b: SortantLine): boolean {
    return (
      a.reference === b.reference &&
      a.name === b.name &&
      a.price === b.price &&
      a.size === b.size &&
      a.color === b.color &&
      a.stock === b.stock
    );
  }

  private async loadState(path: string): Promise<As400ExportState | null> {
    try {
      const raw = await fs.readFile(path, 'utf-8');
      const parsed = JSON.parse(raw) as As400ExportState;
      if (!parsed?.lines || typeof parsed.lines !== 'object') {
        return null;
      }
      return parsed;
    } catch (e: unknown) {
      if ((e as NodeJS.ErrnoException)?.code === 'ENOENT') {
        return null;
      }
      this.logger.warn(`AS400 export state unreadable (${path}): ${e}`);
      return null;
    }
  }

  private async saveState(
    path: string,
    state: As400ExportState,
  ): Promise<void> {
    await fs.writeFile(path, JSON.stringify(state), 'utf-8');
  }

  private async fetchPublishedVariantRows(): Promise<SortantLine[]> {
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

  private buildCsv(lines: SortantDeltaLine[], mode: 'full' | 'delta'): string {
    if (mode === 'full') {
      const body = lines.map((r) =>
        [r.reference, r.name, r.price, r.sku, r.size, r.color, r.stock]
          .map(escapeCsvField)
          .join(';'),
      );
      return [FULL_CSV_HEADER, ...body].join('\n') + '\n';
    }

    const body = lines.map((r) =>
      [
        r.changeType,
        r.reference,
        r.name,
        r.price,
        r.sku,
        r.size,
        r.color,
        r.stock,
      ]
        .map(escapeCsvField)
        .join(';'),
    );
    return [DELTA_CSV_HEADER, ...body].join('\n') + '\n';
  }
}

function escapeCsvField(value: string): string {
  if (/[;"\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
