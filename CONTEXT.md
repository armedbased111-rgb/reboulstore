# 🏪 Reboul Store - Contexte du Projet

**Version** : 0.19.0  
**Phase actuelle** : Phase 12.2 & 13 COMPLÈTES (Checkout Stripe + Emails invités) ✅ - Prochaine : Phase 14 (Historique commandes)
**Objectif Février 2025** : Lancement site Reboul avec première collection

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
- **Architecture** : Frontend (React + GeistUI) + Backend (NestJS) séparés
- **Connexion** : Connexion directe aux 3 bases de données via TypeORM (connexions multiples)
- **Fonctionnalités** : Gestion produits, commandes, clients pour chaque site depuis une interface unique
- **À créer** : Phase 16-17 (Backend Admin + Frontend Admin)
- **MVP** : Connecté uniquement à Reboul pour Février 2025

**📚 Documentation complète** : Voir [`ARCHITECTURE_ADMIN_CENTRAL.md`](./ARCHITECTURE_ADMIN_CENTRAL.md)

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
├── backend/ (NestJS - Connexions multiples TypeORM)
├── frontend/ (React + Vite + GeistUI)
└── docker-compose.yml (Réseaux Docker partagés)
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

## ✅ État actuel (Version 0.14.0)

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
- ⏸️ **Admin Panel** : À créer (Phase 17)
- ⏸️ **Cloudinary** : Migration upload images (Phase 15 - dans admin-central)
- ⏸️ **Améliorations UI** : Responsive & Animations (Phase 17.12)

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

**Architecture** : Voir [`ARCHITECTURE_ADMIN_CENTRAL.md`](./ARCHITECTURE_ADMIN_CENTRAL.md)

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

## 🎯 Prochaine Phase : Phase 14 - Frontend Historique Commandes

**Ce qu'on va faire** :
1. Page `/orders` : Liste des commandes client (connecté)
2. Page `/orders/:id` : Détail d'une commande
3. Affichage statut, articles, adresses, tracking
4. Actions : Télécharger facture, demander retour

**Pourquoi maintenant ?**
- ✅ Clients doivent pouvoir voir leurs commandes
- ✅ Nécessaire après checkout (consultation après achat)
- ✅ Complète le cycle de commande client

---

## 📝 Notes importantes

### 🎨 Design & Frontend
- **Inspiration** : [A-COLD-WALL*](https://www.a-cold-wall.com/) - Style minimaliste premium
- **Workflow** : **Figma → Code → Validation** (voir [FIGMA_WORKFLOW.md](./FIGMA_WORKFLOW.md) et [FIGMA_DEV_GUIDE.md](./FIGMA_DEV_GUIDE.md))
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

- **Architecture Admin Centralisée** : Voir [`ARCHITECTURE_ADMIN_CENTRAL.md`](./ARCHITECTURE_ADMIN_CENTRAL.md) ⭐
- **Frontend** : Voir [`FRONTEND.md`](./frontend/FRONTEND.md)
- **Backend** : Voir [`BACKEND.md`](./backend/BACKEND.md)
- **Roadmap complète** : Voir [`ROADMAP_COMPLETE.md`](./ROADMAP_COMPLETE.md)
- **Brainstorming** : Voir [`BRAINSTORMING_ROADMAP.md`](./BRAINSTORMING_ROADMAP.md)
- **Clarifications** : Voir [`CLARIFICATIONS_BRAINSTORMING.md`](./CLARIFICATIONS_BRAINSTORMING.md)
- **Politiques à finaliser** : Voir [`POLICIES_TODO.md`](./POLICIES_TODO.md)

---

**🎯 Focus actuel** : 
1. **IMMÉDIAT** : Phase 14 (Frontend Historique Commandes) - Page /orders pour clients
2. **Prochaine étape** : Phase 12.4 (Amélioration page Order Confirmation)
3. **Objectif Février 2025** : Site Reboul (catégorie enfants) prêt à la vente + Admin Centrale connectée
4. **Post-Février** : Ajout collection réelle via Admin → CP Company → Outlet
5. **Home & Design** : Améliorations progressives au fil du temps
