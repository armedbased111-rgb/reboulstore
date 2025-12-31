# 📦 Procédure de Déploiement - Reboul Store

## Vue d'ensemble

Cette procédure garantit un déploiement propre et fiable en :
1. **Testant les builds localement** avant déploiement
2. **Supprimant les volumes** sur le serveur pour éviter les conflits
3. **Vérifiant** que les fichiers sont correctement copiés

## 🔄 Procédure Complète

### Phase 1 : Build Local (Vérification)

**Objectif** : Vérifier que le code compile et que les Dockerfiles fonctionnent

```bash
# 1. Build TypeScript/React (vérification compilation)
cd frontend && npm run build && cd ..
cd backend && npm run build && cd ..

# 2. Test des builds Docker (optionnel mais recommandé)
docker build -t reboulstore-frontend-test -f ./frontend/Dockerfile.prod ./frontend
docker build -t reboulstore-backend-test -f ./backend/Dockerfile.prod ./backend

# Nettoyage des images de test
docker rmi reboulstore-frontend-test reboulstore-backend-test
```

**✅ Si tout passe** : On peut déployer

### Phase 2 : Déploiement sur Serveur

**Script utilisé** : `./scripts/deploy-prod.sh`

#### Étapes Automatiques :

1. **Upload des fichiers** (rsync)
   - Exclut `node_modules/`, `.git/`, `dist/`, etc.
   - Synchronise uniquement le code source

2. **Sur le serveur** :

   **a) Arrêt des services**
   ```bash
   docker compose -f docker-compose.prod.yml --env-file .env.production down
   ```

   **b) Suppression des anciennes images**
   ```bash
   docker rmi -f reboulstore-frontend:latest reboulstore-backend:latest
   ```

   **c) ⚠️ SUPPRESSION DES VOLUMES (CRITIQUE)**
   ```bash
   # Arrêt avec suppression des volumes
   docker compose -f docker-compose.prod.yml --env-file .env.production down -v
   
   # Suppression explicite des volumes de build
   docker volume rm reboulstore_frontend_build admin_central_frontend_build
   ```
   
   **Pourquoi ?**
   - Les volumes contiennent les anciens fichiers
   - Si on ne les supprime pas, ils écrase les nouveaux fichiers de l'image
   - Le volume sera recréé **vide** au démarrage
   - Le script d'init du Dockerfile copiera les fichiers depuis l'image vers le volume

   **d) Build des nouvelles images**
   ```bash
   docker compose -f docker-compose.prod.yml --env-file .env.production build --no-cache frontend backend
   ```

   **e) Démarrage des services**
   ```bash
   docker compose -f docker-compose.prod.yml --env-file .env.production up -d
   ```
   
   **Ce qui se passe** :
   - Le volume `frontend_build` est créé **vide**
   - Le container `frontend` démarre
   - Le script d'init (`/docker-entrypoint-init.sh`) s'exécute :
     - Copie les fichiers depuis `/app/build` (dans l'image) vers `/usr/share/nginx/html` (dans le volume)
   - Le container `nginx` monte le volume et sert les nouveaux fichiers

   **f) Vérification**
   ```bash
   # Vérifier que les fichiers sont présents
   docker exec reboulstore-frontend-prod ls -la /usr/share/nginx/html/index.html
   ```

## 🔍 Problèmes Courants

### Problème : L'ancienne version s'affiche encore

**Causes possibles** :
1. **Cache Cloudflare** : Purger le cache dans Cloudflare Dashboard
2. **Cache navigateur** : Hard refresh (`Ctrl+Shift+R` ou `Cmd+Shift+R`)
3. **Volume non supprimé** : Vérifier que le volume a bien été supprimé avant le build

**Solution** :
```bash
# Sur le serveur, vérifier et supprimer manuellement
docker volume ls | grep frontend_build
docker volume rm reboulstore_frontend_build
docker compose -f docker-compose.prod.yml --env-file .env.production up -d frontend
```

### Problème : Les fichiers ne sont pas copiés dans le volume

**Vérification** :
```bash
# Vérifier les logs du container frontend
docker logs reboulstore-frontend-prod | grep -E "(Copie|Fichiers|✅|📦)"

# Vérifier que les fichiers sont dans l'image
docker exec reboulstore-frontend-prod ls -la /app/build/

# Vérifier que les fichiers sont dans le volume
docker exec reboulstore-frontend-prod ls -la /usr/share/nginx/html/
```

**Solution** :
- Vérifier que le script d'init s'exécute (voir `frontend/Dockerfile.prod`)
- Redémarrer le container frontend : `docker restart reboulstore-frontend-prod`

## 📋 Checklist de Déploiement

- [ ] Build local frontend réussi (`npm run build`)
- [ ] Build local backend réussi (`npm run build`)
- [ ] Test Docker local (optionnel)
- [ ] Commit et push vers `main`
- [ ] Exécution `./scripts/deploy-prod.sh`
- [ ] Vérification que les volumes sont supprimés
- [ ] Vérification que les builds Docker réussissent
- [ ] Vérification que les fichiers sont copiés dans le volume
- [ ] Test du site en production
- [ ] Purge cache Cloudflare si nécessaire

## 🎯 Résumé de la Procédure

```
LOCAL                          SERVEUR
─────────────────────────────────────────────────
1. npm run build          →    2. Upload (rsync)
                              3. docker compose down
                              4. Supprimer volumes ⚠️
                              5. Supprimer images
                              6. Build images (--no-cache)
                              7. docker compose up -d
                              8. Script init copie fichiers
                              9. Vérification
```

## ⚠️ Points Critiques

1. **Toujours supprimer les volumes** avant de builder
2. **Utiliser `--no-cache`** pour garantir un build propre
3. **Vérifier les logs** du container frontend pour confirmer la copie
4. **Purger le cache Cloudflare** après déploiement si nécessaire

## 📚 Fichiers Clés

- **Script de déploiement** : `scripts/deploy-prod.sh`
- **Dockerfile frontend** : `frontend/Dockerfile.prod` (script d'init)
- **Docker Compose** : `docker-compose.prod.yml` (configuration volumes)

