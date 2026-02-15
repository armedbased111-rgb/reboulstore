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

## 5. Workflows « combo » Cursor + Claude Code

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

## 6. Où on va (vision « overpower »)

- **Court terme** : Phase 24 clôturée avec images IA intégrées (déjà en place) + workflow classique 24.7 validé ; politique livraison et checklist 24.9.
- **Moyen terme** : Phase 25 (recherche, Home, SEO, tests, perfs, filtres, dashboard) avec Cursor pour le code et Claude Code pour les tâches répétitives (CLI, batch, doc, git).
- **Usage** : un seul repo, un CLI (`./rcli`) comme colonne vertébrale, deux « cerveaux » (Cursor + Claude Code) qui partagent le même contexte (docs + CLAUDE.md + règles Cursor).

---

## 7. Fichiers de référence

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

**Prochaine étape** : installer/lancer Claude Code dans le repo, vérifier que CLAUDE.md est bien lu (« what does this project do? »), puis enchaîner sur une première tâche concrète (ex. batch images ou mise à jour roadmap 24.10).
