# 🎨 Frontend - Documentation

## Statut de reference (06/05/2026)

- Phase active: **Phase 25 - finalisation frontend detaillee**
- Reference prioritaire: `obsidian-vault/Projet/phase-25.md`
- Contexte global: `obsidian-vault/REBOUL.md`

## 📋 Vue d'ensemble

Application frontend construite avec **React** (TypeScript), **Vite** comme build tool, et **TailwindCSS** pour le styling, containerisée avec Docker.

Voir aussi : `AUTH_USAGE.md` - `obsidian-vault/REBOUL.md` - `obsidian-vault/Architecture/design-system.md` - `obsidian-vault/Architecture/animations.md`

## 🛠️ Stack technique

- **Build tool** : Vite
- **Framework** : React (TypeScript)
- **Styling** : TailwindCSS v4
- **Composants UI** : shadcn/ui (dans `/ui/shadcn`)
- **Animations** : AnimeJS (via `AnimationProvider`)
- **Typographie** : Geist
- **Design** : Mobile-first
- **Inspiration Design** : [A-COLD-WALL*](https://www.a-cold-wall.com/) - Style minimaliste premium/streetwear
- **Workflow Design** : Inspiration A-COLD-WALL* → Création directe en React/TailwindCSS
- **Containerisation** : Docker

## 🎨 Workflow Design & Composants

### 🎯 Inspiration principale : A-COLD-WALL*

Le design s'inspire **fortement** du site [A-COLD-WALL*](https://www.a-cold-wall.com/) :
- **Style** : Minimaliste, premium, industriel, streetwear
- **Palette** : Monochrome (noir, blanc, gris) + accent rouge
- **Product Cards** : Fond gris clair (#F8F8F8), typo majuscules, prix barré
- **Layout** : Épuré, espacement généreux, focus sur le produit
- **Aesthetic** : Premium streetwear, moderne, épuré

### Décorations techniques (HUD / datasheet)

Repères discrets inspirés des interfaces « techniques » (Marathon, Stone Island, univers SCP, crosshairs) : **équerres d’angle**, **micro-crosshairs (+)**, **ticks** sur les bords, **ligne `datum`** en mono (ex. `COMMS // RBL-NS-01`). Toujours en **noir très bas contraste** sur fond clair, sans animation, `pointer-events-none`.

- **Composant** : `src/components/decorative/TechnicalDecorFrame.tsx` — à placer en premier enfant d’un conteneur `relative` + `rounded-*` + `overflow-hidden` pour hériter du rayon. Props : `omitCorners`, `datum` / `datumClassName`, `insetClassName`, `sideTicks` (défaut `true`). Calque décor `z-[2]` : prévoir panneaux contenu en `z-[3]` si besoin par-dessus.
- **Usage** : overlays, modales, cartes premium ; rester **subtil** (lisibilité et accessibilité avant tout).

### Workflow Design → Code ✅ APPROCHE ADOPTÉE

**Méthode adoptée** : Inspiration A-COLD-WALL* → Création directe en React/TailwindCSS

1. **Inspiration visuelle** :
   - S'inspirer du site [A-COLD-WALL*](https://www.a-cold-wall.com/) pour le style
   - Analyser : couleurs, espacements, typographie, layout, composants
   - Style : minimaliste, premium, monochrome + accent rouge

2. **Design System défini** :
   - Couleurs : Primary #1A1A1A, Secondary #F3F3F3, Accent #D93434
   - Typographie : Geist (H1-H3, Body, Body 2)
   - Espacements : système 8px (4px, 8px, 16px, 24px, 32px, 48px, 64px)
   - Product Cards : fond gris #F8F8F8, typo majuscules

3. **Création directe en React/TailwindCSS** :
   - Créer le composant dans `frontend/src/components/`
   - Appliquer le style A-COLD-WALL* avec TailwindCSS
   - Ajouter les fonctionnalités (hooks, interactions, state)
   - Mobile-first avec breakpoints TailwindCSS
   - Tester et ajuster

4. **Vérifier shadcn/ui** (optionnel) :
   - Si besoin d'un composant UI générique, vérifier shadcn/ui
   - Sinon : créer custom avec style A-COLD-WALL*

### shadcn/ui

- **Installation** : Tous les composants shadcn dans `/ui/shadcn`
- **Thème** : Basique noir/blanc (personnalisable)
- **Workflow** : 
  - Vérifier d'abord si composant shadcn existe
  - Si oui et adapté : Importer et utiliser
  - Si non : Créer composant custom ou demander maquette Figma/Framer

## 📁 Structure du frontend

```
frontend/
├── src/
│   ├── pages/            # Pages principales
│   │   ├── Home.tsx      # Page d'accueil
│   │   ├── Catalog.tsx   # Page catalogue
│   │   ├── Product.tsx   # Page fiche produit
│   │   ├── Cart.tsx      # Page panier
│   │   ├── Checkout.tsx  # Page checkout
│   │   └── About.tsx     # Page à propos (vitrine)
│   ├── components/       # Composants réutilisables
│   │   ├── layout/       # Layout (Header, Footer, etc.)
│   │   ├── product/      # Composants produits
│   │   ├── cart/         # Composants panier
│   │   ├── ui/           # Composants UI génériques
│   │   ├── decorative/   # HUD — TechnicalDecorFrame, TechnicalAmbientDecor (header / menus)
│   │   └── ui/shadcn/    # Composants shadcn/ui
│   ├── services/         # Services API
│   │   ├── api.ts        # Client API
│   │   ├── products.ts   # Service produits
│   │   ├── categories.ts # Service catégories
│   │   ├── cart.ts       # Service panier
│   │   ├── auth.ts       # Service authentification
│   │   └── orders.ts     # Service commandes
│   ├── copy/               # Textes transverses (ex. EARLY_ACCESS)
│   ├── hooks/            # Custom hooks
│   ├── types/            # Types TypeScript
│   ├── utils/            # Utilitaires
│   ├── styles/           # Styles globaux
│   ├── App.tsx           # Composant racine
│   └── main.tsx          # Point d'entrée
├── public/               # Assets statiques
├── docker-compose.yml
└── Dockerfile
```

## 🎨 Pages principales

### Home (Accueil)
- Hero section avec présentation du concept-store
- Sections mises en avant (nouvelles collections, catégories)
- Ancrage local (Marseille / Cassis / Sanary)
- **Carrousel Blog/Actualités** : Articles en défilement
- Design premium + streetwear

### Catalog (Catalogue) ✅
- **Page** : `src/pages/Catalog.tsx`
- **Structure exacte A-COLD-WALL*** :
  - Section banner avec titre dynamique (nom catégorie ou "Shop All")
  - Hero section avec image de catégorie (si catégorie sélectionnée)
  - Grille de produits responsive
  - Pagination (structure de base)
- **Fonctionnalités** :
  - Récupération catégorie depuis URL (`?category=slug`)
  - Filtrage produits par catégorie
  - HeroSectionImage intégré avec props configurables
  - Gestion états loading/error
  - Responsive design
- **Composants** :
  - ProductGrid : Grille responsive (2 cols mobile, auto-fit desktop)
  - ProductCard : Carte produit avec hover effect
- **À faire** : Filtres avancés, tri, pagination complète

### Product (Fiche Produit) ✅
- **Page** : `src/pages/Product.tsx`
- **Structure exacte A-COLD-WALL*** :
  - Layout 2 colonnes (40% galerie, 60% infos)
  - Galerie d'images (carrousel Swiper mobile, grille desktop)
  - Section infos produit (sticky top: 78px)
  - Sélecteur variantes (tailles)
  - Bouton "Add to cart" avec vérification stock
  - Onglets (Details, Sizing, Shipping, Returns)
- **Fonctionnalités** :
  - Récupération produit par ID depuis URL (`useParams`)
  - Hook `useProduct(id)` pour charger le produit
  - Sélection variante → activation bouton "Add to cart"
  - Ajout au panier avec `useCart().addToCart()`
  - Gestion états loading/error/404
  - Responsive design (stack vertical mobile)
- **Composants** :
  - ProductGallery : Carrousel Swiper avec images
  - ProductInfo : Titre, prix, description
  - VariantSelector : Select dropdown tailles
  - AddToCartButton : Bouton ajout panier avec états
  - ProductTabs : Onglets informations
- **À faire** : Ajouter images produits (backend), contenu tabs, produits similaires

### Cart (Panier)
- Liste des articles ajoutés
- Quantités modifiables
- Prix total
- Bouton "Passer commande"
- Bouton "Continuer les achats"

### Checkout (Paiement)
- Formulaire de livraison
- Récapitulatif commande
- Intégration paiement (à définir)
- Confirmation commande

### About (À propos - Vitrine)
- Présentation du concept-store
- Histoire de la marque
- Ancrage local
- Contact

## 🧩 Composants principaux

### Layout
- **Header** : Navigation, logo, panier
- **Footer** : Pied de page style A-COLD-WALL* (logo, navigation, social, slogan, mentions légales) ✅
- **Layout** : Wrapper principal

### Product
- **ProductCard** : Carte produit (liste) ✅
  - **Fichier** : `src/components/product/ProductCard.tsx`
  - **Fonctionnalités** :
    - Structure exacte A-COLD-WALL* (lien, article, figure aspect-[3/4])
    - Effet hover : 2 images superposées (transition opacity)
    - Nom produit en uppercase
    - Prix barré + prix réduit (30% de réduction)
    - Format prix : €XX,XX
    - Gestion erreurs images avec placeholder
    - Lien vers `/product/:id`
    - Style minimaliste premium
  - **Props** : `product: Product`
  - **Dépendances** : React Router (Link), getImageUrl utilitaire
- **ProductGallery** : Galerie d'images ✅
  - **Fichier** : `src/components/product/ProductGallery.tsx`
  - **Fonctionnalités** :
    - Carrousel Swiper horizontal avec images triées par order
    - Navigation prev/next (visible mobile, masquée desktop)
    - Grille d'images sur desktop (grid-cols-1 avec gap-[2px])
    - Aspect ratio 4:3 (padding-bottom: 133.33%)
    - Placeholder si pas d'images
    - Style minimaliste premium
  - **Props** : `images: Image[]`, `productName: string`
  - **Dépendances** : Swiper, getImageUrl utilitaire
- **ProductInfo** : Informations produit ✅
  - **Fichier** : `src/components/product/ProductInfo.tsx`
  - **Fonctionnalités** :
    - Titre produit (h1, uppercase)
    - Prix barré + prix réduit (30%)
    - Description produit
    - Format prix : €XX,XX (fonction formatPrice)
    - Style minimaliste premium
  - **Props** : `product: Product`
- **VariantSelector** : Sélecteur variantes ✅
  - **Fichier** : `src/components/product/VariantSelector.tsx`
  - **Fonctionnalités** :
    - Select dropdown avec tailles disponibles
    - Arrow custom (triangle noir avec rotate-[135deg])
    - Border noir arrondie (rounded-md)
    - Callback onVariantChange pour sélection
    - Style minimaliste premium
  - **Props** : `variants: Variant[]`, `selectedVariant: Variant | null`, `onVariantChange: (variant: Variant) => void`
- **AddToCartButton** : Bouton ajout panier ✅
  - **Fichier** : `src/components/product/AddToCartButton.tsx`
  - **Fonctionnalités** :
    - Bouton "Add to cart" désactivé si pas de variante sélectionnée
    - Vérification stock avant ajout
    - États loading/success/error
    - Message feedback (3 secondes)
    - Appel `useCart().addToCart()`
    - Style minimaliste premium (bouton noir, texte blanc)
  - **Props** : `variant: Variant | null`, `quantity?: number`
  - **Dépendances** : useCart hook
- **ProductTabs** : Onglets informations produit ✅
  - **Fichier** : `src/components/product/ProductTabs.tsx`
  - **Fonctionnalités** :
    - Système d'onglets (Details, Sizing, Shipping, Returns)
    - Tab actif avec bullet point noir (hidden sm:block)
    - Underline sur mobile, no-underline desktop
    - Liste verticale (desktop), horizontale (mobile)
    - Contenu dynamique à droite
    - Style minimaliste premium
  - **Props** : `tabs: Tab[]` (Tab: `{ id: string, label: string, content: string | ReactNode }`)
  - **Dépendances** : useState hook

### Cart
- **CartItem** : Article du panier
- **CartSummary** : Récapitulatif panier
- **CartIcon** : Icône panier avec badge quantité

### UI
- **Button** : Bouton générique
- **Input** : Champ de saisie
- **Select** : Sélecteur
- **Modal** : Modal générique
- **Loading** : Indicateur de chargement

## 🔌 Services API

### Client API ✅
- **Fichier** : `src/services/api.ts`
- **Client HTTP** : Axios
- **Base URL** : Configurable via `VITE_API_BASE_URL` (.env)
- **Timeout** : 10 secondes
- **Intercepteurs** :
  - Request : Ajout automatique du `X-Session-Id` depuis localStorage
  - Request : Démarrage du loading state global
  - Response : Arrêt du loading state global
  - Response : Gestion erreurs centralisée (401, 403, 404, 500)
- **Méthodes** : `api.get()`, `api.post()`, `api.put()`, `api.patch()`, `api.delete()`
- **Types** : `ApiResponse<T>`, `ApiError`, `PaginatedResponse<T>` (dans `types/api.ts`)
- **Loading Manager** : `src/utils/loading.ts` (suivi automatique des requêtes en cours)

### Services métier (À faire)
- **productsService** : Appels API produits
- **categoriesService** : Appels API catégories
- **cartService** : Appels API panier
- **ordersService** : Appels API commandes

## 🎯 Routing

Routes principales :
- `/` : **Menu de sélection shop** (choix entre Reboul Adult, Kids, Sneakers, C.P.COMPANY)
- `/shop/:shopSlug` : Home du shop sélectionné
- `/shop/:shopSlug/catalog` : Catalogue du shop
- `/shop/:shopSlug/catalog/:category` : Catalogue par catégorie
- `/shop/:shopSlug/product/:id` : Fiche produit
- `/cart` : Panier universel (articles groupés par shop)
- `/checkout` : Checkout unique (tous shops)
- `/about` : À propos

**Note** : Le panier est universel (articles de plusieurs shops), mais l'affichage groupe par shop.

## 📊 État actuel

### Version : 0.24.3 - Phase 17.11.4 terminée ✅

**Statut** : ✅ Frontend complet et production-ready - Pages principales complétées, design system A-COLD-WALL* appliqué, responsive optimisé, infrastructure Docker production configurée
**Dernière mise à jour** : 15/02/2026 à 21:04

#### ✅ Complété (Phase 1)
- Structure de base définie
- Configuration Docker (Dockerfile, docker-compose.yml)
- Projet Vite + React + TypeScript initialisé
- Configuration TailwindCSS v4 (index.css, postcss.config.js)
- Configuration React Router (App.tsx de base)
- Configuration variables d'environnement (.env)
- Structure de dossiers créée (pages, components, services, hooks, types, utils)
- Configuration Vite pour Docker (host 0.0.0.0, port 3000)
- Services Docker opérationnels (frontend accessible sur http://localhost:3000)

#### ✅ Complété (Phase 4.1 - Infrastructure API)
- Service api.ts créé avec Axios
- Base URL configurée depuis .env (VITE_API_BASE_URL)
- Intercepteurs request/response configurés
- Gestion erreurs centralisée (handleApiError)
- Gestion loading states globale (loadingManager)
- Types TypeScript pour réponses API (types/api.ts)
- Composant de test TestApi.tsx fonctionnel
- Connexion backend validée (GET /categories, GET /)

#### ✅ Complété (Phase 4.2 - Services API métier)
- Service categories.ts créé (getCategories, getCategory, getCategoryBySlug)
- Service products.ts créé (getProducts, getProduct, getProductsByCategory)
- Service cart.ts créé (getCart, addToCart, updateCartItem, removeCartItem, clearCart)
- Service orders.ts créé (createOrder, getOrder)
- Types TypeScript complets (Category, Product, Variant, Image, Cart, CartItem, Order, CustomerInfo)
- Composant TestServices.tsx créé pour tester tous les services
- Tests validés avec données réelles du backend
- Flux complet testé : Panier → Ajout article → Création commande

#### ✅ Complété (Phase 4.3 - Custom Hooks)
- Hook useProducts créé (fetch, loading, error, refetch, pagination)
- Hook useProduct créé (fetch by id, loading, error)
- Hook useCategories créé (fetch, loading, error, refetch)
- Hook useCart créé (state, actions, sessionId via localStorage)
- Hook useLocalStorage créé (persistence générique)
- Composant TestHooks.tsx créé pour tester tous les hooks
- Route /test-hooks ajoutée dans App.tsx

#### ✅ Complété (Phase 4 - Infrastructure)
- Configuration API Client
- Services API métier (products, categories, cart, orders)
- Custom Hooks (useProducts, useProduct, useCategories, useCart, useLocalStorage)
- Types TypeScript complets
- Composants Layout de base (placeholders créés)

#### ✅ Complété (Phase 5 - Design System)
- ✅ Design System défini (inspiré A-COLD-WALL*)
- ✅ Couleurs définies : Primary #1A1A1A, Secondary #F3F3F3, Accent #D93434
- ✅ Typographie définie (Geist) : H1, H2, H3, Body, Body 2
- ✅ Style Product Cards défini : fond gris #F8F8F8, typo majuscules, prix barré
- ✅ Workflow adopté : Inspiration A-COLD-WALL* → Création directe React/TailwindCSS
- ✅ Pas de phase maquettes séparée

#### ✅ Complété (Phase 6 - Layout & Navigation)
- ✅ Composant Layout.tsx créé avec structure complète (PromoBanner, Header, Footer, main)
- ✅ Composant Header.tsx complété avec :
  - ✅ Logo REBOULSTORE 2.0* (lien vers /)
  - ✅ Navigation principale (Catalogue avec mega menu, SALE, THE CORNER, C.P. COMPANY)
  - ✅ Mega menu catégories (dropdown style A-COLD-WALL* avec colonne gauche catégories + images promotionnelles droite)
  - ✅ Champ de recherche interactif (toggle au clic sur "RECHERCHER", input avec underline, autoFocus, fermeture Escape/Blur)
  - ✅ Lien "MON COMPTE"
  - ✅ Badge panier avec compteur (connexion useCart hook)
  - ✅ Menu mobile hamburger (structure de base)
- ✅ Connexion hooks : useCart (badge panier), useCategories (mega menu)
- ✅ PromoBanner intégré dans Layout
- ✅ Footer.tsx complété avec style A-COLD-WALL* :
  - ✅ Structure exacte copiée depuis A-COLD-WALL* (logo, navigation, social, slogan, mentions légales)
  - ✅ Style minimaliste : fond blanc, texte noir, uppercase, typographie 11px
  - ✅ Logo SVG placeholder (A-COLD-WALL* style) avec possibilité de passer un logo custom via props
  - ✅ Navigation Customer Service (Delivery & Returns, Terms, Privacy, Refund, Contact)
  - ✅ Navigation Social Media (Instagram, Spotify, Apple Music)
  - ✅ Slogan aligné à droite sur desktop
  - ✅ Section légale avec copyright, mentions légales, SIRET, VAT
  - ✅ Props configurables (logo, customerServiceLinks, socialLinks, slogan, legalInfo)
  - ✅ Valeurs par défaut pour toutes les props
  - ✅ Responsive design (grille 2 colonnes mobile → flex horizontal desktop)
  - ✅ Hover effects sur les liens
- ✅ Responsive design (mobile/desktop)

#### ✅ Complété (Phase 7 - Pages Catalogue)
- ✅ Page Catalog.tsx complétée avec structure exacte A-COLD-WALL* :
  - ✅ Section banner avec titre dynamique (nom catégorie ou "Shop All")
  - ✅ Hero section avec image de catégorie (HeroSectionImage intégré)
  - ✅ Section product-grid avec grille responsive
  - ✅ Section pagination (structure de base)
- ✅ Composant ProductCard.tsx créé :
  - ✅ Structure exacte A-COLD-WALL* (lien, article, figure aspect-[3/4])
  - ✅ Effet hover : 2 images superposées (transition opacity)
  - ✅ Nom produit en uppercase
  - ✅ Prix barré + prix réduit (30% de réduction)
  - ✅ Format prix : €XX,XX
  - ✅ Gestion erreurs images avec placeholder
- ✅ Composant ProductGrid.tsx créé :
  - ✅ Grille CSS responsive (2 cols mobile, auto-fit desktop)
  - ✅ Gap de 2px entre produits
  - ✅ Gestion état vide
- ✅ Fonctionnalités Catalog :
  - ✅ Récupération catégorie depuis URL (?category=slug)
  - ✅ Chargement catégorie avec getCategoryBySlug
  - ✅ Filtrage produits par catégorie
  - ✅ Intégration HeroSectionImage avec props configurables
  - ✅ Gestion états loading/error
- ✅ HeroSectionImage amélioré :
  - ✅ Props configurables (aspectRatioMobile, aspectRatioDesktop, maxHeightClass, heightClass)
  - ✅ Support hauteur fixe au lieu d'aspect ratio
  - ✅ Support objectFit (cover/contain)
  - ✅ Utilisation classes Tailwind pour hauteur max

#### 🏠 En cours (Phase 12 - Homepage)
- 📋 Page Home.tsx à créer
- 📋 Composants Homepage :
  - [x] **HeroSectionImage** ✅ (section hero avec image de fond)
  - [x] **HeroSectionVideo** ✅ (section hero avec vidéo de fond)
  - [x] **CategorySection** ✅ (section "Shop by category" avec carousel)
  - [x] **FeaturedProducts** ✅ (produits mis en avant)
    - **Fichier** : `src/components/home/FeaturedProducts.tsx`
    - **Fonctionnalités** :
      - Carousel Swiper horizontal avec navigation prev/next
      - ProductImage intégré avec gestion erreurs (placeholder si pas d'image)
      - Hover effect avec transition entre 2 images
      - Calcul et affichage prix réduit (30% de réduction)
      - Titre section personnalisable via prop `title`
      - Boutons navigation avec états disabled/enabled et transitions opacity
      - Style inspiré A-COLD-WALL* (minimaliste, premium, espacement généreux)
      - Responsive (2.2 slides mobile → 5 slides desktop)
      - Correction bug bouton Previous (événement init Swiper)
      - **Mode avec liste de produits** : Prop `products` pour afficher une liste personnalisée
      - **Mode avec catégorie** : Prop `categorySlug` pour récupérer automatiquement les produits d'une catégorie
      - Récupération automatique de l'ID de catégorie depuis le slug
      - Gestion loading/error pour les deux modes
    - **Props** : 
      - `title: string` (obligatoire)
      - `products?: Product[]` (optionnel si categorySlug fourni)
      - `categorySlug?: string` (optionnel, slug de la catégorie)
      - `limit?: number` (optionnel, par défaut 10, utilisé avec categorySlug)
    - **Dépendances** : Swiper, React, types Product, useProducts hook, getCategoryBySlug service
  - [x] **CategorySection** ✅ (section "Shop by category")
    - **Fichier** : `src/components/home/CategorySection.tsx`
    - **Fonctionnalités** :
      - Carousel Swiper horizontal avec navigation prev/next
      - Connexion API via hook `useCategories()`
      - Affichage des catégories du backend avec images
      - Grandes cartes d'images (aspect 4/5) avec overlay texte
      - Nom de catégorie positionné au milieu à gauche
      - Bouton "Shop now" positionné en bas à gauche
      - Utilisation `getImageUrl()` pour construire les URLs d'images
      - Placeholder si pas d'image
      - Gestion loading/error (ne s'affiche pas si erreur ou chargement)
      - Style inspiré A-COLD-WALL* (minimaliste, premium)
      - Responsive (1.2 slides mobile → 3 slides desktop)
      - Boutons navigation avec états disabled/enabled
    - **Props** : Aucune (récupère les catégories via `useCategories()`)
    - **Dépendances** : Swiper, React, useCategories hook, getImageUrl utilitaire
    - **Backend** : Champ `imageUrl` ajouté à l'entité Category
    - **Images** : Images stockées dans `backend/uploads/categories/`
  - [x] **HeroSectionImage** ✅ (section hero avec image)
    - **Fichier** : `src/components/home/HeroSectionImage.tsx`
    - **Fonctionnalités** :
      - Image de fond avec aspect ratio responsive (4/5 mobile, 2/1 desktop)
      - Overlay noir semi-transparent (20% opacité)
      - Texte centré verticalement et horizontalement
      - Titre et sous-titre personnalisables
      - Bouton CTA avec lien personnalisable
      - Style inspiré A-COLD-WALL* (minimaliste, premium)
      - Responsive design
      - Lien cliquable sur toute l'image
    - **Props** : `title: string`, `subtitle: string`, `buttonText: string`, `buttonLink: string`, `imageSrc?: string`
  - [x] **HeroSectionVideo** ✅ (section hero avec vidéo)
    - **Fichier** : `src/components/home/HeroSectionVideo.tsx`
    - **Fonctionnalités** :
      - Vidéo de fond avec aspect ratio responsive (4/5 mobile, 2/1 desktop)
      - Vidéo en autoplay, loop, muted, playsInline (meilleure UX)
      - Overlay noir semi-transparent (20% opacité)
      - Texte centré verticalement et horizontalement
      - Titre et sous-titre personnalisables
      - Bouton CTA avec lien personnalisable
      - Style inspiré A-COLD-WALL* (minimaliste, premium)
      - Responsive design
      - Lien cliquable sur toute la vidéo
      - Support de différents formats vidéo (MP4, WebM, etc.)
    - **Props** : `title: string`, `subtitle: string`, `buttonText: string`, `buttonLink: string`, `videoSrc: string`, `videoType?: string`
    - **Note** : Dupliqué depuis HeroSectionImage et adapté pour la vidéo
  - [x] **PromoCard** ✅ (carte promotionnelle réutilisable)
    - **Fichier** : `src/components/home/PromoCard.tsx`
    - **Fonctionnalités** :
      - Composant hautement réutilisable pour promouvoir différents contenus (hôtels, boutiques, collaborations, podcasts, etc.)
      - Layout deux colonnes responsive (image gauche 30%, contenu droite 70%)
      - Image principale avec overlay optionnel (topText, title, number) - même style que CategorySection
      - Contenu texte avec titre et description (tableau de strings pour paragraphes multiples)
      - Grille optionnelle de 2 images en bas du contenu
      - Overlay avec description sur chaque image de la grille (même style que l'overlay principal)
      - Liens optionnels sur l'image principale et les images de la grille (interne ou externe)
      - Gestion hauteurs égales des colonnes avec `md:items-stretch`
      - Gestion overflow du contenu texte avec scroll (`overflow-y-auto`)
      - Alignement du texte en bas de la colonne droite (`md:justify-end`)
      - Style inspiré A-COLD-WALL* (minimaliste, premium)
      - Responsive design (stack vertical mobile, flex horizontal desktop)
    - **Props** :
      - Image : `imageUrl: string`, `imageAlt?: string`, `imageLink?: string`, `imageLinkExternal?: boolean`
      - Overlay : `overlayTopText?: string`, `overlayTitle?: string`, `overlayNumber?: string`
      - Contenu : `title: string`, `description: string[]`
      - Grille images : `gridImage1?: string`, `gridImage1Alt?: string`, `gridImage1Link?: string`, `gridImage1Description?: string`, `gridImage2?: string`, `gridImage2Alt?: string`, `gridImage2Link?: string`, `gridImage2Description?: string`
    - **Dépendances** : React Router (Link), TailwindCSS
  - [x] **Footer** ✅ (pied de page style A-COLD-WALL*)
    - **Fichier** : `src/components/layout/Footer.tsx`
    - **Fonctionnalités** :
      - Structure exacte copiée depuis A-COLD-WALL* (HTML original)
      - Style minimaliste : fond blanc, texte noir, uppercase, typographie 11px
      - Logo SVG placeholder (style A-COLD-WALL*) avec possibilité de passer un logo custom via props
      - Navigation Customer Service (5 liens par défaut : Delivery & Returns, Terms, Privacy, Refund, Contact)
      - Navigation Social Media (3 liens par défaut : Instagram, Spotify, Apple Music)
      - Slogan aligné à droite sur desktop (col-span-full mobile, ml-auto desktop)
      - Section légale complète (copyright, mentions légales, SIRET, VAT)
      - Props configurables avec valeurs par défaut pour toutes les sections
      - Interfaces TypeScript complètes (FooterNavLink, FooterSocialLink, FooterLegalInfo, FooterProps)
      - Responsive design (grille 2 colonnes mobile → flex horizontal desktop)
      - Hover effects sur les liens (transition vers gris)
      - Padding exact A-COLD-WALL* (p-[2px])
      - Gap et espacements identiques à A-COLD-WALL*
    - **Props** :
      - `logo?: ReactNode` (optionnel, logo custom ou placeholder par défaut)
      - `customerServiceLinks?: FooterNavLink[]` (optionnel, liens Customer Service)
      - `socialLinks?: FooterSocialLink[]` (optionnel, liens sociaux)
      - `slogan?: string` (optionnel, slogan de la marque)
      - `legalInfo?: FooterLegalInfo` (optionnel, informations légales)
      - `className?: string` (optionnel, classe CSS additionnelle)
    - **Interfaces** :
      - `FooterNavLink` : `{ label: string, to: string }`
      - `FooterSocialLink` : `{ label: string, href: string, target?: '_blank' | '_self' }`
      - `FooterLegalInfo` : `{ companyName: string, registeredCompany?: string, siret?: string, vat?: string }`
    - **Dépendances** : React Router (Link), TailwindCSS
  - [ ] LocalAnchor (ancrage local Marseille/Cassis/Sanary)
  - [ ] BlogCarousel (carrousel articles/actualités)

#### 🎨 Inspiration Design : A-COLD-WALL*
Le design de Reboul Store s'inspire **fortement** du site [A-COLD-WALL*](https://www.a-cold-wall.com/) :
- Style minimaliste et premium
- Product Cards avec fond gris clair, typographie majuscules
- Palette monochrome (noir, blanc, gris) avec accent rouge
- Layout épuré, espacement généreux
- Aesthetic premium streetwear, industriel, moderne

#### 📋 À faire (Phase 6+ - Intégration)
- Intégration maquettes Framer dans Layout (Header, Footer)
- Intégration maquettes dans pages (Catalog, Product, Cart, Checkout, Home, About)
- Connecter hooks et fonctionnalités
- Finaliser responsive et animations

## 🗺️ Roadmap Frontend

### Phase 0 : Setup shadcn/ui (Optionnel)
#### 0.1 Installation shadcn/ui
- [ ] Installer shadcn/ui si besoin (npx shadcn-ui@latest init)
- [ ] Configurer dans `/ui/shadcn`
- [ ] Configurer thème basique (noir/blanc)
- [ ] Note : Création custom prioritaire (style A-COLD-WALL*)

### Phase 1 : Setup & Configuration initiale ✅
#### 1.1 Configuration Docker
- [x] Créer Dockerfile pour frontend React
- [x] Configurer docker-compose.yml avec service frontend
- [x] Configurer port (3000)
- [x] Configurer volumes pour hot reload
- [x] Configurer variables d'environnement (.env)
- [x] Tester démarrage container frontend

#### 1.2 Initialisation projet Vite + React + TypeScript
- [x] Initialiser projet Vite (npm create vite@latest frontend -- --template react-ts)
- [x] Vérifier structure de base (src/, public/, index.html)
- [x] Configurer package.json avec dépendances :
  - [x] react, react-dom
  - [x] react-router-dom
  - [x] axios
  - [x] types pour TypeScript
- [x] Configurer tsconfig.json
- [x] Configurer vite.config.ts (avec host 0.0.0.0 pour Docker)
- [x] Configurer .gitignore
- [x] Tester build et dev server

#### 1.3 Configuration TailwindCSS
- [x] Installer TailwindCSS (npm install -D tailwindcss postcss autoprefixer)
- [x] Configurer TailwindCSS v4 (approche différente de v3)
- [x] Configurer postcss.config.js
- [x] Créer fichier src/index.css avec @import tailwindcss
- [x] Définir thème personnalisé (couleurs premium/streetwear dans variables CSS)
- [x] Configurer typographie Geist
- [x] Configurer breakpoints mobile-first (sm, md, lg, xl)
- [x] Configurer espacements et grilles (4px, 8px, 16px, 24px, 32px, etc.)
- [x] Importer index.css dans main.tsx
- [x] Tester classes TailwindCSS

#### 1.4 Structure des dossiers
- [x] Créer src/pages/
- [x] Créer src/components/ (layout/, product/, cart/, ui/)
- [x] Créer src/services/
- [x] Créer src/hooks/
- [x] Créer src/types/
- [x] Créer src/utils/
- [x] Créer src/styles/
- [x] Organiser structure claire

#### 1.5 Configuration routing
- [x] Installer react-router-dom (npm install react-router-dom)
- [x] Configurer BrowserRouter dans App.tsx
- [x] Créer route de base (/) avec composant de test
- [ ] Créer routes complètes (/, /catalog, /product/:id, /cart, /checkout, /about) - à faire en Phase 2
- [ ] Créer composant NotFound pour route 404 - à faire en Phase 2
- [x] Tester navigation de base

### Phase 2 : Infrastructure API & Services ✅
#### 2.1 Configuration client API ✅
- [x] Créer fichier src/services/api.ts
- [x] Configurer axios ou fetch avec baseURL depuis .env
- [x] Configurer timeout
- [x] Configurer intercepteur request (ajout headers, auth si nécessaire)
- [x] Configurer intercepteur response (gestion erreurs globales)
- [x] Créer types pour réponses API (ApiResponse<T>)
- [x] Créer fonction handleApiError() centralisée

#### 2.2 Service Products ✅
- [x] Créer fichier src/services/products.ts
- [x] Implémenter getProducts(query?: ProductQuery) : Promise<PaginatedProductsResponse>
- [x] Implémenter getProduct(id: string) : Promise<Product>
- [x] Implémenter getProductsByCategory(categoryId: string, query?: ProductQuery) : Promise<PaginatedProductsResponse>
- [x] Gérer paramètres query (filters, pagination, sort)
- [x] Gérer erreurs et loading states
- [x] Tester chaque fonction

#### 2.3 Service Categories ✅
- [x] Créer fichier src/services/categories.ts
- [x] Implémenter getCategories() : Promise<Category[]>
- [x] Implémenter getCategory(id: string) : Promise<Category>
- [x] Implémenter getCategoryBySlug(slug: string) : Promise<Category>
- [x] Gérer erreurs et loading states
- [x] Tester chaque fonction

#### 2.4 Service Cart ✅
- [x] Créer fichier src/services/cart.ts
- [x] Implémenter getCart(sessionId: string) : Promise<Cart>
- [x] Implémenter addToCart(sessionId: string, variantId: string, quantity: number) : Promise<CartItem>
- [x] Implémenter updateCartItem(itemId: string, quantity: number, sessionId: string) : Promise<CartItem>
- [x] Implémenter removeCartItem(itemId: string, sessionId: string) : Promise<void>
- [x] Implémenter clearCart(sessionId: string) : Promise<void>
- [x] Gérer gestion sessionId (localStorage et header X-Session-Id)
- [x] Gérer erreurs et loading states
- [x] Tester chaque fonction

#### 2.5 Service Orders ✅
- [x] Créer fichier src/services/orders.ts
- [x] Implémenter createOrder(dto: CreateOrderDto) : Promise<Order>
- [x] Implémenter getOrder(id: string) : Promise<Order>
- [x] Gérer erreurs et loading states
- [x] Tester chaque fonction
- [x] Tester flux complet (Panier → Commande)

### Phase 3 : Types TypeScript & Custom Hooks
#### 3.1 Types de base ✅
- [x] Créer fichier src/types/index.ts
- [x] Définir type Product (id, name, description, price, categoryId, images, variants, category)
- [x] Définir type Category (id, name, slug, description)
- [x] Définir type Variant (id, productId, color, size, stock, sku)
- [x] Définir type Image (id, productId, url, alt, order)
- [x] Définir type Cart (id, sessionId, items, total)
- [x] Définir type CartItem (id, cartId, variantId, quantity, variant)
- [x] Définir type Order (id, cartId, status, total, customerInfo)
- [x] Définir types pour DTOs (ProductQuery, PaginatedProductsResponse, CreateOrderDto, etc.)

#### 3.2 Custom Hook useProducts ✅
- [x] Créer fichier src/hooks/useProducts.ts
- [x] Implémenter hook avec useState, useEffect, useCallback
- [x] Gérer état loading
- [x] Gérer état error
- [x] Implémenter fetchProducts(query?)
- [x] Implémenter refetch
- [x] Retourner { products, total, page, limit, totalPages, loading, error, refetch }

#### 3.3 Custom Hook useProduct ✅
- [x] Créer fichier src/hooks/useProduct.ts
- [x] Implémenter hook avec useState, useEffect
- [x] Prendre id en paramètre (string | undefined)
- [x] Gérer état loading
- [x] Gérer état error
- [x] Implémenter fetchProduct(id)
- [x] Retourner { product, loading, error }

#### 3.4 Custom Hook useCategories ✅
- [x] Créer fichier src/hooks/useCategories.ts
- [x] Implémenter hook avec useState, useEffect, useCallback
- [x] Gérer état loading
- [x] Gérer état error
- [x] Implémenter fetchCategories()
- [x] Implémenter refetch
- [x] Retourner { categories, loading, error, refetch }

#### 3.5 Custom Hook useCart ✅
- [x] Créer fichier src/hooks/useCart.ts
- [x] Implémenter hook avec useState, useEffect, useCallback
- [x] Gérer sessionId via useLocalStorage
- [x] Gérer état cart, loading, error
- [x] Implémenter addToCart(variantId, quantity)
- [x] Implémenter updateItem(itemId, quantity)
- [x] Implémenter removeItem(itemId)
- [x] Implémenter clearCart()
- [x] Implémenter refetch
- [x] Calculer total depuis cart.total
- [x] Retourner { cart, loading, error, addToCart, updateItem, removeItem, clearCart, refetch, total }

#### 3.6 Custom Hook useLocalStorage ✅
- [x] Créer fichier src/hooks/useLocalStorage.ts
- [x] Implémenter hook générique pour localStorage
- [x] Gérer sérialisation/désérialisation JSON
- [x] Gérer erreurs localStorage (try/catch)
- [x] Gérer SSR (vérification typeof window)
- [x] Synchroniser avec autres onglets (storage event)
- [x] Support fonction setValue (comme useState)
- [x] Retourner [value, setValue]
- [x] Composant TestHooks.tsx créé pour tester tous les hooks

### Phase 5 : Design System ✅
**Approche** : Inspiration A-COLD-WALL* → Création directe React/TailwindCSS

#### 5.1 Design System défini ✅
- [x] **Inspiration principale** : [A-COLD-WALL*](https://www.a-cold-wall.com/)
- [x] Définir palette de couleurs :
  - Primary #1A1A1A, Secondary #F3F3F3, Accent #D93434
  - Gris pour textes secondaires, désactivés, bordures
- [x] Définir typographie (Geist) :
  - H1 (48px/1.2), H2 (38px/1.3), H3 (28px/1.3)
  - Body (16px/1.5), Body 2 (14px/1.5)
- [x] Définir style composants :
  - Product Cards : fond gris #F8F8F8, typo majuscules, prix barré
  - Boutons : Primary, Secondary, Outline, Ghost
  - Layout : minimaliste, espacement généreux

#### 5.2 Workflow adopté ✅
- [x] Pas de phase maquettes séparée
- [x] Création directe des composants en React/TailwindCSS
- [x] Inspiration visuelle : A-COLD-WALL*
- [x] Style cohérent appliqué dans le code
- [x] Mobile-first avec TailwindCSS breakpoints

### Phase 6 : Composants Layout & Navigation (Intégration des maquettes) ✅
#### 6.1 Composant Layout ✅
- [x] Créer composant src/components/layout/Layout.tsx
- [x] Intégrer PromoBanner, Header et Footer
- [x] Créer structure avec <main> pour contenu
- [x] Styling avec TailwindCSS
- [x] Responsive design

#### 6.2 Création Header/Navbar - Style A-COLD-WALL* ✅
- [x] Créer le composant Header.tsx en React/TailwindCSS (inspiré A-COLD-WALL*)
- [x] Convertir les styles en classes TailwindCSS
- [x] Logo REBOULSTORE 2.0* avec lien vers /
- [x] Navigation principale (Catalogue, SALE, THE CORNER, C.P. COMPANY)
- [x] Mega menu catégories (dropdown style A-COLD-WALL*)
  - [x] Colonne gauche : Liste catégories (useCategories hook)
  - [x] Colonne droite : Images promotionnelles
  - [x] Overlay avec blur
  - [x] Fermeture au clic ou mouseLeave
- [x] Champ de recherche interactif
  - [x] Toggle au clic sur "RECHERCHER"
  - [x] Input avec underline (style minimaliste)
  - [x] AutoFocus à l'ouverture
  - [x] Fermeture Escape/Blur
- [x] Connecter hook useCart pour badge panier
- [x] Lien "MON COMPTE"
- [x] Menu mobile hamburger (structure de base)
- [x] Connecter les liens avec React Router
- [x] Tester responsive

#### 6.3 Création Footer - Style A-COLD-WALL* ✅
- [x] Créer composant Footer.tsx (structure de base avec placeholders)
- [x] Sections : À propos, Liens utiles, Contact
- [x] Styling de base avec TailwindCSS
- [x] Finaliser design Footer (style minimaliste A-COLD-WALL*)
  - [x] Structure exacte copiée depuis A-COLD-WALL* (HTML original)
  - [x] Logo SVG placeholder (style A-COLD-WALL*)
  - [x] Navigation Customer Service (5 liens)
  - [x] Navigation Social Media (3 liens)
  - [x] Slogan aligné à droite sur desktop
  - [x] Section légale complète (copyright, mentions, SIRET, VAT)
  - [x] Props configurables avec valeurs par défaut
  - [x] Interfaces TypeScript (FooterNavLink, FooterSocialLink, FooterLegalInfo, FooterProps)
- [x] Connecter les liens et réseaux sociaux
- [x] Tester responsive

#### 6.4 Routing complet ✅
- [x] Configurer toutes les routes React Router
  - [x] Route `/` → Home
  - [x] Route `/catalog` → Catalog
  - [x] Route `/product/:id` → Product (route dynamique avec useParams)
  - [x] Route `/cart` → Cart
  - [x] Route `/checkout` → Checkout
  - [x] Route `/about` → About
- [x] Routes de test conservées (`/test-api`, `/test-services`, `/test-hooks`)
- [x] Navigation programmatique disponible (useNavigate de React Router)
- [x] Toutes les routes testées
- [x] Layout intégré sur toutes les pages principales
- [ ] Créer composant ProtectedRoute si nécessaire (à faire plus tard si besoin d'authentification)

### Phase 7 : Pages Catalogue & Produits (Style A-COLD-WALL*) ✅
#### 7.1 Page Catalog - Structure ✅
- [x] Créer page src/pages/Catalog.tsx
- [x] Intégrer Layout
- [x] Structure exacte copiée depuis A-COLD-WALL* (banner, hero, grid, pagination)
- [x] Styling avec TailwindCSS (padding minimal p-[2px], m-[2px])
- [x] Responsive design

#### 7.2 Composant ProductCard ✅
- [x] Créer composant src/components/product/ProductCard.tsx
- [x] Structure exacte A-COLD-WALL* (lien, article, figure avec aspect-[3/4])
- [x] Effet hover : 2 images superposées (première disparaît, deuxième apparaît)
- [x] Nom produit en uppercase
- [x] Prix barré + prix réduit (30% de réduction)
- [x] Format prix : €XX,XX
- [x] Gestion erreurs images avec placeholder
- [x] Lien vers page Product
- [x] Styling premium avec TailwindCSS
- [x] Responsive

#### 7.3 Composant ProductGrid ✅
- [x] Créer composant src/components/catalog/ProductGrid.tsx
- [x] Grille CSS responsive (2 cols mobile, auto-fit desktop)
- [x] Gap de 2px entre produits
- [x] Gestion état vide (aucun produit)
- [x] Styling avec TailwindCSS

#### 7.4 Page Catalog - Fonctionnalités ✅
- [x] Intégrer hook useProducts
- [x] Récupérer catégorie depuis URL (?category=slug)
- [x] Charger catégorie avec getCategoryBySlug
- [x] Filtrer produits par catégorie si présente
- [x] Intégrer HeroSectionImage avec image de catégorie
- [x] Titre dynamique (nom catégorie ou "Shop All")
- [x] Gérer états loading (Loading message)
- [x] Gérer états error (ErrorMessage)
- [x] Gérer état vide (message "Aucun produit")
- [x] Structure pagination (base créée, à compléter)
- [x] Styling complet avec TailwindCSS

#### 7.5 HeroSectionImage - Améliorations ✅
- [x] Ajout props configurables (aspectRatioMobile, aspectRatioDesktop, maxHeightClass, heightClass)
- [x] Support hauteur fixe au lieu d'aspect ratio (heightClass)
- [x] Support objectFit (cover/contain)
- [x] Utilisation classes Tailwind pour hauteur max
- [x] Intégration dans Catalog avec image de catégorie

#### 7.6 Composants UI (À faire plus tard)
#### 5.1 Composant Button
- [ ] Créer composant src/components/ui/Button.tsx
- [ ] Implémenter variants (primary, secondary, outline)
- [ ] Implémenter sizes (sm, md, lg)
- [ ] Implémenter states (disabled, loading)
- [ ] Gérer onClick
- [ ] Styling avec TailwindCSS
- [ ] Exporter types pour props

#### 5.2 Composant Input
- [ ] Créer composant src/components/ui/Input.tsx
- [ ] Implémenter types (text, email, tel, number)
- [ ] Gérer label, placeholder, error
- [ ] Implémenter validation visuelle
- [ ] Styling avec TailwindCSS
- [ ] Exporter types pour props

#### 5.3 Composant Select
- [ ] Créer composant src/components/ui/Select.tsx
- [ ] Implémenter dropdown
- [ ] Gérer options (array d'objets)
- [ ] Gérer valeur sélectionnée
- [ ] Styling avec TailwindCSS
- [ ] Exporter types pour props

#### 5.4 Composant Modal
- [ ] Créer composant src/components/ui/Modal.tsx
- [ ] Implémenter overlay
- [ ] Implémenter contenu modal
- [ ] Gérer ouvert/fermé (props isOpen, onClose)
- [ ] Animation fade/slide
- [ ] Gérer fermeture avec Escape
- [ ] Styling avec TailwindCSS

#### 5.5 Composant Loading
- [ ] Créer composant src/components/ui/Loading.tsx
- [ ] Implémenter spinner
- [ ] Implémenter skeleton loader
- [ ] Variants (spinner, skeleton, fullscreen)
- [ ] Styling avec TailwindCSS

#### 5.6 Composant ErrorMessage
- [ ] Créer composant src/components/ui/ErrorMessage.tsx
- [ ] Afficher message d'erreur
- [ ] Variants (error, warning, info)
- [ ] Bouton retry si nécessaire
- [ ] Styling avec TailwindCSS

### Phase 8 : Page Panier & Checkout (Style A-COLD-WALL*)
#### 8.1 Composants UI (À faire plus tard si nécessaire)
#### 8.1.1 Composant FilterSidebar
- [ ] Créer composant src/components/catalog/FilterSidebar.tsx
- [ ] Intégrer hook useCategories
- [ ] Afficher liste catégories (checkboxes)
- [ ] Gérer sélection catégories (state)
- [ ] Implémenter filtres prix (range slider ou inputs)
- [ ] Bouton "Réinitialiser filtres"
- [ ] Styling avec TailwindCSS
- [ ] Responsive (mobile : drawer/modal)

#### 8.1.2 Composant SortSelector
- [ ] Créer composant src/components/catalog/SortSelector.tsx
- [ ] Options tri (prix croissant, décroissant, nouveauté, nom)
- [ ] Gérer sélection tri (state)
- [ ] Utiliser composant Select
- [ ] Styling avec TailwindCSS

#### 8.1.3 Composant Pagination
- [ ] Créer composant src/components/catalog/Pagination.tsx
- [ ] Afficher numéros pages
- [ ] Boutons précédent/suivant
- [ ] Gérer page courante
- [ ] Calcul nombre pages depuis total
- [ ] Styling avec TailwindCSS

### Phase 9 : Pages Produits (Style A-COLD-WALL*) ✅
#### 9.1 Page Product - Structure ✅
- [x] Créer page src/pages/Product.tsx
- [x] Intégrer Layout
- [x] Récupérer id depuis URL (useParams)
- [x] Créer layout avec galerie images (gauche 40%) et infos produit (droite 60%)
- [x] Styling de base avec TailwindCSS (m-[2px], p-[2px], bg-grey)
- [x] Responsive (stack vertical mobile, lg:flex desktop)

#### 9.2 Composant ProductGallery ✅
- [x] Créer composant src/components/product/ProductGallery.tsx
- [x] Afficher images (carrousel Swiper mobile, grille desktop)
- [x] Implémenter navigation images (précédent/suivant mobile)
- [x] Images triées par order
- [ ] Implémenter thumbnails (si plusieurs images) - non nécessaire
- [ ] Zoom image au clic (modal) - à faire plus tard
- [x] Styling avec TailwindCSS (aspect ratio 4:3)
- [x] Responsive

#### 9.3 Composant ProductInfo ✅
- [x] Créer composant src/components/product/ProductInfo.tsx
- [x] Afficher nom produit (h1, uppercase)
- [x] Afficher description
- [x] Afficher prix (barré + réduit 30%)
- [x] Format prix €XX,XX
- [ ] Afficher catégorie (lien) - à faire plus tard
- [x] Styling avec TailwindCSS

#### 9.4 Composant VariantSelector ✅
- [x] Créer composant src/components/product/VariantSelector.tsx
- [x] Afficher sélecteur taille (select dropdown)
- [x] Arrow custom (triangle noir)
- [x] Gérer sélection variante (callback onVariantChange)
- [x] Affichage taille + couleur dans options
- [ ] Désactiver options si stock = 0 - à faire plus tard
- [x] Styling avec TailwindCSS (border noir, rounded-md)

#### 9.5 Composant StockIndicator
- [ ] Créer composant src/components/product/StockIndicator.tsx - non nécessaire pour l'instant
- [ ] Afficher stock disponible - géré dans AddToCartButton
- [ ] Variants (En stock, Stock faible, Rupture)
- [ ] Couleurs selon stock
- [ ] Styling avec TailwindCSS

#### 9.6 Composant AddToCartButton ✅
- [x] Créer composant src/components/product/AddToCartButton.tsx
- [x] Intégrer hook useCart
- [x] Prendre variant et quantity en props
- [x] Gérer état loading (isAdding state)
- [x] Gérer état success (message + timeout 3s)
- [x] Vérification stock avant ajout
- [x] Désactiver si stock = 0 ou pas de variante
- [x] Styling avec TailwindCSS (bouton noir, texte blanc)

#### 9.7 Page Product - Fonctionnalités ✅
- [x] Intégrer hook useProduct avec id
- [x] Gérer sélection variante (useState selectedVariant)
- [x] Récupération variantId depuis sélection
- [x] Vérification stock via AddToCartButton
- [x] Implémenter ajout au panier (useCart().addToCart())
- [ ] Implémenter produits similaires (même catégorie) - à faire plus tard
- [x] Gérer états loading (message "Loading...")
- [x] Gérer états error (message rouge)
- [x] Gérer état produit introuvable (404 message)
- [x] Styling complet avec TailwindCSS (sticky right column)
- [x] Composant ProductTabs créé (Details, Sizing, Shipping, Returns)

### Phase 10 : Page Panier & Checkout (Style A-COLD-WALL*)
#### 10.1 Page Cart - Structure
- [ ] Créer page src/pages/Cart.tsx
- [ ] Intégrer Layout
- [ ] Créer layout avec liste articles (gauche) et récapitulatif (droite)
- [ ] Styling de base avec TailwindCSS
- [ ] Responsive (stack vertical mobile)

#### 10.2 Composant CartItem
- [ ] Créer composant src/components/cart/CartItem.tsx
- [ ] Afficher image produit
- [ ] Afficher nom produit, variante (couleur, taille)
- [ ] Afficher shop d'origine (badge "Reboul Adult", "C.P.COMPANY", etc.)
- [ ] Afficher prix unitaire
- [ ] Intégrer QuantitySelector
- [ ] Afficher prix total (prix × quantité)
- [ ] Bouton supprimer
- [ ] Styling avec TailwindCSS
- [ ] Responsive

#### 10.2.1 Composant CartGroupedByShop
- [ ] Créer composant src/components/cart/CartGroupedByShop.tsx
- [ ] Grouper articles par shop
- [ ] Afficher section par shop avec header (nom shop)
- [ ] Afficher sous-total par shop
- [ ] Styling avec TailwindCSS

#### 10.3 Composant QuantitySelector
- [ ] Créer composant src/components/cart/QuantitySelector.tsx
- [ ] Boutons - et +
- [ ] Input nombre (quantité)
- [ ] Gérer min (1) et max (stock disponible)
- [ ] Appeler updateItem du hook useCart
- [ ] Styling avec TailwindCSS

#### 10.4 Composant CartSummary
- [ ] Créer composant src/components/cart/CartSummary.tsx
- [ ] Afficher sous-total
- [ ] Afficher frais de livraison (si applicable)
- [ ] Afficher total
- [ ] Bouton "Passer commande"
- [ ] Bouton "Continuer les achats"
- [ ] Styling avec TailwindCSS

#### 10.5 Composant EmptyCart
- [ ] Créer composant src/components/cart/EmptyCart.tsx
- [ ] Message "Votre panier est vide"
- [ ] Image ou icône
- [ ] Bouton "Découvrir nos produits" (lien Catalog)
- [ ] Styling avec TailwindCSS

#### 10.6 Page Cart - Fonctionnalités
- [ ] Intégrer hook useCart
- [ ] Grouper articles par shop (CartGroupedByShop)
- [ ] Afficher articles panier (map CartItem groupés)
- [ ] Implémenter modification quantités (QuantitySelector)
- [ ] Implémenter suppression article
- [ ] Calculer et afficher total global (CartSummary)
- [ ] Afficher sous-totaux par shop
- [ ] Gérer état panier vide (EmptyCart)
- [ ] Gérer états loading (Loading component)
- [ ] Gérer états error (ErrorMessage component)
- [ ] Navigation vers Checkout au clic "Passer commande" (checkout unique multi-shops)
- [ ] Styling complet avec TailwindCSS

### Phase 11 : Page Checkout (Style A-COLD-WALL*)
#### 11.1 Page Checkout - Structure
- [ ] Créer page src/pages/Checkout.tsx
- [ ] Intégrer Layout
- [ ] Créer layout avec formulaire (gauche) et récapitulatif (droite)
- [ ] Styling de base avec TailwindCSS
- [ ] Responsive (stack vertical mobile)

#### 11.2 Composant CheckoutForm
- [ ] Créer composant src/components/checkout/CheckoutForm.tsx
- [ ] Formulaire livraison :
  - [ ] Nom (input text)
  - [ ] Prénom (input text)
  - [ ] Email (input email)
  - [ ] Téléphone (input tel)
  - [ ] Adresse (input text)
  - [ ] Code postal (input text)
  - [ ] Ville (input text)
  - [ ] Pays (select)
- [ ] Validation formulaire (react-hook-form ou équivalent)
- [ ] Messages d'erreur validation
- [ ] Styling avec TailwindCSS

#### 11.3 Composant OrderSummary
- [ ] Créer composant src/components/checkout/OrderSummary.tsx
- [ ] Afficher liste articles (similaire CartItem mais read-only)
- [ ] Afficher sous-total
- [ ] Afficher frais livraison
- [ ] Afficher total
- [ ] Styling avec TailwindCSS

#### 11.4 Composant PaymentSection
- [ ] Créer composant src/components/checkout/PaymentSection.tsx
- [ ] Section paiement (placeholder pour intégration future)
- [ ] Message "Paiement à venir"
- [ ] Styling avec TailwindCSS

#### 11.5 Page Checkout - Fonctionnalités
- [ ] Intégrer hook useCart pour récupérer panier (multi-shops)
- [ ] Afficher articles groupés par shop dans récapitulatif
- [ ] Gérer state formulaire
- [ ] Implémenter validation formulaire
- [ ] Implémenter soumission formulaire
- [ ] Créer commande (service orders.createOrder) - commande unique avec articles multi-shops
- [ ] Intégrer Stripe (payment intent avec répartition Stripe Connect)
- [ ] Gérer devises (EUR, USD) - sélecteur devise
- [ ] Gérer états loading (Loading component)
- [ ] Gérer états error (ErrorMessage component)
- [ ] Redirection vers page confirmation après succès
- [ ] Vider panier après commande réussie
- [ ] Styling complet avec TailwindCSS

#### 11.6 Page Confirmation
- [ ] Créer page src/pages/OrderConfirmation.tsx
- [ ] Afficher message confirmation
- [ ] Afficher numéro commande
- [ ] Afficher récapitulatif commande
- [ ] Bouton "Retour à l'accueil"
- [ ] Styling avec TailwindCSS

### Phase 12 : Pages Vitrine - Homepage 🏠 EN COURS
#### 12.1 Page Home - Structure
- [x] Créer page src/pages/Home.tsx (route `/`)
- [x] Intégrer Layout
- [x] Intégrer composants (HeroSectionImage, HeroSectionVideo, FeaturedProducts, CategorySection)
- [x] Styling premium avec TailwindCSS
- [x] Responsive design

#### 12.1.1 Page Shop Home (À faire plus tard)
- [ ] Créer page src/pages/ShopHome.tsx (route `/shop/:shopSlug`)
- [ ] Intégrer Layout
- [ ] Créer sections (Hero, FeaturedCategories, FeaturedProducts, LocalAnchor, BlogCarousel)
- [ ] Filtrer contenu par shop actif
- [ ] Styling de base avec TailwindCSS

#### 12.2 Composant HeroSectionImage ✅
- [x] Créer composant src/components/home/HeroSectionImage.tsx
- [x] Créer en React/TailwindCSS (style inspiré A-COLD-WALL*)
- [x] Image hero avec aspect ratio responsive (4/5 mobile, 2/1 desktop)
- [x] Overlay noir semi-transparent (20% opacité)
- [x] Titre et sous-titre personnalisables
- [x] Bouton CTA personnalisable
- [x] Lien cliquable sur toute l'image
- [x] Styling premium + streetwear avec TailwindCSS
- [x] Responsive design
- [x] Intégration dans page Home.tsx

#### 12.2.1 Composant HeroSectionVideo ✅
- [x] Créer composant src/components/home/HeroSectionVideo.tsx
- [x] Dupliqué depuis HeroSectionImage et adapté pour la vidéo
- [x] Vidéo hero avec aspect ratio responsive (4/5 mobile, 2/1 desktop)
- [x] Vidéo en autoplay, loop, muted, playsInline
- [x] Overlay noir semi-transparent (20% opacité)
- [x] Titre et sous-titre personnalisables
- [x] Bouton CTA personnalisable
- [x] Lien cliquable sur toute la vidéo
- [x] Support formats vidéo (MP4, WebM, etc.)
- [x] Styling premium + streetwear avec TailwindCSS
- [x] Responsive design
- [x] Intégration dans page Home.tsx

#### 12.3 Composant CategorySection ✅
- [x] Créer composant src/components/home/CategorySection.tsx
- [x] Créer en React/TailwindCSS (style inspiré A-COLD-WALL*)
- [x] Intégrer hook useCategories pour récupérer les catégories du backend
- [x] Carousel Swiper horizontal avec navigation prev/next
- [x] Grandes cartes d'images (aspect 4/5) avec overlay texte
- [x] Nom de catégorie positionné au milieu à gauche
- [x] Bouton "Shop now" positionné en bas à gauche
- [x] Utilisation getImageUrl() pour construire les URLs d'images
- [x] Placeholder si pas d'image
- [x] Gestion loading/error
- [x] Lien vers `/collections/${category.slug}`
- [x] Images catégories connectées au backend (champ imageUrl)
- [x] Styling premium/streetwear avec TailwindCSS
- [x] Responsive (breakpoints mobile 1.2 slides, desktop 3 slides)
- [x] Intégration dans page Home.tsx

#### 12.4 Composant FeaturedProducts ✅
- [x] Créer composant src/components/home/FeaturedProducts.tsx
- [x] Recréer en React/TailwindCSS (style inspiré A-COLD-WALL*)
- [x] Intégrer Swiper pour carousel horizontal avec navigation prev/next
- [x] Afficher produits en carousel avec ProductCard intégré
- [x] ProductImage avec gestion erreurs (placeholder si pas d'image)
- [x] Hover effect avec 2 images (transition au hover)
- [x] Calcul prix réduit (30% de réduction affichée)
- [x] Titre section avec prop title (ex: "Winter Sale", "COLLECTION ENFANTS")
- [x] Boutons navigation avec états (disabled, opacity, transitions)
- [x] Styling premium/streetwear avec TailwindCSS
- [x] Responsive (breakpoints mobile 2.2 slides, desktop 5 slides)
- [x] Correction bug bouton Previous (ajout événement init Swiper)
- [x] **Mode avec liste de produits** : Prop `products` pour liste personnalisée
- [x] **Mode avec catégorie** : Prop `categorySlug` pour récupération automatique
- [x] Récupération ID catégorie depuis slug (getCategoryBySlug)
- [x] Gestion loading/error pour les deux modes
- [x] Prop `limit` pour limiter le nombre de produits (mode categorySlug)

#### 12.5 Composant LocalAnchor 🚧 À créer
- [ ] Créer composant src/components/home/LocalAnchor.tsx
- [ ] Créer en React/TailwindCSS (style A-COLD-WALL*)
- [ ] Section ancrage local (Marseille / Cassis / Sanary)
- [ ] Texte présentation
- [ ] Images lieux (optionnel)
- [ ] Lien vers page About
- [ ] Styling avec TailwindCSS
- [ ] Responsive

#### 12.6 Composant BlogCarousel 🚧 À créer
- [ ] Créer composant src/components/home/BlogCarousel.tsx
- [ ] Créer en React/TailwindCSS (style A-COLD-WALL*)
- [ ] Intégrer service blog/articles (à créer si nécessaire)
- [ ] Implémenter carrousel défilant (auto-play)
- [ ] Afficher articles avec images, titres, extraits
- [ ] Navigation précédent/suivant
- [ ] Lien vers article complet
- [ ] Styling avec TailwindCSS
- [ ] Responsive

#### 12.5 Composant PromoCard ✅
- [x] Créer composant src/components/home/PromoCard.tsx
- [x] Composant réutilisable pour promouvoir différents contenus (hôtels, boutiques, collaborations, etc.)
- [x] Layout deux colonnes responsive (image gauche 30%, contenu droite 70%)
- [x] Image principale avec overlay optionnel (topText, title, number)
- [x] Contenu texte avec titre et description (tableau de strings)
- [x] Grille optionnelle de 2 images avec overlay description
- [x] Liens optionnels sur images (interne ou externe)
- [x] Gestion hauteurs égales et overflow
- [x] Alignement texte en bas de colonne droite
- [x] Style inspiré A-COLD-WALL* (minimaliste, premium)
- [x] Responsive design (stack vertical mobile, flex horizontal desktop)
- [x] Intégration dans page Home.tsx

#### 12.7 Page Home - Finalisation 🚧 EN COURS
- [x] Créer page src/pages/Home.tsx
- [x] Intégrer Layout
- [x] Intégrer composants (HeroSectionImage, HeroSectionVideo, FeaturedProducts, CategorySection, PromoCard)
- [ ] Intégrer LocalAnchor et BlogCarousel
- [ ] Animer sections au scroll (framer-motion ou CSS) - optionnel
- [ ] Styling complet premium + streetwear
- [ ] Responsive design complet
- [ ] Tester toutes les sections
- [x] Connecter route `/` dans App.tsx

#### 12.7 Page About
- [ ] Créer page src/pages/About.tsx
- [ ] Intégrer Layout
- [ ] Créer composant BrandStory.tsx (histoire marque)
- [ ] Créer composant ConceptSection.tsx (présentation concept-store)
- [ ] Créer composant LocationSection.tsx (ancrage local avec images)
- [ ] Créer composant ContactSection.tsx (formulaire contact ou infos)
- [ ] Intégrer tous les composants
- [ ] Styling avec TailwindCSS
- [ ] Responsive design

### Phase 13 : Optimisations & Finitions
#### 13.1 Performance - Lazy Loading
- [ ] Implémenter React.lazy() pour pages
- [ ] Implémenter Suspense avec fallback Loading
- [ ] Lazy load images (loading="lazy")
- [ ] Code splitting par route

#### 13.2 Performance - Optimisations React
- [ ] Utiliser React.memo() pour composants lourds
- [ ] Utiliser useMemo() pour calculs coûteux
- [ ] Utiliser useCallback() pour fonctions passées en props
- [ ] Optimiser re-renders
- [ ] Implémenter cache frontend (localStorage/sessionStorage pour données API)
  - [ ] Cache catégories (localStorage)
  - [ ] Cache produits populaires (sessionStorage)
  - [ ] Cache panier (localStorage)

#### 13.3 Performance - Bundle
- [ ] Analyser bundle size (vite-bundle-visualizer)
- [ ] Optimiser imports (tree-shaking)
- [ ] Vérifier dépendances inutiles
- [ ] Optimiser images (compression, formats modernes WebP/AVIF avec fallback)
- [ ] Lazy loading images activé par défaut (loading="lazy")

#### 13.4 SEO
- [ ] Installer react-helmet-async ou équivalent
- [ ] Ajouter meta tags (title, description) par page
  - [ ] Page Home (/)
  - [ ] Page Catalog (/catalog)
  - [ ] Page Product (/product/:id)
  - [ ] Page Cart (/cart)
- [ ] Ajouter Open Graph tags
- [ ] Ajouter Twitter Card tags
- [ ] Ajouter structured data (JSON-LD) si nécessaire
- [ ] Créer sitemap.xml
- [ ] Créer robots.txt
- [ ] Vérifier avec outils SEO

#### 13.5 Accessibilité
- [ ] Ajouter alt text sur toutes les images
- [ ] Vérifier contraste couleurs (WCAG AA)
- [ ] Vérifier navigation clavier (Tab, Enter, Escape)
- [ ] Ajouter ARIA labels où nécessaire
- [ ] Vérifier focus visible
- [ ] Tester avec lecteur d'écran

#### 11.6 Responsive & Mobile
- [ ] Vérifier toutes les pages sur mobile (approche mobile-first)
- [ ] Tester breakpoints TailwindCSS (sm, md, lg, xl)
- [ ] Tablette = adaptation desktop (pas de breakpoint spécifique)
- [ ] Optimiser expérience mobile (touch targets, spacing)
- [ ] Tester sur différents devices (iPhone, Android, tablette)
- [ ] Ajuster si nécessaire

#### 13.7 Animations & Transitions
- [ ] Ajouter transitions douces (framer-motion ou CSS)
- [ ] Animer apparition éléments
- [ ] Animer hover states
- [ ] Animer modals
- [ ] Performance animations (GPU-accelerated)

#### 13.8 Tests
- [ ] Configurer tests (Vitest ou Jest)
- [ ] Tests unitaires composants critiques
- [ ] Tests hooks personnalisés
- [ ] Tests services API
- [ ] Tests E2E (Playwright ou Cypress) - parcours utilisateur prioritaires :
  - [ ] Parcours achat complet (catalog → product → cart → checkout)
  - [ ] Authentification (inscription, connexion)
  - [ ] Navigation multi-shops
- [ ] Couverture de code à définir

#### 13.9 Intégrations Frontend
- [ ] Analytics (Google Analytics - version à définir)
  - [ ] Tracking vues produits
  - [ ] Tracking ajouts au panier
  - [ ] Tracking commandes
- [ ] Chatbot IA (Elevenlabs UI) - 24/7
- [ ] Newsletter (popup d'inscription - service à définir : Mailchimp/SendGrid)
  - [ ] Déclenchement popup (temps, scroll, exit intent)
- [ ] Intégration Stripe (frontend)
  - [ ] Stripe Elements pour formulaire paiement
  - [ ] Gestion devises (EUR, USD)
  - [ ] Répartition Stripe Connect (transparent pour utilisateur)
- [ ] WebSockets (notifications temps réel)
- [ ] OAuth (Google, Apple) - boutons de connexion

#### 13.10 Documentation & Déploiement ✅
- [x] Configuration Docker production (`Dockerfile.prod`)
- [x] Configuration Nginx (reverse proxy, compression, cache)
- [x] Scripts déploiement (`deploy-reboul.sh`)
- [x] Variables d'environnement documentées
- [x] Workflow design documenté (A-COLD-WALL* inspiration)
- [ ] Optimiser build production (à finaliser)
- [ ] Configurer CI/CD (à prévoir)
- [x] Hébergement préparé (Docker Compose production)

---

## 🐳 Phase 17.11 : Docker & Déploiement Production Ready ✅

### Infrastructure Production
- [x] Docker Compose production configuré
- [x] Nginx reverse proxy configuré
- [x] Scripts déploiement créés
- [x] Monitoring & logs configurés
- [ ] Serveur OVH (Phase 17.11.5 - à faire)

