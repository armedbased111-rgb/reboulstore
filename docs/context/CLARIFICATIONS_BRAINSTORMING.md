# 📝 Clarifications & Décisions - Brainstorming Session

## 🎯 Décisions prises lors du brainstorming

### Architecture Multi-Shops - ✅ VALIDÉE (11 décembre 2025)

**Architecture finale validée** : **3 projets Docker séparés + 1 Admin Centralisée**

- ✅ **3 projets e-commerce indépendants** :
  - `reboulstore/` (MVP Février 2025)
  - `cpcompany/` (Futur)
  - `outlet/` (Futur)
  - Chaque projet = Backend + Frontend + PostgreSQL + Docker Compose séparé

- ✅ **1 application Admin Centralisée** :
  - `admin-central/` (Frontend React + GeistUI + Backend NestJS)
  - Connexion directe aux 3 bases de données via TypeORM (connexions multiples)
  - Réseaux Docker partagés pour accéder aux databases

- ✅ **Isolation totale** : Chaque site complètement indépendant
- ✅ **Admin unifié** : Gestion centralisée des 3 sites depuis une interface

**📚 Documentation complète** : Voir [`ARCHITECTURE_ADMIN_CENTRAL.md`](../architecture/ARCHITECTURE_ADMIN_CENTRAL.md)

### Authentification
- ✅ Commande en **guest** possible (pas d'inscription obligatoire)
- ✅ OAuth : **Google** et **Apple**
- ✅ Reset password : **Email** ou **SMS**

### Paiement Stripe
- ✅ **Capture** à la confirmation commande (pending → confirmed)
- ✅ Devises : **EUR** et **USD**
- ✅ Remboursements : Automatisation via **n8n** (workflows)

### Images Cloudinary
- ✅ Max **7 images** par produit
- ✅ Formats : JPG, PNG, WebP (et autres si nécessaire)
- ✅ Dimensions recommandées : **1200x1200px**

### Promotions
- ✅ Codes promo : **Uniques par utilisateur** (un seul usage)
- ✅ Flash sales : Durées **24h** ou **48h**
- ⚠️ Cumulabilité : À définir

### Avis Produits
- ✅ **Ouverts à tous** (pas besoin d'achat)
- ✅ **Auto-publication** (pas de modération)
- ❌ Pas de photos dans les avis

### Gestion Stocks
- ✅ Seuil alerte : **5 unités**
- ✅ Notifications : **Email admin** + **Dashboard temps réel**

### Blog/Actualités
- ✅ Auteur : **Admin uniquement**
- ⚠️ Catégories : À définir
- ⚠️ Commentaires : À définir

### Frontend - Navigation
- ✅ Page d'accueil (`/`) = **Menu de sélection shop**
- ✅ Switch shop dans **header principal**
- ✅ Panier : Articles **groupés par shop** à l'affichage
- ✅ Checkout : **Un seul checkout** pour tous les shops

### Back-Office (Admin Centralisée)
- ✅ **Application séparée** (`admin-central/`) avec Frontend + Backend séparés
- ✅ Frontend : React + Vite + **GeistUI**
- ✅ Backend : NestJS avec **connexions multiples TypeORM** (une par site)
- ✅ Connexion directe aux 3 bases de données (pas via API)
- ✅ Sous-domaine : `admin.reboulstore.com` (futur)
- ✅ Import/Export : **CSV/Excel** produits et commandes
- ✅ Édition : **Formulaire classique** + **Inline**
- ✅ **Architecture** : Voir [`ARCHITECTURE_ADMIN_CENTRAL.md`](../architecture/ARCHITECTURE_ADMIN_CENTRAL.md)

### Intégrations
- ✅ Newsletter : Service à définir (Mailchimp/SendGrid), popup (temps/scroll/exit intent)
- ⚠️ Analytics : Google Analytics (version à définir)
- ✅ Chat : **Chatbot IA** (Elevenlabs UI) **24/7**

### Performance
- ✅ **Lazy loading** images activé
- ✅ Formats modernes : **WebP/AVIF** avec fallback
- ✅ Cache frontend : **localStorage/sessionStorage**
- ⚠️ Cache backend : **Redis optionnel** (à évaluer)

### Déploiement
- ✅ Environnements : **Dev → Prod direct** (pas de staging)
- ✅ Prod : **Même serveur Docker** que dev
- ✅ Variables : Gestion via **`.env`**

---

## 🔍 Concepts expliqués

### Redis (Cache Backend)
**C'est quoi ?** Système de cache en mémoire pour accélérer les réponses API.

**Utilité** : Stocker temporairement des données fréquemment consultées (liste catégories, produits populaires) pour éviter de les recharger depuis la base à chaque requête.

**Exemple** : Au lieu de faire une requête SQL à chaque fois qu'un utilisateur charge la page d'accueil pour avoir les catégories, on les met en cache Redis. Si elles changent, on met à jour le cache.

**Décision** : Optionnel pour l'instant, à ajouter si nécessaire selon les performances.

---

### Cache Frontend (localStorage / sessionStorage)
**localStorage** : Stockage persistant dans le navigateur (reste même après fermeture)
- **Utilité** : Sauvegarder le panier, préférences utilisateur
- **Exemple** : Panier sauvegardé même si l'utilisateur ferme le navigateur

**sessionStorage** : Stockage temporaire (disparaît à la fermeture de l'onglet)
- **Utilité** : Données temporaires de la session
- **Exemple** : Données de recherche, filtres actifs

**Décision** : À implémenter pour panier et données API fréquentes.

---

### Stripe Connect
**C'est quoi ?** Système Stripe qui permet de répartir les paiements entre plusieurs comptes Stripe.

**Pourquoi nécessaire ?** 
- Reboul a son compte Stripe
- C.P.COMPANY a son propre compte Stripe
- Quand un utilisateur achète des articles des deux shops, il faut répartir l'argent

**Fonctionnement** :
1. Utilisateur paie une seule fois (checkout unique)
2. Stripe Connect répartit automatiquement :
   - Argent Reboul → compte Stripe Reboul
   - Argent C.P.COMPANY → compte Stripe C.P.COMPANY

**Décision** : À implémenter pour Phase 12.

---

### n8n (Automatisation)
**C'est quoi ?** Outil d'automatisation de workflows (comme Zapier mais open-source).

**Utilité** : Automatiser des tâches répétitives.

**Exemple pour remboursements** :
- Si commande annulée → Déclencher workflow n8n
- n8n appelle l'API Stripe pour rembourser
- n8n met à jour le statut en base

**Décision** : À tester pour remboursements automatiques.

---

### GeistUI
**C'est quoi ?** Bibliothèque de composants UI (comme shadcn/ui mais de Vercel).

**Utilité** : Interface admin cohérente et rapide à développer.

**Décision** : Utiliser pour le back-office (`admin/`).

---

## 📋 Points à définir plus tard

1. **Promotions** : Cumulabilité codes promo (oui/non)
2. **Blog** : Catégories d'articles à définir
3. **Blog** : Commentaires activés ou non
4. **Analytics** : Version Google Analytics (Universal vs GA4)
5. **Newsletter** : Service choisi (Mailchimp, SendGrid, autre)
6. **Tests** : Couverture de code cible
7. **MVP** : Fonctionnalités minimales pour lancement

---

## ✅ Prochaines étapes

1. **Phase 14** : Frontend - Historique Commandes (en cours)
2. **Phase 14.5** : Page Produit Améliorée (stock + guide taille)
3. **Phase 15** : Backend - Cloudinary (dans admin-central)
4. **Phase 16** : Backend - Admin & Permissions (admin-central avec connexions multiples)
5. **Phase 17** : Frontend - Admin Centrale (React + GeistUI)
6. **Phase 20-21** : CP Company et Outlet (copier structure reboulstore)
7. **Phase 22** : Admin Multi-Sites (ajouter connexions CP Company et Outlet)

**Architecture** : Voir [`ARCHITECTURE_ADMIN_CENTRAL.md`](../architecture/ARCHITECTURE_ADMIN_CENTRAL.md)

---

## 📚 Documents mis à jour

- ✅ `ARCHITECTURE_ADMIN_CENTRAL.md` : Architecture complète Admin Centralisée ⭐
- ✅ `CONTEXT.md` : Toutes les décisions et clarifications
- ✅ `BRAINSTORMING_ROADMAP.md` : Décisions architecture validées
- ✅ `CLARIFICATIONS_BRAINSTORMING.md` : Ce fichier (architecture validée)
- ✅ `ROADMAP_COMPLETE.md` : Roadmap avec architecture (à mettre à jour)
- ✅ `backend/BACKEND.md` : Roadmap complète avec détails techniques
- ✅ `frontend/FRONTEND.md` : Roadmap frontend avec workflow design
- ✅ `.cursor/rules/project-rules.mdc` : Workflow shadcn/ui + architecture
