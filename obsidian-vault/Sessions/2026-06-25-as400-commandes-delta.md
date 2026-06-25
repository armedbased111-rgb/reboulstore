---
type: session
date: 2026-06-25
sujet: AS400 deltas individuels + export commandes clients
---
# Session 25/06/2026 — AS400 deltas + commandes

## Contexte

Demande d'améliorations du module AS400 sortant pour Jacques :
1. Deltas ne doivent plus écraser le fichier unique — fichiers individuels horodatés
2. Nouveau : export commandes clients (facture/bon de commande)

## Changements

### Delta produits — fichiers individuels
- Avant : le delta écrasait `produits_reboul.csv`
- Apres : chaque delta crée `delta_YYYYMMDD_HHMMSS.csv` (les anciens restent)
- Full : comportement inchangé (écrase `produits_reboul.csv`)

### Export commandes clients (nouveau)
- Endpoint : `POST /sync-as400/export-commandes`
- Un fichier CSV par commande payée : `commandes/commande_<ID>_<TIMESTAMP>.csv`
- Colonnes : `numero_commande;date;nom_client;cod_article;reference;designation;prix_vente;taille;quantite`
- Tracking : `.as400-commandes-state.json` — ne re-exporte jamais une commande
- Ajouté au cron horaire (après export produits)

### Commandes test
- 3 commandes test insérées en BDD (orders #1, #2, #3)
- Jacques Dupont (2 articles), Marie Martin (1 article), Pierre Leblanc (3 articles)
- Fichiers générés et visibles sur le SFTP

### SSL
- Certificat expiré le 24/06 (erreur 526 Cloudflare)
- Renouvellement Let's Encrypt + copie vers nginx + reload

## Fichiers modifiés

- `backend/src/modules/sync-as400/sync-as400.service.ts` — delta horodaté + `exportCommandes()`
- `backend/src/modules/sync-as400/sync-as400.controller.ts` — endpoint `export-commandes`
- `backend/src/modules/sync-as400/sync-as400.module.ts` — import Order entity
- `backend/src/modules/sync-as400/sync-as400.scheduler.ts` — cron commandes
- `backend/src/modules/sync-as400/dto/export-commandes-result.dto.ts` — nouveau DTO

## Structure SFTP finale

```
/var/sftp/as400/
├── entrant/
│   └── sdi262011645
└── sortant/
    ├── produits_reboul.csv (1710 SKUs)
    ├── .as400-export-state.json
    ├── .as400-commandes-state.json
    └── commandes/
        ├── commande_1_*.csv
        ├── commande_2_*.csv
        └── commande_3_*.csv
```

## Deploy

Full deploy `--full` sur le VPS — backend rebuilt + nginx restarted.

## Liens

[[Securite/as400]] · [[Backend/orders]]
