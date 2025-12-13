# getcontext

**Commande** : `/getcontext [sujet]`

Recherche rapide de contexte dans le projet Reboul Store.

## 📚 Fichiers de référence principaux

### Architecture & Structure
- **ARCHITECTURE_ADMIN_CENTRAL.md** : Architecture complète admin centralisée (3 projets + 1 admin) ⭐ **RÉFÉRENCE ARCHITECTURE**
- **ARCHITECTURE_MULTI_SHOPS.md** : Architecture multi-shops
- **CONTEXT.md** : Contexte général, état actuel du projet
- **API_CONFIG.md** : Configuration API (ports, endpoints, variables d'environnement)

### Roadmap & Planning
- **ROADMAP_COMPLETE.md** : Roadmap détaillée (24 phases) - **RÉFÉRENCE PRINCIPALE** ⭐
- **BRAINSTORMING_ROADMAP.md** : Brainstorming & décisions
- **CLARIFICATIONS_BRAINSTORMING.md** : Clarifications validées
- **PROJECT_STATUS.md** : Statut global du projet

### Documentation Frontend
- **frontend/FRONTEND.md** : Documentation frontend (pages, composants, services, état)
- **frontend/AUTH_USAGE.md** : Système authentification (useAuth, AuthContext)
- **frontend/TAILWIND.md** : Guide TailwindCSS
- **ANIMATIONS_GUIDE.md** : Guide complet animations GSAP ⭐

### Documentation Backend
- **backend/BACKEND.md** : Documentation backend (modules, endpoints, entités, état)
- **backend/STRIPE_SETUP.md** : Configuration Stripe
- **backend/STRIPE_CLI_SETUP.md** : Configuration Stripe CLI

### Workflows
- **FIGMA_DEV_GUIDE.md** : Guide développement depuis Figma
- **FIGMA_WORKFLOW.md** : Workflow Figma → Code

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

## 📝 Commandes associées

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

