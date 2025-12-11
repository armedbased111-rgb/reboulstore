# 🌐 Configuration API - Reboul Store

Ce document centralise **TOUTES** les configurations API, variables d'environnement et ports utilisés dans le projet.

---

## 📊 Architecture & Ports

### Services

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Frontend** | 3000 | `http://localhost:3000` | Application React (Vite) |
| **Backend** | 3001 | `http://localhost:3001` | API NestJS |
| **PostgreSQL** | 5432 | `localhost:5432` | Base de données |

### CORS

Le backend accepte les requêtes depuis :
- `http://localhost:3000` (Frontend dev)
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

# Email (Phase 11+)
# SMTP_HOST=
# SMTP_PORT=
# SMTP_USER=
# SMTP_PASSWORD=
```

---

### Frontend (`frontend/.env`)

```env
# API Backend URL
VITE_API_BASE_URL=http://localhost:3001
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

## 🔗 Endpoints API (Backend)

### Base URL
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

## 🔐 Authentification

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

---

## 🔄 Phases futures

### Phase 13 : Stripe
- Ajouter `STRIPE_SECRET_KEY` et `STRIPE_PUBLIC_KEY`
- Endpoints : `/stripe/webhook`, `/orders/create-payment-intent`

### Phase 15 : Cloudinary
- Ajouter `CLOUDINARY_*` variables
- Endpoints : `/products/:id/images` (upload)

### Phase 17 : Admin Centrale
- Nouveau port pour l'admin (3002 ?)
- Variables d'environnement admin

---

**📌 Ce document est la source unique de vérité pour toute la configuration API.**

**⚠️ À mettre à jour SYSTÉMATIQUEMENT lors de l'ajout de nouvelles variables ou endpoints !**
