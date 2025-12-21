# Guide d'installation Google Analytics 4

## 📊 Vue d'ensemble

Ce guide explique comment configurer Google Analytics 4 (GA4) pour Reboul Store et Admin Central.

## 🎯 Étape 1 : Créer une propriété GA4

1. **Aller sur Google Analytics**
   - https://analytics.google.com
   - Se connecter avec un compte Google

2. **Créer une propriété**
   - Cliquer sur "Admin" (⚙️ en bas à gauche)
   - Cliquer sur "Créer une propriété"
   - Nom de la propriété : "Reboul Store" (ou "Reboul Store Production")
   - Fuseau horaire : Europe/Paris
   - Devise : EUR
   - Informations business (optionnel)

3. **Créer un flux de données Web**
   - Dans la propriété créée, aller dans "Admin" > "Flux de données"
   - Cliquer "Ajouter un flux" > "Web"
   - URL du site web : `https://www.reboulstore.com`
   - Nom du flux : "Reboul Store Production"
   - **Copier le Measurement ID** (format : `G-XXXXXXXXXX`)

4. **Répéter pour Admin Central** (optionnel)
   - Créer une deuxième propriété ou un deuxième flux
   - URL : `https://admin.reboulstore.com`
   - Nom : "Admin Central - Reboul Store"

---

## 🔧 Étape 2 : Configuration dans le code

### Reboul Store (Frontend)

1. **Ajouter la variable d'environnement**

   Créer/modifier `frontend/.env.production` :
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

   Pour le développement local (`frontend/.env.local`) :
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. **Le code est déjà intégré** ✅
   - `frontend/src/utils/analytics.ts` : Utilitaires GA4
   - `frontend/src/App.tsx` : Initialisation automatique au démarrage
   - Tracking des changements de page automatique

3. **Utiliser les événements prédéfinis**

   Exemple dans un composant :
   ```typescript
   import { analyticsEvents } from '@/utils/analytics'

   // Lorsqu'un produit est consulté
   analyticsEvents.viewProduct(productId, productName, price)

   // Lorsqu'un produit est ajouté au panier
   analyticsEvents.addToCart(productId, productName, price, quantity)

   // Lors d'un achat
   analyticsEvents.purchase(orderId, totalAmount, items)
   ```

### Admin Central (Frontend)

1. **Ajouter la variable d'environnement**

   Créer/modifier `admin-central/frontend/.env.production` :
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

   Pour le développement local (`admin-central/frontend/.env.local`) :
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. **Le code est déjà intégré** ✅
   - `admin-central/frontend/src/utils/analytics.ts` : Utilitaires GA4
   - `admin-central/frontend/src/App.tsx` : Initialisation automatique
   - Tracking des changements de page automatique

3. **Utiliser les événements prédéfinis**

   Exemple dans un composant :
   ```typescript
   import { analyticsEvents } from '@/utils/analytics'

   // Lors de la connexion admin
   analyticsEvents.adminLogin()

   // Lors de la création d'un produit
   analyticsEvents.productCreate(productId, productName)

   // Lors du traitement d'une commande
   analyticsEvents.orderProcess(orderId, 'shipped')
   ```

---

## 🚀 Étape 3 : Déploiement

### Local (test)

1. Ajouter la variable dans `.env.local`
2. Redémarrer le serveur de développement
3. Vérifier dans la console du navigateur (dev tools > Network) que le script GA4 se charge

### Production

1. **Sur le serveur**, ajouter dans `.env.production` :
   ```bash
   # Reboul Store
   cd /opt/reboulstore
   echo "VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX" >> frontend/.env.production
   
   # Admin Central (si propriété séparée)
   cd /opt/reboulstore/admin-central
   echo "VITE_GA_MEASUREMENT_ID=G-YYYYYYYYYY" >> frontend/.env.production
   ```

2. **Rebuild et redéployer** :
   ```bash
   # Reboul Store
   cd /opt/reboulstore
   docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build frontend

   # Admin Central
   cd /opt/reboulstore/admin-central
   docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build frontend
   ```

3. **Vérifier** :
   - Visiter le site
   - Aller dans GA4 > Realtime
   - Tu devrais voir les événements arriver

---

## 📊 Étape 4 : Vérification

### Vérifier que GA4 fonctionne

1. **Via l'extension Chrome** (recommandé)
   - Installer "Google Analytics Debugger" depuis Chrome Web Store
   - Activer l'extension
   - Visiter le site
   - Vérifier dans la console (F12) les logs GA4

2. **Via GA4 Realtime**
   - Aller dans GA4 > Reports > Realtime
   - Visiter le site depuis un autre navigateur
   - Tu devrais voir apparaître les visiteurs en temps réel

3. **Via les DevTools**
   - Ouvrir DevTools (F12)
   - Network > Filtrer "gtag" ou "google-analytics"
   - Tu devrais voir les requêtes vers Google Analytics

---

## 🎯 Événements disponibles

### Reboul Store (Frontend)

- `view_item` : Produit consulté
- `add_to_cart` : Produit ajouté au panier
- `remove_from_cart` : Produit retiré du panier
- `begin_checkout` : Début du checkout
- `purchase` : Achat complet
- `search` : Recherche effectuée
- `view_item_list` : Catégorie consultée

### Admin Central

- `admin_login` : Connexion admin
- `admin_logout` : Déconnexion admin
- `admin_product_create` : Création produit
- `admin_product_update` : Modification produit
- `admin_product_delete` : Suppression produit
- `admin_order_process` : Traitement commande
- `admin_order_view` : Consultation commande
- `admin_image_upload` : Upload d'images
- `admin_category_create` : Création catégorie
- `admin_category_update` : Modification catégorie

---

## 🔧 Personnalisation

### Ajouter des événements personnalisés

```typescript
import { trackEvent } from '@/utils/analytics'

// Événement simple
trackEvent('custom_event_name', {
  custom_parameter: 'value',
})

// Événement avec plusieurs paramètres
trackEvent('newsletter_signup', {
  source: 'footer',
  location: 'homepage',
})
```

### Désactiver en développement

GA4 est automatiquement désactivé si `VITE_GA_MEASUREMENT_ID` n'est pas défini. Pas besoin de configuration supplémentaire.

---

## 📝 Notes importantes

1. **RGPD / Cookies** : GA4 utilise des cookies. Assure-toi d'avoir une politique de cookies conforme (à faire si pas encore fait).

2. **Privacy** : GA4 collecte des données utilisateur. Configure les paramètres de privacy dans GA4 si nécessaire.

3. **IP Anonymization** : Activée par défaut dans notre configuration.

4. **Test en local** : Les événements seront trackés même en local si `VITE_GA_MEASUREMENT_ID` est défini.

---

## ✅ Checklist

- [ ] Propriété GA4 créée
- [ ] Measurement ID copié
- [ ] Variable `VITE_GA_MEASUREMENT_ID` ajoutée dans `.env.production`
- [ ] Frontend rebuild et redéployé
- [ ] Vérification dans GA4 Realtime
- [ ] Test de quelques événements (navigation, produit, etc.)

---

## 🔗 Ressources

- [Documentation GA4](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 E-commerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
