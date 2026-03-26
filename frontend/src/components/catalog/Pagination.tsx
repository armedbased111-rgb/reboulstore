interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, totalPages, total, limit, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Génère les numéros de pages à afficher (avec ellipsis)
  const getPageNumbers = () => {
    const delta = 2;
    const pages: (number | '...')[] = [];
    const rangeStart = Math.max(1, page - delta);
    const rangeEnd = Math.min(totalPages, page + delta);

    if (rangeStart > 1) {
      pages.push(1);
      if (rangeStart > 2) pages.push('...');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages) {
      if (rangeEnd < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-4 py-10 border-t border-gray-100">
      <p className="text-xs uppercase tracking-widest text-gray-400">
        {start}–{end} sur {total} produits
      </p>

      <div className="flex items-center gap-1">
        {/* Précédent */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-9 h-9 flex items-center justify-center text-sm border border-gray-200 rounded-md hover:border-black hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-black"
          aria-label="Page précédente"
        >
          ←
        </button>

        {/* Numéros de page */}
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-sm text-gray-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`w-9 h-9 flex items-center justify-center text-sm border rounded-md transition-colors ${
                p === page
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 hover:border-black hover:bg-black hover:text-white'
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Suivant */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-9 h-9 flex items-center justify-center text-sm border border-gray-200 rounded-md hover:border-black hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-black"
          aria-label="Page suivante"
        >
          →
        </button>
      </div>
    </div>
  );
};
