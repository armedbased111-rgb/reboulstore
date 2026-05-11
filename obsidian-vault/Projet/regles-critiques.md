---
type: regles
---
# Règles non-négociables

Ces règles s'appliquent à tout moment, sans exception.
Elles sont lues par Claude Code (CLAUDE.md racine) et par Cursor (project-rules.mdc).

Liens : [[Projet/Projet]]

---

## Base de données

- DB Reboul : **VPS uniquement** — jamais Docker local
- Dev : tunnel SSH → `host.docker.internal:5433`
- Prod : connexion directe VPS (152.228.218.35)
- **Jamais** `DB_HOST=postgres` ou `DB_HOST=localhost`
- Backup obligatoire avant toute opération risquée : `./rcli db backup --server`
- Le backup bloque l'opération si il échoue — ne jamais forcer

## Déploiement

- **Jamais** `docker compose down -v` → supprime les volumes DB = catastrophique
- **Toujours** `./scripts/deploy-prod.sh`
- Backup DB avant chaque déploiement sans exception
- `.env.production` obligatoire — build bloqué si absent
- Volumes à ne jamais supprimer : ceux contenant `postgres`, `db`, `database`

## Images produit

- Dimensions : **1024×1365** (ratio 3:4)
- Resize proportionnel : `sips -Z` — **jamais `sips -z`** (déforme l'image)
- Centrage : **PIL uniquement** — jamais l'IA (bbox + crop + padding + canvas)
- Chaussures : `--product-type shoe`, 2 vues (`1_face` + `4_top`), **pas de `--ref`** (cause hallucinations)
- Anti-hallucination : si l'IA invente des détails → donner la photo brute + Gemini ADJUST "remove bg, center, preserve everything"
- Flat lay : vêtement allongé à plat, étendu. "Pliage" = lissage des plis, pas rangement

## Git

- `git add .` toujours (pas de fichiers spécifiques)
- **Jamais** commiter `.env` ou `.env.production`
- Vérifier présence `.env.production` avant chaque build
- Branches : `feature/...`, `fix/...`, `refactor/...`, `docs/...`
- Commits : `type(scope): message`

## CLI

- Toujours `./rcli` depuis la **racine** du projet
- Priorité CLI pour toutes les opérations DB / images / docs / serveur
- Ne jamais lancer `npm run dev` — Docker tourne déjà
