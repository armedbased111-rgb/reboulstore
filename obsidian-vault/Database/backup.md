---
type: database
---
# Backup & Sécurité DB

Liens : [[Database/Database]]

---

## Backup manuel

```bash
# TOUJOURS avant toute opération risquée
./rcli db backup --server

# Lister les backups disponibles
./rcli db backup-list

# Restaurer (demande confirmation)
./rcli db backup-restore reboulstore_db_YYYYMMDD_HHMMSS.sql.gz
```

Backups stockés : `/opt/reboulstore/backups/` sur le VPS.
Format : `reboulstore_db_YYYYMMDD_HHMMSS.sql.gz`

**Le backup bloque l'opération si il échoue — ne jamais forcer.**

---

## Volumes Docker critiques

**NE JAMAIS supprimer ces volumes :**
- `reboulstore_postgres_prod`
- `postgres_data_prod`

`docker compose down -v` = destruction irréversible. **Interdit absolu.**
Toujours utiliser `docker compose down` (sans `-v`).

---

## Règles de connexion

```bash
# ✅ Dev — tunnel SSH
DB_HOST=host.docker.internal
DB_PORT=5433

# ✅ Prod — VPS direct
DB_HOST=152.228.218.35
DB_PORT=5432

# ❌ Jamais
DB_HOST=postgres
DB_HOST=localhost
```

---

## Tunnel SSH dev

```bash
ssh -L 5433:localhost:5432 -i ~/.ssh/id_ed25519 deploy@152.228.218.35 -N
```

---

## Commandes d'inspection

```bash
./rcli db ref <REF>                          # hub complet : produit + variants
./rcli db product-find --ref REF
./rcli db product-list --brand "Stone Island"
./rcli db variant-list --ref REF
./rcli db variant-set-stock --ref REF --size S --stock 3
./rcli db order-list --last 10
./rcli db cart-list --last 10
```
