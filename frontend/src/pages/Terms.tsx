import { useRef } from 'react';
import { animateRevealUp } from '../animations';
import { useScrollAnimation } from '../animations/utils/useScrollAnimation';

/**
 * Page Terms - Conditions Générales de Vente (CGV)
 */
export const Terms = () => {
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium uppercase tracking-tight mb-6">
              Conditions Générales de Vente
            </h1>
            <p className="text-base sm:text-lg text-black/70 max-w-3xl uppercase leading-relaxed">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section ref={contentRef} className="border-b border-black/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="space-y-12">
              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  1. Objet
                </h2>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Les présentes Conditions Générales de Vente (CGV) régissent les relations entre 
                  Reboul Store et tout client effectuant un achat sur le site reboulstore.com. 
                  Toute commande implique l'acceptation sans réserve des présentes CGV.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  2. Produits
                </h2>
                <p className="text-sm text-black/70 uppercase leading-relaxed mb-4">
                  Les produits proposés sont ceux qui figurent sur le site au jour de la consultation 
                  par le client, dans la limite des stocks disponibles. Les photographies et graphiques 
                  présentés ne sont pas contractuels.
                </p>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Reboul Store se réserve le droit de modifier à tout moment l'assortiment des produits 
                  et de corriger toute erreur pouvant apparaître sur le site.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  3. Prix
                </h2>
                <p className="text-sm text-black/70 uppercase leading-relaxed mb-4">
                  Les prix sont indiqués en euros, toutes taxes comprises (TTC), hors frais de livraison. 
                  Les prix peuvent être modifiés à tout moment, mais les produits seront facturés sur la 
                  base du prix en vigueur au moment de la validation de la commande.
                </p>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Les frais de livraison sont indiqués lors du processus de commande avant validation finale.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  4. Commande
                </h2>
                <p className="text-sm text-black/70 uppercase leading-relaxed mb-4">
                  Toute commande vaut acceptation des prix et descriptions des produits disponibles à la vente. 
                  La validation de la commande implique l'acceptation des présentes CGV.
                </p>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Reboul Store se réserve le droit de refuser toute commande d'un client avec lequel 
                  il existerait un litige relatif au paiement d'une commande antérieure.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  5. Paiement
                </h2>
                <p className="text-sm text-black/70 uppercase leading-relaxed mb-4">
                  Le paiement s'effectue par carte bancaire via notre prestataire de paiement sécurisé Stripe. 
                  Le paiement est exigible immédiatement à la commande.
                </p>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  En cas de défaut de paiement, la commande sera automatiquement annulée.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  6. Livraison
                </h2>
                <p className="text-sm text-black/70 uppercase leading-relaxed mb-4">
                  Les délais de livraison sont indiqués à titre indicatif. Ils courent à compter de 
                  l'expédition de la commande. En cas de retard de livraison, le client sera informé 
                  par email.
                </p>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Les risques de perte ou d'endommagement des produits sont transférés au client au moment 
                  de la livraison.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  7. Droit de rétractation
                </h2>
                <p className="text-sm text-black/70 uppercase leading-relaxed mb-4">
                  Conformément à la législation en vigueur, le client dispose d'un délai de 14 jours 
                  à compter de la réception des produits pour exercer son droit de rétractation, 
                  sans avoir à justifier de motifs ni à payer de pénalité.
                </p>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Pour exercer ce droit, le client doit contacter le service client via le formulaire 
                  de contact ou par email.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  8. Propriété intellectuelle
                </h2>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Tous les éléments du site reboulstore.com sont et restent la propriété intellectuelle 
                  et exclusive de Reboul Store. Toute reproduction, même partielle, est interdite 
                  sans autorisation préalable.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  9. Données personnelles
                </h2>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Les données personnelles collectées sont traitées conformément à notre politique 
                  de confidentialité. Pour plus d'informations, consultez notre page 
                  <a href="/privacy" className="underline hover:text-black transition-colors"> Mentions légales</a>.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  10. Droit applicable
                </h2>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Les présentes CGV sont soumises au droit français. Tout litige relatif à leur 
                  interprétation et/ou à leur exécution relève des tribunaux compétents de Marseille.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

