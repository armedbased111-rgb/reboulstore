import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookieConsent } from '../../contexts/CookieConsentContext';
import { trackPageView } from '../../utils/analytics';

/** Envoie les vues de page GA4 en SPA après consentement analytics. */
export function AnalyticsRouteTracker() {
  const { pathname, search } = useLocation();
  const { analyticsAllowed } = useCookieConsent();

  useEffect(() => {
    if (!analyticsAllowed) return;
    trackPageView(pathname + search);
  }, [analyticsAllowed, pathname, search]);

  return null;
}
