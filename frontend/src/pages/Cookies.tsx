import { Link } from 'react-router-dom';
import { animateRevealUp } from '../animations';
import { useScrollAnimation } from '../animations/utils/useScrollAnimation';
import { SeoHead } from '../components/seo/SeoHead';

/**
 * Politique cookies / traceurs — alignée sur le front actuel (localStorage, Stripe, GA4 optionnel).
 */
export const Cookies = () => {
  const heroRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.1 });
  const contentRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.2 });

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow">
      <SeoHead
        title="Politique cookies | Reboul Store"
        description="Utilisation des cookies et traceurs sur reboulstore.com."
        path="/cookies"
      />
      <div className="w-full">
        <section ref={heroRef} className="border-b border-black/10">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <h1 className="mb-6 text-3xl font-medium uppercase tracking-tight sm:text-4xl lg:text-5xl">
              Cookies & traceurs
            </h1>
            <p className="max-w-3xl text-base uppercase leading-relaxed text-black/70 sm:text-lg">
              Informations sur les cookies utilisés lors de la navigation et du paiement sur le site.
            </p>
          </div>
        </section>

        <section ref={contentRef} className="border-b border-black/10">
          <div className="mx-auto max-w-4xl space-y-10 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div>
              <h2 className="mb-4 text-xl font-medium uppercase tracking-tight sm:text-2xl">
                Qu’est-ce qu’un cookie ?
              </h2>
              <p className="text-sm uppercase leading-relaxed text-black/70">
                Un cookie est un petit fichier déposé sur votre terminal lors de la visite d’un site. Il
                permet de faire fonctionner le site, de sécuriser certaines actions ou de mesurer
                l’audience selon les cas.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-medium uppercase tracking-tight sm:text-2xl">
                Données stockées dans le navigateur (panier, préférences)
              </h2>
              <p className="text-sm uppercase leading-relaxed text-black/70">
                Le site utilise le stockage local du navigateur (localStorage), pas des cookies HTTP
                first-party, pour lier votre panier à un identifiant de session, mémoriser certaines
                préférences (ex. bannière, recherche récente) et transmettre un identifiant de session aux
                requêtes API. Ces données restent sur votre appareil ; elles sont nécessaires au bon
                fonctionnement du site et du panier.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-medium uppercase tracking-tight sm:text-2xl">
                Cookies strictement nécessaires
              </h2>
              <p className="text-sm uppercase leading-relaxed text-black/70">
                D’éventuels cookies techniques peuvent être utilisés par l’infrastructure (serveur, CDN,
                sécurité). Ils servent au bon déroulement de la navigation et du paiement.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-medium uppercase tracking-tight sm:text-2xl">
                Paiement (Stripe)
              </h2>
              <p className="text-sm uppercase leading-relaxed text-black/70">
                Le paiement par carte est traité par Stripe. Lorsque vous êtes redirigé vers Stripe Checkout,
                des cookies ou traceurs équivalents peuvent être déposés par Stripe sur leur domaine, selon
                leur propre politique :{' '}
                <a
                  href="https://stripe.com/legal/cookies-policy"
                  className="underline hover:text-black"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  stripe.com — politique cookies
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-medium uppercase tracking-tight sm:text-2xl">
                Mesure d’audience (Google Analytics 4)
              </h2>
              <p className="text-sm uppercase leading-relaxed text-black/70">
                L’application peut intégrer Google Analytics 4 via une variable d’environnement de build.
                Tant que cette intégration n’est pas activée et chargée au démarrage du site, aucun cookie
                Google n’est déposé par Reboul Store. Si vous activez GA4, la CNIL exige en principe un
                mécanisme de consentement avant chargement des traceurs non strictement nécessaires (bandeau
                ou équivalent).
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-medium uppercase tracking-tight sm:text-2xl">
                Marketing & réseaux sociaux
              </h2>
              <p className="text-sm uppercase leading-relaxed text-black/70">
                Les liens vers Instagram ou Facebook depuis le pied de page vous dirigent vers des sites
                tiers qui peuvent déposer leurs propres cookies. Aucun pixel de suivi publicitaire n’est
                chargé sur reboulstore.com dans la version actuelle du front ; si vous en ajoutez, mettez à
                jour cette page et le consentement utilisateur.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-medium uppercase tracking-tight sm:text-2xl">
                Durée de conservation
              </h2>
              <p className="text-sm uppercase leading-relaxed text-black/70">
                Session navigateur pour le localStorage lié au panier tant que vous ne videz pas les données
                du site ; cookies tiers selon Stripe ou GA4 le cas échéant. Pour l’audience, la CNIL
                recommande une durée d’environ 13 mois maximum pour les cookies de mesure une fois
                déposés.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-medium uppercase tracking-tight sm:text-2xl">
                Vos choix
              </h2>
              <p className="text-sm uppercase leading-relaxed text-black/70">
                Un bandeau vous permet de refuser ou d’accepter la mesure d’audience (Google Analytics 4)
                avant tout chargement du script. Vous pouvez modifier ce choix à tout moment via « Préférences
                cookies » en bas de page. Vous pouvez aussi configurer votre navigateur pour refuser certains
                cookies. Pour en savoir plus :{' '}
                <a
                  href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser"
                  className="underline hover:text-black"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  cnil.fr — cookies
                </a>
                . Pour les données personnelles : voir notre{' '}
                <Link to="/politique-de-confidentialite" className="underline hover:text-black">
                  politique de confidentialité
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
