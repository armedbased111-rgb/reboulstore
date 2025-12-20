# 📦 Template de Contexte Projet E-commerce

**Version** : 1.0  
**Date** : 12 décembre 2025  
**Usage** : Template réutilisable pour nouveaux projets e-commerce

---

## 🎯 Objectif de ce document

Ce document sert de **template de contexte** pour exporter/réutiliser toute la méthodologie, architecture, workflows et règles de travail développées pour le projet Reboul Store, afin de les appliquer à de nouveaux projets e-commerce.

**Comment utiliser** :
1. Copier ce fichier dans votre nouveau projet
2. Remplacer les sections spécifiques au projet (nom, domaine, etc.)
3. Adapter selon les besoins du nouveau projet
4. Utiliser comme référence pour l'IA et l'équipe

---

## 🏗️ Architecture Technique Standard

### Stack Backend (Standard E-commerce)

- **Framework** : NestJS
- **ORM** : TypeORM
- **BDD** : PostgreSQL
- **Auth** : JWT + OAuth (Google, Apple) - optionnel
- **Paiement** : Stripe + Stripe Connect
- **Images** : Cloudinary (max 7 images/produit, 1200x1200px)
- **Emails** : Nodemailer
- **SMS** : Twilio/Vonage (réinitialisation mot de passe) - optionnel
- **Temps réel** : WebSockets (Socket.io) - optionnel
- **Automatisation** : n8n (remboursements, workflows) - optionnel
- **Cache** : Redis (optionnel)
- **Docker** : Containerisation complète

### Stack Frontend (Standard E-commerce)

- **Build** : Vite
- **Framework** : React (TypeScript)
- **Styling** : TailwindCSS v4
- **Composants UI** : shadcn/ui
- **Typo** : Geist (ou autre selon projet)
- **Design** : Mobile-first
- **Animations** : GSAP (GreenSock Animation Platform)
- **Docker** : Containerisation

### Architecture Multi-Sites (Optionnel)

Si plusieurs sites e-commerce à gérer :

```
📦 Architecture Docker Complète
│
├── 🏪 site1/ (Projet 1)
│   ├── backend/ (NestJS)
│   ├── frontend/ (React + Vite + TailwindCSS)
│   └── postgres/ (Database Site 1)
│
├── 🏪 site2/ (Projet 2)
│   ├── backend/ (NestJS)
│   ├── frontend/ (React + Vite + TailwindCSS)
│   └── postgres/ (Database Site 2)
│
└── 🎛️ admin-central/ (Application Admin Centralisée)
    ├── frontend/ (React + Vite + GeistUI)
    ├── backend/ (NestJS)
    └── 🔌 Connexions aux databases
```

**Principe** : Isolation totale - chaque site a sa propre base de données, backend et frontend.

---

## 📁 Structure Standard des Projets

### Structure Backend (NestJS)

```
backend/
├── src/
│   ├── modules/          # Modules NestJS
│   │   ├── products/     # Module produits
│   │   ├── categories/   # Module catégories
│   │   ├── cart/         # Module panier
│   │   ├── orders/       # Module commandes
│   │   ├── auth/         # Module authentification
│   │   ├── users/        # Module utilisateurs
│   │   ├── brands/       # Module marques (optionnel)
│   │   └── shops/        # Module boutiques (optionnel)
│   ├── entities/         # Entités TypeORM
│   │   ├── product.entity.ts
│   │   ├── category.entity.ts
│   │   ├── variant.entity.ts
│   │   ├── image.entity.ts
│   │   ├── cart.entity.ts
│   │   ├── cart-item.entity.ts
│   │   ├── order.entity.ts
│   │   ├── user.entity.ts
│   │   ├── address.entity.ts
│   │   └── brand.entity.ts (optionnel)
│   ├── config/           # Configuration
│   │   ├── database.config.ts
│   │   └── email.config.ts
│   ├── templates/        # Templates emails
│   │   └── emails/
│   └── main.ts
├── Dockerfile
├── docker-entrypoint.sh
├── package.json
└── .env
```

### Structure Frontend (React)

```
frontend/
├── src/
│   ├── pages/            # Pages principales
│   │   ├── Home.tsx
│   │   ├── Catalog.tsx
│   │   ├── Product.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Profile.tsx
│   │   └── Orders.tsx
│   ├── components/       # Composants réutilisables
│   │   ├── layout/       # Layout (Header, Footer)
│   │   ├── product/      # Composants produits
│   │   ├── cart/         # Composants panier
│   │   ├── ui/           # Composants UI génériques
│   │   └── ui/shadcn/    # Composants shadcn/ui
│   ├── services/         # Services API
│   │   ├── api.ts        # Client API
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   ├── cart.ts
│   │   ├── auth.ts
│   │   └── orders.ts
│   ├── hooks/            # Custom hooks
│   ├── contexts/         # Contextes React
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── types/            # Types TypeScript
│   ├── animations/       # Animations GSAP
│   │   ├── index.ts
│   │   ├── presets/      # Animations réutilisables
│   │   └── components/   # Animations spécifiques
│   ├── utils/            # Utilitaires
│   └── App.tsx
├── Dockerfile
├── vite.config.ts
├── package.json
└── .env
```

---

## 🗄️ Modèles de Données Standard (Entités)

### Entités Principales E-commerce

#### Product (Produit)
- `id` : UUID
- `name` : string
- `description` : text
- `price` : decimal
- `categoryId` : UUID (relation)
- `brandId` : UUID (relation, optionnel)
- `shopId` : UUID (relation, optionnel)
- `images` : relation OneToMany (Image)
- `variants` : relation OneToMany (Variant)
- `createdAt` : timestamp
- `updatedAt` : timestamp

#### Category (Catégorie)
- `id` : UUID
- `name` : string
- `slug` : string (unique)
- `description` : text
- `imageUrl` : string (nullable)
- `videoUrl` : string (nullable, priorité sur image)
- `products` : relation OneToMany (Product)
- `createdAt` : timestamp
- `updatedAt` : timestamp

#### Variant (Variante)
- `id` : UUID
- `productId` : UUID (relation)
- `color` : string
- `size` : string
- `stock` : number
- `sku` : string (unique)
- `price` : decimal (optionnel, hérite de Product si null)
- `createdAt` : timestamp
- `updatedAt` : timestamp

#### Image (Image)
- `id` : UUID
- `productId` : UUID (relation)
- `url` : string
- `alt` : string
- `order` : number
- `createdAt` : timestamp

#### Cart (Panier)
- `id` : UUID
- `sessionId` : string (ou userId si auth)
- `userId` : UUID (nullable, relation User)
- `items` : relation OneToMany (CartItem)
- `createdAt` : timestamp
- `updatedAt` : timestamp

#### CartItem (Article panier)
- `id` : UUID
- `cartId` : UUID (relation)
- `variantId` : UUID (relation)
- `quantity` : number
- `createdAt` : timestamp

#### Order (Commande)
- `id` : UUID
- `cartId` : UUID (relation)
- `userId` : UUID (nullable, relation User)
- `status` : enum (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- `total` : decimal
- `customerInfo` : JSONB (email, nom, prénom, adresse, etc.)
- `stripePaymentIntentId` : string (optionnel)
- `createdAt` : timestamp
- `updatedAt` : timestamp

#### User (Utilisateur)
- `id` : UUID
- `email` : string (unique)
- `password` : string (hashé)
- `firstName` : string
- `lastName` : string
- `phone` : string (nullable)
- `role` : enum (CLIENT, ADMIN, SUPER_ADMIN)
- `addresses` : relation OneToMany (Address)
- `orders` : relation OneToMany (Order)
- `createdAt` : timestamp
- `updatedAt` : timestamp

#### Address (Adresse)
- `id` : UUID
- `userId` : UUID (relation)
- `type` : enum (BILLING, SHIPPING)
- `street` : string
- `city` : string
- `zipCode` : string
- `country` : string
- `isDefault` : boolean
- `createdAt` : timestamp
- `updatedAt` : timestamp

#### Brand (Marque) - Optionnel
- `id` : UUID
- `name` : string
- `slug` : string (unique)
- `description` : text
- `logoUrl` : string
- `megaMenuImage1` : string (nullable)
- `megaMenuImage2` : string (nullable)
- `products` : relation OneToMany (Product)
- `createdAt` : timestamp
- `updatedAt` : timestamp

---

## 🔌 Endpoints API Standard

### Produits
- `GET /products` : Liste des produits (filtres, pagination)
- `GET /products/:id` : Détails d'un produit
- `GET /products/category/:categoryId` : Produits par catégorie
- `POST /products` : Créer un produit (admin)
- `PATCH /products/:id` : Modifier un produit (admin)
- `DELETE /products/:id` : Supprimer un produit (admin)

### Variantes
- `GET /products/:id/variants` : Liste des variantes
- `GET /products/:productId/variants/:variantId` : Détails d'une variante
- `POST /products/:id/variants` : Créer une variante (admin)
- `PATCH /products/:productId/variants/:variantId` : Mettre à jour (admin)
- `GET /products/:productId/variants/:variantId/stock?quantity=X` : Vérifier stock

### Images
- `GET /products/:id/images` : Liste des images
- `POST /products/:id/images` : Uploader une image (admin, form-data)
- `DELETE /products/:productId/images/:imageId` : Supprimer (admin)
- `PATCH /products/:productId/images/:imageId/order` : Mettre à jour l'ordre (admin)

### Catégories
- `GET /categories` : Liste des catégories
- `GET /categories/:id` : Détails d'une catégorie
- `GET /categories/slug/:slug` : Détails par slug
- `POST /categories` : Créer (admin)
- `PATCH /categories/:id` : Modifier (admin)
- `DELETE /categories/:id` : Supprimer (admin)

### Panier
- `GET /cart?sessionId=X` : Récupérer le panier
- `POST /cart/items` : Ajouter un article (body: {variantId, quantity})
- `PUT /cart/items/:id` : Modifier la quantité (body: {quantity})
- `DELETE /cart/items/:id` : Retirer un article
- `DELETE /cart?sessionId=X` : Vider le panier

### Commandes
- `POST /orders` : Créer une commande (body: {cartId, customerInfo})
- `GET /orders/:id` : Détails d'une commande
- `GET /orders` : Liste des commandes (user ou admin)
- `PATCH /orders/:id/status` : Mettre à jour le statut (admin)

### Authentification
- `POST /auth/register` : Créer un compte
- `POST /auth/login` : Se connecter
- `POST /auth/logout` : Se déconnecter
- `GET /auth/me` : Récupérer l'utilisateur connecté
- `POST /auth/forgot-password` : Demander reset password
- `POST /auth/reset-password` : Réinitialiser password

### Utilisateurs
- `GET /users/:id` : Détails d'un utilisateur
- `PATCH /users/:id` : Modifier un utilisateur
- `GET /users/:id/addresses` : Liste des adresses
- `POST /users/:id/addresses` : Créer une adresse
- `PATCH /users/:userId/addresses/:addressId` : Modifier une adresse
- `DELETE /users/:userId/addresses/:addressId` : Supprimer une adresse

---

## 🎨 Workflow Design (Figma → Code)

### Philosophie
**Design d'abord, code ensuite** : Créer une maquette Figma claire avant d'écrire une ligne de code.

### Quand utiliser Figma ?

**✅ TOUJOURS pour** :
- Nouvelles pages complètes (Login, Register, Profile, Checkout, Admin)
- Composants UI complexes (formulaires multi-étapes, modales custom)
- Nouveaux layouts (refonte Header, nouvelle section Home)
- Modifications importantes de design

**❌ PAS nécessaire pour** :
- Corrections mineures (couleur, padding)
- Composants shadcn/ui standards
- Fix bugs techniques
- Optimisations de performance

### Processus (4 Phases)

#### Phase 1 : Design dans Figma
1. Consulter roadmap : Quelle page/composant à faire ?
2. Créer/ouvrir fichier Figma du projet
3. Designer la page/composant (respecter design system)
4. Utiliser Auto Layout (≈ Flexbox)
5. Créer les 3 breakpoints : Mobile (375px), Tablet (768px), Desktop (1440px)
6. Designer les états (hover, active, disabled, error)
7. Partager le lien Figma avec contexte

#### Phase 2 : Implémentation Code
1. Analyser le design Figma
2. Identifier composants shadcn/ui à utiliser
3. Planifier structure (composants, props, state)
4. Coder avec React + shadcn + TailwindCSS
5. **⚠️ IMPORTANT** : Ne PAS utiliser l'export Figma tel quel, recoder proprement

#### Phase 3 : Validation & Ajustements
1. Comparer visuellement avec Figma
2. Tester responsive (mobile, tablet, desktop)
3. Tester interactions (hover, focus, etc.)
4. Ajuster code ou Figma selon besoin
5. Itérer jusqu'à satisfaction

#### Phase 4 : Documentation
1. Mettre à jour roadmap (cocher tâche)
2. Mettre à jour documentation frontend
3. Capturer screenshot si nécessaire

### Plugins Figma Recommandés
- **Iconify** : Bibliothèque d'icônes
- **Unsplash** : Photos gratuites
- **A11y - Color Contrast Checker** : Accessibilité
- **Tailwind CSS** : Générer classes Tailwind
- **Anima / Figma to Code** : Inspiration structure (pas production)

---

## 🎬 Workflow Animations GSAP

### Philosophie
- **Réutilisabilité** : Chaque animation dans un fichier dédié
- **Cohérence** : Utiliser des constantes (durées, eases)
- **Performance** : GSAP garantit 60fps
- **Documentation** : JSDoc pour chaque animation

### Structure
```
frontend/src/animations/
├── index.ts                 # Export centralisé
├── presets/                 # Animations réutilisables
│   ├── fade-in.ts
│   ├── slide-up.ts
│   └── scale-hover.ts
├── components/              # Animations spécifiques
│   └── [ComponentName]/
│       └── [animation].ts
└── utils/
    ├── gsap-helpers.ts      # Hook useGSAP
    └── constants.ts         # Durées, eases, délais standards
```

### Processus de création
1. Décider du type (réutilisable → `presets/`, spécifique → `components/`)
2. Créer le fichier (nommer en `kebab-case.ts`)
3. Exporter fonction nommée `animate[NomAnimation]`
4. Documenter avec JSDoc
5. Utiliser constantes (durées, eases)
6. Exporter dans `animations/index.ts`
7. Utiliser dans composant avec `useRef` + `useEffect` ou `useGSAP`

### Bonnes pratiques
- ✅ Toujours créer animations réutilisables dans `presets/`
- ✅ Utiliser `useGSAP` hook ou `gsap.context()` pour nettoyage
- ✅ Respecter constantes définies
- ✅ Documenter avec JSDoc
- ✅ Respecter `prefers-reduced-motion` pour accessibilité
- ❌ Ne pas dupliquer code d'animation dans plusieurs composants
- ❌ Ne pas oublier nettoyage au démontage

---

## 📋 Méthodologie de Développement

### Modes de Travail

#### Mode Pédagogique (Par défaut)
**Philosophie** : Apprendre à coder, pas juste recevoir du code

**Processus** :
1. L'IA donne le code à écrire avec explications détaillées
2. L'IA explique ce qu'on fait et pourquoi
3. Le développeur code les fichiers lui-même
4. L'IA vérifie le code une fois terminé
5. On corrige ensemble jusqu'à réussir

**Exception - Bibliothèques de composants** :
- Si utilisation de shadcn/ui, Material-UI, etc.
- Le développeur fournit les composants/imports nécessaires
- L'IA les intègre dans le code

#### Mode Normal
- À utiliser uniquement si demandé explicitement
- L'IA code directement à la place du développeur
- Cas d'usage : Pages complexes, composants avec logique métier, intégration API

### Organisation par Roadmap

**Principe** : Tout le projet organisé via une roadmap détaillée

#### Structure Roadmap Standard
```markdown
# 🗺️ Roadmap Complète - [Nom Projet]

**Version** : X.X
**Date** : [Date]
**Approche** : Backend ↔ Frontend alternés, fonctionnalités complètes

## 🎯 OBJECTIF [Date]
[Objectif principal du projet]

## 🎯 Principes de cette roadmap
1. **Alternance Backend ↔ Frontend**
2. **Fonctionnalités complètes**
3. **Incrémental**
4. **MVP First**

## ✅ Phase X : [Nom Phase]
### X.1 Backend - [Module]
- [ ] Tâche 1
- [ ] Tâche 2

### X.2 Frontend - [Page/Composant]
- [ ] Tâche 1
- [ ] Tâche 2
```

#### Règle OBLIGATOIRE : Mise à jour Roadmap
- **À CHAQUE étape complétée** : Cocher `[ ]` → `[x]` immédiatement
- **À CHAQUE phase terminée** : Ajouter ✅ au titre de la phase
- **Avant de commencer une nouvelle phase** : Vérifier roadmap pour savoir quoi faire
- **Après chaque session** : Mettre à jour l'avancement

**ROADMAP = source de vérité du projet**

### Documentation Continue

#### Fichiers à maintenir
1. **ROADMAP_COMPLETE.md** ⭐ **RÉFÉRENCE PRINCIPALE**
   - Roadmap détaillée de toutes les phases
   - Cocher les tâches complétées
   - Mettre à jour après chaque tâche

2. **CONTEXT.md**
   - Contexte général du projet
   - Architecture globale
   - État actuel

3. **ARCHITECTURE_[NOM].md**
   - Architecture complète (multi-sites, admin, etc.)
   - Référence architecture

4. **frontend/FRONTEND.md**
   - Documentation frontend (pages, composants, services)
   - État actuel, roadmap frontend

5. **backend/BACKEND.md**
   - Documentation backend (modules, endpoints, entités)
   - État actuel, roadmap backend

6. **API_CONFIG.md**
   - Configuration API centralisée (ports, endpoints, variables d'environnement)

7. **FIGMA_WORKFLOW.md**
   - Workflow Figma → Code complet

8. **ANIMATIONS_GUIDE.md**
   - Guide complet animations GSAP

#### Processus de documentation
1. **Avant de commencer** :
   - ✅ Consulter ROADMAP_COMPLETE.md (obligatoire)
   - ✅ Consulter CONTEXT.md pour l'état actuel
   - ✅ Consulter FRONTEND.md ou BACKEND.md selon contexte

2. **Pendant le développement** :
   - Noter les changements et nouvelles fonctionnalités

3. **Après chaque étape** :
   - ✅ **Mettre à jour ROADMAP_COMPLETE.md** (obligatoire)
   - ✅ Mettre à jour CONTEXT.md si fin de phase
   - ✅ Mettre à jour FRONTEND.md ou BACKEND.md

---

## 🔧 Configuration Standard

### Variables d'environnement Backend

```env
# Serveur
PORT=3001
NODE_ENV=development

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=[nom_projet]_db

# JWT Auth
JWT_SECRET=your-secret-key-change-in-production

# Frontend (CORS)
FRONTEND_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLIC_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
```

### Variables d'environnement Frontend

```env
# API Backend URL
VITE_API_BASE_URL=http://localhost:3001
```

**⚠️ IMPORTANT** :
- Utiliser UNIQUEMENT `VITE_API_BASE_URL` dans tout le frontend
- Toujours préfixer avec `VITE_` pour que Vite les expose au client

### Ports Standard

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | `http://localhost:3000` |
| Backend | 3001 | `http://localhost:3001` |
| PostgreSQL | 5432 | `localhost:5432` |

---

## 📝 Conventions de Code

### Backend (NestJS)

#### Structure Module
```typescript
// modules/[nom]/[nom].module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Entity])],
  controllers: [Controller],
  providers: [Service],
  exports: [Service],
})
export class Module {}

// modules/[nom]/[nom].service.ts
@Injectable()
export class Service {
  constructor(
    @InjectRepository(Entity)
    private repository: Repository<Entity>,
  ) {}
}

// modules/[nom]/[nom].controller.ts
@Controller('[route]')
export class Controller {
  constructor(private service: Service) {}
}
```

#### Conventions
- **Modules** : Un module par domaine (products, categories, cart, etc.)
- **Entités** : Un fichier par entité dans `entities/`
- **DTOs** : Créer DTOs pour toutes les opérations (Create, Update, Query)
- **Validation** : Utiliser class-validator dans les DTOs
- **Erreurs** : Gérer les erreurs avec des exceptions NestJS appropriées

### Frontend (React)

#### Structure Composant
```typescript
// components/[nom]/[Nom].tsx
import { useState, useEffect } from 'react';
import { useService } from '../../hooks/useService';

interface Props {
  // Props typées
}

export const Component = ({ prop }: Props) => {
  // Hooks
  // State
  // Effects
  // Handlers
  
  return (
    // JSX
  );
};
```

#### Conventions
- **Composants** : PascalCase pour noms de fichiers et composants
- **Hooks** : camelCase avec préfixe `use` (ex: `useProducts`, `useAuth`)
- **Services** : camelCase (ex: `products.ts`, `auth.ts`)
- **Types** : PascalCase (ex: `Product`, `User`)
- **Props** : Toujours typer avec TypeScript
- **Imports** : Organiser par catégories (React, libs, components, services, utils)

---

## 🚀 Checklist Démarrage Nouveau Projet

### Phase 1 : Initialisation
- [ ] Créer structure de dossiers (backend/, frontend/)
- [ ] Initialiser NestJS backend
- [ ] Initialiser React frontend (Vite)
- [ ] Configurer Docker (docker-compose.yml)
- [ ] Configurer PostgreSQL
- [ ] Configurer variables d'environnement (.env)

### Phase 2 : Configuration Base
- [ ] Configurer TypeORM dans NestJS
- [ ] Créer entités de base (Product, Category, Variant, Image, Cart, Order, User)
- [ ] Configurer CORS backend
- [ ] Configurer service API frontend
- [ ] Tester connexion frontend ↔ backend

### Phase 3 : Documentation
- [ ] Créer ROADMAP_COMPLETE.md (copier template)
- [ ] Créer CONTEXT.md
- [ ] Créer ARCHITECTURE_[NOM].md si multi-sites
- [ ] Créer API_CONFIG.md
- [ ] Créer frontend/FRONTEND.md
- [ ] Créer backend/BACKEND.md
- [ ] Créer FIGMA_WORKFLOW.md
- [ ] Créer ANIMATIONS_GUIDE.md

### Phase 4 : Design System
- [ ] Définir palette de couleurs
- [ ] Définir typographie
- [ ] Configurer TailwindCSS
- [ ] Installer shadcn/ui
- [ ] Créer composants de base (Button, Input, Card)

### Phase 5 : Première Fonctionnalité
- [ ] Backend : Module Products (CRUD)
- [ ] Frontend : Page Catalog avec liste produits
- [ ] Tester end-to-end
- [ ] Documenter dans roadmap

---

## 📚 Ressources & Références

### Documentation Officielle
- [NestJS](https://docs.nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [GSAP](https://greensock.com/docs/)

### Outils
- [Figma](https://www.figma.com/) - Design
- [PostgreSQL](https://www.postgresql.org/) - Base de données
- [Docker](https://www.docker.com/) - Containerisation
- [Stripe](https://stripe.com/) - Paiement
- [Cloudinary](https://cloudinary.com/) - Images

---

## 🎯 Adaptation pour Nouveau Projet

### Étapes d'adaptation

1. **Copier ce fichier** dans le nouveau projet
2. **Remplacer** :
   - Nom du projet
   - Domaine spécifique
   - Stack technique si différent
   - Ports si différents
   - Entités spécifiques au projet

3. **Adapter** :
   - Architecture selon besoins (multi-sites ou non)
   - Modules backend selon fonctionnalités
   - Pages frontend selon besoins
   - Design system selon identité visuelle

4. **Créer roadmap** :
   - Copier structure de ROADMAP_COMPLETE.md
   - Adapter phases selon fonctionnalités du projet
   - Définir objectifs et priorités

5. **Configurer** :
   - Variables d'environnement
   - Docker
   - Base de données
   - Services externes (Stripe, Cloudinary, etc.)

---

**📦 Ce template est votre référence pour démarrer tout nouveau projet e-commerce avec la même méthodologie et qualité !**

