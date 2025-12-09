import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: string | React.ReactNode;
}

interface ProductTabsProps {
  tabs: Tab[];
}

/**
 * Composant ProductTabs - Onglets style A-COLD-WALL*
 * 
 * Tabs avec :
 * - Liste d'onglets (gauche desktop, horizontal mobile)
 * - Tab actif avec bullet point noir
 * - Contenu dynamique à droite
 */
export const ProductTabs = ({ tabs }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row">
        {/* Liste des tabs */}
        <ul className="flex gap-x-4 flex-wrap sm:w-48 sm:flex-col sm:gap-0 mb-4 sm:mb-0 sm:mr-4">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab flex items-center gap-1 cursor-pointer text-t2 underline-offset-2 sm:no-underline ${
                activeTab === tab.id ? 'underline' : ''
              }`}
            >
              {/* Bullet point (visible seulement si actif sur desktop) */}
              <span
                className={`w-[12px] h-[12px] bg-current rounded-full ${
                  activeTab === tab.id ? 'hidden sm:block' : 'hidden'
                }`}
              ></span>
              <h3>{tab.label}</h3>
            </li>
          ))}
        </ul>

        {/* Contenu du tab actif */}
        <div className="flex-1 text">
          {activeTabContent}
        </div>
      </div>
    </div>
  );
};