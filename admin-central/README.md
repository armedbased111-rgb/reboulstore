# 🎛️ Admin Centrale - Reboul Store Platform

**Application Admin Centralisée** pour gérer les 3 sites e-commerce (Reboul, CP Company, Outlet) depuis une seule interface.

## 📋 Vue d'ensemble

Cette application admin permet de :
- ✅ Gérer les produits, commandes, utilisateurs de **Reboul** (MVP - Février 2025)
- 🔜 Gérer les produits, commandes, utilisateurs de **CP Company** (futur)
- 🔜 Gérer les produits, commandes, utilisateurs de **Outlet** (futur)

## 🏗️ Architecture

- **Backend** : NestJS avec connexions TypeORM multiples (une par site)
- **Frontend** : React + Vite + GeistUI + TailwindCSS
- **Connexions** : Accès direct aux bases de données des 3 sites via réseau Docker partagé

## 📚 Documentation

- **Architecture complète** : Voir [`docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md`](../docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md)
- **Roadmap** : Voir [`docs/context/ROADMAP_COMPLETE.md`](../docs/context/ROADMAP_COMPLETE.md) - Phase 15.5 à 17

## 🚀 Démarrage

### Prérequis

- Docker et Docker Compose installés
- Le projet `reboulstore/` doit être démarré (pour accéder à la base Reboul)

### Lancer l'admin

```bash
# Depuis la racine du projet
cd admin-central
docker-compose up -d
```

### Accès

- **Frontend Admin** : http://localhost:4000
- **Backend Admin API** : http://localhost:4001

## 📁 Structure

```
admin-central/
├── backend/          # API NestJS
├── frontend/         # Interface React
└── docker-compose.yml
```

## 🔌 Ports

| Service | Port |
|---------|------|
| Frontend Admin | 4000 |
| Backend Admin | 4001 |

## 📝 État actuel

**Phase 15.5** : Infrastructure & Structure (en cours)
- ✅ Structure créée
- 🔄 Docker Compose à configurer
- 🔄 Backend minimal à créer
- 🔄 Frontend minimal à créer
