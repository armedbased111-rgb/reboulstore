# 🗺️ Roadmap Complète - Reboul Store Platform

**Version** : 4.5 · Dernière MAJ : 15/02/2026

---

## 📍 OÙ J'EN SUIS

| Info | Valeur |
|------|--------|
| **Phase actuelle** | **Phase 25** (Finalisation Frontend reboulstore.com – revue page par page) |
| **Dernière phase clôturée** | Phase 24 ✅ (15/02/2026) |
| **Prochaine tâche** | **25.1** Passer en revue Home.tsx (améliorations, idées, manques → puis implémentation) |
| **Puis** | 25.2 Checkout · 25.3 Catalog · 25.4 Product · … (voir liste Phase 25) |
| **Collections** | Suivi à part : `docs/context/COLLECTIONS_ROADMAP.md` (refs, photos, politiques, marque par marque) |

**Objectif** : Site Reboul (enfants) prêt à la vente + Admin Centrale connectée. CP Company & Outlet après lancement.

---

## 📋 Sommaire des phases

| Phase | Intitulé | Statut |
|-------|----------|--------|
| 1–23 | Infra, auth, commandes, Stripe, Admin, SEO, prod | ✅ Complétées |
| **24** | Préparation collection réelle (données, images, CLI, Claude) | ✅ **Clôturée** 15/02/2026 |
| **25** | Finalisation Frontend reboulstore.com (revue page par page) | 🟡 **En cours** |
| **26** | Sécurité backend & DB, VPS, tests API, Stripe (routes paiement) | 🔜 À faire |
| 27+ | Post-lancement (analytics, marketing, support) | 🔜 À planifier |

---

## 🎯 Principes

Backend ↔ Frontend alternés · Fonctionnalités complètes livrées à chaque phase · MVP first · Multi-sites (3 shops + 1 Admin). Figma avant code. Architecture : `docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md`.

---

## Phases 1 à 23 : Complétées (résumé)

- **1-8, 8.5** : Infra (Docker, NestJS, React), catalogue, brands, vidéo/image.
- **9-10** : Auth (JWT, register/login, front auth UI).
- **11-12** : Commandes, panier & checkout.
- **13-14.6** : Stripe, historique commandes, page produit, animations.
- **15-16** : Cloudinary, Admin & permissions.
- **17** : Admin Centrale (frontend, multi-sites UI, Docker prod, déploiement, tests E2E).
- **18-23** : Fonctionnalités avancées, SEO, tests, déploiement production.

Détail historique conservé en archive si besoin.

---

## 📦 Phase 24 : Préparation Collection Réelle ✅

**Clôturée le 15/02/2026.** Workflow collection : données (feuilles → CSV → import Admin) + images (pipeline IA `./rcli images generate/upload`). Reste en suivi Phase 25 : politique livraison (24.3), validation E2E images (24.7), checklist (24.9).

---

### 📋 Vue d’ensemble des sous-phases

| # | Sous-phase | Statut | Note |
|---|------------|--------|------|
| 24.1 | Documentation & Contexte | ✅ Terminé | COLLECTION_REAL, FEUILLES_STOCK, IMAGES_WORKFLOW, etc. |
| 24.2 | Marques avec Logos | ✅ Terminé | 57 marques, logos Cloudinary, BrandCarousel, BrandMarquee |
| 24.3 | Politique Livraison Finale | 🔜 Phase 25 | Réunion magasin → config Shop |
| 24.4 | Rotation Collections | ✅ Terminé | Actif/archivée, nouvelle collection remplace l’ancienne |
| 24.5 | AS400 | ⚠️ Suspendu | Approche manuelle adoptée |
| **24.5bis** | **Import collections (feuilles → CSV → Admin)** | ✅ **Terminé** | **Workflow en place** : feuille-to-csv, merge-pages, wipe, categories, import Admin. Réfs vérifiables avec `db ref`. |
| 24.6 | CLI DB (Reference Finder, édition, export) | ✅ Terminé | `db ref`, product-list, variant-list, set-stock, export-csv, etc. |
| **24.7** | **Workflow Images Produits** | 🔜 Phase 25 | Doc + optimisation/cron en place ; validation E2E → Phase 25. |
| 24.8 | Ajout continu produits | ✅ Couvert par 24.5bis | Même processus : nouvelle feuille/CSV → merge si besoin → import. |
| 24.9 | Checklist finale – Validation collection | 🔜 Phase 25 | Une fois données + images validées. |
| 24.10 | Évolution Images IA (Nano Banana / Gemini) | ✅ Pipeline en place | Photos brutes → generate (4 vues) → upload Cloudinary par ref. Voir `IMAGES_PRODUIT_PIPELINE.md`. |
| **24.11** | **Plan Claude Code** | ✅ Setup terminé | Étapes 1–8 faites ; 9–10 en suivi Phase 25 (batch images, roadmap, commits). |

**Décisions** : Import = feuilles → CSV → merge → wipe/categories → Admin. Pas d'AS400. Marques = 57 + logos Cloudinary. Images = retouche + Cloudinary + cron WebP ; IA en 24.10. Stocks = manuel.

---

### Détail des sous-phases (référence)

- **Import données** : Feuilles de stock → CSV (format BDD) → fusion des pages (déduplication) → wipe collection optionnel → création catégories (CLI) → import Admin. Pas d’AS400 pour l’instant.
- **Marques** : 57 marques avec logos (Cloudinary). Affichage front (BrandCarousel, BrandMarquee).
- **Images** : Shooting + retouche + Cloudinary + optimisation WebP (cron). Évolution IA (photos brutes → studio) à explorer après abo (24.10).
- **Stocks** : Gestion manuelle ; alertes réassort (0–5 unités) optionnel.

#### 24.1 Documentation & Contexte

**Objectif** : Créer toute la documentation nécessaire pour ce processus spécifique

- [x] **Nouveau document principal** : `docs/COLLECTION_REAL.md` ✅
  - [x] Workflow complet d'intégration collection réelle ✅
  - [x] Mapping données tables/CSV → notre structure ✅
  - [x] Processus validation données ✅
  - [x] Checklist qualité données ✅
  - [x] Guide import manuel via Admin (entrée collection par collection) ✅

- [ ] **Documentation AS400** : `docs/AS400_INTEGRATION.md` ⚠️ **EN SUSPENS**
  - [x] Structure tables AS400 explorée (voir `docs/AS400_ANALYSIS_GUIDE.md`) ✅
  - [ ] Structure tables AS400 (schéma, champs) - À compléter si reprise
  - [ ] Méthode de connexion/extraction (export CSV, API, dump SQL) - À compléter si reprise
  - [ ] Transformation des données (mapping champs) - À compléter si reprise
  - [ ] Validation et nettoyage données - À compléter si reprise
  - **Note** : AS400 en suspens (trop de temps). Approche manuelle adoptée.

- [x] **Documentation Images** : `docs/IMAGES_WORKFLOW.md` ✅
  - [x] Workflow création images produits (comment tu les fais) ✅
  - [x] Standards qualité (résolution, formats, nommage) ✅
  - [x] Organisation fichiers (structure dossiers) ✅
  - [x] Processus upload (manuel vs automatisé) ✅
  - [x] Optimisation images (compression, formats WebP) ✅
  - [x] Documentation cron job optimisation (`docs/IMAGES_OPTIMIZATION_CRON.md`) ✅
  - [x] Documentation compatibilité WebP (`docs/IMAGES_WEBP_COMPATIBILITY.md`) ✅

- [x] **Nouvelles commandes Cursor** : ✅
  - [x] `/collection-workflow` : Guide workflow collection réelle ✅
  - [x] `/as400-integration` : Guide intégration AS400 ✅
  - [x] `/images-workflow` : Guide workflow images produits ✅ (déjà existait)

- [x] **Nouvelles règles project-rules.mdc** : ✅
  - [x] Section "Workflow Collection Réelle" ✅
  - [x] Section "Intégration AS400" ✅
  - [x] Section "Workflow Images Produits" ✅

#### 24.2 Insertion Marques avec Logos ✅

**Objectif** : Ajouter toutes les marques de la collection réelle avec leurs logos

**📊 Informations** : 36 marques (enfants + adultes), logos depuis ancien git de reboul (récupération manuelle)

**✅ STATUT : TERMINÉ ET FONCTIONNEL**

- [x] **Backend** : ✅
  - [x] Identifier toutes les marques de la collection réelle (57 marques trouvées) ✅
  - [x] Récupérer dossier logos depuis ancien git de reboul ✅
  - [x] Vérifier formats et optimiser si nécessaire ✅
  - [x] Préparer logos (formats, tailles, optimisation) ✅
  - [x] Créer script seed ou import CSV pour marques ✅
  - [x] Upload logos sur Cloudinary (56 logos uploadés) ✅
  - [x] Insérer marques en base via script (57 marques créées) ✅

- [x] **Admin** :
  - [x] Vérifier interface Brands fonctionne bien ✅
  - [x] Améliorer affichage logos (afficher images au lieu d'icônes) ✅
  - [x] Interface complète : liste, recherche, pagination, CRUD ✅
  - [x] Tester upload logo via Admin (à tester manuellement) ✅
  - [x] Vérifier affichage logos dans navigation frontend (si applicable) ✅

- [x] **Frontend** :
  - [x] Composant BrandCarousel créé pour homepage ✅
  - [x] Intégré dans Home.tsx avec animation scroll ✅
  - [x] Style aligné avec autres titres homepage (text-2xl md:text-3xl lg:text-4xl) ✅
  - [x] Composant BrandMarquee créé (barre publicitaire avec logos blancs défilants) ✅
  - [x] BrandMarquee intégré dans Layout.tsx (attaché au Header, sticky) ✅
  - [x] Logos blancs (_w) utilisés dans BrandMarquee (fond noir) ✅
  - [x] Uniformisation taille logos BrandMarquee (maxHeight: 24px, maxWidth: 80px) ✅
  - [x] Défilement automatique continu (animation CSS marquee) ✅

- [x] **Validation** :
  - [x] Vérifier toutes marques présentes (57 marques en base) ✅
  - [x] Vérifier logos affichés correctement (Admin) ✅
  - [x] Vérifier endpoints backend fonctionnent ✅
  - [x] Composant BrandCarousel créé et intégré dans Homepage ✅
  - [x] Logos noirs (_b) utilisés pour fond blanc (BrandCarousel) ✅
  - [x] BrandMarquee fonctionnel avec défilement automatique ✅
  - [x] Vérifier filtres par marque fonctionnent (frontend - si applicable) ✅
  - [x] Tester BrandCarousel manuellement (affichage, navigation, liens) ✅
  - [x] Tester BrandMarquee manuellement (défilement, logos blancs, sticky) ✅

#### 24.3 Politique Livraison Finale

**Objectif** : Définir et configurer les politiques de livraison finales avec l'équipe Reboul

- [ ] **Réunion avec équipe Reboul** (en magasin) :
  - [ ] Définir frais livraison (standard, express)
  - [ ] Définir seuil livraison gratuite
  - [ ] Définir délais livraison
  - [ ] Définir zones de livraison (si applicable)
  - [ ] Définir politique retour (délai, frais, conditions)
  - [ ] Noter toutes les réponses dans `docs/PHASE_24_FAQ_MAGASIN.md`

- [ ] **Configuration Backend** :
  - [ ] Mettre à jour Shop entity avec politiques finales
  - [ ] Vérifier calcul livraison dans checkout
  - [ ] Tester différents scénarios (sous/seuil gratuit, express, etc.)

- [ ] **Configuration Admin** :
  - [ ] Vérifier page Settings permet bien configuration
  - [ ] Tester modification politiques depuis Admin

- [ ] **Affichage Frontend** :
  - [ ] Vérifier affichage frais livraison (panier, checkout)
  - [ ] Vérifier messages livraison gratuite
  - [ ] Vérifier page politique retour affichée correctement

#### 24.4 Système Rotation Collections ✅

**Objectif** : Gérer le passage d'une collection à l'autre (actif/archivée)

**📊 Informations** : Première sortie = nouvelle collection uniquement. Quand nouvelle collection arrive, ancienne → archivée, nouvelle → active

**⚠️ IMPORTANT** : À faire AVANT l'import AS400 (24.5) pour assigner une collection aux produits importés

**✅ STATUT : TERMINÉ ET TESTÉ**

- [x] **Backend** :
  - [x] Créer entité Collection (name, displayName, isActive, description)
  - [x] Ajouter champ collectionId sur entité Product (relation ManyToOne)
  - [x] Créer migration TypeORM (table collections + colonne collectionId dans products)
  - [x] Créer module Collections (service, controller, DTOs)
  - [x] Endpoints REST complets : GET, POST, PATCH, DELETE, activate, archive
  - [x] Modifier ProductsService pour filtrer automatiquement par collection active
  - [x] Assignation automatique à la collection active lors de création produit
  - [x] Migration données existantes (assigner collection initiale "current")
  - [x] **Tests validés** ✅ :
    - [x] Création collections
    - [x] Rotation collections (activer/désactiver)
    - [x] Filtrage produits par collection active
    - [x] Assignation automatique nouveau produit
    - [x] Gestion erreurs (archiver/supprimer collection active)

- [x] **Admin** :
  - [x] Créer entité Collection dans admin backend
  - [x] Ajouter champ collectionId dans entité Product (admin backend)
  - [x] Créer service reboul-collections.service.ts (admin backend)
  - [x] Créer controller reboul-collections.controller.ts (admin backend)
  - [x] Ajouter Collection dans reboul.module.ts
  - [x] Créer service reboul-collections.service.ts (admin frontend)
  - [x] Créer page CollectionsPage.tsx (liste, activer, archiver, supprimer)
  - [x] Ajouter route dans App.tsx
  - [x] Ajouter onglet "Collections" dans AdminNavigation.tsx
  - [x] **Tests validés** ✅ :
    - [x] Admin backend démarre correctement
    - [x] Endpoints Collections enregistrés (GET, POST, PATCH, DELETE, activate, archive)
    - [x] Admin frontend accessible
  - [ ] Voir produits par collection (optionnel, à faire si besoin)
  - [ ] Filtrer produits par collection dans Admin (optionnel, à faire si besoin)

- [x] **Frontend** :
  - [x] Filtrage automatique par collection active (côté backend, pas besoin de modification frontend)
  - [x] Composant BrandCarousel créé pour homepage ✅
  - [x] Intégré dans Home.tsx avec animation scroll ✅
  - [ ] Optionnel : Page "Archives" pour voir anciennes collections

- [x] **Validation** :
  - [x] Tester rotation collections (activer/archiver) ✅
  - [x] Vérifier produits archivés masqués (0 produits retournés si collection inactive) ✅
  - [x] Vérifier produits actifs visibles (produits retournés si collection active) ✅

#### 24.5 Intégration AS400 - Transformation Données ⚠️ **EN SUSPENS**

**Objectif** : Récupérer données magasin AS400, transformer et intégrer dans notre base

**⚠️ STATUT** : **EN SUSPENS** - Trop de temps nécessaire. Approche alternative adoptée (import manuel via tables/CSV - voir 24.5bis)

**📊 Informations** : Exploration AS400 effectuée (voir `docs/AS400_ANALYSIS_GUIDE.md`), mais intégration automatique suspendue

#### 24.5.1 Analyse & Mapping AS400

**📊 Informations** : Exploration effectuée en magasin, structure identifiée mais pas d'export CSV direct disponible

- [ ] **Journée en magasin** (prévue) :
  - [ ] Analyser tables AS400 disponibles (produits, stocks, marques, catégories)
  - [ ] Documenter schéma AS400 (champs, types, relations)
  - [ ] Identifier méthode extraction (export CSV, connexion directe, dump SQL, API)
  - [ ] Identifier accès AS400 (VPN, accès distant, personne responsable)

- [ ] **Compréhension structure AS400** :
  - [ ] Analyser tables AS400 disponibles (produits, stocks, marques, catégories)
  - [ ] Documenter schéma AS400 (champs, types, relations)
  - [ ] Identifier méthode extraction (export CSV priorité, évaluer autres options)

- [ ] **Mapping données** :
  - [ ] Table produits AS400 → notre entité Product
    - [ ] Champs AS400 probablement : nom, taille, couleur, stock, prix
    - [ ] Champs à compléter manuellement : descriptions, matériaux, instructions d'entretien, pays de fabrication
  - [ ] Table stocks AS400 → notre entité Variant (stock)
  - [ ] Table marques AS400 → notre entité Brand
  - [ ] Table catégories AS400 → notre entité Category
  - [ ] Identifier transformations nécessaires (formats, valeurs, normalisations)
  - [ ] Gérer variants complexes (couleurs multiples, tailles différentes selon marques)

- [ ] **Documenter mapping** :
  - [ ] Créer tableau de correspondance AS400 → notre DB
  - [ ] Documenter règles de transformation
  - [ ] Documenter valeurs par défaut si données manquantes

#### 24.5.2 Processus Transformation

- [ ] **Script transformation** :
  - [ ] Créer script Node.js/Python pour lire données AS400
  - [ ] Implémenter transformations (normalisation, nettoyage)
  - [ ] Validation données (champs requis, formats, contraintes)
  - [ ] Générer erreurs/warnings si données invalides

- [ ] **Format intermédiaire** :
  - [ ] Créer format JSON/CSV intermédiaire (après transformation)
  - [ ] Permettre review manuelle avant import
  - [ ] Prévisualiser données transformées

#### 24.5.3 Import Données

- [ ] **Script import** :
  - [ ] Créer script import données transformées
  - [ ] Gérer création produits (avec vérification doublons)
  - [ ] **Assigner collection active** aux produits importés (dépend de 24.4)
  - [ ] Gérer création variants avec stocks
  - [ ] Gérer création/association marques et catégories
  - [ ] Gérer images (association après upload)

- [ ] **Validation import** :
  - [ ] Logs détaillés (produits créés, erreurs, warnings)
  - [ ] Rapport post-import (statistiques)
  - [ ] Vérification données importées (échantillonnage)

#### 24.5bis Import Manuel Collections via Tables/CSV ✅

**Objectif** : Importer les collections reçues une à une sous forme de table (Excel/CSV) via l’Admin. **C’est le cœur du workflow « ajout de collection »** : en amont, feuilles de stock → CSV (CLI `feuille-to-csv`), fusion de pages (`merge-pages`), wipe + catégories si besoin ; en aval, vérification des refs avec `./rcli db ref <REF>`.

**📊 Statut** : **Fonctionnel** (référence = source de vérité, doublons bloqués ; import Stone à finaliser par l'utilisateur)

**📊 Informations** : Collections reçues une à une sous forme de table, entrée manuelle des données une à une

- [x] **Préparation format données** :
  - [x] Définir format table/CSV attendu (colonnes, structure)
  - [x] Créer template Excel/CSV pour faciliter la préparation des données
  - [x] Documenter mapping colonnes table → notre structure DB

- [x] **Interface Admin - Import Collection** :
  - [x] Créer page Admin pour import collection (upload fichier CSV/Excel)
  - [x] Parser fichier CSV/Excel (validation format, délimiteur ; ou ,)
  - [x] Prévisualisation données avant import
  - [x] Validation données (champs requis, formats, contraintes)
  - [x] **Référence produit = source de vérité** (obligatoire, unicité ; SKU dérivé automatiquement)
  - [x] **Détection doublons** : même référence en double → erreur bloquante (ex. L100001-V09A-29 deux fois)
  - [x] Gestion erreurs (afficher lignes avec erreurs)

- [x] **Processus import** :
  - [x] Créer produits depuis données table (regroupement par référence de base, pas par nom seul)
  - [x] **Assigner collection active** aux produits importés (dépend de 24.4 ✅)
  - [x] Créer variants avec stocks (taille, couleur, stock) — ordre trié (tailles numériques puis lettres)
  - [x] Référence produit sans taille (ref base uniquement)
  - [x] Gérer création/association marques et catégories
  - [ ] Gérer images (association après upload - voir 24.7)

- [x] **Workflow entrée manuelle** :
  - [x] Processus validation avant publication
  - [ ] Guide étape par étape pour entrer une collection (optionnel)
  - [ ] Checklist qualité données avant import (optionnel)

- [x] **Documentation** :
  - [x] Documenter workflow import manuel
  - [x] Template Excel/CSV avec exemples
  - [ ] Créer guide utilisation Admin pour import (optionnel)

- [x] **Validation** :
  - [x] Tester import collection complète (ex. Stone Island SS26 : 7 pages fusionnées, 69 produits, 332 variants — OK)
  - [x] Vérifier produits créés correctement (réf sans taille, 1 produit par ref)
  - [x] Vérifier variants et stocks (ordre tailles correct)
  - [x] Vérifier association marques/catégories
  - [x] Workflow complet documenté dans `docs/context/FEUILLES_STOCK_REBOUL.md` (feuille-to-csv, merge-pages, wipe, category-create, import Admin, vérif avec `db ref`)

#### 24.6 Interface CLI Base de Données

**Objectif** : Disposer d’une interface CLI dédiée à la base Reboul (lecture/inspect + petites opérations encadrées) pour aller plus vite que via l’Admin, tout en respectant les règles DB (VPS uniquement + backup auto avant opérations risquées).

- [x] **24.6.1 Design CLI DB**
  - [x] Lister les cas d’usage prioritaires (lecture produits/variants/stocks, recherche par **référence produit**, inspection commandes/paniers, check cohérence séquences, etc.)
  - [x] Valider qu’on réutilise `./rcli` et la connexion actuelle (SSH / VPS, jamais DB locale)
  - [x] Définir la convention de commandes `./rcli db ...` avec :
    - [x] Recherche par **référence produit** (`--ref`) en priorité
    - [x] Support `--id` et `--sku` en option
  - [x] Séparer clairement commandes **lecture** vs commandes **mutantes** (qui exigeront backup + confirmation)

- [x] **24.6.2 Commandes lecture (read-only) – MVP** ✅
  - [x] `product-find --ref REF` / `--id ID` / `--sku SKU` → un produit
  - [x] `product-list --brand "Stone Island"` [--collection] [--limit] → liste produits par marque/collection + résumé variants (taille min→max, stock)
  - [x] `variant-list --product-id ID` / `--ref REF` → variants d’un produit (id, sku, size, color, stock)
  - [x] `check-sequences` → séquences critiques (carts, orders, products)
  - [x] Tables Rich + `--json`

- [x] **24.6.3 Commandes d’édition encadrée** ✅
  - [x] Stock : `variant-set-stock`, `product-set-all-stock`
  - [x] Couleur : `variant-set-color`, `product-set-all-color`
  - [x] Taille : `variant-set-size`
  - [x] Ajout / suppression : `variant-add`, `variant-delete`
  - [x] Prix produit : `product-set-price`
  - [x] `product-set-active` (colonne `is_published`)
  - [x] Backup auto + confirmation (`--yes` / prompt) pour toutes les commandes mutantes

- [x] **24.6.4 Intégration CLI & docs** ✅
  - [x] `docs/context/DB_CLI_USAGE.md` (guide complet)
  - [x] Sous-section “Interface CLI DB” dans `docs/context/CONTEXT.md`
  - [x] Commande Cursor `/db-cli-workflow` à jour
  - [x] `project-rules.mdc` : rappel VPS + backup obligatoire avant actions CLI risquées
  - [ ] Optionnel : documenter dans `cli/CONTEXT.md` / `cli/RECAPITULATIF.md` (déjà résumé dans RECAP base de données)

- [x] **24.6.5 Compléter le CLI DB (optionnel – pour clôturer 24.6 à 100 %)** ✅
  - [x] **product-set-active** : colonne `is_published` alignée (migration + entité), commande finalisée
  - [x] **Édition produit** : `product-set-name`, `product-set-ref`, `product-set-category`, `product-set-brand`, `product-set-collection`
  - [x] **Inspection commandes / paniers** : `order-list` (--last N), `order-detail --id <ID>`, `cart-list` (--last N)
  - [x] **Export CSV** : `export-csv --brand "X"` [--collection Y] [--output file.csv] (une ligne par variant)

Phase 24.6 CLI DB considérée terminée à 100 %.

#### 24.7 Workflow Images Produits

**Objectif** : Finaliser le processus de création/upload images produits. **C’est le dernier bloc à boucler pour avoir le workflow « ajout de collection » complet** : données ✅, images à valider.

#### 24.7.1 Documentation Workflow Images

**📊 Informations** : Shooting à Aubagne au stock, récupération matériel chez le patron, setup complet ensemble, retouche Photoshop, stockage Cloudinary, 3-5 images/produit

- [x] **Entretien avec toi** :
  - [x] Comprendre comment tu fais les images produits actuellement (shooting à Aubagne, retouche Photoshop)
  - [x] Identifier étapes du processus (récupération matériel → setup → shooting → retouche → nommage → upload)
  - [ ] Identifier points d'amélioration/automatisation
  - [ ] Définir standards qualité

- [x] **Documenter workflow** :
  - [x] Créer guide complet dans `docs/IMAGES_WORKFLOW.md` ✅
  - [x] Étapes détaillées (shooting à Aubagne, retouche Photoshop, nommage, upload Cloudinary) ✅
  - [x] Standards qualité (résolution: 2048px, poids: 200-300KB, formats: JPG/PNG) ✅
  - [x] **Convention nommage fichiers** : `[SKU]_[numero]_[type].jpg` ✅
  - [x] Structure dossiers/organisation : `products/[collection]/[sku]/` ✅
  - [x] Quantité : 3-5 images par produit ✅

#### 24.7.2 Optimisation & Automatisation

- [x] **Optimisation images** :
  - [x] Script compression automatique (WebP, optimisation taille) ✅
  - [x] Batch processing (traiter plusieurs images) ✅
  - [x] Génération thumbnails automatique (via Cloudinary) ✅
  - [ ] Watermarking (si nécessaire) - **Optionnel**

- [x] **Automatisation upload** :
  - [x] Script batch upload (dossier → Cloudinary) ✅
  - [x] Association automatique images → produits (par nommage SKU) ✅
  - [x] Vérification qualité avant upload (résolution min, poids max) ✅
  - [x] Documentation scripts (`backend/scripts/README_IMAGES.md`) ✅

- [x] **Interface Admin améliorée** :
  - [x] Upload multiple images ✅
  - [x] Drag & drop ✅
  - [x] Prévisualisation avant upload ✅
  - [x] Ordre images (flèches haut/bas pour réordonner) ✅

- [x] **Cron Job Optimisation Automatique** :
  - [x] Module ImagesOptimization créé ✅
  - [x] Service d'optimisation (JPG/PNG → WebP via Cloudinary) ✅
  - [x] Cron job quotidien (3h) : nouvelles images 24h ✅
  - [x] Cron job hebdomadaire (dimanche 4h) : toutes les images ✅
  - [x] Endpoints manuels pour déclencher l'optimisation ✅
  - [x] Documentation (`docs/IMAGES_OPTIMIZATION_CRON.md`) ✅
  - [x] Module ajouté dans AppModule ✅
  - [x] @nestjs/schedule installé ✅
  - [x] **Tests validés** ✅ :
    - [x] Backend démarre correctement
    - [x] Endpoints fonctionnels (optimize-all, optimize-new)
    - [x] Compatibilité WebP vérifiée (frontend + API)
  - [x] Documentation compatibilité WebP (`docs/IMAGES_WEBP_COMPATIBILITY.md`) ✅
  - [x] **Note** : Script `optimize-images.ts` nécessite `sharp` (optionnel, pour optimisation locale avant upload) - Déplacé dans `/scripts/` ✅

- [ ] **Validation** :
  - [ ] Vérifier workflow fonctionne end-to-end
  - [ ] Vérifier qualité images sur site
  - [ ] Vérifier performance chargement
  - [ ] Tester cron job optimisation

- **Évolution prévue** : voir **24.10 Évolution Images IA** (photos brutes → images studio + mannequin IA, après abo Nano Banana / Gemini).

#### 24.10 Évolution Images IA (Nano Banana / Gemini) – après abonnement

**Objectif** : Explorer, **doucement**, la génération / amélioration d’images IA (photos brutes → images produit type studio, détails, mannequin IA sans visage). Pas de pression : on avance étape par étape après abo.

**Suivi** : La roadmap est mise à jour à chaque tâche faite. Doc de suivi détaillé : `docs/integrations/IMAGES_IA_WORKFLOW.md`. **Récap pipeline (3 étapes)** : `docs/integrations/IMAGES_PRODUIT_PIPELINE.md`.

**État actuel (dernière MAJ)** : **Pipeline images IA validé.** (1) Photos brutes dans `photos/`, refs de style dans `refs/` (refs = style uniquement, pas le produit). (2) `./rcli images generate` (Gemini 3 Pro par défaut) → 4 vues ; les vues 3 et 4 s’appuient sur la 1_face générée comme source de vérité (même vêtement). (3) Optionnel : `./rcli images adjust` avec `--ref` pour recaler les couleurs d’une vue sur une autre. (4) `./rcli images upload --ref REF --dir output/` (Cloudinary + BDD). Préconisations prise de vue (couleurs, produit) dans `IMAGES_IA_WORKFLOW.md`. Récap dans `IMAGES_PRODUIT_PIPELINE.md`.

---

**Vision** (à long terme) :
- Prises de vues brutes au magasin (règles documentées dans `IMAGES_IA_WORKFLOW.md`).
- **Pipeline** : 1 photo brute (face, + optionnel dos) → script → **3–4 images** (face, dos, détail logo, lifestyle).
- **Intégration** : script CLI (`./rcli` ou dédié) qui appelle l’API Nano Banana.

**Plan pipeline + intégration (ordre)** :
1. **Récupérer la clé API Gemini** (https://aistudio.google.com/apikey — gratuit, pas de waitlist).
2. **Script CLI** : client API Gemini (image + prompt → image), puis enchaîner les 4 prompts validés → 3–4 images (face, dos si fourni, détail logo, lifestyle).
3. **Commande** : ex. `./rcli images generate --face photo.jpg [--back photo_dos.jpg] -o ./output`.
4. Doc d’usage dans `IMAGES_IA_WORKFLOW.md`.

---

**Tâches (cocher au fur et à mesure)** :

*Phase 1 – Préparation*
- [x] Choisir et souscrire abonnement → **Nano Banana Pro acheté**
- [x] Décider Nano Banana vs Gemini → **Nano Banana en priorité**
- [x] Documenter vision, options, premier pas → `IMAGES_IA_WORKFLOW.md`
- [x] Premier test manuel fond studio réussi
- [x] Valider 4 prompts (face, dos, détail logo, lifestyle) → sauvegardés dans `IMAGES_IA_WORKFLOW.md`
- [x] Définir règles de prise de vues → documentées dans `IMAGES_IA_WORKFLOW.md`
- [x] Décider où intégrer → **script CLI** (1 photo → 3–4 images)

*Phase 2 – Pipeline + script CLI (API Gemini)*
- [x] Récupérer clé API **Gemini** (https://aistudio.google.com/apikey) et la mettre dans `.env` (`GEMINI_API_KEY=...`)
- [x] Implémenter client API Gemini (image + prompt → image, modèle `gemini-2.5-flash-image`)
- [x] Enchaîner les 4 vues : face, dos (si photo dos fournie), détail logo, lifestyle → sortie 3–4 fichiers
- [x] Exposer en commande CLI : `./rcli images generate --face photo.jpg [--back photo_dos.jpg] -o ./output`
- [x] Documenter usage dans `IMAGES_IA_WORKFLOW.md`
- [x] Mode dossier : lecture auto de `photos/` (face.jpg, back.jpg) et `refs/` (1_face.png, …)
- [x] Images de référence : option refs/ + `gemini-3-pro-image-preview` pour les vues avec ref

*Phase 3 – Améliorations (stabilité / qualité)*
- [x] Stabiliser vue lifestyle : retry auto si pas d’image + gemini-3-pro pour cette vue
- [x] 1_face générée comme source de vérité pour vues 3 et 4 (même vêtement)
- [x] images adjust --ref pour caler couleurs sur une image de référence
- [ ] Optionnel : tout en gemini-3-pro ; prompts structurés ; phrase « same lighting » ; multi-turn (backlog)

*Phase 4 – Upload Cloudinary et rattachement produit*
- [x] Commande `./rcli images upload --ref REF --dir output/` : récupération id produit par ref, envoi bulk au backend, images attachées au produit (Cloudinary + BDD)
- [x] Doc récap pipeline : `docs/integrations/IMAGES_PRODUIT_PIPELINE.md` (photos brutes → generate → upload)

**Note** : Nano Banana retenu pour 24.10. Les 4 prompts et les règles de prise de vues sont la base du pipeline.

#### 24.11 Plan Claude Code – étape par étape

**Objectif** : Intégrer **Claude Code** (terminal + contexte projet) pour clôturer la Phase 24 et accompagner la Phase 25. Contexte détaillé : `docs/context/CLAUDE_CODE_CURSOR_CONTEXT.md`. Fichier lu par Claude dans le repo : `CLAUDE.md` (racine).

**État** : **Setup complet (étapes 1–8) terminé.** Phase 24 clôturée. Étapes 9–10 = usage au fil de l’eau (batch images, roadmap, commits) en Phase 25.

**À cocher au fur et à mesure** :

*Étape 1 – Installation et connexion*
- [x] Installer Claude Code : `curl -fsSL https://claude.ai/install.sh | bash` (ou `brew install --cask claude-code`)
- [x] Lancer `claude` puis `/login` ; vérifier que le compte est bien connecté
- [ ] Vérifier la version : `claude --version` (ou équivalent selon doc officielle)

*Étape 2 – Contexte projet*
- [x] Vérifier que `CLAUDE.md` existe à la racine du projet (résumé projet, règles DB/déploiement, CLI, références)
- [x] Lire `docs/context/CLAUDE_CODE_CURSOR_CONTEXT.md` (vision Cursor vs Claude Code, workflows, setup)
- [x] Dans le repo : `claude -p "what does this project do?"` → réponse cohérente avec Reboul Store / Phase 24–25

*Étape 3 – Vérification CLI*
- [x] `claude -p "list the main ./rcli command groups"` → doit mentionner db, images, roadmap, docs, server
- [x] `claude -p "how do I generate product images from raw photos?"` → doit décrire `./rcli images generate` et pipeline (photos/ → output/ → upload)
- [x] Demander à Claude : « Run ./rcli images --help and summarize » → exécution correcte et résumé des sous-commandes

*Étape 4 – Première tâche concrète (DB)*
- [x] Donner une ref produit (ex. d’une feuille de stock) et demander : « Vérifie si ce produit existe en base avec ./rcli db ref REF »
- [x] Vérifier que Claude exécute la commande et interprète le résultat (produit trouvé ou non, variants, stocks)

*Étape 5 – Première tâche concrète (images IA)*
- [x] Préparer un dossier `photos/` avec au moins une photo test + `refs/` si besoin
- [x] Demander à Claude : « Run ./rcli images generate --input-dir photos -o output/ and tell me the result »
- [x] Vérifier que les 4 fichiers sortent dans `output/` ; si oui, demander : « Now run ./rcli images upload --ref REF --dir output/ (with a real product ref) » (backend doit tourner)

*Étape 6 – Roadmap et doc*
- [x] Demander : « Update ROADMAP_COMPLETE.md to check the task "24.11 Plan Claude Code – étape par étape" for the steps we just completed »
- [x] Ou : « Run ./rcli roadmap update --task "24.11 Plan Claude Code" » (si une tâche unique existe côté CLI)
- [x] Demander : « Run ./rcli docs sync » et vérifier que la doc est synchronisée

*Étape 7 – Git*
- [x] Demander : « What files have I changed? » puis « Commit my changes with a descriptive message (feat: add Claude Code plan and context) »
- [x] Vérifier que le message suit les conventions (type(scope): message)

*Étape 8 – Règles critiques (vérification)*
- [x] Demander : « Before running a database migration, what should we do? » → doit mentionner backup (./rcli db backup --server)
- [x] Demander : « Can we run docker compose down -v on this project? » → doit répondre non (risque volumes DB)

*Étape 9 – Clôture Phase 24 avec Claude*
- [ ] Utiliser Claude pour batch images : liste de refs → pour chaque ref, `db ref` puis si OK `images generate` (depuis photos dédiées) puis `images upload`
- [ ] Utiliser Claude pour cocher les tâches 24.7 / 24.9 / 24.11 dans la roadmap quand les critères sont remplis
- [ ] Utiliser Claude pour `./rcli docs sync` après chaque grosse avancée

*Étape 10 – Phase 25 (support)*
- [ ] Après chaque livrable Phase 25 (recherche, Home, SEO, etc.) : demander à Claude de mettre à jour la roadmap et lancer `./rcli docs sync`
- [ ] Utiliser Claude pour commits conventionnels et résumés de changements
- [ ] Optionnel : demander à Claude de vérifier les refs d’une feuille de stock avec `db ref` avant import

**Références** : `CLAUDE.md`, `docs/context/CLAUDE_CODE_CURSOR_CONTEXT.md`, `docs/integrations/IMAGES_PRODUIT_PIPELINE.md`, `docs/context/DB_CLI_USAGE.md`.

#### 24.8 Ajout continu produits

**Objectif** : Pouvoir ajouter de nouvelles collections ou nouveaux produits en continu.

**📊 Statut** : **Couvert par le workflow 24.5bis.** Pour une nouvelle collection ou de nouveaux produits : même processus (feuille de stock ou CSV → `feuille-to-csv` si besoin → `merge-pages` si plusieurs fichiers → wipe collection si repartir de zéro → `category-create` pour les catégories manquantes → import Admin). Aucune sous-tâche spécifique à faire en plus.

- [x] Processus = import collection (24.5bis), réutilisable pour chaque nouvelle collection ou lot.
- [ ] Optionnel : documenter dans un paragraphe « Ajout d’une nouvelle collection » dans `docs/context/FEUILLES_STOCK_REBOUL.md` (déjà décrit en pratique).

## 🚀 Phase 25 : Finalisation Frontend reboulstore.com

**En cours.** On avance doucement : **passer en revue chaque page** du front Reboul (tu passes au peigne fin : améliorations, idées, ce qui manque). Au moment où on fait la revue, on implémente la phase. Pas de nouvelles implémentations listées ici — juste les cales « passer en revue [page] ».

**Workflow** : Pour chaque page → revue ensemble → liste des améliorations → implémentation.

### Revue page par page (frontend Reboul)

| # | Tâche | Statut |
|---|--------|--------|
| 25.1 | Passer en revue **Home.tsx** | À faire |
| 25.2 | Passer en revue **Checkout.tsx** | À faire |
| 25.3 | Passer en revue **Catalog.tsx** | À faire |
| 25.4 | Passer en revue **Product.tsx** | À faire |
| 25.5 | Passer en revue **Cart.tsx** | À faire |
| 25.6 | Passer en revue **Search.tsx** | À faire |
| 25.7 | Passer en revue **Login.tsx** | À faire |
| 25.8 | Passer en revue **Register.tsx** | À faire |
| 25.9 | Passer en revue **Profile.tsx** | À faire |
| 25.10 | Passer en revue **Orders.tsx** | À faire |
| 25.11 | Passer en revue **OrderDetail.tsx** | À faire |
| 25.12 | Passer en revue **OrderConfirmation.tsx** | À faire |
| 25.13 | Passer en revue **About.tsx** | À faire |
| 25.14 | Passer en revue **Contact.tsx** | À faire |
| 25.15 | Passer en revue **Stores.tsx** | À faire |
| 25.16 | Passer en revue **ShippingReturns.tsx** | À faire |
| 25.17 | Passer en revue **Terms.tsx** | À faire |
| 25.18 | Passer en revue **Privacy.tsx** | À faire |
| 25.19 | Passer en revue **NotFound.tsx** / **ServerError.tsx** | À faire |

*À chaque revue : noter améliorations et manques → puis implémenter. Détail des tâches d’implémentation ajouté au moment de la revue.*

---

## 🔒 Phase 26 : Sécurité Backend & DB, VPS, Tests API, Stripe

**À faire après Phase 25.** Thèmes (détail à préciser au moment venu) :

- **Sécurité backend et DB** : renforcement config, bonnes pratiques, audit.
- **VPS** : durcissement, monitoring, bonnes pratiques.
- **Tests finaux API** : couverture endpoints critiques, scénarios de régression.
- **Ajustement routes de paiement Stripe** : routes exactes, flux précis (success/cancel, webhooks), alignement front/back.

---

## Phase 27+ : Post-lancement (résumé)

- **Analytics** : GA4, conversions, heatmaps, A/B tests.
- **Marketing** : Newsletter, réseaux sociaux, pixels, fidélité.
- **Support** : Chat, FAQ, tickets.
- **Évolutions** : Mobile, dark mode, i18n, multi-devise, etc.

Détail à planifier après Phase 26.

---

## Collections (roadmap à part)

**Suivi des collections** (première + futures) : politique livraison, refs marque par marque, photos, setup complet, ajout produit par produit — **ne pas mélanger avec la roadmap principale.**  
→ **Voir** : `docs/context/COLLECTIONS_ROADMAP.md`

---

## Prochaine étape

**Phase 25 en cours.** Prochaine tâche : **25.1 Passer en revue Home.tsx** (tu passes au peigne fin → on note améliorations / manques → on implémente). Puis 25.2 Checkout, 25.3 Catalog, etc. Collections : suivi dans `COLLECTIONS_ROADMAP.md`.
