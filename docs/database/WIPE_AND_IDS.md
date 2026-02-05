# Purge produits/collections et simplification des IDs

## Base de données concernée

**Il n’y a qu’une seule base** : celle sur le VPS. En dev tu te connectes via le tunnel SSH (`localhost:5433` → VPS). En prod les containers se connectent directement au VPS.

Donc **la migration a bien été faite sur la base “prod”** (la base du VPS). Une sauvegarde a été prise avant (`reboulstore_db_20260205_142024.sql.gz`). Pas de base locale séparée.

---

## 1. Purge produits et collections

### Sauvegarde obligatoire avant toute purge

```bash
./rcli db backup --server
```

Backup créé le 2026-02-05 avant wipe : `reboulstore_db_20260205_140352.sql.gz`

### Exécuter la purge

**Option A – DBeaver**

1. Connexion à `reboulstore_db` (tunnel SSH sur `localhost:5433`).
2. Ouvrir le fichier `scripts/wipe-products-collections.sql`.
3. Exécuter le script (Execute SQL Statement / Ctrl+Enter).

**Option B – Ligne de commande (avec tunnel actif)**

```bash
# Depuis la racine du projet, tunnel déjà ouvert sur 5433
psql -h localhost -p 5433 -U reboulstore -d reboulstore_db -f scripts/wipe-products-collections.sql
```

### Ce qui est vidé

- `stock_notifications`, `cart_items` (référencent variants)
- `images`, `variants`
- `products`
- `collections`

**Conservés** : `brands`, `categories`, `shops`, `users`, `addresses`, `carts`, `orders`, etc.  
Les commandes (`orders`) restent en base ; le champ JSONB `items` (variantId) pointera vers d’anciens variants supprimés (données historiques invalides côté produit).

---

## 2. Simplification des IDs ✅ (fait le 2026-02-05)

**Objectif** : remplacer les UUID par des IDs entiers auto-incrémentés (ex. marques 1, 2, 3…).

**Réalisé** :

1. **Migration** : `backend/src/migrations/1767788900000-UuidToIntegerIds.ts` — toutes les PK/FK passées en `SERIAL` / `integer`.
2. **Backend** : entités, DTOs et services mis à jour (`id` et `*Id` en `number`), controllers avec `ParseIntPipe` sur les paramètres `id`.
3. **Frontend** : les types dans `frontend/src/types/index.ts` ont été mis à jour (`id` et `*Id` en `number`). Les appels du type `GET /brands/1` fonctionnent : l’API attend un entier, le front envoie une string dans l’URL (`/brands/${id}` avec `id` number → "1"), ce qui est accepté. Aucun changement de route nécessaire.
