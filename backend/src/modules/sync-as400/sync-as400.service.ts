import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Variant } from '../../entities/variant.entity';
import { Order, OrderStatus } from '../../entities/order.entity';
import { ExportSortantResultDto } from './dto/export-sortant-result.dto';
import { ExportCommandesResultDto } from './dto/export-commandes-result.dto';
import {
  As400ExportState,
  SortantDeltaLine,
  SortantLine,
} from './sync-as400-export.types';

const FULL_CSV_HEADER = 'cod_article;reference;name;price;sku;size;color;stock';
const DELTA_CSV_HEADER =
  'change_type;cod_article;reference;name;price;sku;size;color;stock';
const COMMANDE_CSV_HEADER =
  'numero_commande;date;nom_client;cod_article;reference;designation;prix_vente;taille;quantite';
const STATE_FILENAME = '.as400-export-state.json';
const COMMANDES_STATE_FILENAME = '.as400-commandes-state.json';

@Injectable()
export class SyncAs400Service {
  private readonly logger = new Logger(SyncAs400Service.name);

  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
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

    const now = new Date().toISOString();

    if (mode === 'delta' && exportLines.length === 0) {
      const nextState: As400ExportState = {
        lastExportAt: now,
        lastFullExportAt: previousState!.lastFullExportAt,
        lines: Object.fromEntries(currentBySku),
      };
      await this.saveState(statePath, nextState);
      this.logger.log(
        'AS400 delta empty — aucun fichier delta créé (aucune ligne à envoyer)',
      );
      return {
        path: sortantDir,
        lineCount: 0,
        generatedAt: now,
        mode,
        updateCount: 0,
        deleteCount: 0,
      };
    }

    const csv = this.buildCsv(exportLines, mode);
    await fs.mkdir(sortantDir, { recursive: true });

    const actualPath =
      mode === 'delta'
        ? join(sortantDir, `delta_${this.formatTimestamp(now)}.csv`)
        : outputPath;

    await fs.writeFile(actualPath, csv, 'utf-8');
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
      `AS400 sortant export (${mode}): ${exportLines.length} lines (${updateCount} update, ${deleteCount} delete) → ${actualPath}`,
    );

    return {
      path: actualPath,
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
      a.codArticle === b.codArticle &&
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
      .addSelect('v.codArticle', 'codArticle')
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
        codArticle: string | null;
        name: string;
        price: string;
        sku: string;
        size: string;
        color: string;
        stock: number;
      }>();

    return raw.map((r) => ({
      reference: String(r.reference ?? '').trim(),
      codArticle: String(r.codArticle ?? '').trim(),
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

  async exportCommandes(): Promise<ExportCommandesResultDto> {
    const sortantDir =
      this.configService.get<string>('AS400_SORTANT_DIR') ??
      '/tmp/as400-sortant';
    const commandesDir = join(sortantDir, 'commandes');
    const statePath = join(sortantDir, COMMANDES_STATE_FILENAME);

    await fs.mkdir(commandesDir, { recursive: true });

    const lastExportedId = await this.loadLastExportedOrderId(statePath);

    const orders = await this.orderRepository
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.cart', 'c')
      .leftJoinAndSelect('c.items', 'ci')
      .leftJoinAndSelect('ci.variant', 'v')
      .leftJoin('v.product', 'p')
      .addSelect(['p.reference', 'p.name', 'p.price'])
      .where('o.status IN (:...statuses)', {
        statuses: [
          OrderStatus.PAID,
          OrderStatus.PROCESSING,
          OrderStatus.SHIPPED,
          OrderStatus.DELIVERED,
        ],
      })
      .andWhere('o.id > :lastId', { lastId: lastExportedId })
      .orderBy('o.id', 'ASC')
      .getMany();

    if (orders.length === 0) {
      this.logger.log('AS400 commandes: aucune nouvelle commande à exporter');
      return {
        path: commandesDir,
        orderCount: 0,
        lineCount: 0,
        generatedAt: new Date().toISOString(),
      };
    }

    const now = new Date().toISOString();
    let totalLines = 0;

    for (const order of orders) {
      const lines = await this.buildCommandeLines(order);
      const body = lines.map((l) =>
        [
          l.numeroCommande,
          l.date,
          l.nomClient,
          l.codArticle,
          l.reference,
          l.designation,
          l.prixVente,
          l.taille,
          l.quantite,
        ]
          .map(escapeCsvField)
          .join(';'),
      );
      const csv =
        [COMMANDE_CSV_HEADER, ...body].join('\n') + '\n';
      const filename = `commande_${order.id}_${this.formatTimestamp(now)}.csv`;
      await fs.writeFile(join(commandesDir, filename), csv, 'utf-8');
      totalLines += lines.length;
      this.logger.log(
        `AS400 commande #${order.id}: ${lines.length} lignes → ${filename}`,
      );
    }

    const maxId = orders[orders.length - 1].id;
    await this.saveLastExportedOrderId(statePath, maxId);

    this.logger.log(
      `AS400 commandes export: ${orders.length} commandes, ${totalLines} lignes → ${commandesDir}`,
    );

    return {
      path: commandesDir,
      orderCount: orders.length,
      lineCount: totalLines,
      generatedAt: now,
    };
  }

  private async buildCommandeLines(
    order: Order,
  ): Promise<
    Array<{
      numeroCommande: string;
      date: string;
      nomClient: string;
      codArticle: string;
      reference: string;
      designation: string;
      prixVente: string;
      taille: string;
      quantite: string;
    }>
  > {
    const nomClient = order.customerInfo?.name ?? '';
    const dateStr = order.paidAt
      ? new Date(order.paidAt).toISOString().slice(0, 10)
      : new Date(order.createdAt).toISOString().slice(0, 10);
    const orderNum = String(order.id);

    if (order.cart?.items?.length) {
      return order.cart.items.map((item) => ({
        numeroCommande: orderNum,
        date: dateStr,
        nomClient,
        codArticle: item.variant?.codArticle ?? '',
        reference: (item.variant?.product as any)?.reference ?? '',
        designation: (item.variant?.product as any)?.name ?? '',
        prixVente: this.formatPrice(
          (item.variant?.product as any)?.price ?? 0,
        ),
        taille: item.variant?.size ?? '',
        quantite: String(item.quantity),
      }));
    }

    if (order.items?.length) {
      const variantIds = order.items.map((i) => i.variantId);
      const variants = await this.variantRepository
        .createQueryBuilder('v')
        .leftJoin('v.product', 'p')
        .addSelect(['p.reference', 'p.name', 'p.price'])
        .whereInIds(variantIds)
        .getMany();
      const variantMap = new Map(variants.map((v) => [v.id, v]));

      return order.items.map((item) => {
        const v = variantMap.get(item.variantId);
        return {
          numeroCommande: orderNum,
          date: dateStr,
          nomClient,
          codArticle: v?.codArticle ?? '',
          reference: (v?.product as any)?.reference ?? '',
          designation: (v?.product as any)?.name ?? '',
          prixVente: this.formatPrice((v?.product as any)?.price ?? 0),
          taille: v?.size ?? '',
          quantite: String(item.quantity),
        };
      });
    }

    return [];
  }

  private async loadLastExportedOrderId(path: string): Promise<number> {
    try {
      const raw = await fs.readFile(path, 'utf-8');
      const parsed = JSON.parse(raw);
      return typeof parsed.lastOrderId === 'number' ? parsed.lastOrderId : 0;
    } catch {
      return 0;
    }
  }

  private async saveLastExportedOrderId(
    path: string,
    lastOrderId: number,
  ): Promise<void> {
    await fs.writeFile(
      path,
      JSON.stringify({ lastOrderId, exportedAt: new Date().toISOString() }),
      'utf-8',
    );
  }

  private formatTimestamp(iso: string): string {
    return iso.replace(/[-:]/g, '').replace('T', '_').replace(/\..+$/, '');
  }

  private buildCsv(lines: SortantDeltaLine[], mode: 'full' | 'delta'): string {
    if (mode === 'full') {
      const body = lines.map((r) =>
        [
          r.codArticle,
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
      return [FULL_CSV_HEADER, ...body].join('\n') + '\n';
    }

    const body = lines.map((r) =>
      [
        r.changeType,
        r.codArticle,
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
