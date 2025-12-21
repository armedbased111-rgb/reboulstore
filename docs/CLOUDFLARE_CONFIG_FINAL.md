# Configuration Cloudflare - Étapes Finales

## ✅ Nameservers changés

Les nameservers ont été changés vers Cloudflare :
- `marty.ns.cloudflare.com`
- `monroe.ns.cloudflare.com`

---

## 🔍 Étape 1 : Vérifier la propagation DNS (2-5 minutes)

La propagation peut prendre quelques minutes. Vérifier :

```bash
dig NS reboulstore.com +short
```

Devrait afficher :
```
marty.ns.cloudflare.com.
monroe.ns.cloudflare.com.
```

Si ce n'est pas encore le cas, attendre 2-5 minutes et réessayer.

---

## ⚙️ Étape 2 : Configuration Cloudflare

Une fois la propagation confirmée, configurer dans Cloudflare Dashboard :

### 2.1 SSL/TLS

1. Aller dans **SSL/TLS** > **Overview**
2. Mode : **"Full"** ou **"Full (strict)"**
   - **"Full"** : Recommandé pour commencer
     - Cloudflare vers serveur peut être HTTP ou HTTPS
     - Cloudflare vers client est HTTPS
   - **"Full (strict)"** : Si HTTPS est déjà activé sur le serveur (c'est le cas !)
     - Cloudflare vers serveur doit être HTTPS
     - Plus sécurisé

**Recommandation** : Utiliser **"Full (strict)"** car HTTPS est déjà configuré avec Let's Encrypt.

### 2.2 Speed (Optimisations)

1. Aller dans **Speed** > **Optimization**
2. Activer :
   - **Auto Minify** : ✅ HTML, ✅ CSS, ✅ JavaScript
   - **Brotli** : ✅ (compression)
3. **Rocket Loader** : Optionnel (peut casser certaines apps JS)

### 2.3 Caching (Règles de cache)

1. Aller dans **Caching** > **Configuration**
2. Créer des règles de cache :

#### Règle 1 : Cache les assets statiques

**Create rule** :
- **Rule name** : `Cache Static Assets`
- **URL** : `www.reboulstore.com/assets/*`
- **Cache status** : `Cache Everything`
- **Edge TTL** : `1 year`
- **Browser TTL** : `1 year`

#### Règle 2 : Ne pas cacher l'API

**Create rule** :
- **Rule name** : `Bypass API`
- **URL** : `www.reboulstore.com/api/*`
- **Cache status** : `Bypass`

#### Règle 3 : Ne pas cacher Admin

**Create rule** :
- **Rule name** : `Bypass Admin`
- **URL** : `admin.reboulstore.com/*`
- **Cache status** : `Bypass`

### 2.4 Security (Sécurité)

1. Aller dans **Security** > **WAF**
2. Activer :
   - ✅ **Cloudflare Managed Ruleset** (protection de base)
3. **Rate Limiting** (optionnel mais recommandé) :
   - Créer une règle pour limiter les requêtes API

---

## ✅ Vérification finale

Une fois tout configuré, vérifier :

1. **Le site fonctionne** :
   ```bash
   curl -I https://www.reboulstore.com
   ```

2. **Headers Cloudflare présents** :
   ```bash
   curl -I https://www.reboulstore.com | grep -i "cf-ray\|cloudflare"
   ```

   Devrait afficher des headers comme `cf-ray`, `server: cloudflare`, etc.

3. **Performance améliorée** :
   - Les assets statiques sont servis depuis Cloudflare (plus rapide)
   - HTTPS automatique (même si le serveur n'a pas HTTPS, Cloudflare le gère)

---

## 📊 Résumé des configurations

| Configuration | État | Description |
|--------------|------|-------------|
| **GA4** | ✅ Actif | Tracking + CLI realtime |
| **HTTPS** | ✅ Actif | Certificats Let's Encrypt |
| **Cloudflare** | 🔄 En cours | DNS propagé, configuration en cours |

---

## 🎯 Prochaines étapes

Une fois Cloudflare configuré :
1. ✅ Les 3 configurations seront terminées
2. ✅ Performance améliorée (CDN)
3. ✅ Sécurité renforcée (WAF, DDoS protection)
4. ✅ HTTPS géré par Cloudflare (en plus de Let's Encrypt)
