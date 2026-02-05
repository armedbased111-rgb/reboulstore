import api from './api';

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
  collectionId: string | null;
  collectionName: string | null;
}

export interface ImportResult {
  productsCreated: number;
  variantsCreated: number;
  errors: string[];
}

export const reboulImportService = {
  async uploadPreview(file: File, collectionId?: string): Promise<{ rows: CsvRow[]; preview: ImportPreview }> {
    const form = new FormData();
    form.append('file', file);
    if (collectionId) form.append('collectionId', collectionId);
    const response = await api.post<{ rows: CsvRow[]; preview: ImportPreview }>(
      '/admin/reboul/import/upload',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },

  async execute(rows: CsvRow[], collectionId?: string): Promise<ImportResult> {
    const response = await api.post<ImportResult>('/admin/reboul/import/execute', {
      rows,
      collectionId,
    });
    return response.data;
  },
};
