import { Link } from 'react-router-dom';
import { useCookieConsent } from '../../contexts/CookieConsentContext';
import { Button } from '@/components/ui/button';

const hasGa = Boolean(import.meta.env.VITE_GA_MEASUREMENT_ID);

/**
 * Bandeau consentement cookies (CNIL : choix avant traceurs non nécessaires).
 */
export function CookieConsentBanner() {
  const { showBanner, consent, preferencesOpen, closePreferences, acceptNecessary, acceptAnalytics } =
    useCookieConsent();

  if (!showBanner) return null;

  const title =
    preferencesOpen && consent !== null ? 'Modifier vos préférences' : 'Cookies & confidentialité';

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[10001] border-t border-black bg-white px-4 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h2
            id="cookie-consent-title"
            className="text-[11px] font-medium uppercase tracking-wide text-black"
          >
            {title}
          </h2>
          <p className="text-[10px] uppercase leading-relaxed text-black/70">
            Nous utilisons des cookies et le stockage local pour le panier et le fonctionnement du site.
            {hasGa
              ? ' Avec votre accord, nous activons aussi Google Analytics 4 pour la mesure d’audience.'
              : ' Aucun outil de mesure d’audience tiers n’est configuré pour le moment.'}{' '}
            <Link to="/cookies" className="underline underline-offset-2 hover:text-black">
              Politique cookies
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          {preferencesOpen && consent !== null && (
            <Button
              type="button"
              variant="ghost"
              className="h-8 rounded-md border border-transparent text-[10px] uppercase tracking-wide hover:bg-black/5"
              onClick={closePreferences}
            >
              Fermer
            </Button>
          )}
          {hasGa ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-8 rounded-md border-black text-[10px] uppercase tracking-wide"
                onClick={acceptNecessary}
              >
                Tout refuser
              </Button>
              <Button
                type="button"
                variant="default"
                className="h-8 rounded-md bg-black text-[10px] uppercase tracking-wide text-white hover:bg-black/90"
                onClick={acceptAnalytics}
              >
                Accepter la mesure d’audience
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="default"
              className="h-8 rounded-md bg-black text-[10px] uppercase tracking-wide text-white hover:bg-black/90"
              onClick={acceptNecessary}
            >
              Continuer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
