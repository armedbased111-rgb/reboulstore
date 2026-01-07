import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { animateRevealUp } from '../animations';
import { useScrollAnimation } from '../animations/utils/useScrollAnimation';

/**
 * Page 404 - Page non trouvée
 * Style A-COLD-WALL* minimaliste
 */
export const NotFound = () => {
  const heroRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.1 });

  const contentRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.2 });

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow">
      <div className="w-full">
        {/* Hero Section */}
        <section ref={heroRef} className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center">
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-medium uppercase tracking-tight mb-6">
                404
              </h1>
              <p className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                Page non trouvée
              </p>
              <p className="text-base sm:text-lg text-black/70 max-w-2xl mx-auto uppercase leading-relaxed">
                La page que vous recherchez n'existe pas ou a été déplacée.
              </p>
            </div>
          </div>
        </section>

        {/* Actions Section */}
        <section ref={contentRef} className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-md font-[Geist] text-sm font-medium uppercase hover:bg-black/90 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Retour à l'accueil
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center gap-2 border border-black/20 text-black px-6 py-3 rounded-md font-[Geist] text-sm font-medium uppercase hover:bg-black/5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Page précédente
                </button>
              </div>
              <div className="pt-8">
                <p className="text-sm text-black/70 uppercase mb-4">
                  Ou explorez nos pages :
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/catalog"
                    className="text-sm text-black/70 uppercase hover:text-black transition-colors underline"
                  >
                    Catalogue
                  </Link>
                  <span className="text-black/30">•</span>
                  <Link
                    to="/about"
                    className="text-sm text-black/70 uppercase hover:text-black transition-colors underline"
                  >
                    À propos
                  </Link>
                  <span className="text-black/30">•</span>
                  <Link
                    to="/contact"
                    className="text-sm text-black/70 uppercase hover:text-black transition-colors underline"
                  >
                    Contact
                  </Link>
                  <span className="text-black/30">•</span>
                  <Link
                    to="/stores"
                    className="text-sm text-black/70 uppercase hover:text-black transition-colors underline"
                  >
                    Boutiques
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

