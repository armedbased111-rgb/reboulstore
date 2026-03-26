interface Tab {
  id: string;
  label: string;
  content: string | React.ReactNode;
}

interface ProductTabsProps {
  tabs: Tab[];
}

/**
 * Sections produit style ACW* — layout 2 colonnes statique, tout affiché d'un coup.
 * Colonne gauche : label section (12px)
 * Colonne droite : contenu
 * Aucune interaction, séparé par des bordures fines.
 */
export const ProductTabs = ({ tabs }: ProductTabsProps) => {
  return (
    <div className="mt-8 border-t border-black">
      {tabs.map((tab) => (
        <div key={tab.id} className="grid grid-cols-[110px_1fr] gap-6 border-b border-black py-3">
          <p className="text-[12px] font-medium leading-[1.4] text-black pt-[1px]">
            {tab.label}
          </p>
          <div className="text-[12px] leading-[1.6] text-black/80">
            {tab.content}
          </div>
        </div>
      ))}
    </div>
  );
};
