# Reboul Store – Contexte pour Claude Code

## Projet

E-commerce multi-sites (Reboul, puis CP Company, Outlet). Stack : React (Vite) + NestJS + PostgreSQL. Phase actuelle : **25** (Finalisation Frontend). Phase 24 clôturée (15/02/2026).

## Règles absolues

- **Base de données** : toujours sur le VPS. En dev : tunnel SSH (`host.docker.internal:5433`). Jamais de DB locale Docker pour Reboul.
- **Déploiement** : jamais `docker compose down -v` (risque de supprimer les volumes DB). Utiliser `./scripts/deploy-prod.sh` ou workflow doc dans project-rules.
- **Migrations / modifications DB** : faire un backup avant (`./rcli db backup --server`).
- **Fichiers sensibles** : ne pas commiter `.env` / `.env.production` ; vérifier leur présence avant build.

## CLI principal : `./rcli`

Toutes les commandes depuis la **racine du projet**.

- **DB** : `./rcli db ref REF`, `product-find`, `product-list`, `variant-list`, `variant-set-stock`, `product-set-all-stock`, `export-csv`, etc. → `docs/context/DB_CLI_USAGE.md`
- **Import** : Admin → Import Collection (CSV ou collage). **Upsert** : si ref/SKU existe déjà, le stock est mis à jour (pas de crash doublon). Fichiers : `admin-central/backend/src/modules/reboul/reboul-import.service.ts`, `reboul-products.service.ts`.
- **Images IA (24.10)** : `./rcli images generate --input-dir photos -o output/`, `./rcli images adjust`, `./rcli images upload --ref REF --dir output/` → `docs/integrations/IMAGES_PRODUIT_PIPELINE.md`
- **Roadmap** : `./rcli roadmap update --task "..."`, `./rcli roadmap check`
- **Docs** : `./rcli docs sync` (synchronise ROADMAP ↔ BACKEND.md ↔ FRONTEND.md)
- **Serveur** : `./rcli server status`, `./rcli server logs`, `./rcli db backup --server`

## Frontend (code React)

- **Stack** : React (TypeScript), Vite, TailwindCSS v4, shadcn/ui (`frontend/src/components/ui/shadcn`), AnimeJS (animations).
- **Structure** : `frontend/src/pages/` (Home, Catalog, Product, Cart, Checkout), `frontend/src/components/`, `frontend/src/hooks/`, `frontend/src/services/`.
- **Conventions** : mobile-first, design inspiré A-COLD-WALL* (minimaliste, premium), composants réutilisables, animations via AnimeJS + `AnimationProvider`. Référence détaillée : `frontend/FRONTEND.md`.
- **Règle code** : concis, commentaires essentiels uniquement, noms explicites.

## Backend (code NestJS)

- **Stack** : NestJS, TypeORM, PostgreSQL (toujours VPS ; tunnel en dev).
- **Structure** : `backend/src/modules/` (products, categories, cart, orders, auth, etc.), `backend/src/entities/`, services, controllers.
- **Conventions** : modules NestJS, DTOs, pas de logique métier dans les controllers. Référence détaillée : `backend/BACKEND.md`.
- **Règle code** : concis, commentaires essentiels uniquement.

## Quand utiliser Claude

Batch/CLI/doc/git (images, db ref, docs sync, roadmap, commit, backup) → Claude. Design, animations, règles détaillées → Cursor. Détail : `docs/context/CLAUDE_CODE_CURSOR_CONTEXT.md` § 10.

## Références utiles

- Roadmap détaillée : `docs/context/ROADMAP_COMPLETE.md` (Phase 24, 25)
- Frontend détaillé : `frontend/FRONTEND.md` (stack, structure, design system, animations)
- Backend détaillé : `backend/BACKEND.md` (modules, entités, API)
- Contexte Claude Code + Cursor : `docs/context/CLAUDE_CODE_CURSOR_CONTEXT.md` (§ 10 = quand utiliser Claude)
- Pipeline images IA : `docs/integrations/IMAGES_IA_WORKFLOW.md`, `docs/integrations/IMAGES_PRODUIT_PIPELINE.md`
- Règles projet (Cursor) : `.cursor/rules/project-rules.mdc`

## Conventions Git

Branches : `feature/...`, `fix/...`. Commits : `type(scope): message` (feat, fix, docs, refactor, etc.).
