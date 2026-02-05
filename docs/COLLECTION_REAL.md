# 📦 Intégration Collection Réelle - Workflow Complet

**Version** : 1.0  
**Date** : 13/01/2026  
**Statut** : En cours de documentation

---

## 🎯 Objectif

Documenter le workflow complet d'intégration des collections réelles dans le site Reboul Store. Les collections sont reçues une à une sous forme de table (Excel/CSV) et intégrées manuellement via l'interface Admin.

---

## 📋 Vue d'ensemble du Processus

### Workflow Global

```
1. Réception Collection (Table Excel/CSV)
   ↓
2. Préparation & Validation Données
   ↓
3. Import via Admin (Upload fichier)
   ↓
4. Validation & Correction
   ↓
5. Upload Images Produits
   ↓
6. Publication Collection
```

### Ordre Logique des Étapes

1. **24.1** Documentation & Contexte ✅ (ce document)
2. **24.2** Insertion Marques avec Logos ✅ (presque terminé)
3. **24.3** Politique Livraison Finale (réunion magasin)
4. **24.4** Système Rotation Collections ✅ (terminé)
5. **24.5bis** Import Manuel Collections via Tables/CSV (à faire)
6. **24.6** Amélioration Processus Stocks (gestion manuelle)
7. **24.7** Workflow Images Produits ✅ (presque terminé)
8. **24.8** Workflow Ajout Continu Produits (entrée manuelle continue)
9. **24.9** Checklist Finale - Validation Collection

---

## 📊 Structure Données - Mapping Table/CSV → Base de Données

### Format Table/CSV Attendu

**Colonnes requises** :

| Colonne CSV/Excel | Type | Description | Mapping DB | Obligatoire |
|------------------|------|-------------|------------|-------------|
| `name` | Texte | Nom du produit | `Product.name` | ✅ Oui |
| `reference` | Texte | Référence/SKU produit | `Product.reference` | ⚠️ Recommandé |
| `description` | Texte | Description produit | `Product.description` | ❌ Non |
| `price` | Nombre | Prix en euros (ex: 89.99) | `Product.price` | ✅ Oui |
| `brand` | Texte | Nom de la marque | `Product.brandId` (via lookup) | ⚠️ Recommandé |
| `category` | Texte | Nom de la catégorie | `Product.categoryId` (via lookup) | ✅ Oui |
| `collection` | Texte | Nom collection (ex: "SS2025") | `Product.collectionId` (via lookup) | ✅ Oui |
| `color` | Texte | Couleur du variant | `Variant.color` | ✅ Oui |
| `size` | Texte | Taille du variant | `Variant.size` | ✅ Oui |
| `stock` | Nombre | Stock disponible | `Variant.stock` | ✅ Oui |
| `sku` | Texte | SKU unique par variant | `Variant.sku` | ✅ Oui |
| `materials` | Texte | Matériaux (ex: "100% Cotton") | `Product.materials` | ❌ Non |
| `careInstructions` | Texte | Instructions d'entretien | `Product.careInstructions` | ❌ Non |
| `madeIn` | Texte | Pays de fabrication | `Product.madeIn` | ❌ Non |

**Note** : Un produit peut avoir plusieurs lignes (une par variant : couleur + taille)

### Format fiche reçue (ex. Edite)

Fiche type reçue (ex. PDF « Edite 1e 130126 a »). **C'est tout ce qu'on reçoit** — pas de prix ni nom produit dans la fiche.

**Règle** : **1 ligne = 1 article = 1 variant**. La taille est **dans la colonne Reference** (ex. ref du type « XXX-36 » → taille 36).

**Colonnes à utiliser** :

| Colonne fiche | Mapping | Description |
|---------------|---------|-------------|
| **Marque** | → Brand (lookup par nom) | Marque du produit |
| **Genre** | → Catégorie / type produit (lookup) | Genre du produit |
| **Reference** | → Product.reference + extraction taille pour Variant.size | Référence article (contient la taille) |
| **Stock** | → Variant.stock | Quantité en stock |

**Colonnes à ignorer** : code article, prix achat, valeur, PLA

**Données absentes de la fiche** (à compléter après import dans l'Admin) :
- **Prix** : pas dans la fiche (non utilisable) → à saisir manuellement par produit après import
- **Nom produit** : pas dans la fiche → à saisir manuellement ou déduire de la ref / marque
- **Couleur** : à saisir si besoin (ou une seule couleur par ref par défaut)

**Import proposé** : 1 ligne = 1 article = 1 variant. Référence = base du SKU, taille extraite de la ref, stock = stock. Après import : compléter prix et nom en édition produit dans l'Admin.

**Format reçu** : pour l'instant **uniquement en PDF**. Pas d'export CSV/Excel fourni.  
**Workflow cible** : copier le tableau depuis le PDF → **coller directement dans l'Admin** (zone « Coller le tableau ») → clic Importer. Pas d'Excel ni de fichier CSV intermédiaire. L'Admin parse le texte collé (colonnes Marque, Genre, Reference, Stock) et crée les produits + variants en un clic.

### Exemple de Table/CSV

Template téléchargeable : `docs/import-collection-template.csv`

```csv
name,reference,description,price,brand,category,collection,color,size,stock,sku,materials,careInstructions,madeIn
"T-shirt Coton","TSH-001","T-shirt en coton bio","29.99","Nike","T-shirts","SS2025","Noir","M","10","TSH-001-N-M","100% Coton","Lavage 30°C","France"
"T-shirt Coton","TSH-001","T-shirt en coton bio","29.99","Nike","T-shirts","SS2025","Noir","L","5","TSH-001-N-L","100% Coton","Lavage 30°C","France"
"T-shirt Coton","TSH-001","T-shirt en coton bio","29.99","Nike","T-shirts","SS2025","Blanc","M","8","TSH-001-B-M","100% Coton","Lavage 30°C","France"
```

### Mapping Détaillé

#### Table `products`

| Champ DB | Source CSV | Transformation | Validation |
|----------|------------|----------------|------------|
| `name` | `name` | Direct | Non vide, max 255 caractères |
| `reference` | `reference` | Direct | Unique, max 100 caractères |
| `description` | `description` | Direct | Optionnel |
| `price` | `price` | Convertir en decimal(10,2) | > 0 |
| `categoryId` | `category` | Lookup par nom → UUID | Doit exister |
| `brandId` | `brand` | Lookup par nom → UUID | Optionnel |
| `collectionId` | `collection` | Lookup par nom → UUID | Doit exister (collection active) |
| `materials` | `materials` | Direct | Optionnel |
| `careInstructions` | `careInstructions` | Direct | Optionnel |
| `madeIn` | `madeIn` | Direct | Optionnel |

#### Table `variants`

| Champ DB | Source CSV | Transformation | Validation |
|----------|------------|----------------|------------|
| `productId` | (généré) | UUID du produit créé | Obligatoire |
| `color` | `color` | Direct | Non vide, max 100 caractères |
| `size` | `size` | Direct | Non vide, max 50 caractères |
| `stock` | `stock` | Convertir en integer | >= 0 |
| `sku` | `sku` | Direct | Unique, max 100 caractères |

---

## ✅ Processus Validation Données

### Validation Avant Import

**Checklist qualité données** :

- [ ] **Format fichier** : CSV ou Excel valide
- [ ] **Colonnes requises** : Toutes les colonnes obligatoires présentes
- [ ] **Données complètes** : Aucune ligne avec colonnes obligatoires vides
- [ ] **Formats corrects** :
  - [ ] Prix : Nombre décimal valide (ex: 29.99, pas "29,99€")
  - [ ] Stock : Nombre entier >= 0
  - [ ] SKU : Unique dans le fichier
- [ ] **Références valides** :
  - [ ] Marques : Toutes les marques existent en base
  - [ ] Catégories : Toutes les catégories existent en base
  - [ ] Collection : La collection existe et est active
- [ ] **Cohérence données** :
  - [ ] Produits avec même `reference` ont même `name`, `price`, `brand`, `category`
  - [ ] SKU unique par variant (pas de doublons)

### Validation Pendant Import

**Erreurs détectées automatiquement** :

- ❌ **Erreurs bloquantes** (import arrêté) :
  - Colonnes obligatoires manquantes
  - Format fichier invalide
  - Collection inexistante ou inactive

- ⚠️ **Warnings** (import continue, lignes ignorées) :
  - Marque inexistante (produit créé sans marque)
  - Catégorie inexistante (ligne ignorée)
  - SKU dupliqué (variant ignoré)
  - Prix invalide (ligne ignorée)
  - Stock négatif (mis à 0)

### Validation Après Import

**Vérifications post-import** :

- [ ] Nombre de produits créés = nombre attendu
- [ ] Nombre de variants créés = nombre attendu
- [ ] Tous les produits assignés à la collection active
- [ ] Stocks cohérents (>= 0)
- [ ] Aucune erreur critique dans les logs

---

## 📝 Guide Import Manuel via Admin

### Étape 1 : Préparation Fichier

1. **Recevoir la collection** sous forme de table (Excel/CSV)
2. **Vérifier le format** :
   - Colonnes requises présentes
   - Données complètes
   - Formats corrects (prix, stock, etc.)
3. **Corriger les erreurs** si nécessaire :
   - Nettoyer les données
   - Uniformiser les formats
   - Vérifier références (marques, catégories)

### Étape 2 : Vérification Collection

1. **Se connecter à l'Admin** : `admin.reboulstore.com`
2. **Aller dans Collections** :
   - Vérifier que la collection existe
   - Vérifier que la collection est **active**
   - Si nouvelle collection : créer et activer (archiver l'ancienne si nécessaire)

### Étape 3 : Import via Admin

1. **Aller dans la page Import Collection** (à créer dans Admin)
2. **Sélectionner la collection** cible
3. **Uploader le fichier** (CSV ou Excel)
4. **Prévisualiser les données** :
   - Vérifier le nombre de produits/variants
   - Vérifier les erreurs/warnings
   - Corriger si nécessaire
5. **Lancer l'import** :
   - Confirmer l'import
   - Suivre la progression
   - Vérifier les logs

### Étape 4 : Validation & Correction

1. **Vérifier les produits créés** :
   - Aller dans la liste des produits
   - Filtrer par collection
   - Vérifier que tous les produits sont présents
2. **Corriger les erreurs** si nécessaire :
   - Produits manquants → créer manuellement
   - Variants manquants → ajouter via édition produit
   - Stocks incorrects → modifier via Admin

### Étape 5 : Upload Images

1. **Suivre le workflow images** (voir `docs/integrations/IMAGES_WORKFLOW.md`)
2. **Uploader les images** pour chaque produit :
   - Via Admin (page édition produit)
   - Association automatique par SKU (si convention nommage respectée)
3. **Vérifier les images** :
   - Tous les produits ont au moins 1 image
   - Qualité images correcte
   - Images optimisées (WebP)

### Étape 6 : Publication

1. **Vérifier la collection** :
   - Tous les produits présents
   - Tous les stocks corrects
   - Toutes les images uploadées
2. **Activer la collection** (si pas déjà fait)
3. **Vérifier le frontend** :
   - Produits visibles sur le site
   - Images affichées correctement
   - Stocks cohérents

---

## 🔄 Workflow Ajout Continu Produits

**Contexte** : Nouveaux produits ajoutés chaque semaine tout au long de la saison

### Processus

1. **Recevoir nouveaux produits** (table/CSV ou liste)
2. **Préparer les données** (même format que import collection)
3. **Importer via Admin** :
   - Utiliser l'interface import collection
   - Sélectionner la collection active
   - Uploader le fichier avec nouveaux produits
4. **Vérifier doublons** :
   - Le système vérifie automatiquement les SKU existants
   - Doublons ignorés ou mis à jour selon configuration
5. **Upload images** pour nouveaux produits
6. **Validation** avant publication

---

## ⚠️ Points d'Attention

### Variants Complexes

**Cas spéciaux** :
- **Chaussures** : Couleurs multiples, plusieurs types de tailles
- **Pantalons** : Tailles italiennes différentes
- **Marques différentes** : Taillent différemment

**Solution** : Les guides de tailles sont gérés par les policies de catégories (automatique)

### Stocks

- **Gestion manuelle** : Stocks mis à jour manuellement via Admin
- **Alerte réassort** : Système d'alerte pour stocks 0-5 unités (à implémenter)
- **Rupture** : Stock = 0 (pas de vérification multi-magasins)

### Collections

- **Rotation** : Nouvelle collection remplace l'ancienne (ancienne → archivée)
- **Première sortie** : Seulement la nouvelle collection
- **Assignation automatique** : Nouveaux produits assignés à la collection active

---

## 📚 Documents de Référence

- **Workflow Images** : `docs/integrations/IMAGES_WORKFLOW.md`
- **Phase 24 Synthèse** : `docs/phases/PHASE_24_SYNTHESE.md`
- **Roadmap Complète** : `docs/context/ROADMAP_COMPLETE.md` (Section Phase 24)
- **AS400 Analysis** : `docs/AS400_ANALYSIS_GUIDE.md` (en suspens)

---

## 🎯 Prochaines Étapes

1. **Créer interface Admin Import Collection** (24.5bis)
2. **Créer template Excel/CSV** avec exemples
3. **Tester import collection complète**
4. **Documenter cas d'erreurs** et solutions
5. **Créer guide utilisateur** Admin

---

**Date de dernière mise à jour** : 13/01/2026
