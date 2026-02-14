# Feuilles de stock Reboul → CSV → Import site

Processus reproductible pour importer les collections depuis les **feuilles de stock** du magasin (ex. Stone Island, 7 pages).

---

## 1. Format des feuilles de stock Reboul

Les pages de stock ont toujours la même structure :

| Colonne     | Exemple        | Rôle |
|------------|----------------|------|
| **Marque** | stone island   | Toutes les lignes = même marque sur une page |
| **Genre**  | bermuda, cardigan, polo mc, jogging molleton… | Catégorie produit (= catégorie site) |
| **Référence** | L100001/V09A 29, 6100014/V29 L | **Source de vérité** : `réf + espace + taille` = 1 variant (une ligne) |
| **Stock**  | (souvent vide ou non fiable sur le scan) | On met une valeur fixe au besoin (ex. 2) |

- **Une ligne** = un **variant** (une taille d’un produit).
- **Référence sans la dernière partie** (après l’espace) = **réf produit** (ex. `L100001/V09A`).
- Les doublons de référence (même ligne en double) sont **interdits** : l’analyse import les rejette.

---

## 2. Deux façons d’obtenir le CSV pour l’import

### A. Image → CSV (avec l’IA)

1. Envoyer une **photo/scan** de la page de stock dans le chat.
2. Demander : *« CSV pour import BDD, collection SS26, stock 2, price 100 »* (ou autre collection/stock/price).
3. L’IA extrait **Marque**, **Genre**, **Référence** et produit un fichier `name;reference;brand;category;collection;stock;price` (ex. `docs/import-stone-ss26-page1.csv`).
4. Répéter pour chaque page (page 2, 3, …) ou fusionner les CSV (une seule ligne d’en-tête).

### B. CSV déjà saisi → normalisation CLI

Si tu as déjà un CSV (export Excel, saisie, OCR, etc.) avec **Marque ; Genre ; Référence ; Stock** :

```bash
./rcli import feuille-to-csv -i ma-feuille.csv -o import-ss26.csv --collection SS26 --stock 2 --price 100
```

Sortie : même format `name;reference;brand;category;collection;stock;price` prêt pour l’Admin.

### C. Plusieurs pages → fusion (déduplication) — à faire systématiquement

Les feuilles se **chevauchent** : la dernière ligne d’une page = souvent la première de la page suivante (même référence). Pour ne pas avoir cette ligne en double à l’import, **toujours fusionner** les CSV avant d’importer :

```bash
./rcli import merge-pages -i page1.csv -i page2.csv -i page3.csv -o import-ss26-merged.csv
```

- **Une référence = une ligne** : les doublons (fin page N = début page N+1) sont supprimés automatiquement.
- **Dernière occurrence gagne** : en cas de doublon, la ligne de la **dernière** page est conservée (stock à jour).
- La commande affiche combien de doublons ont été retirés (ex. « 1 doublon(s) retiré(s) »).
- Ensuite : importer **uniquement** le fichier fusionné dans l’Admin (pas d’import page par page → plus de doublon).

---

## 3. Préparer la BDD avant import (CLI)

- **Vider une collection** (ex. repartir de zéro pour SS26) :
  ```bash
  ./rcli db wipe-products-by-collection -c SS26 -y
  ```
  (Backup auto avant suppression.)

- **Créer les catégories manquantes** (celles du CSV, ex. page 1) :
  ```bash
  ./rcli db category-create -n bermuda -y
  ./rcli db category-create -n cardigan -y
  ./rcli db category-create -n "jogging molleton" -y
  ./rcli db category-create -n "polo mc" -y
  ```
  Les catégories déjà existantes sont ignorées (message « déjà existante »).

---

## 4. Import dans l’Admin

1. **Admin** → **Reboul** → **Produits** → **Import collection**.
2. **Upload** du CSV (ou coller le contenu selon l’UI).
3. Choisir la **collection** (ex. SS26) si demandé.
4. **Analyser** : vérifier erreurs (doublons, catégorie manquante, etc.).
5. **Importer** une fois l’analyse OK.

L’import crée les **produits** (une réf produit par groupe) et les **variants** (une ligne = un variant, taille dérivée de la référence).

---

## 5. Vérifier après import (CLI)

```bash
./rcli db product-list --collection SS26 --limit 50
# ou JSON
./rcli db product-list --collection SS26 --json
```

Vérifier : nombre de produits, nombre de variants par produit, références et marque.

---

## 6. Vérifier chaque ref (feuille de stock en main)

Avec la **feuille papier** (ex. Stone Island) : pour chaque référence de la feuille, contrôler qu’elle est bien en base et que les variants correspondent.

```bash
./rcli db ref 4100111/V34
```

Affiche le produit + tous les variants + les commandes d’édition prêtes à copier-coller. Si la ref n’existe pas, le CLI propose des références proches. Voir `docs/context/DB_CLI_USAGE.md` (section Reference Finder).

---

## Récap des commandes CLI utiles

| Action | Commande |
|--------|----------|
| **Vérifier une ref (hub)** | `./rcli db ref <REF>` |
| Feuille CSV → CSV BDD | `./rcli import feuille-to-csv -i fichier.csv -o sortie.csv --collection SS26 --stock 2 --price 100` |
| Fusionner plusieurs pages (dédupliquer) | `./rcli import merge-pages -i page1.csv -i page2.csv -o merged.csv` |
| Vider les produits d’une collection | `./rcli db wipe-products-by-collection -c SS26 -y` |
| Créer une catégorie | `./rcli db category-create -n "nom catégorie" -y` |
| Lister les produits SS26 | `./rcli db product-list --collection SS26` |

---

**Références** : `docs/context/DB_CLI_USAGE.md`, `docs/context/COLLECTION_REAL.md`, `cli/RECAPITULATIF.md` (section Import feuilles de stock).
