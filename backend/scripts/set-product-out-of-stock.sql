-- Script pour mettre un produit en rupture de stock (tous les variants à stock = 0)
-- Usage: docker exec -i reboulstore-postgres-1 psql -U postgres -d reboulstore_db < scripts/set-product-out-of-stock.sql

-- Variable: ID du produit à mettre en rupture de stock
-- À passer via: \set product_id '15e76c7e-1ca3-4757-904b-2bb562106cfb'

-- Mettre tous les variants de ce produit à stock = 0
UPDATE variants
SET stock = 0,
    "updatedAt" = NOW()
WHERE "productId" = :'product_id'::uuid;

-- Afficher le résultat
SELECT 
    v.id,
    v."productId",
    v.color,
    v.size,
    v.stock,
    p.name as product_name
FROM variants v
JOIN products p ON p.id = v."productId"
WHERE v."productId" = :'product_id'::uuid
ORDER BY v.color, v.size;

