# 🎨 Design System - Reboul Store

## 📋 Vue d'ensemble

Ce document décrit le design system de Reboul Store et le workflow de création des composants.

## 🎯 Inspiration : A-COLD-WALL*

Le design s'inspire **fortement** du site [A-COLD-WALL*](https://www.a-cold-wall.com/) :

### Style
- **Minimaliste et premium** : Design épuré, espacement généreux
- **Monochrome** : Noir, blanc, gris avec accent rouge
- **Industriel** : Aesthetic premium streetwear, moderne
- **Focus produit** : Layout propre, produit au centre

### Composants clés
- **Product Cards** : Fond gris clair (#F8F8F8), typo majuscules, prix barré pour promos
- **Navigation** : Minimaliste, épurée, mega menu structuré
- **Typographie** : Sans-serif moderne (Geist), majuscules pour produits
- **Espacements** : Généreux, système 8px

## 🎨 Design System Reboul Store

### Couleurs

- **Primary** : `#1A1A1A` - Noir premium, élégant
- **Secondary** : `#F3F3F3` - Blanc cassé, minimalisme
- **Accent** : `#D93434` - Rouge streetwear, énergie
- **Product Cards** : `#F8F8F8` - Gris très clair (inspiré A-COLD-WALL*)
- **Gris** : Palette de gris pour hiérarchie et textes secondaires
- **États** : Success (vert), Error (rouge), Warning (orange)

### Typographie (Geist)

- **H1** : 48px / 1.2 (bold) - Titres hero
- **H2** : 38px / 1.3 (bold) - Titres sections
- **H3** : 28px / 1.3 (semibold) - Sous-titres
- **Body** : 16px / 1.5 (regular) - Texte principal
- **Body 2** : 14px / 1.5 (regular) - Textes secondaires

### Espacements (Système 8px)

- **Base** : 4px, 8px, 16px, 24px, 32px, 48px, 64px
- **Marges sections** : 64px mobile, 96px desktop
- **Padding conteneur** : 16px mobile, 24px desktop

### Composants UI

#### Boutons
- **Primary** : Fond noir (#1A1A1A), texte blanc
- **Secondary** : Fond clair (#F3F3F3), texte noir, bordure
- **Outline** : Transparent, bordure, texte
- **Ghost** : Transparent, texte seulement
- **États** : Default, Hover, Pressed, Disabled

#### Cards
- **Product Card** : 
  - Fond gris très clair (#F8F8F8)
  - Image produit (ratio 3:4)
  - Nom en majuscules (sans-serif, semi-bold)
  - Prix normal ou promo (prix barré + prix réduit)
  - Style minimaliste et épuré
- **Category Card** : Image overlay + titre
- **Article Card** : Image + titre + extrait

#### Navigation
- **Header** : Fond blanc, ombre légère, mega menu structuré
- **Footer** : Fond sombre, colonnes organisées
- **Menu Mobile** : Drawer/sidebar

## 🔄 Workflow Design → Code

### Approche adoptée : Création directe

**Méthode** : Inspiration A-COLD-WALL* → Création directe en React/TailwindCSS

1. **Inspiration visuelle**
   - Analyser le style A-COLD-WALL* (couleurs, espacements, layout)
   - Identifier les patterns UX/UI efficaces
   - S'inspirer pour créer la version Reboul Store

2. **Création dans le code**
   - Créer le composant directement en React/TailwindCSS
   - Appliquer le design system défini
   - Style cohérent inspiré A-COLD-WALL*
   - Mobile-first avec TailwindCSS breakpoints

3. **Itération et ajustement**
   - Tester sur différents devices
   - Ajuster les espacements et couleurs
   - Vérifier la cohérence avec le design system
   - Optimiser les performances

### Avantages de cette approche

- ✅ Rapidité : Pas de phase maquettes intermédiaire
- ✅ Flexibilité : Ajustements directs dans le code
- ✅ Cohérence : Design system appliqué directement
- ✅ Efficacité : Un seul workflow, pas de double travail
- ✅ Itération : Tests et ajustements immédiats

## 📦 Composants créés

> MAJ 10/03/2026 — Phase 25 en cours

### Layout
- ✅ **Layout** : Wrapper principal (PromoBanner, Header, Footer, main)
- ✅ **Header** : Navigation, mega menu catégories + marques (images/vidéos hover), recherche, badge panier, auth button
- ✅ **Footer** : Style A-COLD-WALL*
- ✅ **PromoBanner** : Bannière promotionnelle
- ✅ **NavigationLoader** : Loader de navigation entre pages
- ✅ **PageLoader** : Loader d'ouverture animé

### Homepage
- ✅ **FeaturedProducts** : Carousel Swiper avec navigation, hover effect, prix réduit
- ✅ **HeroSectionImage** : Hero avec support vidéo/image
- ✅ **CategorySection** : Section catégories
- ✅ **PromoCard** : Carte promotionnelle

### Pages complètes
- ✅ **Catalog** : ProductGrid, filtres catégorie + marque, HeroSection (vidéo/image)
- ✅ **Product** : ProductGallery (Swiper), ProductInfo, VariantSelector, AddToCartButton, ProductTabs
- ✅ **Cart** : Panier complet
- ✅ **Checkout** : Formulaire + Stripe
- ✅ **Login / Register / Profile** : Auth complète (JWT, guards, routes protégées)
- ✅ **Orders / OrderDetail** : Historique commandes

### Header Variants (playground `/header-playground`)
- ✅ **HeaderReboulVariantA** : Éditoriale Symétrique (logo centré, nav split, underline hover)
- ✅ **HeaderReboulVariantB** : Double Bande (top bar marques + nav principale dropdown)
- ✅ **HeaderReboulVariantC** : Asymétrique Contemporaine (Cormorant italic, drawer mobile)

## 📝 Principes de design

### UX/UI E-commerce
1. **Clarté** : Informations produits claires (prix, disponibilité)
2. **Efficacité** : Parcours d'achat optimisé (moins de clics)
3. **Confiance** : Sécurité, garanties, avis visibles
4. **Mobile-first** : Expérience mobile prioritaire
5. **Performance** : Images optimisées, chargement rapide

### Accessibilité (WCAG)
- **Contraste** : Minimum 4.5:1 pour texte normal
- **Tailles** : Textes lisibles, boutons cliquables (min 44x44px)
- **Navigation** : Accessible au clavier
- **Alt text** : Toutes les images descriptives

### Performance
- **Images** : Lazy loading, gestion erreurs, placeholder
- **Animations** : GPU-accelerated, 60fps
- **Code** : Composants optimisés, code splitting

## 🚀 Références

- **Site inspiration** : [A-COLD-WALL*](https://www.a-cold-wall.com/)
- **Typographie** : Geist (déjà intégrée)
- **Framework CSS** : TailwindCSS v4
- **Composants UI** : shadcn/ui (optionnel, dans `/ui/shadcn`)
