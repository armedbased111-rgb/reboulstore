# Monitoring Admin Central

## 📊 Vue d'ensemble

Le monitoring de l'Admin Central peut être configuré de manière similaire à Reboul Store, avec quelques considérations spécifiques pour un environnement administrateur.

## 🎯 Options de Monitoring

### Option 1 : Google Analytics 4 (Recommandé)

**Pourquoi** : Gratuit, robuste, et permet de tracker l'utilisation de l'interface admin.

**Configuration** :

1. **Créer une propriété GA4**
   - Aller sur https://analytics.google.com
   - Créer une nouvelle propriété "Admin Central - Reboul Store"
   - Obtenir le Measurement ID (format : `G-XXXXXXXXXX`)

2. **Installer dans le frontend Admin**
   ```typescript
   // admin-central/frontend/src/utils/analytics.ts
   import { useEffect } from 'react';
   
   export const initAnalytics = () => {
     const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
     
     if (!GA_MEASUREMENT_ID) return;
     
     // Script Google Analytics
     const script1 = document.createElement('script');
     script1.async = true;
     script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
     document.head.appendChild(script1);
     
     window.dataLayer = window.dataLayer || [];
     function gtag(...args: any[]) {
       window.dataLayer.push(args);
     }
     gtag('js', new Date());
     gtag('config', GA_MEASUREMENT_ID, {
       page_path: window.location.pathname,
     });
   };
   ```

3. **Ajouter dans le App.tsx**
   ```typescript
   useEffect(() => {
     initAnalytics();
   }, []);
   ```

4. **Variables d'environnement**
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

**Événements à tracker** :
- Connexion admin (`admin_login`)
- Création produit (`admin_product_create`)
- Modification produit (`admin_product_update`)
- Commande traitée (`admin_order_process`)
- Upload image (`admin_image_upload`)

---

### Option 2 : Hotjar (Optionnel)

**Pourquoi** : Permet de voir comment les admins utilisent l'interface (heatmaps, recordings).

**Configuration** :

1. **Créer un compte Hotjar**
   - Aller sur https://www.hotjar.com
   - Créer un nouveau site "Admin Central"
   - Obtenir le Tracking Code

2. **Installer dans le frontend**
   ```typescript
   // admin-central/frontend/src/utils/hotjar.ts
   export const initHotjar = () => {
     const HOTJAR_ID = import.meta.env.VITE_HOTJAR_ID;
     const HOTJAR_SV = import.meta.env.VITE_HOTJAR_SV;
     
     if (!HOTJAR_ID || !HOTJAR_SV) return;
     
     (function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
       h.hj = h.hj || function() { (h.hj.q = h.hj.q || []).push(arguments) };
       h._hjSettings = { hjid: HOTJAR_ID, hjsv: HOTJAR_SV };
       a = o.getElementsByTagName('head')[0];
       r = o.createElement('script'); r.async = 1;
       r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
       a.appendChild(r);
     })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
   };
   ```

**Note** : Hotjar peut avoir un impact sur les performances. À utiliser avec modération pour un environnement admin.

---

### Option 3 : Logs Backend (Déjà configuré)

Les logs backend sont déjà centralisés via Docker logging driver (Phase 23.2).

**Voir les logs Admin Central** :
```bash
cd /opt/reboulstore/admin-central
docker compose -f docker-compose.prod.yml --env-file .env.production logs backend
```

**Logs à monitorer** :
- Erreurs d'authentification
- Erreurs de création/modification de produits
- Erreurs d'upload d'images
- Erreurs de traitement de commandes

---

## 📈 Métriques importantes à suivre

### Performance
- Temps de chargement des pages admin
- Temps de réponse des API admin
- Temps d'upload d'images

### Utilisation
- Nombre de connexions admin par jour
- Pages les plus visitées
- Actions les plus fréquentes (création produit, modification stock, etc.)

### Erreurs
- Taux d'erreur des API
- Erreurs d'authentification
- Erreurs d'upload

---

## 🔔 Alertes (Optionnel)

Pour un monitoring plus avancé, considérer :

1. **Sentry** (Error tracking)
   - Configuration déjà préparée dans le backend
   - Permet de recevoir des alertes en cas d'erreurs critiques

2. **Uptime monitoring** (UptimeRobot, Pingdom)
   - Vérifier que l'admin est accessible 24/7
   - Alertes en cas d'indisponibilité

---

## ✅ Checklist de configuration

### Google Analytics 4
- [ ] Compte GA4 créé
- [ ] Propriété "Admin Central" créée
- [ ] Measurement ID obtenu
- [ ] Code d'initialisation ajouté au frontend
- [ ] Variable d'environnement `VITE_GA_MEASUREMENT_ID` configurée
- [ ] Événements custom configurés (optionnel)

### Hotjar (Optionnel)
- [ ] Compte Hotjar créé
- [ ] Site "Admin Central" créé
- [ ] Tracking code obtenu
- [ ] Code d'initialisation ajouté au frontend
- [ ] Variables d'environnement configurées

### Logs
- [x] Logs Docker configurés (déjà fait en Phase 23.2)
- [ ] Script de visualisation des logs (utiliser `scripts/view-logs.sh` adapté pour admin-central)

---

## 📝 Notes

1. **Confidentialité** : Le monitoring de l'Admin Central doit respecter la confidentialité des données admin
2. **Performance** : Les scripts de monitoring (GA, Hotjar) peuvent impacter les performances - tester sur l'environnement de production
3. **Données sensibles** : Ne jamais logger ou tracker des mots de passe ou données sensibles

---

## 🚀 Prochaines étapes

Une fois le monitoring configuré :
1. Vérifier que les données remontent correctement
2. Configurer des dashboards personnalisés
3. Définir des alertes pour les erreurs critiques
4. Analyser régulièrement les métriques pour améliorer l'interface admin
