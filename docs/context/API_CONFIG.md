# 🌐 Configuration API - Reboul Store

Ce document centralise **TOUTES** les configurations API, variables d'environnement et ports utilisés dans le projet.

Voir aussi : [[ARCHITECTURE_ADMIN_CENTRAL.md|ARCHITECTURE_ADMIN_CENTRAL]] - [[CONTEXT.md|CONTEXT]] - [[../../backend/BACKEND.md|BACKEND]]

---

## 📊 Architecture & Ports

### Services

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Frontend Reboul** | 3000 | `http://localhost:3000` | Application React (Vite) |
| **Backend Reboul** | 3001 | `http://localhost:3001` | API NestJS |
| **PostgreSQL Reboul** | 5432 | `localhost:5432` | Base de données Reboul |
| **Frontend Admin** | 4000 | `http://localhost:4000` | Application Admin React (Vite) |
| **Backend Admin** | 4001 | `http://localhost:4001` | API Admin NestJS |

### CORS

**Backend Reboul** accepte les requêtes depuis :
- `http://localhost:3000` (Frontend Reboul dev)
- Configurable via `process.env.FRONTEND_URL`

**Backend Admin** accepte les requêtes depuis :
- `http://localhost:4000` (Frontend Admin dev)
- Configurable via `process.env.FRONTEND_URL`

---

## 🔧 Variables d'environnement

### Backend (`backend/.env`)

```env
# Serveur
PORT=3001
NODE_ENV=development

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=reboulstore_db

# JWT Auth
JWT_SECRET=your-secret-key-change-in-production

# Frontend (CORS)
FRONTEND_URL=http://localhost:3000

# Cloudinary (Phase 15+)
# CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=

# Stripe (Phase 13+)
# STRIPE_SECRET_KEY=
# STRIPE_PUBLIC_KEY=
# STRIPE_WEBHOOK_SECRET= (pour vérifier la signature des webhooks)

# Email (Phase 11+)
# SMTP_HOST=
# SMTP_PORT=
# SMTP_USER=
# SMTP_PASSWORD=
```

### Backend Admin (`admin-central/backend/.env`)

```env
# Serveur
PORT=4001
NODE_ENV=development

# Frontend (CORS)
FRONTEND_URL=http://localhost:4000

# Connexion Reboul Database (via réseau Docker)
REBOUL_DB_HOST=reboulstore-postgres
REBOUL_DB_PORT=5432
REBOUL_DB_USER=reboulstore
REBOUL_DB_PASSWORD=reboulstore_password
REBOUL_DB_NAME=reboulstore_db

# Connexion CP Company Database (FUTUR - Commenté)
# CPCOMPANY_DB_HOST=cpcompany-postgres
# CPCOMPANY_DB_PORT=5433
# CPCOMPANY_DB_USER=cpcompany
# CPCOMPANY_DB_PASSWORD=cpcompany_password
# CPCOMPANY_DB_NAME=cpcompany_db

# Connexion Outlet Database (FUTUR - Commenté)
# OUTLET_DB_HOST=outlet-postgres
# OUTLET_DB_PORT=5434
# OUTLET_DB_USER=outlet
# OUTLET_DB_PASSWORD=outlet_password
# OUTLET_DB_NAME=outlet_db
```

---

### Frontend Reboul (`frontend/.env`)

```env
# API Backend URL
VITE_API_BASE_URL=http://localhost:3001
```

### Frontend Admin (`admin-central/frontend/.env`)

```env
# API Backend Admin URL
VITE_API_URL=http://localhost:4001
```

**⚠️ IMPORTANT** :
- **Utiliser UNIQUEMENT** `VITE_API_BASE_URL` dans tout le frontend
- **Ne PAS créer** de nouvelles variables comme `VITE_API_URL`, `VITE_BACKEND_URL`, etc.
- Toujours préfixer avec `VITE_` pour que Vite les expose au client

---

## 📁 Fichiers utilisant `VITE_API_BASE_URL`

Liste des fichiers qui utilisent la variable d'environnement :

| Fichier | Usage |
|---------|-------|
| `frontend/src/services/api.ts` | Service API général (products, categories, etc.) |
| `frontend/src/services/auth.ts` | Service API authentification |
| `frontend/src/utils/imageUtils.ts` | Construction URLs images |
| `frontend/src/components/TestApi.tsx` | Tests API |

**Convention** :
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
```

---

## 🔗 Endpoints API

### Backend Reboul

#### Base URL
```
http://localhost:3001
```

### Authentification

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/auth/register` | Inscription | ❌ |
| POST | `/auth/login` | Connexion | ❌ |
| GET | `/auth/me` | Profil user | ✅ JWT |

### Users

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/users/me` | Mon profil (avec adresses) | ✅ JWT |
| PATCH | `/users/me` | Modifier mon profil | ✅ JWT |
| GET | `/users/me/addresses` | Mes adresses | ✅ JWT |
| POST | `/users/me/addresses` | Créer adresse | ✅ JWT |
| PATCH | `/users/me/addresses/:id` | Modifier adresse | ✅ JWT |
| DELETE | `/users/me/addresses/:id` | Supprimer adresse | ✅ JWT |

### Products

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/products` | Liste produits | ❌ |
| GET | `/products/:id` | Détails produit | ❌ |
| POST | `/products` | Créer produit | ⚠️ Admin |
| PATCH | `/products/:id` | Modifier produit | ⚠️ Admin |
| DELETE | `/products/:id` | Supprimer produit | ⚠️ Admin |

### Categories

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/categories` | Liste catégories | ❌ |
| GET | `/categories/:id` | Détails catégorie | ❌ |
| POST | `/categories` | Créer catégorie | ⚠️ Admin |

### Brands

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/brands` | Liste marques | ❌ |
| GET | `/brands/:slug` | Détails marque | ❌ |
| POST | `/brands` | Créer marque | ⚠️ Admin |

### Cart

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/cart/:sessionId` | Panier par session | ❌ |
| POST | `/cart` | Ajouter au panier | ❌ |
| PATCH | `/cart/:id` | Modifier quantité | ❌ |
| DELETE | `/cart/:id` | Retirer du panier | ❌ |

### Orders

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/orders` | Créer commande | ❌ |
| GET | `/orders/me` | Mes commandes | ✅ JWT |
| GET | `/orders/:id` | Détails commande | ✅ JWT |

### Checkout

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/checkout/create-session` | Créer session Stripe Checkout | ✅ JWT |

### Shops

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/shops` | Liste shops | ❌ |
| GET | `/shops/:id` | Détails shop | ❌ |

**Légende** :
- ❌ : Pas d'authentification requise
- ✅ JWT : Token JWT requis
- ⚠️ Admin : Token JWT + rôle ADMIN/SUPER_ADMIN

---

## 🔗 Endpoints API Admin

### Backend Admin

#### Base URL
- **Développement** : `http://localhost:4001`
- **Production** : À définir

#### Endpoints disponibles

| Endpoint | Méthode | Description | Statut |
|----------|---------|-------------|--------|
| `/` | GET | Message de bienvenue | ✅ |
| `/health` | GET | Health check (status, message, timestamp) | ✅ |
| `/admin/reboul/products` | GET | Liste produits (pagination, filtres) | ✅ |
| `/admin/reboul/products/stats` | GET | Statistiques produits | ✅ |
| `/admin/reboul/products/:id` | GET | Détails produit | ✅ |
| `/admin/reboul/products` | POST | Créer produit | ✅ |
| `/admin/reboul/products/:id` | PATCH | Modifier produit | ✅ |
| `/admin/reboul/products/:id` | DELETE | Supprimer produit | ✅ |
| `/admin/reboul/orders` | GET | Liste commandes (pagination, filtres) | ✅ |
| `/admin/reboul/orders/stats` | GET | Statistiques commandes | ✅ |
| `/admin/reboul/orders/:id` | GET | Détails commande | ✅ |
| `/admin/reboul/orders/:id/status` | PATCH | Changer statut commande | ✅ |
| `/admin/reboul/orders/:id/tracking` | POST | Ajouter tracking | ✅ |
| `/admin/reboul/users` | GET | Liste utilisateurs (pagination, filtres) | ✅ |
| `/admin/reboul/users/stats` | GET | Statistiques utilisateurs | ✅ |
| `/admin/reboul/users/:id` | GET | Détails utilisateur | ✅ |
| `/admin/reboul/users/:id/role` | PATCH | Changer rôle utilisateur | ✅ |
| `/admin/reboul/users/:id` | DELETE | Supprimer utilisateur | ✅ |
| `/admin/reboul/stocks` | GET | Liste stocks (filtres) | ✅ |
| `/admin/reboul/stocks/stats` | GET | Statistiques stocks | ✅ |
| `/admin/reboul/stocks/:variantId` | GET | Détails stock variant | ✅ |
| `/admin/reboul/stocks/:variantId` | PATCH | Modifier stock variant | ✅ |
| `/admin/auth/register` | POST | Inscription admin | ✅ |
| `/admin/auth/login` | POST | Connexion admin (retourne JWT) | ✅ |
| `/admin/auth/me` | GET | Profil admin connecté (protégé) | ✅ |

---

## 🔐 Authentification Admin

### Format JWT Admin

Les tokens JWT admin sont envoyés dans le header :
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Stockage client
- **Token** : `localStorage` sous la clé `admin_auth_token` (à implémenter dans frontend)
- **Admin** : `localStorage` sous la clé `admin_user`

### Expiration
- **Token JWT** : 7 jours (configurable dans `admin-auth.module.ts`)

### Rôles Admin
- **ADMIN** : Gestionnaire standard (peut gérer produits, commandes, utilisateurs)
- **SUPER_ADMIN** : Administrateur complet (peut tout faire + gérer autres admins)

---

## 🔐 Authentification Client (Reboul)

### Format JWT

Les tokens JWT sont envoyés dans le header :

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Stockage client

- **Token** : `localStorage` sous la clé `reboul_auth_token`
- **User** : `localStorage` sous la clé `reboul_user`

### Expiration

- **Token JWT** : 7 jours (configurable dans `backend/src/modules/auth/auth.module.ts`)

---

## 🧪 Tests

### Backend (Insomnia/Postman)

1. **Base URL** : `http://localhost:3001`
2. **Content-Type** : `application/json`
3. **Authorization** : `Bearer <token>` (pour routes protégées)

### Frontend (Pages de test)

| URL | Description |
|-----|-------------|
| `http://localhost:3000/test-api` | Tests API généraux |
| `http://localhost:3000/test-services` | Tests services |
| `http://localhost:3000/test-hooks` | Tests hooks |
| `http://localhost:3000/test-auth` | Tests authentification |

---

## 🚀 Démarrage rapide

### 1. Configuration

**Backend** :
```bash
cd backend
cp .env.example .env  # Modifier les valeurs si nécessaire
```

**Frontend** :
```bash
cd frontend
# Créer .env avec :
echo "VITE_API_BASE_URL=http://localhost:3001" > .env
```

### 2. Démarrage

**Backend** :
```bash
cd backend
npm install
npm run start:dev
# Écoute sur http://localhost:3001
```

**Frontend** :
```bash
cd frontend
npm install
npm run dev
# Écoute sur http://localhost:3000
```

---

## ⚙️ Conventions & Bonnes pratiques

### ✅ À FAIRE

- **Frontend** : Toujours utiliser `VITE_API_BASE_URL`
- **Backend** : Préfixer avec `process.env.`
- **Sécurité** : Ne JAMAIS commit les fichiers `.env`
- **Documentation** : Mettre à jour ce fichier à chaque changement
- **Types TypeScript** : Utiliser `export type` + `import type` pour les interfaces/types

### ❌ À NE PAS FAIRE

- Créer de nouvelles variables d'environnement sans les documenter ici
- Utiliser des noms différents pour la même chose (`VITE_API_URL` vs `VITE_API_BASE_URL`)
- Hardcoder des URLs (`http://localhost:3001`) dans le code
- Oublier de mettre à jour `.env.example`
- Mélanger `export interface` avec `default export` (cause erreur Vite)

### 🔧 Import/Export TypeScript (Important !)

**❌ MAUVAIS** (cause erreur Vite : "does not provide an export named") :
```typescript
// service.ts
export interface MyType { ... }
export default myService;

// consumer.tsx
import myService, { MyType } from './service';
```

**✅ BON** (fonctionne correctement) :
```typescript
// service.ts
interface MyType { ... }
export type { MyType };
export default myService;

// consumer.tsx
import myService from './service';
import type { MyType } from './service';
```

**Raison** : Vite/TypeScript gère mieux les exports de types quand ils sont séparés avec `export type`.

---

## 📝 Historique des modifications

| Date | Modification | Auteur |
|------|--------------|--------|
| 2025-12-10 | Création documentation API centralisée | - |
| 2025-12-10 | Ajout endpoints Auth & Users (Phase 9) | - |
| 2025-12-10 | Phase 10.1 complétée : AuthContext + useAuth + service auth.ts | - |
| 2025-12-10 | **Fix import/export** : Utiliser `export type` + `import type` pour éviter erreur Vite | - |
| 2025-12-16 | Phase 15.5 terminée : Infrastructure Admin-Centrale (ports 4000/4001, connexion Reboul validée) | - |
| 2025-12-16 | Phase 16 partielle terminée : Services & Controllers Reboul créés (Products, Orders, Users, Stocks) | - |
| 2025-12-16 | Phase 16.2 terminée : Rôles & Permissions Admin (AdminUser, Guards, JWT) | - |

---

## 🔄 Phases futures

### Phase 13 : Stripe
- Ajouter `STRIPE_SECRET_KEY` et `STRIPE_PUBLIC_KEY`
- Endpoints : `/stripe/webhook`, `/orders/create-payment-intent`

### Phase 15 : Cloudinary
- Ajouter `CLOUDINARY_*` variables
- Endpoints : `/products/:id/images` (upload)

### Phase 15.5 : Admin Centrale - Infrastructure ✅ TERMINÉE
- ✅ Ports configurés : Frontend 4000, Backend 4001
- ✅ Variables d'environnement admin documentées
- ✅ Connexion TypeORM Reboul validée

### Phase 16-17 : Admin Centrale - Backend & Frontend
- Endpoints admin complets (produits, commandes, utilisateurs Reboul)
- Interface admin complète

---

**📌 Ce document est la source unique de vérité pour toute la configuration API.**

**⚠️ À mettre à jour SYSTÉMATIQUEMENT lors de l'ajout de nouvelles variables ou endpoints !**
