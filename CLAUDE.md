# Reboul Store – Contexte pour Claude Code

## Projet

E-commerce multi-sites (Reboul, puis CP Company, Outlet). Stack : React (Vite) + NestJS + PostgreSQL. Phase actuelle : **24** (Préparation collection réelle), puis **25** (Finalisation avant lancement).

## Règles absolues

- **Base de données** : toujours sur le VPS. En dev : tunnel SSH (`host.docker.internal:5433`). Jamais de DB locale Docker pour Reboul.
- **Déploiement** : jamais `docker compose down -v` (risque de supprimer les volumes DB). Utiliser `./scripts/deploy-prod.sh` ou workflow doc dans project-rules.
- **Migrations / modifications DB** : faire un backup avant (`./rcli db backup --server`).
- **Fichiers sensibles** : ne pas commiter `.env` / `.env.production` ; vérifier leur présence avant build.

## CLI principal : `./rcli`

Toutes les commandes depuis la **racine du projet**.

- **DB** : `./rcli db ref REF`, `product-find`, `product-list`, `variant-list`, `variant-set-stock`, `product-set-all-stock`, `export-csv`, etc. → `docs/context/DB_CLI_USAGE.md`
- **Images IA (24.10)** : `./rcli images generate --input-dir photos -o output/`, `./rcli images adjust`, `./rcli images upload --ref REF --dir output/` → `docs/integrations/IMAGES_PRODUIT_PIPELINE.md`
- **Roadmap** : `./rcli roadmap update --task "..."`, `./rcli roadmap check`
- **Docs** : `./rcli docs sync` (synchronise ROADMAP ↔ BACKEND.md ↔ FRONTEND.md)
- **Serveur** : `./rcli server status`, `./rcli server logs`, `./rcli db backup --server`

## Références utiles

- Roadmap détaillée : `docs/context/ROADMAP_COMPLETE.md` (Phase 24, 25)
- Contexte Claude Code + Cursor : `docs/context/CLAUDE_CODE_CURSOR_CONTEXT.md`
- Pipeline images IA : `docs/integrations/IMAGES_IA_WORKFLOW.md`, `docs/integrations/IMAGES_PRODUIT_PIPELINE.md`
- Règles projet (Cursor) : `.cursor/rules/project-rules.mdc`

## Conventions Git

Branches : `feature/...`, `fix/...`. Commits : `type(scope): message` (feat, fix, docs, refactor, etc.).
