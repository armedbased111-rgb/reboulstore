import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { CookieConsentChoice } from '../constants/cookieConsent';
import { COOKIE_CONSENT_STORAGE_KEY } from '../constants/cookieConsent';
import { initAnalytics } from '../utils/analytics';

function readStored(): CookieConsentChoice | null {
  try {
    const v = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (v === 'necessary' || v === 'analytics') return v;
  } catch {
    /* ignore */
  }
  return null;
}

type CookieConsentContextValue = {
  consent: CookieConsentChoice | null;
  analyticsAllowed: boolean;
  preferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptNecessary: () => void;
  acceptAnalytics: () => void;
  showBanner: boolean;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsentChoice | null>(() =>
    typeof window !== 'undefined' ? readStored() : null
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const consentRef = useRef(consent);
  consentRef.current = consent;

  useEffect(() => {
    if (consent === 'analytics') {
      initAnalytics();
    }
  }, [consent]);

  const acceptNecessary = useCallback(() => {
    const wasAnalytics = consentRef.current === 'analytics';
    try {
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'necessary');
    } catch {
      /* ignore */
    }
    setConsent('necessary');
    setPreferencesOpen(false);
    if (wasAnalytics) {
      window.location.reload();
    }
  }, []);

  const acceptAnalytics = useCallback(() => {
    try {
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'analytics');
    } catch {
      /* ignore */
    }
    setConsent('analytics');
    setPreferencesOpen(false);
  }, []);

  const openPreferences = useCallback(() => setPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setPreferencesOpen(false), []);

  const showBanner = consent === null || preferencesOpen;
  const analyticsAllowed = consent === 'analytics';

  const value = useMemo(
    () => ({
      consent,
      analyticsAllowed,
      preferencesOpen,
      openPreferences,
      closePreferences,
      acceptNecessary,
      acceptAnalytics,
      showBanner,
    }),
    [
      consent,
      analyticsAllowed,
      preferencesOpen,
      openPreferences,
      closePreferences,
      acceptNecessary,
      acceptAnalytics,
      showBanner,
    ]
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return ctx;
}
