# 🚀 Améliorations Déploiement - Session 30/12/2025

## 📋 Résumé

Documentation des problèmes rencontrés lors du déploiement du 30/12/2025 et des améliorations à apporter pour simplifier les futurs déploiements.

## ❌ Problèmes Rencontrés

### 1. Cache Navigateur/Cloudflare - Frontend non mis à jour

**Problème :**
- Le frontend était déployé sur le serveur mais l'utilisateur voyait toujours l'ancienne version
- Le hash du fichier JS restait identique (`index-CotESx5a.js`) malgré les changements

**Causes :**
- Cache navigateur (hard refresh nécessaire)
- Cache Cloudflare (si configuré)
- Le build Docker utilisait peut-être un cache

**Solution appliquée :**
- Hard refresh navigateur (Cmd+Shift+R / Ctrl+Shift+R)
- Rebuild Docker avec `--no-cache`
- Vérification que les fichiers sont bien copiés dans le volume

**Améliorations à apporter :**
- ✅ Ajouter un paramètre de version dans l'URL des assets (query string)
- ✅ Configurer Cloudflare pour purger automatiquement le cache lors des déploiements
- ✅ Ajouter un script de purge cache Cloudflare dans `deploy-prod.sh`
- ✅ Documenter la procédure de hard refresh dans le README

---

### 2. Script de déploiement Admin Central arrête les mauvais containers

**Problème :**
- Le script `admin-central/scripts/deploy-admin.sh` a arrêté les containers de Reboul Store au lieu de ceux d'Admin Central
- Le script cherchait `docker-compose.prod.yml` dans le mauvais répertoire

**Causes :**
- Le script s'exécutait depuis le mauvais répertoire
- Pas de vérification du répertoire courant avant exécution

**Solution appliquée :**
- Redémarrage manuel des containers Reboul Store
- Exécution du script depuis le bon répertoire (`/opt/reboulstore/admin-central`)

**Améliorations à apporter :**
- ✅ Améliorer `deploy-admin.sh` pour détecter automatiquement le répertoire
- ✅ Ajouter une vérification : s'assurer qu'on est dans `admin-central/`
- ✅ Ajouter une protection : ne jamais arrêter les containers Reboul Store depuis Admin Central
- ✅ Créer un script unifié `deploy-all.sh` qui gère les deux projets

---

### 3. Base de données presque vide après déploiement

**Problème :**
- La base de données contenait seulement 1 produit, 1 brand, 3 categories
- Les backups du 29/12 étaient vides (0 INSERT INTO products, 0 INSERT INTO brands)

**Causes :**
- La base de données était déjà vide au moment des backups
- Pas de données de production réelles à ce stade du projet

**Solution appliquée :**
- Réimportation des brands depuis `brands-data-with-urls.json` (57 brands avec logos)

**Améliorations à apporter :**
- ✅ Créer un script de seed initial pour les données de base (categories, brands, etc.)
- ✅ Automatiser la création d'un backup AVANT chaque déploiement (déjà fait mais à vérifier)
- ✅ Vérifier que les backups contiennent bien des données avant de les considérer comme valides
- ✅ Ajouter une commande CLI pour réimporter facilement les brands : `./rcli db seed brands`

---

### 4. CLI ne détecte pas Admin Central

**Problème :**
- `./rcli server status --all` ne détectait pas les containers Admin Central
- Le CLI cherchait dans le mauvais chemin (`/var/www/reboulstore` au lieu de `/opt/reboulstore`)

**Causes :**
- Configuration incorrecte dans `cli/utils/server_helper.py`
- Chemin hardcodé au lieu d'utiliser les variables d'environnement

**Solution appliquée :**
- Correction du chemin dans `server_helper.py` : `/opt/reboulstore`

**Améliorations à apporter :**
- ✅ Utiliser uniquement des variables d'environnement pour les chemins
- ✅ Ajouter une commande de vérification : `./rcli server verify-config`
- ✅ Documenter les chemins attendus dans la configuration

---

### 5. Import brands compliqué

**Problème :**
- Le script TypeScript `import-brands.ts` ne pouvait pas s'exécuter dans le container
- Dépendances manquantes, chemins incorrects

**Causes :**
- Script conçu pour s'exécuter en local, pas dans Docker
- Dépendances TypeScript/TypeORM non disponibles dans le container de production

**Solution appliquée :**
- Création d'un script SQL direct depuis le JSON
- Import via `psql` directement

**Améliorations à apporter :**
- ✅ Créer un endpoint API `/admin/brands/import` pour importer depuis l'interface Admin
- ✅ Ajouter une commande CLI : `./rcli db seed brands`
- ✅ Créer un script SQL réutilisable : `backend/scripts/seed-brands.sql`
- ✅ Documenter le processus d'import dans `docs/PHASE_24_2_RESUME.md`

---

## ✅ Améliorations Prioritaires

### 1. Script de déploiement unifié

**Objectif :** Un seul script pour déployer Reboul Store + Admin Central

```bash
./scripts/deploy-all.sh [--reboul] [--admin] [--skip-check]
```

**Avantages :**
- Moins de confusion
- Déploiement atomique (tout ou rien)
- Gestion des dépendances entre projets

---

### 2. Vérification automatique post-déploiement

**Objectif :** Vérifier automatiquement que tout fonctionne après déploiement

```bash
# Vérifications automatiques :
- Health checks backend (Reboul + Admin)
- Frontend accessible (HTTP 200)
- Base de données accessible
- Containers en cours d'exécution
- Fichiers frontend présents dans les volumes
```

**Implémentation :**
- Ajouter dans `deploy-prod.sh` une section "Post-deployment checks"
- Utiliser `./rcli server status --all` pour vérifier les containers
- Tester les endpoints API

---

### 3. Purge automatique cache Cloudflare

**Objectif :** Purger automatiquement le cache Cloudflare lors des déploiements

**Implémentation :**
- Ajouter une option `--purge-cache` dans `deploy-prod.sh`
- Utiliser l'API Cloudflare pour purger le cache
- Documenter la configuration nécessaire (API token)

---

### 4. Backup automatique avant déploiement

**Objectif :** Créer un backup automatique AVANT chaque déploiement

**Implémentation :**
- ✅ Déjà implémenté dans `deploy-prod.sh` mais à améliorer
- Vérifier que le backup contient des données
- Afficher un résumé du backup (taille, nombre de tables, etc.)

---

### 5. Script de seed initial

**Objectif :** Pouvoir réinitialiser facilement les données de base

**Implémentation :**
- Créer `backend/scripts/seed-initial.ts` ou `.sql`
- Inclure : categories, brands, collections par défaut
- Commande CLI : `./rcli db seed initial`

---

### 6. Documentation déploiement simplifiée

**Objectif :** Guide clair et simple pour les déploiements

**Contenu :**
- Checklist pré-déploiement
- Commandes simples (copier-coller)
- Troubleshooting rapide
- Vérifications post-déploiement

---

## 📝 Checklist Déploiement Améliorée

### Avant déploiement

- [ ] Vérifier que le code compile localement
- [ ] Tester les builds Docker localement (optionnel)
- [ ] Vérifier les variables d'environnement
- [ ] S'assurer qu'un backup récent existe

### Pendant déploiement

- [ ] Backup automatique créé
- [ ] Build des images Docker
- [ ] Upload des fichiers sur le serveur
- [ ] Arrêt des anciens containers
- [ ] Démarrage des nouveaux containers
- [ ] Vérification des health checks

### Après déploiement

- [ ] Vérifier que tous les containers sont "Up"
- [ ] Tester les endpoints API (health checks)
- [ ] Vérifier que les frontends sont accessibles
- [ ] Purger le cache Cloudflare (si configuré)
- [ ] Tester en navigation privée pour vérifier le cache
- [ ] Vérifier les logs pour détecter les erreurs

---

## 🔧 Commandes Utiles

### Vérification rapide

```bash
# Statut de tous les containers
./rcli server status --all

# Logs des erreurs
./rcli server logs --errors

# Vérifier la base de données
./rcli db analyze schema
```

### Déploiement

```bash
# Déploiement Reboul Store
export DEPLOY_HOST=deploy@152.228.218.35
export DEPLOY_PATH=/opt/reboulstore
./scripts/deploy-prod.sh

# Déploiement Admin Central
cd admin-central
docker compose -f docker-compose.prod.yml up -d --build
```

### Import données

```bash
# Import brands
./rcli db seed brands  # (à créer)

# Ou manuellement
ssh deploy@152.228.218.35 "cd /opt/reboulstore/backend/scripts && python3 ... | docker exec -i reboulstore-postgres-prod psql ..."
```

---

## 🎯 Prochaines Étapes

1. ✅ **Créer `deploy-all.sh`** : Script unifié pour les deux projets
2. ✅ **Améliorer `deploy-admin.sh`** : Protection contre les erreurs de répertoire
3. ✅ **Ajouter purge cache Cloudflare** : Automatisation complète ✅ **CONFIGURÉ**
4. ✅ **Créer commande seed brands** : `./rcli db seed brands`
5. ✅ **Améliorer vérifications post-déploiement** : Ajoutées dans `deploy-prod.sh`
6. ✅ **Améliorer backup automatique** : Vérification contenu et affichage résumé
7. ✅ **Créer script SQL seed-brands.sql** : Template pour référence

## ✅ Statut Final - Configuration Complète

**Date de complétion :** 30/12/2025

Toutes les améliorations ont été implémentées et testées :

- ✅ Script de déploiement unifié (`deploy-all.sh`)
- ✅ Protections dans `deploy-admin.sh`
- ✅ Vérifications post-déploiement automatiques
- ✅ Commande CLI seed brands
- ✅ Backup automatique amélioré
- ✅ **Purge cache Cloudflare configurée et testée** ⭐
- ✅ Documentation complète

**Le processus de déploiement est maintenant robuste, automatisé et prêt pour la production.**

## ✅ Améliorations Implémentées (30/12/2025)

### 1. Script `deploy-all.sh` créé
- Script unifié pour déployer Reboul Store + Admin Central
- Options `--reboul` et `--admin` pour déployer sélectivement
- Gestion des erreurs et vérifications automatiques

### 2. `deploy-admin.sh` amélioré
- Détection automatique du répertoire (depuis admin-central/ ou racine)
- Protection contre l'arrêt des containers Reboul Store
- Vérification que docker-compose.prod.yml est bien celui d'Admin Central

### 3. Vérifications post-déploiement dans `deploy-prod.sh`
- Vérification des containers (statut "Up")
- Health checks backend et frontend (Reboul + Admin)
- Vérification des fichiers frontend dans les volumes
- Vérification de la base de données (nombre de tables)

### 4. Commande CLI `./rcli db seed brands`
- Import automatique depuis `brands-data-with-urls.json`
- Support local et production (`--local` flag)
- Affichage du nombre de brands importées et avec logos

### 5. Backup automatique amélioré
- Vérification que le backup contient des données (compte INSERT)
- Affichage de la taille et du nombre d'INSERT statements
- Avertissement si le backup semble vide

### 6. Script SQL `seed-brands.sql`
- Template pour référence
- Documentation du processus d'import

### 7. Purge automatique cache Cloudflare ✅
- Script `cloudflare-purge.sh` pour purger le cache
- Intégration automatique dans `deploy-prod.sh` et `deploy-all.sh`
- Support API Token (recommandé) et API Key + Email
- Purge complète ou sélective (fichiers spécifiques)
- Documentation complète dans `docs/CLOUDFLARE_PURGE_SETUP.md`

### 8. Protection fichiers .env.production ✅ **NOUVEAU**
- Script `protect-env-files.sh` pour sauvegarder/restaurer les fichiers `.env.production`
- **Sauvegarde automatique** avant chaque déploiement (dans `/opt/reboulstore/.env-backups/`)
- **Vérification obligatoire** que les fichiers existent avant déploiement
- **Création automatique** d'Admin Central `.env.production` si manquant
- **Blocage du déploiement** si fichiers manquants (avec messages d'erreur clairs)
- **Restauration depuis backup** en cas de problème
- Protection dans `deploy-prod.sh` et `deploy-admin.sh`
- **Plus jamais de problème de fichiers .env.production manquants !** ⭐

---

## 📚 Références

- `docs/DEPLOYMENT_PROCEDURE.md` : Procédure détaillée actuelle
- `scripts/deploy-prod.sh` : Script de déploiement Reboul Store
- `admin-central/scripts/deploy-admin.sh` : Script de déploiement Admin Central
- `cli/commands/server.py` : Commandes CLI serveur
- `cli/commands/db.py` : Commandes CLI base de données

---

## 📝 Notes Finales

**Date de complétion :** 30/12/2025  
**Session :** Déploiement Phase 24.2 (Brands + BrandCarousel + BrandMarquee) + Améliorations Déploiement

### ✅ Configuration Cloudflare Purge (30/12/2025)

- Zone ID : `8fe56f1ae57269bd016ea6a302532ffe`
- API Token : Configuré et testé
- Configuration sauvegardée dans `.env.local`
- Purge automatique fonctionnelle lors des déploiements
- Script de purge manuelle disponible : `./scripts/cloudflare-purge.sh`

### 🎯 État Final

**Le processus de déploiement est maintenant complet et optimisé :**

- ✅ Déploiement unifié (Reboul Store + Admin Central)
- ✅ Vérifications automatiques post-déploiement
- ✅ Backup automatique avec validation
- ✅ Purge cache Cloudflare automatique
- ✅ Commandes CLI pour seed et gestion
- ✅ Documentation complète

**Prêt pour la production ! 🚀**

