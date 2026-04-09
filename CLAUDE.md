# Reboul Store – Contexte pour Claude Code

## Projet

E-commerce multi-sites (Reboul, puis CP Company, Outlet). Stack : React (Vite) + NestJS + PostgreSQL. Phase actuelle : **25** (Finalisation Frontend). Phase 24 clôturée (15/02/2026). Date du jour : 08/04/2026.

## Règles absolues

- **Base de données** : toujours sur le VPS. En dev : tunnel SSH (`host.docker.internal:5433`). Jamais de DB locale Docker pour Reboul.
- **Déploiement** : jamais `docker compose down -v` (risque de supprimer les volumes DB). Utiliser `./scripts/deploy-prod.sh` ou workflow doc dans project-rules.
- **Migrations / modifications DB** : faire un backup avant (`./rcli db backup --server`).
- **Fichiers sensibles** : ne pas commiter `.env` / `.env.production` ; vérifier leur présence avant build.
- **Git** : toujours `git add .` (pas de fichiers spécifiques).

## CLI principal : `./rcli`

Toutes les commandes depuis la **racine du projet**.

- **DB** : `./rcli db ref REF`, `product-find`, `product-list`, `variant-list`, `variant-set-stock`, `product-set-all-stock`, `export-csv`, etc. → `docs/context/DB_CLI_USAGE.md`
- **Import** : Admin → Import Collection (CSV ou collage). **Upsert** : si ref/SKU existe déjà, le stock est mis à jour (pas de crash doublon). Fichiers : `admin-central/backend/src/modules/reboul/reboul-import.service.ts`, `reboul-products.service.ts`.
- **Images IA** :
  - `./rcli images generate --input-dir photos -o output/` — génération unitaire
  - `./rcli images generate-batch --input-dir DIR -o output/ --refs-dir refs_empty` — batch multi-refs
  - `./rcli images adjust` — retouche/recadrage via Gemini
  - `./rcli images color-fix --dir output/` — correction couleur PIL/numpy (`--batch` pour tout un dossier)
  - `./rcli images upload --ref REF --dir output/` — upload vers CDN
  - `--product-type shoe` — flag pour les baskets (pipeline shoe : profil latéral + vue top)
  - → `docs/integrations/IMAGES_PRODUIT_PIPELINE.md`
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

## Collections actives (état 20/03/2026)

| Marque           | Slug BDD       | État images                              |
|------------------|----------------|------------------------------------------|
| Stone Island     | `stone-island` | 63 refs générées, 61 à uploader          |
| Bisous Skateboards | `bisous`     | 25 refs générées, 8 vides, 0 uploadées   |
| Autry            | `autry`        | 40 refs (36 + 4 new), non triées/uploadées |
| Off-White        | `off-white`    | 7 refs, pas de photos encore             |
| Arte Antwerp     | `arte`         | 10 refs, photos dispo, pipeline à faire  |

Détail dans `memory/MEMORY.md` (section Collections).

## Images – Règles importantes

- **Centrage** : toujours PIL (jamais IA). Détecter bbox, crop + padding, recentrer sur canvas.
- **Dimensions** : 1024×1365 (ratio 3:4). Resize avec `sips -Z` (proportionnel) — **jamais `sips -z`** (déforme).
- **Flat lay** : vêtement allongé à plat, étendu. "Pliage" = lissage des plis (wrinkle smoothing), pas rangement.
- **Chaussures** : 2 vues — `1_face` (profil latéral, génération IA) + `4_top` (vue top, Gemini ADJUST). Pas de `--ref` pour les shoes (hallucinations).
- **Anti-hallucination** : si l'IA invente des badges/logos → donner photo source brute + Gemini ADJUST "remove bg, center, preserve everything".
- Détails : `memory/pipeline_shoes_autry.md`, `memory/MEMORY.md`

## Quand utiliser Claude

Batch/CLI/doc/git (images, db ref, docs sync, roadmap, commit, backup) → Claude. Design, animations, règles détaillées → Cursor. Détail : `docs/context/CLAUDE_CODE_CURSOR_CONTEXT.md` § 10.

## Références utiles

- Roadmap détaillée : `docs/context/ROADMAP_COMPLETE.md` (Phase 24, 25)
- Frontend détaillé : `frontend/FRONTEND.md` (stack, structure, design system, animations)
- Backend détaillé : `backend/BACKEND.md` (modules, entités, API)
- Contexte Claude Code + Cursor : `docs/context/CLAUDE_CODE_CURSOR_CONTEXT.md` (§ 10 = quand utiliser Claude)
- Pipeline images IA : `docs/integrations/IMAGES_IA_WORKFLOW.md`, `docs/integrations/IMAGES_PRODUIT_PIPELINE.md`
- Règles projet (Cursor) : `.cursor/rules/project-rules.mdc`
- Mémoire persistante : `.claude/projects/…/memory/MEMORY.md`

## Automatisation navigateur (Playwright)

**Playwright = navigateur réel de Claude.** Pas juste du scraping — Claude peut voir, agir et réparer via un vrai Chromium headless.

### Règle fondamentale
**Chaque nouvelle demande Playwright = nouveau script dédié** dans `.claude/skills/playwright/scripts/`.
Toujours lire `.claude/skills/playwright/SKILL.md` en premier.

### Cas d'usage (non exhaustif)
- Scraper / extraire des données → `run.js`
- Review UI + améliorations frontend → `ui-inspect.js`
- Tester un formulaire, vérifier des liens cassés → script dédié
- Surveiller une page externe → script dédié
- Tout autre besoin "navigateur" → créer le script adapté

### Workflow UI Review frontend (OBLIGATOIRE)
Quand l'utilisateur demande des améliorations UI / frontend :
1. **Capturer** : `node .claude/skills/playwright/scripts/ui-inspect.js http://localhost:3000/<route>`
2. **Lire** les screenshots PNG avec l'outil Read (desktop + mobile)
3. **Analyser** visuellement : espacement, typo, hiérarchie, responsive, cohérence design
4. **Proposer** les améliorations avec justification — ce qui est bien + ce qui peut mieux
5. **Attendre** l'accord explicite avant de toucher au code
6. **Exécuter** puis **recapturer** pour vérifier le résultat

## Conventions Git

Branches : `feature/...`, `fix/...`. Commits : `type(scope): message` (feat, fix, docs, refactor, etc.). Toujours `git add .`.
