---
type: session
date: 2026-05-19
statut: termine
---
# Session 2026-05-19 — AS400 stabilisation + deploy

Liens : [[Securite/as400]] · [[Collections/hologram]] · [[Projet/roadmap]]

## Objectif

Sécuriser l’export sortant après incident delta vide ; persister la config prod ; deploy avec protection `.env.production`.

## Fait

- **Fix delta vide** : si `lineCount: 0`, ne pas réécrire `produits_reboul.csv` (évite effacement catalogue).
- **Export full** restauré : **1498 lignes** (header `cod_article;reference;name;price;sku;size;color;stock`).
- **Hologram** : import BDD (`import-hologram-ss26.csv`) — 8 produits, 37 variants, `cod_article` OK.
- **VPS** : `AS400_EXPORT_SECRET` + cron dans `/var/www/reboulstore/.env.production` (conservé après deploy).
- **Deploy** : `deploy-prod.sh` exclut `.env.production` au rsync ; `env.production.example` section AS400.
- Deploy prod `--fast-build` 19/05 — secret inchangé, CSV intact post-deploy.

## Vérif prod

```bash
docker exec reboulstore-backend-prod printenv | grep AS400
wc -l /var/sftp/as400/sortant/produits_reboul.csv   # 1498
```

## Suite

- [ ] Envoyer [[Securite/as400-fiche-expert]] + mdp SFTP
- [ ] Expert confirme import `sortant/` côté AS400
- [ ] Phase 2 `entrant/` quand 1er CSV reçu
- [ ] Hologram : pipeline images flat lay
