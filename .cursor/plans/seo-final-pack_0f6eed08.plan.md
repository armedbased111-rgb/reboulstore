---
name: seo-final-pack
overview: "Mise en place SEO finale complète: favicons de marque, métadonnées par page, prerender des routes stratégiques, robots/sitemap, et base multi-lang prête pour extension."
todos:
  - id: seo-head-foundations
    content: Mettre en place les fondations head globales et le pack favicon/manifest.
    status: completed
  - id: seo-page-metadata
    content: Brancher les métadonnées SEO page par page via un composant central.
    status: completed
  - id: seo-prerender-routes
    content: Configurer le prerender des routes statiques prioritaires.
    status: completed
  - id: seo-robots-sitemap
    content: Ajouter robots.txt et sitemap.xml avec script de maintenance.
    status: completed
  - id: seo-multilang-ready
    content: Préparer la structure hreflang et les utilitaires SEO multi-lang prêts.
    status: completed
  - id: seo-final-validation
    content: Valider techniquement et qualitativement la stack SEO en build et en test.
    status: completed
isProject: false
---

# Plan SEO Final (Complet)

## Objectif

Préparer une base SEO production-ready pour la version finale: identité navigateur propre (favicons), métadonnées robustes page par page, indexation facilitée via prerender, et socle multi-lang pour l’évolution.

## 1) Fondations globales du head

- Mettre à jour [frontend/index.html](frontend/index.html):
  - `lang` par défaut cohérent avec la marque
  - `<title>` et `meta description` fallback
  - OG/Twitter fallback minimaux
- Créer les assets favicon/webapp dans [frontend/public](frontend/public):
  - `favicon.ico`, `favicon-32x32.png`, `apple-touch-icon.png`, `site.webmanifest`
- Remplacer l’icône Vite actuelle (`/vite.svg`) par les assets de marque.

## 2) SEO dynamique par page (SPA)

- Installer et intégrer un composant central `SeoHead` (Helmet) dans [frontend/src](frontend/src).
- Brancher `SeoHead` sur les pages clés:
  - [frontend/src/pages/Home.tsx](frontend/src/pages/Home.tsx)
  - [frontend/src/pages/Catalog.tsx](frontend/src/pages/Catalog.tsx)
  - [frontend/src/pages/Search.tsx](frontend/src/pages/Search.tsx)
  - [frontend/src/pages/Product.tsx](frontend/src/pages/Product.tsx)
  - [frontend/src/pages/About.tsx](frontend/src/pages/About.tsx)
  - [frontend/src/pages/Contact.tsx](frontend/src/pages/Contact.tsx)
  - [frontend/src/pages/Stores.tsx](frontend/src/pages/Stores.tsx)
  - [frontend/src/pages/ShippingReturns.tsx](frontend/src/pages/ShippingReturns.tsx)
  - [frontend/src/pages/Terms.tsx](frontend/src/pages/Terms.tsx)
  - [frontend/src/pages/Privacy.tsx](frontend/src/pages/Privacy.tsx)
  - [frontend/src/pages/NotFound.tsx](frontend/src/pages/NotFound.tsx)
- Définir pour chaque page: `title`, `description`, `canonical`, OG/Twitter.
- Pour produit (`/product/:id`), alimenter title/description/OG via les données de `useProduct`.

## 3) Prerender des routes SEO stratégiques

- Ajouter le prerender au pipeline Vite (choix validé: prerender).
- Pré-rendre les routes stables:
  - `/`, `/catalog`, `/about`, `/contact`, `/stores`, `/shipping-returns`, `/terms`, `/privacy`
- Garder `/product/:id` en runtime (pas de slug migration pour cette release).

## 4) Robots et sitemap

- Ajouter [frontend/public/robots.txt](frontend/public/robots.txt) avec règles d’indexation claires.
- Ajouter [frontend/public/sitemap.xml](frontend/public/sitemap.xml) pour les pages stables.
- Ajouter un script de génération/maintenance sitemap dans [frontend/package.json](frontend/package.json) pour les prochaines releases.

## 5) Base multi-lang (ready, sans migration complète)

- Préparer `hreflang` dans `SeoHead` (`x-default` + langues futures).
- Structurer les utilitaires SEO pour supporter facilement des variantes FR/EN plus tard, sans casser les URLs actuelles.

## 6) Validation SEO finale

- Vérifier techniquement:
  - métadonnées uniques et cohérentes par page
  - canonical/OG/Twitter présents
  - prerender généré sur les routes cibles
  - robots/sitemap servis correctement
- Vérifier qualité:
  - build/lint sans régression
  - test Lighthouse SEO sur pages clés
  - check manuel HTML rendu côté prod.

## Livrables attendus

- Pack favicon + manifest en production
- SEO tags propres sur toutes pages stratégiques
- Prerender actif sur routes cibles
- Robots + sitemap opérationnels
- Socle multi-lang prêt pour extension

