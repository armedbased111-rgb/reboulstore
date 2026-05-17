# `/init-cursor` — Mise à jour complète du contexte Cursor

**À utiliser** : quand tu reprends le projet après une pause, quand Claude Code t'annonce que le contexte global a changé, ou en début de session important.

---

## Ce que tu dois savoir sur ce projet

**Reboul Store** — E-commerce multi-sites (Reboul, CP Company, Outlet) pour une boutique physique à Marseille/Cassis/Sanary. Stack : React (Vite) + NestJS + PostgreSQL + Cloudinary + Stripe.

### État actuel (mai 2026)

- **Phase 25 en cours** — Finalisation frontend page par page
- **Backend** : stable, 18 modules NestJS complets
- **Infrastructure prod** : VPS OVH opérationnel, tous containers healthy, UptimeRobot actif
- **Sécurité** : Helmet ✅, rate limiting ✅, HSTS/CSP ✅, fail2ban ✅, pentest route rédigée
- **Collections** : 12 marques SS26 importées, pipeline images en cours
- **AS400** : intégration SFTP en cours de mise en place (Phase 1 à faire)
- **Lancement** : en attente Stripe live + pages légales (Julie)

### Ce qui a changé — contexte global mis à jour

Le projet a beaucoup avancé. **Toutes tes anciennes références sont obsolètes** :

| Ancien | Remplacé par |
|--------|-------------|
| `obsidian-vault/Projet/roadmap.md` | `obsidian-vault/Projet/roadmap.md` |
| `docs/context/CONTEXT.md` | `obsidian-vault/REBOUL.md` |
| `docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md` | `obsidian-vault/Architecture/Architecture.md` |
| `docs/context/PROJECT_STATUS.md` | `obsidian-vault/REBOUL.md` |
| `obsidian-vault/Projet/roadmap.md = source de vérité` | `obsidian-vault/` = source de vérité unique |

---

## Étape 1 — Lire le vault Obsidian (contexte unique)

Lis dans cet ordre :

1. `obsidian-vault/CLAUDE.md` — règles du vault et liste des slash-commands
2. `obsidian-vault/REBOUL.md` — état global du projet (LIRE EN PREMIER)
3. `obsidian-vault/Projet/roadmap.md` — roadmap complète + tâches en cours
4. `obsidian-vault/Securite/etat-actuel.md` — sécurité en place
5. `obsidian-vault/Architecture/vps.md` — infra VPS, containers, commandes deploy
6. `obsidian-vault/Collections/Collections.md` — 12 marques, état data/images
7. `obsidian-vault/Frontend/Frontend.md` — 22 pages, statuts
8. Les 3 derniers fichiers dans `obsidian-vault/Sessions/` — ce qui s'est passé récemment

---

## Étape 2 — Mettre à jour tes commandes

Après lecture du vault, mets à jour les commandes suivantes pour qu'elles pointent vers le vault et non les anciens fichiers :

**`getcontext.md`** — section "Par documentation" : remplacer par les chemins vault
**`update-roadmap.md`** — pointer vers `obsidian-vault/Projet/roadmap.md`
**`roadmap-phase-workflow.md`** — pointer vers `obsidian-vault/Projet/roadmap.md`
**`documentation-workflow.md`** — vault = source de vérité, plus `docs/context/`
**`as400-integration.md`** — plus "EN SUSPENS", c'est SFTP actif (voir `obsidian-vault/Securite/as400.md`)
**`claude-code-workflow.md`** — remplacer références roadmap restantes

Règle générale : toute mention de `obsidian-vault/Projet/roadmap.md` → `obsidian-vault/Projet/roadmap.md` / `docs/context/CONTEXT.md` → `obsidian-vault/REBOUL.md`

---

## Étape 3 — Mémoriser les infos clés

### VPS & Deploy

```
Host        : 152.228.218.35
User        : deploy
SSH key     : ~/.ssh/id_ed25519
Répertoire  : /var/www/reboulstore/
Deploy      : DEPLOY_HOST=deploy@152.228.218.35 ./scripts/deploy-prod.sh
```

### Containers Docker (noms exacts)

```
reboulstore-backend-prod    → API NestJS :3001
reboulstore-frontend-prod   → Build React (nginx statique)
reboulstore-nginx-prod      → Reverse proxy :80/:443
reboulstore-postgres-prod   → PostgreSQL (interne)
reboulstore-redis-prod      → Redis (interne)
```

### Commandes rcli importantes

```bash
./rcli server status
./rcli server maintenance [on|off|status]   # ← NOUVEAU 11/05/2026
./rcli server logs --tail 50
./rcli db backup --server
./rcli db ref <REF>
```

### AS400 — décision réunion 12/05/2026

- **SFTP bidirectionnel** sur notre VPS
- AS400 → nous : CSV stocks toutes les heures → `entrant/`
- Nous → AS400 : CSV mouvements toutes les heures → `sortant/`
- Phase 1 (setup SFTP) à faire → voir `obsidian-vault/Securite/as400.md`

### Mode pédagogique / normal

- **Pédagogique** (défaut) : Cursor explique, l'utilisateur code, Cursor vérifie
- **Normal** : Cursor code directement (sur demande explicite uniquement)

---

## Étape 4 — Rapport

Après lecture et mise à jour, signaler :
- Ce que tu as lu et compris sur l'état actuel du projet
- Les commandes que tu as mises à jour
- Ce qui te semble encore incohérent dans tes règles/commandes
- Les questions sur le projet ou l'état actuel
