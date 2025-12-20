# admin-workflow

**Commande** : `/admin-workflow`

Workflow pour tout ce qui concerne l’**admin centrale** (projet `admin-central`) qui gérera plusieurs shops (Reboul, CP Company, Outlet…).

> ⚠️ L’admin centrale est prévue en **Phase 16‑17** (pas encore implémentée) – ce workflow sert de cadre dès maintenant.

---

## 1. Docs d’architecture à lire

- `docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md` ⭐  
  → Architecture complète admin centrale (3 shops + 1 admin).

- `docs/architecture/ARCHITECTURE_MULTI_SHOPS.md`  
  → Détails de chaque shop et de leurs stacks.

- `docs/context/CONTEXT.md`  
  → Où en est l’admin dans la roadmap (phases, priorités).

---

## 2. Principe général de l’admin

- **Objectif** : Une seule interface pour gérer :
  - Produits  
  - Commandes  
  - Clients  
  - (Plus tard : stocks, promotions, etc.)

- **Architecture** :
  - Projet séparé `admin-central/` :
    - `admin-central/backend/` (NestJS, multi‑connexions TypeORM)
    - `admin-central/frontend/` (React + Vite + GeistUI)
  - Connexions directes aux DB des shops :
    - `reboulstore_db`
    - `cpcompany_db`
    - `outlet_db`

---

## 3. Quand tu touches à l’admin

Toujours :

1. Lire `docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md`.  
2. Vérifier dans `docs/context/ROADMAP_COMPLETE.md` :
   - Quelles phases sont prévues pour l’admin (16‑17).  
3. Noter toute décision / changement dans :
   - `docs/context/CLARIFICATIONS_BRAINSTORMING.md`  
   - `docs/context/CONTEXT.md` (si l’état global change).

---

## 4. Workflow back admin (quand on y sera)

1. Créer `admin-central/backend/` avec la même stack que Reboul (NestJS + TypeORM).  
2. Configurer **multi‑connexions** TypeORM (une par shop).  
3. Créer des modules admin :
   - `admin-products` (agrège les produits des shops)  
   - `admin-orders` (vue cross‑shops)  
   - `admin-customers` (clients)  
4. Documenter dans :
   - `admin-central/backend/BACKEND.md` (nouveau fichier)  
   - `docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md` (mise à jour)

---

## 5. Workflow front admin (quand on y sera)

1. Créer `admin-central/frontend/` :
   - React + Vite + GeistUI (voir CONTEXT).  
2. Pages cibles (à détailler dans la roadmap) :
   - Dashboard global  
   - Liste produits (par shop, filtrable)  
   - Liste commandes (par shop, statut)  
   - Fiches clients  
3. Documenter dans :
   - `admin-central/frontend/FRONTEND.md` (nouveau fichier)  
   - `docs/context/ROADMAP_COMPLETE.md` (phases 16‑17).

---

## 🔗 Commandes associées

- `/architecture-workflow` : Pour la vision globale multi‑sites.  
- `/backend-workflow` : Pour la partie API NestJS de l’admin.  
- `/frontend-workflow` : Pour la partie UI de l’admin.  
- `/roadmap-phase-workflow` : Pour définir les phases 16‑17 de l’admin.


