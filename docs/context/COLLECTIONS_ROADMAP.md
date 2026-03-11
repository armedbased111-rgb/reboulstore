# 🧾 Roadmap Collections – Reboul Store

**Objectif** : Suivre l'avancement de la **première collection** et des **futures collections** (setup complet : politiques, refs marque par marque, photos, ajout en base). Cette roadmap est **à part** de la roadmap principale : les collections, tu en feras toujours — on ne mélange pas avec les phases produit (front, backend, lancement). **Step by step, check-in** comme la roadmap principale.

**Dernière MAJ** : 10/03/2026

---

## 📍 Où on en est (collections)

| Info | Valeur |
|------|--------|
| **Collection principale** | Stone Island SS26 (77 refs en base ; **~41/77 refs avec images** après 3 batchs ; 14 refs restant à shooter : casquettes, polo ml, pull été, sac) |
| **Autry SS26** | 36 produits / 167 variants en base ✅ ; dossiers iCloud créés ; **0 image** (shooting pas encore fait) |
| **Bisous Skateboards SS26** | 33 produits / 101 variants en base ✅ ; **25/33 images générées** ; 8 accessoires en attente de photos |
| **Prochaine tâche** | Stone Island : shooter 14 refs restantes → batch 4 → upload. Bisous : shooter 8 accessoires → batch → upload. Autry : shooter les 36 refs → batch shoe → upload |
| **Workflow de base** | Feuille/CSV → `image-to-csv` (photos feuilles) / `feuille-to-csv` → `merge-pages` → wipe + `category-create` si besoin → import Admin → `import compare-csv` (maj stock) → `db ref` → photos → `images generate` ou `images generate-batch` → `images upload` |

**Références** : `docs/COLLECTION_REAL.md`, `docs/context/FEUILLES_STOCK_REBOUL.md`, `docs/integrations/IMAGES_PRODUIT_PIPELINE.md`, `docs/integrations/IMAGES_IA_WORKFLOW.md`, `docs/integrations/IMAGES_WORKFLOW.md`, `./rcli db ref <REF>`, `./rcli images --help`.

---

## 📋 Sommaire – Collection 1 : Stone Island SS26

| Phase | Intitulé | Statut |
|-------|----------|--------|
| **1** | Setup initial (politiques, catégories, marque) | 🟡 Partiel (1.2 + 1.3 ✅ ; 1.1 politiques à faire) |
| **2** | Préparation des données (feuille/CSV, format, fusion) | ✅ Fait (photos → IA → CSV, 7 pages fusionnées) |
| **3** | Base de données (wipe, catégories, import Admin) | ✅ Fait (69 produits, 332 variants importés) |
| **4** | Vérification post-import (refs en base) | ✅ Fait |
| **5** | Shooting & préparation photos | 🟡 En cours (premier lot de produits shooté / traité, reste 42 refs à shooter) |
| **6** | Génération & upload images (par produit) | 🟡 En cours (pipeline IA + upload batch pour 27/69 refs) |
| **7** | Contrôle qualité (visuels site / Admin) | À faire |
| **8** | Clôture collection (checklist finale) | À faire |

**Ordre obligatoire** : 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8. Ne pas sauter d’étape (ex. pas d’upload images avant que les produits soient en base).

---

## Avancement par marque (Collection 1 : SS26)

*À mettre à jour au fur et à mesure (données importées, refs avec images). Ce tableau est la référence pour l’avancement par marque.*

| Marque               | Refs total | Refs en base | Refs avec images | Statut / Note        |
|----------------------|------------|--------------|------------------|----------------------|
| Stone Island         | 77         | 77           | ~41              | Données ✅ ; maj stock fév. 2026 ; 3 batchs IA générés ; **14 refs restant à shooter** (casquettes, polo ml, pull été, sac) |
| Autry                | 36         | 36           | 0                | Données ✅ (167 variants) ; dossiers iCloud créés ; **shooting à faire** ; pipeline shoe prêt (`--product-type shoe`, 3 vues : face/back/top) |
| Bisous Skateboards   | 33         | 33           | 25               | Données ✅ (101 variants) ; **25/33 images générées** ; **8 accessoires en attente de photos** |

**Comment mettre à jour** : après import, remplir « Refs total » et « Refs en base » (ex. `./rcli db product-list --brand "Stone Island" --collection SS26` pour compter). Quand tu uploades les images produit par produit, incrémenter « Refs avec images ». Quand une marque est 100 % (refs avec images = refs total), passer le statut à ✅.

*Pour une collection multi-marques, ajouter une ligne par marque.*

---

## Collection 1 : Stone Island SS26

### Phase 1 – Setup initial (une fois par collection / magasin)

**Objectif** : Vérifier ou mettre en place les éléments nécessaires avant d’importer les produits (politiques, catégories, marque).

- [ ] **1.1 Politiques livraison & retours**
  - [ ] Réunion / décision magasin : frais livraison, seuil livraison gratuite, délais, zones, politique retour (délai, frais, conditions)
  - [ ] Noter les décisions (ex. `docs/PHASE_24_FAQ_MAGASIN.md` ou équivalent)
  - [ ] Configurer Shop (backend) ou Admin Settings avec les valeurs finales
  - [ ] Vérifier affichage front (panier, checkout, page livraison/retours)

- [x] **1.2 Catégories** ✅
  - [x] Lister les catégories nécessaires pour la collection (ex. bermuda, cardigan, polo mc, jogging molleton pour Stone)
  - [x] Vérifier en base lesquelles existent déjà : `./rcli db product-list --brand "Stone Island"` ou consultation Admin
  - [x] Créer les catégories manquantes via CLI : `./rcli db category-create -n "nom catégorie" -y`
  - [x] Confirmer que toutes les catégories du CSV à importer existent

- [x] **1.3 Marque** ✅
  - [x] Vérifier que la marque (ex. Stone Island) existe en base (Admin ou CLI)
  - [x] Si besoin : créer la marque via Admin
  - [ ] Logo marque : upload Cloudinary si nécessaire, associé à la marque

---

### Phase 2 – Préparation des données (feuille de stock → CSV prêt à importer)

**Objectif** : Avoir un (ou plusieurs) CSV au format attendu par l’Admin, avec une ligne par variant, sans doublons de référence.

- [x] **2.1 Réception des données** ✅
  - [x] Recevoir la feuille de stock (ou export Excel/CSV) de la collection
  - [x] Vérifier colonnes présentes : Marque, Genre (catégorie), Référence (réf + taille), Stock (optionnel)
  - [x] Noter le nom de la collection (ex. SS26) et le nombre de pages / fichiers

- [x] **2.2 Obtenir le CSV au format BDD** ✅ (Option A – photos → IA)
  **Option A – Photos de feuilles de stock → extraction IA (ex. Stone Island)**  
  - [x] Envoyer une **photo ou scan** de chaque page de feuille de stock dans le chat (Cursor / Claude).
  - [x] Pour chaque page, demander : *« CSV pour import BDD, collection SS26, stock 2, price 100 »* (adapter collection, stock, price).
  - [x] L'IA extrait Marque, Genre (catégorie), Référence et produit un fichier CSV au format `name;reference;brand;category;collection;stock;price`.
  - [x] Sauvegarder chaque fichier (ex. `import-stone-ss26-page1.csv`, page2, …).
  - [x] Répéter pour toutes les pages, puis passer à la fusion (Phase 2.3).

  **Option B – CSV déjà saisi ou export Excel**
  - [ ] Si tu as déjà un CSV (export Excel, saisie, OCR) avec Marque ; Genre ; Référence ; Stock :
    - [ ] `./rcli import feuille-to-csv -i ma-feuille.csv -o import-ss26.csv --collection SS26 --stock 2 --price 100` (adapter collection, stock, price)
  - [ ] Vérifier le fichier de sortie : une ligne d’en-tête, une ligne par variant (référence = ref base + espace + taille)

  *Référence* : `docs/context/FEUILLES_STOCK_REBOUL.md` (section « Image → CSV avec l'IA »).

- [x] **2.3 Fusion des pages (si plusieurs fichiers)** ✅
  - [x] Lister les CSV (page1.csv, page2.csv, …) — 7 pages Stone
  - [x] Lancer la fusion : `./rcli import merge-pages -i page1.csv -i page2.csv -i page3.csv -o import-ss26-merged.csv` (adapter les noms)
  - [x] Vérifier le log : nombre de doublons retirés
  - [x] Utiliser **uniquement** le fichier fusionné pour l’import Admin (pas d’import page par page)

- [x] **2.4 Contrôle qualité du CSV**
  - [x] Ouvrir le CSV final et vérifier : pas de ligne en double (même référence), colonnes cohérentes
  - [x] Vérifier que les noms de catégories correspondent à celles créées en Phase 1.2
  - [x] Vérifier que la marque et la collection sont correctes

---

### Phase 3 – Base de données (wipe optionnel, catégories, import Admin)

**Objectif** : Préparer la BDD puis importer les produits et variants via l’Admin.

- [x] **3.1 Décision : repartir de zéro ou ajouter** ✅
  - [x] Si on repart de zéro pour cette collection : faire un backup avant toute suppression (règle projet)
  - [x] Si wipe : `./rcli db wipe-products-by-collection -c SS26 -y` (adapter le nom de collection)
  - [x] Si ajout : ne pas wipe ; les refs déjà en base seront à gérer (doublons bloqués à l’import)

- [x] **3.2 Catégories manquantes (dernier check)** ✅
  - [x] Comparer les catégories du CSV avec celles en base
  - [x] Créer les manquantes : `./rcli db category-create -n "nom" -y`

- [x] **3.3 Import via Admin** ✅
  - [x] Se connecter à l’Admin Centrale → Reboul → Produits
  - [x] Aller sur la page / fonction « Import collection »
  - [x] Upload du CSV (fichier fusionné de la Phase 2) ou coller le contenu selon l’UI
  - [x] Lancer la prévisualisation / validation
  - [x] Corriger les erreurs affichées (lignes rejetées, champs manquants) si nécessaire
  - [x] Valider l’import
  - [x] Noter le nombre de produits créés et les éventuels avertissements (69 produits, 332 variants)

- [x] **3.4 Vérification immédiate** ✅
  - [x] Vérifier en Admin que les produits apparaissent (liste produits, filtre par collection ou marque)
  - [x] Ouvrir 1–2 produits et vérifier : nom, référence, variants, stocks, catégorie, marque

---

### Phase 4 – Vérification post-import (refs en base)

**Objectif** : S’assurer que les références de la feuille de stock sont bien en base et cohérentes (pour enchaîner sur les photos).

- [x] **4.1 Échantillon de refs** ✅
  - [x] Prendre 5–10 références produit (sans la taille) depuis la feuille de stock ou le CSV
  - [x] Pour chaque ref : lancer `./rcli db ref <REF>` (ex. `./rcli db ref L100001/V09A`)
  - [x] Vérifier que le produit est trouvé, que les variants (tailles) et stocks sont corrects

- [x] **4.2 Corrections éventuelles** ✅
  - [x] Si une ref n’est pas trouvée : vérifier l’import (orthographe, format ref), corriger en Admin ou re-importer si besoin
  - [x] Si stocks ou tailles incorrects : utiliser les commandes CLI d’édition (`variant-set-stock`, etc.) ou corriger en Admin
  - [ ] Documenter toute anomalie pour ne pas la répéter sur les prochaines collections

- [x] **4.3 Liste de refs pour les photos**
  - [x] Établir la liste des refs produits qui auront des photos (tout ou partie de la collection) — 69 refs Stone SS26
  - [ ] Ordre recommandé : par marque / catégorie ou par ordre de shooting

---

### Phase 4.bis – Mise à jour stock SS26 (févr. 2026)

**Objectif** : Reprendre les nouvelles feuilles de stock Stone SS26, mettre à jour les stocks et nettoyer les produits/variants obsolètes.

- [x] **4.bis.1 Générer le CSV de mise à jour depuis les photos des feuilles**
  - [x] Dossier photos : `collections/stone island/photo to csv/IMG_0575.jpg` → `IMG_0581.jpg`
  - [x] `./rcli import image-to-csv -i collections/stone\\ island/photo\\ to\\ csv/IMG_0575.jpg ... IMG_0581.jpg -o docs/stone-maj-ss26.csv --collection SS26 --brand "Stone Island" --stock 2 --price 100`
  - [x] Résultat : 358 lignes variantes, 77 refs produit distinctes.

- [x] **4.bis.2 Comparer CSV ↔ BDD (Stone SS26)**
  - [x] `./rcli import compare-csv -i docs/stone-maj-ss26.csv --collection SS26 --brand "Stone Island" -o docs/stone-maj-rapport.txt`
  - [x] Rapport : 93 variants nouveaux, 23 mises à jour de stock, 67 variants en retrait (présents en BDD, absents du CSV).

- [x] **4.bis.3 Importer la mise à jour dans l’Admin**
  - [x] Import collection avec `stone-maj-ss26.csv` (SS26 sélectionnée)
  - [x] Création des catégories manquantes (`bermuda molleton`, `parka`)
  - [x] Résultat import : 14 produits créés, 64 mis à jour, 93 variants créés, 265 variants mis à jour (stock).

- [x] **4.bis.4 Appliquer les retraits**
  - [x] Suppression des 67 variants marqués en retrait via `./rcli db variant-delete --id <variant_id> -y` (liste issue du rapport).
  - [x] Nettoyage des produits sans variants Stone SS26 :
    - [x] `./rcli db list-empty-products` → 6 produits vides.
    - [x] `./rcli db delete-empty-products -y` → suppression des produits `1200011/V20`, `5100035E/V20`, `5100035E/V64`, `5100038/V02E`, `3100018/V20`, `4100076/V65`.

- [x] **4.bis.5 Vérification finale**
  - [x] `./rcli db count-products --brand "Stone Island" --collection SS26` → **77 produits**.

Notes : la feuille de stock SS26 et le CSV `stone-maj-ss26.csv` sont désormais la source de vérité pour cette collection ; tout produit/variant Stone SS26 hors de cette liste est supprimé.

---

### Phase 5 – Shooting & préparation photos

**Objectif** : Préparer le lieu, le matériel et les règles de prise de vue ; créer la structure de dossiers pour le pipeline images.

- [ ] **5.1 Organisation du shooting**
  - [ ] Définir le lieu (ex. Aubagne, stock) et la date
  - [ ] Récupération du matériel (éclairage, fond, etc.) si besoin
  - [ ] Lire les préconisations de prise de vue : `docs/integrations/IMAGES_IA_WORKFLOW.md` (couleurs, produit centré, etc.) si utilisation du pipeline IA
  - [ ] Si workflow classique (retouche manuelle) : lire `docs/integrations/IMAGES_WORKFLOW.md` (résolution, poids, nommage)

- [ ] **5.2 Convention de nommage et dossiers**
  - [ ] Convention fichier : `[SKU]_[numero]_[type].jpg` (ex. `REB001_1_main.jpg`)
  - [ ] Structure dossiers : `products/[collection]/[sku]/` ou un dossier temporaire `photos/` par lot avec sous-dossiers par ref
  - [ ] Pour le pipeline IA : préparer `photos/` (face.jpg, back.jpg) et `refs/` (images de style) selon la doc

- [ ] **5.3 Prises de vues**
  - [ ] Réaliser les prises de vues produit par produit (ou par lot)
  - [ ] Vérifier que chaque photo est bien nommée et associée à la ref produit
  - [ ] Stocker les fichiers dans le bon dossier (local ou partagé) pour la phase suivante

---

### Phase 6 – Génération & upload images (par produit)

**Objectif** : Pour chaque produit (ref) : s’assurer qu’il est en base, générer les images (pipeline IA ou retouche manuelle), puis uploader vers Cloudinary et associer au produit.

- [ ] **6.1 Choix du workflow images**
  - [ ] **Option A – Pipeline IA** : photos brutes → `./rcli images generate` → sortie 4 vues → `./rcli images upload`
  - [ ] **Option B – Workflow classique** : retouche manuelle (Photoshop) → nommage → upload via Admin ou script batch (voir `docs/integrations/IMAGES_WORKFLOW.md`)
  - [ ] Documenter le choix pour cette collection (pour reproduire sur les suivantes)

- [ ] **6.2 Pour chaque produit (ref) – pipeline IA**
  - [ ] Vérifier la ref en base : `./rcli db ref <REF>`
  - [ ] Préparer le dossier `photos/` pour ce produit (face, back si besoin) et `refs/` si style
  - [ ] Lancer : `./rcli images generate --input-dir photos -o output/` (adapter chemins si besoin)
  - [ ] Vérifier que les 4 fichiers (ou nombre attendu) sont dans `output/`
  - [ ] Backend allumé (site/API disponibles)
  - [ ] Lancer : `./rcli images upload --ref <REF> --dir output/` (remplacer par la ref réelle)
- [ ] **6.3 Option – génération en masse (batch)**  
  - [ ] Si les photos sont organisées en **un dossier par ref** (ex. iCloud Stone Island : sous-dossiers `L100001-V09A`, … avec face/back dedans) :  
    `./rcli images generate-batch --input-dir "/chemin/vers/STONE ISLAND" -o ./output_batch [--upload] [--skip-existing]`  
  - [ ] Premier passage = générer toutes les refs d’un coup ; quelques échecs possibles (rate limit, photo manquante) → reprendre avec `--skip-existing` pour les refs manquantes.
  - [ ] Passage au peigne fin optionnel : pour les refs où le rendu ne convient pas, `./rcli images adjust` sur la vue concernée puis ré-upload. Si le batch est déjà bon, pas d’adjust nécessaire.
  - [ ] Voir `docs/integrations/IMAGES_PRODUIT_PIPELINE.md` (Génération en masse + Workflow batch recommandé).

- [ ] **6.3 Pour chaque produit (ref) – workflow classique**
  - [ ] Retoucher les images (résolution, poids, détourage) selon `docs/integrations/IMAGES_WORKFLOW.md`
  - [ ] Nommer les fichiers selon la convention `[SKU]_[numero]_[type].jpg`
  - [ ] Upload via Admin (page produit → gestion des images) ou script batch si disponible
  - [ ] Vérifier l’ordre et la visibilité des images sur la fiche produit

- [ ] **6.4 Suivi**
  - [ ] Cocher ou lister les refs déjà traitées (pour reprendre en cas d’interruption)
  - [ ] En cas d’erreur (upload échoué, ref introuvable) : noter et corriger avant de passer à la suivante

---

### Phase 7 – Contrôle qualité (visuels site / Admin)

**Objectif** : Vérifier que les produits et images s’affichent correctement côté front (reboulstore.com) et en Admin.

- [ ] **7.1 Côté Admin**
  - [ ] Parcourir la liste des produits de la collection
  - [ ] Pour un échantillon : ouvrir la fiche produit et vérifier images, ordre, légendes si applicable
  - [ ] Vérifier qu’aucun produit en ligne n’a zéro image (sauf décision volontaire)

- [ ] **7.2 Côté front (site Reboul)**
  - [ ] Aller sur la page catalogue / collection et vérifier l’affichage des produits
  - [ ] Ouvrir plusieurs fiches produit et vérifier : galerie images, zoom, ordre des vues
  - [ ] Vérifier sur mobile et desktop (responsive)
  - [ ] Signaler toute image manquante, coupée ou incohérente

- [ ] **7.3 Corrections**
  - [ ] Corriger les produits signalés (ré-upload, réordonnancement, suppression doublon)
  - [ ] Re-vérifier après correction

---

### Phase 8 – Clôture collection (checklist finale)

**Objectif** : Valider que la collection est complète et prête pour la vente (données + images + config).

- [ ] **8.1 Données**
  - [ ] Tous les produits prévus pour cette collection sont en base
  - [ ] Variants (tailles, couleurs) et stocks sont cohérents avec la feuille de stock ou les décisions magasin
  - [ ] Prix, catégories, marque sont corrects

- [ ] **8.2 Images**
  - [ ] Tous les produits mis en vente ont au moins une image (idéalement 3–5 par produit)
  - [ ] Qualité et nommage conformes aux standards du projet

- [ ] **8.3 Config & politiques**
  - [ ] Politiques livraison et retours configurées et affichées (Phase 1.1)
  - [ ] Collection active en base (rotation collections) si applicable

- [ ] **8.4 Documentation**
  - [ ] Noter les écarts ou décisions prises pour cette collection (pour réutilisation sur les suivantes)
  - [ ] Mettre à jour cette roadmap : cocher les phases terminées, ajouter la date de clôture

---

---

## Collection 1 : Autry SS26

| Phase | Intitulé | Statut |
|-------|----------|--------|
| 1–4 | Setup, données, BDD, vérification | ✅ Fait |
| 5 | Shooting photos (36 refs, sneakers) | ⏳ À faire |
| 6 | Génération images (`--product-type shoe`, 3 vues) + upload | ⏳ Après shooting |
| 7–8 | Contrôle qualité + clôture | ⏳ |

**Données** : 36 produits, 167 variants, collection SS26, catégorie baskets.
**Pipeline shoe** : `./rcli images generate-batch --input-dir "/chemin/AUTRY" -o ./output_batch_autry --refs-dir refs_empty --gemini-flash --flash-attempts 4 --product-type shoe --skip-existing --delay 30`
**Vues générées** : `1_face` (profil latéral), `2_back` (talon), `4_top` (vue de dessus). Vue `3_front_angle` supprimée.
**Dossiers iCloud** : un dossier par ref, `/` remplacé par `-`.

---

## Collection 1 : Bisous Skateboards SS26

| Phase | Intitulé | Statut |
|-------|----------|--------|
| 1–4 | Setup, données, BDD, vérification | ✅ Fait |
| 5 | Shooting photos | 🟡 Partiel (25/33 faits, 8 accessoires restants) |
| 6 | Génération images + upload | 🟡 25/33 images générées (output_batch_bisous) |
| 7–8 | Contrôle qualité + clôture | ⏳ |

**Données** : 33 produits, 101 variants, collection SS26. Marque = `Bisous Skateboards`.
**Catégories** : collier chien / laisse chien / porte clefs / autre → fusionnés dans `accessoires`.
**Batch** : `./rcli images generate-batch --input-dir "/chemin/BISOUS SKATEBOARD" -o ./output_batch_bisous --refs-dir refs_empty --gemini-flash --flash-attempts 4 --skip-existing --delay 30`

---

## Collections suivantes (template)

Pour chaque **nouvelle collection** (ou nouvelle marque), réutiliser la même structure en 8 phases :

1. **Setup initial** : Politiques, catégories, marque  
2. **Préparation des données** : Feuille/CSV → format → fusion  
3. **Base de données** : Wipe (si besoin), catégories, import Admin  
4. **Vérification post-import** : `db ref` sur un échantillon, corrections  
5. **Shooting & préparation photos** : Lieu, matériel, dossiers, prises de vues  
6. **Génération & upload images** : Par ref, generate → upload (ou workflow classique)  
7. **Contrôle qualité** : Admin + front  
8. **Clôture** : Checklist données + images + config  

On pourra ajouter ici des sections « Collection 2 : … », « Collection 3 : … » en dupliquant ce canevas et en cochant étape par étape.

---

## Références rapides

| Besoin | Commande / doc |
|--------|----------------|
| Import données, format CSV | `docs/COLLECTION_REAL.md`, `docs/context/FEUILLES_STOCK_REBOUL.md` |
| Feuille → CSV | `./rcli import feuille-to-csv -i ... -o ... --collection X --stock N --price P` |
| Fusion pages | `./rcli import merge-pages -i p1.csv -i p2.csv -o merged.csv` |
| Wipe collection | `./rcli db wipe-products-by-collection -c SS26 -y` |
| Créer catégorie | `./rcli db category-create -n "nom" -y` |
| Vérifier une ref | `./rcli db ref <REF>` |
| Images IA (generate) | `./rcli images generate --input-dir photos -o output/` |
| Images IA (upload) | `./rcli images upload --ref <REF> --dir output/` |
| Workflow images classique | `docs/integrations/IMAGES_WORKFLOW.md` |
| Pipeline IA détaillé | `docs/integrations/IMAGES_PRODUIT_PIPELINE.md`, `docs/integrations/IMAGES_IA_WORKFLOW.md` |
| Roadmap principale | `docs/context/ROADMAP_COMPLETE.md` |
