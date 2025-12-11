# 🏪 Reboul Store - Contexte du Projet

**Version** : 0.18.0  
**Phase actuelle** : Phase 10.3 COMPLÈTE (Login + Register + Profile terminés) ✅ - Prochaine : Phase 10.4 (Protection routes)
**Objectif Février 2025** : Lancement site Reboul avec première collection

---

## 📋 Vue d'ensemble

**Reboul Store** est un site e-commerce français spécialisé dans la vente de vêtements, sneakers et accessoires. C'est un concept-store positionné sur la mode premium / streetwear, avec un ton moderne et lifestyle.

### 🏗️ Architecture Multi-Sites

Le projet prévoit **3 sites e-commerce indépendants** gérés depuis une **Admin Centrale** :

1. **Reboul** (🎯 Priorité actuelle - Février 2025)
   - Catégorie : **Enfants** uniquement
   - Première collection prête à la vente
   - Backend + Frontend + Database dédiés
   
2. **CP Company** (🔜 Futur - Après lancement Reboul)
   - Site indépendant
   - Backend + Frontend + Database dédiés
   
3. **Outlet** (🔜 Futur - Après CP Company)
   - Site déstockage/promotions
   - Backend + Frontend + Database dédiés

### 🎛️ Admin Centrale

**Application admin unifiée** pour gérer les 3 sites :
- Interface unique de gestion
- Connexion aux backends des 3 sites
- Gestion produits, commandes, clients pour chaque site
- À créer en priorité (Phase 17) pour être connectée à Reboul

### 🏛️ Architecture Technique

**Chaque site est complètement autonome** :
```
Site = Frontend (React) + Backend (NestJS) + Database (PostgreSQL)
```

**Avantages** :
- ✅ **Stabilité** : Si un site crash, les autres continuent
- ✅ **Scalabilité** : Chaque site évolue indépendamment
- ✅ **Isolation** : Base de données séparée par site
- ✅ **Docker** : Chaque site dans son propre container

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
reboulstore/
├── backend/              # API NestJS + TypeORM
├── frontend/             # E-commerce React + Vite + TailwindCSS
├── admin/                # Admin Panel séparé
├── docker/               # Configuration Docker
├── CONTEXT.md            # Ce fichier (contexte général)
├── ROADMAP_COMPLETE.md   # Roadmap détaillée complète
├── POLICIES_TODO.md      # Note pour finaliser politiques livraison/retour
├── FRONTEND.md           # Documentation frontend détaillée
└── BACKEND.md            # Documentation backend détaillée
```

---

## ✅ État actuel (Version 0.14.0)

### Backend complété ✅
- ✅ **Infrastructure** : Docker + PostgreSQL + NestJS configurés
- ✅ **Entités** : Category, Product, Image, Variant, Cart, CartItem, Order, Shop, Brand, **User, Address**
- ✅ **Modules API** :
  - Categories (CRUD + slug + videoUrl + sizeChart)
  - Products (CRUD + filtres + pagination + variants + images + upload local + filtre brand)
  - Cart (gestion complète avec session)
  - Orders (création + statuts + vérification stock)
  - Shops (CRUD + politiques)
  - Brands (CRUD + slug + images/vidéos mega menu)
  - **Auth (register, login, JWT, guards)**
  - **Users (profil, adresses CRUD)**
- ✅ **Authentification** : JWT complète (tokens 7 jours, bcrypt, guards)
- ✅ **Sécurité** : Passwords hachés, jamais retournés, routes protégées
- ✅ **Relations** : Toutes les relations TypeORM (User → Addresses, User → Orders)
- ✅ **Politiques** : Shop avec shippingPolicy et returnPolicy (jsonb)
- ✅ **Size charts** : Category + Product (override possible)
- ✅ **Upload images** : Multer + stockage local (à migrer vers Cloudinary)

### Frontend complété ✅
- ✅ **Infrastructure** : Vite + React + TailwindCSS v4 + Docker
- ✅ **Routing** : React Router (/, /catalog, /product/:id, /cart, /checkout, /about, /login, /register, /profile, /test-auth)
- ✅ **Services API** : products, categories, cart, orders, brands, **auth**
- ✅ **Hooks** : useProducts, useProduct, useCategories, useCart, useBrands, useLocalStorage, **useAuth**
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
- 🔄 **Page Profil complète** : Édition infos, gestion adresses CRUD (Phase 10.3)
- ⏸️ **Forgot/Reset Password** : Pages reset mot de passe (Phase 18 - avancé)
- ⏸️ **OAuth Google/Apple** : Authentification sociale (Phase 18 - avancé)
- ⏸️ **Politiques** : Validation finale avec direction (voir `POLICIES_TODO.md`)
- ⏸️ **Admin Panel** : À créer (Phase 17)
- ⏸️ **Panier/Checkout UI** : À créer (Phase 12)
- ⏸️ **Paiement Stripe** : À intégrer (Phase 13)
- ⏸️ **Cloudinary** : Migration upload images (Phase 15)

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

**Objectif** : Créer l'admin et la connecter à Reboul

7. **Phase 15** : Backend - Cloudinary (upload images optimisées)
8. **Phase 16** : Backend - Admin & Permissions (rôles, CRUD admin)
9. **Phase 17** : Frontend - **Admin Centrale** (connectée à Reboul)

### 🟢 Priorité 3 - Après lancement Reboul

**Sites futurs** :
- CP Company (même structure que Reboul)
- Outlet (même structure que Reboul)
- Connecter les 3 sites à l'Admin Centrale

**Fonctionnalités avancées** :
- Recherche avancée, Wishlist, Reviews, Promotions, WebSockets, SMS, Redis
- Pages vitrine (About, Contact, Stores, Shipping/Returns, CGV)

### 🔵 Priorité 4 - Optimisation & Production

- Automatisation (n8n), Tests, SEO, Performance, Déploiement, Analytics

---

## 🎯 Prochaine Phase : Phase 9 - Backend Auth & Users

**Ce qu'on va faire** :
1. Créer entité User + Address
2. Module Auth (register, login, JWT, OAuth Google/Apple)
3. Module Users (profil, adresses, CRUD)
4. Guards & sécurité (rate limiting, validation email, reset password)

**Pourquoi maintenant ?**
- ✅ Essentiel pour checkout (user connecté)
- ✅ Bloquant pour historique commandes
- ✅ Base pour admin panel
- ✅ Permet de tester OAuth

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
- **Emails** : Nodemailer (confirmation commande, tracking, etc.) - À venir
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

- **Frontend** : Voir [`FRONTEND.md`](./frontend/FRONTEND.md)
- **Backend** : Voir [`BACKEND.md`](./backend/BACKEND.md)
- **Roadmap complète** : Voir [`ROADMAP_COMPLETE.md`](./ROADMAP_COMPLETE.md)
- **Politiques à finaliser** : Voir [`POLICIES_TODO.md`](./POLICIES_TODO.md)

---

**🎯 Focus actuel** : 
1. **IMMÉDIAT** : Phase 9 (Backend Auth & Users) - Démarrage maintenant 🚀
2. **Objectif Février 2025** : Site Reboul (catégorie enfants) prêt à la vente + Admin Centrale connectée
3. **Post-Février** : Ajout collection réelle via Admin → CP Company → Outlet
4. **Home & Design** : Améliorations progressives au fil du temps
