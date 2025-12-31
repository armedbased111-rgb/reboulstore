# ✅ Solution : admin.reboulstore.com page blanche

## 🔍 Problème identifié

**Cause principale** : Le fichier `admin-central/frontend/src/services/api.ts` utilisait `http://localhost:4001` en dur comme baseURL, ce qui ne fonctionne pas en production depuis le navigateur.

### Pourquoi ça ne fonctionnait pas ?

1. **En production** : Le frontend est servi par nginx, pas par Vite dev server
2. **Le navigateur** ne peut pas accéder à `http://localhost:4001` (c'est un port interne Docker)
3. **L'API doit être accessible via** `/api` qui est proxifié par nginx vers `backend:4001`
4. **Résultat** : Les requêtes API échouent → erreurs JavaScript → React ne se monte pas → page blanche

---

## ✅ Solution appliquée

### Correction du fichier `api.ts`

**Avant** :
```typescript
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4001',  // ❌ Ne fonctionne pas en production
  // ...
});
```

**Après** :
```typescript
const getBaseURL = (): string => {
  // Si VITE_API_URL est défini, l'utiliser
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // En développement, utiliser localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:4001';
  }
  
  // En production, utiliser le chemin relatif /api (proxifié par nginx)
  return '/api';  // ✅ Fonctionne en production
};

const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  // ...
});
```

---

## 🚀 Actions à effectuer

### 1. Rebuild et redéployer Admin Central

```bash
# Option 1 : Via le script de déploiement (recommandé)
./scripts/deploy-prod.sh

# Option 2 : Manuellement
ssh deploy@152.228.218.35 << 'EOF'
cd /opt/reboulstore/admin-central
docker compose -f docker-compose.prod.yml --env-file .env.production build --no-cache frontend
docker compose -f docker-compose.prod.yml --env-file .env.production up -d frontend
EOF
```

### 2. Vérifier que ça fonctionne

```bash
# Vérifier les containers
./rcli server status --admin

# Vérifier les logs
ssh deploy@152.228.218.35 "docker logs admin-central-frontend-prod --tail 20"

# Tester depuis le navigateur
# Ouvrir https://admin.reboulstore.com
# Ouvrir la console développeur (F12)
# Vérifier qu'il n'y a pas d'erreurs
```

---

## 🔍 Diagnostic effectué

### ✅ Ce qui fonctionne
- Containers Admin Central démarrés et healthy
- Fichiers frontend présents dans le volume (`index.html`, `assets/`)
- Nginx admin répond correctement (HTTP 200)
- Routage depuis nginx principal vers nginx admin fonctionne
- Assets JS et CSS accessibles

### ❌ Problème trouvé
- **baseURL API en dur** : `http://localhost:4001` ne fonctionne pas depuis le navigateur en production
- **Solution** : Utiliser `/api` (chemin relatif proxifié par nginx)

---

## 📝 Notes importantes

1. **En développement** : `http://localhost:4001` fonctionne (Vite proxy)
2. **En production** : Utiliser `/api` (proxifié par nginx vers `backend:4001`)
3. **Variable d'environnement** : `VITE_API_URL` peut être définie pour override
4. **Nginx proxifie** `/api` → `http://backend:4001` (voir `admin-central/nginx/conf.d/admin.conf`)

---

## ✅ Après correction

Une fois le rebuild et redéploiement effectués, le site `admin.reboulstore.com` devrait :
1. ✅ Afficher la page de sélection de magasin (Home)
2. ✅ Permettre de cliquer sur "Reboul" → redirige vers `/admin/reboul/login`
3. ✅ Fonctionner correctement avec les appels API via `/api`

---

**Date** : 31 décembre 2025  
**Statut** : ✅ Correction appliquée, rebuild nécessaire

