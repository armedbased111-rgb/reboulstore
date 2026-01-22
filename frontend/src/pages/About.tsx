import { animateRevealUp } from '../animations';
import { useScrollAnimation } from '../animations/utils/useScrollAnimation';

/**
 * Page About - À propos de Reboul Store
 */
export const About = () => {
  const createRevealUp = (threshold: number = 0.2) =>
    useScrollAnimation((element) => {
      animateRevealUp(element, { duration: 1.2, distance: 40 });
    }, { threshold });

  const heroRef = createRevealUp(0.1);
  const conceptRef = createRevealUp();
  const historyRef = createRevealUp();
  const localRef = createRevealUp();

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow">
      <div className="w-full">
        {/* Hero Section */}
        <section ref={heroRef} className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium uppercase tracking-tight mb-6">
              À propos
            </h1>
            <p className="text-base sm:text-lg text-black/70 max-w-3xl uppercase leading-relaxed">
              Reboul Store est un concept-store premium dédié à la mode streetwear et lifestyle, 
              ancré dans le sud de la France.
            </p>
          </div>
        </section>

        {/* Concept Section */}
        <section ref={conceptRef} className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <h2 className="text-2xl sm:text-3xl font-medium uppercase tracking-tight mb-8">
              Le concept
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <p className="text-sm sm:text-base text-black/70 uppercase leading-relaxed mb-6">
                  Reboul Store incarne l'essence du streetwear moderne, alliant minimalisme 
                  et sophistication. Notre sélection de marques premium reflète notre engagement 
                  envers la qualité et l'authenticité.
                </p>
                <p className="text-sm sm:text-base text-black/70 uppercase leading-relaxed">
                  Chaque pièce est soigneusement choisie pour sa singularité et sa capacité 
                  à définir un style unique, à la croisée entre l'élégance et l'urbanité.
                </p>
              </div>
              <div>
                <p className="text-sm sm:text-base text-black/70 uppercase leading-relaxed">
                  Notre approche privilégie la curation plutôt que la quantité, 
                  offrant une expérience shopping exclusive où chaque produit raconte une histoire.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section ref={historyRef} className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <h2 className="text-2xl sm:text-3xl font-medium uppercase tracking-tight mb-8">
              Notre histoire
            </h2>
            <div className="max-w-3xl">
              <p className="text-sm sm:text-base text-black/70 uppercase leading-relaxed mb-6">
                Fondé avec la vision de créer un espace où la mode rencontre l'art de vivre, 
                Reboul Store est né de la passion pour le streetwear et le design contemporain.
              </p>
              <p className="text-sm sm:text-base text-black/70 uppercase leading-relaxed">
                Notre mission est de proposer une sélection pointue de marques qui partagent 
                nos valeurs : qualité, authenticité et innovation. Chaque collection est pensée 
                pour accompagner nos clients dans leur expression personnelle.
              </p>
            </div>
          </div>
        </section>

        {/* Local Anchoring Section */}
        <section ref={localRef} className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <h2 className="text-2xl sm:text-3xl font-medium uppercase tracking-tight mb-8">
              Ancrage local
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-medium uppercase mb-4">Marseille</h3>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Au cœur de la cité phocéenne, notre boutique incarne l'énergie 
                  et la diversité culturelle de la ville.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium uppercase mb-4">Cassis</h3>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Entre mer et calanques, notre présence reflète l'élégance 
                  méditerranéenne et le raffinement du littoral.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium uppercase mb-4">Sanary</h3>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Dans cette charmante station balnéaire, nous apportons 
                  une touche de modernité au style provençal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <h2 className="text-2xl sm:text-3xl font-medium uppercase tracking-tight mb-12">
              Nos valeurs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-base font-medium uppercase mb-3">Qualité</h3>
                <p className="text-xs sm:text-sm text-black/70 uppercase leading-relaxed">
                  Sélection rigoureuse de produits premium
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium uppercase mb-3">Authenticité</h3>
                <p className="text-xs sm:text-sm text-black/70 uppercase leading-relaxed">
                  Marques qui partagent notre vision
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium uppercase mb-3">Innovation</h3>
                <p className="text-xs sm:text-sm text-black/70 uppercase leading-relaxed">
                  Toujours à la pointe des tendances
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium uppercase mb-3">Excellence</h3>
                <p className="text-xs sm:text-sm text-black/70 uppercase leading-relaxed">
                  Service client au plus haut niveau
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
