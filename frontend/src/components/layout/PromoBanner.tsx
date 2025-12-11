import { useLocalStorage } from '../../hooks/useLocalStorage';

/**
 * Composant PromoBanner - Bannière promotionnelle en haut de page
 * Style inspiré A-COLD-WALL* : Bannière bleue avec texte blanc, bouton Close
 * La fermeture est mémorisée dans localStorage
 */
export const PromoBanner = () => {
  // Mémoriser la fermeture dans localStorage
  const [isClosed, setIsClosed] = useLocalStorage<boolean>('promoBannerClosed', false);

  // Si la bannière est fermée, ne rien afficher
  if (isClosed) return null;

        return (
    <div className="bg-[#1D1D1D] text-white py-2 px-4 flex items-center justify-between">
      {/* Texte promotionnel */}
      <div className="flex-1 text-left">
        <span className="uppercase text-sm font-medium tracking-wide">
          WINTER SALE - UP TO 50% OFF
        </span>
      </div>

      {/* Bouton Close */}
      <button
        onClick={() => setIsClosed(true)}
        className="ml-4 text-white hover:opacity-70 transition-opacity uppercase text-sm font-medium tracking-wide"
        aria-label="Fermer la bannière"
      >
        CLOSE
      </button>
    </div>
  );
};
