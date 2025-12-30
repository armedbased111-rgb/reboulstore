# ⚡ CLI - Référence Rapide

## 🚀 Wrapper Script

Utiliser `./rcli` à la racine du projet (au lieu de `python cli/main.py`) :

```bash
./rcli [command] [options]
```

## 📋 Commandes Principales

### Serveur

```bash
./rcli server status              # État des containers
./rcli server monitor --once      # Ressources (CPU, RAM, Disque)
./rcli server backup --full       # Backup complet (DB + fichiers)
./rcli server rollback --list     # Liste des backups
./rcli server cron --list         # Liste des cron jobs
./rcli server security --audit    # Audit de sécurité
./rcli server ssl --check         # Vérifier certificats SSL
./rcli server dns --propagate     # Vérifier propagation DNS
```

### Logs

```bash
./rcli logs                        # Logs de tous les services
./rcli logs errors --last 1h      # Erreurs uniquement
./rcli logs api-errors             # Erreurs API (4xx, 5xx)
./rcli logs slow-requests          # Requêtes lentes (>2s)
./rcli logs user-activity          # Activité utilisateurs
./rcli logs search "ERROR"         # Rechercher un motif
```

### Base de données

```bash
./rcli db backup --server          # Backup DB serveur
./rcli db backup-list              # Liste des backups
./rcli db backup-restore <file>    # Restaurer un backup
```

### Code & Documentation

```bash
./rcli code component ProductCard  # Générer composant React
./rcli code page Checkout          # Générer page React
./rcli code generate module Order  # Générer module NestJS complet
./rcli roadmap update --task "..." # Mettre à jour roadmap
./rcli docs sync                   # Synchroniser docs
```

## 🎯 Workflows Rapides

### Avant déploiement
```bash
./rcli server backup --full && ./rcli server monitor --once
```

### Après déploiement
```bash
./rcli server status && ./rcli logs api-errors --last 5m
```

### Si problème
```bash
./rcli server rollback --latest
```

### Maintenance hebdomadaire
```bash
./rcli server ssl --check && ./rcli server security --audit
```

## 📚 Documentation Complète

- **CLI_SERVER_COMMANDS.md** : Toutes les commandes serveur
- **USAGE.md** : Guide complet d'utilisation
- **RECAPITULATIF.md** : Récapitulatif de toutes les commandes

