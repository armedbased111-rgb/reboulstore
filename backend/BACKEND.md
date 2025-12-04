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

## 🔌 Endpoints API (à implémenter)

### Produits
- `GET /api/products` : Liste des produits (avec filtres, pagination)
- `GET /api/products/:id` : Détails d'un produit
- `GET /api/products/category/:categoryId` : Produits par catégorie

### Catégories
- `GET /api/categories` : Liste des catégories
- `GET /api/categories/:id` : Détails d'une catégorie

### Panier
- `GET /api/cart` : Récupérer le panier
- `POST /api/cart/items` : Ajouter un article au panier
- `PUT /api/cart/items/:id` : Modifier la quantité
- `DELETE /api/cart/items/:id` : Retirer un article
- `DELETE /api/cart` : Vider le panier

### Commandes
- `POST /api/orders` : Créer une commande
- `GET /api/orders/:id` : Détails d'une commande

## 📊 État actuel

### Version : 0.1.0 - Phase initiale

**Statut** : 🟡 En cours de setup

#### ✅ Complété
- Structure de base définie

#### 🚧 En cours
- Configuration Docker
- Configuration NestJS
- Configuration TypeORM + PostgreSQL

#### 📋 À faire
- Création des entités TypeORM
- Création des modules NestJS
- Implémentation des controllers
- Implémentation des services
- Tests des endpoints

## 🗺️ Roadmap Backend

### Phase 1 : Setup & Configuration initiale
#### 1.1 Configuration Docker
- [ ] Créer Dockerfile pour backend NestJS
- [ ] Configurer docker-compose.yml avec service backend
- [ ] Configurer service PostgreSQL (port 5432, volumes, env vars)
- [ ] Créer réseau Docker pour communication backend-db
- [ ] Configurer variables d'environnement (.env)
- [ ] Tester démarrage container backend
- [ ] Tester connexion backend → PostgreSQL

#### 1.2 Initialisation projet NestJS
- [ ] Initialiser projet NestJS (nest new backend)
- [ ] Configurer package.json avec dépendances :
  - [ ] @nestjs/core, @nestjs/common, @nestjs/platform-express
  - [ ] @nestjs/typeorm, typeorm, pg
  - [ ] @nestjs/config
  - [ ] class-validator, class-transformer
  - [ ] uuid
- [ ] Créer structure dossiers :
  - [ ] src/modules/
  - [ ] src/entities/
  - [ ] src/dto/
  - [ ] src/config/
- [ ] Configurer tsconfig.json
- [ ] Configurer .gitignore

#### 1.3 Configuration TypeORM
- [ ] Installer @nestjs/typeorm et typeorm
- [ ] Créer fichier config/database.config.ts
- [ ] Configurer TypeORMModule dans app.module.ts
- [ ] Configurer connexion PostgreSQL (host, port, database, username, password)
- [ ] Configurer synchronisation automatique (dev) vs migrations (prod)
- [ ] Tester connexion à PostgreSQL

#### 1.4 Configuration base de données
- [ ] Créer base de données PostgreSQL
- [ ] Configurer migrations TypeORM
- [ ] Créer dossier migrations/
- [ ] Configurer script npm pour migrations
- [ ] Tester création table de test

#### 1.5 Configuration globale
- [ ] Configurer ValidationPipe global
- [ ] Configurer CORS pour frontend
- [ ] Configurer port depuis variables d'environnement
- [ ] Créer logger personnalisé si nécessaire
- [ ] Tester démarrage serveur NestJS

### Phase 2 : Modèles de données - Entités de base
#### 2.1 Entité Category
- [ ] Créer entity Category dans src/entities/category.entity.ts
- [ ] Définir colonnes : id (UUID, primary), name (string), slug (string, unique), description (text nullable), createdAt, updatedAt
- [ ] Ajouter décorateurs TypeORM (@Entity, @PrimaryGeneratedColumn, @Column)
- [ ] Définir relation OneToMany vers Products
- [ ] Créer interface TypeScript Category
- [ ] Tester création table en base

#### 2.2 Entité Product
- [ ] Créer entity Product dans src/entities/product.entity.ts
- [ ] Définir colonnes : id (UUID), name (string), description (text), price (decimal), categoryId (UUID), createdAt, updatedAt
- [ ] Ajouter décorateurs TypeORM
- [ ] Définir relation ManyToOne vers Category
- [ ] Définir relation OneToMany vers Images
- [ ] Définir relation OneToMany vers Variants
- [ ] Créer interface TypeScript Product
- [ ] Tester création table en base

#### 2.3 Entité Image
- [ ] Créer entity Image dans src/entities/image.entity.ts
- [ ] Définir colonnes : id (UUID), productId (UUID), url (string), alt (string), order (number), createdAt
- [ ] Ajouter décorateurs TypeORM
- [ ] Définir relation ManyToOne vers Product
- [ ] Créer interface TypeScript Image
- [ ] Tester création table en base

#### 2.4 Entité Variant
- [ ] Créer entity Variant dans src/entities/variant.entity.ts
- [ ] Définir colonnes : id (UUID), productId (UUID), color (string), size (string), stock (number), sku (string, unique), createdAt, updatedAt
- [ ] Ajouter décorateurs TypeORM
- [ ] Définir relation ManyToOne vers Product
- [ ] Créer interface TypeScript Variant
- [ ] Tester création table en base

### Phase 3 : Modèles de données - Entités E-commerce
#### 3.1 Entité Cart
- [ ] Créer entity Cart dans src/entities/cart.entity.ts
- [ ] Définir colonnes : id (UUID), sessionId (string), createdAt, updatedAt
- [ ] Ajouter décorateurs TypeORM
- [ ] Définir relation OneToMany vers CartItems
- [ ] Créer interface TypeScript Cart
- [ ] Tester création table en base

#### 3.2 Entité CartItem
- [ ] Créer entity CartItem dans src/entities/cart-item.entity.ts
- [ ] Définir colonnes : id (UUID), cartId (UUID), variantId (UUID), quantity (number), createdAt
- [ ] Ajouter décorateurs TypeORM
- [ ] Définir relation ManyToOne vers Cart
- [ ] Définir relation ManyToOne vers Variant
- [ ] Créer interface TypeScript CartItem
- [ ] Tester création table en base

#### 3.3 Entité Order
- [ ] Créer entity Order dans src/entities/order.entity.ts
- [ ] Définir colonnes : id (UUID), cartId (UUID), status (enum), total (decimal), customerInfo (JSON), createdAt, updatedAt
- [ ] Créer enum OrderStatus (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- [ ] Ajouter décorateurs TypeORM
- [ ] Définir relation ManyToOne vers Cart
- [ ] Créer interface TypeScript Order
- [ ] Tester création table en base

#### 3.4 Relations & Migrations
- [ ] Vérifier toutes les relations entre entités
- [ ] Générer migration initiale (typeorm migration:generate)
- [ ] Vérifier SQL généré
- [ ] Exécuter migration (typeorm migration:run)
- [ ] Vérifier tables créées en base
- [ ] Tester relations avec requêtes TypeORM

#### 3.5 Seed données de test
- [ ] Créer script seed dans src/scripts/seed.ts
- [ ] Créer catégories de base (Adult, Kids, Sneakers)
- [ ] Créer produits de test avec images et variantes
- [ ] Exécuter seed
- [ ] Vérifier données en base

### Phase 4 : Module Catégories
#### 4.1 Structure module
- [ ] Créer module Categories (nest g module categories)
- [ ] Créer service Categories (nest g service categories)
- [ ] Créer controller Categories (nest g controller categories)
- [ ] Importer TypeOrmModule.forFeature([Category]) dans module

#### 4.2 DTOs Catégories
- [ ] Créer CreateCategoryDto dans src/dto/create-category.dto.ts
- [ ] Ajouter validation (name: string, slug: string, description?: string)
- [ ] Créer UpdateCategoryDto dans src/dto/update-category.dto.ts
- [ ] Créer CategoryResponseDto dans src/dto/category-response.dto.ts
- [ ] Ajouter class-validator decorators (@IsString, @IsNotEmpty, etc.)

#### 4.3 Service Categories
- [ ] Implémenter findAll() : Promise<Category[]>
- [ ] Implémenter findOne(id: string) : Promise<Category>
- [ ] Implémenter findBySlug(slug: string) : Promise<Category>
- [ ] Implémenter create(dto: CreateCategoryDto) : Promise<Category>
- [ ] Implémenter update(id: string, dto: UpdateCategoryDto) : Promise<Category>
- [ ] Implémenter delete(id: string) : Promise<void>
- [ ] Gérer erreurs (NotFoundException, etc.)

#### 4.4 Controller Categories
- [ ] Créer endpoint GET /categories (findAll)
- [ ] Créer endpoint GET /categories/:id (findOne)
- [ ] Créer endpoint GET /categories/slug/:slug (findBySlug)
- [ ] Créer endpoint POST /categories (create) - admin seulement
- [ ] Créer endpoint PUT /categories/:id (update) - admin seulement
- [ ] Créer endpoint DELETE /categories/:id (delete) - admin seulement
- [ ] Ajouter validation avec ValidationPipe
- [ ] Tester tous les endpoints avec Postman/Thunder Client

### Phase 5 : Module Produits
#### 5.1 Structure module
- [ ] Créer module Products (nest g module products)
- [ ] Créer service Products (nest g service products)
- [ ] Créer controller Products (nest g controller products)
- [ ] Importer TypeOrmModule.forFeature([Product, Image, Variant, Category]) dans module

#### 5.2 DTOs Produits
- [ ] Créer CreateProductDto (name, description, price, categoryId)
- [ ] Créer UpdateProductDto (partial de CreateProductDto)
- [ ] Créer ProductResponseDto (avec relations images, variants, category)
- [ ] Créer ProductQueryDto (pour filtres : category, minPrice, maxPrice, search, page, limit)
- [ ] Ajouter validation avec class-validator

#### 5.3 Service Products
- [ ] Implémenter findAll(query: ProductQueryDto) : Promise<{products: Product[], total: number}>
- [ ] Implémenter findOne(id: string) : Promise<Product> (avec relations)
- [ ] Implémenter findByCategory(categoryId: string, query: ProductQueryDto) : Promise<Product[]>
- [ ] Implémenter create(dto: CreateProductDto) : Promise<Product>
- [ ] Implémenter update(id: string, dto: UpdateProductDto) : Promise<Product>
- [ ] Implémenter delete(id: string) : Promise<void>
- [ ] Implémenter pagination (skip, take)
- [ ] Implémenter filtres (category, price range, search)
- [ ] Gérer erreurs

#### 5.4 Controller Products
- [ ] Créer endpoint GET /products (findAll avec query params)
- [ ] Créer endpoint GET /products/:id (findOne avec relations)
- [ ] Créer endpoint GET /products/category/:categoryId (findByCategory)
- [ ] Créer endpoint POST /products (create) - admin seulement
- [ ] Créer endpoint PUT /products/:id (update) - admin seulement
- [ ] Créer endpoint DELETE /products/:id (delete) - admin seulement
- [ ] Ajouter validation avec ValidationPipe
- [ ] Tester tous les endpoints avec Postman/Thunder Client

### Phase 6 : Module Variantes
#### 6.1 Structure module (ou intégration dans Products)
- [ ] Décider : module séparé ou intégré dans Products
- [ ] Créer DTOs Variants (CreateVariantDto, UpdateVariantDto, VariantResponseDto)
- [ ] Créer service Variants (ou intégrer dans ProductsService)
- [ ] Créer endpoints Variants (ou intégrer dans ProductsController)

#### 6.2 Service Variants
- [ ] Implémenter findByProduct(productId: string) : Promise<Variant[]>
- [ ] Implémenter findOne(id: string) : Promise<Variant>
- [ ] Implémenter create(dto: CreateVariantDto) : Promise<Variant>
- [ ] Implémenter update(id: string, dto: UpdateVariantDto) : Promise<Variant>
- [ ] Implémenter checkStock(variantId: string, quantity: number) : Promise<boolean>
- [ ] Implémenter updateStock(variantId: string, quantity: number) : Promise<void>
- [ ] Gérer erreurs

#### 6.3 Controller Variants
- [ ] Créer endpoint GET /products/:productId/variants
- [ ] Créer endpoint GET /variants/:id
- [ ] Créer endpoint POST /variants (create) - admin seulement
- [ ] Créer endpoint PUT /variants/:id (update) - admin seulement
- [ ] Tester endpoints

### Phase 7 : Module Images
#### 7.1 Configuration upload
- [ ] Installer multer ou @nestjs/platform-express (déjà inclus)
- [ ] Configurer FileInterceptor dans controller
- [ ] Créer service UploadService pour gestion fichiers
- [ ] Configurer stockage (local ou cloud : S3, Cloudinary, etc.)
- [ ] Créer dossier uploads/ ou configurer cloud

#### 7.2 Service Images
- [ ] Créer DTOs (CreateImageDto, ImageResponseDto)
- [ ] Implémenter upload(file: Express.Multer.File, productId: string) : Promise<Image>
- [ ] Implémenter findByProduct(productId: string) : Promise<Image[]>
- [ ] Implémenter delete(id: string) : Promise<void>
- [ ] Implémenter réordonnancement images (update order)
- [ ] Gérer suppression fichier physique lors delete

#### 7.3 Controller Images
- [ ] Créer endpoint POST /products/:productId/images (upload)
- [ ] Créer endpoint GET /products/:productId/images
- [ ] Créer endpoint DELETE /images/:id
- [ ] Créer endpoint PUT /images/:id/order (réordonnancement)
- [ ] Tester upload avec Postman/Thunder Client

### Phase 8 : Module Panier
#### 8.1 Structure module
- [ ] Créer module Cart (nest g module cart)
- [ ] Créer service Cart (nest g service cart)
- [ ] Créer controller Cart (nest g controller cart)
- [ ] Importer TypeOrmModule.forFeature([Cart, CartItem, Variant]) dans module

#### 8.2 DTOs Panier
- [ ] Créer AddToCartDto (variantId, quantity)
- [ ] Créer UpdateCartItemDto (quantity)
- [ ] Créer CartResponseDto (avec items et relations)
- [ ] Ajouter validation (quantity > 0, variantId existe, stock disponible)

#### 8.3 Service Cart
- [ ] Implémenter getOrCreate(sessionId: string) : Promise<Cart>
- [ ] Implémenter findOne(sessionId: string) : Promise<Cart> (avec relations)
- [ ] Implémenter addItem(sessionId: string, dto: AddToCartDto) : Promise<CartItem>
- [ ] Implémenter updateItem(itemId: string, dto: UpdateCartItemDto) : Promise<CartItem>
- [ ] Implémenter removeItem(itemId: string) : Promise<void>
- [ ] Implémenter clear(sessionId: string) : Promise<void>
- [ ] Implémenter calculTotal(cart: Cart) : Promise<number>
- [ ] Implémenter vérification stock avant addItem
- [ ] Gérer erreurs (stock insuffisant, variant introuvable, etc.)

#### 8.4 Controller Cart
- [ ] Créer endpoint GET /cart (getOrCreate avec sessionId)
- [ ] Créer endpoint POST /cart/items (addItem)
- [ ] Créer endpoint PUT /cart/items/:id (updateItem)
- [ ] Créer endpoint DELETE /cart/items/:id (removeItem)
- [ ] Créer endpoint DELETE /cart (clear)
- [ ] Gérer sessionId (header, cookie, ou query param)
- [ ] Ajouter validation avec ValidationPipe
- [ ] Tester tous les endpoints avec Postman/Thunder Client

### Phase 9 : Module Commandes
#### 9.1 Structure module
- [ ] Créer module Orders (nest g module orders)
- [ ] Créer service Orders (nest g service orders)
- [ ] Créer controller Orders (nest g controller orders)
- [ ] Importer TypeOrmModule.forFeature([Order, Cart, CartItem]) dans module

#### 9.2 DTOs Commandes
- [ ] Créer CreateOrderDto (cartId, customerInfo: {name, email, phone, address})
- [ ] Créer OrderResponseDto (avec relations)
- [ ] Ajouter validation complète (email valide, adresse complète, etc.)

#### 9.3 Service Orders
- [ ] Implémenter create(dto: CreateOrderDto) : Promise<Order>
- [ ] Implémenter findOne(id: string) : Promise<Order>
- [ ] Implémenter findAll() : Promise<Order[]> (admin)
- [ ] Implémenter updateStatus(id: string, status: OrderStatus) : Promise<Order>
- [ ] Implémenter calculTotal depuis cart
- [ ] Implémenter vérification stock avant création commande
- [ ] Implémenter déduction stock après création commande
- [ ] Gérer erreurs

#### 9.4 Controller Orders
- [ ] Créer endpoint POST /orders (create)
- [ ] Créer endpoint GET /orders/:id (findOne)
- [ ] Créer endpoint GET /orders (findAll) - admin seulement
- [ ] Créer endpoint PUT /orders/:id/status (updateStatus) - admin seulement
- [ ] Ajouter validation avec ValidationPipe
- [ ] Tester tous les endpoints avec Postman/Thunder Client

### Phase 10 : Tests & Optimisations
#### 10.1 Tests unitaires
- [ ] Configurer Jest pour tests
- [ ] Tests unitaires CategoriesService
- [ ] Tests unitaires ProductsService
- [ ] Tests unitaires CartService
- [ ] Tests unitaires OrdersService
- [ ] Couverture de code > 80%

#### 10.2 Tests d'intégration
- [ ] Configurer tests d'intégration (Test.createTestingModule)
- [ ] Tests endpoints Categories
- [ ] Tests endpoints Products
- [ ] Tests endpoints Cart
- [ ] Tests endpoints Orders
- [ ] Tests avec base de données de test

#### 10.3 Optimisations
- [ ] Optimiser requêtes TypeORM (select spécifiques, relations eager/lazy)
- [ ] Ajouter index base de données (categoryId, productId, sessionId)
- [ ] Implémenter cache si nécessaire (Redis)
- [ ] Optimiser pagination
- [ ] Analyser requêtes lentes

#### 10.4 Validation & Gestion erreurs
- [ ] Vérifier toutes les validations DTOs
- [ ] Créer filtres d'exception global
- [ ] Créer format d'erreur standardisé
- [ ] Gérer erreurs base de données
- [ ] Logger erreurs

#### 10.5 Documentation API
- [ ] Installer @nestjs/swagger
- [ ] Configurer SwaggerModule
- [ ] Ajouter décorateurs @ApiTags, @ApiOperation, @ApiResponse
- [ ] Documenter tous les endpoints
- [ ] Tester documentation Swagger

