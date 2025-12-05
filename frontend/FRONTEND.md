# 🎨 Frontend - Documentation

## 📋 Vue d'ensemble

Application frontend construite avec **React** (TypeScript), **Vite** comme build tool, et **TailwindCSS** pour le styling, containerisée avec Docker.

## 🛠️ Stack technique

- **Build tool** : Vite
- **Framework** : React (TypeScript)
- **Styling** : TailwindCSS
- **Containerisation** : Docker

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
│   │   └── ui/           # Composants UI génériques
│   ├── services/         # Services API
│   │   ├── api.ts        # Client API
│   │   ├── products.ts   # Service produits
│   │   ├── categories.ts # Service catégories
│   │   └── cart.ts       # Service panier
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

### Client API
- Configuration axios/fetch
- Gestion des erreurs
- Intercepteurs

### Services métier
- **productsService** : Appels API produits
- **categoriesService** : Appels API catégories
- **cartService** : Appels API panier

## 🎯 Routing

Routes principales :
- `/` : Home
- `/catalog` : Catalogue
- `/catalog/:category` : Catalogue par catégorie
- `/product/:id` : Fiche produit
- `/cart` : Panier
- `/checkout` : Checkout
- `/about` : À propos

## 📊 État actuel

### Version : 0.1.0 - Phase 1 terminée

**Statut** : ✅ Phase 1 complétée - Prêt pour Phase 2

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

#### 🚧 En cours
- Phase 2 : Infrastructure API & Services

#### 📋 À faire
- Création des pages (Home, Catalog, Product, Cart, Checkout, About)
- Création des composants (Layout, Header, Footer, ProductCard, etc.)
- Intégration API (services, hooks)
- Styling avec TailwindCSS
- Routing complet

## 🗺️ Roadmap Frontend

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

### Phase 2 : Infrastructure API & Services
#### 2.1 Configuration client API
- [ ] Créer fichier src/services/api.ts
- [ ] Configurer axios ou fetch avec baseURL depuis .env
- [ ] Configurer timeout
- [ ] Configurer intercepteur request (ajout headers, auth si nécessaire)
- [ ] Configurer intercepteur response (gestion erreurs globales)
- [ ] Créer types pour réponses API (ApiResponse<T>)
- [ ] Créer fonction handleApiError() centralisée

#### 2.2 Service Products
- [ ] Créer fichier src/services/products.ts
- [ ] Implémenter getProducts(query?: ProductQuery) : Promise<Product[]>
- [ ] Implémenter getProduct(id: string) : Promise<Product>
- [ ] Implémenter getProductsByCategory(categoryId: string) : Promise<Product[]>
- [ ] Gérer paramètres query (filters, pagination, sort)
- [ ] Gérer erreurs et loading states
- [ ] Tester chaque fonction

#### 2.3 Service Categories
- [ ] Créer fichier src/services/categories.ts
- [ ] Implémenter getCategories() : Promise<Category[]>
- [ ] Implémenter getCategory(id: string) : Promise<Category>
- [ ] Implémenter getCategoryBySlug(slug: string) : Promise<Category>
- [ ] Gérer erreurs et loading states
- [ ] Tester chaque fonction

#### 2.4 Service Cart
- [ ] Créer fichier src/services/cart.ts
- [ ] Implémenter getCart(sessionId: string) : Promise<Cart>
- [ ] Implémenter addToCart(sessionId: string, variantId: string, quantity: number) : Promise<CartItem>
- [ ] Implémenter updateCartItem(itemId: string, quantity: number) : Promise<CartItem>
- [ ] Implémenter removeCartItem(itemId: string) : Promise<void>
- [ ] Implémenter clearCart(sessionId: string) : Promise<void>
- [ ] Gérer gestion sessionId (localStorage ou cookie)
- [ ] Gérer erreurs et loading states
- [ ] Tester chaque fonction

#### 2.5 Service Orders
- [ ] Créer fichier src/services/orders.ts
- [ ] Implémenter createOrder(dto: CreateOrderDto) : Promise<Order>
- [ ] Implémenter getOrder(id: string) : Promise<Order>
- [ ] Gérer erreurs et loading states
- [ ] Tester chaque fonction

### Phase 3 : Types TypeScript & Custom Hooks
#### 3.1 Types de base
- [ ] Créer fichier src/types/index.ts
- [ ] Définir type Product (id, name, description, price, categoryId, images, variants, category)
- [ ] Définir type Category (id, name, slug, description)
- [ ] Définir type Variant (id, productId, color, size, stock, sku)
- [ ] Définir type Image (id, productId, url, alt, order)
- [ ] Définir type Cart (id, sessionId, items)
- [ ] Définir type CartItem (id, cartId, variantId, quantity, variant)
- [ ] Définir type Order (id, cartId, status, total, customerInfo)
- [ ] Définir types pour DTOs (CreateOrderDto, etc.)

#### 3.2 Custom Hook useProducts
- [ ] Créer fichier src/hooks/useProducts.ts
- [ ] Implémenter hook avec useState, useEffect
- [ ] Gérer état loading
- [ ] Gérer état error
- [ ] Implémenter fetchProducts(query?)
- [ ] Implémenter refetch
- [ ] Retourner { products, loading, error, refetch }

#### 3.3 Custom Hook useProduct
- [ ] Créer fichier src/hooks/useProduct.ts
- [ ] Implémenter hook avec useState, useEffect
- [ ] Prendre id en paramètre
- [ ] Gérer état loading
- [ ] Gérer état error
- [ ] Implémenter fetchProduct(id)
- [ ] Retourner { product, loading, error }

#### 3.4 Custom Hook useCategories
- [ ] Créer fichier src/hooks/useCategories.ts
- [ ] Implémenter hook avec useState, useEffect
- [ ] Gérer état loading
- [ ] Gérer état error
- [ ] Implémenter fetchCategories()
- [ ] Retourner { categories, loading, error }

#### 3.5 Custom Hook useCart
- [ ] Créer fichier src/hooks/useCart.ts
- [ ] Implémenter hook avec useState, useEffect
- [ ] Gérer sessionId (localStorage)
- [ ] Gérer état cart, loading, error
- [ ] Implémenter addToCart(variantId, quantity)
- [ ] Implémenter updateItem(itemId, quantity)
- [ ] Implémenter removeItem(itemId)
- [ ] Implémenter clearCart()
- [ ] Implémenter calculTotal()
- [ ] Retourner { cart, loading, error, addToCart, updateItem, removeItem, clearCart, total }

#### 3.6 Custom Hook useLocalStorage
- [ ] Créer fichier src/hooks/useLocalStorage.ts
- [ ] Implémenter hook générique pour localStorage
- [ ] Gérer sérialisation/désérialisation JSON
- [ ] Gérer erreurs localStorage
- [ ] Retourner [value, setValue]

### Phase 4 : Composants Layout & Navigation
#### 4.1 Composant Layout
- [ ] Créer composant src/components/layout/Layout.tsx
- [ ] Intégrer Header et Footer
- [ ] Créer structure avec <main> pour contenu
- [ ] Styling de base avec TailwindCSS
- [ ] Responsive design

#### 4.2 Composant Header - Structure
- [ ] Créer composant src/components/layout/Header.tsx
- [ ] Créer structure avec logo, navigation, panier
- [ ] Layout flexbox/grid avec TailwindCSS
- [ ] Responsive (mobile menu)

#### 4.3 Composant Header - Logo
- [ ] Ajouter logo Reboul Store (image ou texte)
- [ ] Lien vers page Home
- [ ] Styling premium avec TailwindCSS

#### 4.4 Composant Header - Navigation
- [ ] Créer composant src/components/layout/Navigation.tsx
- [ ] Ajouter liens (Home, Catalog, About)
- [ ] Implémenter menu catégories (dropdown)
- [ ] Utiliser Link de react-router-dom
- [ ] Style liens actifs
- [ ] Styling avec TailwindCSS

#### 4.5 Composant Header - CartIcon
- [ ] Créer composant src/components/cart/CartIcon.tsx
- [ ] Intégrer hook useCart pour quantité
- [ ] Afficher badge avec quantité
- [ ] Lien vers page Cart
- [ ] Animation badge
- [ ] Styling avec TailwindCSS

#### 4.6 Composant Header - Mobile Menu
- [ ] Créer composant MobileMenu.tsx
- [ ] Implémenter hamburger menu
- [ ] Toggle menu ouvert/fermé
- [ ] Animation slide
- [ ] Responsive (affichage mobile seulement)
- [ ] Styling avec TailwindCSS

#### 4.7 Composant Footer
- [ ] Créer composant src/components/layout/Footer.tsx
- [ ] Créer sections (À propos, Liens, Contact)
- [ ] Ajouter informations légales
- [ ] Ajouter réseaux sociaux (icônes)
- [ ] Styling avec TailwindCSS
- [ ] Responsive design

### Phase 5 : Composants UI réutilisables
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

### Phase 6 : Page Catalog
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

### Phase 7 : Page Product
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
- [ ] Afficher prix unitaire
- [ ] Intégrer QuantitySelector
- [ ] Afficher prix total (prix × quantité)
- [ ] Bouton supprimer
- [ ] Styling avec TailwindCSS
- [ ] Responsive

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
- [ ] Afficher articles panier (map CartItem)
- [ ] Implémenter modification quantités (QuantitySelector)
- [ ] Implémenter suppression article
- [ ] Calculer et afficher total (CartSummary)
- [ ] Gérer état panier vide (EmptyCart)
- [ ] Gérer états loading (Loading component)
- [ ] Gérer états error (ErrorMessage component)
- [ ] Navigation vers Checkout au clic "Passer commande"
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
- [ ] Intégrer hook useCart pour récupérer panier
- [ ] Gérer state formulaire
- [ ] Implémenter validation formulaire
- [ ] Implémenter soumission formulaire
- [ ] Créer commande (service orders.createOrder)
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

### Phase 10 : Pages Vitrine
#### 10.1 Page Home - Structure
- [ ] Créer page src/pages/Home.tsx
- [ ] Intégrer Layout
- [ ] Créer sections (Hero, FeaturedCategories, FeaturedProducts, LocalAnchor)
- [ ] Styling de base avec TailwindCSS

#### 10.2 Composant HeroSection
- [ ] Créer composant src/components/home/HeroSection.tsx
- [ ] Image/vidéo hero
- [ ] Titre accrocheur
- [ ] Sous-titre présentation concept-store
- [ ] Bouton CTA "Découvrir"
- [ ] Styling premium + streetwear avec TailwindCSS
- [ ] Responsive

#### 10.3 Composant FeaturedCategories
- [ ] Créer composant src/components/home/FeaturedCategories.tsx
- [ ] Intégrer hook useCategories
- [ ] Afficher grille catégories (cartes)
- [ ] Lien vers Catalog avec filtre catégorie
- [ ] Images catégories
- [ ] Styling avec TailwindCSS
- [ ] Responsive

#### 10.4 Composant FeaturedProducts
- [ ] Créer composant src/components/home/FeaturedProducts.tsx
- [ ] Intégrer hook useProducts (limite 4-6 produits)
- [ ] Afficher grille produits (ProductCard)
- [ ] Titre section "Nouveautés" ou "Mise en avant"
- [ ] Lien "Voir tout" vers Catalog
- [ ] Styling avec TailwindCSS
- [ ] Responsive

#### 10.5 Composant LocalAnchor
- [ ] Créer composant src/components/home/LocalAnchor.tsx
- [ ] Section ancrage local (Marseille / Cassis / Sanary)
- [ ] Texte présentation
- [ ] Images lieux (optionnel)
- [ ] Lien vers page About
- [ ] Styling avec TailwindCSS
- [ ] Responsive

#### 10.6 Page Home - Finalisation
- [ ] Intégrer tous les composants
- [ ] Animer sections au scroll (optionnel)
- [ ] Styling complet premium + streetwear
- [ ] Responsive design complet
- [ ] Tester toutes les sections

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

#### 11.3 Performance - Bundle
- [ ] Analyser bundle size (vite-bundle-visualizer)
- [ ] Optimiser imports (tree-shaking)
- [ ] Vérifier dépendances inutiles
- [ ] Optimiser images (compression, formats modernes)

#### 11.4 SEO
- [ ] Installer react-helmet-async ou équivalent
- [ ] Ajouter meta tags (title, description) par page
- [ ] Ajouter Open Graph tags
- [ ] Ajouter Twitter Card tags
- [ ] Ajouter structured data (JSON-LD) si nécessaire
- [ ] Vérifier avec outils SEO

#### 11.5 Accessibilité
- [ ] Ajouter alt text sur toutes les images
- [ ] Vérifier contraste couleurs (WCAG AA)
- [ ] Vérifier navigation clavier (Tab, Enter, Escape)
- [ ] Ajouter ARIA labels où nécessaire
- [ ] Vérifier focus visible
- [ ] Tester avec lecteur d'écran

#### 11.6 Responsive & Mobile
- [ ] Vérifier toutes les pages sur mobile
- [ ] Tester breakpoints TailwindCSS (sm, md, lg, xl)
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
- [ ] Tests E2E (Playwright ou Cypress) - parcours utilisateur

#### 11.9 Documentation & Déploiement
- [ ] Mettre à jour README.md (setup, scripts, structure)
- [ ] Documenter variables d'environnement
- [ ] Préparer configuration production
- [ ] Optimiser build production
- [ ] Configurer CI/CD si nécessaire

