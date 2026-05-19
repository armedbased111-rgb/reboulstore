export type As400ChangeType = 'update' | 'delete';

export interface SortantLine {
  reference: string;
  codArticle: string;
  name: string;
  price: string;
  sku: string;
  size: string;
  color: string;
  stock: string;
}

export interface SortantDeltaLine extends SortantLine {
  changeType: As400ChangeType;
}

export interface As400ExportState {
  lastExportAt: string;
  lastFullExportAt: string;
  lines: Record<string, SortantLine>;
}
