# Architecture - Vue d'ensemble

Vue d'ensemble de l'architecture complète du projet Reboul Store.

## Architecture globale

Le projet comprend **3 sites e-commerce indépendants** gérés par une **application Admin centralisée**.

### Sites e-commerce

1. **Reboul** (Priorité actuelle - Février 2025)
   - Catégorie : Enfants uniquement
   - Backend + Frontend + Database dédiés

2. **CP Company** (Futur)
   - Site indépendant
   - Backend + Frontend + Database dédiés

3. **Outlet** (Futur)
   - Site déstockage/promotions
   - Backend + Frontend + Database dédiés

### Admin Centrale

Application admin centralisée pour gérer les 3 sites :
- Frontend (React + Vite + TypeScript)
- Backend (NestJS)
- Connexion aux 3 bases de données via TypeORM

## Stack technique

### Backend
- Framework : NestJS
- ORM : TypeORM
- Base de données : PostgreSQL
- Containerisation : Docker

### Frontend
- Framework : React (TypeScript)
- Build tool : Vite
- Styling : TailwindCSS v4
- Composants UI : shadcn/ui
- Animations : AnimeJS

### Infrastructure
- Docker Compose
- Nginx (reverse proxy)
- Cloudflare (CDN, SSL)
- VPS OVH

## Références

- [[../docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md|ARCHITECTURE_ADMIN_CENTRAL]] - Architecture complète détaillée
- [[../docs/architecture/ARCHITECTURE_MULTI_SHOPS.md|ARCHITECTURE_MULTI_SHOPS]] - Détails multi-shops
- [[Canvas/Architecture.canvas|Architecture Canvas]] - Schéma visuel architecture

## Principes d'architecture

### Isolation totale

Chaque site e-commerce est complètement indépendant :
- Base de données séparée
- Backend séparé
- Frontend séparé
- Docker Compose séparé

### Avantages

- Stabilité : Si un site crash, les autres continuent
- Scalabilité : Chaque site évolue indépendamment
- Sécurité : Bases de données isolées
- Maintenance : Codebases séparés

