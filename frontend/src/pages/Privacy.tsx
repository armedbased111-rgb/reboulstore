import { Link, useLocation } from 'react-router-dom';
import { animateRevealUp } from '../animations';
import { useScrollAnimation } from '../animations/utils/useScrollAnimation';
import { SeoHead } from '../components/seo/SeoHead';
import { LEGAL_SITE_INFO } from '../copy/legalSiteInfo';

const PRIVACY_PATHS = ['/privacy', '/politique-de-confidentialite'];

/**
 * Page Privacy — mentions légales, RGPD & politique de confidentialité
 * Routes : /privacy, /politique-de-confidentialite
 */
export const Privacy = () => {
  const { pathname } = useLocation();
  const isPolitique = pathname === '/politique-de-confidentialite';
  const seoPath = PRIVACY_PATHS.includes(pathname) ? pathname : '/privacy';

  const heroRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.1 });

  const contentRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.2 });

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow">
      <SeoHead
        title={
          isPolitique
            ? 'Politique de confidentialite | Reboul Store'
            : 'Confidentialite et mentions legales | Reboul Store'
        }
        description={
          isPolitique
            ? 'Politique de confidentialite et protection des donnees personnelles — Reboul Store.'
            : 'Mentions legales, RGPD et politique de confidentialite Reboul Store.'
        }
        path={seoPath}
      />
      <div className="w-full">
        {/* Hero Section */}
        <section ref={heroRef} className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium uppercase tracking-tight mb-6">
              {isPolitique ? 'Politique de confidentialité' : 'Mentions légales & Confidentialité'}
            </h1>
            <p className="text-base sm:text-lg text-black/70 max-w-3xl uppercase leading-relaxed">
              {isPolitique
                ? 'Comment nous collectons, utilisons et protégeons vos données personnelles.'
                : 'Protection de vos données personnelles et informations légales.'}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section ref={contentRef} className="border-b border-black/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="space-y-12">
              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  Éditeur du site
                </h2>
                <div className="text-sm text-black/70 uppercase leading-relaxed space-y-2">
                  <p><strong>Raison sociale :</strong> {LEGAL_SITE_INFO.raisonSociale}</p>
                  <p><strong>Forme juridique :</strong> {LEGAL_SITE_INFO.formeJuridique}</p>
                  <p><strong>Siège social :</strong> {LEGAL_SITE_INFO.siegeSocial}</p>
                  <p><strong>SIRET :</strong> {LEGAL_SITE_INFO.siret}</p>
                  <p><strong>RCS :</strong> {LEGAL_SITE_INFO.rcs}</p>
                  <p><strong>TVA intracommunautaire :</strong> {LEGAL_SITE_INFO.tvaIntracommunautaire}</p>
                  <p><strong>Directeur de publication :</strong> {LEGAL_SITE_INFO.directeurPublication}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  Hébergement
                </h2>
                <div className="text-sm text-black/70 uppercase leading-relaxed space-y-2">
                  <p><strong>Hébergeur :</strong> {LEGAL_SITE_INFO.hebergeur.nom}</p>
                  <p><strong>Adresse :</strong> {LEGAL_SITE_INFO.hebergeur.adresse}</p>
                  <p><strong>Site :</strong> {LEGAL_SITE_INFO.hebergeur.siteWeb}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  Protection des données personnelles
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium uppercase mb-3">Responsable du traitement</h3>
                    <p className="text-sm text-black/70 uppercase leading-relaxed">
                      Reboul Store est responsable du traitement des données personnelles collectées 
                      sur le site reboulstore.com.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium uppercase mb-3">Données collectées</h3>
                    <p className="text-sm text-black/70 uppercase leading-relaxed mb-2">
                      Nous collectons les données suivantes :
                    </p>
                    <ul className="list-disc list-inside text-sm text-black/70 uppercase space-y-1 ml-4">
                      <li>Nom et prénom</li>
                      <li>Adresse email</li>
                      <li>Adresse postale</li>
                      <li>Numéro de téléphone</li>
                      <li>Données de navigation (cookies)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium uppercase mb-3">Finalité du traitement</h3>
                    <p className="text-sm text-black/70 uppercase leading-relaxed mb-2">
                      Les données collectées sont utilisées pour :
                    </p>
                    <ul className="list-disc list-inside text-sm text-black/70 uppercase space-y-1 ml-4">
                      <li>Le traitement et la livraison de vos commandes</li>
                      <li>La gestion de votre compte client</li>
                      <li>L'envoi d'informations commerciales (avec votre consentement)</li>
                      <li>L'amélioration de nos services</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium uppercase mb-3">Conservation des données</h3>
                    <p className="text-sm text-black/70 uppercase leading-relaxed">
                      Vos données personnelles sont conservées pendant la durée nécessaire aux finalités 
                      pour lesquelles elles ont été collectées, conformément aux obligations légales.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium uppercase mb-3">Vos droits</h3>
                    <p className="text-sm text-black/70 uppercase leading-relaxed mb-2">
                      Conformément au RGPD, vous disposez des droits suivants :
                    </p>
                    <ul className="list-disc list-inside text-sm text-black/70 uppercase space-y-1 ml-4">
                      <li>Droit d'accès à vos données</li>
                      <li>Droit de rectification</li>
                      <li>Droit à l'effacement</li>
                      <li>Droit à la portabilité</li>
                      <li>Droit d'opposition</li>
                      <li>Droit à la limitation du traitement</li>
                    </ul>
                    <p className="text-sm text-black/70 uppercase leading-relaxed mt-4">
                      Pour exercer ces droits, contactez-nous à : {LEGAL_SITE_INFO.emailContact}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  Cookies
                </h2>
                <p className="text-sm text-black/70 uppercase leading-relaxed mb-4">
                  Détail des traceurs et du stockage local : voir la page dédiée{' '}
                  <Link to="/cookies" className="underline hover:text-black">
                    Cookies & traceurs
                  </Link>
                  . Le panier et certaines préférences utilisent le stockage local du navigateur ; le
                  paiement passe par Stripe ; une mesure d’audience Google Analytics 4 peut être activée
                  ultérieurement avec consentement si besoin.
                </p>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  En résumé :
                </p>
                <ul className="list-disc list-inside text-sm text-black/70 uppercase space-y-1 ml-4 mt-2">
                  <li>Stockage local (panier, session, préférences UI)</li>
                  <li>Cookies / traceurs du prestataire de paiement sur les pages Stripe</li>
                  <li>Pas de cookies d’analyse Reboul tant que GA4 n’est pas activé côté site</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  Propriété intellectuelle
                </h2>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  L'ensemble des éléments du site (textes, images, logos, etc.) sont la propriété 
                  exclusive de Reboul Store et sont protégés par les lois relatives à la propriété 
                  intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

