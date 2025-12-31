# Configuration CDN - Reboul Store

## 📡 Vue d'ensemble

Pour améliorer les performances et réduire la charge serveur, il est recommandé d'utiliser un CDN (Content Delivery Network) pour servir les assets statiques (images, CSS, JS, fonts).

## 🎯 Options disponibles

### Option 1 : Cloudflare (Recommandé - Gratuit)

**Avantages** :
- Gratuit pour les sites personnels
- SSL automatique
- Protection DDoS incluse
- Cache automatique des assets statiques
- Compression automatique (Brotli/Gzip)
- Analytics basiques

**Configuration** :

1. **Créer un compte Cloudflare** (si pas déjà fait)
   - Aller sur https://dash.cloudflare.com/sign-up

2. **Ajouter le domaine**
   - Dans le dashboard Cloudflare, cliquer sur "Add a Site"
   - Entrer `reboulstore.com` et suivre les instructions

3. **Changer les DNS**
   - Cloudflare fournira des serveurs DNS à configurer chez l'hébergeur de domaine
   - Attendre la propagation DNS (peut prendre jusqu'à 24h)

4. **Configuration automatique**
   - Cloudflare détectera automatiquement les assets statiques
   - Le cache sera activé automatiquement pour les fichiers statiques

5. **Optimisations recommandées**
   - **Caching Rules** : Créer une règle pour mettre en cache tous les fichiers dans `/assets/*` avec TTL 1 an
   - **Page Rules** : 
     - `www.reboulstore.com/assets/*` → Cache Everything, Edge Cache TTL: 1 year
     - `www.reboulstore.com/api/*` → Bypass Cache (important !)
   - **Auto Minify** : Activer pour CSS, HTML, JavaScript
   - **Brotli** : Activer (compression automatique)

**Coûts** : Gratuit (plan Free)

---

### Option 2 : CloudFront (AWS)

**Avantages** :
- Intégration native avec AWS
- Contrôle granulaire du cache
- WAF intégré (optionnel)
- Analytics détaillées

**Inconvénients** :
- Plus complexe à configurer
- Coûts selon utilisation (mais généralement très abordable)

**Configuration** :

1. **Créer une distribution CloudFront**
   - Aller dans AWS Console → CloudFront
   - Cliquer sur "Create Distribution"

2. **Configuration Origin**
   - Origin Domain : `www.reboulstore.com` ou l'IP du serveur
   - Origin Protocol Policy : HTTPS Only

3. **Configuration Cache Behavior**
   - Path Pattern : `/assets/*`
   - Viewer Protocol Policy : Redirect HTTP to HTTPS
   - Cache Policy : CachingOptimized (ou custom avec TTL 1 an)
   - Origin Request Policy : None

4. **Configuration Distribution**
   - Alternate Domain Names (CNAMEs) : `www.reboulstore.com`, `assets.reboulstore.com` (optionnel)
   - SSL Certificate : Request or Import a Certificate with ACM

5. **DNS Configuration**
   - Créer un CNAME `assets.reboulstore.com` pointant vers la distribution CloudFront

**Coûts** : ~$0.085/GB transféré + $0.01/10,000 requêtes HTTPS (très abordable pour petits/moyens sites)

---

### Option 3 : Vercel Edge Network (Si déjà sur Vercel)

**Note** : Si le frontend est déjà déployé sur Vercel, l'Edge Network est automatiquement activé.

**Avantages** :
- Déjà configuré si frontend sur Vercel
- Performances excellentes
- Global Edge Network

**Inconvénients** :
- Nécessite que le frontend soit sur Vercel

---

## 🔧 Configuration serveur avec CDN

### Avec Cloudflare

Aucune modification serveur nécessaire. Cloudflare fonctionne comme un proxy devant le serveur.

**Important** : Configurer les Page Rules pour bypasser le cache sur `/api/*` :

```
URL Pattern: www.reboulstore.com/api/*
Setting: Cache Level → Bypass
```

### Avec CloudFront

Si tu utilises un sous-domaine `assets.reboulstore.com` pour les assets :

1. **Modifier nginx pour servir assets depuis sous-domaine** (optionnel)
   ```nginx
   server {
       server_name assets.reboulstore.com;
       
       location / {
           alias /usr/share/nginx/html/assets/;
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

2. **Ou simplement pointer le CNAME vers CloudFront**

---

## 📊 Stratégie de cache recommandée

### Assets statiques (via CDN)
- **TTL** : 1 an (365 jours)
- **Cache-Control** : `public, immutable`
- **Path** : `/assets/*` (fichiers avec hash dans le nom)

### Images produits (Cloudinary - déjà configuré)
- Les images produits sont déjà servies via Cloudinary
- Cloudinary a son propre CDN intégré
- Pas besoin de CDN supplémentaire pour les images produits

### API
- **Pas de cache** : Toujours bypasser le cache pour `/api/*`
- **Cache-Control** : `no-cache, no-store, must-revalidate`

### HTML (index.html)
- **Pas de cache** : Toujours servir la dernière version
- **Cache-Control** : `no-cache, no-store, must-revalidate`

---

## ✅ Checklist de configuration CDN

### Cloudflare
- [ ] Compte Cloudflare créé
- [ ] Domaine ajouté à Cloudflare
- [ ] DNS configurés et propagés
- [ ] SSL activé (automatique avec Cloudflare)
- [ ] Page Rule créée pour `/api/*` → Bypass Cache
- [ ] Caching Rules configurées pour `/assets/*` → Cache 1 an
- [ ] Auto Minify activé
- [ ] Brotli activé

### CloudFront (si choisi)
- [ ] Distribution CloudFront créée
- [ ] Origin configuré (serveur OVH)
- [ ] Cache Behavior configuré pour `/assets/*`
- [ ] SSL Certificate configuré
- [ ] CNAME DNS créé (optionnel : assets.reboulstore.com)
- [ ] Distribution déployée et active

---

## 🧪 Test de configuration CDN

### Vérifier que le CDN fonctionne

```bash
# Tester un asset statique
curl -I https://www.reboulstore.com/assets/index-XXXXX.js

# Vérifier les headers de cache
# Doit contenir : Cache-Control: public, immutable, max-age=31536000
# Et le header du CDN (CF-Cache-Status pour Cloudflare, X-Cache pour CloudFront)
```

### Vérifier que l'API n'est pas mise en cache

```bash
curl -I https://www.reboulstore.com/api/products

# Ne doit PAS contenir de Cache-Control: public
# Doit contenir : Cache-Control: no-cache (ou similaire)
```

---

## 📝 Notes importantes

1. **Ne jamais mettre en cache l'API** : Les endpoints `/api/*` doivent toujours bypasser le cache
2. **Versioning des assets** : Vite génère automatiquement des noms de fichiers avec hash (ex: `index-abc123.js`), ce qui permet un cache long terme
3. **Invalidation de cache** : Avec des noms de fichiers hashés, pas besoin d'invalider le cache (le nouveau fichier a un nouveau nom)
4. **HTTPS obligatoire** : Tous les CDN modernes utilisent HTTPS par défaut

---

## 💰 Comparaison des coûts

| CDN | Plan Gratuit | Coûts supplémentaires |
|-----|--------------|----------------------|
| Cloudflare | Oui (illimité) | Payant seulement pour features avancées |
| CloudFront | Non | ~$0.085/GB + $0.01/10k requêtes |
| Vercel Edge | Inclus avec Vercel | Dépend du plan Vercel |

**Recommandation** : Cloudflare (Free) pour commencer, très simple à configurer et gratuit.

---

## 🚀 Prochaines étapes

Une fois le CDN configuré :

1. Tester les performances (PageSpeed Insights, GTmetrix)
2. Monitorer les statistiques du CDN
3. Ajuster les règles de cache si nécessaire
4. Documenter la configuration dans la roadmap

---

## 📚 Ressources

- [Cloudflare Documentation](https://developers.cloudflare.com/)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
