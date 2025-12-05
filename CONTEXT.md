# 🏪 Reboul Store - Contexte du Projet

## 📋 Vue d'ensemble

**Reboul Store** est un site e-commerce français spécialisé dans la vente de vêtements, sneakers et accessoires pour adultes et enfants. C'est un concept-store positionné sur la mode premium / streetwear, avec un ton moderne et lifestyle.

### Positionnement
- **Secteur** : Mode premium / streetwear
- **Cible** : Adultes et enfants
- **Ancrage local** : Sud de la France (Marseille / Cassis / Sanary)
- **Univers visuel** : Premium + streetwear

## 🎯 Objectif de la refonte

Refonte complète from scratch avec une nouvelle architecture moderne, mieux organisée et scalable pour :

- ✅ Offrir une expérience utilisateur plus fluide
- ✅ Mieux structurer le catalogue et les catégories
- ✅ Mieux gérer les fiches produits (variantes, tailles, photos, descriptions)
- ✅ Moderniser l'esthétique et la lisibilité
- ✅ Améliorer la performance et la cohérence globale du site
- ✅ Séparer clairement la partie vitrine, la partie catalogue, et la partie e-commerce

## 🛍️ Fonctionnalités principales

### Navigation & Catalogue
- Navigation dans un catalogue multi-catégories :
  - **Adult** : Vêtements et accessoires pour adultes
  - **Kids** : Vêtements et accessoires pour enfants
  - **Sneakers** : Chaussures de sport
  - **Vêtements / Accessoires** : Autres catégories

### Fiches Produits
- Affichage complet des produits :
  - Galerie de photos multiples
  - Variantes (couleurs, styles)
  - Gestion des tailles
  - Descriptions détaillées
  - Prix

### E-commerce
- **Parcours utilisateur** :
  1. Navigation dans le catalogue
  2. Consultation de la fiche produit
  3. Choix taille/couleur
  4. Ajout au panier
  5. Checkout et paiement

### Vitrine Marque
- Présentation du concept-store
- Ancrage local (Marseille / Cassis / Sanary)
- Univers visuel premium + streetwear

## 🏗️ Architecture technique

### Stack Backend
- **Framework** : NestJS
- **ORM** : TypeORM
- **Containerisation** : Docker

### Base de données
- **SGBD** : PostgreSQL
- **Containerisation** : Docker

### Stack Frontend
- **Build tool** : Vite
- **Framework** : React (TypeScript)
- **Styling** : TailwindCSS
- **Containerisation** : Docker

## 📁 Structure du projet

```
reboulstore/
├── backend/          # API NestJS + TypeORM
├── frontend/         # Application React + Vite + TailwindCSS
├── docker/           # Configuration Docker
└── CONTEXT.md        # Ce fichier
```

## 🗺️ Roadmap générale

### Phase 1 : Setup & Architecture de base
#### 1.1 Configuration Docker globale
- [x] Créer docker-compose.yml à la racine
- [x] Configurer service PostgreSQL (port, volumes, variables d'environnement)
- [x] Configurer service backend NestJS (port, dépendances, volumes)
- [x] Configurer service frontend React (port, volumes)
- [x] Créer réseau Docker pour communication entre services
- [x] Tester démarrage des 3 services simultanément

#### 1.2 Setup Backend NestJS
- [x] Initialiser projet NestJS dans backend/
- [x] Configurer package.json avec dépendances (NestJS, TypeORM, PostgreSQL, etc.)
- [x] Créer structure de dossiers (modules, entities, dto, config)
- [x] Configurer TypeORM dans app.module.ts
- [x] Créer fichier .env pour variables d'environnement backend
- [x] Configurer connexion PostgreSQL via TypeORM
- [x] Créer Dockerfile pour backend
- [x] Configurer ValidationPipe global et CORS
- [x] Tester connexion à la base de données

#### 1.3 Setup Frontend React + Vite
- [x] Initialiser projet Vite + React + TypeScript dans frontend/
- [x] Configurer package.json avec dépendances (React, Vite, TailwindCSS, React Router, etc.)
- [x] Créer structure de dossiers (pages, components, services, hooks, types, utils)
- [x] Configurer TailwindCSS (index.css avec @import tailwindcss, postcss.config.js)
- [x] Configurer React Router pour routing
- [x] Créer fichier .env pour variables d'environnement frontend
- [x] Créer Dockerfile pour frontend
- [x] Configurer Vite pour Docker (host 0.0.0.0, port 3000)
- [x] Tester build et dev server

#### 1.4 Configuration TypeORM + PostgreSQL
- [x] Configurer synchronisation automatique (dev) vs migrations (prod)
- [x] Configurer migrations TypeORM (dossier migrations créé)
- [ ] Définir schéma de base de données initial (à faire avec les entités)
- [ ] Créer script de seed pour données de test
- [x] Tester création de tables (synchronize activé en dev)

#### 1.5 Configuration TailwindCSS
- [x] Installer et configurer TailwindCSS (v4)
- [x] Définir thème personnalisé (couleurs premium/streetwear)
- [x] Créer variables CSS personnalisées
- [ ] Configurer plugins Tailwind (forms, typography, etc.) - à faire si nécessaire
- [ ] Créer classes utilitaires personnalisées - à faire si nécessaire
- [x] Tester compilation CSS

### Phase 2 : Backend - Modèles de données & Entités ✅
#### 2.1 Entités de base
- [x] Créer entité Category (id, name, slug, description, timestamps)
- [x] Créer entité Product (id, name, description, price, categoryId, timestamps)
- [x] Créer entité Image (id, productId, url, alt, order, timestamps)
- [x] Créer entité Variant (id, productId, color, size, stock, sku, timestamps)
- [x] Définir types TypeScript pour chaque entité

#### 2.2 Relations entre entités
- [x] Configurer relation Category → Products (OneToMany)
- [x] Configurer relation Product → Images (OneToMany)
- [x] Configurer relation Product → Variants (OneToMany)
- [x] Configurer relations inverses (ManyToOne)
- [x] Tester relations avec requêtes TypeORM (tables créées avec clés étrangères)

#### 2.3 Entités E-commerce
- [x] Créer entité Cart (id, sessionId, timestamps)
- [x] Créer entité CartItem (id, cartId, variantId, quantity, timestamps)
- [x] Créer entité Order (id, cartId, status, total, customerInfo, timestamps)
- [x] Configurer relation Cart → CartItems (OneToMany)
- [x] Configurer relation CartItem → Variant (ManyToOne)
- [x] Configurer relation Order → Cart (ManyToOne)
- [x] Définir enum OrderStatus

#### 2.4 Migrations & Base de données
- [x] Synchronisation automatique activée (dev) - tables créées automatiquement
- [x] Toutes les tables créées en base de données (7 tables : categories, products, images, variants, carts, cart_items, orders)
- [x] Vérifier intégrité des données (clés étrangères créées)
- [ ] Créer script de seed pour catégories de base (à faire plus tard)
- [ ] Créer script de seed pour produits de test (à faire plus tard)
- [ ] Générer migration initiale pour production (à faire plus tard)

### Phase 3 : Backend - API REST (Modules & Endpoints)
#### 3.1 Module Catégories ✅
- [x] Créer module Categories
- [x] Créer DTOs (CreateCategoryDto, UpdateCategoryDto)
- [x] Créer service Categories (findAll, findOne, findBySlug, create, update, delete)
- [x] Créer controller Categories avec endpoints :
  - [x] POST /categories (créer)
  - [x] GET /categories (liste)
  - [x] GET /categories/:id (par ID)
  - [x] GET /categories/slug/:slug (par slug)
  - [x] PATCH /categories/:id (modifier)
  - [x] DELETE /categories/:id (supprimer)
- [x] Ajouter validation avec class-validator
- [x] Enregistrer module dans AppModule
- [x] Tester endpoints (création, récupération, recherche par slug)

#### 3.2 Module Produits ✅
- [x] Créer module Products
- [x] Créer DTOs (CreateProductDto, UpdateProductDto, ProductQueryDto)
- [x] Créer service Products (findAll, findOne, findByCategory, create, update, delete)
- [x] Créer controller Products avec endpoints :
  - [x] POST /products (créer)
  - [x] GET /products (liste avec filtres et pagination)
  - [x] GET /products/:id (par ID avec relations)
  - [x] GET /products/category/:categoryId (par catégorie)
  - [x] PATCH /products/:id (modifier)
  - [x] DELETE /products/:id (supprimer)
- [x] Implémenter pagination (page, limit, totalPages)
- [x] Implémenter filtres (category, price range, search)
- [x] Implémenter tri (sortBy, sortOrder)
- [x] Charger relations automatiquement (category, images, variants)
- [x] Vérifier existence catégorie avant création/modification
- [x] Ajouter validation avec class-validator
- [x] Enregistrer module dans AppModule
- [x] Tester endpoints (création, récupération, filtres, pagination validés)

#### 3.3 Module Variantes ✅
- [x] Créer module Variants (intégré dans Products)
- [x] Créer DTOs (CreateVariantDto, UpdateVariantDto)
- [x] Créer service Variants (intégré dans ProductsService) :
  - [x] findVariantsByProduct(productId)
  - [x] findVariantById(id)
  - [x] createVariant(productId, dto)
  - [x] updateVariant(id, dto)
  - [x] checkStock(variantId, quantity)
  - [x] updateStock(variantId, quantity)
- [x] Créer controller Variants (intégré dans ProductsController) avec endpoints :
  - [x] GET /products/:id/variants (liste variantes d'un produit)
  - [x] GET /products/:productId/variants/:variantId (détails variante)
  - [x] POST /products/:id/variants (créer variante)
  - [x] PATCH /products/:productId/variants/:variantId (mettre à jour variante)
  - [x] GET /products/:productId/variants/:variantId/stock?quantity=X (vérifier stock)
- [x] Implémenter vérification unicité SKU
- [x] Implémenter vérification stock disponible (retourne objet avec available, currentStock, requestedQuantity)
- [x] Ajouter validation avec class-validator
- [x] Tester endpoints (création, récupération, vérification stock, mise à jour, validation SKU validés)

#### 3.4 Module Images ✅
- [x] Créer module Images (intégré dans Products)
- [x] Configurer upload de fichiers (multer avec diskStorage)
- [x] Créer service pour gestion upload (intégré dans ProductsService)
- [x] Créer DTOs (CreateImageDto, UpdateImageOrderDto)
- [x] Créer endpoints Images (intégré dans ProductsController) :
  - [x] GET /products/:id/images (liste images d'un produit)
  - [x] POST /products/:id/images (upload image)
  - [x] DELETE /products/:productId/images/:imageId (supprimer image)
  - [x] PATCH /products/:productId/images/:imageId/order (mettre à jour ordre)
- [x] Configurer stockage images (local : dossier uploads/)
- [x] Configurer serveur fichiers statiques (main.ts)
- [x] Implémenter suppression fichier physique lors delete
- [x] Gérer conversion types form-data (order string → number)
- [x] Tester upload et affichage (validé avec curl)

#### 3.5 Module Panier ✅
- [x] Créer module Cart
- [x] Créer DTOs (AddToCartDto, UpdateCartItemDto, CartResponseDto)
- [x] Créer service Cart (getOrCreate, findOne, addItem, updateItem, removeItem, clear, calculateTotal)
- [x] Implémenter gestion session panier (sessionId via header X-Session-Id ou query param)
- [x] Créer controller Cart avec endpoints :
  - [x] GET /cart (récupérer panier)
  - [x] POST /cart/items (ajouter article)
  - [x] PUT /cart/items/:id (mettre à jour quantité)
  - [x] DELETE /cart/items/:id (supprimer article)
  - [x] DELETE /cart (vider panier)
- [x] Implémenter vérification stock avant ajout et mise à jour
- [x] Implémenter calcul total automatique
- [x] Charger relations (variant, product, images) dans les réponses
- [x] Gérer création automatique de panier si n'existe pas
- [x] Tester endpoints avec curl (tous validés)

#### 3.6 Module Commandes ✅
- [x] Créer module Orders
- [x] Créer DTOs (CreateOrderDto, OrderResponseDto, UpdateOrderStatusDto)
- [x] Créer service Orders (create, findOne, findAll, updateStatus)
- [x] Créer controller Orders avec endpoints :
  - [x] POST /orders (créer commande depuis panier)
  - [x] GET /orders/:id (récupérer commande par ID)
  - [x] GET /orders (récupérer toutes les commandes)
  - [x] PATCH /orders/:id/status (mettre à jour statut)
- [x] Implémenter création commande depuis panier
- [x] Implémenter vérification stock avant création
- [x] Implémenter déduction stock après création
- [x] Implémenter calcul total automatique
- [x] Ajouter validation données client (email, adresse complète)
- [x] Charger relations (cart, items, variant, product) dans les réponses
- [x] Gérer statuts de commande (pending, confirmed, shipped, delivered, cancelled)
- [x] Tester endpoints (création, récupération, mise à jour statut, vérification stock validés)

### Phase 4 : Frontend - Infrastructure & Services
#### 4.1 Configuration API Client
- [ ] Créer service api.ts (client HTTP avec axios ou fetch)
- [ ] Configurer base URL depuis variables d'environnement
- [ ] Configurer intercepteurs (request/response)
- [ ] Implémenter gestion erreurs centralisée
- [ ] Implémenter gestion loading states
- [ ] Créer types TypeScript pour réponses API

#### 4.2 Services API métier
- [ ] Créer service products.ts (getProducts, getProduct, getProductsByCategory)
- [ ] Créer service categories.ts (getCategories, getCategory)
- [ ] Créer service cart.ts (getCart, addToCart, updateCartItem, removeCartItem, clearCart)
- [ ] Créer service orders.ts (createOrder, getOrder)
- [ ] Implémenter gestion erreurs par service
- [ ] Tester chaque service avec backend

#### 4.3 Custom Hooks
- [ ] Créer hook useProducts (fetch, loading, error)
- [ ] Créer hook useProduct (fetch by id, loading, error)
- [ ] Créer hook useCategories (fetch, loading, error)
- [ ] Créer hook useCart (state, actions)
- [ ] Créer hook useLocalStorage (persistence)
- [ ] Tester chaque hook

#### 4.4 Types TypeScript
- [ ] Définir types Product, Category, Variant, Image
- [ ] Définir types Cart, CartItem, Order
- [ ] Définir types pour DTOs (CreateProductDto, etc.)
- [ ] Définir types pour réponses API
- [ ] Créer fichier types/index.ts centralisé

### Phase 5 : Frontend - Layout & Navigation
#### 5.1 Composants Layout de base
- [ ] Créer composant Layout.tsx (wrapper principal)
- [ ] Créer composant Header.tsx (structure de base)
- [ ] Créer composant Footer.tsx (structure de base)
- [ ] Intégrer Header et Footer dans Layout
- [ ] Configurer routing dans App.tsx

#### 5.2 Header - Navigation
- [ ] Ajouter logo Reboul Store
- [ ] Créer composant Navigation avec liens (Home, Catalog, About)
- [ ] Implémenter menu catégories (dropdown)
- [ ] Créer composant CartIcon avec badge quantité
- [ ] Ajouter responsive menu (mobile hamburger)
- [ ] Styling avec TailwindCSS (premium/streetwear)

#### 5.3 Footer
- [ ] Ajouter sections (À propos, Liens, Contact)
- [ ] Ajouter informations légales
- [ ] Ajouter réseaux sociaux
- [ ] Styling avec TailwindCSS

#### 5.4 Routing
- [ ] Configurer React Router avec toutes les routes
- [ ] Créer composant ProtectedRoute si nécessaire
- [ ] Implémenter navigation programmatique
- [ ] Tester toutes les routes

### Phase 6 : Frontend - Pages Catalogue & Produits
#### 6.1 Page Catalog - Structure
- [ ] Créer page Catalog.tsx
- [ ] Créer layout avec sidebar filtres et grille produits
- [ ] Intégrer Header et Footer via Layout
- [ ] Styling de base avec TailwindCSS

#### 6.2 Composants Catalogue
- [ ] Créer composant ProductCard.tsx (image, nom, prix, lien)
- [ ] Créer composant FilterSidebar.tsx (filtres catégories)
- [ ] Créer composant ProductGrid.tsx (grille de ProductCard)
- [ ] Créer composant Pagination.tsx
- [ ] Créer composant SortSelector.tsx (tri par prix, nouveauté)

#### 6.3 Page Catalog - Fonctionnalités
- [ ] Intégrer hook useProducts
- [ ] Implémenter affichage liste produits
- [ ] Implémenter filtres par catégorie
- [ ] Implémenter recherche (si nécessaire)
- [ ] Implémenter tri (prix, nouveauté)
- [ ] Implémenter pagination
- [ ] Gérer états loading et error
- [ ] Styling complet avec TailwindCSS

#### 6.4 Page Product - Structure
- [ ] Créer page Product.tsx
- [ ] Créer layout avec galerie images et infos produit
- [ ] Intégrer Header et Footer via Layout
- [ ] Styling de base avec TailwindCSS

#### 6.5 Composants Fiche Produit
- [ ] Créer composant ProductGallery.tsx (carrousel ou grille images)
- [ ] Créer composant ProductInfo.tsx (nom, description, prix)
- [ ] Créer composant VariantSelector.tsx (couleur, taille)
- [ ] Créer composant AddToCartButton.tsx
- [ ] Créer composant StockIndicator.tsx (affichage stock)

#### 6.6 Page Product - Fonctionnalités
- [ ] Intégrer hook useProduct avec id depuis URL
- [ ] Implémenter affichage galerie images
- [ ] Implémenter affichage informations produit
- [ ] Implémenter sélection variantes (couleur, taille)
- [ ] Implémenter vérification stock selon variante
- [ ] Implémenter ajout au panier
- [ ] Implémenter produits similaires
- [ ] Gérer états loading et error
- [ ] Styling complet avec TailwindCSS

### Phase 7 : Frontend - Panier & Checkout
#### 7.1 Page Cart - Structure
- [ ] Créer page Cart.tsx
- [ ] Créer layout avec liste articles et récapitulatif
- [ ] Intégrer Header et Footer via Layout
- [ ] Styling de base avec TailwindCSS

#### 7.2 Composants Panier
- [ ] Créer composant CartItem.tsx (image, infos, quantité, prix)
- [ ] Créer composant CartSummary.tsx (sous-total, total, bouton checkout)
- [ ] Créer composant EmptyCart.tsx (panier vide)
- [ ] Créer composant QuantitySelector.tsx (+/-)

#### 7.3 Page Cart - Fonctionnalités
- [ ] Intégrer hook useCart
- [ ] Implémenter affichage articles panier
- [ ] Implémenter modification quantités
- [ ] Implémenter suppression article
- [ ] Implémenter calcul total
- [ ] Implémenter bouton "Continuer les achats"
- [ ] Implémenter bouton "Passer commande"
- [ ] Gérer état panier vide
- [ ] Styling complet avec TailwindCSS

#### 7.4 Page Checkout - Structure
- [ ] Créer page Checkout.tsx
- [ ] Créer layout avec formulaire et récapitulatif
- [ ] Intégrer Header et Footer via Layout
- [ ] Styling de base avec TailwindCSS

#### 7.5 Composants Checkout
- [ ] Créer composant CheckoutForm.tsx (formulaire livraison)
- [ ] Créer composant OrderSummary.tsx (récapitulatif commande)
- [ ] Créer composant PaymentSection.tsx (section paiement)
- [ ] Créer composant FormField.tsx (champ formulaire réutilisable)

#### 7.6 Page Checkout - Fonctionnalités
- [ ] Intégrer hook useCart pour récupérer panier
- [ ] Implémenter formulaire livraison (validation)
- [ ] Implémenter affichage récapitulatif commande
- [ ] Implémenter validation formulaire
- [ ] Implémenter création commande (POST /orders)
- [ ] Implémenter page confirmation commande
- [ ] Gérer états loading et error
- [ ] Styling complet avec TailwindCSS

### Phase 8 : Frontend - Pages Vitrine
#### 8.1 Page Home
- [ ] Créer page Home.tsx
- [ ] Créer composant HeroSection.tsx (présentation concept-store)
- [ ] Créer composant FeaturedCategories.tsx (catégories mises en avant)
- [ ] Créer composant FeaturedProducts.tsx (produits mis en avant)
- [ ] Créer composant LocalAnchor.tsx (ancrage local Marseille/Cassis/Sanary)
- [ ] Intégrer tous les composants
- [ ] Styling premium + streetwear avec TailwindCSS
- [ ] Responsive design

#### 8.2 Page About
- [ ] Créer page About.tsx
- [ ] Créer composant BrandStory.tsx (histoire marque)
- [ ] Créer composant ConceptSection.tsx (présentation concept-store)
- [ ] Créer composant LocationSection.tsx (ancrage local)
- [ ] Créer composant ContactSection.tsx (contact)
- [ ] Intégrer tous les composants
- [ ] Styling avec TailwindCSS
- [ ] Responsive design

### Phase 9 : Frontend - Composants UI réutilisables
#### 9.1 Composants de base
- [ ] Créer composant Button.tsx (variants, sizes, states)
- [ ] Créer composant Input.tsx (text, email, tel, etc.)
- [ ] Créer composant Select.tsx (dropdown)
- [ ] Créer composant Modal.tsx (modal générique)
- [ ] Créer composant Loading.tsx (spinner, skeleton)
- [ ] Créer composant ErrorMessage.tsx (affichage erreurs)

#### 9.2 Styling & Thème
- [ ] Définir palette couleurs premium/streetwear
- [ ] Créer composants avec variants TailwindCSS
- [ ] Implémenter dark mode (si nécessaire)
- [ ] Tester cohérence visuelle globale

### Phase 10 : Optimisations & Finitions
#### 10.1 Performance Frontend
- [ ] Implémenter lazy loading images
- [ ] Implémenter code splitting (React.lazy)
- [ ] Optimiser bundle size
- [ ] Implémenter memoization (React.memo, useMemo)
- [ ] Optimiser re-renders

#### 10.2 Performance Backend
- [ ] Optimiser requêtes TypeORM (relations, select)
- [ ] Implémenter cache si nécessaire
- [ ] Optimiser endpoints avec pagination
- [ ] Ajouter index base de données

#### 10.3 SEO & Accessibilité
- [ ] Ajouter meta tags (title, description)
- [ ] Implémenter Open Graph tags
- [ ] Ajouter alt text sur toutes les images
- [ ] Vérifier accessibilité clavier
- [ ] Vérifier contraste couleurs
- [ ] Ajouter ARIA labels

#### 10.4 Tests
- [ ] Tests unitaires backend (services)
- [ ] Tests d'intégration backend (endpoints)
- [ ] Tests unitaires frontend (composants)
- [ ] Tests E2E (parcours utilisateur)

#### 10.5 Responsive & Mobile
- [ ] Vérifier responsive toutes les pages
- [ ] Optimiser expérience mobile
- [ ] Tester sur différents devices
- [ ] Ajuster breakpoints TailwindCSS

#### 10.6 Documentation & Déploiement
- [ ] Documenter API (Swagger/OpenAPI)
- [ ] Mettre à jour README.md
- [ ] Préparer configuration production
- [ ] Configurer CI/CD (si nécessaire)

## 📝 Notes importantes

- Architecture pensée pour évoluer (nouveaux produits, collections, catégories)
- Code propre, organisé, extensible
- Séparation claire des responsabilités (vitrine / catalogue / e-commerce)

