# 🧠 Brainstorming - Roadmap Complète Reboul Store

**Date** : 11 décembre 2025  
**Contexte** : Après implémentation checkout Stripe, emails invités, capture manuelle  
**Objectif** : Structurer la vision complète du projet jusqu'à la fin

---

## 📋 Table des matières

1. [État Actuel & Contexte](#état-actuel--contexte)
2. [Gestion des Stocks](#gestion-des-stocks)
3. [Page Produit - Informations à Afficher](#page-produit---informations-à-afficher)
4. [Admin Centrale - Fonctionnalités](#admin-centrale---fonctionnalités)
5. [Architecture Multi-Sites](#architecture-multi-sites)
6. [Workflow de Commandes](#workflow-de-commandes)
7. [Roadmap & Priorités](#roadmap--priorités)
8. [Fonctionnalités Avancées](#fonctionnalités-avancées)

---

## 🎯 État Actuel & Contexte

### ✅ Ce qui est fait

- **Infrastructure** : Backend NestJS + Frontend React + PostgreSQL + Docker
- **Catalogue** : Produits, catégories, brands, filtres, recherche
- **Authentification** : JWT, register, login, profil, adresses
- **Panier** : Gestion complète avec session (guest + auth)
- **Checkout Stripe** : Solution hébergée fonctionnelle
  - ✅ Guest checkout (sans compte)
  - ✅ Checkout authentifié
  - ✅ Capture manuelle par admin (workflow PENDING → PAID)
  - ✅ Images produits sur Stripe Checkout
  - ✅ Extraction complète données (adresses, téléphone)
- **Emails** : Système complet avec persistance BDD
  - ✅ Email réception commande (PENDING)
  - ✅ Email confirmation paiement (PAID)
  - ✅ Email expédition (SHIPPED)
  - ✅ Email livraison (DELIVERED)
  - ✅ Email annulation (CANCELLED/REFUNDED)
  - ✅ Support invités (via customerInfo.email)
  - ✅ Persistance tous les emails envoyés (OrderEmail entity)
- **Stocks** : Gestion au niveau variants, vérification avant capture
- **Architecture** : Prévue pour multi-sites (Reboul → CP Company → Outlet)

### 🔄 En cours / À faire

- Page produit complète (stocks, infos détaillées)
- Admin Centrale (critique pour gestion)
- Historique commandes client
- Améliorations UX (alertes, recommandations)

---

## 📦 Gestion des Stocks

### Questions à discuter

#### 1. Affichage sur la Page Produit

**Option A : Affichage statut uniquement**
- ✅ "En stock" (vert)
- ⚠️ "Stock faible" (orange) - si < seuil
- ❌ "Rupture de stock" (rouge) - si = 0
- 🔄 "Sur commande" (gris) - si en attente réappro

**Option B : Affichage quantité exacte**
- Afficher "X en stock" pour chaque variant
- Plus transparent, mais peut révéler des informations business

**Option C : Hybride**
- "En stock" si stock > seuil
- "X en stock" si stock ≤ seuil (transparence stock faible)
- "Rupture de stock" si = 0

**Recommandation** : Option C (hybride) - Bon équilibre transparence/stratégie

#### 2. Seuils d'Alerte

- **Stock faible** : < 5 unités ? < 10 ? Autre ?
- **Alerte admin** : Notifications quand stock faible
- **Alerte client** : Afficher "Dernières pièces" pour créer urgence

#### 3. Gestion Rupture de Stock

**Comportement frontend** :
- [ ] Désactiver bouton "Ajouter au panier" pour variant épuisé
- [ ] Griser la taille/couleur dans le sélecteur
- [ ] Afficher message "Rupture de stock" au clic
- [ ] Proposer "Me prévenir quand disponible" (alerte email)

**Options futures** :
- [ ] Afficher date de réapprovisionnement estimée
- [ ] Permettre pré-commande (avec date estimée livraison)
- [ ] Suggestions alternatives (produits similaires en stock)

#### 4. Affichage Variants (Couleur/Taille)

**Problème actuel** : Comment afficher le stock pour chaque combinaison couleur/taille ?

**Solutions** :
1. **Badge par variant** : Badge "En stock" / "Stock faible" / "Épuisé" sur chaque variant
2. **Sélecteurs séparés** : 
   - Sélecteur couleur → puis sélecteur taille (filtré selon stock couleur)
   - Taille grisée si épuisée pour cette couleur
3. **Matrice stock** : Tableau couleur × taille avec statut pour chaque case
   - Complexe mais très informatif
   - Peut être lourd visuellement

**Recommandation** : Sélecteurs séparés (couleur → taille) avec grisage si épuisé

#### 5. Recommandation Tailles

- [ ] Guide des tailles avec tableau (catégorie ou produit)
- [ ] Recommandation "Taille recommandée : M" basée sur historique client
- [ ] Afficher dimensions produit (longueur, largeur, etc.)

---

## 🛍️ Page Produit - Informations à Afficher

### Informations Actuelles

✅ Images (galerie Swiper)  
✅ Nom produit  
✅ Prix  
✅ Variants (couleur, taille)  
✅ Description  
✅ Tabs (Details, Sizing, Shipping, Returns)

### À Ajouter / Améliorer

#### 1. Informations Stock (Priorité HAUTE)

- [ ] Statut stock par variant (En stock / Stock faible / Rupture)
- [ ] Quantité disponible (si stock faible)
- [ ] Badges "Dernières pièces" pour créer urgence
- [ ] Désactivation variants épuisés

#### 2. Informations Produit Détaillées (Priorité MOYENNE)

- [ ] **Marque** : Afficher logo/nom marque (A-COLD-WALL*, etc.)
- [ ] **Référence/SKU** : Afficher référence produit
- [ ] **Matières/Composition** : 
  - 100% Coton, 95% Polyester / 5% Élasthanne, etc.
  - Affichage pourcentage et matériaux
- [ ] **Instructions entretien** :
  - Lavage (30°C, lavage délicat, etc.)
  - Repassage (faible, moyen, etc.)
  - Séchage (sèche-linge interdit, etc.)
- [ ] **Dimensions produit** :
  - Longueur, largeur (pour vêtements)
  - Poids (pour calcul livraison)
- [ ] **Pays d'origine** : Made in France, Italy, etc.
- [ ] **Certifications** : Bio, Commerce équitable, etc. (si applicable)

#### 3. Guide Taille (Priorité HAUTE)

- [ ] Tableau des tailles (déjà prévu dans tabs "Sizing")
  - Affichage par catégorie ou override produit
  - Mesures (tour de poitrine, longueur, etc.)
- [ ] Recommandation taille basée sur :
  - Historique d'achat client (si connecté)
  - Taille moyenne par produit (data analytics)
- [ ] Bouton "Comment choisir sa taille ?" avec modal explicatif

#### 4. Images Produit (Améliorations)

- [ ] **Vue 360°** : Rotation produit (si images disponibles)
- [ ] **Zoom au survol** : Grossir image au hover
- [ ] **Vue détail** : Zoom sur matières, finitions, logo
- [ ] **Vidéo produit** : Court métrage style book (si disponible)
- [ ] **Lookbook** : Afficher produit porté (homme, femme, enfant)

#### 5. Produits Similaires / Recommandations (Priorité MOYENNE)

- [ ] **"Vous aimerez aussi"** : Produits de même catégorie/marque
- [ ] **"Souvent achetés ensemble"** : Cross-selling
- [ ] **"Produits récemment consultés"** : Historique session
- [ ] **"Produits de la même collection"** : Grouper par collection

#### 6. Avis Clients (Priorité BASSE - Post-lancement)

- [ ] Affichage note moyenne (étoiles)
- [ ] Liste avis (texte + note + date + pseudo)
- [ ] Tri avis (plus récents, plus utiles, note haute/basse)
- [ ] Photos avis clients
- [ ] Filtres (taille achetée, couleur, note)

#### 7. Informations Légales / Conformité

- [ ] **Garantie** : Durée, conditions
- [ ] **Retour** : Délai retour (14 jours, 30 jours, etc.)
- [ ] **Livraison** : Délais estimés, frais
- [ ] **CGV** : Lien vers conditions générales

#### 8. Social Proof / Urgence

- [ ] **"X personnes regardent ce produit"** : Compteur temps réel
- [ ] **"Vendu X fois ce mois"** : Popularité
- [ ] **"Dernière pièce"** : Si stock = 1
- [ ] **Compte à rebours promo** : Si promotion flash sale

---

## 🎛️ Admin Centrale - Fonctionnalités

### Vue d'ensemble

**Objectif** : Interface unifiée pour gérer Reboul, CP Company, Outlet

**Architecture** :
- Frontend séparé (`/admin`) ou sous-domaine (`admin.reboulstore.com`)
- Accès par rôle (ADMIN, SUPER_ADMIN)
- Connexion aux backends des 3 sites (API calls)

### 1. Tableau de Bord (Dashboard)

#### Métriques Clés

- [ ] **Ventes du jour/mois/année** :
  - Chiffre d'affaires (€)
  - Nombre de commandes
  - Panier moyen
  - Taux de conversion
- [ ] **Commandes** :
  - En attente de capture (PENDING) - **CRITIQUE**
  - En cours de traitement (PROCESSING)
  - Expédiées aujourd'hui (SHIPPED)
  - Retours/remboursements en attente
- [ ] **Stocks** :
  - Produits en rupture
  - Produits stock faible (< seuil)
  - Valeur stock total
- [ ] **Produits** :
  - Les plus vendus (top 10)
  - Produits sans vente (30 jours)
  - Nouvelles arrivées

#### Graphiques & Analytics

- [ ] **Graphique ventes** : Courbe CA sur période (jour/semaine/mois)
- [ ] **Graphique commandes** : Évolution nombre commandes
- [ ] **Répartition par catégorie** : % ventes par catégorie (camembert)
- [ ] **Répartition par marque** : % ventes par marque
- [ ] **Performance produits** : Top/Bottom produits

#### Alertes & Notifications

- [ ] **Alertes stock faible** : Liste produits < seuil
- [ ] **Commandes en attente capture** : Badge avec nombre
- [ ] **Commandes en attente expédition** : Liste commandes PAID non expédiées
- [ ] **Retours en attente traitement** : Liste demandes retour

### 2. Gestion Produits

#### CRUD Produits

- [ ] **Liste produits** :
  - Tableau avec filtres (catégorie, marque, statut stock)
  - Recherche (nom, SKU, référence)
  - Pagination
  - Tri (nom, prix, stock, date création)
  - Actions : Voir, Modifier, Dupliquer, Supprimer
- [ ] **Création/Édition produit** :
  - Informations de base (nom, description, prix, catégorie, marque)
  - Upload images (max 7, drag & drop, réorganisation)
  - Gestion variants (couleur, taille, SKU, stock, prix)
  - Informations détaillées (matières, dimensions, entretien)
  - SEO (meta title, meta description, slug)
  - Statut (publié, brouillon, archivé)

#### Gestion Images

- [ ] Upload multiple (drag & drop)
- [ ] Réorganisation (drag & drop pour ordre)
- [ ] Suppression
- [ ] Zoom/aperçu
- [ ] Réglages (alt text, ordre)

#### Gestion Variants

- [ ] **Création variants** :
  - Sélecteur couleur (couleurs prédéfinies ou custom)
  - Sélecteur taille (sizes par catégorie)
  - Génération automatique toutes combinaisons
  - Édition individuelle (SKU, stock, prix si différent)
- [ ] **Édition masse** :
  - Modifier stock tous variants
  - Modifier prix tous variants
  - Activer/désactiver variants
- [ ] **Import/Export** :
  - Export CSV (produits, variants, stocks)
  - Import CSV (mise à jour stocks, prix)

#### Gestion Stocks

- [ ] **Vue stocks** :
  - Tableau produits avec stock total
  - Détail par variant
  - Filtres (rupture, stock faible, en stock)
- [ ] **Mise à jour stocks** :
  - Édition manuelle variant par variant
  - Import CSV (SKU, quantité)
  - Historique modifications stock (audit trail)
- [ ] **Alertes** :
  - Notification email admin si stock < seuil
  - Dashboard badge avec nombre produits alertes

### 3. Gestion Commandes

#### Liste Commandes

- [ ] **Tableau commandes** :
  - Colonnes : ID, Date, Client, Total, Statut, Actions
  - Filtres : Statut, date, client, montant
  - Recherche : ID commande, email client, nom
  - Tri : Date, total, statut
  - Pagination
- [ ] **Statuts commandes** :
  - PENDING (en attente capture) - **PRIORITÉ**
  - PAID (payée, en attente expédition)
  - PROCESSING (en préparation)
  - SHIPPED (expédiée)
  - DELIVERED (livrée)
  - CANCELLED (annulée)
  - REFUNDED (remboursée)

#### Détail Commande

- [ ] **Informations commande** :
  - Numéro, date, statut
  - Client (nom, email, téléphone)
  - Adresse livraison/facturation
  - Paiement (méthode, montant, transaction ID)
- [ ] **Articles commandés** :
  - Liste produits (image, nom, variant, quantité, prix)
  - Sous-total, livraison, total
- [ ] **Actions** :
  - **Capture paiement** (si PENDING) - **CRITIQUE**
  - Changer statut (PAID → PROCESSING → SHIPPED → DELIVERED)
  - Ajouter numéro tracking
  - Générer facture (PDF)
  - Imprimer étiquette expédition
  - Annuler commande
  - Rembourser (partiel ou total)

#### Capture Manuelle Paiements

- [ ] **Workflow capture** :
  1. Admin voit commande PENDING
  2. Vérifie stock disponible
  3. Clique "Capturer paiement"
  4. Si stock OK → Capture Stripe → Statut → PAID → Email confirmation
  5. Si stock KO → Annulation PaymentIntent → Statut → CANCELLED → Email annulation
- [ ] **Interface** :
  - Bouton "Capturer paiement" sur commande PENDING
  - Modal confirmation avec détails
  - Affichage résultat (succès/échec)
  - Logs actions (qui, quand, quoi)

#### Expédition

- [ ] **Gestion expédition** :
  - Marquer comme expédiée
  - Ajouter numéro tracking
  - Générer étiquette (si intégration transporteur)
  - Email automatique notification expédition
- [ ] **Intégration transporteurs** (futur) :
  - Colissimo, Chronopost, DHL, etc.
  - Génération automatique étiquettes
  - Mise à jour statut automatique (webhook transporteur)

### 4. Gestion Clients

#### Liste Clients

- [ ] **Tableau clients** :
  - Colonnes : Nom, Email, Téléphone, Commandes, CA total, Dernière commande
  - Recherche : Nom, email
  - Filtres : Client actif, VIP, etc.
- [ ] **Détail client** :
  - Informations personnelles
  - Adresses (livraison, facturation)
  - Historique commandes
  - Historique communications (emails)

### 5. Gestion Catégories & Marques

- [ ] CRUD catégories (nom, slug, description, image, size chart)
- [ ] CRUD marques (nom, slug, description, logo, images mega menu)
- [ ] Organisation hiérarchique (catégories parent/enfant)
- [ ] Upload images/vidéos (catégories, brands)

### 6. Gestion Utilisateurs Admin

- [ ] **Rôles** :
  - ADMIN : Gestion complète (produits, commandes, stocks)
  - SUPER_ADMIN : Tout + gestion utilisateurs admin
- [ ] **CRUD utilisateurs admin** :
  - Création compte admin
  - Attribution rôles
  - Désactivation compte
- [ ] **Permissions** :
  - Gérer permissions par rôle (qui peut faire quoi)
  - Logs actions admin (audit trail)

### 7. Configuration

- [ ] **Paramètres généraux** :
  - Informations shop (nom, adresse, SIRET, TVA)
  - Devise (EUR)
  - Langue (FR)
- [ ] **Stripe** :
  - Clés API (test/live)
  - Configuration webhooks
- [ ] **Emails** :
  - Templates emails (customiser)
  - Configuration SMTP
- [ ] **Stocks** :
  - Seuil stock faible
  - Alertes email admin
- [ ] **Livraison** :
  - Frais livraison (fixe, par poids, par zone)
  - Zones livraison
  - Délais estimés
- [ ] **Retours** :
  - Délai retour
  - Conditions retour
  - Adresse retour

---

## 🏗️ Architecture Multi-Sites

### Architecture Technique

#### Option A : Multi-Tenant (Recommandée ✅)

**1 base de données, 1 backend, entité Shop pour séparation**

**Avantages** :
- ✅ Simple à maintenir (1 codebase)
- ✅ Coûts réduits (1 serveur, 1 BDD)
- ✅ Partage ressources (utilisateurs, panier possible)
- ✅ Migration facile (ajouter shopId aux entités)

**Structure** :
```
Database
├── shops (id, name, slug)
├── products (id, ..., shopId)
├── categories (id, ..., shopId)
└── orders (id, ..., shopId)
```

**Frontend** :
- Routes : `/shop/reboul/catalog`, `/shop/cpcompany/catalog`
- Ou sous-domaines : `reboul.reboulstore.com`, `cpcompany.reboulstore.com`

**Admin** :
- Sélecteur shop en haut
- Filtre par shop dans toutes les vues

#### Option B : Microservices (Non recommandée ❌)

**Chaque site = backend + BDD séparés**

**Inconvénients** :
- ❌ Complexité (4 backends, 4 BDD)
- ❌ Coûts élevés
- ❌ Maintenance difficile
- ❌ Overkill pour 4 shops

### Questions à Discuter

1. **Sites à créer** :
   - Reboul (Enfants) - ✅ En cours
   - CP Company - 🔜 Quand ?
   - Outlet - 🔜 Quand ?
   - Autres sites prévus ?

2. **Timing** :
   - Lancer Reboul d'abord (stabiliser)
   - Puis CP Company (copier structure Reboul)
   - Puis Outlet (structure similaire)

3. **Partage utilisateurs** :
   - Même compte utilisateur pour tous les sites ?
   - Ou comptes séparés par site ?
   - Partage panier entre sites possible ?

4. **Admin Centrale** :
   - 1 admin pour tous les sites (filtre par shop)
   - Ou admin séparé par site ?

**Recommandation** : Multi-tenant, partage utilisateurs, admin unifié

---

## 📦 Workflow de Commandes

### Workflow Actuel (Capture Manuelle)

```
1. Client → Checkout Stripe → Paiement
2. Webhook → Création commande PENDING
3. Email "Commande reçue" envoyé
4. Admin vérifie stock → Capture paiement
5. Si stock OK :
   - Capture Stripe PaymentIntent
   - Statut → PAID
   - Décrément stock
   - Email "Confirmation paiement"
6. Admin prépare commande → Statut → PROCESSING
7. Admin expédie → Statut → SHIPPED + Tracking
   - Email "Commande expédiée"
8. Livraison → Statut → DELIVERED
   - Email "Commande livrée"
```

### Questions à Discuter

#### 1. Capture Automatique vs Manuelle

**Actuellement** : Manuelle (admin valide avant capture)

**Option A : Toujours manuelle** ✅
- Avantages : Contrôle total, vérification stock avant
- Inconvénients : Processus plus lent

**Option B : Automatique si stock OK**
- Si stock disponible → Capture auto
- Si stock KO → PENDING → Admin décide
- Avantages : Plus rapide, meilleure UX
- Inconvénients : Moins de contrôle

**Option C : Choix par produit**
- Certains produits = capture auto (stock fiable)
- Autres produits = capture manuelle (stock limité)

**Recommandation** : Garder manuelle pour MVP, ajouter automatique plus tard si besoin

#### 2. Gestion Stock Insuffisant

**Actuellement** : Annulation automatique si stock < quantité

**Alternatives** :
- [ ] **Pré-commande** : Créer commande "sur commande" (statut BACKORDER)
- [ ] **Allocation partielle** : Expédier ce qui est disponible, rembourser le reste
- [ ] **Attente réappro** : Mettre commande en attente, notifier client date estimée

**Recommandation** : Garder annulation auto pour MVP, ajouter pré-commande plus tard

#### 3. Expédition

**Intégration transporteurs** :
- [ ] Colissimo (La Poste)
- [ ] Chronopost
- [ ] DHL
- [ ] Mondial Relay
- [ ] Autres ?

**Fonctionnalités** :
- [ ] Génération automatique étiquettes
- [ ] Mise à jour statut automatique (webhook transporteur)
- [ ] Tracking temps réel
- [ ] Calcul frais livraison automatique (poids, zone)

**Recommandation** : Commencer manuel (saisie tracking), intégrer transporteur plus tard

#### 4. Retours & Remboursements

**Workflow retour** :
- [ ] Client demande retour (interface client)
- [ ] Admin valide retour
- [ ] Génération étiquette retour
- [ ] Réception retour → Vérification état
- [ ] Remboursement (partiel ou total)
- [ ] Réintégration stock (si état OK)

**Gestion remboursements** :
- [ ] Remboursement total (Stripe refund)
- [ ] Remboursement partiel (montant personnalisé)
- [ ] Crédit boutique (remboursement en crédit au lieu de remboursement carte)

---

## 🗺️ Roadmap & Priorités

### Objectif Février 2025 : Reboul Prêt à la Vente

### Priorité 1 : Finaliser Reboul (Phases 12-14) 🔴

#### Phase 12 : Frontend - Panier & Checkout ✅ (TERMINÉ)
- [x] Page panier (design Figma)
- [x] Intégration Stripe Checkout
- [x] Redirection après paiement

#### Phase 13 : Backend - Stripe Checkout ✅ (TERMINÉ)
- [x] Création session checkout
- [x] Webhooks Stripe
- [x] Capture manuelle paiements
- [x] Emails invités

#### Phase 14 : Frontend - Historique Commandes ⏳ (EN COURS)
- [ ] Page `/orders` (liste commandes client)
- [ ] Page `/orders/:id` (détail commande)
- [ ] Affichage statut, tracking, articles
- [ ] Actions (télécharger facture, demander retour)

#### Phase 14.5 : Page Produit Améliorée ⏳ (À FAIRE)
- [ ] Affichage stock par variant
- [ ] Désactivation variants épuisés
- [ ] Guide taille (tableau)
- [ ] Informations détaillées (matières, dimensions, entretien)
- [ ] Produits similaires

### Priorité 2 : Admin Centrale (Phases 15-17) 🟡

#### Phase 15 : Backend - Cloudinary
- [ ] Migration upload images vers Cloudinary
- [ ] Optimisation images (resize, compression)
- [ ] CDN pour images

#### Phase 16 : Backend - Admin & Permissions
- [ ] Entité AdminUser (séparée de User client)
- [ ] Rôles (ADMIN, SUPER_ADMIN)
- [ ] Guards admin (protection routes)
- [ ] CRUD produits (admin)
- [ ] CRUD commandes (admin)
- [ ] Capture paiements (interface admin)

#### Phase 17 : Frontend - Admin Centrale
- [ ] Dashboard (métriques, alertes)
- [ ] Gestion produits (CRUD, images, variants, stocks)
- [ ] Gestion commandes (liste, détail, capture, statuts)
- [ ] Gestion clients
- [ ] Configuration

### Priorité 3 : Améliorations UX (Post-lancement) 🟢

#### Phase 18 : Fonctionnalités Avancées
- [ ] Recherche avancée (filtres multiples)
- [ ] Wishlist (liste de souhaits)
- [ ] Avis produits
- [ ] Promotions (codes promo, flash sales)
- [ ] Recommandations produits (IA)

#### Phase 19 : Optimisations
- [ ] Cache (Redis)
- [ ] Performance (lazy loading, code splitting)
- [ ] SEO (meta tags, sitemap)
- [ ] Analytics (Google Analytics 4)

### Priorité 4 : Multi-Sites (Post-lancement Reboul) 🔵

#### Phase 20 : CP Company
- [ ] Copier structure Reboul
- [ ] Créer shop CP Company
- [ ] Configurer catégories/marques
- [ ] Importer produits

#### Phase 21 : Outlet
- [ ] Créer shop Outlet
- [ ] Logique déstockage (prix barrés, % réduction)
- [ ] Filtres promotions

#### Phase 22 : Admin Multi-Sites
- [ ] Sélecteur shop dans admin
- [ ] Vue globale tous sites
- [ ] Filtres par shop

---

## 🚀 Fonctionnalités Avancées

### Court Terme (0-3 mois)

- [ ] **Alertes stock faible** : Notifications admin + affichage frontend
- [ ] **Produits similaires** : Recommandations basées catégorie/marque
- [ ] **Guide taille amélioré** : Tableau interactif, recommandations
- [ ] **Tracking commandes** : Suivi colis intégré
- [ ] **Factures PDF** : Génération automatique factures

### Moyen Terme (3-6 mois)

- [ ] **Wishlist** : Liste de souhaits clients
- [ ] **Avis produits** : Système d'avis avec photos
- [ ] **Codes promo** : Promotions, réduction %
- [ ] **Flash sales** : Promotions limitées dans le temps
- [ ] **Pré-commande** : Commandes produits en attente réappro
- [ ] **Abandon panier** : Emails rappel panier abandonné

### Long Terme (6+ mois)

- [ ] **IA recommandations** : Machine learning pour suggestions
- [ ] **Chat support** : Chatbot ou chat live
- [ ] **Programme fidélité** : Points, récompenses
- [ ] **Abonnements** : Produits récurrents (si applicable)
- [ ] **Marketplace** : Vendre produits autres vendeurs
- [ ] **App mobile** : Application iOS/Android native

---

## ✅ Actions Immédiates

### Cette Semaine

1. [ ] **Finaliser capture manuelle tests** : Valider workflow complet
2. [ ] **Page produit stocks** : Ajouter affichage stock par variant
3. [ ] **Historique commandes** : Page `/orders` client

### Ce Mois

1. [ ] **Admin Centrale** : Dashboard + gestion commandes (priorité)
2. [ ] **Page produit complète** : Toutes informations détaillées
3. [ ] **Alertes stock** : Notifications admin + frontend

### Objectif Février 2025

1. [ ] **Reboul prêt** : Site fonctionnel, produits en ligne
2. [ ] **Admin opérationnel** : Gestion complète commandes/produits
3. [ ] **Tests finaux** : Tests utilisateurs, corrections bugs
4. [ ] **Déploiement production** : Mise en ligne

---

## 💡 Notes & Idées

### Design

- **Style A-COLD-WALL*** : Maintenir minimalisme premium
- **Mobile-first** : Toujours prioriser mobile
- **Accessibilité** : Respecter WCAG 2.1

### Performance

- **Objectif Lighthouse** : Score > 90
- **Temps chargement** : < 3 secondes
- **Images optimisées** : WebP, lazy loading

### SEO

- **Meta tags** : Uniques par page
- **Sitemap.xml** : Génération automatique
- **Structured data** : Schema.org (Product, Organization)

### Sécurité

- **HTTPS** : Obligatoire (Let's Encrypt)
- **Rate limiting** : Protection API
- **Validation** : Toujours valider côté backend
- **Audit logs** : Traçabilité actions admin

---

**📝 Document vivant** : Ce document doit être mis à jour régulièrement selon décisions prises.

**🎯 Prochaine étape** : Discuter chaque section et valider priorités pour roadmap finale.
