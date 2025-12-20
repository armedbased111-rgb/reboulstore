# 🔧 Admin Central - Backend

**Backend NestJS** pour l'application Admin Centralisée.

## 📋 Vue d'ensemble

Ce backend se connecte aux **3 bases de données** (Reboul, CP Company, Outlet) via **TypeORM avec connexions multiples**.

### Pour le MVP (Février 2025)
- ✅ Connexion à **Reboul** uniquement
- 🔜 Connexions CP Company et Outlet (commentées, à activer plus tard)

## 🏗️ Architecture

```
backend/
├── src/
│   ├── config/
│   │   └── databases.config.ts    # Config connexions multiples TypeORM
│   ├── modules/
│   │   ├── reboul/                 # Services pour Reboul
│   │   │   ├── entities/           # Entités Reboul (copiées)
│   │   │   ├── reboul-orders.service.ts
│   │   │   ├── reboul-products.service.ts
│   │   │   └── reboul.module.ts
│   │   ├── cpcompany/             # Services pour CP Company (futur)
│   │   └── outlet/                 # Services pour Outlet (futur)
│   ├── shared/
│   │   └── auth/                   # Authentification admin
│   └── app.module.ts
```

## 🔌 Connexions TypeORM

Chaque connexion a un **nom unique** :
- `'reboul'` → Base de données Reboul
- `'cpcompany'` → Base de données CP Company (futur)
- `'outlet'` → Base de données Outlet (futur)

## 📚 Documentation

- **Architecture complète** : [`docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md`](../../docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md)
- **Roadmap** : [`docs/context/ROADMAP_COMPLETE.md`](../../docs/context/ROADMAP_COMPLETE.md) - Phase 16

## 🚀 Démarrage

```bash
# Installation dépendances
npm install

# Développement
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 🔧 Variables d'environnement

Voir `.env.example` pour la liste complète.

**Connexion Reboul** (MVP) :
- `REBOUL_DB_HOST=reboulstore-postgres` (nom container Docker)
- `REBOUL_DB_PORT=5432`
- `REBOUL_DB_USER=reboulstore`
- `REBOUL_DB_PASSWORD=reboulstore_password`
- `REBOUL_DB_NAME=reboulstore_db`
