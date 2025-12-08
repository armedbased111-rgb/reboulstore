# 🎨 Frontend - Documentation

## 📋 Vue d'ensemble

Application frontend construite avec **React** (TypeScript), **Vite** comme build tool, et **TailwindCSS** pour le styling, containerisée avec Docker.

## 🛠️ Stack technique

- **Build tool** : Vite
- **Framework** : React (TypeScript)
- **Styling** : TailwindCSS v4
- **Composants UI** : shadcn/ui (dans `/ui/shadcn`)
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
│   │   └── ui/shadcn/    # Composants shadcn/ui
│   ├── services/         # Services API
│   │   ├── api.ts        # Client API
│   │   ├── products.ts   # Service produits
│   │   ├── categories.ts # Service catégories
│   │   ├── cart.ts       # Service panier
│   │   ├── auth.ts       # Service authentification
│   │   └── orders.ts     # Service commandes
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

### Catalog (Catalogue)
- Liste des produits avec filtres
- Filtres par catégorie (Adult, Kids, Sneakers, etc.)
- Grille de produits avec images
- Pagination
- Tri (prix, nouveauté, etc.)

### Product (Fiche Produit)
- Galerie d'images (carrousel ou grille)
- Informations produit (nom, description, prix)
- Sélecteur de variantes (couleur, taille)
- Bouton "Ajouter au panier"
- Stock disponible
- Produits similaires

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
- **Footer** : Liens, informations, contact
- **Layout** : Wrapper principal

### Product
- **ProductCard** : Carte produit (liste)
- **ProductGallery** : Galerie d'images
- **ProductInfo** : Informations produit
- **VariantSelector** : Sélecteur variantes (couleur, taille)
- **AddToCartButton** : Bouton ajout panier

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

### Version : 0.7.0 - Phase 6 Layout & Navigation ✅ / Phase 10 Homepage en cours 🏠

**Statut** : ✅ Phase 6 complétée (Layout & Navigation)
**En cours** : Phase 10 - Homepage (Page d'accueil)
**Dernière mise à jour** : Composant FeaturedProducts créé et finalisé ✅

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
- ✅ Footer.tsx créé (structure de base avec placeholders)
- ✅ Responsive design (mobile/desktop)
- 🚧 Footer : À finaliser avec design Framer (structure de base créée)

#### 🏠 En cours (Phase 10 - Homepage)
- 📋 Page Home.tsx à créer
- 📋 Composants Homepage :
  - [ ] HeroSection (présentation concept-store)
  - [ ] FeaturedCategories (catégories mises en avant)
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
    - **Props** : `title: string`, `products: Product[]`
    - **Dépendances** : Swiper, React, types Product
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

#### 6.3 Création Footer - Style A-COLD-WALL* 🚧
- [x] Créer composant Footer.tsx (structure de base avec placeholders)
- [x] Sections : À propos, Liens utiles, Contact
- [x] Styling de base avec TailwindCSS
- [ ] Finaliser design Footer (style minimaliste A-COLD-WALL*)
- [ ] Connecter les liens et réseaux sociaux
- [ ] Tester responsive

#### 6.4 Routing complet
- [ ] Configurer toutes les routes React Router
- [ ] Créer composant ProtectedRoute si nécessaire
- [ ] Implémenter navigation programmatique
- [ ] Tester toutes les routes
- [ ] Intégrer Layout sur toutes les pages

### Phase 7 : Pages Catalogue & Produits (Style A-COLD-WALL*)
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
#### 6.1 Page Catalog - Structure
- [ ] Créer page src/pages/Catalog.tsx
- [ ] Intégrer Layout
- [ ] Créer layout avec sidebar filtres et grille produits
- [ ] Styling de base avec TailwindCSS
- [ ] Responsive (sidebar collapsible mobile)

#### 6.2 Composant FilterSidebar
- [ ] Créer composant src/components/catalog/FilterSidebar.tsx
- [ ] Intégrer hook useCategories
- [ ] Afficher liste catégories (checkboxes)
- [ ] Gérer sélection catégories (state)
- [ ] Implémenter filtres prix (range slider ou inputs)
- [ ] Bouton "Réinitialiser filtres"
- [ ] Styling avec TailwindCSS
- [ ] Responsive (mobile : drawer/modal)

#### 6.3 Composant ProductCard
- [ ] Créer composant src/components/product/ProductCard.tsx
- [ ] Afficher image produit (première image)
- [ ] Afficher nom produit
- [ ] Afficher prix
- [ ] Lien vers page Product
- [ ] Hover effects
- [ ] Styling premium avec TailwindCSS
- [ ] Responsive

#### 6.4 Composant ProductGrid
- [ ] Créer composant src/components/catalog/ProductGrid.tsx
- [ ] Afficher grille de ProductCard
- [ ] Layout grid responsive (1 col mobile, 2-3-4 cols desktop)
- [ ] Gérer état vide (aucun produit)
- [ ] Styling avec TailwindCSS

#### 6.5 Composant SortSelector
- [ ] Créer composant src/components/catalog/SortSelector.tsx
- [ ] Options tri (prix croissant, décroissant, nouveauté, nom)
- [ ] Gérer sélection tri (state)
- [ ] Utiliser composant Select
- [ ] Styling avec TailwindCSS

#### 6.6 Composant Pagination
- [ ] Créer composant src/components/catalog/Pagination.tsx
- [ ] Afficher numéros pages
- [ ] Boutons précédent/suivant
- [ ] Gérer page courante
- [ ] Calcul nombre pages depuis total
- [ ] Styling avec TailwindCSS

#### 6.7 Page Catalog - Fonctionnalités
- [ ] Intégrer hook useProducts
- [ ] Gérer state filtres (catégories, prix)
- [ ] Gérer state tri
- [ ] Gérer state pagination (page, limit)
- [ ] Implémenter fetchProducts avec query params
- [ ] Implémenter application filtres
- [ ] Implémenter application tri
- [ ] Implémenter pagination
- [ ] Gérer états loading (Loading component)
- [ ] Gérer états error (ErrorMessage component)
- [ ] Gérer état vide (message "Aucun produit")
- [ ] Styling complet avec TailwindCSS

### Phase 9 : Pages Vitrine (Style A-COLD-WALL*)
#### 7.1 Page Product - Structure
- [ ] Créer page src/pages/Product.tsx
- [ ] Intégrer Layout
- [ ] Récupérer id depuis URL (useParams)
- [ ] Créer layout avec galerie images (gauche) et infos produit (droite)
- [ ] Styling de base avec TailwindCSS
- [ ] Responsive (stack vertical mobile)

#### 7.2 Composant ProductGallery
- [ ] Créer composant src/components/product/ProductGallery.tsx
- [ ] Afficher images (carrousel ou grille)
- [ ] Implémenter navigation images (précédent/suivant)
- [ ] Implémenter thumbnails (si plusieurs images)
- [ ] Zoom image au clic (modal)
- [ ] Styling avec TailwindCSS
- [ ] Responsive

#### 7.3 Composant ProductInfo
- [ ] Créer composant src/components/product/ProductInfo.tsx
- [ ] Afficher nom produit
- [ ] Afficher description
- [ ] Afficher prix
- [ ] Afficher catégorie (lien)
- [ ] Styling avec TailwindCSS

#### 7.4 Composant VariantSelector
- [ ] Créer composant src/components/product/VariantSelector.tsx
- [ ] Afficher sélecteur couleur (boutons ou select)
- [ ] Afficher sélecteur taille (boutons ou select)
- [ ] Gérer sélection variante (state)
- [ ] Afficher stock disponible selon variante
- [ ] Désactiver options si stock = 0
- [ ] Styling avec TailwindCSS

#### 7.5 Composant StockIndicator
- [ ] Créer composant src/components/product/StockIndicator.tsx
- [ ] Afficher stock disponible
- [ ] Variants (En stock, Stock faible, Rupture)
- [ ] Couleurs selon stock
- [ ] Styling avec TailwindCSS

#### 7.6 Composant AddToCartButton
- [ ] Créer composant src/components/product/AddToCartButton.tsx
- [ ] Intégrer hook useCart
- [ ] Prendre variantId et quantity en props
- [ ] Gérer état loading
- [ ] Gérer état success (message ou toast)
- [ ] Désactiver si stock = 0
- [ ] Styling avec TailwindCSS

#### 7.7 Page Product - Fonctionnalités
- [ ] Intégrer hook useProduct avec id
- [ ] Gérer sélection variante (couleur, taille)
- [ ] Calculer variantId depuis sélection
- [ ] Vérifier stock selon variante sélectionnée
- [ ] Implémenter ajout au panier
- [ ] Implémenter produits similaires (même catégorie)
- [ ] Gérer états loading (Loading component)
- [ ] Gérer états error (ErrorMessage component)
- [ ] Gérer état produit introuvable (404)
- [ ] Styling complet avec TailwindCSS

### Phase 8 : Page Cart
#### 8.1 Page Cart - Structure
- [ ] Créer page src/pages/Cart.tsx
- [ ] Intégrer Layout
- [ ] Créer layout avec liste articles (gauche) et récapitulatif (droite)
- [ ] Styling de base avec TailwindCSS
- [ ] Responsive (stack vertical mobile)

#### 8.2 Composant CartItem
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

#### 8.2.1 Composant CartGroupedByShop
- [ ] Créer composant src/components/cart/CartGroupedByShop.tsx
- [ ] Grouper articles par shop
- [ ] Afficher section par shop avec header (nom shop)
- [ ] Afficher sous-total par shop
- [ ] Styling avec TailwindCSS

#### 8.3 Composant QuantitySelector
- [ ] Créer composant src/components/cart/QuantitySelector.tsx
- [ ] Boutons - et +
- [ ] Input nombre (quantité)
- [ ] Gérer min (1) et max (stock disponible)
- [ ] Appeler updateItem du hook useCart
- [ ] Styling avec TailwindCSS

#### 8.4 Composant CartSummary
- [ ] Créer composant src/components/cart/CartSummary.tsx
- [ ] Afficher sous-total
- [ ] Afficher frais de livraison (si applicable)
- [ ] Afficher total
- [ ] Bouton "Passer commande"
- [ ] Bouton "Continuer les achats"
- [ ] Styling avec TailwindCSS

#### 8.5 Composant EmptyCart
- [ ] Créer composant src/components/cart/EmptyCart.tsx
- [ ] Message "Votre panier est vide"
- [ ] Image ou icône
- [ ] Bouton "Découvrir nos produits" (lien Catalog)
- [ ] Styling avec TailwindCSS

#### 8.6 Page Cart - Fonctionnalités
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

### Phase 9 : Page Checkout
#### 9.1 Page Checkout - Structure
- [ ] Créer page src/pages/Checkout.tsx
- [ ] Intégrer Layout
- [ ] Créer layout avec formulaire (gauche) et récapitulatif (droite)
- [ ] Styling de base avec TailwindCSS
- [ ] Responsive (stack vertical mobile)

#### 9.2 Composant CheckoutForm
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

#### 9.3 Composant OrderSummary
- [ ] Créer composant src/components/checkout/OrderSummary.tsx
- [ ] Afficher liste articles (similaire CartItem mais read-only)
- [ ] Afficher sous-total
- [ ] Afficher frais livraison
- [ ] Afficher total
- [ ] Styling avec TailwindCSS

#### 9.4 Composant PaymentSection
- [ ] Créer composant src/components/checkout/PaymentSection.tsx
- [ ] Section paiement (placeholder pour intégration future)
- [ ] Message "Paiement à venir"
- [ ] Styling avec TailwindCSS

#### 9.5 Page Checkout - Fonctionnalités
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

#### 9.6 Page Confirmation
- [ ] Créer page src/pages/OrderConfirmation.tsx
- [ ] Afficher message confirmation
- [ ] Afficher numéro commande
- [ ] Afficher récapitulatif commande
- [ ] Bouton "Retour à l'accueil"
- [ ] Styling avec TailwindCSS

### Phase 10 : Pages Vitrine - Homepage 🏠 EN COURS
#### 10.1 Page Home - Structure
- [ ] Créer page src/pages/Home.tsx (route `/`)
- [ ] Intégrer Layout
- [ ] Créer structure avec toutes les sections
- [ ] Styling premium avec TailwindCSS
- [ ] Responsive design

#### 10.1.1 Page Shop Home (À faire plus tard)
- [ ] Créer page src/pages/ShopHome.tsx (route `/shop/:shopSlug`)
- [ ] Intégrer Layout
- [ ] Créer sections (Hero, FeaturedCategories, FeaturedProducts, LocalAnchor, BlogCarousel)
- [ ] Filtrer contenu par shop actif
- [ ] Styling de base avec TailwindCSS

#### 10.2 Composant HeroSection 🚧 À créer
- [ ] Créer composant src/components/home/HeroSection.tsx
- [ ] Créer en React/TailwindCSS (style A-COLD-WALL*)
- [ ] Image/vidéo hero
- [ ] Titre accrocheur
- [ ] Sous-titre présentation concept-store
- [ ] Bouton CTA "Découvrir"
- [ ] Styling premium + streetwear avec TailwindCSS
- [ ] Responsive

#### 10.3 Composant FeaturedCategories 🚧 À créer
- [ ] Créer composant src/components/home/FeaturedCategories.tsx
- [ ] Créer en React/TailwindCSS (style A-COLD-WALL*)
- [ ] Intégrer hook useCategories
- [ ] Afficher grille catégories (cartes)
- [ ] Lien vers Catalog avec filtre catégorie
- [ ] Images catégories
- [ ] Styling avec TailwindCSS
- [ ] Responsive

#### 10.4 Composant FeaturedProducts ✅
- [x] Créer composant src/components/home/FeaturedProducts.tsx
- [x] Recréer en React/TailwindCSS (style inspiré A-COLD-WALL*)
- [x] Intégrer Swiper pour carousel horizontal avec navigation prev/next
- [x] Afficher produits en carousel avec ProductCard intégré
- [x] ProductImage avec gestion erreurs (placeholder si pas d'image)
- [x] Hover effect avec 2 images (transition au hover)
- [x] Calcul prix réduit (30% de réduction affichée)
- [x] Titre section avec prop title (ex: "Winter Sale")
- [x] Boutons navigation avec états (disabled, opacity, transitions)
- [x] Styling premium/streetwear avec TailwindCSS
- [x] Responsive (breakpoints mobile 2.2 slides, desktop 5 slides)
- [x] Correction bug bouton Previous (ajout événement init Swiper)

#### 10.5 Composant LocalAnchor 🚧 À créer
- [ ] Créer composant src/components/home/LocalAnchor.tsx
- [ ] Créer en React/TailwindCSS (style A-COLD-WALL*)
- [ ] Section ancrage local (Marseille / Cassis / Sanary)
- [ ] Texte présentation
- [ ] Images lieux (optionnel)
- [ ] Lien vers page About
- [ ] Styling avec TailwindCSS
- [ ] Responsive

#### 10.6 Composant BlogCarousel 🚧 À créer
- [ ] Créer composant src/components/home/BlogCarousel.tsx
- [ ] Créer en React/TailwindCSS (style A-COLD-WALL*)
- [ ] Intégrer service blog/articles (à créer si nécessaire)
- [ ] Implémenter carrousel défilant (auto-play)
- [ ] Afficher articles avec images, titres, extraits
- [ ] Navigation précédent/suivant
- [ ] Lien vers article complet
- [ ] Styling avec TailwindCSS
- [ ] Responsive

#### 10.7 Page Home - Finalisation 🚧 EN COURS
- [ ] Créer page src/pages/Home.tsx
- [ ] Intégrer Layout
- [ ] Intégrer tous les composants (Hero, FeaturedCategories, FeaturedProducts, LocalAnchor, BlogCarousel)
- [ ] Animer sections au scroll (framer-motion ou CSS) - optionnel
- [ ] Styling complet premium + streetwear
- [ ] Responsive design complet
- [ ] Tester toutes les sections
- [ ] Connecter route `/` dans App.tsx

#### 10.7 Page About
- [ ] Créer page src/pages/About.tsx
- [ ] Intégrer Layout
- [ ] Créer composant BrandStory.tsx (histoire marque)
- [ ] Créer composant ConceptSection.tsx (présentation concept-store)
- [ ] Créer composant LocationSection.tsx (ancrage local avec images)
- [ ] Créer composant ContactSection.tsx (formulaire contact ou infos)
- [ ] Intégrer tous les composants
- [ ] Styling avec TailwindCSS
- [ ] Responsive design

### Phase 11 : Optimisations & Finitions
#### 11.1 Performance - Lazy Loading
- [ ] Implémenter React.lazy() pour pages
- [ ] Implémenter Suspense avec fallback Loading
- [ ] Lazy load images (loading="lazy")
- [ ] Code splitting par route

#### 11.2 Performance - Optimisations React
- [ ] Utiliser React.memo() pour composants lourds
- [ ] Utiliser useMemo() pour calculs coûteux
- [ ] Utiliser useCallback() pour fonctions passées en props
- [ ] Optimiser re-renders
- [ ] Implémenter cache frontend (localStorage/sessionStorage pour données API)
  - [ ] Cache catégories (localStorage)
  - [ ] Cache produits populaires (sessionStorage)
  - [ ] Cache panier (localStorage)

#### 11.3 Performance - Bundle
- [ ] Analyser bundle size (vite-bundle-visualizer)
- [ ] Optimiser imports (tree-shaking)
- [ ] Vérifier dépendances inutiles
- [ ] Optimiser images (compression, formats modernes WebP/AVIF avec fallback)
- [ ] Lazy loading images activé par défaut (loading="lazy")

#### 11.4 SEO
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

#### 11.5 Accessibilité
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

#### 11.7 Animations & Transitions
- [ ] Ajouter transitions douces (framer-motion ou CSS)
- [ ] Animer apparition éléments
- [ ] Animer hover states
- [ ] Animer modals
- [ ] Performance animations (GPU-accelerated)

#### 11.8 Tests
- [ ] Configurer tests (Vitest ou Jest)
- [ ] Tests unitaires composants critiques
- [ ] Tests hooks personnalisés
- [ ] Tests services API
- [ ] Tests E2E (Playwright ou Cypress) - parcours utilisateur prioritaires :
  - [ ] Parcours achat complet (catalog → product → cart → checkout)
  - [ ] Authentification (inscription, connexion)
  - [ ] Navigation multi-shops
- [ ] Couverture de code à définir

#### 11.9 Intégrations Frontend
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

#### 11.10 Documentation & Déploiement
- [ ] Mettre à jour README.md (setup, scripts, structure)
- [ ] Documenter variables d'environnement
- [ ] Documenter workflow design (A-COLD-WALL* inspiration)
- [ ] Documenter utilisation shadcn/ui (si utilisé)
- [ ] Préparer configuration production
- [ ] Optimiser build production
- [ ] Configurer CI/CD (à prévoir)
- [ ] Hébergement (Dev + Prod sur même serveur Docker)

