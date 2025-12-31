-- Script SQL pour importer les brands depuis brands-data-with-urls.json
-- Usage: Générer dynamiquement depuis le JSON avec import-brands-sql.sh
-- OU utiliser: ./rcli db seed brands

-- Ce fichier est un template. Le script import-brands-sql.sh génère le SQL réel
-- depuis brands-data-with-urls.json

-- Exemple de structure:
-- BEGIN;
-- DELETE FROM brands;
-- INSERT INTO brands (name, slug, description, "logoUrl", "createdAt", "updatedAt") VALUES (...);
-- COMMIT;

