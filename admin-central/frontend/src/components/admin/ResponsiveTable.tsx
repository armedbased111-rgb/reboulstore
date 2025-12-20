import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

/**
 * Props pour ResponsiveTable
 */
interface ResponsiveTableProps {
  headers: Array<{
    label: string;
    key?: string;
    className?: string;
    hideOnMobile?: boolean;
  }>;
  data: Array<Record<string, any>>;
  renderRow: (item: Record<string, any>, index: number) => ReactNode;
  renderCard?: (item: Record<string, any>, index: number) => ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * Composant de tableau responsive
 * 
 * Affiche :
 * - Cards sur mobile (< 768px)
 * - Tableau sur tablette/desktop (≥ 768px)
 */
export default function ResponsiveTable({
  headers,
  data,
  renderRow,
  renderCard,
  loading,
  emptyMessage = 'Aucun élément trouvé',
  className,
}: ResponsiveTableProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
        <p className="mt-4 text-sm text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden', className)}>
      {/* Desktop/Tablette : Tableau */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    header.className,
                    header.hideOnMobile && 'hidden lg:table-cell'
                  )}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => renderRow(item, index))}
          </tbody>
        </table>
      </div>

      {/* Mobile : Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {data.map((item, index) => (
          <div key={index}>
            {renderCard ? (
              renderCard(item, index)
            ) : (
              <div className="p-4 space-y-2">
                {headers
                  .filter((h) => !h.hideOnMobile)
                  .map((header, headerIndex) => (
                    <div key={headerIndex} className="flex justify-between items-start">
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {header.label}
                      </span>
                      <span className="text-sm text-gray-900 text-right flex-1 ml-4">
                        {item[header.key || header.label.toLowerCase()]}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
