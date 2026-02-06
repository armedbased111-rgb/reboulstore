# 🛠️ Workflow CLI DB Reboul (`./rcli db ...`)

Voir et éditer les articles rapidement depuis le terminal. Base **toujours sur le VPS** (SSH). Référence complète : `docs/context/DB_CLI_USAGE.md`.

---

## 1. Lecture seule – inspection

| Action | Commande |
|--------|----------|
| Produit par référence | `./rcli db product-find --ref L100001/V09A` [--json] |
| Liste par marque | `./rcli db product-list --brand "Stone Island"` [--limit 50] [--json] |
| Variants d’un produit | `./rcli db variant-list --ref L100001/V09A` ou `--product-id 57` |
| Séquences (duplicate key) | `./rcli db check-sequences` |
| Dernières commandes | `./rcli db order-list` [--last 20] [--json] |
| Détail commande | `./rcli db order-detail --id <ID>` [--json] |
| Derniers paniers (debug) | `./rcli db cart-list` [--last 20] [--json] |

---

## 2. Édition (backup auto + `--yes` ou prompt)

| Action | Commande |
|--------|----------|
| Stock (un variant) | `./rcli db variant-set-stock --id <ID> --stock <n>` [--yes] |
| Stock (tous les variants du produit) | `./rcli db product-set-all-stock --ref <REF> --stock <n>` [--yes] |
| Couleur (un variant) | `./rcli db variant-set-color --id <ID> --color <C>` [--yes] |
| Couleur (tous les variants) | `./rcli db product-set-all-color --ref <REF> --color <C>` [--yes] |
| Taille (un variant) | `./rcli db variant-set-size --id <ID> --size <S>` [--yes] |
| Ajouter un variant | `./rcli db variant-add --ref <REF> --sku <SKU> --size <S> --color <C>` [--stock n] [--yes] |
| Supprimer un variant | `./rcli db variant-delete --id <ID>` [--yes] |
| Prix produit | `./rcli db product-set-price --id <ID> --price <P>` [--yes] |
| Activer/désactiver produit | `./rcli db product-set-active --id <ID> --active` / `--no-active` [--yes] |
| Nom / réf / catégorie / marque / collection | `product-set-name`, `product-set-ref`, `product-set-category`, `product-set-brand`, `product-set-collection` [--yes] |

Toutes les commandes d’édition : backup serveur automatique (sauf `--no-backup`) et confirmation (sauf `--yes`).

**Export** : `./rcli db export-csv --brand "X"` [--collection Y] [-o file.csv] (une ligne par variant).

---

## 3. Workflow typique

1. Lister les produits d’une marque : `product-list --brand "Stone Island"`
2. Sniper une ref → lister les variants : `variant-list --ref L100001/V09A`
3. Éditer (stock / couleur / taille / ajout / suppression) avec les commandes ci-dessus

Le bloc « Édition » sous `variant-list` rappelle toutes ces commandes.
