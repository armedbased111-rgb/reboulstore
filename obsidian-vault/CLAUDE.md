# CLAUDE.md — Instructions pour l'IA

## Chemin du vault
`obsidian-vault/` à la racine du projet Reboul Store.

## Premier réflexe
Lire `REBOUL.md` — point d'entrée global, état réel du projet, liens vers tout le vault.

## Structure du vault — 6 sections

```
REBOUL.md               ← point d'entrée, état global + liens vers les 7 hubs
TODO.md                 ← vue tâches agrégées (plugin Tasks)
Frontend/               ← 22 pages React + design system + animations + API
Backend/                ← modules NestJS (endpoints + entités + règles métier)
Database/               ← PostgreSQL — 16 tables, schéma, backup, connexion VPS
Collections/            ← 12 marques SS26 (data + pipeline images + tâches)
Architecture/           ← VPS, stack, workflow, services tiers, pipeline images, CLI
Securite/               ← cluster sécurité (état, hardening, pentest, AS400, checklist)
Projet/                 ← roadmap thématique, règles critiques
Sessions/               ← logs de sessions de travail (YYYY-MM-DD-sujet.md)
_templates/             ← modèles Templater
.claude/commands/       ← slash-commands (workflows réutilisables)
```

## Navigation par sujet

| Sujet | Où aller |
|-------|----------|
| Page frontend à modifier | `Frontend/Frontend.md` → fichier de la page |
| Module backend | `Backend/Backend.md` → fichier du module |
| Opération DB | `Database/Database.md` → règles + entités |
| Backup / connexion | `Database/backup.md` |
| Pipeline images | `Architecture/pipeline-images.md` |
| Déploiement | `Architecture/vps.md` |
| Services tiers (Stripe, Cloudinary…) | `Architecture/services-tiers.md` |
| API Frontend↔Backend | `Frontend/api.md` |
| Flux complet du site | `Architecture/workflow.md` |
| Collection SS26 | `Collections/Collections.md` → marque |
| Roadmap / tâches | `Projet/roadmap.md` |
| Règles non-négociables | `Projet/regles-critiques.md` |
| Sécurité / pentest | `Securite/Securite.md` |
| AS400 / réunion cyber | `Securite/as400.md` |

## Règles non-négociables (toujours respecter)
- DB Reboul : VPS uniquement — jamais Docker local (`host.docker.internal:5433` en dev)
- Déploiement : jamais `docker compose down -v` — toujours `./scripts/deploy-prod.sh`
- Backup DB obligatoire avant opération risquée : `./rcli db backup --server`
- Jamais commiter `.env` ou `.env.production`
- CLI prioritaire : `./rcli` pour toutes opérations DB/images/docs/serveur
- `git add .` toujours (pas de fichiers spécifiques)
- Images : `sips -Z` (jamais `-z`) — centrage PIL (jamais IA)

## Tâches (plugin Tasks)
- Format : `- [ ] tâche` dans n'importe quel fichier
- Vue centrale : `TODO.md`
- Cocher : `- [x]` quand fait

## Slash-commands disponibles

### Sync vault
| Commande | Périmètre |
|----------|-----------|
| `/vault` | **Sync intégral** — lit TOUT, met à jour tous les clusters, rapport complet |
| `/sync-frontend` | Cluster Frontend uniquement — pages, composants, design system |
| `/sync-backend` | Cluster Backend uniquement — modules, endpoints, entités |
| `/sync-collections` | Cluster Collections uniquement — marques, data, images |
| `/sync-securite` | Cluster Sécurité uniquement — hardening, checklist, pentest |
| `/sync-architecture` | Cluster Architecture uniquement — VPS, docker, CLI, services |
| `/sync-projet` | Cluster Projet uniquement — roadmap, tâches, sessions |

### Workflows
| Commande | Usage |
|----------|-------|
| `/page-review` | Workflow revue complète d'une page frontend (capture → analyse → fix) |
| `/collection` | Pipeline data + images d'une marque (CSV → import → génération → upload) |
| `/session` | Ouvrir une session de travail (crée Sessions/YYYY-MM-DD-sujet.md) |

## Mise à jour après chaque session
1. Mettre à jour le fichier individuel (statut, tâches cochées)
2. Si état global change → mettre à jour `REBOUL.md`
3. Créer `Sessions/YYYY-MM-DD-sujet.md` pour tracer le travail
