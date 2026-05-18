export class ExportSortantResultDto {
  path: string;
  lineCount: number;
  generatedAt: string;
  mode: 'full' | 'delta';
  updateCount: number;
  deleteCount: number;
}
