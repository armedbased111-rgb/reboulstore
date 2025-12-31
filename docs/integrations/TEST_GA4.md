# Guide : Tester GA4

## 🎯 Méthodes de test

### Méthode 1 : GA4 Realtime (Recommandé - Le plus simple)

1. **Ouvrir GA4 Dashboard**
   - Aller sur https://analytics.google.com
   - Se connecter avec ton compte Google
   - Sélectionner la propriété "Reboul Store"

2. **Ouvrir Realtime**
   - Cliquer sur **"Reports"** dans le menu de gauche
   - Cliquer sur **"Realtime"**

3. **Visiter le site**
   - Ouvrir un **nouvel onglet en navigation privée** (ou un autre navigateur)
   - Visiter : `https://www.reboulstore.com`
   - Naviguer sur quelques pages

4. **Vérifier dans GA4**
   - Dans GA4 Realtime, tu devrais voir :
     - **1 utilisateur actif** (ou plus)
     - Les **pages visitées** apparaissent en temps réel
     - **Événements** trackés (page_view automatique)

**Délai** : Max 30 secondes avant apparition dans Realtime

---

### Méthode 2 : DevTools du navigateur (Technique)

1. **Ouvrir DevTools**
   - Visiter `https://www.reboulstore.com`
   - Appuyer sur `F12` (ou clic droit > Inspecter)

2. **Vérifier le script GA4**
   - Aller dans l'onglet **"Network"**
   - Filtrer par **"gtag"** ou **"google-analytics"**
   - Tu devrais voir des requêtes vers `www.google-analytics.com` ou `www.googletagmanager.com`

3. **Vérifier la console**
   - Aller dans l'onglet **"Console"**
   - Vérifier qu'il n'y a pas d'erreurs liées à GA4
   - Optionnel : Activer l'extension "Google Analytics Debugger" pour voir les logs détaillés

4. **Vérifier le Measurement ID**
   - Aller dans l'onglet **"Sources"** ou **"Elements"**
   - Chercher dans le code HTML : `G-S8LMN95862` (ton Measurement ID)
   - Ou chercher : `gtag('config', 'G-S8LMN95862')`

---

### Méthode 3 : Extension Chrome "Google Analytics Debugger"

1. **Installer l'extension**
   - Aller sur Chrome Web Store
   - Chercher "Google Analytics Debugger"
   - Installer l'extension

2. **Activer l'extension**
   - Cliquer sur l'icône de l'extension dans la barre d'outils
   - L'extension doit être **activée** (badge ON)

3. **Visiter le site**
   - Aller sur `https://www.reboulstore.com`
   - Ouvrir la console (`F12` > Console)

4. **Vérifier les logs**
   - Tu devrais voir des logs détaillés GA4 :
     ```
     Running Google Analytics Debugger
     Initializing Google Analytics
     Tracking Pageview: /
     ```

---

## ✅ Checklist de vérification

- [ ] GA4 Realtime montre au moins 1 visiteur actif
- [ ] Les pages visitées apparaissent dans Realtime
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Les requêtes vers Google Analytics sont visibles dans Network
- [ ] Le Measurement ID `G-S8LMN95862` est présent dans le code

---

## 🔍 Vérifier les événements

GA4 track automatiquement :
- ✅ **page_view** : Chaque changement de page (automatique via notre code)
- ⏳ **view_item** : Consultation produit (à implémenter dans les composants produits)
- ⏳ **add_to_cart** : Ajout au panier (à implémenter)
- ⏳ **purchase** : Achat (à implémenter)

Pour l'instant, seul `page_view` est actif automatiquement.

---

## 🐛 Résolution de problèmes

### Si rien n'apparaît dans Realtime

1. **Vérifier le Measurement ID**
   ```bash
   ssh deploy@152.228.218.35
   cat /opt/reboulstore/frontend/.env.production | grep GA
   ```
   Doit afficher : `VITE_GA_MEASUREMENT_ID=G-S8LMN95862`

2. **Vérifier que le frontend a été rebuild**
   - Les variables d'environnement sont injectées au build time
   - Si le Measurement ID a été ajouté après le build, il faut rebuild

3. **Vérifier le cache du navigateur**
   - Vider le cache
   - Ou utiliser la navigation privée

4. **Vérifier les bloqueurs de pubs**
   - Désactiver temporairement les bloqueurs (uBlock Origin, etc.)
   - Certains bloqueurs bloquent Google Analytics

### Si erreurs dans la console

- Vérifier que `VITE_GA_MEASUREMENT_ID` est bien défini
- Vérifier qu'il n'y a pas d'erreurs de réseau (CORS, etc.)
- Vérifier que le script `gtag.js` se charge correctement

---

## 📊 Exemple de ce que tu devrais voir

**Dans GA4 Realtime** :
```
Utilisateurs actifs : 1
Événements dans les 30 dernières minutes : 5
Pages consultées :
  - / (Home)
  - /catalog
  - /product/123
```

**Dans DevTools Network** :
```
Request URL: https://www.google-analytics.com/g/collect?v=2&...
Status: 204 No Content
```
