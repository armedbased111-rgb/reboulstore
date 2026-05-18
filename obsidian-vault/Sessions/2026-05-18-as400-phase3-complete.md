---
type: session
date: 2026-05-18
sujet: AS400 Phase 3 sortant — clôture B1–B4
statut: terminé
---
# Session — AS400 sortant clôturé (18/05/2026)

## Bilan

**Côté Reboul : maximum fait** pour l’envoi vers l’AS400.

| Phase | Statut |
|-------|--------|
| 1 SFTP VPS | ✅ |
| 3 sortant B1–B4 | ✅ |
| 2 entrant | ⏸️ attend leur CSV |
| Fiche expert | ⏳ à envoyer |

## Livrable `sortant/`

- **1 fichier** : `produits_reboul.csv` — mis à jour **chaque heure** (`@Cron` `0 * * * *`)
- **Delta** : modifs + `change_type` (`update` / `delete`)
- **Full** : ~1×/semaine ou 1er run
- Snapshot interne : `.as400-export-state.json` (pas pour l’expert)

## Validation prod

- Cron **14:00 UTC** : 1 ligne `update` après test stock `099T-BLACK-L` ✅
- Backup session : `reboulstore_db_20260518_160426.sql.gz`

## Suite

- Transmettre [[Securite/as400-fiche-expert]] + mot de passe
- Phase 2 quand 1er CSV dans `entrant/`
