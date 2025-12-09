import { Link } from 'react-router-dom';

/**
 * Props du composant HeroSectionImage
 * Ces props permettent de personnaliser le contenu du hero
 */
interface HeroSectionImageProps {
  /** Titre principal (ex: "Winter Sale") */
  title: string;
  /** Sous-titre (ex: "Up To 50% Off") */
  subtitle: string;
  /** Texte du bouton CTA (ex: "Shop now") */
  buttonText: string;
  /** Lien de destination du bouton (ex: "/catalog") */
  buttonLink: string;
  /** URL de l'image de fond (si pas de vidéo) */
  imageSrc?: string;
  /** URL de la vidéo de fond (prioritaire sur imageSrc si fourni) */
  videoSrc?: string;
  /** Aspect ratio mobile (par défaut: "4/5") */
  aspectRatioMobile?: string;
  /** Aspect ratio desktop (par défaut: "2/1") - Ignoré si heightClass est fourni */
  aspectRatioDesktop?: string;
  /** Classe Tailwind pour la hauteur max desktop (par défaut: "md:max-h-[90vh]") */
  maxHeightClass?: string;
  /** Classe Tailwind pour une hauteur fixe desktop (ex: "md:h-[500px]") - Si fourni, remplace aspectRatioDesktop */
  heightClass?: string;
  /** Comportement de l'image/vidéo : "cover" (remplit tout, peut couper) ou "contain" (affiche tout, peut laisser de l'espace) */
  objectFit?: 'cover' | 'contain';
}

/**
 * Composant HeroSectionImage - Section hero avec image OU vidéo de fond et overlay texte
 * Style inspiré A-COLD-WALL* : Structure exacte avec aspect ratio responsive, overlay, texte centré
 * 
 * Structure A-COLD-WALL* :
 * - Container avec marges (m-[2px], p-[2px])
 * - Image/Video area avec aspect ratio responsive (4/5 mobile, 2/1 desktop)
 * - Overlay noir 20% d'opacité
 * - Texte centré verticalement et horizontalement
 * 
 * Utilisation :
 * - Fournir `videoSrc` pour une vidéo de fond (autoplay, loop, muted)
 * - Fournir `imageSrc` pour une image de fond
 * - Si les deux sont fournis, la vidéo a la priorité
 */
export const HeroSectionImage = ({
  title,
  subtitle,
  buttonText,
  buttonLink,
  imageSrc = '/placeholder-hero.jpg', // Placeholder par défaut
  videoSrc,
  aspectRatioMobile = '4/5',
  aspectRatioDesktop = '2/1',
  maxHeightClass = 'md:max-h-[90vh]',
  heightClass,
  objectFit = 'cover',
}: HeroSectionImageProps) => {
  // Convertir les aspect ratios en classes Tailwind ou styles inline
  const getAspectRatioClass = (ratio: string) => {
    const ratioMap: Record<string, string> = {
      '4/5': 'aspect-[4/5]',
      '2/1': 'aspect-[2/1]',
      '3/4': 'aspect-[3/4]',
      '16/9': 'aspect-video',
      '1/1': 'aspect-square',
    };
    return ratioMap[ratio] || `aspect-[${ratio}]`;
  };

  return (
    <section className="last:mb-0">
      {/* Container principal avec padding et background */}
      <div className="relative w-full">
        <div className="pb-4">
          {/* Flex container pour layout responsive */}
          <div className="md:flex md:flex-wrap md:gap-3 flex-col relative">
            {/* Image area avec aspect ratio responsive ou hauteur fixe */}
            <div 
              className={`w-full relative overflow-hidden ${getAspectRatioClass(aspectRatioMobile)} ${
                heightClass 
                  ? heightClass 
                  : `md:${getAspectRatioClass(aspectRatioDesktop)} ${maxHeightClass}`
              }`}
            >
              <div className="w-full h-full relative">
                {/* Lien cliquable sur toute l'image/vidéo */}
                <Link to={buttonLink} className="block w-full h-full absolute inset-0">
                  {videoSrc ? (
                    // Afficher vidéo si videoSrc est fourni
                    <video
                      src={videoSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className={`w-full h-full ${
                        objectFit === 'contain' ? 'object-contain' : 'object-cover'
                      }`}
                    />
                  ) : (
                    // Afficher image sinon
                    <img
                      src={imageSrc}
                      alt={title}
                      className={`w-full h-full ${
                        objectFit === 'contain' ? 'object-contain' : 'object-cover'
                      }`}
                      loading="eager" // Image hero = prioritaire, pas de lazy loading
                    />
                  )}
                </Link>

                {/* Overlay noir semi-transparent (20% opacité) */}
                <span className="absolute inset-0 bg-black opacity-20 pointer-events-none"></span>

                {/* Container texte centré - Positionné au centre */}
                <div className="flex flex-col gap-3 mt-3 md:mt-0 absolute inset-0 m-3 text-white lg:m-4 justify-center">
                  {/* Titre principal - Responsive text sizes */}
                  <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold uppercase tracking-tight">
                    {title}
                  </div>

                  {/* Sous-titre - Responsive text sizes */}
                  <div className="text-base md:text-lg lg:text-xl font-light uppercase">
                    {subtitle}
                  </div>

                  {/* Bouton CTA - Style A-COLD-WALL* */}
                  <div>
                    <Link
                      to={buttonLink}
                      className="inline-block py-2.5 md:py-1.5 px-6 rounded-[10px] md:rounded-md outline-none disabled:opacity-50 whitespace-nowrap text-base md:text-sm bg-black text-white hover:opacity-90 transition-opacity"
                    >
                      {buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
