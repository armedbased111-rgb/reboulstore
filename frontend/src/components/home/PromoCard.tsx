import { Link } from 'react-router-dom';

/**
 * Props du composant PromoCard
 * Ce composant est réutilisable pour promouvoir différents contenus :
 * - Hôtels, boutiques, collaborations, podcasts, etc.
 */
interface PromoCardProps {
  // Image
  /** URL de l'image principale */
  imageUrl: string;
  /** Texte alternatif pour l'accessibilité */
  imageAlt?: string;
  
  // Lien de l'image (optionnel - si présent, l'image devient cliquable)
  /** URL du lien sur l'image (optionnel) */
  imageLink?: string;
  /** Si true, ouvre le lien dans un nouvel onglet */
  imageLinkExternal?: boolean;
  
  // Overlay sur l'image (optionnel)
  /** Texte en haut de l'overlay (ex: "A-COLD-WALL* MATERIAL STUDY") */
  overlayTopText?: string;
  /** Titre principal de l'overlay (ex: "Alaska Alaska") */
  overlayTitle?: string;
  /** Numéro ou texte en haut à droite de l'overlay (ex: "003") */
  overlayNumber?: string;
  
  // Contenu texte
  /** Titre principal de la carte */
  title: string;
  /** Description en tableau de strings (chaque string = un paragraphe) */
  description: string[];

  // Grille d'images (optionnel)
  /** Première image de la grille (optionnel) */
  gridImage1?: string;
  /** Texte alternatif pour la première image */
  gridImage1Alt?: string;
  /** Lien pour la première image (optionnel) */
  gridImage1Link?: string;
  /** Description pour la première image (optionnel - affichée en overlay) */
  gridImage1Description?: string;
  /** Deuxième image de la grille (optionnel) */
  gridImage2?: string;
  /** Texte alternatif pour la deuxième image */
  gridImage2Alt?: string;
  /** Lien pour la deuxième image (optionnel) */
  gridImage2Link?: string;
  /** Description pour la deuxième image (optionnel - affichée en overlay) */
  gridImage2Description?: string;
}

/**
 * Composant PromoCard - Carte promotionnelle réutilisable
 * Style inspiré A-COLD-WALL* : Layout 2 colonnes (image + texte)
 * 
 * Structure :
 * - Colonne gauche : Image avec overlay optionnel (30% largeur)
 * - Colonne droite : Titre, description, grille d'images optionnelle (70% largeur)
 * 
 * Utilisation :
 * - Promouvoir des hôtels, boutiques, collaborations, podcasts, etc.
 * - Tous les éléments sont personnalisables via props
 */
export const PromoCard = ({
    imageUrl,
    imageAlt = '',
    imageLink,
    imageLinkExternal = false,
    overlayTopText,
    overlayTitle,
    overlayNumber,
    title,
    description,
    gridImage1,
    gridImage1Alt = '',
    gridImage1Link,
    gridImage1Description,
    gridImage2,
    gridImage2Alt = '',
    gridImage2Link,
    gridImage2Description,
  }: PromoCardProps) => {
  // Fonction pour rendre l'image (avec ou sans lien)
  const renderImage = () => {
    const imageElement = (
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-full h-full object-cover md:h-full"
        loading="lazy"
      />
    );

    // Si imageLink est fourni, envelopper l'image dans un lien
    if (imageLink) {
      if (imageLinkExternal) {
        return (
          <a
            href={imageLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
          >
            {imageElement}
          </a>
        );
      } else {
        return (
          <Link to={imageLink} className="block w-full h-full">
            {imageElement}
          </Link>
        );
      }
    }

    return imageElement;
  };

    // Fonction pour rendre une image de la grille (avec ou sans lien)
    const renderGridImage = (imageUrl: string, alt: string, link?: string) => {
        const imageElement = (
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        );
    
        if (link) {
          return (
            <Link to={link} className="block w-full h-full">
              {imageElement}
            </Link>
          );
        }
    
        return imageElement;
      };

  return (
    <section className="m-[2px] last:mb-0">
      <div className="p-[2px] relative w-full">
        <div className="pb-4">
          {/* Layout flex : 2 colonnes (image + texte) - items-stretch garantit hauteur égale */}
          <div className="md:flex md:items-stretch md:gap-3 relative">
            {/* Colonne gauche : Image (30% largeur) */}
            <div className="min-w-[288px] flex-[3] w-full md:w-[30%] relative flex-shrink-0">
              {/* Container image - Aspect ratio sur mobile, hauteur 100% sur desktop */}
              <div className="relative w-full aspect-square md:aspect-[4/5] md:h-full overflow-hidden">
                {renderImage()}

                {/* Overlay optionnel sur l'image */}
                {(overlayTopText || overlayTitle || overlayNumber) && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-[] bg-opacity-90">
                    {/* Texte en haut */}
                    {overlayTopText && (
                      <div className="text-xs uppercase text-white mb-1">
                        {overlayTopText}
                      </div>
                    )}
                    
                    {/* Titre principal de l'overlay */}
                    {overlayTitle && (
                      <div className="text-[24px] sm:text-[24px] md:text-[28px] lg:text-[35px] font-light uppercase text-white mb-1">
                        {overlayTitle}
                      </div>
                    )}
                    
                    {/* Numéro en haut à droite (positionné en absolute) */}
                    {overlayNumber && (
                      <div className="absolute top-0 right-4 text-white font-medium text-lg">
                        {overlayNumber}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Colonne droite : Contenu texte (70% largeur) - Aligné en bas */}
            <div className="flex flex-col gap-3 mt-3 md:mt-0 flex-[7] w-full md:w-[70%] md:justify-end md:h-full overflow-hidden">
              {/* Titre - Ne rétrécit pas */}
              <div className="text-[24px] sm:text-[24px] md:text-[28px] lg:text-[25px] font-medium uppercase tracking-tight flex-shrink-0">
                {title}
              </div>

              {/* Description (tableau de paragraphes) - Prend l'espace disponible, scroll si nécessaire */}
              <div className="text-base md:text-lg uppercase font-light flex-1 min-h-0 overflow-y-auto">
                {description.map((paragraph, index) => (
                  <p key={index} className={index > 0 ? 'mt-3' : ''}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Grille d'images (2 images côte à côte) - Optionnel */}
              {(gridImage1 || gridImage2) && (
                <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                  {/* Première image */}
                  {gridImage1 && (
                    <div className="relative aspect-square overflow-hidden">
                      {renderGridImage(gridImage1, gridImage1Alt, gridImage1Link)}
                      
                      {/* Overlay avec description - Optionnel - Même style que l'overlay principal */}
                      {gridImage1Description && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[] bg-opacity-90">
                          <div className="text-[24px] sm:text-[24px] md:text-[28px] lg:text-[35px] font-light uppercase text-white">
                            {gridImage1Description}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Deuxième image */}
                  {gridImage2 && (
                    <div className="relative aspect-square overflow-hidden">
                      {renderGridImage(gridImage2, gridImage2Alt, gridImage2Link)}
                      
                      {/* Overlay avec description - Optionnel - Même style que l'overlay principal */}
                      {gridImage2Description && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[] bg-opacity-90">
                          <div className="text-[24px] sm:text-[24px] md:text-[28px] lg:text-[35px] font-light uppercase text-white">
                            {gridImage2Description}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};