# collection-workflow

**Commande** : `/collection-workflow`

Guide complet du workflow d'intégration des collections réelles dans Reboul Store.

## 📋 Vue d'ensemble

**Document principal** : `docs/COLLECTION_REAL.md`

Le workflow d'intégration des collections réelles permet d'importer les collections reçues une à une sous forme de table (Excel/CSV) via l'interface Admin.

## 🔄 Workflow Global

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

## 📊 Format Table/CSV Attendu

### Colonnes Requises

| Colonne | Type | Description | Obligatoire |
|---------|------|-------------|-------------|
| `name` | Texte | Nom du produit | ✅ Oui |
| `reference` | Texte | Référence/SKU produit | ⚠️ Recommandé |
| `price` | Nombre | Prix en euros | ✅ Oui |
| `brand` | Texte | Nom de la marque | ⚠️ Recommandé |
| `category` | Texte | Nom de la catégorie | ✅ Oui |
| `collection` | Texte | Nom collection | ✅ Oui |
| `color` | Texte | Couleur du variant | ✅ Oui |
| `size` | Texte | Taille du variant | ✅ Oui |
| `stock` | Nombre | Stock disponible | ✅ Oui |
| `sku` | Texte | SKU unique par variant | ✅ Oui |

**Note** : Un produit peut avoir plusieurs lignes (une par variant : couleur + taille)

### Exemple CSV

```csv
name,reference,price,brand,category,collection,color,size,stock,sku
"T-shirt Coton","TSH-001","29.99","Nike","T-shirts","SS2025","Noir","M","10","TSH-001-N-M"
"T-shirt Coton","TSH-001","29.99","Nike","T-shirts","SS2025","Noir","L","5","TSH-001-N-L"
```

## ✅ Processus Validation

### Avant Import

- [ ] Format fichier : CSV ou Excel valide
- [ ] Colonnes requises présentes
- [ ] Données complètes (pas de colonnes obligatoires vides)
- [ ] Formats corrects (prix décimal, stock entier >= 0)
- [ ] SKU unique dans le fichier
- [ ] Références valides (marques, catégories, collection existent)

### Pendant Import

**Erreurs bloquantes** :
- Colonnes obligatoires manquantes
- Format fichier invalide
- Collection inexistante ou inactive

**Warnings** (import continue) :
- Marque inexistante (produit créé sans marque)
- SKU dupliqué (variant ignoré)
- Prix invalide (ligne ignorée)

### Après Import

- [ ] Nombre de produits créés = nombre attendu
- [ ] Tous les produits assignés à la collection active
- [ ] Stocks cohérents (>= 0)

## 📝 Guide Import via Admin

### Étape 1 : Préparation Fichier

1. Recevoir la collection sous forme de table (Excel/CSV)
2. Vérifier le format (colonnes, données complètes)
3. Corriger les erreurs si nécessaire

### Étape 2 : Vérification Collection

1. Se connecter à l'Admin : `admin.reboulstore.com`
2. Aller dans Collections
3. Vérifier que la collection existe et est **active**
4. Si nouvelle collection : créer et activer (archiver l'ancienne si nécessaire)

### Étape 3 : Import via Admin

1. Aller dans la page Import Collection
2. Sélectionner la collection cible
3. Uploader le fichier (CSV ou Excel)
4. Prévisualiser les données
5. Lancer l'import

### Étape 4 : Validation & Correction

1. Vérifier les produits créés (liste produits, filtrer par collection)
2. Corriger les erreurs si nécessaire (produits/variants manquants, stocks incorrects)

### Étape 5 : Upload Images

1. Suivre le workflow images (voir `/images-workflow`)
2. Uploader les images pour chaque produit via Admin
3. Vérifier les images (tous les produits ont au moins 1 image)

### Étape 6 : Publication

1. Vérifier la collection (produits, stocks, images)
2. Activer la collection (si pas déjà fait)
3. Vérifier le frontend (produits visibles, images affichées)

## 🔄 Workflow Ajout Continu

**Contexte** : Nouveaux produits ajoutés chaque semaine

1. Recevoir nouveaux produits (table/CSV)
2. Préparer les données (même format)
3. Importer via Admin (sélectionner collection active)
4. Vérifier doublons (SKU existants)
5. Upload images pour nouveaux produits
6. Validation avant publication

## ⚠️ Points d'Attention

### Variants Complexes

- **Chaussures** : Couleurs multiples, plusieurs types de tailles
- **Pantalons** : Tailles italiennes différentes
- **Marques différentes** : Taillent différemment

**Solution** : Guides de tailles gérés par policies de catégories (automatique)

### Stocks

- **Gestion manuelle** : Stocks mis à jour manuellement via Admin
- **Alerte réassort** : Système d'alerte pour stocks 0-5 unités (à implémenter)
- **Rupture** : Stock = 0

### Collections

- **Rotation** : Nouvelle collection remplace l'ancienne (ancienne → archivée)
- **Assignation automatique** : Nouveaux produits assignés à la collection active

## 📚 Références

- **Document principal** : `docs/COLLECTION_REAL.md`
- **Workflow Images** : `/images-workflow`
- **Phase 24** : `docs/context/ROADMAP_COMPLETE.md` (Section Phase 24)
