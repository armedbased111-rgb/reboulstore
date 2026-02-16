# 🏪 Reboul Store - Contexte du Projet

**Version** : 0.33.0  
**Phase actuelle** : Phase 24 clôturée ✅ (15/02/2026). Phase 25 en cours (Finalisation Frontend reboulstore.com – revue page par page).  
**Roadmap** : Phases 1–23 résumées dans `ROADMAP_COMPLETE.md` ; Phase 24, 25, 26 détaillées ; post-lancement en résumé. Source de vérité : `docs/context/ROADMAP_COMPLETE.md`.  
**Collections** : Suivi à part dans `docs/context/COLLECTIONS_ROADMAP.md` (avancement par marque, refs, images).  
**Objectif** : Lancement site Reboul (première collection + Admin Centrale connectée).

---

## 📋 Vue d'ensemble

**Reboul Store** est un site e-commerce français spécialisé dans la vente de vêtements, sneakers et accessoires. C'est un concept-store positionné sur la mode premium / streetwear, avec un ton moderne et lifestyle.

### 🏗️ Architecture Multi-Sites

Le projet prévoit **3 sites e-commerce indépendants** gérés depuis une **Admin Centrale** :

1. **Reboul** (🎯 Priorité actuelle - Février 2025)
   - Catégorie : **Enfants** uniquement
   - Première collection prête à la vente
   - Backend + Frontend + Database dédiés (Docker séparé)
   
2. **CP Company** (🔜 Futur - Après lancement Reboul)
   - Site indépendant
   - Backend + Frontend + Database dédiés (Docker séparé)
   
3. **Outlet** (🔜 Futur - Après CP Company)
   - Site déstockage/promotions
   - Backend + Frontend + Database dédiés (Docker séparé)

### 🎛️ Admin Centrale

**Application admin centralisée** pour gérer les 3 sites :
- **Architecture** : Frontend (React + Vite + TypeScript) + Backend (NestJS) séparés
- **Connexion** : Connexion directe aux 3 bases de données via TypeORM (connexions multiples)
- **Fonctionnalités** : Gestion produits, commandes, clients pour chaque site depuis une interface unique
- **État actuel** : ✅ Phase 15.5 terminée (Infrastructure créée et validée)
- **Prochaine étape** : Phase 16 (Backend Admin & Permissions) - Phase 17 (Frontend Admin)
- **MVP** : Connecté uniquement à Reboul pour Février 2025

**📚 Documentation complète** : Voir [[../architecture/ARCHITECTURE_ADMIN_CENTRAL.md|ARCHITECTURE_ADMIN_CENTRAL]]

**✅ Infrastructure Admin-Centrale (Phase 15.5)** :
- Structure `admin-central/` créée (backend + frontend)
- Docker Compose configuré (ports 4000 frontend, 4001 backend)
- Connexion TypeORM `'reboul'` active et validée
- Réseau Docker partagé `reboulstore-network` fonctionnel
- Endpoints test : `/health` backend ✅, page "Hello Admin" frontend ✅

**✅ Backend Admin - Services & Controllers (Phase 16)** :
- Module Reboul créé avec 11 entités copiées
- Services créés : `ReboulProductsService`, `ReboulOrdersService`, `ReboulUsersService`, `ReboulStocksService`
- Controllers créés avec endpoints complets : `/admin/reboul/products`, `/admin/reboul/orders`, `/admin/reboul/users`, `/admin/reboul/stocks`
- Endpoints testés et fonctionnels ✅
- Statistiques disponibles pour chaque module

**✅ Backend Admin - Authentification & Permissions (Phase 16.2)** :
- Entité `AdminUser` créée (séparée de User client)
- Enum `AdminRole` (ADMIN, SUPER_ADMIN)
- Service `AdminAuthService` (register, login, validateUser)
- Strategy `AdminJwtStrategy` pour validation JWT
- Guards `AdminJwtAuthGuard` et `RolesGuard` créés
- Decorator `@Roles()` pour spécifier rôles requis
- Controller `AdminAuthController` avec routes `/admin/auth/*`
- Toutes les routes admin protégées par authentification ✅
- Tests : Inscription, connexion, token JWT, routes protégées validées ✅

**✅ Frontend Admin - Phase 17 (Interface complète)** :
- Dashboard avec statistiques (CA, commandes, produits, clients)
- Gestion produits : Liste, création, édition avec formulaire complet
  - Tous les champs produits (materials, careInstructions, madeIn, customSizeChart)
  - Upload images (max 7) avec Cloudinary + réorganisation
  - Gestion variants (taille, couleur, stock, SKU) avec validation
- Import collections : CSV (format complet) + collage fiche Edite. **Upsert** : réimport met à jour les stocks au lieu de crasher sur les doublons.
- Gestion catégories : CRUD complet + upload image/vidéo hero + size chart
- Gestion marques : CRUD complet + upload logo + mega menu images/vidéos
- Gestion commandes : Liste avec filtres + détails commande
- Gestion utilisateurs : Liste avec filtres + détails utilisateur
- Page Settings : Paramètres Reboul (politiques livraison/retour, frais, contact, Stripe)
- Navigation responsive avec tabs animées (mobile/tablette/desktop)
- Design responsive complet (mobile-first, cards sur mobile, tableaux sur desktop)
- Authentification admin avec contexte React
- Routes protégées avec `ProtectedRoute`
- **Phase 17.10 Multi-Sites UI** : Page sélection magasin (`/`) avec ShopSelectorPage (Reboul actif, CP Company/Outlet à venir)
- **Phase 17.9 Brainstorming** : Audit complet + plan d'amélioration documenté

### 🏛️ Architecture Technique

**Chaque site e-commerce est complètement autonome** :
```
reboulstore/
├── backend/ (NestJS)
├── frontend/ (React + Vite + TailwindCSS)
├── postgres/ (PostgreSQL)
└── docker-compose.yml (Docker séparé)
```

**Application Admin centralisée** :
```
admin-central/
├── backend/ (NestJS - Connexions multiples TypeORM) ✅
│   ├── src/config/databases.config.ts (connexions Reboul/CP/Outlet)
│   ├── src/app.module.ts (connexion Reboul active)
│   └── Endpoint /health fonctionnel
├── frontend/ (React + Vite + TypeScript) ✅
│   └── Page test "Hello Admin" fonctionnelle
└── docker-compose.yml (Réseaux Docker partagés) ✅
```

**Avantages** :
- ✅ **Stabilité** : Si un site crash, les autres continuent
- ✅ **Scalabilité** : Chaque site évolue indépendamment
- ✅ **Isolation** : Base de données séparée par site
- ✅ **Docker** : Chaque site dans son propre container
- ✅ **Admin unifié** : Gestion centralisée des 3 sites
- ✅ **Sécurité** : Bases de données isolées, connexions sécurisées

### 🎨 Positionnement

- **Secteur** : Mode premium / streetwear
- **Cible** : Adultes et enfants
- **Ancrage local** : Sud de la France (Marseille / Cassis / Sanary)
- **Design** : Mobile-first, minimaliste, noir/blanc
- **Inspiration** : [A-COLD-WALL*](https://www.a-cold-wall.com/) - Style minimaliste premium

---

## 🏗️ Architecture technique

### Stack Backend
- **Framework** : NestJS
- **ORM** : TypeORM
- **BDD** : PostgreSQL
- **Auth** : JWT + OAuth (Google, Apple)
- **Paiement** : Stripe + Stripe Connect
- **Images** : Cloudinary (max 7 images/produit, 1200x1200px)
- **Emails** : Nodemailer
- **SMS** : Twilio/Vonage (réinitialisation mot de passe)
- **Temps réel** : WebSockets (Socket.io)
- **Automatisation** : n8n (remboursements, workflows)
- **Cache** : Redis (optionnel)
- **Docker** : Containerisation complète

### Stack Frontend
- **Build** : Vite
- **Framework** : React (TypeScript)
- **Styling** : TailwindCSS v4
- **Composants UI** : shadcn/ui (disponible dans `/ui/shadcn`)
- **Typo** : Geist
- **Design** : Mobile-first, inspiration A-COLD-WALL*
- **Docker** : Containerisation

### Frontend Admin
- **Build** : Vite
- **Framework** : React (TypeScript)
- **UI Library** : GeistUI
- **Sous-domaine** : `admin.reboulstore.com`

---

## 📁 Structure du projet

```
reboulstore/                    # Projet Reboul (MVP Février 2025)
├── backend/                    # API NestJS + TypeORM
├── frontend/                   # E-commerce React + Vite + TailwindCSS
├── docker-compose.yml          # Docker Compose Reboul
└── .env                        # Variables d'environnement Reboul

cpcompany/                      # Projet CP Company (Futur)
├── backend/                    # API NestJS + TypeORM
├── frontend/                   # E-commerce React + Vite + TailwindCSS
├── docker-compose.yml          # Docker Compose CP Company
└── .env                        # Variables d'environnement CP Company

outlet/                         # Projet Outlet (Futur)
├── backend/                    # API NestJS + TypeORM
├── frontend/                   # E-commerce React + Vite + TailwindCSS
├── docker-compose.yml          # Docker Compose Outlet
└── .env                        # Variables d'environnement Outlet

admin-central/                   # Application Admin Centralisée
├── backend/                    # API NestJS (connexions multiples)
├── frontend/                   # Admin React + Vite + GeistUI
├── docker-compose.yml          # Docker Compose Admin
└── .env                        # Variables d'environnement Admin

Documentation/
├── CONTEXT.md                  # Ce fichier (contexte général)
├── ROADMAP_COMPLETE.md         # Roadmap détaillée complète
├── ARCHITECTURE_ADMIN_CENTRAL.md # Architecture Admin Centralisée ⭐
├── ARCHITECTURE_MULTI_SHOPS.md  # Architecture Multi-Sites (ancienne approche)
├── BRAINSTORMING_ROADMAP.md     # Brainstorming & décisions
├── CLARIFICATIONS_BRAINSTORMING.md # Clarifications validées
├── POLICIES_TODO.md            # Note pour finaliser politiques livraison/retour
├── FRONTEND.md                 # Documentation frontend détaillée
└── BACKEND.md                  # Documentation backend détaillée
```

---

## 🛠️ Interface CLI DB (`./rcli db ...`)

Voir et éditer les articles rapidement depuis le terminal (base Reboul sur VPS uniquement).

**Reference Finder** : `./rcli db ref <REF>` — hub par ref : produit + variants + commandes d’édition prêtes à copier-coller. **Vérifier une feuille de stock** : pour chaque ref de la feuille (ex. Stone Island), lancer `./rcli db ref <REF>` pour contrôler que la ref est bonne en base.

**Lecture** : `ref` (hub), `product-find`, `product-list`, `variant-list`, `check-sequences`, `order-list` (--last N), `order-detail --id <ID>`, `cart-list`.

**Édition** (backup auto + `--yes` ou confirmation) : stock (`variant-set-stock`, `product-set-all-stock`), couleur (`variant-set-color`, `product-set-all-color`), taille (`variant-set-size`), variant-add / variant-delete, prix (`product-set-price`), visibilité (`product-set-active`), nom/réf/catégorie/marque/collection (`product-set-name`, `product-set-ref`, `product-set-category`, `product-set-brand`, `product-set-collection`).

**Export** : `export-csv --brand "X"` [--collection Y] [--output file.csv] (une ligne par variant).

**Référence** : `docs/context/DB_CLI_USAGE.md` | Commande Cursor : `/db-cli-workflow`

🏁 **Règles** : DB toujours sur VPS ; commandes mutantes = backup auto (sauf `--no-backup`) + confirmation (`--yes` ou prompt).

## ✅ État actuel (Version 0.30.0)

### Backend complété ✅
- ✅ **Infrastructure** : Docker + PostgreSQL + NestJS configurés
- ✅ **Entités** : Category, Product, Image, Variant, Cart, CartItem, Order, Shop, Brand, **User, Address, OrderEmail**
- ✅ **Modules API** :
  - Categories (CRUD + slug + videoUrl + sizeChart)
  - Products (CRUD + filtres + pagination + variants + images + upload local + filtre brand)
  - Cart (gestion complète avec session)
  - Orders (création + statuts + vérification stock + capture manuelle paiements)
  - Checkout (Stripe Checkout - session création + webhooks)
  - Shops (CRUD + politiques)
  - Brands (CRUD + slug + images/vidéos mega menu)
  - **Auth (register, login, JWT, guards)**
  - **Users (profil, adresses CRUD)**
  - **Email (système complet avec persistance BDD)**
- ✅ **Authentification** : JWT complète (tokens 7 jours, bcrypt, guards)
- ✅ **Sécurité** : Passwords hachés, jamais retournés, routes protégées
- ✅ **Relations** : Toutes les relations TypeORM (User → Addresses, User → Orders)
- ✅ **Politiques** : Shop avec shippingPolicy et returnPolicy (jsonb)
- ✅ **Size charts** : Category + Product (override possible)
- ✅ **Upload images** : Multer + stockage local (à migrer vers Cloudinary)

### Frontend complété ✅
- ✅ **Infrastructure** : Vite + React + TailwindCSS v4 + Docker
- ✅ **Routing** : React Router (/, /catalog, /product/:id, /cart, /order-confirmation, /about, /login, /register, /profile, /test-auth)
- ✅ **Services API** : products, categories, cart, orders, brands, **auth**
- ✅ **Hooks** : useProducts, useProduct, useCategories, useCart, useBrands, useLocalStorage, **useAuth**
- ✅ **Context** : **CartContext (gestion globale panier + synchronisation état)**
- ✅ **Context** : **AuthContext (gestion globale auth + persistance localStorage)**
- ✅ **Authentification** : 
  - Service auth.ts (register, login, getMe)
  - Token JWT en localStorage, auto-revalidation
  - **Page Login TERMINÉE - Pixel-perfect depuis Figma** ⭐
    - Layout 2 colonnes (grid-cols-[478px_1fr])
    - Vidéo background collée au form (gap-[10px])
    - Typographie exacte (font-[Geist], leading-[20px])
    - Responsive intelligent (mobile centré, desktop gauche)
    - Code React propre (HTML sémantique, space-y-*)
  - **Workflow Figma → Code MAÎTRISÉ** (voir FIGMA_DEV_GUIDE.md)
  - **Pages Register (à faire), Profile (basique)**
  - **ProtectedRoute (HOC pour protéger routes)**
  - **Header intégré (CONNEXION vs prénom/MON COMPTE)**
- ✅ **Layout** : Header (mega menu catégories + **mega menu brands avec hover** + recherche + **auth button** + badge panier) + Footer (style A-COLD-WALL*)
- ✅ **Pages** :
  - **Home** : HeroSectionImage (support vidéo/image), HeroSectionVideo, CategorySection, FeaturedProducts, PromoCard
  - **Catalog** : ProductGrid, ProductCard, **filtres par catégorie + marque**, HeroSection avec vidéo/image pour brands/categories (priorité vidéo)
  - **Product** : ProductGallery (Swiper), ProductInfo, VariantSelector, AddToCartButton, ProductTabs (Details, Sizing, Shipping, Returns avec logique d'héritage)
  - **Login TERMINÉE** ⭐ : **Pixel-perfect depuis Figma**
    - Grid 2 colonnes largeurs fixes (478px + 1fr)
    - Espacements exacts identiques partout (mb-[71px], gap-6, gap-[1.5px])
    - Code React propre (HTML sémantique, minimum divs, space-y-*)
    - Responsive intelligent (mobile centré, desktop gauche, vidéo masquée mobile)
    - Workflow Figma → Code maîtrisé et documenté (FIGMA_DEV_GUIDE.md)
  - **Register TERMINÉE** ✅ : **Structure identique Login + champs supplémentaires**
    - Même grid 2 colonnes (478px + 1fr)
    - Même responsive (mobile/desktop)
    - Même vidéo background
    - 6 champs : Prénom, Nom, Email, Téléphone, Password, Confirm Password
    - Validation : password match + min 8 caractères
    - **Espacements optimisés** pour formulaires longs (space-y-8, space-y-4, space-y-3)
    - Tout visible sans scroll
  - **Profile TERMINÉE** ✅ : **Pixel-perfect depuis Figma + Composants réutilisables**
    - Design Figma (node-id: 6:273) implémenté exactement
    - Grid 2 colonnes (`grid-cols-[1fr_720px]`)
    - Card infos personnelles (Email, Prénom, Nom, Téléphone, Rôle, Date)
    - 2 Quick actions (Mes Commandes, Mes Adresses)
    - Bouton déconnexion (border rouge #e7000b)
    - **Refactorisation en 6 composants** (ProfileHeader, ProfileInfoField, ProfileRoleBadge, ProfileInfoCard, ProfileQuickAction, ProfileActions)
    - Code propre : 53 lignes au lieu de 130
  - **TestAuth** : Composant test complet pour auth (register, login, logout, persistance)
- ✅ **Composants UI** : Button, Input, Label, Separator (shadcn/ui)
- ✅ **Composants** : Style A-COLD-WALL* minimaliste premium
- ✅ **Responsive** : Mobile-first avec breakpoints TailwindCSS
- ✅ **Navigation Brands** : Onglet Brands, mega menu avec images/vidéos changeantes au hover (priorité vidéo)
- ✅ **Protection routes** : ProtectedRoute pour /profile (à étendre pour /orders, /checkout)

### 🔄 En cours / En attente
- 🔄 **Historique commandes** : Page /orders pour clients (Phase 14)
- 🔄 **Page Produit Améliorée** : Stock par variant, guide taille (Phase 14.5)
- ⏸️ **Page Profil complète** : Édition infos, gestion adresses CRUD (Phase 10.3 - basique fait)
- ⏸️ **Forgot/Reset Password** : Pages reset mot de passe (Phase 18 - avancé)
- ⏸️ **OAuth Google/Apple** : Authentification sociale (Phase 18 - avancé)
- ⏸️ **Politiques** : Validation finale avec direction (voir `POLICIES_TODO.md`)
- ✅ **Admin Panel** : Phase 17 COMPLÈTE (Dashboard, Produits, Catégories, Marques, Commandes, Utilisateurs, Settings)
- ✅ **Cloudinary** : Intégration complète dans admin-central (upload images/vidéos pour produits, catégories, marques)
- ✅ **Responsive Design** : Phase 17.8.1 COMPLÈTE (mobile/tablette/desktop optimisé)
- ✅ **Phase 17.9** : Brainstorming & Plan d'Amélioration COMPLÈTE (audit + plan documenté)
- ✅ **Phase 17.10** : Multi-Sites UI COMPLÈTE (ShopSelectorPage, routing, logout)
- ✅ **Phase 17.11.1-17.11.4** : Docker Production Ready COMPLÈTE
  - ✅ Docker Compose Production (Reboul + Admin)
  - ✅ Configuration Nginx (reverse proxy, SSL préparé, compression, cache)
  - ✅ Scripts Déploiement (deploy, backup, rollback)
  - ✅ Monitoring & Logs (Logger NestJS, health checks, Winston/Sentry préparés)
- ✅ **Phase 17.11.5** : Achat & Configuration Serveur OVH (VPS-3 : 8 vCores / 24 GB RAM / 200 GB SSD) - TERMINÉE ✅
  - ✅ Documentation complète créée (`docs/OVH_SERVER_SETUP.md`)
  - ✅ Configuration choisie : VPS-3 (supporte architecture complète, pas de migration nécessaire)
  - ✅ Serveur OVH acheté et activé
  
- ✅ **Phase 23** : Déploiement & Production - TERMINÉE ✅
  - ✅ Applications déployées et opérationnelles sur serveur OVH
  - ✅ Reboul Store accessible sur www.reboulstore.com
  - ✅ Admin Central accessible sur admin.reboulstore.com
  - ✅ Backend APIs fonctionnelles (migrations TypeORM exécutées)
  - ✅ Rate limiting activé (10 req/s API, 5 req/s Auth)
  - ✅ Backups automatiques configurés (cron quotidien)
  - ✅ Logs centralisés (Docker json-file)
  - ✅ **Configurations optionnelles activées** :
    - ✅ HTTPS (Let's Encrypt) : Certificats SSL actifs pour www et admin, redirection HTTP → HTTPS
    - ✅ Cloudflare CDN : **ACTIVÉ** (CDN opérationnel, SSL/TLS "Full (strict)", Speed optimizations, Cache rules, WAF actif)
    - ✅ GA4 Monitoring : Tracking actif (Measurement ID: G-S8LMN95862), CLI realtime opérationnel
  - ✅ Scripts d'installation créés (HTTPS, CDN, Monitoring, propagation DNS)
  - ✅ Documentation complète (`docs/PRODUCTION_SECURITY.md`, `docs/HTTPS_SETUP_COMPLETE.md`, `docs/CLOUDFLARE_SETUP_COMPLETE.md`, `docs/GA4_SETUP_GUIDE.md`, `docs/GA4_API_SETUP.md`)
  - ✅ Configuration initiale complétée :
    - [x] Système mis à jour (Ubuntu 22.04.5 LTS)
    - [x] Docker installé (v29.1.3, Docker Compose v5.0.0)
    - [x] Firewall configuré (ports 22, 80, 443)
    - [x] Utilisateur `deploy` créé (SSH avec clés, sudo sans mot de passe)
    - [x] SSH sécurisé (password auth désactivé)
    - [x] Fail2ban installé
  - ✅ Configuration DNS Phase 1 complétée :
    - [x] Stratégie décidée : Option 1 (garder domaine sur Vercel, pointer DNS vers OVH) ✅
    - [x] Retirer domaine du projet Vercel ✅
    - [x] Supprimer zone DNS et recréer enregistrements A ✅
    - [x] Vérification propagation DNS ✅
      - ✅ `www.reboulstore.com` → `152.228.218.35` (fonctionne)
      - ✅ `admin.reboulstore.com` → `152.228.218.35` (fonctionne)
      - ⚠️ `reboulstore.com` → bloqué par ALIAS Vercel (non supprimables, sera résolu lors du transfert)
    - 🔄 Transfert domaine vers OVH prévu mois prochain (Phase 17.11.5.6) pour résoudre le domaine principal
  - ✅ Vérification builds locaux (Phase 17.11.5.4) - Complétée ✅ (tous les builds passent)
  - ✅ Préparation déploiement (Phase 17.11.5.5) - Complétée ✅
    - Repository cloné dans `/opt/reboulstore` sur serveur OVH
    - Secrets générés (JWT Reboul/Admin, DB_PASSWORD)
    - Clés Stripe LIVE configurées (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)
    - Clés Cloudinary configurées (CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET)
    - Webhook Stripe configuré : `https://www.reboulstore.com/api/checkout/webhook`
    - Tous les fichiers `.env.production` configurés et prêts
- 🔄 **Phase 17.12** : Tests E2E Critiques (à faire avant février)
- ✅ **Phase 25** : Migration Serveur OVH (devenue optionnelle)
  - VPS-3 supporte déjà l'architecture complète (3 sites + Admin)
  - Migration seulement si upgrade vers VPS supérieur nécessaire

---

## 🗺️ Roadmap & Prochaines Étapes

**📌 Roadmap complète détaillée** : [`ROADMAP_COMPLETE.md`](./ROADMAP_COMPLETE.md)

### 🎯 Objectif Février 2025 : REBOUL PRÊT À LA VENTE

**Focus absolu** : Finir Reboul (catégorie enfants) + Admin Centrale

### 🔴 Priorité 1 - Finaliser Reboul (Phases 9-14)

**Objectif** : Site Reboul fonctionnel de bout en bout

1. **Phase 9** : Backend - Auth & Users (JWT + OAuth Google/Apple)
2. **Phase 10** : Frontend - Auth UI (Login, Register, Profil)
3. **Phase 11** : Backend - Commandes complètes (cycle de vie, stock, emails)
4. **Phase 12** : Frontend - Panier & Checkout complet
5. **Phase 13** : Backend - Stripe (paiement Reboul)
6. **Phase 14** : Frontend - Historique commandes

### 🟡 Priorité 2 - Admin Centrale (Phases 15-17)

**Objectif** : Créer l'admin centralisée et la connecter à Reboul

7. **Phase 15** : Backend - Cloudinary (upload images optimisées) - **Dans admin-central**
8. **Phase 16** : Backend - Admin & Permissions (rôles, CRUD admin, connexions multi-databases)
9. **Phase 17** : Frontend - **Admin Centrale** (React + GeistUI, connectée à Reboul)

**Architecture** : Voir [`ARCHITECTURE_ADMIN_CENTRAL.md`](../architecture/ARCHITECTURE_ADMIN_CENTRAL.md)

### 🟢 Priorité 3 - Après lancement Reboul

**Sites futurs** :
- **CP Company** : Créer projet `cpcompany/` (copier structure `reboulstore/`)
- **Outlet** : Créer projet `outlet/` (copier structure `reboulstore/`)
- **Admin Centrale** : Ajouter connexions CP Company et Outlet dans `admin-central/`
  - Décommenter configs dans `app.module.ts`
  - Créer modules CP Company et Outlet
  - Ajouter pages frontend pour chaque site

**Fonctionnalités avancées** :
- Recherche avancée, Wishlist, Reviews, Promotions, WebSockets, SMS, Redis
- Pages vitrine (About, Contact, Stores, Shipping/Returns, CGV)

### 🔵 Priorité 4 - Optimisation & Production

- Automatisation (n8n), Tests, SEO, Performance, Déploiement, Analytics

---

## 🎯 Prochaines Phases

### Phase 17.11.5 : Achat & Configuration Serveur OVH
**Ce qu'on va faire** :
1. Acheter serveur OVH (VPS ou Dedicated)
2. Configuration initiale (Docker, firewall, utilisateur non-root)
3. Configuration DNS (reboulstore.com, admin.reboulstore.com)
4. Préparation déploiement (cloner repo, .env.production)

**Pourquoi maintenant ?**
- ✅ Infrastructure Docker production prête (Phase 17.11.1-17.11.4)
- ✅ Scripts de déploiement créés
- ⏰ Timing : À faire avant Phase 23 (Déploiement final)

### Phase 17.12 : Tests E2E Critiques
**Ce qu'on va faire** :
1. Setup Playwright/Cypress
2. Tests parcours client complet (catalog → product → cart → checkout)
3. Tests parcours admin (login → créer produit → gérer commande)
4. Tests paiement Stripe (succès, échec, webhooks)

**Pourquoi maintenant ?**
- ✅ Application fonctionnelle de bout en bout
- ⏰ Timing : Avant février 2025 (validation avant lancement)

---

## 📝 Notes importantes

### 🎨 Design & Frontend
- **Inspiration** : [A-COLD-WALL*](https://www.a-cold-wall.com/) - Style minimaliste premium
- **Workflow** : **Figma → Code → Validation** (voir [FIGMA_WORKFLOW.md](../export/FIGMA_WORKFLOW.md) et [FIGMA_DEV_GUIDE.md](../export/FIGMA_DEV_GUIDE.md))
  - Phase 1 : Design dans Figma (toi)
  - Phase 2 : `get_design_context` + `get_screenshot`
  - Phase 3 : Analyser structure Figma
  - Phase 4 : Coder React propre (valeurs exactes)
  - Phase 5 : Responsive dès le début
  - Phase 6 : Validation visuelle
  - Phase 7 : Ajustements précis
  - Phase 8 : Documentation
- **Succès validé** : **Login Page (10 déc 2025)** - Pixel-perfect + Responsive ⭐
  - Grid largeurs fixes (478px + 1fr)
  - Espacements exacts (mb-[71px], gap-[1.5px], gap-6)
  - Code React propre (HTML sémantique, minimum divs)
  - Workflow maîtrisé et documenté
- **Style** : Noir/blanc/gris + accent rouge, espacement généreux
- **Typo** : Geist (font-[Geist], leading-[20px], tracking-[-0.6px])
- **Images** : Lazy loading, gestion erreurs, placeholder
- **Responsive** : Mobile-first (grid-cols-1 lg:grid-cols-[478px_1fr])

### 🛍️ Fonctionnalités Métier
- **Multi-sites** : 3 sites indépendants (Reboul, CP Company, Outlet)
- **Focus actuel** : Reboul - Catégorie enfants uniquement
- **Promotions** : Codes promo, flash sales (24h/48h) - Future
- **Avis produits** : Ouverts à tous, auto-publication - Future
- **Stocks** : Alerte stock faible à 5 unités, notifications admin
- **Images produits** : Max 7 images, 1200x1200px, JPG/PNG/WebP
- **Politiques** : Livraison/retour par site (jsonb)
- **Size charts** : Par catégorie (override par produit possible)

### 🔗 Intégrations
- **Paiement** : Stripe (un compte par site)
- **Auth** : JWT + OAuth (Google, Apple)
- **Images** : Cloudinary (CDN, optimisation) - À venir
- **Emails** : Nodemailer (confirmation commande, tracking, etc.) ✅ - Système complet avec persistance BDD
- **SMS** : Twilio/Vonage (reset password) - Future
- **Temps réel** : WebSockets (notifications) - Future
- **Automatisation** : n8n (workflows) - Future
- **Analytics** : Google Analytics 4 - Future
- **Chat** : Chatbot IA - Future

### 🚀 Performance & Optimisation
- **Objectif** : Lighthouse > 90, Core Web Vitals optimisés
- **Cache** : Frontend (localStorage/sessionStorage) + Backend (Redis optionnel)
- **SEO** : Sitemap.xml, robots.txt, meta tags, Open Graph

### 🔐 Sécurité
- **Rate limiting** : Protection contre bruteforce
- **Validation** : class-validator partout
- **CORS** : Configuré
- **Headers** : Helmet.js en prod
- **SSL** : Let's Encrypt (prod)

### 📦 Déploiement
- **Environnements** : Dev (local Docker) → Prod (Docker)
- **Variables** : `.env` (clés API Cloudinary, Stripe, etc.)
- **CI/CD** : GitHub Actions (lint → test → build → deploy)
- **Tests** : E2E prioritaires (catalog → product → cart → checkout)

---

## 📚 Documentation détaillée

- **Architecture Admin Centralisée** : Voir [`ARCHITECTURE_ADMIN_CENTRAL.md`](../architecture/ARCHITECTURE_ADMIN_CENTRAL.md) ⭐
- **Frontend** : Voir [`FRONTEND.md`](./frontend/FRONTEND.md)
- **Backend** : Voir [`BACKEND.md`](./backend/BACKEND.md)
- **Roadmap complète** : Voir [`ROADMAP_COMPLETE.md`](./ROADMAP_COMPLETE.md)
- **Brainstorming** : Voir [`BRAINSTORMING_ROADMAP.md`](./BRAINSTORMING_ROADMAP.md)
- **Clarifications** : Voir [`CLARIFICATIONS_BRAINSTORMING.md`](./CLARIFICATIONS_BRAINSTORMING.md)
- **Politiques à finaliser** : Voir [`POLICIES_TODO.md`](./POLICIES_TODO.md)

---

**🎯 Focus actuel** :
1. ✅ **TERMINÉE** : Phase 23 (Déploiement & Production) - Applications en production, configurations optionnelles activées
2. ✅ **Configurations Production** :
   - ✅ HTTPS (Let's Encrypt) : Certificats SSL actifs pour www et admin
   - ✅ Cloudflare CDN : **ACTIVÉ** (CDN opérationnel, SSL/TLS, Speed, Caching, WAF actif)
   - ✅ GA4 Monitoring : Tracking actif + CLI realtime opérationnel (Measurement ID: G-S8LMN95862)
3. **Phase actuelle** : Phase 24 EN COURS 🟢 (Préparation Collection Réelle)
   - ✅ 24.1 Documentation & Contexte (terminé)
   - ✅ 24.2 Insertion Marques avec Logos (terminé - 57 marques)
   - ✅ 24.4 Système Rotation Collections (terminé)
   - ⏳ 24.3 Politique Livraison Finale (réunion magasin)
   - ✅ 24.5bis Import Manuel Collections via Tables/CSV (fonctionnel, upsert stock si ref existe)
   - ⏳ 24.6 Amélioration Processus Stocks (gestion manuelle + alertes)
   - ⏳ 24.7 Workflow Images Produits (presque terminé)
   - ⏳ 24.8 Workflow Ajout Continu Produits
   - ⏳ 24.9 Checklist Finale - Validation Collection

4. **Prochaine phase** : Phase 25 ⏳ (Finalisation Avant Lancement)
   - 🔴 25.1 Recherche Produits (Backend + Frontend) - CRITICAL
   - 🔴 25.2 Page Home Complète (Frontend) - CRITICAL
   - 🟡 25.3 SEO de Base (Backend + Frontend) - HIGH
   - 🟡 25.4 Tests Critiques (E2E, Intégration) - HIGH
   - 🟡 25.5 Performance de Base (Optimisations essentielles) - HIGH
   - 🟡 25.6 Dashboard Admin Stats (Admin) - HIGH
   - 🟡 25.7 Filtres Avancés Catalog (Frontend) - HIGH
4. **Objectif Février 2025** : Site Reboul (catégorie enfants) prêt à la vente + Admin Centrale connectée
5. **Améliorations** : 
   - CLI pour gestion VPS, CLI GA4 realtime (voir `docs/VPS_CLI_IMPROVEMENTS.md`, `docs/GA4_API_SETUP.md`)
   - ✅ **CLI Analyse Verbosité** : Nouvelle commande `./rcli analyze verbosity` pour détecter automatiquement le code verbeux (commentaires redondants, répétitions, code dupliqué) selon la règle primordiale d'écriture du code

**✅ Réalisations récentes** :
- Phase 17.9 : Brainstorming & Plan d'Amélioration (audit complet documenté)
- Phase 17.10 : Multi-Sites UI (ShopSelectorPage, routing multi-sites)
- Phase 17.11.1-17.11.4 : Docker Production Ready (Compose, Nginx, Scripts, Monitoring)
- Phase 17.11.5 : Serveur OVH acheté et configuré (VPS-3, Docker, firewall, SSH sécurisé)
  - Stratégie DNS : Option 1 (Vercel → OVH maintenant, transfert domaine mois prochain)
