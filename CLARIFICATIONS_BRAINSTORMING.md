# 📝 Clarifications & Décisions - Brainstorming Session

## 🎯 Décisions prises lors du brainstorming

### Architecture Multi-Shops
- ✅ **Option A (Multi-Tenant)** choisie
- Panier universel (articles de plusieurs shops)
- Commandes regroupées (un seul checkout)
- **Stripe Connect** pour répartir paiements vers bons comptes Stripe

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

### Back-Office
- ✅ **Frontend séparé** (`admin/`) connecté au même backend
- ✅ Sous-domaine : `admin.reboulstore.com`
- ✅ UI : **GeistUI**
- ✅ Import/Export : **CSV/Excel** produits et commandes
- ✅ Édition : **Formulaire classique** + **Inline**

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

1. **Phase 10** : Architecture Multi-Shops (entité Shop, filtrage)
2. **Phase 11** : Authentification (JWT + OAuth Google/Apple)
3. **Phase 12** : Stripe + Stripe Connect
4. **Frontend** : Setup shadcn/ui + Workflow Figma/Framer
5. **Back-Office** : Setup admin/ avec GeistUI

---

## 📚 Documents mis à jour

- ✅ `CONTEXT.md` : Toutes les décisions et clarifications
- ✅ `backend/BACKEND.md` : Roadmap complète avec détails techniques
- ✅ `frontend/FRONTEND.md` : Roadmap frontend avec workflow design
- ✅ `ARCHITECTURE_MULTI_SHOPS.md` : Analyse Option A vs B
- ✅ `.cursor/rules/project-rules.mdc` : Workflow shadcn/ui
