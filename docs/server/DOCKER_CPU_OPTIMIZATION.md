# 🚀 Optimisation Charge CPU Docker - Reboul Store

## 📊 Diagnostic Actuel

### Problème identifié

**dockerd utilise 106.2% CPU de manière constante** (375% dans ps aux), ce qui est anormalement élevé.

### Causes probables

1. **Build cache Docker volumineux** (88.69GB, maintenant nettoyé → 3.5GB)
2. **Processus docker compose logs** qui tournent en continu (13 processus détectés)
3. **Logs Docker qui s'accumulent** (json-file driver)
4. **Overhead Docker/overlayfs** (normal mais peut être optimisé)

### Métriques actuelles

- **Load average** : 6.67 (élevé, devrait être < 2 pour ce serveur)
- **dockerd CPU usage** : 106.2% (anormalement élevé)
- **Build cache Docker** : 3.5GB (après nettoyage, était 88.69GB)
- **Containers CPU usage** : 0-1.86% (normal, pas de problème ici)

---

## 🛠️ Solutions Mises en Place

### 1. Nettoyage Build Cache Docker (Hebdomadaire) ⭐⭐⭐

**Cronjob recommandé :**
```bash
# Nettoyer le build cache Docker chaque dimanche à 2h du matin
0 2 * * 0 docker builder prune -f
```

**Configuration via CLI :**
```bash
./rcli server cron --add "0 2 * * 0 docker builder prune -f" --description "Nettoyage build cache Docker (hebdomadaire)"
```

**Bénéfice :**
- Libère de l'espace disque (peut aller jusqu'à 80-90GB)
- Réduit la charge CPU de dockerd (moins de cache à gérer)
- Améliore les performances Docker

**Fréquence :** Hebdomadaire (dimanche à 2h, avant le backup DB à 2h)

---

### 2. Nettoyage Logs Docker (Hebdomadaire) ⭐⭐⭐

**Cronjob recommandé :**
```bash
# Nettoyer les logs Docker (truncate, pas delete pour éviter les problèmes)
0 4 * * 0 cd /opt/reboulstore && docker compose -f docker-compose.prod.yml --env-file .env.production logs --tail 0 > /dev/null 2>&1 && find /var/lib/docker/containers -name "*-json.log" -exec truncate -s 0 {} \;
```

**Ou via CLI cleanup :**
```bash
./rcli server cleanup --logs --yes
```

**Configuration via CLI (plus simple) :**
```bash
./rcli server cron --add "0 4 * * 0 cd /opt/reboulstore && /opt/reboulstore/cli/venv/bin/python3 /opt/reboulstore/cli/main.py server cleanup --logs --yes" --description "Nettoyage logs Docker (hebdomadaire)"
```

**Bénéfice :**
- Réduit l'utilisation disque (logs Docker peuvent prendre beaucoup de place)
- Réduit la charge CPU de dockerd (moins de logs à gérer)
- Améliore les performances Docker

**Fréquence :** Hebdomadaire (dimanche à 4h)

---

### 3. Détection et Arrêt des Processus Docker Compose Logs ⭐⭐

**Problème :** Les processus `docker compose logs --follow` peuvent tourner indéfiniment et consommer des ressources.

**Solution :** Script pour détecter et arrêter les processus qui tournent trop longtemps.

**Script à créer :** `scripts/cleanup-docker-logs-processes.sh`

```bash
#!/bin/bash
# Script pour arrêter les processus docker compose logs qui tournent trop longtemps (> 1 heure)

# Trouver les processus docker compose logs qui tournent depuis plus de 1 heure
ps aux | grep 'docker compose.*logs' | grep -v grep | awk -v now=$(date +%s) '{
    # Extraire le PID et le temps de démarrage
    pid = $2
    # Le temps de démarrage est dans $9 (format HH:MM ou MMDD si très ancien)
    # Pour simplifier, on tue les processus qui ont accumulé plus de 1h de CPU time
    cpu_time = $10  # Temps CPU accumulé (format HH:MM)
    if (cpu_time ~ /:/) {
        split(cpu_time, time_parts, ":")
        cpu_minutes = time_parts[1] * 60 + time_parts[2]
        if (cpu_minutes > 60) {
            print pid
        }
    } else if (cpu_time ~ /^[0-9]+$/) {
        # Format numérique (minutes)
        if (cpu_time > 60) {
            print pid
        }
    }
}' | xargs -r kill 2>/dev/null

echo "Processus docker compose logs anciens arrêtés"
```

**Cronjob recommandé :**
```bash
# Vérifier et arrêter les processus docker compose logs tous les jours à 6h
0 6 * * * /opt/reboulstore/scripts/cleanup-docker-logs-processes.sh
```

**Configuration via CLI :**
```bash
./rcli server cron --add "0 6 * * * /opt/reboulstore/scripts/cleanup-docker-logs-processes.sh" --description "Arrêt processus docker compose logs anciens (quotidien)"
```

**Bénéfice :**
- Évite l'accumulation de processus docker compose logs
- Réduit la charge CPU
- Libère des ressources système

**Fréquence :** Quotidien (6h du matin)

---

## 📋 Configuration Recommandée

### Ordre d'exécution (Dimanche matin)

1. **2h** : Nettoyage build cache Docker
2. **2h** : Backup DB (déjà en place)
3. **3h** : Optimisation DB (VACUUM ANALYZE, recommandé dans CRON_JOBS_RECOMMENDATIONS.md)
4. **4h** : Nettoyage logs Docker
5. **6h** : Arrêt processus docker compose logs (quotidien)

### Commandes CLI pour Configurer

```bash
# 1. Nettoyage build cache Docker (hebdomadaire, dimanche 2h)
./rcli server cron --add "0 2 * * 0 docker builder prune -f" --description "Nettoyage build cache Docker (hebdomadaire)"

# 2. Nettoyage logs Docker (hebdomadaire, dimanche 4h)
./rcli server cron --add "0 4 * * 0 cd /opt/reboulstore && docker compose -f docker-compose.prod.yml --env-file .env.production exec -T backend sh -c 'echo > /dev/null' 2>/dev/null; find /var/lib/docker/containers -name '*-json.log' -exec truncate -s 0 {} \; 2>/dev/null" --description "Nettoyage logs Docker (hebdomadaire)"

# 3. Arrêt processus docker compose logs (quotidien, 6h)
./rcli server cron --add "0 6 * * * pkill -f 'docker compose.*logs.*--follow' || true" --description "Arrêt processus docker compose logs anciens (quotidien)"
```

---

## 🎯 Objectifs

### Réduction Charge CPU

- **Avant** : Load average 6-9, dockerd 106% CPU
- **Objectif** : Load average < 2, dockerd < 50% CPU
- **Actions** : Nettoyage régulier build cache + logs + arrêt processus logs

### Espace Disque

- **Build cache** : Nettoyage hebdomadaire (peut libérer 80-90GB)
- **Logs Docker** : Nettoyage hebdomadaire (peut libérer plusieurs GB)

---

## 🔍 Monitoring

### Vérifier la Charge CPU

```bash
./rcli server exec "uptime"
./rcli server exec "ps aux --sort=-%cpu | head -5"
./rcli server exec "docker stats --no-stream"
```

### Vérifier l'Espace Disque

```bash
./rcli server exec "docker system df"
./rcli server exec "df -h /"
```

### Vérifier les Processus Docker Compose Logs

```bash
./rcli server exec "ps aux | grep 'docker compose.*logs' | grep -v grep | wc -l"
```

---

## ⚠️ Notes Importantes

1. **Nettoyage Build Cache** : 
   - Supprime les layers de build non utilisés
   - Les prochains builds seront un peu plus longs (re-build des layers)
   - Mais réduit considérablement l'espace disque et la charge CPU

2. **Nettoyage Logs** :
   - Utiliser `truncate` plutôt que `delete` pour éviter les problèmes
   - Les logs sont gérés par Docker (json-file driver)
   - Ne pas supprimer les fichiers, juste les vider

3. **Arrêt Processus Logs** :
   - N'affecte pas les containers eux-mêmes
   - Arrête juste les processus `docker compose logs --follow` qui tournent
   - Les logs continuent d'être générés normalement

4. **Timing** :
   - Exécuter les nettoyages la nuit (2h-6h) pour éviter l'impact sur les utilisateurs
   - Espacer les cronjobs pour éviter la surcharge simultanée

---

## 📚 Références

- **CRON_JOBS_RECOMMENDATIONS.md** : `cli/CRON_JOBS_RECOMMENDATIONS.md` - Recommandations cronjobs
- **CLI_SERVER_COMMANDS.md** : `cli/CLI_SERVER_COMMANDS.md` - Commandes CLI serveur
- **Documentation Docker** : https://docs.docker.com/config/containers/logging/

