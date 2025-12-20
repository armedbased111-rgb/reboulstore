# 🎨 Admin Central - Frontend

**Frontend React** pour l'application Admin Centralisée.

## 📋 Vue d'ensemble

Interface admin construite avec :
- **React** + **TypeScript**
- **Vite** (build tool)
- **GeistUI** (bibliothèque UI admin)
- **TailwindCSS** (styling)
- **React Router** (routing)

## 🏗️ Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── dashboard/              # Dashboard global
│   │   ├── reboul/                 # Pages Reboul
│   │   │   ├── products/           # Gestion produits
│   │   │   ├── orders/             # Gestion commandes
│   │   │   └── users/              # Gestion utilisateurs
│   │   ├── cpcompany/              # Pages CP Company (futur)
│   │   └── outlet/                 # Pages Outlet (futur)
│   ├── components/
│   ├── services/                   # Services API
│   └── App.tsx
```

## 📚 Documentation

- **Architecture complète** : [`docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md`](../../docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md)
- **Roadmap** : [`docs/context/ROADMAP_COMPLETE.md`](../../docs/context/ROADMAP_COMPLETE.md) - Phase 17

## 🚀 Démarrage

```bash
# Installation dépendances
npm install

# Développement
npm run dev

# Build production
npm run build
```

## 🔧 Configuration

**API Backend** : `http://localhost:4001` (configuré dans `vite.config.ts`)

## 🎨 Design System

- **Bibliothèque UI** : GeistUI (composants admin)
- **Styling** : TailwindCSS v4
- **Thème** : À définir (cohérent avec Reboul)
