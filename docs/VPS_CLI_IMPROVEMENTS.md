# Améliorations CLI pour gestion VPS

## 🎯 Objectif

Créer des commandes CLI Python pour faciliter la gestion du serveur VPS OVH, complémentaires aux scripts bash existants.

## 📋 Commandes existantes (scripts bash)

### Scripts de base
- `scripts/backup-db.sh` - Backup PostgreSQL
- `scripts/view-logs.sh` - Visualisation logs Docker
- `scripts/security-audit.sh` - Audit sécurité
- `scripts/test-deployment.sh` - Tests déploiement
- `scripts/setup-https.sh` - Installation HTTPS
- `scripts/setup-cdn-cloudflare.sh` - Guide Cloudflare
- `scripts/setup-monitoring-ga4.sh` - Guide GA4
- `scripts/setup-backup-cron.sh` - Configuration cron backup

## 💡 Commandes CLI proposées

### 1. Gestion Docker & Containers

```bash
python cli/main.py server status
# Affiche l'état de tous les containers (Reboul Store + Admin Central)
# Formate le tableau joliment avec couleurs

python cli/main.py server logs [service] [--tail 50] [--follow]
# Affiche les logs d'un service ou tous les services
# Ex: server logs backend --tail 100
# Ex: server logs nginx --follow

python cli/main.py server restart [service]
# Redémarre un service ou tous les services
# Ex: server restart backend
# Ex: server restart all

python cli/main.py server ps
# Liste les containers avec détails (ports, status, uptime)
```

### 2. Déploiement

```bash
python cli/main.py deploy [--service reboul|admin|all] [--build]
# Déploie les services sur le serveur
# Ex: deploy --service reboul --build
# Ex: deploy --all

python cli/main.py deploy check
# Vérifie que le déploiement fonctionne (healthchecks, APIs)
```

### 3. Base de données

```bash
python cli/main.py db backup [--output backup.sql]
# Crée un backup de la base de données
# Sauvegarde automatique avec timestamp

python cli/main.py db restore [backup_file]
# Restaure une backup
# Avertissement de confirmation avant restauration

python cli/main.py db status
# Affiche l'état de la DB (taille, connexions, dernières backups)

python cli/main.py db migrations [run|revert|status]
# Gère les migrations TypeORM
# Ex: db migrations run
# Ex: db migrations status
```

### 4. Monitoring & Health

```bash
python cli/main.py health [--service reboul|admin|all]
# Vérifie la santé de tous les services
# Tests: frontend accessible, backend healthcheck, DB connexion

python cli/main.py server resources
# Affiche utilisation ressources (CPU, RAM, disque, réseau)
# Via docker stats ou système

python cli/main.py server uptime
# Affiche uptime des containers et du serveur
```

### 5. Configuration & Sécurité

```bash
python cli/main.py server env [--check|--backup]
# Vérifie les variables d'environnement
# Backup des fichiers .env

python cli/main.py security audit
# Lance l'audit de sécurité complet
# npm audit + vérification fichiers sensibles

python cli/main.py security headers [--test]
# Teste les headers de sécurité sur les URLs
```

### 6. Tests & Validation

```bash
python cli/main.py test deployment
# Lance tous les tests de déploiement
# Utilise scripts/test-deployment.sh

python cli/main.py test api [--endpoint /products]
# Teste un endpoint API spécifique
```

### 7. Maintenance

```bash
python cli/main.py server cleanup [--volumes|--images|--all]
# Nettoie les ressources Docker inutilisées
# Avec confirmation avant suppression

python cli/main.py server update [--pull|--rebuild]
# Met à jour le code depuis git et redémarre
# Ex: server update --pull
# Ex: server update --rebuild (rebuild images)
```

### 8. Logs & Debugging

```bash
python cli/main.py logs errors [--service backend] [--last 24h]
# Filtre et affiche uniquement les erreurs
# Par service et période

python cli/main.py logs search [pattern] [--service] [--last 1h]
# Recherche dans les logs
# Ex: logs search "ERROR" --service backend --last 24h
```

## 🔧 Architecture proposée

### Structure CLI

```
cli/
├── commands/
│   ├── server.py          # Nouvelles commandes serveur
│   │   ├── status()
│   │   ├── logs()
│   │   ├── restart()
│   │   ├── resources()
│   │   └── cleanup()
│   ├── deploy.py          # Commandes déploiement
│   │   ├── deploy()
│   │   ├── check()
│   │   └── update()
│   └── health.py          # Commandes monitoring
│       ├── check()
│       └── test()
├── utils/
│   ├── server_helper.py   # Utilitaires SSH/Docker
│   │   ├── ssh_exec()
│   │   ├── docker_compose_exec()
│   │   └── get_container_status()
│   └── health_checker.py  # Vérifications santé
│       ├── check_frontend()
│       ├── check_backend()
│       └── check_database()
```

### Configuration SSH

```python
# cli/config/server_config.py
SERVER_CONFIG = {
    'host': '152.228.218.35',
    'user': 'deploy',
    'ssh_key': '~/.ssh/id_rsa',  # Optionnel
    'project_path': '/opt/reboulstore',
    'admin_path': '/opt/reboulstore/admin-central',
}
```

### Utilisation SSH via paramiko

```python
import paramiko

def ssh_exec(command, cwd=None):
    """Exécute une commande sur le serveur via SSH"""
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(SERVER_CONFIG['host'], username=SERVER_CONFIG['user'])
    
    if cwd:
        command = f"cd {cwd} && {command}"
    
    stdin, stdout, stderr = ssh.exec_command(command)
    return stdout.read().decode(), stderr.read().decode()
```

## 🎨 Exemples d'implémentation

### Exemple 1: `server status`

```python
@server.command('status')
def server_status():
    """Affiche l'état de tous les containers"""
    output, _ = ssh_exec('docker compose ps', cwd=PROJECT_PATH)
    # Parser et formater joliment avec rich/colorama
    print(format_container_status(output))
```

### Exemple 2: `deploy check`

```python
@deploy.command('check')
def deploy_check():
    """Vérifie que le déploiement fonctionne"""
    results = {
        'reboul_frontend': check_url('http://www.reboulstore.com'),
        'reboul_backend': check_url('http://www.reboulstore.com/health'),
        'admin_frontend': check_url('http://admin.reboulstore.com'),
        'admin_backend': check_url('http://admin.reboulstore.com/health'),
    }
    
    for service, status in results.items():
        print(f"{service}: {'✅' if status else '❌'}")
```

### Exemple 3: `db backup`

```python
@db.command('backup')
@click.option('--output', default=None, help='Fichier de sortie')
def db_backup(output):
    """Crée un backup de la base de données"""
    if not output:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output = f'/opt/reboulstore/backups/db_backup_{timestamp}.sql'
    
    command = f'./scripts/backup-db.sh > {output}'
    ssh_exec(command, cwd=PROJECT_PATH)
    print(f"✅ Backup créé: {output}")
```

## 📊 Priorités d'implémentation

### Priorité 1 (Essentiel)
1. `server status` - Voir l'état rapidement
2. `server logs` - Visualiser logs facilement
3. `deploy check` - Vérifier que tout fonctionne
4. `health` - Check santé complet

### Priorité 2 (Utile)
5. `db backup` - Backup simplifié
6. `server restart` - Redémarrage facile
7. `server resources` - Monitoring ressources
8. `logs errors` - Filtrer erreurs

### Priorité 3 (Nice to have)
9. `deploy` - Déploiement automatisé
10. `server cleanup` - Nettoyage Docker
11. `logs search` - Recherche dans logs
12. `security audit` - Audit via CLI

## 🔄 Intégration avec scripts existants

Les commandes CLI peuvent appeler les scripts bash existants :

```python
def run_backup_script():
    ssh_exec('./scripts/backup-db.sh', cwd=PROJECT_PATH)

def run_test_deployment():
    ssh_exec('./scripts/test-deployment.sh', cwd=PROJECT_PATH)

def run_security_audit():
    ssh_exec('./scripts/security-audit.sh', cwd=PROJECT_PATH)
```

## 💬 Discussion

Quelles commandes sont les plus prioritaires pour toi ?
- Monitoring quotidien (status, logs, health) ?
- Déploiement simplifié ?
- Gestion base de données (backups, migrations) ?
- Debugging (logs, errors) ?
