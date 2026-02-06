## 🛠️ CLI DB Reboul – Utilisation rapide

Ce fichier résume **uniquement** les commandes CLI pour travailler vite sur la base Reboul depuis le terminal.

Toutes les commandes passent par `./rcli` et la **DB du VPS** (via SSH).

---

### 1. Chercher un produit par référence (cas le plus courant)

Référence produit (sans taille), ex: `L100001/V09A` :

```bash
./rcli db product-find --ref L100001/V09A
```

Affiche une table compacte avec :
- `id`
- `name`
- `reference`
- `price`
- `category_id`
- `brand_id`
- `collection_id`

Autres options possibles (moins utilisées) :

```bash
./rcli db product-find --id 123
./rcli db product-find --sku REB001_1_main
```

Version JSON (pour coller le résultat dans l’IA) :

```bash
./rcli db product-find --ref L100001/V09A --json
```

---

### 2. Voir tous les variants d’un produit

Quand tu connais l’`id` produit (par ex. après un `product-find`) :

```bash
./rcli db variant-list --product-id 123
```

Ou directement par référence produit :

```bash
./rcli db variant-list --ref L100001/V09A
```

Affiche une table :
- `id`
- `sku`
- `size`
- `color`
- `stock`

Version JSON :

```bash
./rcli db variant-list --product-id 123 --json
```

---

### 3. Vérifier l’état des séquences PostgreSQL

Utile quand on suspecte un bug de type `duplicate key value violates unique constraint "carts_pkey"` :

```bash
./rcli db check-sequences
```

Affiche pour chaque séquence critique :
- `carts_id_seq`
- `orders_id_seq`
- `products_id_seq`

Avec :
- `last_value`
- `max(id)` dans la table
- Un état :
  - `OK`
  - ou `⚠️ last_value <= max(id)` si la séquence est potentiellement désynchronisée.

> **Important** : cette commande est **lecture seule** (aucun `setval` n’est exécuté automatiquement).

---

### 4. Lister tous les produits d’une marque (ex: Stone Island)

Pour voir rapidement tous les produits d’une marque :

```bash
./rcli db product-list --brand "Stone Island"
```

- Utilise un `ILIKE` sur le nom de marque, donc `--brand "Stone"` matchera aussi.
- Tu peux limiter le nombre de lignes :

```bash
./rcli db product-list --brand "Stone Island" --limit 50
```

Version JSON (pratique pour coller dans l’IA) :

```bash
./rcli db product-list --brand "Stone Island" --limit 50 --json
```

Tu peux aussi filtrer par collection (si besoin plus tard) :

```bash
./rcli db product-list --brand "Stone Island" --collection "SS26"
```

---

### 5. Modifier le stock d’un variant (petite correction manuelle)

Quand tu veux juste corriger un stock à la main sur un variant précis :

```bash
./rcli db variant-set-stock --id 456 --stock 3
```

- Par défaut, le CLI :
  - crée d’abord un **backup serveur rapide** ;
  - demande une **confirmation interactive** si tu n’as pas mis `--yes`.

Version sans confirmation (à utiliser seulement si tu es sûr de toi) :

```bash
./rcli db variant-set-stock --id 456 --stock 3 --yes
```

Version sans backup (déconseillé, mais possible en cas de besoin très ciblé) :

```bash
./rcli db variant-set-stock --id 456 --stock 3 --yes --no-backup
```

---

### 6. Édition des variants (taille, couleur, ajout, suppression)

Toutes ces commandes font backup auto + confirmation (sauf `--yes` / `--no-backup`).

- **Taille** : `./rcli db variant-set-size --id <ID> --size <TAILLE> [--yes]`
- **Couleur** : `./rcli db variant-set-color --id <ID> --color <COULEUR> [--yes]`
- **Ajouter un variant** : `./rcli db variant-add --ref <REF> --sku <SKU> --size <S> --color <C> [--stock <n>] [--yes]`
- **Supprimer un variant** : `./rcli db variant-delete --id <ID> [--yes]`
- **Couleur pour tous les variants du produit** : `./rcli db product-set-all-color --ref <REF> --color <COULEUR> [--yes]`

Après `./rcli db variant-list --ref L100001/V09A`, le bloc « Édition » en bas rappelle ces commandes.

---

### 7. Modifier le prix d’un produit

Pour corriger un prix à la main :

```bash
./rcli db product-set-price --id 123 --price 199.90
```

Comme pour le stock :
- backup serveur auto avant modification (sauf si `--no-backup`) ;
- confirmation interactive si tu oublies `--yes`.

Exemple complet sans prompt :

```bash
./rcli db product-set-price --id 123 --price 199.90 --yes
```

- **Activer / désactiver un produit** : `./rcli db product-set-active --id <ID> --active/--no-active [--yes]` (colonne `is_published`).
- **Édition produit** : `product-set-name`, `product-set-ref`, `product-set-category`, `product-set-brand`, `product-set-collection` (même principe : backup + confirmation sauf `--yes`).

---

### 8. Inspection commandes et paniers (lecture seule)

- **Dernières commandes** : `./rcli db order-list [--last 20]` (table id, statut, total, créé, email). Option `--json`.
- **Détail d’une commande** : `./rcli db order-detail --id <ID>` (option `--json`).
- **Derniers paniers** (debug) : `./rcli db cart-list [--last 20]` (option `--json`).

---

### 9. Export CSV (produits / variants)

Export une ligne par variant (reference, name, sku, size, color, stock) pour Excel ou traitement externe :

```bash
./rcli db export-csv --brand "Stone Island" -o stone.csv
./rcli db export-csv --collection "SS26" -o ss26.csv
./rcli db export-csv --brand "X" --collection "Y" -o out.csv
```

Sans `--output` : affichage stdout (séparateur `;`).

---

### 10. Rappels de sécurité

- La base Reboul est **toujours** sur le VPS (jamais locale).
- Toutes les commandes DB passent par `./rcli` qui sait déjà comment se connecter (SSH / Docker).
- Les commandes de lecture (`product-find`, `product-list`, `variant-list`, `check-sequences`, `order-list`, `order-detail`, `cart-list`) sont 100 % **read-only**.
- Les commandes de modification (stock, prix, taille, couleur, variant-add, variant-delete, product-set-name/ref/category/brand/collection/active, etc.) :
  - déclenchent un **backup auto** côté serveur sauf si tu passes `--no-backup` ;
  - nécessitent une confirmation (`--yes` ou prompt).

