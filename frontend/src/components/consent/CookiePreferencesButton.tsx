import { useCookieConsent } from '../../contexts/CookieConsentContext';

/** Lien-style pour rouvrir le bandeau de consentement (footer). */
export function CookiePreferencesButton() {
  const { openPreferences } = useCookieConsent();

  return (
    <button
      type="button"
      onClick={openPreferences}
      className="mt-3 block text-left text-[10px] uppercase tracking-wide underline underline-offset-2 hover:text-gray-600"
    >
      Préférences cookies
    </button>
  );
}
