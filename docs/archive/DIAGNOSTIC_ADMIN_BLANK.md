# 🔍 Diagnostic : admin.reboulstore.com affiche une page blanche

## 🔎 Causes possibles

### 1. Containers Admin Central non démarrés
### 2. Volume frontend vide (fichiers non copiés depuis l'image)
### 3. Container nginx admin non accessible depuis le nginx principal
### 4. Problème de réseau Docker
### 5. Problème de build frontend

---

## 🛠️ Diagnostic étape par étape

### Étape 1 : Vérifier l'état des containers

```bash
# Via CLI (recommandé)
./rcli server status --admin

# Ou directement SSH
ssh deploy@152.228.218.35 "docker ps | grep admin"
```

**Résultat attendu** :
- `admin-central-frontend-prod` - Status: Up
- `admin-central-backend-prod` - Status: Up  
- `admin-central-nginx-prod` - Status: Up

**Si un container est manquant ou arrêté** :
```bash
# Redémarrer Admin Central
./rcli server restart --admin

# Ou manuellement
ssh deploy@152.228.218.35 "cd /opt/reboulstore/admin-central && docker compose -f docker-compose.prod.yml --env-file .env.production up -d"
```

---

### Étape 2 : Vérifier que les fichiers frontend sont dans le volume

```bash
# Vérifier que index.html existe dans le volume
ssh deploy@152.228.218.35 "docker exec admin-central-frontend-prod ls -la /usr/share/nginx/html/index.html"
```

**Si le fichier n'existe pas** :
- Le volume est vide
- Le script d'init du Dockerfile n'a pas copié les fichiers

**Solution** :
```bash
# Vérifier les logs du container frontend
ssh deploy@152.228.218.35 "docker logs admin-central-frontend-prod --tail 50"

# Si erreur, redémarrer le container pour relancer le script d'init
ssh deploy@152.228.218.35 "docker restart admin-central-frontend-prod"
```

---

### Étape 3 : Vérifier que le nginx admin peut servir les fichiers

```bash
# Tester depuis l'intérieur du container nginx admin
ssh deploy@152.228.218.35 "docker exec admin-central-nginx-prod ls -la /usr/share/nginx/html/"
```

**Si les fichiers sont absents** :
- Le volume n'est pas monté correctement
- Vérifier le docker-compose.prod.yml

---

### Étape 4 : Vérifier la connectivité réseau

```bash
# Tester depuis le nginx principal vers le nginx admin
ssh deploy@152.228.218.35 "docker exec reboulstore-nginx-prod ping -c 2 admin-central-nginx-prod"
```

**Si ping échoue** :
- Problème de réseau Docker
- Vérifier que les deux containers sont sur le même réseau `reboulstore-network`

**Vérifier le réseau** :
```bash
ssh deploy@152.228.218.35 "docker network inspect reboulstore-network | grep -A 5 admin"
```

---

### Étape 5 : Vérifier les logs nginx

```bash
# Logs du nginx principal (reboulstore)
ssh deploy@152.228.218.35 "docker logs reboulstore-nginx-prod --tail 50 | grep admin"

# Logs du nginx admin
ssh deploy@152.228.218.35 "docker logs admin-central-nginx-prod --tail 50"
```

**Erreurs courantes** :
- `502 Bad Gateway` → Le nginx admin n'est pas accessible
- `Connection refused` → Le container nginx admin n'écoute pas sur le port 80
- `No such file or directory` → Les fichiers frontend sont absents

---

### Étape 6 : Vérifier le build frontend

```bash
# Vérifier que l'image frontend contient les fichiers
ssh deploy@152.228.218.35 "docker run --rm admin-central-frontend:latest ls -la /app/build/"
```

**Si les fichiers sont absents dans l'image** :
- Le build frontend a échoué
- Rebuild nécessaire

---

## 🔧 Solutions rapides

### Solution 1 : Redémarrer tous les containers Admin

```bash
./rcli server restart --admin
```

### Solution 2 : Rebuild et redéployer Admin Central

```bash
# Via le script de déploiement (recommandé)
./scripts/deploy-prod.sh

# Ou manuellement
ssh deploy@152.228.218.35 << 'EOF'
cd /opt/reboulstore/admin-central
docker compose -f docker-compose.prod.yml --env-file .env.production down
docker compose -f docker-compose.prod.yml --env-file .env.production build --no-cache frontend backend
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
EOF
```

### Solution 3 : Vérifier et corriger le volume

```bash
# Supprimer le volume et le recréer
ssh deploy@152.228.218.35 << 'EOF'
cd /opt/reboulstore/admin-central
docker compose -f docker-compose.prod.yml --env-file .env.production down -v
docker volume rm admin_central_frontend_build 2>/dev/null || true
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
EOF
```

---

## 🎯 Checklist de diagnostic rapide

Exécutez ces commandes dans l'ordre :

```bash
# 1. État des containers
./rcli server status --admin

# 2. Fichiers dans le volume frontend
ssh deploy@152.228.218.35 "docker exec admin-central-frontend-prod ls -la /usr/share/nginx/html/ | head -10"

# 3. Logs frontend (dernières lignes)
ssh deploy@152.228.218.35 "docker logs admin-central-frontend-prod --tail 20"

# 4. Logs nginx admin
ssh deploy@152.228.218.35 "docker logs admin-central-nginx-prod --tail 20"

# 5. Test de connectivité
ssh deploy@152.228.218.35 "docker exec reboulstore-nginx-prod curl -I http://admin-central-nginx-prod:80"
```

---

## 📝 Notes importantes

1. **Le volume `admin_central_frontend_build` est créé vide** au démarrage
2. **Le script d'init dans le Dockerfile** doit copier les fichiers depuis `/app/build` vers `/usr/share/nginx/html`
3. **Le nginx admin écoute sur le port 80 interne** (pas 4000)
4. **Le nginx principal route** `admin.reboulstore.com` → `admin-central-nginx-prod:80`

---

## 🚨 Problème le plus probable

**Volume frontend vide** - Les fichiers n'ont pas été copiés depuis l'image vers le volume.

**Solution** :
1. Vérifier les logs du container frontend
2. Redémarrer le container frontend pour relancer le script d'init
3. Si ça ne fonctionne pas, rebuild l'image frontend

