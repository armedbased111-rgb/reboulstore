---
type: page
fichier: src/pages/Cookies.tsx
route: /cookies
statut: complet
phase: "25"
---
# Page — Cookies

Politique de gestion des cookies (RGPD).

Liens : [[Frontend/Frontend]]

---

## Ce qui est en place

- Contenu légal statique (politique cookies)
- Explication des cookies utilisés (GA4, essentiels)
- Lien vers la modale de consentement CookieConsentBanner
- Route : `/cookies`

## Composants clés

- `CookieConsentBanner` — modale de consentement (composant `consent/`)
- `AnalyticsRouteTracker` — active GA4 seulement si consentement donné

## Notes

- GA4 gating : aucun tracking sans consentement explicite
- Cookie consent stocké en localStorage
