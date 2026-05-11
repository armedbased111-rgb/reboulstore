---
type: composants
---
# Composants clés

Vue d'ensemble des composants importants à connaître.

Liens : [[Frontend/Frontend]]

---

## Layout

**Header** — `src/components/layout/Header.tsx`
Navigation, logo, QuickSearch, icône panier. Sticky.

**Footer** — `src/components/layout/Footer.tsx`
Style A-COLD-WALL* — logo, navigation, social, slogan, mentions légales.

**BrandMarquee** — `src/components/layout/BrandMarquee.tsx`
Barre défilante sticky sous le header. Logos blancs sur fond noir. Animation CSS marquee. (source : Backend/brands)

**PromoBanner** — `src/components/layout/PromoBanner.tsx`
Bandeau promo en haut de page.

---

## Decoratifs (HUD technique)

**TechnicalDecorFrame** — `src/components/decorative/TechnicalDecorFrame.tsx`
Équerres d'angle, micro-crosshairs (+), ticks sur les bords, ligne datum en mono.
Règles : `pointer-events-none`, `z-[2]`, parent avec `relative` + `overflow-hidden`.
Props : `omitCorners`, `datum`, `datumClassName`, `insetClassName`, `sideTicks` (défaut true).

**TechnicalAmbientDecor** — `src/components/decorative/TechnicalAmbientDecor.tsx`
Version ambiante pour header / menus.

---

## Produit

**ProductCard** — `src/components/product/ProductCard.tsx`
Carte produit A-COLD-WALL* : fond #F8F8F8, hover 2 images (opacity), uppercase, prix barré.

**ProductGallery** — `src/components/product/ProductGallery.tsx`
Galerie : Swiper mobile, grille desktop.

**VariantSelector** — `src/components/product/VariantSelector.tsx`
Sélection taille. Bouton désactivé si stock = 0.

**AddToCartButton** — `src/components/product/AddToCartButton.tsx`
États : idle / loading / added / out-of-stock.

**StockBadge** — `src/components/product/StockBadge.tsx`
Indicateur stock faible (≤5) / épuisé.

**StockNotificationModal** — `src/components/product/StockNotificationModal.tsx`
Alerte email quand le stock revient.

---

## UI et notifications

**NewsletterEntryModal** — `src/components/NewsletterEntryModal.tsx`
Modale newsletter à l'entrée du site. Carte blanche type A-COLD-WALL*.

**CookieConsentBanner** — `src/components/CookieConsentBanner.tsx`
Consentement cookies RGPD. GA4 conditionné au consentement.

**AnimationProvider** — context AnimeJS
Hook `useAnimation()` pour nettoyage automatique au démontage.
Voir [[Frontend/animations]]

**NotificationsProvider** — WebSocket
Notifications temps réel (stock, commandes).

**NavigationLoader / PageLoader** — `src/components/`
Loaders de navigation et de page.

**SeoHead** — `src/components/SeoHead.tsx`
Wrapper react-helmet-async pour title / meta / OG.
