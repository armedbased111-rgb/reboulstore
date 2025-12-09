import { Link } from 'react-router-dom';

/**
 * Props du composant HeroSectionVideo
 * Ces props permettent de personnaliser le contenu du hero
 */
interface HeroSectionVideoProps {
  /** Titre principal (ex: "Winter Sale") */
  title: string;
  /** Sous-titre (ex: "Up To 50% Off") */
  subtitle: string;
  /** Texte du bouton CTA (ex: "Shop now") */
  buttonText: string;
  /** Lien de destination du bouton (ex: "/catalog") */
  buttonLink: string;
  /** URL de la vidéo de fond */
  videoSrc: string;
  /** Type MIME de la vidéo (ex: "video/mp4", "video/webm") - optionnel, par défaut "video/mp4" */
  videoType?: string;
}

/**
 * Composant HeroSectionVideo - Section hero avec vidéo de fond et overlay texte
 * Style inspiré A-COLD-WALL* : Structure exacte avec aspect ratio responsive, overlay, texte centré
 * 
 * Structure A-COLD-WALL* :
 * - Container avec marges (m-[2px], p-[2px])
 * - Vidéo area avec aspect ratio responsive (4/5 mobile, 2/1 desktop)
 * - Overlay noir 20% d'opacité
 * - Texte centré verticalement et horizontalement
 * 
 * Différences avec HeroSectionImage :
 * - Utilise <video> au lieu de <img>
 * - Vidéo en autoplay, loop, muted, playsInline pour meilleure UX
 */
export const HeroSectionVideo = ({
  title,
  subtitle,
  buttonText,
  buttonLink,
  videoSrc,
  videoType = 'video/mp4',
}: HeroSectionVideoProps) => {
  return (
    <section className="last:mb-0">
      {/* Container principal avec padding et background */}
      <div className="relative w-full">
        <div className="pb-4">
          {/* Flex container pour layout responsive */}
          <div className="md:flex md:flex-wrap md:gap-3 flex-col relative">
            {/* Vidéo area avec aspect ratio responsive */}
            <div className="w-full relative aspect-[4/5] md:aspect-[2/1] overflow-hidden md:max-h-[90vh]">
              {/* Lien cliquable sur toute la vidéo */}
              <Link to={buttonLink} className="block w-full h-full">
                <video
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  {/* Fallback pour navigateurs qui ne supportent pas la vidéo */}
                  <source src={videoSrc} type={videoType} />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
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
    </section>
  );
};
