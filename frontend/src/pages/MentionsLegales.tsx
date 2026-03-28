import { animateRevealUp } from '../animations';
import { useScrollAnimation } from '../animations/utils/useScrollAnimation';
import { SeoHead } from '../components/seo/SeoHead';
import { LEGAL_SITE_INFO } from '../copy/legalSiteInfo';

export const MentionsLegales = () => {
  const heroRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.1 });
  const contentRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.2 });

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow">
      <SeoHead
        title="Mentions legales | Reboul Store"
        description="Editeur, hebergement et informations obligatoires — Reboul Store."
        path="/mentions-legales"
      />
      <div className="w-full">
        <section ref={heroRef} className="border-b border-black/10">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <h1 className="mb-6 text-3xl font-medium uppercase tracking-tight sm:text-4xl lg:text-5xl">
              Mentions légales
            </h1>
            <p className="max-w-3xl text-base uppercase leading-relaxed text-black/70 sm:text-lg">
              Informations relatives à l’éditeur du site et à l’hébergement (obligations pour la France).
            </p>
          </div>
        </section>

        <section ref={contentRef} className="border-b border-black/10">
          <div className="mx-auto max-w-4xl space-y-12 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div>
              <h2 className="mb-4 text-xl font-medium uppercase tracking-tight sm:text-2xl">
                Éditeur du site
              </h2>
              <div className="space-y-2 text-sm uppercase leading-relaxed text-black/70">
                <p>
                  <strong>Raison sociale :</strong> {LEGAL_SITE_INFO.raisonSociale}
                </p>
                <p>
                  <strong>Forme juridique :</strong> {LEGAL_SITE_INFO.formeJuridique}
                </p>
                <p>
                  <strong>Siège social :</strong> {LEGAL_SITE_INFO.siegeSocial}
                </p>
                <p>
                  <strong>SIRET :</strong> {LEGAL_SITE_INFO.siret}
                </p>
                <p>
                  <strong>RCS :</strong> {LEGAL_SITE_INFO.rcs}
                </p>
                <p>
                  <strong>TVA intracommunautaire :</strong> {LEGAL_SITE_INFO.tvaIntracommunautaire}
                </p>
                <p>
                  <strong>Directeur de la publication :</strong> {LEGAL_SITE_INFO.directeurPublication}
                </p>
                <p>
                  <strong>Contact :</strong> {LEGAL_SITE_INFO.emailContact}
                </p>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-medium uppercase tracking-tight sm:text-2xl">
                Hébergement
              </h2>
              <div className="space-y-2 text-sm uppercase leading-relaxed text-black/70">
                <p>
                  <strong>Hébergeur :</strong> {LEGAL_SITE_INFO.hebergeur.nom}
                </p>
                <p>
                  <strong>Adresse :</strong> {LEGAL_SITE_INFO.hebergeur.adresse}
                </p>
                <p>
                  <strong>Site :</strong> {LEGAL_SITE_INFO.hebergeur.siteWeb}
                </p>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-medium uppercase tracking-tight sm:text-2xl">
                Propriété intellectuelle
              </h2>
              <p className="text-sm uppercase leading-relaxed text-black/70">
                L’ensemble du site (textes, images, logos, structure) est protégé. Toute reproduction non
                autorisée est interdite. Les marques citées appartiennent à leurs titulaires respectifs.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-medium uppercase tracking-tight sm:text-2xl">
                Médiation & litiges
              </h2>
              <p className="text-sm uppercase leading-relaxed text-black/70">
                Conformément aux articles L. 612-1 et suivants du code de la consommation, le consommateur
                peut recourir gratuitement à un médiateur : {LEGAL_SITE_INFO.mediateurConsommation.nom} —{' '}
                {LEGAL_SITE_INFO.mediateurConsommation.adresse} — {LEGAL_SITE_INFO.mediateurConsommation.url}.
                Plateforme européenne de règlement des litiges :{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  className="underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ec.europa.eu/consumers/odr
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
