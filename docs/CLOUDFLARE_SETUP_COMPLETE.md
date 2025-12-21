# Guide complet : Configuration Cloudflare CDN

## 🎯 Objectif

Configurer Cloudflare comme CDN pour améliorer les performances et ajouter une couche de sécurité (WAF, DDoS protection) pour Reboul Store.

---

## ⚠️ Prérequis

1. **Compte Cloudflare** (gratuit) - https://dash.cloudflare.com/sign-up
2. **Domaine reboulstore.com** enregistré
3. **Accès au registrar DNS** (là où le domaine est enregistré)

---

## 🚀 Étape 1 : Ajouter le site dans Cloudflare

### 1.1 Créer un compte (si pas déjà fait)

1. Aller sur https://dash.cloudflare.com/sign-up
2. Créer un compte avec email
3. Vérifier l'email

### 1.2 Ajouter le domaine

1. Dans le dashboard Cloudflare, cliquer **"Add a Site"**
2. Entrer `reboulstore.com`
3. Choisir le plan **"Free"** (gratuit)
4. Cloudflare va scanner les DNS records existants

---

## 📋 Étape 2 : Configurer les DNS Records

### 2.1 Vérifier les records détectés

Cloudflare détecte automatiquement :
- `www.reboulstore.com` → `152.228.218.35`
- `admin.reboulstore.com` → `152.228.218.35`

### 2.2 Vérifier/corriger les records

**Assure-toi que ces records sont configurés :**

| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| A | `www` | `152.228.218.35` | 🟠 Proxied | Auto |
| A | `admin` | `152.228.218.35` | 🟠 Proxied | Auto |
| A | `@` (root) | `152.228.218.35` | 🟠 Proxied | Auto |

**Important** : Le proxy doit être activé (nuage orange 🟠) pour que Cloudflare fonctionne comme CDN.

---

## 🔄 Étape 3 : Changer les nameservers

### 3.1 Récupérer les nameservers Cloudflare

Cloudflare affiche 2 nameservers, par exemple :
- `alex.ns.cloudflare.com`
- `tara.ns.cloudflare.com`

### 3.2 Changer chez le registrar

1. **Aller sur le registrar** (là où tu as acheté le domaine)
   - OVH : https://www.ovh.com/manager/web/
   - Ou autre registrar (GoDaddy, Namecheap, etc.)

2. **Trouver la section DNS / Nameservers**

3. **Remplacer les nameservers actuels** par ceux de Cloudflare

4. **Sauvegarder**

5. **Attendre la propagation** (5-30 minutes, jusqu'à 24h max)

### 3.3 Vérifier la propagation

```bash
# Vérifier les nameservers
dig NS reboulstore.com

# Devrait afficher les nameservers Cloudflare
```

---

## ⚙️ Étape 4 : Configuration Cloudflare

### 4.1 SSL/TLS

1. Aller dans **SSL/TLS** > **Overview**
2. Mode : **"Full"** ou **"Full (strict)"**
   - Full : Cloudflare vers serveur peut être HTTP ou HTTPS
   - Full (strict) : Cloudflare vers serveur doit être HTTPS (nécessite certificat valide)

**Recommandation** : Utiliser "Full" pour commencer (même avec HTTP côté serveur, Cloudflare gère HTTPS vers le client).

### 4.2 Speed (Optimisations)

1. Aller dans **Speed** > **Optimization**

2. **Auto Minify** : Activer
   - ✅ HTML
   - ✅ CSS
   - ✅ JavaScript

3. **Brotli** : Activer

4. **Early Hints** : Activer (optionnel, expérimental)

### 4.3 Caching (Cache Rules)

1. Aller dans **Caching** > **Configuration**

2. **Browser Cache TTL** : "Respect Existing Headers" (on gère déjà les headers dans nginx)

3. **Caching Rules** : Créer des règles

   **Règle 1 : Cache les assets statiques**
   - Rule name: "Cache Assets"
   - URL pattern: `www.reboulstore.com/assets/*`
   - Cache status: Cache Everything
   - Edge Cache TTL: 1 year
   - Browser Cache TTL: Respect Existing Headers

   **Règle 2 : Bypass cache pour API**
   - Rule name: "Bypass API"
   - URL pattern: `www.reboulstore.com/api/*`
   - Cache status: Bypass

   **Règle 3 : Bypass cache pour HTML**
   - Rule name: "Bypass HTML"
   - URL pattern: `www.reboulstore.com/` (ou utiliser Page Rules pour index.html)
   - Cache status: Bypass

### 4.4 Page Rules (Alternative aux Cache Rules)

Si tu préfères Page Rules (ancien système, toujours fonctionnel) :

1. Aller dans **Rules** > **Page Rules**

2. Créer les règles :
   - `www.reboulstore.com/assets/*` → Cache Everything, Edge Cache TTL: 1 year
   - `www.reboulstore.com/api/*` → Bypass Cache
   - `www.reboulstore.com/*` → Cache Level: Standard

---

## 🔒 Étape 5 : Activer le WAF (Web Application Firewall)

### 5.1 WAF dans Cloudflare (plan Free)

Le WAF de base est disponible sur le plan Free :

1. Aller dans **Security** > **WAF**

2. **Managed Rules** : Activer
   - Cloudflare Managed Ruleset : Activer
   - OWASP Core Ruleset : Activer (plan Free limité, mais protection de base)

3. **Rate limiting** : Disponible sur plan Free (limité)
   - Configurer selon besoin (protection brute force, etc.)

### 5.2 Firewall Rules (règles custom)

1. Aller dans **Security** > **WAF** > **Custom rules**

2. Exemples de règles :
   - Bloquer les pays (si besoin)
   - Bloquer certaines User-Agents suspects
   - Rate limiting sur /api/auth/*

---

## 📊 Étape 6 : Analytics (optionnel)

1. Aller dans **Analytics** > **Web Analytics**
2. Activer si tu veux des analytics supplémentaires (en plus de GA4)

---

## ✅ Étape 7 : Vérification

### 7.1 Vérifier que Cloudflare est actif

```bash
# Tester depuis local
curl -I https://www.reboulstore.com

# Vérifier les headers Cloudflare
# Devrait voir : server: cloudflare ou cf-ray header
```

### 7.2 Vérifier le cache

1. Visiter le site depuis un navigateur
2. DevTools > Network
3. Vérifier les headers de réponse :
   - `cf-cache-status: HIT` = Cache Cloudflare actif
   - `cf-ray` = Header Cloudflare présent

### 7.3 Tester les performances

- Utiliser https://www.webpagetest.org/
- Comparer avant/après Cloudflare
- Vérifier les temps de chargement

---

## 🔧 Configuration serveur (ajustements)

### Si tu utilises Cloudflare avec HTTPS

Le serveur peut rester en HTTP (Cloudflare gère HTTPS), mais il est recommandé d'activer HTTPS aussi (voir `docs/HTTPS_SETUP_COMPLETE.md`).

### Headers Cloudflare

Cloudflare ajoute automatiquement des headers comme :
- `CF-Connecting-IP` : IP réelle du client (utiliser ça au lieu de `X-Real-IP` si besoin)
- `CF-Ray` : ID unique de requête
- `CF-Country` : Pays du visiteur

---

## 📝 Notes importantes

1. **DNS géré par Cloudflare** : Une fois les nameservers changés, tous les changements DNS se font dans Cloudflare, pas chez le registrar.

2. **Propagation DNS** : Peut prendre jusqu'à 24h, mais généralement 5-30 minutes.

3. **SSL automatique** : Cloudflare fournit automatiquement un certificat SSL (Universal SSL), même en mode "Full" avec serveur HTTP.

4. **Cache** : Cloudflare met en cache automatiquement les assets statiques. Les règles permettent de contrôler ce qui est mis en cache.

5. **Bypass Cloudflare** : Si besoin de bypasser Cloudflare temporairement :
   - Désactiver le proxy (nuage gris au lieu d'orange) pour un record DNS
   - Ou utiliser directement l'IP `152.228.218.35`

---

## 🎉 Résultat attendu

Après configuration :
- ✅ Site accessible via Cloudflare
- ✅ HTTPS automatique (Universal SSL)
- ✅ Cache des assets statiques activé
- ✅ Protection DDoS active
- ✅ WAF de base actif
- ✅ Analytics disponibles
- ✅ Performances améliorées (chargement plus rapide)

---

## 🔗 Ressources

- [Documentation Cloudflare](https://developers.cloudflare.com/)
- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [Cloudflare Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/)
