import { useBrands } from '../../hooks/useBrands';

/**
 * Composant BrandMarquee - Barre publicitaire avec logos blancs défilants
 * Style : Fond noir, logos blancs, défilement automatique continu
 * 
 * Utilisation :
 * - Positionné juste en dessous du Header (attaché au navbar)
 * - Reste visible lors du scroll (sticky avec le Header)
 * - Défilement infini horizontal
 * - Logos blancs pour contraste sur fond noir
 */
export const BrandMarquee = () => {
  const { brands, loading, error } = useBrands();

  // Filtrer les marques avec logos
  const brandsWithLogos = brands.filter(brand => brand.logoUrl);

  // Si pas de marques, ne rien afficher
  if (loading || error || brandsWithLogos.length === 0) {
    return null;
  }

  /**
   * Convertit l'URL du logo noir (_b) en logo blanc (_w)
   * Si le logo est déjà blanc ou n'a pas de _b, retourne l'URL originale
   */
  const getWhiteLogoUrl = (logoUrl: string): string => {
    // Si l'URL contient déjà _w ou n'a pas de _b, retourner tel quel
    if (logoUrl.includes('_w') || !logoUrl.includes('_b')) {
      return logoUrl;
    }
    // Remplacer _b par _w dans l'URL Cloudinary
    return logoUrl.replace('_b.png', '_w.png').replace('_b.', '_w.');
  };

  return (
    <div className="w-full bg-black py-1 md:py-1.5 overflow-hidden relative">
      {/* Container pour le défilement infini */}
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Première série de logos */}
        {brandsWithLogos.map((brand) => (
          <div
            key={`brand-1-${brand.id}`}
            className="flex-shrink-0 mx-3 md:mx-5 flex items-center justify-center"
            style={{ minWidth: '80px', height: '24px' }}
          >
            {brand.logoUrl ? (
              <img
                src={getWhiteLogoUrl(brand.logoUrl)}
                alt={brand.name}
                className="max-h-full max-w-[80px] w-auto h-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-200 filter brightness-0 invert"
                style={{ maxHeight: '24px', maxWidth: '80px' }}
                loading="lazy"
                onError={(e) => {
                  // Si le logo blanc n'existe pas, utiliser le logo noir avec filtre invert
                  const target = e.currentTarget;
                  if (brand.logoUrl) {
                    target.src = brand.logoUrl;
                    target.classList.add('filter', 'brightness-0', 'invert');
                  }
                }}
              />
            ) : (
              <span className="text-white text-xs uppercase opacity-50">
                {brand.name}
              </span>
            )}
          </div>
        ))}
        {/* Deuxième série de logos (pour défilement continu) */}
        {brandsWithLogos.map((brand) => (
          <div
            key={`brand-2-${brand.id}`}
            className="flex-shrink-0 mx-3 md:mx-5 flex items-center justify-center"
            style={{ minWidth: '80px', height: '24px' }}
          >
            {brand.logoUrl ? (
              <img
                src={getWhiteLogoUrl(brand.logoUrl)}
                alt={brand.name}
                className="max-h-full max-w-[80px] w-auto h-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-200 filter brightness-0 invert"
                style={{ maxHeight: '24px', maxWidth: '80px' }}
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (brand.logoUrl) {
                    target.src = brand.logoUrl;
                    target.classList.add('filter', 'brightness-0', 'invert');
                  }
                }}
              />
            ) : (
              <span className="text-white text-xs uppercase opacity-50">
                {brand.name}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Style CSS pour l'animation marquee */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

