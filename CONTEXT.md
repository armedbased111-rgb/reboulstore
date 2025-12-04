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
- [ ] Créer docker-compose.yml à la racine
- [ ] Configurer service PostgreSQL (port, volumes, variables d'environnement)
- [ ] Configurer service backend NestJS (port, dépendances, volumes)
- [ ] Configurer service frontend React (port, volumes)
- [ ] Créer réseau Docker pour communication entre services
- [ ] Tester démarrage des 3 services simultanément

#### 1.2 Setup Backend NestJS
- [ ] Initialiser projet NestJS dans backend/
- [ ] Configurer package.json avec dépendances (NestJS, TypeORM, PostgreSQL, etc.)
- [ ] Créer structure de dossiers (modules, entities, dto, controllers, services)
- [ ] Configurer TypeORM dans app.module.ts
- [ ] Créer fichier .env pour variables d'environnement backend
- [ ] Configurer connexion PostgreSQL via TypeORM
- [ ] Tester connexion à la base de données

#### 1.3 Setup Frontend React + Vite
- [ ] Initialiser projet Vite + React + TypeScript dans frontend/
- [ ] Configurer package.json avec dépendances (React, Vite, TailwindCSS, React Router, etc.)
- [ ] Créer structure de dossiers (pages, components, services, hooks, types, utils)
- [ ] Configurer TailwindCSS (tailwind.config.js, postcss.config.js)
- [ ] Configurer React Router pour routing
- [ ] Créer fichier .env pour variables d'environnement frontend
- [ ] Configurer proxy API vers backend
- [ ] Tester build et dev server

#### 1.4 Configuration TypeORM + PostgreSQL
- [ ] Définir schéma de base de données initial
- [ ] Configurer migrations TypeORM
- [ ] Créer script de seed pour données de test
- [ ] Configurer synchronisation automatique (dev) vs migrations (prod)
- [ ] Tester création de tables

#### 1.5 Configuration TailwindCSS
- [ ] Installer et configurer TailwindCSS
- [ ] Définir thème personnalisé (couleurs premium/streetwear)
- [ ] Créer variables CSS personnalisées
- [ ] Configurer plugins Tailwind (forms, typography, etc.)
- [ ] Créer classes utilitaires personnalisées
- [ ] Tester compilation CSS

### Phase 2 : Backend - Modèles de données & Entités
#### 2.1 Entités de base
- [ ] Créer entité Category (id, name, slug, description, timestamps)
- [ ] Créer entité Product (id, name, description, price, categoryId, timestamps)
- [ ] Créer entité Image (id, productId, url, alt, order, timestamps)
- [ ] Créer entité Variant (id, productId, color, size, stock, sku, timestamps)
- [ ] Définir types TypeScript pour chaque entité

#### 2.2 Relations entre entités
- [ ] Configurer relation Category → Products (OneToMany)
- [ ] Configurer relation Product → Images (OneToMany)
- [ ] Configurer relation Product → Variants (OneToMany)
- [ ] Configurer relations inverses (ManyToOne)
- [ ] Tester relations avec requêtes TypeORM

#### 2.3 Entités E-commerce
- [ ] Créer entité Cart (id, sessionId, timestamps)
- [ ] Créer entité CartItem (id, cartId, variantId, quantity, timestamps)
- [ ] Créer entité Order (id, cartId, status, total, customerInfo, timestamps)
- [ ] Configurer relation Cart → CartItems (OneToMany)
- [ ] Configurer relation CartItem → Variant (ManyToOne)
- [ ] Configurer relation Order → Cart (ManyToOne)
- [ ] Définir enum OrderStatus

#### 2.4 Migrations & Base de données
- [ ] Générer migration initiale pour toutes les entités
- [ ] Créer script de seed pour catégories de base
- [ ] Créer script de seed pour produits de test
- [ ] Tester migrations (up/down)
- [ ] Vérifier intégrité des données

### Phase 3 : Backend - API REST (Modules & Endpoints)
#### 3.1 Module Catégories
- [ ] Créer module Categories
- [ ] Créer DTOs (CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto)
- [ ] Créer service Categories (findAll, findOne, create, update, delete)
- [ ] Créer controller Categories avec endpoints GET /categories
- [ ] Créer endpoint GET /categories/:id
- [ ] Ajouter validation avec class-validator
- [ ] Tester endpoints avec Postman/Thunder Client

#### 3.2 Module Produits
- [ ] Créer module Products
- [ ] Créer DTOs (CreateProductDto, UpdateProductDto, ProductResponseDto)
- [ ] Créer service Products (findAll, findOne, findByCategory, create, update, delete)
- [ ] Créer controller Products avec endpoint GET /products
- [ ] Implémenter pagination (page, limit)
- [ ] Implémenter filtres (category, price range, search)
- [ ] Créer endpoint GET /products/:id avec relations (images, variants, category)
- [ ] Créer endpoint GET /products/category/:categoryId
- [ ] Ajouter validation avec class-validator
- [ ] Tester endpoints avec Postman/Thunder Client

#### 3.3 Module Variantes
- [ ] Créer module Variants (ou intégrer dans Products)
- [ ] Créer DTOs pour variantes
- [ ] Créer service pour gestion stock
- [ ] Créer endpoint GET /products/:id/variants
- [ ] Implémenter vérification stock disponible
- [ ] Tester endpoints

#### 3.4 Module Images
- [ ] Créer module Images (ou intégrer dans Products)
- [ ] Configurer upload de fichiers (multer ou équivalent)
- [ ] Créer service pour gestion upload
- [ ] Créer endpoint POST /products/:id/images
- [ ] Créer endpoint DELETE /images/:id
- [ ] Configurer stockage images (local ou cloud)
- [ ] Tester upload et affichage

#### 3.5 Module Panier
- [ ] Créer module Cart
- [ ] Créer DTOs (AddToCartDto, UpdateCartItemDto, CartResponseDto)
- [ ] Créer service Cart (getOrCreate, addItem, updateItem, removeItem, clear)
- [ ] Implémenter gestion session panier (sessionId)
- [ ] Créer endpoint GET /cart
- [ ] Créer endpoint POST /cart/items
- [ ] Créer endpoint PUT /cart/items/:id
- [ ] Créer endpoint DELETE /cart/items/:id
- [ ] Créer endpoint DELETE /cart
- [ ] Ajouter validation stock avant ajout
- [ ] Tester endpoints avec Postman/Thunder Client

#### 3.6 Module Commandes
- [ ] Créer module Orders
- [ ] Créer DTOs (CreateOrderDto, OrderResponseDto)
- [ ] Créer service Orders (create, findOne, findAll)
- [ ] Créer endpoint POST /orders
- [ ] Créer endpoint GET /orders/:id
- [ ] Implémenter création commande depuis panier
- [ ] Implémenter calcul total
- [ ] Ajouter validation données client
- [ ] Tester endpoints

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

