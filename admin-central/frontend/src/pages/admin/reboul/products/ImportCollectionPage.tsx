import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../../components/Layout/AdminLayout';
import { reboulProductsService } from '../../../../services/reboul-products.service';
import {
  reboulImportService,
  CsvRow,
  ImportPreview,
  ImportResult,
} from '../../../../services/reboul-import.service';
import { reboulCollectionsService, Collection } from '../../../../services/reboul-collections.service';
import { Upload, ArrowLeft, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';

/**
 * Page d'import d'une collection : CSV (format complet) ou collage (fiche Edite).
 * Route : /admin/reboul/products/import
 */
export default function ImportCollectionPage() {
  const [pastedText, setPastedText] = useState('');
  const [pasteLoading, setPasteLoading] = useState(false);
  const [pasteResult, setPasteResult] = useState<{ created: number; updated: number; errors: { row: number; message: string }[] } | null>(null);
  const [pasteError, setPasteError] = useState<string | null>(null);

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvRows, setCsvRows] = useState<CsvRow[] | null>(null);
  const [csvPreview, setCsvPreview] = useState<ImportPreview | null>(null);
  const [csvCollectionId, setCsvCollectionId] = useState<string>('');
  const [csvUploadLoading, setCsvUploadLoading] = useState(false);
  const [csvExecuteLoading, setCsvExecuteLoading] = useState(false);
  const [csvResult, setCsvResult] = useState<ImportResult | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);

  const [collections, setCollections] = useState<Collection[]>([]);
  useEffect(() => {
    reboulCollectionsService.getCollections().then(setCollections).catch(() => {});
  }, []);

  const handlePasteImport = async () => {
    if (!pastedText.trim()) {
      setPasteError('Collez le tableau avant d\'importer.');
      return;
    }
    setPasteLoading(true);
    setPasteError(null);
    setPasteResult(null);
    try {
      const res = await reboulProductsService.importFromPaste(pastedText);
      setPasteResult(res);
    } catch (err: unknown) {
      let msg = 'Erreur lors de l\'import';
      if (err && typeof err === 'object' && 'response' in err) {
        const data = (err as { response?: { data?: { message?: string | string[] } } }).response?.data;
        const m = data?.message;
        msg = Array.isArray(m) ? m.join(', ') : (m ?? msg);
      } else if (err instanceof Error) msg = err.message;
      setPasteError(msg);
    } finally {
      setPasteLoading(false);
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      setCsvError('Sélectionnez un fichier CSV.');
      return;
    }
    setCsvUploadLoading(true);
    setCsvError(null);
    setCsvResult(null);
    setCsvRows(null);
    setCsvPreview(null);
    try {
      const { rows, preview } = await reboulImportService.uploadPreview(
        csvFile,
        csvCollectionId || undefined,
      );
      setCsvRows(rows);
      setCsvPreview(preview);
    } catch (err: unknown) {
      let msg = 'Erreur lors de la lecture du fichier';
      if (err && typeof err === 'object' && 'response' in err) {
        const data = (err as { response?: { data?: { message?: string } } }).response?.data;
        msg = data?.message ?? msg;
      } else if (err instanceof Error) msg = err.message;
      setCsvError(msg);
    } finally {
      setCsvUploadLoading(false);
    }
  };

  const handleCsvExecute = async () => {
    if (!csvRows?.length || !csvPreview?.canImport) return;
    setCsvExecuteLoading(true);
    setCsvError(null);
    try {
      const result = await reboulImportService.execute(
        csvRows,
        (csvPreview.collectionId ?? csvCollectionId) || undefined,
      );
      setCsvResult(result);
    } catch (err: unknown) {
      let msg = 'Erreur lors de l\'import';
      if (err && typeof err === 'object' && 'response' in err) {
        const data = (err as { response?: { data?: { message?: string } } }).response?.data;
        msg = data?.message ?? msg;
      } else if (err instanceof Error) msg = err.message;
      setCsvError(msg);
    } finally {
      setCsvExecuteLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/reboul/products"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux produits
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Importer une collection</h1>
          <p className="mt-1 text-sm text-gray-600">
            Import par fichier CSV (format complet) ou par collage du tableau fiche Edite.
          </p>
        </div>

        {/* --- Import CSV --- */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-medium text-gray-900">
            <FileSpreadsheet className="w-5 h-5" />
            Fichier CSV (format complet)
          </h2>
          <p className="text-sm text-gray-600">
            Colonnes : name, reference, description, price, brand, category, collection, color, size, stock, sku (optionnel : materials, careInstructions, madeIn). Une ligne = un variant.
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Fichier CSV</span>
              <input
                type="file"
                accept=".csv"
                className="block w-full text-sm text-gray-600 file:mr-2 file:rounded file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-indigo-700"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setCsvFile(f ?? null);
                  setCsvRows(null);
                  setCsvPreview(null);
                  setCsvResult(null);
                  setCsvError(null);
                }}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Collection (optionnel)</span>
              <select
                value={csvCollectionId}
                onChange={(e) => setCsvCollectionId(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Collection active</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleCsvUpload}
              disabled={csvUploadLoading || !csvFile}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {csvUploadLoading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Analyser
            </button>
          </div>
          {csvError && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{csvError}</p>
            </div>
          )}
          {csvPreview && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
              <p className="text-sm font-medium text-gray-800">
                {csvPreview.productCount} produit(s), {csvPreview.variantCount} variant(s).
                {csvPreview.collectionName && ` Collection : ${csvPreview.collectionName}.`}
              </p>
              {csvPreview.errors.length > 0 && (
                <ul className="text-sm text-amber-800 list-disc list-inside max-h-32 overflow-y-auto">
                  {csvPreview.errors.map((e, i) => (
                    <li key={i}>Ligne {e.rowIndex} : {e.errors.join(', ')}</li>
                  ))}
                </ul>
              )}
              {csvPreview.warnings.length > 0 && (
                <ul className="text-sm text-amber-700 list-disc list-inside max-h-24 overflow-y-auto">
                  {csvPreview.warnings.map((w, i) => (
                    <li key={i}>Ligne {w.rowIndex} : {w.warnings.join(', ')}</li>
                  ))}
                </ul>
              )}
              {csvPreview.canImport && (
                <button
                  type="button"
                  onClick={handleCsvExecute}
                  disabled={csvExecuteLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {csvExecuteLoading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Importer
                </button>
              )}
            </div>
          )}
          {csvResult && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex items-start gap-2 text-green-800">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">
                  {csvResult.productsCreated} produit(s) créé(s){csvResult.productsUpdated > 0 && `, ${csvResult.productsUpdated} mis à jour`}, {csvResult.variantsCreated} variant(s) créé(s){csvResult.variantsUpdated > 0 && `, ${csvResult.variantsUpdated} variant(s) mis à jour (stock)`}.
                </p>
                {csvResult.errors.length > 0 && (
                  <ul className="mt-2 text-sm list-disc list-inside">{csvResult.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
                )}
              </div>
            </div>
          )}
        </section>

        {/* --- Import par collage (fiche Edite) --- */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Coller le tableau (fiche Edite)</h2>
          <p className="text-sm text-gray-600">
            Colonnes : Marque, Genre, Reference, Stock. Une ligne = un article. Prix et nom à compléter après import.
          </p>
          {pasteError && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{pasteError}</p>
            </div>
          )}
          <textarea
            rows={10}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Marque	Genre	Reference	Stock&#10;Nike	Chaussures	NIKE-AIR-42	5&#10;..."
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            disabled={pasteLoading}
          />
          <button
            type="button"
            onClick={handlePasteImport}
            disabled={pasteLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {pasteLoading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Importer le tableau
          </button>
          {pasteResult && (
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  {pasteResult.created} créé(s){pasteResult.updated > 0 && `, ${pasteResult.updated} mis à jour (stock)`}.
                </span>
              </div>
              {pasteResult.errors.length > 0 && (
                <ul className="text-sm text-amber-700 list-disc list-inside max-h-48 overflow-y-auto">
                  {pasteResult.errors.map((e, i) => (
                    <li key={i}>Ligne {e.row} : {e.message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
