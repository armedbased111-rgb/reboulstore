# Workflow CLI

Utilisation du CLI Python pour automatiser les tâches.

## Vue d'ensemble

Le CLI Python est utilisé pour toutes les tâches répétitives du projet.

Voir [[../CLI/Overview.md|CLI_Overview]] pour la documentation complète.

## Workflows courants

### Avant développement

```bash
# Générer contexte à jour
./rcli context generate

# Vérifier roadmap
./rcli roadmap check

# Vérifier serveur
./rcli server status
```

### Génération de code

```bash
# Module complet
./rcli code generate module FeatureName --full

# Composant React
./rcli code component ProductCard --domain Product

# Page React
./rcli code page Checkout --entity Order
```

### Base de données

```bash
# Backup
./rcli db backup --server

# Migration
./rcli db generate migration AddUserTable

# Seed
./rcli db generate seed initial-data
```

### Documentation

```bash
# Synchroniser docs
./rcli docs sync

# Générer doc API
./rcli docs generate api
```

### Après tâche complétée

```bash
# Cocher tâche roadmap
./rcli roadmap update --task "15.1 Configuration Cloudinary"

# Synchroniser docs
./rcli docs sync
```

## Références

- [[../CLI/Overview.md|CLI_Overview]] - Vue d'ensemble CLI
- [[../cli/USAGE.md|CLI_USAGE]] - Guide d'utilisation complet
- [[../docs/cli/CLI_SERVER_USAGE.md|CLI_SERVER_USAGE]] - Commandes serveur

