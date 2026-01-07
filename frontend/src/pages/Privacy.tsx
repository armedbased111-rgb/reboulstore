import { useRef } from 'react';
import { animateRevealUp } from '../animations';
import { useScrollAnimation } from '../animations/utils/useScrollAnimation';

/**
 * Page Privacy - Mentions légales et RGPD
 */
export const Privacy = () => {
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
              Mentions légales & Confidentialité
            </h1>
            <p className="text-base sm:text-lg text-black/70 max-w-3xl uppercase leading-relaxed">
              Protection de vos données personnelles et informations légales.
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
                  <p><strong>Raison sociale :</strong> Reboul Store</p>
                  <p><strong>Forme juridique :</strong> [À compléter]</p>
                  <p><strong>Siège social :</strong> [Adresse complète]</p>
                  <p><strong>SIRET :</strong> [Numéro SIRET]</p>
                  <p><strong>RCS :</strong> [Numéro RCS]</p>
                  <p><strong>TVA Intracommunautaire :</strong> [Numéro TVA]</p>
                  <p><strong>Directeur de publication :</strong> [Nom]</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  Hébergement
                </h2>
                <div className="text-sm text-black/70 uppercase leading-relaxed space-y-2">
                  <p><strong>Hébergeur :</strong> [Nom de l'hébergeur]</p>
                  <p><strong>Adresse :</strong> [Adresse de l'hébergeur]</p>
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
                      Pour exercer ces droits, contactez-nous à : contact@reboulstore.com
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                  Cookies
                </h2>
                <p className="text-sm text-black/70 uppercase leading-relaxed mb-4">
                  Le site utilise des cookies pour améliorer votre expérience de navigation. 
                  Vous pouvez configurer votre navigateur pour refuser les cookies, 
                  mais certaines fonctionnalités du site peuvent ne plus être accessibles.
                </p>
                <p className="text-sm text-black/70 uppercase leading-relaxed">
                  Types de cookies utilisés :
                </p>
                <ul className="list-disc list-inside text-sm text-black/70 uppercase space-y-1 ml-4 mt-2">
                  <li>Cookies de session (nécessaires au fonctionnement du site)</li>
                  <li>Cookies d'analyse (pour améliorer nos services)</li>
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

