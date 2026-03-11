# Stitch MCP – Plan d’installation & intégration (Cursor + Claude Code)

**Objectif** : mettre en place Stitch (Design with AI) via MCP comme **outil design/frontend** (génération d’écrans, design system, QA) et, plus tard, comme hub de contexte pour Reboul Store, utilisable depuis **Cursor** (toi) et **Claude Code** (terminal/CLI), sans casser les workflows existants (CLI Python, Obsidian, docs).

**Statut** : installation Stitch MCP Auto **terminée** (projet `stitch-reboul` + commandes Claude Code), premier écran ProductPage généré et intégré en page de démo frontend.

---

## 1. Rappels & positionnement

- **Stitch (Google)** : outil “Design with AI” qui sait générer des **écrans UI**, des **design systems** et analyser des designs (QA, accessibilité, cohérence).
- **Stitch MCP Auto** : serveur MCP + wizard qui :
  - configure automatiquement un projet Google Cloud (`stitch-reboul`),
  - installe des **commandes haut niveau** dans Claude Code (`/design`, `/design-flow`, `/design-system`, `/design-qa`, `/generate-asset`, …),
  - enregistre un serveur MCP que Cursor/Claude peuvent démarrer via `npx stitch-mcp-auto`.
- **But dans Reboul Store** :
  - utiliser Stitch pour **explorer / prototyper** des pages et composants frontend (Product, Catalog, Checkout, etc.),
  - en tirer des **layouts et patterns** réutilisables dans le code React/Tailwind existant,
  - plus tard : s’en servir comme source de vérité design (design system Stitch ↔ frontend).

---

## 2. Pré-requis techniques

### 2.1. Environnement

- Node.js LTS installé sur ta machine (>= 18 recommandé).
- Git installé (déjà ok pour le repo).
- Claude Desktop / Cursor récents (support MCP activé).

### 2.2. Outils Stitch

- Google Cloud CLI (`gcloud`) installé et fonctionnel.
- `stitch-mcp-auto` installé via `npx -p stitch-mcp-auto stitch-mcp-auto-setup`.
- Projet GCP dédié : **`stitch-reboul`** (créé par le wizard).

---

## 3. Installation de Stitch MCP Auto (fait)

### 3.1. Setup wizard

1. Lancer le wizard :
   - `npx -p stitch-mcp-auto stitch-mcp-auto-setup`
2. Étapes du wizard (faites) :
   - connexion Google,
   - création/choix du projet GCP,
   - activation des APIs nécessaires,
   - génération des tokens d’accès :
     - `Tokens: ~/.stitch-mcp-auto/tokens.json`
   - confirmation finale :
     - `Project: stitch-reboul`
     - `Image Generation: enabled`

### 3.2. Commandes installées (Claude / Gemini / Codex)

- **Claude Code** :
  - `/design`, `/design-flow`, `/design-full`, `/design-qa`, `/design-system`, `/design`, `/generate-asset`.
- **Gemini CLI** :
  - `stitch:design-*` (commandes équivalentes).
- **Codex CLI** :
  - `$stitch-design-*` dans `~/.codex/skills/stitch`.

---

## 4. Déclaration du MCP Stitch dans Cursor & Claude Code (fait)

### 4.1. Cursor (`~/.cursor/mcp.json`)

Config actuelle :

```json
{
  "mcpServers": {
    "Figma Desktop": {
      "url": "http://127.0.0.1:3845/mcp"
    },
    "stitch": {
      "command": "npx",
      "args": [
        "-y",
        "stitch-mcp-auto"
      ],
      "env": {
        "GOOGLE_CLOUD_PROJECT": "stitch-reboul"
      }
    }
  }
}
```

### 4.2. Claude Desktop / Claude Code

- Le wizard a enregistré le serveur Stitch MCP pour Claude automatiquement.
- Claude peut lancer Stitch via :
  - les commandes `/design*`,
  - ou via la surface MCP interne (même si certains tools bas niveau peuvent encore renvoyer des erreurs d’auth, ce qui n’empêche pas l’usage des commandes haut niveau).

---

## 5. Modèle de spaces & memories pour Reboul Store

On définit ici la **structure logique** des spaces Stitch, pour éviter le bazar.

### 5.1. Spaces principaux

1. `reboul-design-system`
   - Règles de design (typo, couleurs, grid, composants shadcn utilisés, do/don’t).
   - Exemples Figma + décisions (pourquoi tel pattern sur Product, Catalog, Checkout).
2. `reboul-frontend-pages`
   - Une memory par page importante (Home, Catalog, Product, Cart, Checkout, Account, etc.).
   - Pour chaque : objectifs UX, contraintes, décisions validées.
3. `reboul-images-pipeline`
   - Rappel du pipeline images IA (24.10) + règles critiques (ne pas générer la ref, structure des dossiers, prompts).
   - Cas particuliers par marque / collection.
4. `reboul-collections`
   - Notes sur les workflows CSV, imports, règles par marque (Stone Island, CP, Outlet).
5. `reboul-server-ops`
   - Règles serveur & DB (jamais `docker compose down -v`, backups obligatoires, tunnels SSH, etc.).
   - Résumés des incidents/resolutions importants.

### 5.2. Format de base d’une memory

Pour chaque memory, garder un format simple et répété, par exemple :

```text
Title: Product Page – Règles UX v1
Tags: [frontend, page, product, ux]

Objectifs:
- ...

Décisions:
- ...

Contraintes:
- ...

Historique:
- ...
```

On reste **concis**, on documente l’essentiel (règle primordiale du projet).

---

## 6. Workflows d’usage depuis Cursor & Claude Code

### 6.1. Workflow “Design de page frontend” (Produit – fait en démo)

1. **Brief dans Claude Code** :
   - Lancer `/design` avec un prompt décrivant la page (ex : ProductPage Reboul, style ACW, hero image + infos, section détails, produits similaires, CTA sticky mobile, etc.).
2. **Sortie Stitch** :
   - Layout textuel + code JSX/Tailwind complet pour la page.
3. **Intégration de démo dans le frontend** :
   - Créer `frontend/src/pages/ProductStitchDemo.tsx` avec :
     - types `Product` / `Size`,
     - `mockProduct` pour tester,
     - composants `Navbar`, `Hero`, `ProductDetails`, `SimilarProducts` générés par Stitch (adaptés minimalement pour React).
   - Ajouter une route de test dans `frontend/src/App.tsx` :
     - `path="/product-stitch-demo"` → `element={<ProductStitchDemo />}` (sans `Layout` pour l’instant).
4. **Utilisation** :
   - Visiter `/product-stitch-demo` pour voir le rendu du layout Stitch.
   - S’en servir comme **laboratoire de layout** et référence visuelle pour faire évoluer la vraie page `Product.tsx`.

### 6.2. Workflows à mettre en place ensuite

- **Catalog / Search** :
  - Utiliser `/design` ou `/design-flow` pour explorer des variations de grilles, filtres, barre latérale, etc.
- **Design System** :
  - Utiliser `/design-system` pour extraire un set de couleurs / typo / composants de base cohérent avec Reboul, puis mapper ça sur Tailwind + shadcn.
- **QA Design / Accessibilité** :
  - Utiliser `/design-qa` sur des écrans Stitch ou Figma-exportés pour avoir des retours sur contraste, hiérarchie, lisibilité, responsive, etc.

---

## 7. Étapes concrètes à suivre (checklist)

1. **Installation Stitch MCP Auto**
   - [x] Installer gcloud et le SDK Google Cloud.
   - [x] Lancer le wizard `npx -p stitch-mcp-auto stitch-mcp-auto-setup`.
   - [x] Créer/configurer le projet GCP `stitch-reboul`.
2. **Brancher sur Claude Desktop / Claude Code**
   - [x] Laisser le wizard installer les commandes Stitch (`/design*`).
   - [x] Vérifier que `/design` fonctionne (c’est le cas).
3. **Rendre Stitch disponible dans Cursor**
   - [x] Créer/mettre à jour `~/.cursor/mcp.json` avec le serveur `stitch`.
   - [ ] (Optionnel) Exploiter les tools MCP Stitch directement depuis Cursor quand l’auth sera 100 % compatible.
4. **Workflows design frontend**
   - [x] Créer une première page de démo Product via Stitch (`ProductStitchDemo` + route `/product-stitch-demo`).
   - [ ] Répéter le workflow pour `Catalog`, `Search`, `Checkout`, etc.
   - [ ] Documenter quels patterns Stitch sont retenus / rejetés pour le design system.
5. **(Plus tard) Modèle de spaces & memories**
   - [ ] Mettre en place ou non des spaces de “mémoire” distincts (si on veut utiliser Stitch aussi comme knowledge hub).
   - [ ] Créer des entries “seed” à partir de `FRONTEND.md`, `IMAGES_IA_WORKFLOW.md`, etc.

---

## 8. Prochaine étape

- Étendre le workflow déjà testé (Product) aux autres pages clés (Catalog, Checkout…).
- Décider jusqu’où tu veux utiliser Stitch :
  - uniquement comme **générateur d’écrans / idées**,
  - ou aussi comme **source centrale de design system** (à synchroniser avec Tailwind + shadcn + Figma).

