# 🔧 Backend - Documentation

## 📋 Vue d'ensemble

Backend API REST construite avec **NestJS** et **TypeORM**, connectée à une base de données **PostgreSQL** via Docker.

## 🛠️ Stack technique

- **Framework** : NestJS
- **ORM** : TypeORM
- **Base de données** : PostgreSQL
- **Containerisation** : Docker

## 📁 Structure du backend

```
backend/
├── src/
│   ├── modules/          # Modules NestJS
│   │   ├── products/     # Module produits
│   │   ├── categories/   # Module catégories
│   │   ├── cart/         # Module panier
│   │   └── orders/       # Module commandes
│   ├── entities/         # Entités TypeORM
│   ├── dto/              # Data Transfer Objects
│   ├── controllers/      # Controllers REST
│   ├── services/         # Services métier
│   └── main.ts          # Point d'entrée
├── docker-compose.yml
└── Dockerfile
```

## 🗄️ Modèles de données (à définir)

### Entités principales

#### Product (Produit)
- `id` : UUID
- `name` : string
- `description` : text
- `price` : decimal
- `categoryId` : relation
- `images` : array/relation
- `variants` : relation (Variants)
- `createdAt` : timestamp
- `updatedAt` : timestamp

#### Category (Catégorie)
- `id` : UUID
- `name` : string (Adult, Kids, Sneakers, etc.)
- `slug` : string
- `description` : text
- `imageUrl` : string (nullable) - URL de l'image de la catégorie
- `products` : relation (Products)
- `createdAt` : timestamp
- `updatedAt` : timestamp

#### Variant (Variante)
- `id` : UUID
- `productId` : relation
- `color` : string
- `size` : string
- `stock` : number
- `sku` : string
- `createdAt` : timestamp
- `updatedAt` : timestamp

#### Image (Image)
- `id` : UUID
- `productId` : relation
- `url` : string
- `alt` : string
- `order` : number
- `createdAt` : timestamp

#### Cart (Panier)
- `id` : UUID
- `sessionId` : string (ou userId si auth)
- `items` : relation (CartItem)
- `createdAt` : timestamp
- `updatedAt` : timestamp

#### CartItem (Article panier)
- `id` : UUID
- `cartId` : relation
- `variantId` : relation
- `quantity` : number
- `createdAt` : timestamp

#### Order (Commande)
- `id` : UUID
- `cartId` : relation
- `status` : enum
- `total` : decimal
- `customerInfo` : JSON
- `createdAt` : timestamp
- `updatedAt` : timestamp

## 🔌 Endpoints API

### Produits ✅
- `GET /products` : Liste des produits (avec filtres, pagination)
- `GET /products/:id` : Détails d'un produit
- `GET /products/category/:categoryId` : Produits par catégorie
- `POST /products` : Créer un produit
- `PATCH /products/:id` : Modifier un produit
- `DELETE /products/:id` : Supprimer un produit

### Variantes ✅
- `GET /products/:id/variants` : Liste des variantes d'un produit
- `GET /products/:productId/variants/:variantId` : Détails d'une variante
- `POST /products/:id/variants` : Créer une variante
- `PATCH /products/:productId/variants/:variantId` : Mettre à jour une variante
- `GET /products/:productId/variants/:variantId/stock?quantity=X` : Vérifier le stock disponible

### Images ✅
- `GET /products/:id/images` : Liste des images d'un produit
- `POST /products/:id/images` : Uploader une image (form-data : file, alt, order)
- `DELETE /products/:productId/images/:imageId` : Supprimer une image
- `PATCH /products/:productId/images/:imageId/order` : Mettre à jour l'ordre d'une image
- Les images sont accessibles via : `http://localhost:3001/uploads/{filename}`

### Catégories ✅
- `GET /categories` : Liste des catégories
- `GET /categories/:id` : Détails d'une catégorie
- `GET /categories/slug/:slug` : Détails d'une catégorie par slug
- `POST /categories` : Créer une catégorie
- `PATCH /categories/:id` : Modifier une catégorie
- `DELETE /categories/:id` : Supprimer une catégorie

### Panier ✅
- `GET /cart?sessionId=X` ou `GET /cart` avec header `X-Session-Id` : Récupérer le panier
- `POST /cart/items` : Ajouter un article au panier (body: {variantId, quantity})
- `PUT /cart/items/:id` : Modifier la quantité (body: {quantity})
- `DELETE /cart/items/:id` : Retirer un article
- `DELETE /cart?sessionId=X` : Vider le panier

### Commandes ✅
- `POST /orders` : Créer une commande depuis un panier (body: {cartId, customerInfo})
- `GET /orders/:id` : Détails d'une commande
- `GET /orders` : Liste de toutes les commandes
- `PATCH /orders/:id/status` : Mettre à jour le statut d'une commande (body: {status})

## 📊 État actuel

### Version : 0.24.0 - Phase 17.11.4 terminée ✅

**Statut** : ✅ Backend complet et production-ready - Tous les modules essentiels complétés, infrastructure Docker production configurée, monitoring & logs en place

#### ✅ Complété (Phase 1)
- Structure de base définie
- Configuration Docker (Dockerfile, docker-compose.yml)
- Projet NestJS initialisé avec toutes les dépendances
- Configuration TypeORM + PostgreSQL (connexion fonctionnelle)
- Configuration variables d'environnement (.env)
- ValidationPipe global et CORS configurés
- Structure de dossiers créée (modules, entities, dto, config, migrations)
- Services Docker opérationnels (backend, postgres, frontend)

#### ✅ Complété (Phase 2)
- Toutes les entités TypeORM créées :
  - Category (id, name, slug, description, timestamps)
  - Product (id, name, description, price, categoryId, timestamps)
  - Image (id, productId, url, alt, order, timestamps)
  - Variant (id, productId, color, size, stock, sku, timestamps)
  - Cart (id, sessionId, timestamps)
  - CartItem (id, cartId, variantId, quantity, timestamps)
  - Order (id, cartId, status, total, customerInfo, timestamps)
- Relations entre entités configurées (OneToMany, ManyToOne)
- Enum OrderStatus défini
- Tables créées automatiquement en base de données (7 tables)
- Clés étrangères et contraintes créées

#### 📋 À venir (Phases futures)
- Phase 10 : Architecture Multi-Shops (Shop entity, filtrage)
- Phase 11 : Authentification & Utilisateurs (JWT, rôles, profils)
- Phase 12 : Intégration Stripe (paiement, webhooks, remboursements)
- Phase 13 : Cloudinary (upload, optimisation, CDN)
- Phase 14 : Recherche Full-Text (PostgreSQL, suggestions)
- Phase 15 : Promotions & Codes Promo (réductions, flash sales)
- Phase 16 : Avis & Commentaires (notes, modération)
- Phase 17 : Gestion Stocks Avancée (historique, alertes)
- Phase 18 : Notifications & Emails (SMTP, WebSockets)
- Phase 19 : Analytics & Tracking (vues, ventes, dashboard)
- Phase 20 : Blog & Actualités (articles, carrousel)
- Phase 21 : Tests & Optimisations (Jest, Swagger, cache)

#### ✅ Complété (Phase 3 - Partiel)
- Module Catégories créé et opérationnel :
  - Module, Service, Controller créés
  - DTOs avec validation (CreateCategoryDto, UpdateCategoryDto)
  - Endpoints REST complets (CRUD + findBySlug)
  - Tests validés (création, récupération, recherche)

- Module Produits créé et opérationnel :
  - Module, Service, Controller créés
  - DTOs avec validation (CreateProductDto, UpdateProductDto, ProductQueryDto)
  - Endpoints REST complets (CRUD + findByCategory)
  - Pagination, filtres (category, price range, search), tri implémentés
  - Relations chargées automatiquement (category, images, variants)
  - Vérification existence catégorie avant création/modification
  - Tests validés (création, récupération, filtres, pagination, tri)

- Module Variantes créé et opérationnel (intégré dans Products) :
  - DTOs avec validation (CreateVariantDto, UpdateVariantDto)
  - Méthodes dans ProductsService (findVariantsByProduct, findVariantById, createVariant, updateVariant, checkStock, updateStock)
  - Endpoints REST complets :
    - GET /products/:id/variants (liste variantes d'un produit)
    - GET /products/:productId/variants/:variantId (détails variante)
    - POST /products/:id/variants (créer variante)
    - PATCH /products/:productId/variants/:variantId (mettre à jour variante)
    - GET /products/:productId/variants/:variantId/stock?quantity=X (vérifier stock)
  - Vérification unicité SKU
  - Gestion stock avec vérification disponibilité
  - Tests validés (création, récupération, vérification stock, mise à jour, validation SKU)

- Module Images créé et opérationnel (intégré dans Products) :
  - Configuration multer avec diskStorage (stockage local)
  - DTOs avec validation (CreateImageDto, UpdateImageOrderDto)
  - Méthodes dans ProductsService (findImagesByProduct, createImage, deleteImage, updateImageOrder)
  - Endpoints REST complets :
    - GET /products/:id/images (liste images d'un produit)
    - POST /products/:id/images (upload image avec form-data)
    - DELETE /products/:productId/images/:imageId (supprimer image + fichier)
    - PATCH /products/:productId/images/:imageId/order (mettre à jour ordre)
  - Configuration serveur fichiers statiques (main.ts)
  - Gestion suppression fichier physique lors delete
  - Conversion types form-data (order string → number)
  - Limites : 5MB max, formats jpg/jpeg/png/gif/webp
  - Tests validés (upload, récupération, suppression, mise à jour ordre)

- Module Checkout créé et opérationnel :
  - Module, Service, Controller créés
  - Intégration Stripe Checkout (solution hébergée)
  - Endpoints REST :
    - POST /checkout/create-session (créer session Stripe Checkout)
    - POST /checkout/webhook (recevoir webhooks Stripe)
  - Gestion guest checkout (userId nullable)
  - Enrichissement données produits (images, descriptions) sur Stripe
  - Extraction complète données client (adresses, téléphone) depuis Stripe
  - Workflow capture manuelle (PaymentIntent avec capture_method: 'manual')

- Module Panier créé et opérationnel :
  - Module, Service, Controller créés
  - DTOs avec validation (AddToCartDto, UpdateCartItemDto, CartResponseDto)
  - Méthodes dans CartService (getOrCreate, findOne, addItem, updateItem, removeItem, clear, calculateTotal)
  - Endpoints REST complets :
    - GET /cart (récupérer panier avec sessionId)
    - POST /cart/items (ajouter article au panier)
    - PUT /cart/items/:id (mettre à jour quantité)
    - DELETE /cart/items/:id (supprimer article)
    - DELETE /cart (vider panier)
  - Gestion sessionId via header X-Session-Id ou query param

- Module Email créé et opérationnel :
  - Service EmailService avec méthodes :
    - sendRegistrationConfirmation() : Email bienvenue nouveau client
    - sendOrderReceived() : Email réception commande (PENDING)
    - sendOrderConfirmation() : Email confirmation paiement (PAID)
    - sendShippingNotification() : Email expédition (SHIPPED)
    - sendOrderDelivered() : Email livraison (DELIVERED)
    - sendOrderCancelled() : Email annulation (CANCELLED/REFUNDED)
  - Support invités : Utilise customerInfo.email || user.email
  - Persistance BDD : Entité OrderEmail pour tracker tous les emails
  - Logging : Logger NestJS pour tous les événements
  - Gestion erreurs : Emails persistés même en cas d'échec (avec message erreur)
  - Templates Handlebars : registration-confirmation, order-received, order-confirmation, shipping-notification, order-delivered, order-cancelled

- Entité OrderEmail créée :
  - Tracking complet emails envoyés
  - Champs : orderId, emailType (enum), recipientEmail, subject, sent (bool), errorMessage, sentAt, createdAt
  - Types email : ORDER_RECEIVED, ORDER_CONFIRMED, ORDER_SHIPPED, ORDER_DELIVERED, ORDER_CANCELLED
  - Vérification stock avant ajout et mise à jour
  - Calcul total automatique avec prix des produits
  - Relations chargées automatiquement (variant, product, images)
  - Création automatique de panier si n'existe pas
  - Tests validés (ajout, récupération, mise à jour, suppression, vider panier)

- Module Commandes créé et opérationnel :
  - Module, Service, Controller créés
  - Entité Order avec statuts (PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED)
  - DTOs avec validation (CreateOrderDto, UpdateOrderStatusDto, OrderResponseDto)
  - Méthodes dans OrdersService :
    - create() : Créer commande depuis panier (avec vérification stock)
    - createFromStripeCheckout() : Créer commande depuis Stripe Checkout (PENDING)
    - capturePayment() : Capture manuelle paiement (admin) avec vérification stock
    - updateStatus() : Changer statut commande (avec gestion stock et emails)
    - cancelOrder() : Annuler commande (avec gestion stock)
    - refundOrder() : Rembourser commande (avec gestion stock)
    - findByUser() : Récupérer commandes d'un utilisateur
    - findOne() : Détails d'une commande
  - Endpoints REST :
    - POST /orders (créer depuis panier)
    - GET /orders/:id (détails)
    - GET /orders/user/:userId (commandes utilisateur)
    - PATCH /orders/:id/status (changer statut)
    - POST /orders/:id/capture (capture manuelle paiement - admin)
    - POST /orders/:id/cancel (annuler)
    - POST /orders/:id/refund (rembourser)
  - Gestion stock : Vérification avant capture, décrément après capture
  - Support guest checkout (userId nullable, customerInfo stocké dans Order)
  - Stockage items dans Order.items (JSONB) pour commandes Stripe Checkout
  - Workflow capture manuelle : PENDING → Admin vérifie stock → Capture → PAID
  - Module, Service, Controller créés
  - DTOs avec validation (CreateOrderDto avec nested validation, OrderResponseDto, UpdateOrderStatusDto)
  - Méthodes dans OrdersService (create, findOne, findAll, updateStatus)
  - Endpoints REST complets :
    - POST /orders (créer commande depuis panier)
    - GET /orders/:id (récupérer commande par ID)
    - GET /orders (récupérer toutes les commandes)
    - PATCH /orders/:id/status (mettre à jour statut)
  - Vérification stock avant création commande
  - Déduction stock automatique après création
  - Calcul total automatique depuis panier
  - Validation données client (email, adresse complète avec nested validation)
  - Gestion statuts (pending, confirmed, shipped, delivered, cancelled)
  - Relations chargées automatiquement (cart, items, variant, product)
  - Tests validés (création, récupération, mise à jour statut, vérification stock déduit)

#### ✅ Phase 3 terminée
- Tous les modules de la Phase 3 sont complétés et testés

#### 📋 À faire
- Création des modules NestJS restants (Products, Cart, Orders, Variants, Images)
- Implémentation des controllers
- Implémentation des services
- Création des DTOs
- Tests des endpoints
- Script de seed pour données de test

## 🗺️ Roadmap Backend

### Phase 1 : Setup & Configuration initiale ✅
#### 1.1 Configuration Docker
- [x] Créer Dockerfile pour backend NestJS
- [x] Configurer docker-compose.yml avec service backend
- [x] Configurer service PostgreSQL (port 5432, volumes, env vars)
- [x] Créer réseau Docker pour communication backend-db
- [x] Configurer variables d'environnement (.env)
- [x] Tester démarrage container backend
- [x] Tester connexion backend → PostgreSQL

#### 1.2 Initialisation projet NestJS
- [x] Initialiser projet NestJS (nest new backend)
- [x] Configurer package.json avec dépendances :
  - [x] @nestjs/core, @nestjs/common, @nestjs/platform-express
  - [x] @nestjs/typeorm, typeorm, pg
  - [x] @nestjs/config
  - [x] class-validator, class-transformer
- [x] Créer structure dossiers :
  - [x] src/modules/
  - [x] src/entities/
  - [x] src/dto/
  - [x] src/config/
- [x] Configurer tsconfig.json
- [x] Configurer .gitignore

#### 1.3 Configuration TypeORM
- [x] Installer @nestjs/typeorm et typeorm
- [x] Créer fichier config/database.config.ts
- [x] Configurer TypeORMModule dans app.module.ts
- [x] Configurer connexion PostgreSQL (host, port, database, username, password)
- [x] Configurer synchronisation automatique (dev) vs migrations (prod)
- [x] Tester connexion à PostgreSQL

#### 1.4 Configuration base de données
- [x] Créer base de données PostgreSQL
- [x] Configurer migrations TypeORM
- [x] Créer dossier migrations/
- [ ] Configurer script npm pour migrations (à faire plus tard)
- [x] Tester création table de test (synchronize activé en dev)

#### 1.5 Configuration globale
- [x] Configurer ValidationPipe global
- [x] Configurer CORS pour frontend
- [x] Configurer port depuis variables d'environnement
- [ ] Créer logger personnalisé si nécessaire (optionnel)
- [x] Tester démarrage serveur NestJS

### Phase 2 : Modèles de données - Entités de base ✅
#### 2.1 Entité Category
- [x] Créer entity Category dans src/entities/category.entity.ts
- [x] Définir colonnes : id (UUID, primary), name (string), slug (string, unique), description (text nullable), imageUrl (varchar 500 nullable), createdAt, updatedAt
- [x] Ajouter décorateurs TypeORM (@Entity, @PrimaryGeneratedColumn, @Column)
- [x] Définir relation OneToMany vers Products
- [x] Types TypeScript définis dans l'entité
- [x] Tester création table en base
- [x] Ajouter champ imageUrl pour afficher les images de catégories dans le frontend

#### 2.2 Entité Product
- [x] Créer entity Product dans src/entities/product.entity.ts
- [x] Définir colonnes : id (UUID), name (string), description (text), price (decimal), categoryId (UUID), createdAt, updatedAt
- [x] Ajouter décorateurs TypeORM
- [x] Définir relation ManyToOne vers Category
- [x] Définir relation OneToMany vers Images
- [x] Définir relation OneToMany vers Variants
- [x] Types TypeScript définis dans l'entité
- [x] Tester création table en base

#### 2.3 Entité Image
- [x] Créer entity Image dans src/entities/image.entity.ts
- [x] Définir colonnes : id (UUID), productId (UUID), url (string), alt (string), order (number), createdAt
- [x] Ajouter décorateurs TypeORM
- [x] Définir relation ManyToOne vers Product
- [x] Types TypeScript définis dans l'entité
- [x] Tester création table en base

#### 2.4 Entité Variant
- [x] Créer entity Variant dans src/entities/variant.entity.ts
- [x] Définir colonnes : id (UUID), productId (UUID), color (string), size (string), stock (number), sku (string, unique), createdAt, updatedAt
- [x] Ajouter décorateurs TypeORM
- [x] Définir relation ManyToOne vers Product
- [x] Types TypeScript définis dans l'entité
- [x] Tester création table en base

### Phase 3 : Modèles de données - Entités E-commerce ✅
#### 3.1 Entité Cart
- [x] Créer entity Cart dans src/entities/cart.entity.ts
- [x] Définir colonnes : id (UUID), sessionId (string), createdAt, updatedAt
- [x] Ajouter décorateurs TypeORM
- [x] Définir relation OneToMany vers CartItems
- [x] Types TypeScript définis dans l'entité
- [x] Tester création table en base

#### 3.2 Entité CartItem
- [x] Créer entity CartItem dans src/entities/cart-item.entity.ts
- [x] Définir colonnes : id (UUID), cartId (UUID), variantId (UUID), quantity (number), createdAt
- [x] Ajouter décorateurs TypeORM
- [x] Définir relation ManyToOne vers Cart
- [x] Définir relation ManyToOne vers Variant
- [x] Types TypeScript définis dans l'entité
- [x] Tester création table en base

#### 3.3 Entité Order
- [x] Créer entity Order dans src/entities/order.entity.ts
- [x] Définir colonnes : id (UUID), cartId (UUID), status (enum), total (decimal), customerInfo (JSONB), createdAt, updatedAt
- [x] Créer enum OrderStatus (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- [x] Ajouter décorateurs TypeORM
- [x] Définir relation ManyToOne vers Cart
- [x] Types TypeScript définis dans l'entité
- [x] Tester création table en base

#### 3.4 Relations & Migrations
- [x] Vérifier toutes les relations entre entités
- [x] Tables créées automatiquement avec synchronize (dev)
- [x] Vérifier tables créées en base (7 tables : categories, products, images, variants, carts, cart_items, orders)
- [x] Clés étrangères créées automatiquement
- [x] Tester relations avec requêtes TypeORM
- [ ] Générer migration initiale pour production (à faire plus tard)

#### 3.5 Seed données de test
- [ ] Créer script seed dans src/scripts/seed.ts
- [ ] Créer catégories de base (Adult, Kids, Sneakers)
- [ ] Créer produits de test avec images et variantes
- [ ] Exécuter seed
- [ ] Vérifier données en base

### Phase 4 : Module Catégories ✅
#### 4.1 Structure module
- [x] Créer module Categories (categories.module.ts)
- [x] Créer service Categories (categories.service.ts)
- [x] Créer controller Categories (categories.controller.ts)
- [x] Importer TypeOrmModule.forFeature([Category]) dans module
- [x] Enregistrer module dans AppModule

#### 4.2 DTOs Catégories
- [x] Créer CreateCategoryDto dans src/modules/categories/dto/create-category.dto.ts
- [x] Ajouter validation (name: string, slug: string, description?: string, imageUrl?: string)
- [x] Créer UpdateCategoryDto dans src/modules/categories/dto/update-category.dto.ts
- [x] Utiliser PartialType de @nestjs/mapped-types
- [x] Ajouter class-validator decorators (@IsString, @IsNotEmpty, @MaxLength, @IsOptional, etc.)
- [x] Ajouter validation imageUrl (optionnel, max 500 caractères)

#### 4.3 Service Categories
- [x] Implémenter findAll() : Promise<Category[]> (tri par nom)
- [x] Implémenter findOne(id: string) : Promise<Category>
- [x] Implémenter findBySlug(slug: string) : Promise<Category>
- [x] Implémenter create(dto: CreateCategoryDto) : Promise<Category>
- [x] Implémenter update(id: string, dto: UpdateCategoryDto) : Promise<Category>
- [x] Implémenter delete(id: string) : Promise<void>
- [x] Gérer erreurs (NotFoundException)

#### 4.4 Controller Categories
- [x] Créer endpoint POST /categories (create)
- [x] Créer endpoint GET /categories (findAll)
- [x] Créer endpoint GET /categories/:id (findOne)
- [x] Créer endpoint GET /categories/slug/:slug (findBySlug)
- [x] Créer endpoint PATCH /categories/:id (update)
- [x] Créer endpoint DELETE /categories/:id (delete)
- [x] Ajouter validation avec ValidationPipe (global)
- [x] Tester tous les endpoints (création, récupération, recherche par slug validés)

### Phase 5 : Module Produits ✅
#### 5.1 Structure module
- [x] Créer module Products (products.module.ts)
- [x] Créer service Products (products.service.ts)
- [x] Créer controller Products (products.controller.ts)
- [x] Importer TypeOrmModule.forFeature([Product, Image, Variant, Category]) dans module
- [x] Enregistrer module dans AppModule

#### 5.2 DTOs Produits
- [x] Créer CreateProductDto (name, description, price, categoryId)
- [x] Créer UpdateProductDto (partial de CreateProductDto avec PartialType)
- [x] Créer ProductQueryDto (pour filtres : category, minPrice, maxPrice, search, page, limit, sortBy, sortOrder)
- [x] Ajouter validation avec class-validator (@IsString, @IsNumber, @IsUUID, @Min, etc.)
- [x] Utiliser @Type(() => Number) pour transformation query params

#### 5.3 Service Products
- [x] Implémenter findAll(query: ProductQueryDto) : Promise<{products, total, page, limit, totalPages}>
- [x] Implémenter findOne(id: string) : Promise<Product> (avec relations category, images, variants)
- [x] Implémenter findByCategory(categoryId: string, query: ProductQueryDto) avec filtres
- [x] Implémenter create(dto: CreateProductDto) : Promise<Product> (vérifie existence catégorie)
- [x] Implémenter update(id: string, dto: UpdateProductDto) : Promise<Product> (vérifie existence catégorie si fournie)
- [x] Implémenter delete(id: string) : Promise<void>
- [x] Implémenter pagination (skip, take avec page et limit)
- [x] Implémenter filtres (category, price range avec Between, search avec ILike)
- [x] Implémenter tri (sortBy, sortOrder)
- [x] Gérer erreurs (NotFoundException)

#### 5.4 Controller Products
- [x] Créer endpoint POST /products (create)
- [x] Créer endpoint GET /products (findAll avec query params)
- [x] Créer endpoint GET /products/:id (findOne avec relations)
- [x] Créer endpoint GET /products/category/:categoryId (findByCategory avec query params)
- [x] Créer endpoint PATCH /products/:id (update)
- [x] Créer endpoint DELETE /products/:id (delete)
- [x] Ajouter validation avec ValidationPipe (global)
- [x] Tester tous les endpoints (création, récupération, filtres, pagination, tri validés)

### Phase 6 : Module Variantes ✅
#### 6.1 Structure module (ou intégration dans Products)
- [x] Décider : module séparé ou intégré dans Products (intégré dans Products)
- [x] Créer DTOs Variants (CreateVariantDto, UpdateVariantDto)
- [x] Créer service Variants (intégré dans ProductsService)
- [x] Créer endpoints Variants (intégré dans ProductsController)

#### 6.2 Service Variants
- [x] Implémenter findVariantsByProduct(productId: string) : Promise<Variant[]>
- [x] Implémenter findVariantById(id: string) : Promise<Variant>
- [x] Implémenter createVariant(productId: string, dto: CreateVariantDto) : Promise<Variant>
- [x] Implémenter updateVariant(id: string, dto: UpdateVariantDto) : Promise<Variant>
- [x] Implémenter checkStock(variantId: string, quantity: number) : Promise<{available, variantId, currentStock, requestedQuantity}>
- [x] Implémenter updateStock(variantId: string, quantity: number) : Promise<Variant>
- [x] Gérer erreurs (NotFoundException, BadRequestException pour SKU dupliqué)

#### 6.3 Controller Variants
- [x] Créer endpoint GET /products/:id/variants (liste variantes d'un produit)
- [x] Créer endpoint GET /products/:productId/variants/:variantId (détails variante)
- [x] Créer endpoint POST /products/:id/variants (créer variante)
- [x] Créer endpoint PATCH /products/:productId/variants/:variantId (mettre à jour variante)
- [x] Créer endpoint GET /products/:productId/variants/:variantId/stock?quantity=X (vérifier stock)
- [x] Tester endpoints (tous validés)

### Phase 7 : Module Images ✅
#### 7.1 Configuration upload
- [x] Installer multer ou @nestjs/platform-express (déjà inclus, @types/multer installé)
- [x] Configurer FileInterceptor dans controller
- [x] Créer configuration multer (multer.config.ts avec diskStorage)
- [x] Configurer stockage local (dossier uploads/)
- [x] Créer dossier uploads/ automatiquement si n'existe pas
- [x] Configurer limites (5MB max, formats images uniquement)

#### 7.2 Service Images
- [x] Créer DTOs (CreateImageDto avec @Type(() => Number) pour order, UpdateImageOrderDto)
- [x] Implémenter findImagesByProduct(productId: string) : Promise<Image[]>
- [x] Implémenter createImage(productId, file, dto) : Promise<Image> (avec génération nom unique)
- [x] Implémenter deleteImage(id: string) : Promise<void> (suppression fichier + DB)
- [x] Implémenter updateImageOrder(id, dto) : Promise<Image>
- [x] Gérer suppression fichier physique lors delete (unlinkSync)
- [x] Gérer conversion types form-data (order string → number dans controller)

#### 7.3 Controller Images
- [x] Créer endpoint GET /products/:id/images (liste images)
- [x] Créer endpoint POST /products/:id/images (upload avec form-data)
- [x] Créer endpoint DELETE /products/:productId/images/:imageId (supprimer)
- [x] Créer endpoint PATCH /products/:productId/images/:imageId/order (réordonnancement)
- [x] Configurer serveur fichiers statiques dans main.ts
- [x] Tester upload avec curl (validé)

### Phase 8 : Module Panier ✅
#### 8.1 Structure module
- [x] Créer module Cart (cart.module.ts)
- [x] Créer service Cart (cart.service.ts)
- [x] Créer controller Cart (cart.controller.ts)
- [x] Importer TypeOrmModule.forFeature([Cart, CartItem, Variant, Product]) dans module
- [x] Enregistrer module dans AppModule

#### 8.2 DTOs Panier
- [x] Créer AddToCartDto (variantId, quantity avec @Type(() => Number))
- [x] Créer UpdateCartItemDto (quantity avec @Type(() => Number))
- [x] Créer CartResponseDto (avec items, relations et total)
- [x] Ajouter validation (quantity > 0, variantId UUID, stock disponible)

#### 8.3 Service Cart
- [x] Implémenter getOrCreate(sessionId: string) : Promise<Cart>
- [x] Implémenter findOne(sessionId: string) : Promise<CartResponseDto> (avec relations)
- [x] Implémenter addItem(sessionId: string, dto: AddToCartDto) : Promise<CartItem>
- [x] Implémenter updateItem(itemId: string, dto: UpdateCartItemDto) : Promise<CartItem>
- [x] Implémenter removeItem(itemId: string) : Promise<void>
- [x] Implémenter clear(sessionId: string) : Promise<void>
- [x] Implémenter calculateTotal(cartId: string) : Promise<number>
- [x] Implémenter vérification stock avant addItem et updateItem
- [x] Gérer fusion articles existants (même variantId)
- [x] Gérer erreurs (stock insuffisant, variant introuvable, NotFoundException, BadRequestException)

#### 8.4 Controller Cart
- [x] Créer endpoint GET /cart (getOrCreate avec sessionId)
- [x] Créer endpoint POST /cart/items (addItem)
- [x] Créer endpoint PUT /cart/items/:id (updateItem)
- [x] Créer endpoint DELETE /cart/items/:id (removeItem)
- [x] Créer endpoint DELETE /cart (clear)
- [x] Gérer sessionId (header X-Session-Id ou query param sessionId)
- [x] Génération automatique sessionId si non fourni (pour tests)
- [x] Ajouter validation avec ValidationPipe (global)
- [x] Tester tous les endpoints avec curl (tous validés)

### Phase 9 : Module Commandes ✅
#### 9.1 Structure module
- [x] Créer module Orders (orders.module.ts)
- [x] Créer service Orders (orders.service.ts)
- [x] Créer controller Orders (orders.controller.ts)
- [x] Importer TypeOrmModule.forFeature([Order, Cart, CartItem, Variant, Product]) dans module
- [x] Enregistrer module dans AppModule

#### 9.2 DTOs Commandes
- [x] Créer CreateOrderDto (cartId, customerInfo avec nested validation)
- [x] Créer OrderResponseDto (avec relations cart, items, variant, product)
- [x] Créer UpdateOrderStatusDto (status avec enum validation)
- [x] Ajouter validation complète (email valide avec @IsEmail, adresse complète avec nested validation, champs requis)

#### 9.3 Service Orders
- [x] Implémenter create(dto: CreateOrderDto) : Promise<OrderResponseDto>
- [x] Implémenter findOne(id: string) : Promise<OrderResponseDto>
- [x] Implémenter findAll() : Promise<OrderResponseDto[]>
- [x] Implémenter updateStatus(id: string, dto: UpdateOrderStatusDto) : Promise<OrderResponseDto>
- [x] Implémenter calculTotal depuis cart (somme prix × quantité)
- [x] Implémenter vérification stock avant création commande (tous les articles)
- [x] Implémenter déduction stock après création commande (pour chaque variante)
- [x] Vérifier panier non vide avant création
- [x] Gérer erreurs (NotFoundException, BadRequestException pour panier vide, stock insuffisant)

#### 9.4 Controller Orders
- [x] Créer endpoint POST /orders (create)
- [x] Créer endpoint GET /orders/:id (findOne)
- [x] Créer endpoint GET /orders (findAll)
- [x] Créer endpoint PATCH /orders/:id/status (updateStatus)
- [x] Ajouter validation avec ValidationPipe (global)
- [x] Tester tous les endpoints avec curl (tous validés : création, récupération, mise à jour statut, vérification stock déduit)

### Phase 10 : Architecture Multi-Shops
#### 10.1 Entité Shop
- [ ] Créer entité Shop (id, name, slug, description, isFranchise, createdAt, updatedAt)
- [ ] Définir shops initiaux (Reboul Adult, Reboul Kids, Reboul Sneakers, C.P.COMPANY)
- [ ] Ajouter relation Product → Shop (ManyToOne)
- [ ] Ajouter relation Category → Shop (ManyToOne)
- [ ] Migrer données existantes vers shop par défaut
- [ ] Tester relations multi-shops

#### 10.2 Service Shops
- [ ] Créer module Shops
- [ ] Créer service Shops (findAll, findOne, findBySlug)
- [ ] Créer controller Shops avec endpoints :
  - [ ] GET /shops (liste shops)
  - [ ] GET /shops/:id (détails shop)
  - [ ] GET /shops/slug/:slug (par slug)
- [ ] Tester endpoints

#### 10.3 Filtrage par Shop
- [ ] Modifier ProductsService pour filtrer par shopId
- [ ] Modifier CategoriesService pour filtrer par shopId
- [ ] Ajouter shopId dans ProductQueryDto
- [ ] Ajouter shopId dans CategoryQueryDto
- [ ] Tester filtrage multi-shops

### Phase 11 : Authentification & Utilisateurs
#### 11.1 Entités Auth
- [ ] Créer entité User (id, email, password, firstName, lastName, role, createdAt, updatedAt)
- [ ] Créer enum UserRole (ADMIN, CLIENT)
- [ ] Créer entité UserProfile (id, userId, phone, address, city, postalCode, country, createdAt, updatedAt)
- [ ] Configurer relation User → UserProfile (OneToOne)
- [ ] Configurer relation User → Orders (OneToMany)
- [ ] Hasher mots de passe (bcrypt)
- [ ] Tester création tables

#### 11.2 Module Auth
- [ ] Installer @nestjs/jwt, @nestjs/passport, passport, passport-jwt, passport-google-oauth20, passport-apple, bcrypt
- [ ] Créer module Auth
- [ ] Créer DTOs (RegisterDto, LoginDto, ChangePasswordDto, ResetPasswordDto, OAuthDto)
- [ ] Créer service Auth (register, login, validateUser, generateToken, resetPassword, verifyResetToken)
- [ ] Implémenter OAuth Google (passport-google-oauth20)
- [ ] Implémenter OAuth Apple (passport-apple)
- [ ] Créer JWT strategy (passport-jwt)
- [ ] Créer guards (JwtAuthGuard, RolesGuard, OptionalAuthGuard pour guest checkout)
- [ ] Créer decorators (@CurrentUser, @Roles)
- [ ] Créer service SMS (Twilio ou équivalent) pour reset password
- [ ] Créer controller Auth avec endpoints :
  - [ ] POST /auth/register (inscription)
  - [ ] POST /auth/login (connexion email/password)
  - [ ] POST /auth/google (OAuth Google)
  - [ ] POST /auth/apple (OAuth Apple)
  - [ ] GET /auth/me (profil utilisateur)
  - [ ] POST /auth/change-password (changer mot de passe)
  - [ ] POST /auth/forgot-password (demander reset - email ou SMS)
  - [ ] POST /auth/reset-password (réinitialiser avec token)
- [ ] Gérer commande en guest (sessionId sans authentification)
- [ ] Tester endpoints

#### 11.3 Module Users
- [ ] Créer module Users
- [ ] Créer service Users (findAll, findOne, update, delete)
- [ ] Créer controller Users avec endpoints :
  - [ ] GET /users (liste - admin only)
  - [ ] GET /users/:id (détails - admin ou own)
  - [ ] PATCH /users/:id (modifier - admin ou own)
  - [ ] DELETE /users/:id (supprimer - admin only)
- [ ] Protéger endpoints avec guards
- [ ] Tester endpoints

#### 11.4 Profils Utilisateurs
- [ ] Créer module UserProfiles
- [ ] Créer service UserProfiles (findOne, update)
- [ ] Créer controller UserProfiles avec endpoints :
  - [ ] GET /users/:id/profile (profil)
  - [ ] PATCH /users/:id/profile (modifier profil)
- [ ] Historique commandes dans profil
- [ ] Tester endpoints

### Phase 12 : Intégration Stripe & Stripe Connect
#### 12.1 Configuration Stripe
- [ ] Installer stripe, @stripe/stripe-js
- [ ] Configurer clés API Stripe (variables d'environnement)
- [ ] Configurer Stripe Connect (comptes connectés pour chaque shop)
- [ ] Créer entité StripeAccount (id, shopId, accountId, isActive)
- [ ] Créer module Payments
- [ ] Créer service Stripe (createPaymentIntent, confirmPayment, refundPayment)
- [ ] Créer service StripeConnect (createConnectedAccount, getAccount, transferFunds)
- [ ] Configurer webhooks Stripe
- [ ] Configurer devises (EUR, USD)

#### 12.2 Service Payments
- [ ] Créer DTOs (CreatePaymentDto, RefundPaymentDto, CreatePaymentIntentDto avec currency)
- [ ] Implémenter createPaymentIntent(orderId, amount, currency, shopId)
- [ ] Implémenter confirmPayment(paymentIntentId) - capture à la confirmation commande
- [ ] Implémenter refundPayment(paymentId, amount) - via n8n ou manuel
- [ ] Implémenter répartition Stripe Connect (transfer vers compte shop approprié)
- [ ] Gérer multi-devises (EUR, USD)
- [ ] Gérer erreurs Stripe
- [ ] Logger transactions

#### 12.3 Controller Payments
- [ ] Créer controller Payments avec endpoints :
  - [ ] POST /payments/intent (créer payment intent)
  - [ ] POST /payments/confirm (confirmer paiement)
  - [ ] POST /payments/:id/refund (remboursement)
- [ ] Protéger endpoints (authentifié)
- [ ] Tester avec Stripe test mode

#### 12.4 Webhooks Stripe
- [ ] Créer endpoint POST /payments/webhook
- [ ] Vérifier signature webhook
- [ ] Gérer événements (payment.succeeded, payment.failed, charge.refunded)
- [ ] Mettre à jour statut commande automatiquement
- [ ] Tester webhooks

#### 12.5 Intégration Commandes
- [ ] Modifier OrdersService pour intégrer Stripe
- [ ] Créer payment intent lors création commande (avec shopId pour Stripe Connect)
- [ ] Capturer paiement quand commande passe de PENDING → CONFIRMED
- [ ] Répartir paiement vers compte Stripe approprié (Stripe Connect)
- [ ] Mettre à jour statut commande selon paiement
- [ ] Gérer remboursements (automatisation n8n ou manuel admin)
- [ ] Gérer commandes multi-shops (répartir paiement par shop)
- [ ] Tester flux complet

### Phase 13 : Cloudinary - Gestion Images
#### 13.1 Configuration Cloudinary
- [ ] Installer cloudinary, @cloudinary/url-gen
- [ ] Configurer credentials Cloudinary (variables d'environnement)
- [ ] Créer service CloudinaryService
- [ ] Configurer upload (format, qualité, transformations)

#### 13.2 Migration Images
- [ ] Modifier ProductsService pour utiliser Cloudinary
- [ ] Implémenter upload vers Cloudinary (remplacer multer local)
- [ ] Limiter à 7 images maximum par produit
- [ ] Valider formats (JPG, PNG, WebP)
- [ ] Configurer dimensions recommandées (1200x1200px)
- [ ] Implémenter suppression depuis Cloudinary
- [ ] Configurer transformations automatiques (resize, optimize)
- [ ] Générer URLs optimisées (CDN inclus)
- [ ] Migrer images existantes vers Cloudinary (script)

#### 13.3 Optimisations Images
- [ ] Configurer formats modernes (WebP, AVIF)
- [ ] Configurer responsive images (sizes multiples)
- [ ] Configurer lazy loading URLs
- [ ] Tester optimisations

### Phase 14 : Recherche Full-Text
#### 14.1 Configuration PostgreSQL Full-Text
- [ ] Activer extension pg_trgm (similarité)
- [ ] Créer index GIN sur colonnes recherche (name, description)
- [ ] Configurer recherche full-text PostgreSQL

#### 14.2 Service Recherche
- [ ] Créer module Search
- [ ] Créer DTOs (SearchQueryDto avec query, shopId, filters)
- [ ] Créer service Search (searchProducts, searchCategories)
- [ ] Implémenter recherche avec ILike et pg_trgm
- [ ] Implémenter suggestions de recherche (top résultats)
- [ ] Implémenter recherche par marque, matériau (si ajoutés)

#### 14.3 Controller Recherche
- [ ] Créer controller Search avec endpoints :
  - [ ] GET /search/products?q=query (recherche produits)
  - [ ] GET /search/suggestions?q=query (suggestions)
- [ ] Tester recherche

### Phase 15 : Promotions & Codes Promo
#### 15.1 Entités Promotions
- [ ] Créer entité Promotion (id, code, type, value, minAmount, maxUses, usedCount, startDate, endDate, shopId, createdAt, updatedAt)
- [ ] Créer enum PromotionType (PERCENTAGE, FIXED_AMOUNT)
- [ ] Créer entité PromotionUsage (id, promotionId, userId, orderId, createdAt)
- [ ] Configurer relations (Promotion → Shop, PromotionUsage → Promotion, User, Order)
- [ ] Tester création tables

#### 15.2 Service Promotions
- [ ] Créer module Promotions
- [ ] Créer DTOs (CreatePromotionDto, ApplyPromotionDto)
- [ ] Créer service Promotions (create, findAll, findOne, findByCode, applyPromotion, validatePromotion)
- [ ] Implémenter validation (dates, limites, montant minimum)
- [ ] Implémenter codes promo uniques par utilisateur (un seul usage par user)
- [ ] Implémenter flash sales (durée 24h/48h)
- [ ] Implémenter calcul réduction
- [ ] Implémenter tracking usage (PromotionUsage entity)
- [ ] Gérer cumulabilité avec autres promotions (à définir)

#### 15.3 Controller Promotions
- [ ] Créer controller Promotions avec endpoints :
  - [ ] POST /promotions (créer - admin only)
  - [ ] GET /promotions (liste - admin only)
  - [ ] GET /promotions/:id (détails)
  - [ ] POST /promotions/apply (appliquer code promo)
  - [ ] PATCH /promotions/:id (modifier - admin only)
  - [ ] DELETE /promotions/:id (supprimer - admin only)
- [ ] Protéger endpoints admin
- [ ] Tester endpoints

#### 15.4 Intégration Panier & Commandes
- [ ] Modifier CartService pour appliquer promotions
- [ ] Modifier OrdersService pour appliquer promotions
- [ ] Calculer total avec réduction
- [ ] Enregistrer promotion utilisée dans commande
- [ ] Tester flux complet

#### 15.5 Promotions Produits/Catégories
- [ ] Ajouter champ discountPrice dans Product
- [ ] Ajouter champ discountPercentage dans Product
- [ ] Ajouter champ isOnSale dans Product
- [ ] Implémenter promotions par produit
- [ ] Implémenter promotions par catégorie
- [ ] Tester promotions produits

### Phase 16 : Avis & Commentaires
#### 16.1 Entités Reviews
- [ ] Créer entité Review (id, productId, userId, rating, comment, isApproved, createdAt, updatedAt)
- [ ] Créer enum ReviewStatus (PENDING, APPROVED, REJECTED)
- [ ] Configurer relations (Review → Product, Review → User)
- [ ] Ajouter champ averageRating dans Product
- [ ] Ajouter champ reviewCount dans Product
- [ ] Tester création tables

#### 16.2 Service Reviews
- [ ] Créer module Reviews
- [ ] Créer DTOs (CreateReviewDto, UpdateReviewDto, ReviewQueryDto)
- [ ] Créer service Reviews (create, findAll, findOne, findByProduct, approve, reject, calculateAverageRating)
- [ ] Implémenter validation (rating 1-5, un seul avis par utilisateur/produit)
- [ ] Implémenter auto-publication (isApproved = true par défaut, pas de modération)
- [ ] Implémenter avis ouverts à tous (pas besoin d'achat)
- [ ] Pas de photos dans les avis
- [ ] Implémenter calcul moyenne et comptage

#### 16.3 Controller Reviews
- [ ] Créer controller Reviews avec endpoints :
  - [ ] POST /reviews (créer - authentifié)
  - [ ] GET /reviews (liste avec filtres)
  - [ ] GET /reviews/product/:productId (avis d'un produit)
  - [ ] GET /reviews/:id (détails)
  - [ ] PATCH /reviews/:id (modifier - own ou admin)
  - [ ] PATCH /reviews/:id/approve (approuver - admin only)
  - [ ] PATCH /reviews/:id/reject (rejeter - admin only)
  - [ ] DELETE /reviews/:id (supprimer - own ou admin)
- [ ] Protéger endpoints
- [ ] Tester endpoints

#### 16.4 Mise à jour Produits
- [ ] Modifier ProductsService pour charger reviews
- [ ] Calculer averageRating et reviewCount automatiquement
- [ ] Afficher reviews dans GET /products/:id
- [ ] Tester intégration

### Phase 17 : Gestion Stocks Avancée
#### 17.1 Entité StockMovement
- [ ] Créer entité StockMovement (id, variantId, type, quantity, reason, userId, createdAt)
- [ ] Créer enum StockMovementType (IN, OUT, ADJUSTMENT, RETURN)
- [ ] Configurer relation StockMovement → Variant
- [ ] Tester création table

#### 17.2 Service Stock
- [ ] Créer module Stock
- [ ] Créer service Stock (recordMovement, getHistory, getLowStockAlerts)
- [ ] Implémenter enregistrement mouvements (vente, retour, ajustement)
- [ ] Implémenter historique mouvements
- [ ] Implémenter alertes stock faible (seuil = 5 unités par défaut)
- [ ] Implémenter notifications email admin lors alerte
- [ ] Implémenter notifications dashboard temps réel (WebSockets)

#### 17.3 Controller Stock
- [ ] Créer controller Stock avec endpoints :
  - [ ] GET /stock/variants/:id/history (historique)
  - [ ] GET /stock/alerts (alertes stock faible - admin)
  - [ ] POST /stock/adjust (ajustement manuel - admin)
- [ ] Protéger endpoints admin
- [ ] Tester endpoints

#### 17.4 Intégration Commandes
- [ ] Enregistrer mouvement OUT lors création commande
- [ ] Enregistrer mouvement IN lors retour/annulation
- [ ] Vérifier alertes après chaque mouvement
- [ ] Tester intégration

### Phase 18 : Notifications & Emails
#### 18.1 Configuration Email
- [ ] Installer @nestjs-modules/mailer, nodemailer
- [ ] Configurer SMTP (variables d'environnement)
- [ ] Créer templates email (Handlebars ou EJS)
- [ ] Créer service EmailService

#### 18.2 Templates Email
- [ ] Créer template confirmation commande
- [ ] Créer template suivi livraison
- [ ] Créer template confirmation paiement
- [ ] Créer template annulation commande
- [ ] Créer template bienvenue (inscription)
- [ ] Créer template réinitialisation mot de passe

#### 18.3 Service Notifications
- [ ] Créer module Notifications
- [ ] Créer service Notifications (sendOrderConfirmation, sendShippingUpdate, sendPaymentConfirmation)
- [ ] Implémenter envoi emails
- [ ] Gérer erreurs envoi
- [ ] Logger envois

#### 18.4 Intégration Commandes
- [ ] Envoyer email confirmation lors création commande
- [ ] Envoyer email lors mise à jour statut (shipped, delivered)
- [ ] Envoyer email lors paiement confirmé
- [ ] Tester envois

#### 18.5 WebSockets (Notifications Temps Réel)
- [ ] Installer @nestjs/websockets, socket.io
- [ ] Créer module NotificationsGateway
- [ ] Configurer WebSocket server
- [ ] Implémenter notifications temps réel (nouvelle commande, stock faible, etc.)
- [ ] Tester WebSockets

### Phase 19 : Analytics & Tracking
#### 19.1 Entités Analytics
- [ ] Créer entité ProductView (id, productId, userId, ipAddress, createdAt)
- [ ] Créer entité SaleAnalytics (id, productId, variantId, quantity, revenue, orderId, createdAt)
- [ ] Configurer relations
- [ ] Tester création tables

#### 19.2 Service Analytics
- [ ] Créer module Analytics
- [ ] Créer service Analytics (trackProductView, trackSale, getProductViews, getSalesStats, getPopularProducts)
- [ ] Implémenter tracking vues produits
- [ ] Implémenter tracking ventes
- [ ] Implémenter statistiques (revenus, produits populaires, tendances)

#### 19.3 Controller Analytics
- [ ] Créer controller Analytics avec endpoints :
  - [ ] POST /analytics/track/view (tracker vue produit)
  - [ ] GET /analytics/products/popular (produits populaires)
  - [ ] GET /analytics/sales/stats (statistiques ventes - admin)
  - [ ] GET /analytics/products/:id/views (vues d'un produit - admin)
- [ ] Protéger endpoints admin
- [ ] Tester endpoints

#### 19.4 Dashboard Admin
- [ ] Créer endpoints dashboard :
  - [ ] GET /analytics/dashboard (stats globales)
  - [ ] GET /analytics/revenue (revenus par période)
  - [ ] GET /analytics/products/top (top produits)
- [ ] Tester dashboard

### Phase 20 : Blog & Actualités
#### 20.1 Entités Blog
- [ ] Créer entité Article (id, title, slug, content, excerpt, imageUrl, authorId, publishedAt, createdAt, updatedAt)
- [ ] Créer entité ArticleCategory (id, name, slug, description)
- [ ] Configurer relations (Article → User, Article → ArticleCategory)
- [ ] Tester création tables

#### 20.2 Service Blog
- [ ] Créer module Blog
- [ ] Créer DTOs (CreateArticleDto, UpdateArticleDto, ArticleQueryDto)
- [ ] Créer service Blog (create, findAll, findOne, findBySlug, update, delete)
- [ ] Restreindre création/modification aux admins uniquement
- [ ] Implémenter catégories d'articles (à définir : Actualités, Collections, Événements, etc.)
- [ ] Implémenter commentaires sur articles (à définir si activé)
- [ ] Implémenter pagination
- [ ] Implémenter recherche

#### 20.3 Controller Blog
- [ ] Créer controller Blog avec endpoints :
  - [ ] POST /blog/articles (créer - admin)
  - [ ] GET /blog/articles (liste avec pagination)
  - [ ] GET /blog/articles/:id (détails)
  - [ ] GET /blog/articles/slug/:slug (par slug)
  - [ ] PATCH /blog/articles/:id (modifier - admin)
  - [ ] DELETE /blog/articles/:id (supprimer - admin)
- [ ] Protéger endpoints admin
- [ ] Tester endpoints

### Phase 21 : Tests & Optimisations
#### 21.1 Tests unitaires
- [ ] Configurer Jest pour tests
- [ ] Tests unitaires CategoriesService
- [ ] Tests unitaires ProductsService
- [ ] Tests unitaires CartService
- [ ] Tests unitaires OrdersService
- [ ] Couverture de code > 80%

#### 21.2 Tests d'intégration
- [ ] Configurer tests d'intégration (Test.createTestingModule)
- [ ] Tests endpoints Categories
- [ ] Tests endpoints Products
- [ ] Tests endpoints Cart
- [ ] Tests endpoints Orders
- [ ] Tests avec base de données de test

#### 21.3 Optimisations
- [ ] Optimiser requêtes TypeORM (select spécifiques, relations eager/lazy)
- [ ] Ajouter index base de données (categoryId, productId, sessionId, shopId)
- [ ] Implémenter cache si nécessaire (Redis optionnel - à évaluer selon performance)
- [ ] Optimiser pagination
- [ ] Analyser requêtes lentes
- [ ] Optimiser images (lazy loading, formats modernes WebP/AVIF)

#### 21.4 Validation & Gestion erreurs
- [ ] Vérifier toutes les validations DTOs
- [ ] Créer filtres d'exception global
- [ ] Créer format d'erreur standardisé
- [ ] Gérer erreurs base de données
- [ ] Logger erreurs

#### 21.5 Documentation API
- [ ] Installer @nestjs/swagger
- [ ] Configurer SwaggerModule
- [ ] Ajouter décorateurs @ApiTags, @ApiOperation, @ApiResponse
- [ ] Documenter tous les endpoints
- [ ] Tester documentation Swagger

### Phase 22 : Back-Office & Administration
#### 22.1 Structure Back-Office
- [ ] Créer frontend admin séparé (dossier `admin/`)
- [ ] Configurer sous-domaine `admin.reboulstore.com`
- [ ] Installer GeistUI pour composants UI admin
- [ ] Connecter au même backend (API partagée)
- [ ] Configurer authentification admin (JWT avec rôle ADMIN)

#### 22.2 Dashboard Admin
- [ ] Créer page Dashboard avec statistiques :
  - [ ] Ventes (revenus, nombre commandes)
  - [ ] Produits populaires
  - [ ] Revenus par période
  - [ ] Alertes stock faible
- [ ] Implémenter graphiques (chart.js ou équivalent)
- [ ] Implémenter filtres par période
- [ ] Tester dashboard

#### 22.3 Gestion Produits (Admin)
- [ ] Créer interface CRUD produits
- [ ] Implémenter import CSV/Excel (produits en masse)
- [ ] Implémenter export CSV/Excel (produits, commandes)
- [ ] Implémenter édition formulaire classique
- [ ] Implémenter édition inline (tableau)
- [ ] Gérer upload images Cloudinary (max 7)
- [ ] Tester import/export

#### 22.4 Gestion Commandes (Admin)
- [ ] Créer interface liste commandes
- [ ] Implémenter filtres (statut, date, shop)
- [ ] Implémenter export CSV/Excel
- [ ] Implémenter modification statut
- [ ] Implémenter gestion remboursements
- [ ] Tester interface

#### 22.5 Gestion Stocks (Admin)
- [ ] Créer interface gestion stocks
- [ ] Afficher alertes stock faible (seuil 5)
- [ ] Implémenter ajustements manuels
- [ ] Afficher historique mouvements
- [ ] Tester interface

#### 22.6 Gestion Promotions (Admin)
- [ ] Créer interface CRUD promotions
- [ ] Implémenter création codes promo
- [ ] Implémenter création flash sales
- [ ] Afficher statistiques usage
- [ ] Tester interface

#### 22.7 Gestion Avis (Admin)
- [ ] Créer interface modération avis (si nécessaire)
- [ ] Afficher avis en attente (si modération activée)
- [ ] Implémenter suppression avis
- [ ] Tester interface

#### 22.8 Gestion Blog (Admin)
- [ ] Créer interface CRUD articles
- [ ] Implémenter éditeur de texte riche
- [ ] Gérer catégories articles
- [ ] Gérer commentaires (si activés)
- [ ] Tester interface

---

## 🐳 Phase 17.11 : Docker & Déploiement Production Ready ✅

### 17.11.1 Docker Compose Production ✅
- [x] `docker-compose.prod.yml` créé (Reboul + Admin)
- [x] Services PostgreSQL avec volumes persistants
- [x] Services Backend (NestJS production build)
- [x] Services Frontend (Vite build + Nginx)
- [x] Nginx reverse proxy configuré
- [x] Réseaux Docker partagés (reboulstore-network)
- [x] Dockerfile.prod pour tous les services
- [x] Health check endpoints (`/health`)

### 17.11.2 Configuration Nginx ✅
- [x] `nginx.prod.conf` créé (compression, cache, security headers)
- [x] Routage `reboulstore.com` → Frontend Reboul
- [x] Routage `admin.reboulstore.com` → Admin Centrale
- [x] Routage `/api` → Backend (reverse proxy)
- [x] SSL/TLS préparé (Let's Encrypt)
- [x] Support React Router (SPA)

### 17.11.3 Scripts Déploiement ✅
- [x] `deploy-reboul.sh` (build + démarrage)
- [x] `backup-db.sh` (backup PostgreSQL avec rotation)
- [x] `rollback.sh` (retour version précédente)
- [x] `deploy-admin.sh` (déploiement Admin)
- [x] Documentation `DEPLOY_PRODUCTION.md`

### 17.11.4 Monitoring & Logs ✅
- [x] Logger NestJS configuré (niveaux selon environnement)
- [x] Configuration Winston préparée (optionnel)
- [x] Health check endpoints améliorés (`/health` avec uptime, version, environment)
- [x] Configuration Sentry préparée (optionnel)
- [x] Script `monitor-uptime.sh` créé
- [x] Documentation complète (`MONITORING.md`)

### 17.11.5 Achat & Configuration Serveur OVH 🔄
- [ ] Acheter serveur OVH
- [ ] Configuration initiale (Docker, firewall, utilisateur)
- [ ] Configuration DNS
- [ ] Préparation déploiement

