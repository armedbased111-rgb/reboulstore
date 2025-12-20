# `/getcontext [sujet]` – Trouver la bonne documentation

Cette commande sert de **GPS dans la doc** : elle explique où chercher l’information selon le sujet.

## 🔍 Usage

Dans le chat Cursor, tape :

```text
/getcontext backend
/getcontext frontend
/getcontext architecture
/getcontext stripe
/getcontext animations
```

## 📂 Mapping sujets → fichiers (version actuelle, rangée dans `docs/`)

- **Architecture globale / multi‑sites / admin**  
  - `docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md`  
  - `docs/architecture/ARCHITECTURE_MULTI_SHOPS.md`  
  - `docs/context/CONTEXT.md`

- **Roadmap & état du projet**  
  - `docs/context/ROADMAP_COMPLETE.md` (source de vérité)  
  - `docs/context/PROJECT_STATUS.md`  
  - `docs/context/BRAINSTORMING_ROADMAP.md`  
  - `docs/context/CLARIFICATIONS_BRAINSTORMING.md`

- **Backend (API, entités, modules)**  
  - `backend/BACKEND.md`  
  - `docs/context/API_CONFIG.md`  
  - `backend/STRIPE_SETUP.md`, `backend/STRIPE_CLI_SETUP.md`, `docs/stripe/STRIPE_PAYMENT_FLOW.md`, `docs/stripe/STRIPE_CHECKOUT_IMPROVEMENTS.md`

- **Frontend (pages, composants, auth)**  
  - `frontend/FRONTEND.md`  
  - `frontend/AUTH_USAGE.md`  
  - `docs/context/DESIGN.md`

- **Figma & design system**  
  - `docs/export/FIGMA_WORKFLOW.md`  
  - `docs/export/FIGMA_DEV_GUIDE.md`

- **Animations GSAP**  
  - `docs/animations/ANIMATIONS_GUIDE.md`

- **Export de contexte / nouveaux projets**  
  - `docs/context/TEMPLATE_CONTEXTE_PROJET.md`  
  - `docs/context/brainstorm_nouveauprojet.md`  
  - `docs/export/GUIDE_EXPORT_CONTEXTE.md`  
  - `docs/export/GUIDE_DEMARRAGE_NOUVEAU_PROJET.md`  
  - `docs/export/TRAME_RAPIDE_RENDEZ_VOUS.md`

# getcontext

**Commande** : `/getcontext [sujet]`

Recherche rapide de contexte dans le projet Reboul Store.

## 📚 Fichiers de référence principaux

### Architecture & Structure
- **docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md** : Architecture complète admin centralisée (3 projets + 1 admin) ⭐ **RÉFÉRENCE ARCHITECTURE**
- **docs/architecture/ARCHITECTURE_MULTI_SHOPS.md** : Architecture multi-shops
- **docs/context/CONTEXT.md** : Contexte général, état actuel du projet
- **docs/context/API_CONFIG.md** : Configuration API (ports, endpoints, variables d'environnement)

### Roadmap & Planning
- **docs/context/ROADMAP_COMPLETE.md** : Roadmap détaillée (24 phases) - **RÉFÉRENCE PRINCIPALE** ⭐
- **docs/context/BRAINSTORMING_ROADMAP.md** : Brainstorming & décisions
- **docs/context/CLARIFICATIONS_BRAINSTORMING.md** : Clarifications validées
- **docs/context/PROJECT_STATUS.md** : Statut global du projet

### Documentation Frontend
- **frontend/FRONTEND.md** : Documentation frontend (pages, composants, services, état)
- **frontend/AUTH_USAGE.md** : Système authentification (useAuth, AuthContext)
- **frontend/TAILWIND.md** : Guide TailwindCSS
- **docs/animations/ANIMATIONS_GUIDE.md** : Guide complet animations GSAP ⭐

### Documentation Backend
- **backend/BACKEND.md** : Documentation backend (modules, endpoints, entités, état)
- **backend/STRIPE_SETUP.md** : Configuration Stripe
- **backend/STRIPE_CLI_SETUP.md** : Configuration Stripe CLI

### Workflows
- **docs/export/FIGMA_DEV_GUIDE.md** : Guide développement depuis Figma
- **docs/export/FIGMA_WORKFLOW.md** : Workflow Figma → Code

### Autres
- **POLICIES_TODO.md** : Notes politiques livraison/retour
- **.cursor/rules/project-rules.mdc** : Règles de développement complètes ⭐

## 🔍 Comment rechercher du contexte

### 1. Par domaine fonctionnel

**Frontend :**
- Pages : `frontend/src/pages/`
- Composants : `frontend/src/components/`
- Services : `frontend/src/services/`
- Hooks : `frontend/src/hooks/`
- Types : `frontend/src/types/`

**Backend :**
- Modules : `backend/src/modules/`
- Entités : `backend/src/entities/`
- DTOs : `backend/src/modules/[module]/dto/`

### 2. Par documentation

**Architecture :** `ARCHITECTURE_ADMIN_CENTRAL.md`, `CONTEXT.md`  
**Roadmap :** `ROADMAP_COMPLETE.md`  
**Workflow :** `FIGMA_WORKFLOW.md`, `ANIMATIONS_GUIDE.md`  
**API :** `API_CONFIG.md`, `backend/BACKEND.md`  
**Frontend :** `frontend/FRONTEND.md`, `frontend/AUTH_USAGE.md`

### 3. Recherche rapide par sujet

**Authentification :**
- Frontend : `frontend/AUTH_USAGE.md`, `frontend/src/contexts/AuthContext.tsx`
- Backend : `backend/src/modules/auth/`

**Panier :**
- Frontend : `frontend/src/contexts/CartContext.tsx`, `frontend/src/services/cart.ts`
- Backend : `backend/src/modules/cart/`

**Commandes :**
- Frontend : `frontend/src/pages/Orders.tsx`, `frontend/src/services/orders.ts`
- Backend : `backend/src/modules/orders/`

**Produits :**
- Frontend : `frontend/src/pages/Product.tsx`, `frontend/src/services/products.ts`
- Backend : `backend/src/modules/products/`

**Animations :**
- `ANIMATIONS_GUIDE.md`, `frontend/src/animations/`

**Figma :**
- `FIGMA_DEV_GUIDE.md`, `FIGMA_WORKFLOW.md`

## 🚀 CLI Python - Outil de productivité

**Le projet dispose d'un CLI Python complet pour automatiser toutes les tâches répétitives.**

### 📍 Documentation CLI
- **`cli/README.md`** : Documentation complète du CLI
- **`cli/USAGE.md`** : Guide d'utilisation avec exemples
- **`cli/ROADMAP.md`** : Roadmap d'amélioration (10 phases)
- **`cli/RECAPITULATIF.md`** : Récapitulatif complet de l'état actuel ⭐

### 🎯 Commandes principales

**Génération de code :**
- `python cli/main.py code generate module [nom] --full` : Module complet (Entity + DTOs + Service + Controller)
- `python cli/main.py code component [nom]` : Composant React
- `python cli/main.py code page [nom]` : Page React complète
- `python cli/main.py code hook [nom]` : Hook React
- `python cli/main.py code animation [nom]` : Animation GSAP

**Documentation :**
- `python cli/main.py docs generate api` : Génère `docs/API.md`
- `python cli/main.py docs generate components` : Génère `docs/COMPONENTS.md`
- `python cli/main.py docs sync` : Synchronise ROADMAP ↔ BACKEND.md ↔ FRONTEND.md
- `python cli/main.py docs changelog` : Génère `docs/CHANGELOG.md`

**Analyse :**
- `python cli/main.py analyze patterns` : Détecte patterns répétitifs et code dupliqué
- `python cli/main.py analyze code` : Valide la cohérence du code
- `python cli/main.py suggest phase [domaine]` : Suggère des phases basées sur les besoins

**Voir `/cli-workflow` pour le guide complet**

## 📝 Commandes associées

- `/cli-workflow` : Guide complet du CLI Python ⭐ **NOUVEAU**
- `/frontend-workflow` : Workflow complet frontend
- `/backend-workflow` : Workflow complet backend
- `/figma-workflow` : Workflow Figma → Code
- `/animation-workflow` : Workflow animations GSAP
- `/documentation-workflow` : Workflow documentation

## ⚡ Astuces

1. **Toujours commencer par ROADMAP_COMPLETE.md** pour connaître la phase en cours
2. **Consulter CONTEXT.md** pour l'état actuel du projet
3. **Utiliser les fichiers de règles** `.cursor/rules/project-rules.mdc` pour les workflows
4. **Chercher dans les dossiers `src/`** pour le code actuel
5. **Consulter les fichiers `*.md`** pour la documentation spécifique

