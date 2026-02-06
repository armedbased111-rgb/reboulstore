import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parse } from 'csv-parse/sync';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Brand } from './entities/brand.entity';
import { Collection } from './entities/collection.entity';
import { Variant } from './entities/variant.entity';
import { ReboulProductsService } from './reboul-products.service';

export interface CsvRow {
  name: string;
  reference?: string;
  description?: string;
  price: string;
  brand?: string;
  category: string;
  collection: string;
  color: string;
  size: string;
  stock: string;
  sku: string;
  materials?: string;
  careInstructions?: string;
  madeIn?: string;
}

export interface RowValidation {
  rowIndex: number;
  errors: string[];
  warnings: string[];
}

export interface ImportPreview {
  totalRows: number;
  productCount: number;
  variantCount: number;
  errors: RowValidation[];
  warnings: RowValidation[];
  canImport: boolean;
  collectionId: number | null;
  collectionName: string | null;
}

export interface ImportResult {
  productsCreated: number;
  variantsCreated: number;
  errors: string[];
}

@Injectable()
export class ReboulImportService {
  constructor(
    @InjectRepository(Category, 'reboul')
    private categoryRepository: Repository<Category>,
    @InjectRepository(Brand, 'reboul')
    private brandRepository: Repository<Brand>,
    @InjectRepository(Collection, 'reboul')
    private collectionRepository: Repository<Collection>,
    @InjectRepository(Variant, 'reboul')
    private variantRepository: Repository<Variant>,
    private productsService: ReboulProductsService,
  ) {}

  parseCsv(buffer: Buffer): CsvRow[] {
    const raw = buffer.toString('utf-8').trim();
    if (!raw) throw new BadRequestException('Fichier CSV vide');
    const lines = raw.split(/\r?\n/);
    const headerLine = lines[0] ?? '';
    if (!headerLine) throw new BadRequestException('CSV sans en-tête');
    const delimiter = headerLine.includes(';') && !headerLine.includes(',') ? ';' : ',';
    const records = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      delimiter,
    }) as Record<string, string>[];
    const normalized = records.map((r) => this.normalizeRow(r));
    return normalized;
  }

  private normalizeRow(r: Record<string, string>): CsvRow {
    const lower: Record<string, string> = {};
    for (const [k, v] of Object.entries(r)) lower[k.toLowerCase().trim()] = typeof v === 'string' ? v.trim() : String(v ?? '').trim();
    const get = (key: string) => lower[key] ?? lower[key.toLowerCase()] ?? '';
    const refVal = get('reference');
    let size = get('size');
    if (!size && refVal) {
      const parts = refVal.split(/\s+/);
      if (parts.length > 1) size = parts.pop() ?? '';
      else size = refVal;
    }
    let sku = get('sku');
    if (!sku && refVal) sku = refVal.replace(/\s+/g, '-').replace(/\//g, '-');
    return {
      name: get('name'),
      reference: refVal || undefined,
      description: get('description') || undefined,
      price: get('price') || '0',
      brand: get('brand') || undefined,
      category: get('category'),
      collection: get('collection'),
      color: get('color') || 'Uni',
      size: size || '',
      stock: get('stock') || '0',
      sku: sku || '',
      materials: get('materials') || undefined,
      careInstructions: get('careinstructions') || undefined,
      madeIn: get('madein') || undefined,
    };
  }

  async preview(rows: CsvRow[], collectionId?: number | string): Promise<ImportPreview> {
    const errors: RowValidation[] = [];
    const warnings: RowValidation[] = [];
    const categories = await this.categoryRepository.find();
    const brands = await this.brandRepository.find();
    const categoryByName = new Map(categories.map((c) => [c.name.toLowerCase(), c]));
    const brandByName = new Map(brands.map((b) => [b.name.toLowerCase(), b]));

    let targetCollection: Collection | null = null;
    const cid = collectionId != null ? Number(collectionId) : undefined;
    if (cid) {
      targetCollection = await this.collectionRepository.findOne({ where: { id: cid } });
      if (!targetCollection) throw new BadRequestException('Collection inexistante');
    } else {
      targetCollection = await this.collectionRepository.findOne({ where: { isActive: true } });
      if (!targetCollection && rows.length > 0) {
        const firstCollection = rows[0]?.collection;
        if (firstCollection) {
          targetCollection = await this.collectionRepository.findOne({
            where: { name: firstCollection },
          });
        }
        if (!targetCollection) {
          errors.push({ rowIndex: 0, errors: ['Aucune collection active et nom collection CSV non trouvé'], warnings: [] });
        }
      }
    }

    const seenReferences = new Set<string>();
    const productKeys = new Set<string>();

    // Source de vérité Reboul = référence produit (alignée magasin)
    const refKey = (row: CsvRow) => (row.reference ?? '').trim().replace(/\s+/g, ' ');

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowErrors: string[] = [];
      const rowWarnings: string[] = [];

      if (!row.name?.trim()) rowErrors.push('name obligatoire');
      if (!refKey(row)) rowErrors.push('référence produit obligatoire');
      const priceNum = parseFloat(String(row.price).replace(',', '.'));
      if (isNaN(priceNum) || priceNum <= 0) rowErrors.push('price invalide');
      if (!row.category?.trim()) rowErrors.push('category obligatoire');
      if (!row.collection?.trim() && !cid) rowWarnings.push('collection vide');
      if (!row.color?.trim()) rowErrors.push('color obligatoire');
      if (!row.size?.trim()) rowErrors.push('size obligatoire');
      const stockNum = parseInt(String(row.stock), 10);
      if (isNaN(stockNum) || stockNum < 0) rowWarnings.push('stock invalide, sera 0');
      const key = refKey(row);
      if (key && seenReferences.has(key)) rowErrors.push('référence en double (même ligne en double)');
      if (key) seenReferences.add(key);

      const cat = row.category?.trim() && categoryByName.get(row.category.toLowerCase());
      if (row.category?.trim() && !cat) rowErrors.push(`catégorie "${row.category}" introuvable`);
      if (row.brand?.trim() && !brandByName.get(row.brand.toLowerCase())) rowWarnings.push(`marque "${row.brand}" introuvable (produit sans marque)`);

      const nameNorm = (row.name ?? '').trim();
      const categoryNorm = (row.category ?? '').trim().toLowerCase();
      const refFull = (row.reference ?? row.name ?? '').trim();
      const refParts = refFull.split(/\s+/);
      const refBase = refParts.length > 1 ? refParts.slice(0, -1).join(' ').trim() : refFull;
      const productKey = `${refBase || nameNorm}|${nameNorm}|${priceNum}|${categoryNorm}|${(row.brand ?? '').trim().toLowerCase()}`;
      productKeys.add(productKey);

      if (rowErrors.length) errors.push({ rowIndex: i + 1, errors: rowErrors, warnings: rowWarnings });
      else if (rowWarnings.length) warnings.push({ rowIndex: i + 1, errors: [], warnings: rowWarnings });
    }

    const productCount = productKeys.size;
    const variantCount = rows.length;
    const canImport = errors.length === 0 && !!targetCollection;

    return {
      totalRows: rows.length,
      productCount,
      variantCount,
      errors,
      warnings,
      canImport,
      collectionId: targetCollection?.id ?? null,
      collectionName: targetCollection?.name ?? null,
    };
  }

  async execute(rows: CsvRow[], collectionId?: number | string): Promise<ImportResult> {
    const preview = await this.preview(rows, collectionId);
    if (!preview.canImport) {
      throw new BadRequestException({
        message: 'Import impossible (erreurs de validation)',
        errors: preview.errors,
      });
    }
    const cid = preview.collectionId!;
    const categories = await this.categoryRepository.find();
    const brands = await this.brandRepository.find();
    const categoryByName = new Map(categories.map((c) => [c.name.toLowerCase(), c]));
    const brandByName = new Map(brands.map((b) => [b.name.toLowerCase(), b]));

    const grouped = new Map<string, CsvRow[]>();
    for (const row of rows) {
      const priceNum = parseFloat(String(row.price).replace(',', '.'));
      const nameNorm = (row.name ?? '').trim();
      const categoryNorm = (row.category ?? '').trim().toLowerCase();
      const brandNorm = (row.brand ?? '').trim().toLowerCase();
      const refFull = (row.reference ?? row.name ?? '').trim();
      const refParts = refFull.split(/\s+/);
      const refBase = refParts.length > 1 ? refParts.slice(0, -1).join(' ').trim() : refFull;
      const key = `${refBase || nameNorm}|${nameNorm}|${priceNum}|${categoryNorm}|${brandNorm}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(row);
    }

    const result: ImportResult = { productsCreated: 0, variantsCreated: 0, errors: [] };

    const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const sizeSortKey = (size: string): number | string => {
      const n = parseInt(size, 10);
      if (!isNaN(n)) return n;
      const i = sizeOrder.indexOf(size.toUpperCase());
      return i >= 0 ? i : size;
    };

    for (const [, rows] of grouped) {
      const sortedRows = [...rows].sort((a, b) => {
        const sa = sizeSortKey((a.size ?? '').trim());
        const sb = sizeSortKey((b.size ?? '').trim());
        if (typeof sa === 'number' && typeof sb === 'number') return sa - sb;
        if (typeof sa === 'number') return -1;
        if (typeof sb === 'number') return 1;
        return String(sa).localeCompare(String(sb));
      });
      const first = sortedRows[0]!;
      const category = categoryByName.get(first.category.toLowerCase());
      if (!category) {
        result.errors.push(`Catégorie "${first.category}" introuvable pour ${first.name}`);
        continue;
      }
      const brand = first.brand?.trim() ? brandByName.get(first.brand.toLowerCase()) : null;
      const price = parseFloat(String(first.price).replace(',', '.'));

      const refFull = (first.reference ?? first.name ?? '').trim();
      const refParts = refFull.split(/\s+/);
      const refBase = refParts.length > 1 ? refParts.slice(0, -1).join(' ').trim() : refFull;

      const productData: Partial<Product> = {
        name: first.name,
        reference: refBase || first.reference || first.sku?.split('-')[0] || null,
        description: first.description || null,
        price,
        categoryId: category.id,
        brandId: brand?.id ?? null,
        collectionId: cid,
        materials: first.materials || null,
        careInstructions: first.careInstructions || null,
        madeIn: first.madeIn || null,
      };

      const variants = sortedRows.map((r) => ({
        color: (r.color ?? '').trim() || 'Uni',
        size: (r.size ?? '').trim(),
        stock: Math.max(0, parseInt(String(r.stock), 10) || 0),
        sku: (r.sku ?? '').trim(),
      }));

      try {
        await this.productsService.createWithImages(productData, [], variants);
        result.productsCreated += 1;
        result.variantsCreated += variants.length;
      } catch (e: any) {
        result.errors.push(`${first.name}: ${e?.message || String(e)}`);
      }
    }

    return result;
  }
}
