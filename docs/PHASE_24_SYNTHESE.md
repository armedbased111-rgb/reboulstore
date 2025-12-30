# 📦 Phase 24 - Synthèse & Plan d'Action

**Date de création** : 2025-01-XX  
**Date cible** : Février 2025 (sortie officielle)  
**Statut** : 🟡 En préparation (brainstorming complété)

---

## 🎯 Objectif

Intégrer les données réelles du magasin dans le site (AS400, marques, images, stocks) pour préparer le lancement officiel en février 2025.

---

## ✅ Décisions Prises lors du Brainstorming

### 1. AS400 - Structure & Accès

- ✅ **Export CSV disponible** : Méthode d'extraction possible, mais à évaluer avec autres options (connexion directe, API)
- ✅ **Réassorts quotidiens** : Mise à jour stocks probablement quotidienne (matin/soir), à confirmer en magasin
- ⚠️ **Journée en magasin prévue** : Analyser structure complète AS400 (tables, champs, relations) lors d'une journée dédiée

### 2. Marques & Logos

- ✅ **36 marques** : Au moins 36 marques (enfants + adultes compris)
- ✅ **Source logos** : Récupération manuelle depuis ancien git de reboul (priorité) OU via AS400 (backup)
- ✅ **Format** : Probablement déjà optimisé, à vérifier lors de la récupération

### 3. Images Produits

- ✅ **Processus** : Shooting à Aubagne au stock, récupération matériel chez le patron, setup complet ensemble, retouche Photoshop, nommage
- ✅ **Stockage** : Cloudinary (déjà configuré dans l'admin)
- ✅ **Quantité** : Entre 3 et 5 images par produit (à confirmer lors du setup)
- ⚠️ **Convention nommage** : À définir ensemble pour faciliter l'association automatique images → produits

### 4. Politiques Livraison & Retour

- ⚠️ **À définir avec équipe Reboul** : Toutes les politiques (frais, seuils, délais, zones, retours) à valider en magasin avec l'équipe

### 5. Collection & Produits

- ✅ **Ajout continu** : ⚠️ **IMPORTANT** - Nouveaux produits ajoutés chaque semaine tout au long de la saison
- ✅ **Rotation collections** : ⚠️ **IMPORTANT** - Système actif/archivée : nouvelle collection remplace l'ancienne (ancienne → archivée)
- ✅ **Première sortie** : Seulement la nouvelle collection
- ⚠️ **Nombre produits** : À vérifier en magasin
- ✅ **Données AS400** : Probablement contient : nom, taille, couleur, stock, prix. Autres infos (descriptions, matériaux, etc.) à compléter manuellement
- ✅ **Infos spécifiques** : Non nécessaire, policies de catégories déjà faites, tout automatique

### 6. Stocks & Variants

- ✅ **Gestion stocks** : Réassorts manuels quotidiens (matin/soir)
- ✅ **Synchronisation** : Quotidienne après réassorts manuels
- ✅ **Alerte réassort** : ⚠️ **IMPORTANT** - Système d'alerte pour produits avec stock entre 0 et 5 unités (notification dans l'admin)
- ✅ **Rupture** : Stock = 0 (pas de vérification multi-magasins, approche simplifiée)
- ✅ **Variants complexes** : ⚠️ **IMPORTANT** - Large gamme : chaussures avec couleurs complexes, plusieurs types de tailles (pantalon italien, etc.), marques qui taillent différemment. Guides de tailles déjà gérés par policies de catégories

### 7. Priorités & Planning

- ✅ **Ordre de priorité** : 
  1. Collection sneakers
  2. Collection reboul adulte
  3. Collection reboul enfant
- ✅ **Date cible** : Février 2025 (sortie officielle)
- ✅ **Disponibilité** : Temps nécessaire disponible

---

## ⚠️ Points Critiques Identifiés

### 1. Ajout Continu de Produits
**Impact** : Il faut prévoir un workflow pour intégrer les nouveaux produits au fur et à mesure (pas seulement import initial).

**Actions** :
- Créer processus d'ajout manuel via Admin pour nouveaux produits
- Script d'import incrémental depuis AS400
- Workflow validation avant publication

### 2. Rotation des Collections
**Impact** : Système d'archivage nécessaire pour gérer le passage d'une collection à l'autre.

**Actions** :
- Ajouter champ "collection" ou "saison" sur les produits
- Système d'archivage (activer/désactiver collection)
- Interface Admin pour gérer les collections

### 3. Variants Complexes
**Impact** : Gestion de variants avec couleurs multiples et systèmes de tailles différents selon les marques.

**Actions** :
- Vérifier que notre système de variants supporte bien ces cas
- S'assurer que les guides de tailles par catégorie fonctionnent correctement

### 4. Synchronisation Stocks Quotidienne
**Impact** : Automatiser la synchronisation quotidienne des stocks depuis AS400.

**Actions** :
- Script de synchronisation quotidienne
- Système d'alerte pour stocks 0-5 unités
- Interface Admin pour lancer sync manuellement si besoin

---

## 📋 Plan d'Action Détaillé

### Phase 24.1 : Documentation & Contexte

**Objectif** : Créer toute la documentation nécessaire

**Tâches** :
- [ ] Créer `docs/COLLECTION_REAL.md` : Workflow complet d'intégration collection réelle
- [ ] Créer `docs/AS400_INTEGRATION.md` : Structure AS400, mapping, transformation (après journée magasin)
- [ ] Créer `docs/IMAGES_WORKFLOW.md` : Workflow images produits (shooting, retouche, nommage, upload)
- [ ] Créer commandes Cursor : `/collection-workflow`, `/as400-integration`, `/images-workflow`
- [ ] Ajouter règles dans `project-rules.mdc` : Workflow Collection Réelle, Intégration AS400, Workflow Images

**Dépendances** : Journée en magasin pour AS400

---

### Phase 24.2 : Insertion Marques avec Logos

**Objectif** : Ajouter toutes les marques avec leurs logos

**Tâches** :
- [ ] Récupérer dossier logos depuis ancien git de reboul
- [ ] Vérifier formats et optimiser si nécessaire
- [ ] Créer script seed ou import CSV pour marques (36 marques)
- [ ] Upload logos sur Cloudinary via Admin
- [ ] Insérer marques en base via Admin ou script
- [ ] Vérifier affichage logos dans navigation frontend
- [ ] Vérifier filtres par marque fonctionnent

**Priorité** : 🔴 Haute (nécessaire pour filtres produits)

---

### Phase 24.3 : Politique Livraison Finale

**Objectif** : Définir et configurer les politiques finales

**Tâches** :
- [ ] **Réunion avec équipe Reboul** (en magasin) :
  - [ ] Définir frais livraison (standard, express)
  - [ ] Définir seuil livraison gratuite
  - [ ] Définir délais livraison
  - [ ] Définir zones de livraison (si applicable)
  - [ ] Définir politique retour (délai, frais, conditions)
- [ ] Mettre à jour Shop entity avec politiques finales
- [ ] Vérifier calcul livraison dans checkout
- [ ] Tester différents scénarios (sous/seuil gratuit, express, etc.)
- [ ] Vérifier page Settings Admin permet bien configuration
- [ ] Vérifier affichage frontend (panier, checkout, page politique retour)

**Priorité** : 🔴 Haute (nécessaire pour checkout)

---

### Phase 24.4 : Intégration AS400 - Transformation Données

**Objectif** : Récupérer, transformer et intégrer données AS400

#### 24.4.1 Analyse & Mapping AS400 (Journée en Magasin)

**Tâches** :
- [ ] Analyser tables AS400 disponibles (produits, stocks, marques, catégories)
- [ ] Documenter schéma AS400 (champs, types, relations)
- [ ] Identifier méthode extraction (export CSV, connexion directe, dump SQL)
- [ ] Créer mapping AS400 → notre DB :
  - [ ] Table produits AS400 → entité Product
  - [ ] Table stocks AS400 → entité Variant (stock)
  - [ ] Table marques AS400 → entité Brand
  - [ ] Table catégories AS400 → entité Category
- [ ] Identifier transformations nécessaires (formats, valeurs, normalisations)
- [ ] Documenter valeurs par défaut si données manquantes

**Dépendances** : Journée en magasin

#### 24.4.2 Processus Transformation

**Tâches** :
- [ ] Créer script Node.js/Python pour lire données AS400
- [ ] Implémenter transformations (normalisation, nettoyage)
- [ ] Validation données (champs requis, formats, contraintes)
- [ ] Générer erreurs/warnings si données invalides
- [ ] Créer format JSON/CSV intermédiaire (après transformation)
- [ ] Permettre review manuelle avant import
- [ ] Prévisualiser données transformées

#### 24.4.3 Import Données

**Tâches** :
- [ ] Créer script import données transformées
- [ ] Gérer création produits (avec vérification doublons)
- [ ] Gérer création variants avec stocks
- [ ] Gérer création/association marques et catégories
- [ ] Gérer images (association après upload)
- [ ] Logs détaillés (produits créés, erreurs, warnings)
- [ ] Rapport post-import (statistiques)
- [ ] Vérification données importées (échantillonnage)

**Priorité** : 🔴 Haute (cœur de l'intégration)

---

### Phase 24.5 : Amélioration Processus Stocks - Automatisation

**Objectif** : Automatiser la synchronisation des stocks

**Tâches** :
- [ ] Créer script sync stocks AS400 → notre DB (quotidien)
- [ ] Gérer différences (AS400 vs DB)
- [ ] Gérer cas spéciaux (produits supprimés, nouveaux, variants)
- [ ] **Système d'alerte réassort** : Notifications pour produits avec stock 0-5 unités
- [ ] Interface Admin pour lancer sync stocks manuellement
- [ ] Affichage rapport sync (produits modifiés, erreurs)
- [ ] Historique synchronisations
- [ ] Documenter workflow stocks final
- [ ] Guide utilisation Admin
- [ ] Troubleshooting guide

**Priorité** : 🟡 Moyenne (amélioration continue)

---

### Phase 24.6 : Workflow Images Produits

**Objectif** : Documenter et optimiser le processus images

#### 24.6.1 Documentation Workflow Images

**Tâches** :
- [ ] Créer guide complet dans `docs/IMAGES_WORKFLOW.md` :
  - [ ] Étapes détaillées (shooting, retouche, nommage, upload)
  - [ ] Standards qualité (résolution, formats, couleurs)
  - [ ] **Convention nommage fichiers** (à définir ensemble)
  - [ ] Structure dossiers/organisation
- [ ] Identifier points d'amélioration/automatisation

#### 24.6.2 Optimisation & Automatisation

**Tâches** :
- [ ] Script compression automatique (WebP, optimisation taille)
- [ ] Batch processing (traiter plusieurs images)
- [ ] Génération thumbnails automatique
- [ ] Script batch upload (dossier → Cloudinary)
- [ ] **Association automatique images → produits** (par nommage, selon convention définie)
- [ ] Vérification qualité avant upload (résolution min, poids max)
- [ ] Interface Admin améliorée :
  - [ ] Upload multiple images
  - [ ] Drag & drop
  - [ ] Prévisualisation avant upload
  - [ ] Ordre images (drag & drop pour réordonner)

**Priorité** : 🟡 Moyenne (optimisation)

---

### Phase 24.7 : Système Rotation Collections

**Objectif** : Gérer le passage d'une collection à l'autre

**Tâches** :
- [ ] Ajouter champ "collection" ou "saison" sur entité Product
- [ ] Créer système d'archivage (activer/désactiver collection)
- [ ] Interface Admin pour gérer les collections :
  - [ ] Activer nouvelle collection
  - [ ] Archiver ancienne collection
  - [ ] Voir produits par collection
- [ ] Frontend : Filtrer produits par collection active uniquement
- [ ] Tests : Vérifier rotation collections fonctionne

**Priorité** : 🟡 Moyenne (nécessaire pour rotation saisonnière)

---

### Phase 24.8 : Workflow Ajout Continu Produits

**Objectif** : Permettre l'ajout de nouveaux produits chaque semaine

**Tâches** :
- [ ] Processus d'ajout manuel via Admin pour nouveaux produits
- [ ] Script d'import incrémental depuis AS400 (nouveaux produits uniquement)
- [ ] Workflow validation avant publication :
  - [ ] Vérifier données complètes
  - [ ] Vérifier images présentes
  - [ ] Validation manuelle si nécessaire
- [ ] Documentation workflow ajout continu

**Priorité** : 🟡 Moyenne (nécessaire pour ajout continu)

---

### Phase 24.9 : Checklist Finale - Validation Collection

**Objectif** : Valider que tout est prêt pour le lancement

**Tâches** :
- [ ] **Données** :
  - [ ] Tous produits importés et validés
  - [ ] Tous stocks synchronisés
  - [ ] Toutes marques avec logos
  - [ ] Toutes catégories correctement associées
- [ ] **Images** :
  - [ ] Tous produits ont au moins 1 image
  - [ ] Qualité images validée
  - [ ] Images optimisées (poids, format)
- [ ] **Politiques** :
  - [ ] Politiques livraison configurées et validées
  - [ ] Politiques retour configurées et validées
- [ ] **Tests** :
  - [ ] Parcours complet achat testé avec données réelles
  - [ ] Vérification stocks cohérents
  - [ ] Vérification calculs (totaux, livraison, taxes)
  - [ ] Vérification rotation collections
  - [ ] Vérification ajout continu produits

**Priorité** : 🔴 Haute (validation finale)

---

## 📝 Questions Restantes pour Journée en Magasin

**Toutes les questions sont dans** : `docs/PHASE_24_FAQ_MAGASIN.md`

### Questions AS400 (Section 1)
- Q1.1 : Accès AS400 depuis l'extérieur (VPN, accès distant)
- Q1.2 : Qui a accès à l'AS400 (personne responsable, contact technique)
- Q1.5-Q1.11 : Structure complète AS400 (tables, champs, relations, mapping)

### Questions Politiques (Section 5)
- Q5.1-Q5.11 : Toutes les politiques livraison/retour à définir avec équipe Reboul

### Questions Collection (Section 6)
- Q6.1 : Nombre de produits dans collection enfants
- Q6.3 : Produits à exclure (anciens, soldes, etc.)

### Questions Techniques (Section 8)
- Q8.1-Q8.3 : Contraintes techniques, champs à ignorer, valeurs par défaut

### Questions Validation (Section 9)
- Q9.1-Q9.3 : Processus de validation, qui valide, timing

---

## 🗓️ Planning Recommandé

### Semaine 1 : Préparation & Documentation
- Journée en magasin : Analyser AS400, définir politiques
- Documentation : Créer docs (COLLECTION_REAL.md, AS400_INTEGRATION.md, IMAGES_WORKFLOW.md)
- Marques : Récupérer logos, préparer import

### Semaine 2 : Intégration Données
- Mapping AS400 → DB : Créer tableau correspondance
- Script transformation : Implémenter transformations
- Import initial : Importer produits, variants, stocks
- Marques : Upload logos, insérer en base

### Semaine 3 : Images & Optimisation
- Workflow images : Définir convention nommage, documenter processus
- Shooting : Setup, shooting produits prioritaires (sneakers)
- Upload images : Batch upload, association produits
- Optimisation : Compression, thumbnails

### Semaine 4 : Stocks & Collections
- Synchronisation stocks : Script sync quotidien, alertes réassort
- Rotation collections : Système archivage, interface Admin
- Ajout continu : Workflow nouveaux produits
- Tests : Validation complète collection

### Semaine 5 : Validation & Finalisation
- Checklist finale : Valider tous les points
- Tests : Parcours complet avec données réelles
- Ajustements : Corrections finales
- **Lancement** : Février 2025 ✅

---

## 🎯 Prochaines Étapes Immédiates

1. **Journée en magasin** : Analyser AS400, définir politiques, répondre aux questions FAQ
2. **Récupération logos** : Récupérer dossier depuis ancien git de reboul
3. **Documentation** : Créer docs (COLLECTION_REAL.md, AS400_INTEGRATION.md, IMAGES_WORKFLOW.md)
4. **Mapping AS400** : Créer tableau correspondance AS400 → DB
5. **Script transformation** : Développer script transformation données

---

## 📚 Fichiers de Référence

- **FAQ Magasin** : `docs/PHASE_24_FAQ_MAGASIN.md` (questions à poser en magasin)
- **Roadmap Complète** : `docs/context/ROADMAP_COMPLETE.md` (Phase 24 détaillée)
- **Synthèse** : `docs/PHASE_24_SYNTHESE.md` (ce fichier)

---

**✅ Brainstorming complété** : Tous les points principaux identifiés, décisions prises, plan d'action défini.

**🔄 Prochaine étape** : Journée en magasin pour analyser AS400 et définir politiques.

