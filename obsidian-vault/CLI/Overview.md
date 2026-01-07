# CLI Python - Vue d'ensemble

Documentation complète du CLI Python pour automatiser les tâches.

## Documents

- [[../cli/README.md|CLI_README]] - Documentation CLI principale
- [[../cli/USAGE.md|CLI_USAGE]] - Guide d'utilisation
- [[../docs/cli/CLI_SERVER_USAGE.md|CLI_SERVER_USAGE]] - Commandes serveur
- [[../docs/cli/CLI_VPS_COMMANDS.md|CLI_VPS_COMMANDS]] - Commandes VPS
- [[../docs/cli/GUIDE_UTILISATION_SERVEUR.md|GUIDE_UTILISATION_SERVEUR]] - Guide serveur
- [[../docs/cli/VPS_CLI_IMPROVEMENTS.md|VPS_CLI_IMPROVEMENTS]] - Améliorations VPS

## Vue d'ensemble

Le CLI Python automatise :
- Génération de code (Backend, Frontend)
- Gestion base de données (migrations, seeds, backups)
- Gestion serveur (monitoring, logs, déploiement)
- Documentation (génération, synchronisation)
- Tests (génération, exécution)

## Installation

```bash
cd cli
./setup.sh
source venv/bin/activate
```

## Utilisation

Utiliser le wrapper `./rcli` à la racine :

```bash
./rcli server status
./rcli db backup --server
./rcli logs errors --last 1h
```

## Commandes principales

### Serveur
- `./rcli server status` - État des services
- `./rcli server monitor` - Monitoring ressources
- `./rcli server logs` - Logs services

### Base de données
- `./rcli db backup --server` - Backup base de données
- `./rcli db backup-list` - Lister backups
- `./rcli db backup-restore` - Restaurer backup

### Code
- `./rcli code generate module` - Générer module complet
- `./rcli code component` - Générer composant React
- `./rcli code page` - Générer page React

### Documentation
- `./rcli docs sync` - Synchroniser documentation
- `./rcli docs generate api` - Générer doc API

Voir [[../cli/USAGE.md|CLI_USAGE]] pour toutes les commandes.

