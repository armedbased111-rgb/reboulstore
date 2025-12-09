# 🏪 Reboul Store - Contexte du Projet

**Version** : 0.10.0  
**Phase actuelle** : Phase 8 complétée - Prochaine : Phase 9 (Backend Auth)

---

## 📋 Vue d'ensemble

**Reboul Store** est un site e-commerce français spécialisé dans la vente de vêtements, sneakers et accessoires pour adultes et enfants. C'est un concept-store positionné sur la mode premium / streetwear, avec un ton moderne et lifestyle.

### 🏬 Structure Multi-Shops

Le site gère **4 shops distincts** :

1. **Reboul Adult** : Vêtements et accessoires pour adultes (mixte)
2. **Reboul Kids** ("Les Minots de Reboul") : Vêtements et accessoires pour enfants
3. **Reboul Sneakers** : Chaussures de sport
4. **C.P.COMPANY Marseille** : Franchise avec droits de vente en ligne

**Architecture** : Approche multi-tenant avec entité `Shop` pour séparer produits et catégories par shop.

**Panier** : Universel (articles de plusieurs shops), groupé par shop à l'affichage.

**Paiements** : Répartis via **Stripe Connect** (chaque shop a son compte Stripe).

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

## ✅ État actuel (Version 0.10.0)

### Backend complété ✅
- ✅ **Infrastructure** : Docker + PostgreSQL + NestJS configurés
- ✅ **Entités** : Category, Product, Image, Variant, Cart, CartItem, Order, Shop
- ✅ **Modules API** :
  - Categories (CRUD + slug)
  - Products (CRUD + filtres + pagination + variants + images + upload local)
  - Cart (gestion complète avec session)
  - Orders (création + statuts + vérification stock)
  - Shops (CRUD + politiques)
- ✅ **Relations** : Toutes les relations TypeORM configurées
- ✅ **Politiques** : Shop avec shippingPolicy et returnPolicy (jsonb)
- ✅ **Size charts** : Category + Product (override possible)
- ✅ **Upload images** : Multer + stockage local (à migrer vers Cloudinary)

### Frontend complété ✅
- ✅ **Infrastructure** : Vite + React + TailwindCSS v4 + Docker
- ✅ **Routing** : React Router (/, /catalog, /product/:id, /cart, /checkout, /about)
- ✅ **Services API** : products, categories, cart, orders
- ✅ **Hooks** : useProducts, useProduct, useCategories, useCart, useLocalStorage
- ✅ **Layout** : Header (mega menu catégories + recherche + badge panier) + Footer (style A-COLD-WALL*)
- ✅ **Pages** :
  - **Home** : HeroSectionImage, HeroSectionVideo, CategorySection, FeaturedProducts, PromoCard
  - **Catalog** : ProductGrid, ProductCard, filtres par catégorie
  - **Product** : ProductGallery (Swiper), ProductInfo, VariantSelector, AddToCartButton, ProductTabs (Details, Sizing, Shipping, Returns avec logique d'héritage)
- ✅ **Composants** : Style A-COLD-WALL* minimaliste premium
- ✅ **Responsive** : Mobile-first avec breakpoints TailwindCSS

### 🔄 En attente
- ⏸️ **Politiques** : Validation finale avec direction (voir `POLICIES_TODO.md`)
- ⏸️ **Admin Panel** : À créer (Phase 17)
- ⏸️ **Auth** : JWT + OAuth à implémenter (Phase 9-10)
- ⏸️ **Panier/Checkout UI** : À créer (Phase 12)
- ⏸️ **Paiement Stripe** : À intégrer (Phase 13)
- ⏸️ **Cloudinary** : Migration upload images (Phase 15)

---

## 🗺️ Roadmap & Prochaines Étapes

**📌 Roadmap complète détaillée** : [`ROADMAP_COMPLETE.md`](./ROADMAP_COMPLETE.md)

### 🔴 Priorité 1 - MVP E-commerce (Phases 9-14)

**Objectif** : Site e-commerce fonctionnel de bout en bout

1. **Phase 9** : Backend - Auth & Users (JWT + OAuth Google/Apple)
2. **Phase 10** : Frontend - Auth UI (Login, Register, Profil)
3. **Phase 11** : Backend - Commandes complètes (cycle de vie, stock, emails)
4. **Phase 12** : Frontend - Panier & Checkout complet
5. **Phase 13** : Backend - Stripe + Stripe Connect (paiements multi-shops)
6. **Phase 14** : Frontend - Historique commandes

### 🟡 Priorité 2 - Gestion & Admin (Phases 15-17)

7. **Phase 15** : Backend - Cloudinary (upload images optimisées)
8. **Phase 16** : Backend - Admin & Permissions (rôles, CRUD admin)
9. **Phase 17** : Frontend - Admin Panel (gestion produits/commandes/users)

### 🟢 Priorité 3 - Fonctionnalités avancées (Phases 18-19)

10. Recherche avancée, Wishlist, Reviews, Promotions, WebSockets, SMS, Redis
11. Pages vitrine (About, Contact, Stores, Shipping/Returns, CGV)

### 🔵 Priorité 4 - Optimisation & Production (Phases 20-24)

12. Automatisation (n8n), Tests, SEO, Performance, Déploiement, Analytics

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
- **Workflow** : Création directe en React/TailwindCSS (pas de maquettes)
- **Style** : Noir/blanc/gris + accent rouge, espacement généreux
- **Typo** : Geist (texte-h1, texte-h2, texte-t2, texte-t3, texte)
- **Images** : Lazy loading, gestion erreurs, placeholder

### 🛍️ Fonctionnalités Métier
- **Multi-shops** : 4 shops, panier universel groupé par shop
- **Promotions** : Codes promo, flash sales (24h/48h)
- **Avis produits** : Ouverts à tous, auto-publication
- **Stocks** : Alerte stock faible à 5 unités, notifications admin
- **Images produits** : Max 7 images, 1200x1200px, JPG/PNG/WebP
- **Politiques** : Livraison/retour par shop (jsonb)
- **Size charts** : Par catégorie (override par produit possible)

### 🔗 Intégrations
- **Paiement** : Stripe + Stripe Connect (répartition multi-shops)
- **Auth** : JWT + OAuth (Google, Apple)
- **Images** : Cloudinary (CDN, optimisation)
- **Emails** : Nodemailer (confirmation commande, tracking, etc.)
- **SMS** : Twilio/Vonage (reset password)
- **Temps réel** : WebSockets (notifications, chat live)
- **Automatisation** : n8n (remboursements, workflows)
- **Analytics** : Google Analytics 4
- **Chat** : Chatbot IA (Elevenlabs UI) 24/7

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

**🎯 Focus actuel** : Passer à la Phase 9 (Backend Auth & Users) pour débloquer le tunnel d'achat complet.
