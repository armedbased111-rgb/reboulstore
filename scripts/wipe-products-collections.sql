-- Purge produits et collections (ordre FK respecté)
-- À exécuter après sauvegarde DB (./rcli db backup --server)
-- Backup du 2026-02-05: reboulstore_db_20260205_140352.sql.gz

-- 1. Tables qui référencent variants (sinon FK bloque)
TRUNCATE cart_items, stock_notifications;

-- 2. Images et variants (référencent products)
TRUNCATE images, variants;

-- 3. Produits (référencent collections, brands, categories)
TRUNCATE products;

-- 4. Collections
TRUNCATE collections;
