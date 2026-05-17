# architecture-workflow

**Commande** : `/architecture-workflow`

Workflow pour comprendre et travailler avec l’**architecture multi‑sites + admin centrale** de Reboul Store.

---

## 📂 Fichiers architecture

- `obsidian-vault/Architecture/Architecture.md` ⭐  
  → Référence principale de l’architecture (3 shops + 1 admin).

- `docs/architecture/ARCHITECTURE_MULTI_SHOPS.md`  
  → Focus sur la partie multi‑shops (reboulstore, cpcompany, outlet…).

- `obsidian-vault/REBOUL.md`  
  → Résumé de l’architecture + état actuel.

- `obsidian-vault/Projet/roadmap.md`  
  → Quelles phases concernent l’admin / multi‑shops.

---

## 1. Comprendre l’architecture globale

1. Lire `obsidian-vault/Architecture/Architecture.md` :
   - 3 sites e‑commerce indépendants (backend + frontend + DB).
   - 1 application admin centrale (backend + frontend) connectée aux 3 DB.
   - Raison : isolation, scalabilité, sécurité.

2. Lire `docs/architecture/ARCHITECTURE_MULTI_SHOPS.md` :
   - Détails sur les projets `reboulstore/`, `cpcompany/`, `outlet/`.
   - Comment chaque projet est structuré (backend/, frontend/, docker-compose, etc.).

3. Lire `obsidian-vault/REBOUL.md` (section Architecture) :
   - Vue d’ensemble actuelle (où on en est : Reboul d’abord, admin plus tard, etc.).

---

## 2. Quand tu travailles sur un shop (ex : Reboul)

1. Toujours considérer que **Reboul** est un projet **indépendant** :
   - `backend/` = API Reboul
   - `frontend/` = site e‑commerce Reboul
   - `docker-compose.yml` = stack Reboul (backend + DB + frontend)

2. Toute logique multi‑shops / admin future doit :
   - Être pensée pour garder l’**indépendance** de chaque shop.
   - Utiliser l’admin comme **agrégateur**, pas comme point unique de vérité pour les shops.

3. Pour les décisions impactant plusieurs shops :
   - Documenter dans `obsidian-vault/Architecture/Architecture.md`.
   - Mettre à jour `obsidian-vault/REBOUL.md` si l’état change.

---

## 3. Quand tu travailles sur l’admin centrale

1. Lire dans `obsidian-vault/Architecture/Architecture.md` :
   - Comment l’admin se connecte aux différentes DB (multi‑connexions TypeORM).
   - Quelles features doivent être gérées depuis l’admin (produits, commandes, clients).

2. Planifier les modules admin dans :
   - `obsidian-vault/Projet/roadmap.md` (phases admin backend + admin frontend).

3. Créer un projet admin séparé (plus tard) :
   - `admin-central/backend/`
   - `admin-central/frontend/`
   - Avec son propre `docker-compose.yml`.

---

## 4. Checklist avant toute modif d’architecture

1. ✅ Lire `obsidian-vault/Architecture/Architecture.md`.  
2. ✅ Lire `docs/architecture/ARCHITECTURE_MULTI_SHOPS.md` si c’est lié aux shops.  
3. ✅ Vérifier dans `obsidian-vault/Projet/roadmap.md` la phase concernée.  
4. ✅ Noter toute décision importante dans :
   - `docs/context/CLARIFICATIONS_BRAINSTORMING.md`
   - `obsidian-vault/REBOUL.md` (si l’état global change)

---

## 🔗 Commandes associées

- `/getcontext architecture` : Savoir rapidement quels fichiers lire.
- `/backend-workflow` : Pour la partie API/multi‑DB.
- `/documentation-workflow` : Pour tenir la doc d’archi à jour.


