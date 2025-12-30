# 💾 Explication des commandes de backup - Reboul Store

## 🎯 Vue d'ensemble

Les commandes de backup permettent de **sauvegarder et restaurer ta base de données PostgreSQL** facilement, que ce soit en local (développement) ou sur le serveur de production.

---

## 📋 Commandes disponibles

### 1. `./rcli db backup` - Créer un backup

**Ce que ça fait concrètement :**

1. **Se connecte au container PostgreSQL** (ex: `reboulstore-postgres`)
2. **Utilise `pg_dump`** (outil PostgreSQL) pour exporter toute la base de données
3. **Crée un fichier SQL** avec toutes les données (tables, données, structure)
4. **Compresse le fichier** avec gzip (`.sql.gz`) pour réduire la taille
5. **Sauvegarde dans le dossier `./backups/`** avec un nom unique (ex: `reboulstore_db_20250129_143022.sql.gz`)
6. **Nettoie les anciens backups** (garde seulement les 30 plus récents par défaut)

**Exemple de résultat :**
```
./backups/
  ├── reboulstore_db_20250129_143022.sql.gz  (5.2 MB)
  ├── reboulstore_db_20250129_120000.sql.gz  (5.1 MB)
  └── reboulstore_db_20250128_020000.sql.gz  (5.0 MB)
```

**Quand l'utiliser :**
- ✅ Avant de faire une grosse migration de base de données
- ✅ Avant de tester quelque chose de risqué
- ✅ Pour faire une sauvegarde quotidienne/hebdomadaire
- ✅ Avant un déploiement en production

**Exemples :**
```bash
# Backup local (ton Mac, pour développement)
./rcli db backup --local

# Backup sur le serveur de production (VPS)
./rcli db backup --server
```

---

### 2. `./rcli db backup-list` - Lister les backups

**Ce que ça fait concrètement :**

1. **Scanne le dossier `./backups/`** (ou celui que tu spécifies)
2. **Liste tous les fichiers de backup** trouvés (`.sql.gz`)
3. **Affiche les informations** : date de création, nom du fichier, taille
4. **Tri par date** (les plus récents en premier)

**Exemple d'affichage :**
```
📋 Liste des backups disponibles...

┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┓
┃ Date                  ┃ Fichier                                ┃ Taille ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━┩
│ 2025-01-29 14:30:22   │ reboulstore_db_20250129_143022.sql.gz │ 5.23 MB│
│ 2025-01-29 12:00:00   │ reboulstore_db_20250129_120000.sql.gz │ 5.15 MB│
│ 2025-01-28 02:00:00   │ reboulstore_db_20250128_020000.sql.gz │ 5.10 MB│
└───────────────────────┴────────────────────────────────────────┴────────┘
```

**Quand l'utiliser :**
- ✅ Pour voir quels backups tu as disponibles
- ✅ Pour vérifier la date du dernier backup
- ✅ Pour choisir quel backup restaurer

**Exemple :**
```bash
./rcli db backup-list
```

---

### 3. `./rcli db backup-restore` - Restaurer un backup

**Ce que ça fait concrètement :**

⚠️ **ATTENTION : Cette commande ÉCRASE complètement ta base de données actuelle !**

1. **Demande confirmation** (sauf si tu utilises `--yes`)
2. **Décompresse le fichier** `.sql.gz` si nécessaire
3. **Se connecte au container PostgreSQL**
4. **Supprime toutes les données actuelles** de la base de données
5. **Importe toutes les données** du fichier de backup (avec `psql`)
6. **Restaure exactement l'état** de la base de données au moment du backup

**Exemple d'utilisation :**
```bash
# Restaurer un backup local (développement)
./rcli db backup-restore backups/reboulstore_db_20250129_143022.sql.gz --local

# Restaurer sur le serveur de production (⚠️ DANGEREUX !)
./rcli db backup-restore /var/www/reboulstore/backups/reboulstore_db_20250129_143022.sql.gz
```

**Quand l'utiliser :**
- ✅ Tu as cassé quelque chose et tu veux revenir en arrière
- ✅ Tu veux tester avec des données réelles de production (localement)
- ✅ Tu as fait une erreur et tu dois restaurer l'état précédent
- ⚠️ **Jamais en production sans avoir vérifié le backup d'abord !**

**Processus de sécurité :**
```
⚠️  ATTENTION: Cette opération va écraser la base de données actuelle !
Container: reboulstore-postgres
Base de données: reboulstore_db
Fichier: backups/reboulstore_db_20250129_143022.sql.gz

Êtes-vous sûr de vouloir continuer ? [y/N]:
```

---

### 4. `./rcli db backup-delete` - Supprimer un backup

**Ce que ça fait concrètement :**

1. **Demande confirmation** (sauf si tu utilises `--yes`)
2. **Supprime le fichier de backup** spécifié

**Quand l'utiliser :**
- ✅ Pour libérer de l'espace disque
- ✅ Pour supprimer des vieux backups dont tu n'as plus besoin
- ✅ Pour nettoyer manuellement (même si le système garde automatiquement les 30 derniers)

**Exemple :**
```bash
./rcli db backup-delete backups/reboulstore_db_20250128_020000.sql.gz
```

---

## 🔄 Scénarios d'utilisation pratiques

### Scénario 1 : Avant une migration risquée

```bash
# 1. Créer un backup de sécurité
./rcli db backup --local

# 2. Faire ta migration/expérimentation
# ... ton code ici ...

# 3. Si ça plante, restaurer le backup
./rcli db backup-restore backups/reboulstore_db_20250129_143022.sql.gz --local
```

### Scénario 2 : Backup automatique quotidien

```bash
# Créer un backup tous les jours à 2h du matin (via cron)
# Le système garde automatiquement les 30 derniers backups

./rcli db backup --server
```

### Scénario 3 : Tester avec des données de production (localement)

```bash
# 1. Faire un backup de production
./rcli db backup --server

# 2. Télécharger le backup depuis le serveur
# (via scp ou autre méthode)

# 3. Restaurer localement pour tester
./rcli db backup-restore backups/reboulstore_db_prod_20250129.sql.gz --local
```

### Scénario 4 : Rollback après une erreur

```bash
# 1. Voir quels backups tu as
./rcli db backup-list

# 2. Choisir le backup d'avant l'erreur
./rcli db backup-restore backups/reboulstore_db_20250129_120000.sql.gz --local
```

---

## ⚙️ Options avancées

### `--keep N` : Garder plus ou moins de backups

Par défaut, le système garde les **30 derniers backups**. Tu peux changer ça :

```bash
# Garder 50 backups au lieu de 30
./rcli db backup --local --keep 50

# Garder seulement 10 backups (pour économiser l'espace)
./rcli db backup --local --keep 10
```

### `--container` : Container PostgreSQL personnalisé

Si tu as plusieurs containers PostgreSQL :

```bash
./rcli db backup --local --container reboulstore-postgres-dev
```

### `--backup-dir` : Répertoire personnalisé

Pour sauvegarder ailleurs que `./backups/` :

```bash
./rcli db backup --local --backup-dir /path/to/my/backups
```

---

## 📊 Taille des backups

La taille d'un backup dépend de la quantité de données dans ta base :

- **Base vide** : ~100 KB (juste la structure)
- **Base avec quelques produits** : ~1-5 MB
- **Base de production complète** : ~10-100 MB (ou plus selon les données)

Les backups sont **compressés avec gzip**, donc ils prennent moins de place que la base réelle.

---

## 🛡️ Sécurité et bonnes pratiques

### ✅ À FAIRE

- **Faire des backups régulièrement** (quotidiens en production)
- **Tester la restauration** de temps en temps pour vérifier que ça fonctionne
- **Vérifier les backups** avant de faire quelque chose de risqué
- **Garder plusieurs backups** (le système fait ça automatiquement)

### ❌ À ÉVITER

- **Ne pas restaurer en production** sans avoir vérifié le backup d'abord
- **Ne pas supprimer tous les backups** (le système garde automatiquement les 30 derniers)
- **Ne pas faire de backup juste avant une restauration** (ça va écraser le backup précédent si mal fait)

---

## 💡 Résumé en une phrase

Les commandes de backup permettent de **sauvegarder un snapshot complet de ta base de données** à un instant T, et de **revenir à cet état** si tu as besoin de restaurer après une erreur ou un test.

