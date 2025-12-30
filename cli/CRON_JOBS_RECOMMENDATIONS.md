# ⏰ Cron Jobs Recommandés pour Reboul Store

## ✅ Déjà en place

1. **Backup automatique DB** - Quotidien à 2h
   ```bash
   0 2 * * * cd /var/www/reboulstore && ./scripts/backup-db.sh
   ```

2. **Renouvellement certificats SSL** - Quotidien à 3h
   ```bash
   0 3 * * * certbot renew --quiet --deploy-hook /etc/letsencrypt/renewal-hooks/deploy/copy-certs.sh
   ```

---

## 🔧 Cron Jobs Utiles à Ajouter

### 1. 🗑️ Nettoyage des logs anciens ⭐⭐⭐

**Pourquoi :** Les logs peuvent prendre beaucoup de place au fil du temps

**Commande :**
```bash
# Supprimer les logs de plus de 30 jours
0 4 * * 0 find /var/log/nginx -name "*.log" -mtime +30 -delete
0 4 * * 0 find /var/www/reboulstore/backups -name "*.log" -mtime +30 -delete
```

**Configuration via CLI :**
```bash
./rcli server cron --add "0 4 * * 0 find /var/log/nginx -name \"*.log\" -mtime +30 -delete" --description "Nettoyage logs nginx (hebdomadaire)"
```

**Fréquence :** Tous les dimanches à 4h

---

### 2. 💾 Nettoyage des anciens backups ⭐⭐⭐

**Pourquoi :** Éviter de remplir le disque avec trop de backups

**Commande :**
```bash
# Garder seulement les 30 derniers backups
0 3 * * 0 find /var/www/reboulstore/backups -name "reboulstore_db_*.sql.gz" -type f | sort -r | tail -n +31 | xargs -r rm -f
```

**Configuration via CLI :**
```bash
./rcli server cron --add "0 3 * * 0 find /var/www/reboulstore/backups -name \"reboulstore_db_*.sql.gz\" -type f | sort -r | tail -n +31 | xargs -r rm -f" --description "Nettoyage anciens backups DB (garder 30 derniers)"
```

**Fréquence :** Tous les dimanches à 3h

**Note :** Le script `backup-db.sh` fait déjà ça, mais c'est une sécurité supplémentaire.

---

### 3. 🗄️ Optimisation base de données PostgreSQL ⭐⭐

**Pourquoi :** VACUUM et ANALYZE améliorent les performances et libèrent de l'espace

**Commande :**
```bash
# VACUUM ANALYZE (optimisation légère)
0 3 * * 0 docker exec reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db -c "VACUUM ANALYZE;"
```

**Configuration via CLI :**
```bash
./rcli server cron --add "0 3 * * 0 docker exec reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db -c \"VACUUM ANALYZE;\"" --description "Optimisation base de données (hebdomadaire)"
```

**Fréquence :** Tous les dimanches à 3h (après le backup)

---

### 4. 🛒 Nettoyage des paniers abandonnés ⭐⭐

**Pourquoi :** Nettoyer les paniers non finalisés après X jours (ex: 30 jours)

**Commande :** Nécessite un script backend ou une commande NestJS
```bash
# Si tu as une commande NestJS pour ça
0 5 * * * cd /var/www/reboulstore && docker exec reboulstore-backend-prod npm run cleanup:abandoned-carts
```

**Alternative :** Via API endpoint ou script SQL direct
```bash
0 5 * * * docker exec reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db -c "DELETE FROM cart WHERE \"createdAt\" < NOW() - INTERVAL '30 days' AND id NOT IN (SELECT \"cartId\" FROM \"order\" WHERE \"cartId\" IS NOT NULL);"
```

**Configuration via CLI :**
```bash
./rcli server cron --add "0 5 * * * docker exec reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db -c \"DELETE FROM cart WHERE \\\"createdAt\\\" < NOW() - INTERVAL '30 days' AND id NOT IN (SELECT \\\"cartId\\\" FROM \\\"order\\\" WHERE \\\"cartId\\\" IS NOT NULL);\"" --description "Nettoyage paniers abandonnés (>30 jours)"
```

**Fréquence :** Quotidien à 5h

---

### 5. 📧 Envoi de rappels emails (paniers abandonnés) ⭐

**Pourquoi :** Relancer les clients qui ont laissé un panier

**Commande :** Nécessite un script backend
```bash
0 10 * * * cd /var/www/reboulstore && docker exec reboulstore-backend-prod npm run email:abandoned-cart-reminder
```

**Fréquence :** Quotidien à 10h

**Note :** À implémenter dans le backend d'abord.

---

### 6. 🔍 Monitoring de santé des services ⭐⭐

**Pourquoi :** Détecter les problèmes avant qu'ils n'affectent les utilisateurs

**Commande :**
```bash
# Vérifier que les containers Docker fonctionnent
*/15 * * * * cd /var/www/reboulstore && docker ps | grep -q reboulstore-postgres-prod || echo "ALERT: PostgreSQL container down" | mail -s "Service Alert" admin@reboulstore.com
```

**Configuration via CLI :**
```bash
./rcli server cron --add "*/15 * * * * cd /var/www/reboulstore && docker ps | grep -q reboulstore-postgres-prod || echo \"ALERT: PostgreSQL container down\" | mail -s \"Service Alert\" admin@reboulstore.com" --description "Monitoring containers Docker (toutes les 15 min)"
```

**Fréquence :** Toutes les 15 minutes

**Note :** Nécessite `mail` ou un service d'alerte configuré.

---

### 7. 📊 Génération de rapports quotidiens ⭐

**Pourquoi :** Rapport des ventes, statistiques, etc.

**Commande :** Nécessite un script backend
```bash
0 8 * * 1 cd /var/www/reboulstore && docker exec reboulstore-backend-prod npm run report:daily
```

**Fréquence :** Quotidien à 8h

**Note :** À implémenter dans le backend.

---

### 8. 🗄️ Nettoyage des fichiers temporaires/uploads ⭐

**Pourquoi :** Nettoyer les fichiers temporaires qui s'accumulent

**Commande :**
```bash
# Supprimer les fichiers temporaires de plus de 7 jours
0 6 * * 0 find /var/www/reboulstore/backend/uploads/tmp -type f -mtime +7 -delete
```

**Configuration via CLI :**
```bash
./rcli server cron --add "0 6 * * 0 find /var/www/reboulstore/backend/uploads/tmp -type f -mtime +7 -delete" --description "Nettoyage fichiers temporaires (hebdomadaire)"
```

**Fréquence :** Tous les dimanches à 6h

---

## 🎯 Priorités Recommandées

### Priorité 1 (À faire maintenant) ⭐⭐⭐

1. **Nettoyage des logs anciens** - Évite de remplir le disque
2. **Nettoyage des anciens backups** - Sécurité supplémentaire (backup-db.sh fait déjà ça)

### Priorité 2 (Utile) ⭐⭐

3. **Optimisation base de données** - Améliore les performances
4. **Nettoyage des paniers abandonnés** - Garde la DB propre

### Priorité 3 (Nice to have) ⭐

5. **Monitoring de santé** - Détection précoce des problèmes
6. **Envoi de rappels emails** - Marketing (nécessite backend)
7. **Génération de rapports** - Analytics (nécessite backend)
8. **Nettoyage fichiers temporaires** - Maintenance (si tu as des uploads/tmp)

---

## 📋 Configuration Rapide

### Pour configurer les priorités 1 & 2 :

```bash
# 1. Nettoyage logs
./rcli server cron --add "0 4 * * 0 find /var/log/nginx -name \"*.log\" -mtime +30 -delete" --description "Nettoyage logs nginx (hebdomadaire)"

# 2. Nettoyage anciens backups (sécurité supplémentaire)
./rcli server cron --add "0 3 * * 0 find /var/www/reboulstore/backups -name \"reboulstore_db_*.sql.gz\" -type f | sort -r | tail -n +31 | xargs -r rm -f" --description "Nettoyage anciens backups (garder 30)"

# 3. Optimisation DB
./rcli server cron --add "0 3 * * 0 docker exec reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db -c \"VACUUM ANALYZE;\"" --description "Optimisation DB PostgreSQL (hebdomadaire)"

# 4. Nettoyage paniers abandonnés
./rcli server cron --add "0 5 * * * docker exec reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db -c \"DELETE FROM cart WHERE \\\"createdAt\\\" < NOW() - INTERVAL '30 days' AND id NOT IN (SELECT \\\"cartId\\\" FROM \\\"order\\\" WHERE \\\"cartId\\\" IS NOT NULL);\"" --description "Nettoyage paniers abandonnés (>30 jours)"
```

---

## 💡 Notes Importantes

1. **Timing :** Les cron jobs sont répartis sur la journée pour éviter la surcharge
   - 2h : Backup DB
   - 3h : Renouvellement SSL + Optimisation DB + Nettoyage backups
   - 4h : Nettoyage logs
   - 5h : Nettoyage paniers
   - 6h : Nettoyage fichiers tmp

2. **Sécurité :** 
   - Les commandes DELETE sont testées d'abord
   - Toujours avoir des backups avant de nettoyer
   - Utiliser `-mtime +X` (plus de X jours) pour la sécurité

3. **Tests :** 
   - Tester chaque commande manuellement avant de l'ajouter en cron
   - Vérifier les logs après la première exécution

4. **Monitoring :** 
   - Vérifier régulièrement que les cron jobs s'exécutent
   - Surveiller les logs pour détecter les erreurs

