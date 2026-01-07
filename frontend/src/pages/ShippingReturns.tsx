// useRef utilisé via useScrollAnimation
import { animateRevealUp } from '../animations';
import { useScrollAnimation } from '../animations/utils/useScrollAnimation';

/**
 * Page ShippingReturns - Politiques de livraison et retours
 */
export const ShippingReturns = () => {
  const heroRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.1 });

  const shippingRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.2 });

  const returnsRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.2 });

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow">
      <div className="w-full">
        {/* Hero Section */}
        <section ref={heroRef} className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium uppercase tracking-tight mb-6">
              Livraison & Retours
            </h1>
            <p className="text-base sm:text-lg text-black/70 max-w-3xl uppercase leading-relaxed">
              Toutes les informations concernant la livraison et les retours de vos commandes.
            </p>
          </div>
        </section>

        {/* Shipping Section */}
        <section ref={shippingRef} className="border-b border-black/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <h2 className="text-2xl sm:text-3xl font-medium uppercase tracking-tight mb-8">
              Livraison
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium uppercase mb-4">Délais de livraison</h3>
                <p className="text-sm text-black/70 uppercase leading-relaxed mb-4">
                  Les commandes sont traitées sous 24-48h ouvrées. Les délais de livraison 
                  varient selon la destination :
                </p>
                <ul className="list-disc list-inside text-sm text-black/70 uppercase space-y-2 ml-4">
                  <li>France métropolitaine : 3-5 jours ouvrés</li>
                  <li>Europe : 5-10 jours ouvrés</li>
                  <li>International : 10-15 jours ouvrés</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium uppercase mb-4">Frais de livraison</h3>
                <p className="text-sm text-black/70 uppercase leading-relaxed mb-4">
                  Les frais de livraison sont calculés lors du checkout selon la destination 
                  et le poids de votre commande.
                </p>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Livraison gratuite à partir de 150€ d'achat en France métropolitaine.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium uppercase mb-4">Suivi de commande</h3>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Vous recevrez un email de confirmation avec un numéro de suivi dès l'expédition 
                  de votre commande. Vous pourrez suivre l'acheminement de votre colis en temps réel.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Returns Section */}
        <section ref={returnsRef} className="border-b border-black/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <h2 className="text-2xl sm:text-3xl font-medium uppercase tracking-tight mb-8">
              Retours & Échanges
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium uppercase mb-4">Délai de retour</h3>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Vous disposez de 14 jours à compter de la réception de votre commande 
                  pour retourner un article non conforme ou défectueux.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium uppercase mb-4">Conditions de retour</h3>
                <p className="text-sm text-black/70 uppercase leading-relaxed mb-4">
                  Pour être accepté, le retour doit respecter les conditions suivantes :
                </p>
                <ul className="list-disc list-inside text-sm text-black/70 uppercase space-y-2 ml-4">
                  <li>Article non porté, non lavé et en parfait état</li>
                  <li>Étiquettes et emballage d'origine présents</li>
                  <li>Retour dans l'emballage d'origine si possible</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium uppercase mb-4">Processus de retour</h3>
                <p className="text-sm text-black/70 uppercase leading-relaxed mb-4">
                  Pour initier un retour, veuillez contacter notre service client via le 
                  formulaire de contact ou par email à contact@reboulstore.com.
                </p>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Nous vous fournirons un numéro de retour et les instructions pour l'expédition. 
                  Les frais de retour sont à la charge du client, sauf en cas de produit défectueux 
                  ou non conforme.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium uppercase mb-4">Remboursement</h3>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Une fois le retour reçu et vérifié, le remboursement sera effectué sous 5-7 jours 
                  ouvrés sur le moyen de paiement utilisé lors de la commande.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

