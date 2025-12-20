# 🏪 Reboul Store Platform – Documentation & Workflow

Ce dépôt contient le projet e‑commerce Reboul Store (backend NestJS + frontend React) avec une documentation très complète et un workflow de travail structuré autour de Cursor.

Ce fichier explique **où trouver chaque fichier de contexte**, **comment fonctionne l’export de contexte vers de nouveaux projets** (comme Dawgz), et **quelles commandes Cursor sont disponibles**.

---

## 📚 Fichiers de contexte principaux (projet Reboul)

Les fichiers de contexte sont rangés dans `docs/` et référencés par :

- **`docs/CONTEXT_INDEX.md`**  
  Index de tous les fichiers de contexte (architecture, roadmap, Stripe, design, etc.).

Concrètement :

- **Roadmap & contexte**  
  - `docs/context/ROADMAP_COMPLETE.md` : Roadmap complète du projet (toutes les phases, **source de vérité principale**)  
  - `docs/context/CONTEXT.md` : Contexte général, architecture, état actuel du projet  
  - `docs/context/PROJECT_STATUS.md` : Statut global du projet  
  - `docs/context/BRAINSTORMING_ROADMAP.md` : Brainstorm initial de la roadmap  
  - `docs/context/CLARIFICATIONS_BRAINSTORMING.md` : Clarifications et décisions validées  
  - `docs/context/POLICIES_TODO.md` : Travail à faire sur les politiques (livraison, retours, etc.)  
  - `docs/context/PHASE_4.2_COMPLETED.md` : Note de fin de phase

- **Architecture**  
  - `docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md` : Architecture multi‑sites + admin centralisée  
  - `docs/architecture/ARCHITECTURE_MULTI_SHOPS.md` : Détails architecture multi‑shops  
  - `docs/architecture/architecture-context.json` : Version JSON de l’architecture

- **API / Config**  
  - `docs/context/API_CONFIG.md` : Configuration API (ports, URLs, variables d’environnement)

### Contexte Backend / Frontend / Stripe

- **Backend** :
  - `backend/BACKEND.md` : Documentation backend (modules, entités, endpoints)
  - `backend/STRIPE_SETUP.md` / `backend/STRIPE_CLI_SETUP.md` : Mise en place Stripe
  - `docs/stripe/STRIPE_PAYMENT_FLOW.md` / `docs/stripe/STRIPE_CHECKOUT_IMPROVEMENTS.md` : Détails du flow de paiement
- **Frontend** :
  - `frontend/FRONTEND.md` : Documentation frontend (pages, composants, services)
  - `frontend/AUTH_USAGE.md` : Système d’authentification frontend

---

## 📦 Export de contexte & nouveaux projets

Tout ce qui sert à **exporter notre méthodologie vers un nouveau projet** (comme Dawgz) est rangé dans `docs/export/` et `docs/context/` :

- **Index**  
  - `docs/EXPORT_CONTEXT_INDEX.md` : Index de tout ce qui concerne l’export de contexte / nouveaux projets.

- **Templates & guides**  
  - `docs/context/TEMPLATE_CONTEXTE_PROJET.md` : Template générique de contexte de projet e‑commerce (stack, entités, endpoints, workflows, conventions).  
  - `docs/context/brainstorm_nouveauprojet.md` : Template de brainstorming client (questions structurées pour un nouveau projet).  
  - `docs/export/GUIDE_EXPORT_CONTEXTE.md` : Guide expliquant comment utiliser les templates pour créer un nouveau projet.  
  - `docs/export/GUIDE_DEMARRAGE_NOUVEAU_PROJET.md` : Guide pas‑à‑pas pour démarrer un nouveau projet (checklist + message type à envoyer à l’IA).  
  - `docs/export/TRAME_RAPIDE_RENDEZ_VOUS.md` : Version courte pour être utilisée **en live pendant un rendez‑vous client**.

> ✅ Exemple d’utilisation : le projet `dawgz` (`/Users/tripleseptinteractive/code/dawgz`) a été généré en suivant exactement ce workflow (brainstorm → export de contexte → création automatique des fichiers par l’IA).

---

## 🎨 Workflows spécialisés

### Figma → Frontend

- **`docs/export/FIGMA_WORKFLOW.md`** : Workflow complet Figma → code (design d’abord, code ensuite)
- **`docs/export/FIGMA_DEV_GUIDE.md`** : Focus développeur sur l’utilisation de Figma avec Tailwind/React

### Animations GSAP

- **`docs/animations/ANIMATIONS_GUIDE.md`** : Guide complet GSAP (structure `frontend/src/animations`, presets, bonnes pratiques)

---

## 🤖 Commandes Cursor disponibles

Les commandes Cursor sont définies dans `.cursor/commands/*.md` et décrites en détail, mais voici la liste rapide :

- **Contexte & workflow** :
  - `/getcontext [sujet]` : Où trouver quelle doc pour un sujet donné
  - `/frontend-workflow` : Workflow complet frontend (pages, composants, services)
  - `/backend-workflow` : Workflow complet backend (modules, entités, endpoints)
  - `/figma-workflow` : Rappel du workflow Figma → Frontend
  - `/animation-workflow` : Workflow GSAP (structure, presets, composants)
  - `/documentation-workflow` : Comment maintenir ROADMAP / CONTEXT / FRONTEND / BACKEND à jour

- **Création** :
  - `/component-create [nom] [domaine?]` : Aide à créer un composant React typé
  - `/page-create [nom]` : Aide à créer une page React avec structure standard
  - `/module-create [nom]` : Aide à créer un module NestJS complet (module + service + controller + DTO + entité)

- **Maintenance** :
  - `/update-roadmap` : Comment mettre à jour systématiquement `ROADMAP_COMPLETE.md`

> ℹ️ Les règles de comportement de l’IA sont centralisées dans `.cursor/rules/project-rules.mdc` (mode pédagogique par défaut, workflows à utiliser automatiquement, etc.).

---

## 🧭 Comment s’y retrouver rapidement

1. **Tu veux savoir où tu en es dans le projet ?**  
   → Lis `docs/context/ROADMAP_COMPLETE.md` puis `docs/context/CONTEXT.md`.

2. **Tu veux comprendre l’architecture globale (multi‑sites + admin) ?**  
   → Lis `docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md` + `docs/architecture/ARCHITECTURE_MULTI_SHOPS.md`.

3. **Tu démarres un NOUVEAU projet e‑commerce (comme Dawgz) ?**
   - Remplis `docs/context/brainstorm_nouveauprojet.md` pendant le rendez‑vous client
   - Suis `docs/export/GUIDE_DEMARRAGE_NOUVEAU_PROJET.md`
   - Utilise `docs/context/TEMPLATE_CONTEXTE_PROJET.md` dans le nouveau dépôt

4. **Tu as un doute sur le workflow (frontend, backend, Figma, animations, doc) ?**  
   → Tape la commande Cursor correspondante (`/frontend-workflow`, `/backend-workflow`, etc.).

---

Ce fichier est volontairement synthétique : il sert de **hub** pour retrouver rapidement la bonne documentation et les bons workflows dans le projet. Pour plus de détails, ouvre les fichiers référencés ci‑dessus ou utilise `/getcontext`.


