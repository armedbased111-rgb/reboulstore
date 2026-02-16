## 📚 Index des fichiers de contexte – Reboul Store

Ce dossier logique regroupe **les références vers tous les fichiers de contexte** du projet Reboul Store.  
Les fichiers restent physiquement à la racine (pour compatibilité, liens, historique Git), mais tu peux considérer cette page comme le **sommaire central**.

---

### 🗺️ Contexte global & roadmap

- `context/ROADMAP_COMPLETE.md`  
  Roadmap complète : Phases 1-23 en résumé, Phase 24-26 détaillées, post-lancement en résumé. **Source de vérité principale**.

- `context/COLLECTIONS_ROADMAP.md`  
  Suivi des collections (première + futures) : politiques, refs marque par marque, photos, import, produit par produit. À part de la roadmap principale.

- `CONTEXT.md`  
  Contexte général, architecture, état actuel du projet.

- `PROJECT_STATUS.md`  
  Statut global synthétique (où on en est).

- `BRAINSTORMING_ROADMAP.md`  
  Brainstorm initial de la roadmap.

- `CLARIFICATIONS_BRAINSTORMING.md`  
  Clarifications et décisions validées après brainstorm.

- `POLICIES_TODO.md`  
  Travail à faire sur les politiques (livraison, retours, etc.).

---

### 🏗️ Architecture

- `ARCHITECTURE_ADMIN_CENTRAL.md`  
  Architecture multi‑sites + admin centralisée (3 shops + 1 admin).

- `ARCHITECTURE_MULTI_SHOPS.md`  
  Détails de l’architecture multi‑shops.

- `architecture-context.json`  
  Version JSON structurée de l’architecture (utile pour l’IA / outils).

---

### 🔌 API & Backend

- `API_CONFIG.md`  
  Configuration API (ports, URLs, variables d’environnement, conventions).

- `backend/BACKEND.md`  
  Documentation backend : modules, entités, endpoints, état actuel.

- `STRIPE_SETUP.md`, `backend/STRIPE_CLI_SETUP.md`  
  Mise en place Stripe (clés, CLI, webhooks).

- `STRIPE_PAYMENT_FLOW.md`, `STRIPE_CHECKOUT_IMPROVEMENTS.md`  
  Détails du flow de paiement et améliorations prévues.

---

### 🎨 Frontend & Design

- `frontend/FRONTEND.md`  
  Documentation frontend : pages, composants, services.

- `frontend/AUTH_USAGE.md`  
  Système d’authentification frontend (useAuth, AuthContext, etc.).

- `DESIGN.md`  
  Notes design et décisions UI/UX.

- `FIGMA_WORKFLOW.md`  
  Workflow complet Figma → Frontend.

- `FIGMA_DEV_GUIDE.md`  
  Guide développeur pour utiliser Figma avec Tailwind/React.

- `ANIMATIONS_GUIDE.md`  
  Guide complet GSAP (structure `frontend/src/animations`, presets, bonnes pratiques).

---

### 🧪 Tests & Stripe Checkout

- `TESTS_CHECKOUT.md`  
  Cas de test et scénarios pour le checkout.

- `STRIPE_CHECKOUT_IMPROVEMENTS.md`  
  Améliorations prévues pour l’expérience checkout.

---

### 📌 Comment utiliser cet index

1. Quand tu arrives sur le projet :  
   → Lis `ROADMAP_COMPLETE.md` puis `CONTEXT.md`.

2. Quand tu touches à l’architecture ou aux endpoints :  
   → Lis `ARCHITECTURE_ADMIN_CENTRAL.md`, `ARCHITECTURE_MULTI_SHOPS.md`, `API_CONFIG.md`.

3. Quand tu travailles sur le frontend / design :  
   → Lis `frontend/FRONTEND.md`, `FIGMA_WORKFLOW.md`, `ANIMATIONS_GUIDE.md`.

4. Quand tu travailles sur le backend :  
   → Lis `backend/BACKEND.md` + `API_CONFIG.md`.

> Pour une vue encore plus synthétique, tu peux aussi utiliser le `README.md` à la racine, qui sert de hub global.


