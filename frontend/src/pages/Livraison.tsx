import { Link } from 'react-router-dom';
import { animateRevealUp } from '../animations';
import { useScrollAnimation } from '../animations/utils/useScrollAnimation';
import { SeoHead } from '../components/seo/SeoHead';

/**
 * Livraison — URL footer /livraison (détail retours : /shipping-returns)
 */
export const Livraison = () => {
  const heroRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.1 });
  const contentRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.2 });

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow">
      <SeoHead
        title="Livraison | Reboul Store"
        description="Delais, frais et suivi des livraisons Reboul Store."
        path="/livraison"
      />
      <div className="w-full">
        <section ref={heroRef} className="border-b border-black/10">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <h1 className="mb-6 text-3xl font-medium uppercase tracking-tight sm:text-4xl lg:text-5xl">
              Livraison
            </h1>
            <p className="max-w-3xl text-base uppercase leading-relaxed text-black/70 sm:text-lg">
              Modalités d’envoi de vos commandes. Pour les retours et remboursements, voir la page dédiée.
            </p>
            <p className="mt-6 text-sm uppercase text-black/50">
              <Link to="/shipping-returns" className="underline hover:text-black">
                Livraison & retours (page complète)
              </Link>
            </p>
          </div>
        </section>

        <section ref={contentRef} className="border-b border-black/10">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="space-y-8">
              <div>
                <h2 className="mb-4 text-lg font-medium uppercase">Délais de livraison</h2>
                <p className="mb-4 text-sm uppercase leading-relaxed text-black/70">
                  Les commandes sont traitées sous 24–48h ouvrées. Délais indicatifs selon destination :
                </p>
                <ul className="ml-4 list-inside list-disc space-y-2 text-sm uppercase text-black/70">
                  <li>France métropolitaine : 3–5 jours ouvrés</li>
                  <li>Europe : 5–10 jours ouvrés</li>
                  <li>International : 10–15 jours ouvrés</li>
                </ul>
              </div>
              <div>
                <h2 className="mb-4 text-lg font-medium uppercase">Frais de livraison</h2>
                <p className="mb-4 text-sm uppercase leading-relaxed text-black/70">
                  Calculés au checkout selon destination et poids. Livraison offerte à partir de 150€ en
                  France métropolitaine (sauf mention contraire sur le site).
                </p>
              </div>
              <div>
                <h2 className="mb-4 text-lg font-medium uppercase">Suivi</h2>
                <p className="text-sm uppercase leading-relaxed text-black/70">
                  Un e-mail de confirmation avec lien ou numéro de suivi est envoyé dès l’expédition.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
