---
type: session
date: 2026-05-12
sujet: Vérification backup automatique
statut: terminé
---
# Vérification backup cron 12/05/2026

Le cron backup a été réparé le 11/05/2026 (permissions log).
Vérifier ce soir que le backup du 12/05 s'est bien déclenché à 2h.

## Résultat (vérifié 17/05/2026)

- ✅ `reboulstore_db_20260512_020001.sql.gz` présent
- ✅ Enchaînement quotidien OK : 13, 14, 15, 16, 17 à 02:00
- ✅ Log : `Backup terminé` — dernier `20260517_020001.sql.gz` (104K)

## Commande

```bash
./rcli server exec "tail -5 /var/log/reboulstore-backup.log && ls -lht /var/www/reboulstore/backups/ | head -5"
```

## Résultat attendu

- Log : `✅ Backup terminé` avec timestamp `20260512_02xxxx`
- Fichier : `reboulstore_db_20260512_02xxxx.sql.gz` présent dans `/var/www/reboulstore/backups/`
