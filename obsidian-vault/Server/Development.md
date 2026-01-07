# Serveur Développement

Documentation pour le développement local.

## Documents

- [[../docs/server/DEV_DATABASE_TUNNEL.md|DEV_DATABASE_TUNNEL]] - Tunnel SSH pour base de données
- [[../docs/server/DNS_FIX_GUIDE.md|DNS_FIX_GUIDE]] - Guide fix DNS
- [[../docs/server/DNS_FIX_VERCEL.md|DNS_FIX_VERCEL]] - Fix DNS Vercel

## Vue d'ensemble

En développement local, la base de données est sur le VPS (pas de DB locale).

### Tunnel SSH

Connexion à la base de données VPS via tunnel SSH.

Voir [[../docs/server/DEV_DATABASE_TUNNEL.md|DEV_DATABASE_TUNNEL]] pour les détails.

## Configuration

### Variables d'environnement

- `DB_HOST=host.docker.internal` (via tunnel SSH)
- `DB_PORT=5433` (port local du tunnel)
- `DB_USERNAME=reboulstore`
- `DB_DATABASE=reboulstore_db`

### Tunnel SSH

```bash
ssh -L 5433:localhost:5432 -i ~/.ssh/id_ed25519 deploy@152.228.218.35 -N
```

Le tunnel expose PostgreSQL du VPS sur `localhost:5433`.

## Workflow

1. Activer tunnel SSH
2. Démarrer containers Docker
3. Containers se connectent via `host.docker.internal:5433`
4. Développement avec base de données VPS

