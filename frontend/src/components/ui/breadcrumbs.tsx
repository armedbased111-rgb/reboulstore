import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Composant Breadcrumbs - Fil d'Ariane style A-COLD-WALL*
 * 
 * Affiche un chemin de navigation avec liens cliquables
 * Dernier élément non cliquable
 */
export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  if (items.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 py-2" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {isLast ? (
              <span className="font-[Geist] text-[12px] leading-[16px] tracking-[-0.35px] text-gray-600 uppercase">
                {item.label}
              </span>
            ) : (
              <>
                <Link
                  to={item.href || '#'}
                  className="font-[Geist] text-[12px] leading-[16px] tracking-[-0.35px] text-gray-600 hover:text-black hover:underline transition-colors uppercase"
                >
                  {item.label}
                </Link>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
};

