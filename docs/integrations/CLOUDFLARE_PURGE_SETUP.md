# 🌐 Configuration Purge Cache Cloudflare

## 📋 Vue d'ensemble

Le système de purge automatique du cache Cloudflare permet de purger automatiquement le cache lors des déploiements, évitant ainsi les problèmes de cache qui empêchent de voir les nouvelles versions du site.

## 🔧 Configuration

### 1. Obtenir les identifiants Cloudflare

#### Zone ID

1. Connectez-vous à [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Sélectionnez votre domaine (reboulstore.com)
3. Dans la section **Overview**, copiez le **Zone ID** (visible à droite)

#### API Token (Recommandé)

1. Allez dans **My Profile** → **API Tokens**
2. Cliquez sur **Create Token**
3. Utilisez le template **Edit zone DNS** ou créez un token personnalisé avec :
   - **Permissions** :
     - `Zone` → `Zone Settings` → `Read`
     - `Zone` → `Cache Purge` → `Purge`
   - **Zone Resources** :
     - `Include` → `Specific zone` → `reboulstore.com`
4. Copiez le token généré (visible une seule fois)

#### Alternative : API Key + Email (Ancienne méthode)

1. Allez dans **My Profile** → **API Tokens**
2. Copiez votre **Global API Key**
3. Notez votre **Email Cloudflare**

### 2. Configurer les variables d'environnement

#### En local (pour les déploiements)

Ajoutez dans votre `.env.local` ou `.bashrc` / `.zshrc` :

```bash
# Cloudflare Configuration
export CLOUDFLARE_ZONE_ID="votre_zone_id_ici"
export CLOUDFLARE_API_TOKEN="votre_api_token_ici"
```

**OU** (méthode alternative avec API Key) :

```bash
export CLOUDFLARE_ZONE_ID="votre_zone_id_ici"
export CLOUDFLARE_EMAIL="votre_email@example.com"
export CLOUDFLARE_API_KEY="votre_global_api_key_ici"
```

#### Sur le serveur (optionnel)

Si vous voulez purger depuis le serveur, ajoutez dans `.env.production` sur le serveur :

```bash
CLOUDFLARE_ZONE_ID=votre_zone_id_ici
CLOUDFLARE_API_TOKEN=votre_api_token_ici
```

### 3. Tester la configuration

Testez la purge manuellement :

```bash
# Avec API Token (recommandé)
export CLOUDFLARE_ZONE_ID="votre_zone_id"
export CLOUDFLARE_API_TOKEN="votre_token"
./scripts/cloudflare-purge.sh

# OU avec API Key + Email
export CLOUDFLARE_ZONE_ID="votre_zone_id"
export CLOUDFLARE_EMAIL="votre_email"
export CLOUDFLARE_API_KEY="votre_key"
./scripts/cloudflare-purge.sh
```

Vous devriez voir :
```
✅ Cache Cloudflare purgé avec succès
```

## 🚀 Utilisation Automatique

### Déploiement avec purge automatique

La purge est automatiquement exécutée lors des déploiements si les variables d'environnement sont configurées :

```bash
# Déploiement Reboul Store (purge automatique si configuré)
export DEPLOY_HOST=deploy@152.228.218.35
export DEPLOY_PATH=/opt/reboulstore
export CLOUDFLARE_ZONE_ID="votre_zone_id"
export CLOUDFLARE_API_TOKEN="votre_token"
./scripts/deploy-prod.sh

# Déploiement unifié (purge automatique si configuré)
./scripts/deploy-all.sh
```

### Purge manuelle

Vous pouvez aussi purger manuellement à tout moment :

```bash
# Purge complète (tout le cache)
./scripts/cloudflare-purge.sh

# Purge sélective (fichiers spécifiques)
./scripts/cloudflare-purge.sh --files "https://www.reboulstore.com/index.html" "https://www.reboulstore.com/app.js"
```

## 📝 Options du Script

```bash
./scripts/cloudflare-purge.sh [OPTIONS]

Options:
  --zone ZONE_ID      Zone ID Cloudflare (override CLOUDFLARE_ZONE_ID)
  --token TOKEN       Token API Cloudflare (override CLOUDFLARE_API_TOKEN)
  --email EMAIL       Email Cloudflare (override CLOUDFLARE_EMAIL)
  --key KEY           API Key Cloudflare (override CLOUDFLARE_API_KEY)
  --files FILE1 ...    Purger des fichiers spécifiques (au lieu de tout)
  --help              Afficher l'aide
```

## 🔒 Sécurité

### Bonnes pratiques

1. **Utilisez un API Token** plutôt qu'une API Key globale (plus sécurisé)
2. **Limitez les permissions** du token uniquement à ce qui est nécessaire
3. **Ne commitez JAMAIS** les tokens dans Git
4. **Utilisez des variables d'environnement** ou un gestionnaire de secrets
5. **Régénérez les tokens** régulièrement

### Variables d'environnement recommandées

- ✅ `.env.local` (local, dans `.gitignore`)
- ✅ `.env.production` (serveur, dans `.gitignore`)
- ✅ Variables d'environnement système (`.bashrc`, `.zshrc`)
- ❌ **JAMAIS** dans le code source ou `.env` commité

## 🐛 Dépannage

### Erreur : "CLOUDFLARE_ZONE_ID n'est pas défini"

**Solution :** Définissez la variable d'environnement :
```bash
export CLOUDFLARE_ZONE_ID="votre_zone_id"
```

### Erreur : "CLOUDFLARE_API_TOKEN n'est pas défini"

**Solution :** Définissez la variable d'environnement :
```bash
export CLOUDFLARE_API_TOKEN="votre_token"
```

### Erreur : "HTTP 401" (Unauthorized)

**Causes possibles :**
- Token invalide ou expiré
- Permissions insuffisantes
- Zone ID incorrect

**Solution :**
1. Vérifiez que le token a les permissions `Cache Purge`
2. Vérifiez que le Zone ID correspond au bon domaine
3. Régénérez le token si nécessaire

### Erreur : "HTTP 403" (Forbidden)

**Causes possibles :**
- Token sans permission pour cette zone
- Zone ID incorrect

**Solution :**
1. Vérifiez que le token a accès à la zone `reboulstore.com`
2. Vérifiez le Zone ID dans le dashboard Cloudflare

### La purge ne fonctionne pas

**Vérifications :**
1. Les variables d'environnement sont-elles définies ?
2. Le token a-t-il les bonnes permissions ?
3. Le Zone ID est-il correct ?
4. Testez manuellement : `./scripts/cloudflare-purge.sh`

## 📚 Références

- [Cloudflare API Documentation](https://developers.cloudflare.com/api/)
- [Purge Cache API](https://developers.cloudflare.com/api/operations/zone-purge-cache)
- [API Tokens Guide](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)

## ✅ Checklist Configuration

- [ ] Zone ID récupéré depuis Cloudflare Dashboard
- [ ] API Token créé avec permissions `Cache Purge`
- [ ] Variables d'environnement configurées (`.env.local` ou `.bashrc`)
- [ ] Test manuel réussi : `./scripts/cloudflare-purge.sh`
- [ ] Purge automatique testée lors d'un déploiement

---

**Date :** 30/12/2025  
**Version :** 1.0

