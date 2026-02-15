# Claude Code + Cursor : contextualisation et setup (Phase 24 → fin de site)

**Objectif** : Utiliser **Claude Code** (terminal / IDE) et **Cursor** ensemble sur le projet Reboul Store pour clôturer la Phase 24, finaliser le site (Phase 25) et « overpower » la fin du projet.

---

## 1. Ce qu’on a : Cursor vs Claude Code

| | **Cursor** | **Claude Code** |
|---|------------|------------------|
| **Rôle** | IDE avec IA intégrée (chat, édition, terminal, règles projet) | Agent IA qui travaille dans le terminal (et IDE / web) |
| **Où** | Fenêtre éditeur (fichiers, chat, commandes) | Terminal : `claude` dans le repo |
| **Contexte** | Fichiers ouverts, règles `.cursor/`, docs | Lit les fichiers à la demande + **CLAUDE.md** à la racine |
| **Actions** | Modifier le code, lancer des commandes, expliquer | Exécuter des tâches (CLI, git, scripts), modifier des fichiers (avec ton accord) |
| **Complément** | Tu codes / revues dans Cursor ; l’IA Cursor suit les règles projet | Tu demandes des tâches en langage naturel ; Claude exécute `./rcli`, git, etc. |

**En pratique** :
- **Cursor** = ton quotidien : éditer, déboguer, demander des explications, respect des règles (DB VPS, déploiement, animations, etc.).
- **Claude Code** = renfort pour tâches définies : « génère les images pour les refs X,Y,Z », « vérifie les refs de la feuille avec db ref », « commit et décris les changements », « mets à jour la roadmap pour la tâche 24.10 ».

Les deux peuvent travailler sur le même repo : Cursor pour le flux de dev, Claude Code pour des enchaînements CLI / batch / doc.

---

## 2. Notre stack (rappel)

- **Frontend** : React (Vite), shadcn/ui, Tailwind, AnimeJS.
- **Backend** : NestJS, TypeORM, PostgreSQL (toujours sur VPS ; en dev : tunnel SSH `host.docker.internal:5433`).
- **CLI** : `./rcli` (Python, Click) à la racine — DB, images IA, roadmap, server, deploy, docs, etc.
- **Phase en cours** : **24** (Préparation collection réelle). **24.10** = pipeline images IA (photos brutes → `./rcli images generate` → `./rcli images upload --ref REF`).
- **À venir** : **Phase 25** (Recherche, Home, SEO, tests, perfs, filtres catalog, dashboard admin).

Tout ça doit être compréhensible par Claude Code (via CLAUDE.md) et par Cursor (règles existantes).

---

## 3. Ce qu’on va faire avec Claude Code + Cursor

### 3.1 Clôturer la Phase 24

- **24.7** (workflow images produit) : finaliser validation E2E, qualité, doc.
- **24.10** (images IA) : déjà en place (`./rcli images generate|adjust|upload`). Utiliser Claude Code pour :
  - Enchaîner generate → upload pour une liste de refs (batch).
  - Vérifier les refs avec `./rcli db ref <REF>` avant/après.
- **24.3, 24.9** : politique livraison, checklist finale — Cursor pour la config / doc, Claude Code pour mise à jour ciblée de la roadmap ou des checklists.

### 3.2 Automatisations et workflows possibles

Avec **Claude Code** (en lui demandant en langage naturel) :

1. **Images IA (24.10)**  
   - « Pour chaque ref dans la feuille refs.txt : si le produit existe, run generate depuis photos/REF puis upload avec --ref REF. »
   - « Vérifie que les refs de collection Stone SS26 ont bien des images en base. »

2. **DB & collection**  
   - « Pour chaque ligne de refs.csv, exécute `./rcli db ref REF` et résume les erreurs. »
   - « Liste les produits sans image (ou stock 0) pour la marque X. » (en s’appuyant sur `db product-list`, `db ref`, etc.)

3. **Git & doc**  
   - « Commit les changements avec un message feat: … et mets à jour la roadmap pour la tâche 24.10. »
   - « Synchrone la doc : roadmap ↔ BACKEND.md ↔ FRONTEND.md » (équivalent `./rcli docs sync`).

4. **Serveur / déploiement**  
   - « Vérifie le statut des services avec ./rcli server status. »
   - « Lance un backup DB avant la migration. » (`./rcli db backup --server`)

Avec **Cursor** (règles projet + chat) :

- Respect strict : DB toujours VPS, pas de `docker compose down -v`, backup avant migrations, etc.
- Implémentation de nouvelles features (Phase 25 : recherche, Home, SEO, filtres, dashboard).
- Code front/back et cohérence avec la roadmap.

### 3.3 Rôle de chaque outil (résumé)

- **Cursor** : code, architecture, respect des règles, revue, explications.
- **Claude Code** : tâches CLI (rcli images, rcli db, rcli server, rcli docs), batch, git, mises à jour roadmap/doc.
- **CLI `./rcli`** : point d’entrée commun (DB, images IA, server, deploy, roadmap, docs) — utilisé par toi, par Cursor (terminal), et par Claude Code (quand il exécute des commandes).

---

## 4. Setup A → Z

### 4.1 Claude Code (déjà acheté)

1. **Installation** (si pas déjà fait) :
   ```bash
   curl -fsSL https://claude.ai/install.sh | bash
   # ou
   brew install --cask claude-code
   ```
2. **Login** :
   ```bash
   claude
   /login
   ```
   Utiliser ton compte Claude (Pro/Max/Teams/Enterprise ou Console API).

3. **Premier test dans le repo** :
   ```bash
   cd /Users/tripleseptinteractive/code/reboulstore/reboulstore
   claude
   ```
   Puis par exemple : « what does this project do? », « list the main CLI commands », « where is the images pipeline? ».

### 4.2 Contexte projet pour Claude Code : CLAUDE.md

Un fichier **CLAUDE.md** à la **racine du projet** décrit le projet, les règles critiques et comment utiliser le CLI. Claude Code le lit quand il travaille dans ce repo.

Contenu typique (déjà créé à la racine) :
- Résumé du projet (Reboul Store, stack, Phase 24/25).
- Règles absolues : DB toujours VPS, pas de `down -v`, backup avant migrations, etc.
- CLI : `./rcli` (db, images, server, roadmap, docs).
- Références : ROADMAP_COMPLETE.md, IMAGES_PRODUIT_PIPELINE.md, DB_CLI_USAGE.md.

Tu peux enrichir CLAUDE.md au fil du temps (ex : commandes préférées, pièges à éviter).

### 4.3 Cursor (déjà en place)

- Règles projet : `.cursor/rules/project-rules.mdc` (DB, déploiement, animations, Figma, CLI, etc.).
- Pas de changement obligatoire : Cursor continue à utiliser ces règles. On peut ajouter une phrase du type : « Pour les tâches batch CLI (images, db, roadmap), on peut déléguer à Claude Code ; le CLI est décrit dans docs/context/CLAUDE_CODE_CURSOR_CONTEXT.md et à la racine dans CLAUDE.md. »

### 4.4 Vérifications rapides

- [ ] `claude` se lance et tu es connecté.
- [ ] Dans le repo : `claude -p "what is ./rcli used for?"` → réponse cohérente.
- [ ] `claude -p "list ./rcli subcommands"` (ou « how do I generate product images? ») → mention de `images generate` / `upload`.
- [ ] Cursor : les règles projet s’appliquent toujours ; tu peux lancer `./rcli images --help` ou `./rcli db ref REF` depuis le terminal Cursor.

---

## 5. Workflow « automatique » (Toi + Cursor + Claude + CLI)

- **Cursor ne peut pas lancer Claude Code**, mais les règles projet lui disent : pour les tâches **batch / CLI / doc / git**, **suggérer d’utiliser Claude Code** et fournir un **prompt prêt à coller**.
- **Commande Cursor** : `/claude-code-workflow` — décrit le workflow et donne les prompts types (batch images, vérif refs, docs sync, commit). L’IA Cursor utilise cette commande pour router et proposer le bon prompt.
- **Boucle** : Tu es dans Cursor → tu demandes un batch ou une mise à jour doc → je te dis « ouvre Claude Code et colle ce prompt » → tu exécutes dans le terminal → tu reviens dans Cursor. Contexte partagé : `CLAUDE.md` (Claude), project-rules (Cursor), `./rcli` (commun).

---

## 6. Frontend avec Claude Code

- **Claude Code peut modifier le code front** : il lit les fichiers (`frontend/src/...`), propose des édits (composants, pages, hooks). Il s’appuie sur **CLAUDE.md** (section « Frontend ») : stack React/Vite/Tailwind/shadcn/AnimeJS, structure, conventions, lien vers `frontend/FRONTEND.md`.
- **Quand faire le front dans Cursor vs Claude** :
  - **Cursor** : features avec règles projet (Figma, animations AnimeJS, design system), revue de code, explications pas à pas. Les règles détaillées (project-rules) sont dans Cursor.
  - **Claude Code** : refactors ciblés, ajout d’un composant ou d’une page en une demande (« ajoute un filtre prix dans Catalog »), corrections de style/typos. Tu peux lui dire « respecte frontend/FRONTEND.md et la section Frontend de CLAUDE.md ».
- **Pour une tâche front dans Claude** : ouvre `claude` dans le repo, décris la tâche (ex. « add a price range filter to Catalog.tsx using Tailwind and shadcn if needed »). Claude lira les fichiers concernés et `frontend/FRONTEND.md` si besoin. Après édition, tu reviens dans Cursor pour tester et ajuster (règles, design, animations).

---

## 7. Workflows « combo » Cursor + Claude Code

1. **Batch images pour une collection**  
   - Toi/Cursor : préparer `photos/` et `refs/`, vérifier `.env` (GEMINI_API_KEY).  
   - Claude Code : « Pour les refs dans refs_batch.txt, run generate puis upload pour chaque ref ; skip si le produit n’existe pas (vérifier avec db ref). »

2. **Finalisation Phase 24 + mise à jour doc**  
   - Cursor : finaliser 24.7 (workflow images classique), 24.3, 24.9.  
   - Claude Code : « Cocher les tâches 24.7 et 24.10 dans ROADMAP_COMPLETE.md », « ./rcli docs sync », « commit with message feat: close phase 24 images workflow ».

3. **Phase 25 (recherche, Home, SEO, etc.)**  
   - Cursor : implémentation des features (code, règles projet).  
   - Claude Code : « Après chaque livrable : mise à jour roadmap, docs sync, commit conventionnel. »

---

## 8. Où on va (vision « overpower »)

- **Court terme** : Phase 24 clôturée avec images IA intégrées (déjà en place) + workflow classique 24.7 validé ; politique livraison et checklist 24.9.
- **Moyen terme** : Phase 25 (recherche, Home, SEO, tests, perfs, filtres, dashboard) avec Cursor pour le code et Claude Code pour les tâches répétitives (CLI, batch, doc, git).
- **Usage** : un seul repo, un CLI (`./rcli`) comme colonne vertébrale, deux « cerveaux » (Cursor + Claude Code) qui partagent le même contexte (docs + CLAUDE.md + règles Cursor).

---

## 9. Fichiers de référence

| Fichier | Usage |
|--------|--------|
| **CLAUDE.md** (racine) | Contexte projet pour Claude Code |
| **docs/context/CLAUDE_CODE_CURSOR_CONTEXT.md** | Ce doc : vision, setup, workflows |
| **docs/context/ROADMAP_COMPLETE.md** | Phase 24/25, tâches à cocher |
| **docs/integrations/IMAGES_IA_WORKFLOW.md** | Règles prise de vues, prompts, pipeline IA |
| **docs/integrations/IMAGES_PRODUIT_PIPELINE.md** | Récap 3 étapes : generate → adjust → upload |
| **docs/context/DB_CLI_USAGE.md** | CLI DB (ref, product-list, set-stock, etc.) |
| **.cursor/rules/project-rules.mdc** | Règles Cursor (DB, déploiement, animations, etc.) |

---

## 10. Récap : tout le setup Claude + quand l’utiliser

### Ce qu’on a déjà mis en place

| Élément | Rôle |
|--------|------|
| **CLAUDE.md** (racine) | Contexte lu par Claude à chaque session : projet, règles (DB VPS, pas de `down -v`, backup avant migration), CLI, frontend (stack, structure, conventions), références docs. |
| **Plan 24.11** (ROADMAP_COMPLETE.md) | Étapes 1–8 (install, contexte, CLI, DB, images, roadmap, git, règles) + étapes 9–10 (usage réel : batch, clôture Phase 24, support Phase 25). |
| **docs/context/CLAUDE_CODE_CURSOR_CONTEXT.md** | Ce fichier : vision Cursor vs Claude, setup, workflows combo, frontend avec Claude, récap. |
| **Commande Cursor `/claude-code-workflow`** | Quand utiliser Claude vs Cursor, prompts prêts à coller (batch images, vérif refs, docs sync, commit, backup, exemple frontend). |
| **Règle Cursor (project-rules)** | Pour les tâches batch/CLI/doc/git, Cursor suggère d’utiliser Claude Code et fournit un prompt prêt à coller. |
| **Pipeline images** | Upload par défaut = replace (supprime les anciennes puis upload) ; `--append` pour ajouter sans supprimer. |
| **CLAUDE.md Backend** | Section Backend (NestJS, structure, conventions) + section « Quand utiliser Claude ». |
| **Script `scripts/claude-prompt.sh`** | Requête one-shot : `./scripts/claude-prompt.sh "Run ./rcli docs sync"` (équivalent à `claude -p "..."`). |

### Ce qu’on pourrait encore setup (optionnel)

- **Enrichir CLAUDE.md** : ajouter une section Backend (stack NestJS, structure `backend/src/`, conventions), ou des « pièges à éviter » (ex. ne pas toucher à `.env.production`).
- **Skills Claude Code** : si Claude Code supporte des skills custom (fichiers ou dossiers dédiés), ajouter un skill « Reboul » qui charge CLAUDE.md + chemins clés (ROADMAP, IMAGES_PIPELINE, DB_CLI).
- **Script raccourci** : un script `./scripts/claude-prompt.sh "ta demande"` qui ouvre une session Claude avec le prompt pré-rempli (pour gagner du temps depuis Cursor).
- **Checklist par type de tâche** : un petit doc « Quand je fais X, je dis à Claude Y » (ex. avant import collection → « vérifie les refs dans refs.txt avec db ref »).
- **MCP / API** : si un jour un pont Cursor ↔ Claude Code existe (MCP ou API), le brancher pour que Cursor puisse déléguer une tâche à Claude sans que tu colles le prompt à la main.

### Dans quelles circonstances on utilise Claude

| Circonstance | On utilise Claude pour… | Exemple de prompt / action |
|--------------|--------------------------|----------------------------|
| **Batch images (plusieurs refs)** | Pour chaque ref : vérifier en base → generate → upload. | « Pour chaque ref dans refs_batch.txt : db ref, puis si OK images generate depuis photos/REF, puis images upload --ref REF. Résume succès/échecs. » |
| **Vérifier une feuille de stock avant import** | Exécuter `db ref` sur chaque ref et lister les manquantes. | « Pour chaque ligne de refs.txt run ./rcli db ref REF. Liste les refs non trouvées. » |
| **Sync doc après une avancée** | Lancer `./rcli docs sync` et éventuellement cocher des tâches roadmap. | « Run ./rcli docs sync. Puis coche dans ROADMAP la tâche [X]. » |
| **Commit de session** | Résumer les changements et proposer un commit conventionnel. | « What files have I changed? Commit with message type(scope): description. » |
| **Backup avant migration / opération risquée** | Lancer le backup DB côté serveur. | « Before we run a migration, run ./rcli db backup --server and confirm. » |
| **Clôture Phase 24 (étapes 9–10)** | Batch images, cocher 24.7 / 24.9 / 24.11, docs sync. | Prompts de l’Étape 9 (voir ROADMAP § 24.11). |
| **Phase 25 (après chaque livrable)** | Mise à jour roadmap + docs sync + commit. | « Update roadmap for task [X], run ./rcli docs sync, then commit with feat: … » |
| **Refactor / tâche front ciblée** | Modifier un composant ou une page (sans Figma/animations complexes). | « Read FRONTEND.md and CLAUDE.md Frontend. Add [feature] to [fichier]. Keep code concise. » |
| **Vérif serveur / déploiement** | Statut des services, logs (en lecture). | « Run ./rcli server status and summarize. » |

### En résumé

- **Cursor** : code au quotidien, règles projet, Figma, animations, architecture, revue. C’est l’outil principal.
- **Claude Code** : dès qu’il y a **enchaînement de commandes** (CLI, batch, doc, git) ou **tâche front/back ciblée** bien décrite, tu ouvres `claude` dans le repo, tu colles un prompt (ou tu le formules), et Claude exécute. Le contexte est dans **CLAUDE.md** et les docs référencées.
- **Quand tu hésites** : demande-toi « est-ce que c’est surtout du batch / CLI / doc / git ou une tâche bien délimitée ? » → Claude. « Est-ce que ça touche au design, aux animations, aux règles projet détaillées ? » → Cursor.
