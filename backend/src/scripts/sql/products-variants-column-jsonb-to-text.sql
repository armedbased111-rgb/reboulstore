-- Remplacer variants JSONB par TEXT : éditable en grille dans DBeaver
-- Format : une ligne par variant → couleur;taille;stock;sku

-- 1) Nouvelle colonne TEXT
ALTER TABLE products ADD COLUMN IF NOT EXISTS variants_txt text;

-- 2) Remplir depuis JSONB existant
UPDATE products p SET variants_txt = (
  SELECT string_agg(
    (v->>'color') || ';' || (v->>'size') || ';' || COALESCE(v->>'stock','0') || ';' || (v->>'sku'),
    E'\n'
  ) FROM jsonb_array_elements(p.variants) AS v
) WHERE p.variants IS NOT NULL AND jsonb_typeof(p.variants) = 'array';

-- 3) Remplir depuis la table variants (produits qui n'ont pas encore variants_txt)
UPDATE products p SET variants_txt = (
  SELECT string_agg(v.color || ';' || v.size || ';' || v.stock::text || ';' || v.sku, E'\n')
  FROM variants v WHERE v.product_id = p.id
) WHERE p.variants_txt IS NULL AND EXISTS (SELECT 1 FROM variants v WHERE v.product_id = p.id);

-- 4) Supprimer trigger et colonne JSONB, renommer TEXT
DROP TRIGGER IF EXISTS trg_sync_products_variants ON products;
ALTER TABLE products DROP COLUMN variants;
ALTER TABLE products RENAME COLUMN variants_txt TO variants;

-- 5) Fonction qui parse le texte et sync vers variants (match par sku pour garder les id)
CREATE OR REPLACE FUNCTION sync_products_variants_to_table()
RETURNS TRIGGER AS $$
DECLARE
  line text;
  parts text[];
  v_color text; v_size text; v_stock int; v_sku text;
  v_id int;
  v_skus text[] := '{}';
BEGIN
  IF NEW.variants IS NULL OR trim(NEW.variants) = '' THEN
    DELETE FROM variants WHERE product_id = NEW.id;
    RETURN NEW;
  END IF;

  FOR line IN SELECT trim(s) FROM unnest(string_to_array(NEW.variants, E'\n')) AS s WHERE trim(s) != ''
  LOOP
    parts := string_to_array(line, ';');
    IF array_length(parts, 1) >= 4 THEN
      v_color := trim(parts[1]);
      v_size  := trim(parts[2]);
      v_stock := COALESCE(NULLIF(trim(parts[3]), '')::int, 0);
      v_sku   := trim(parts[4]);
    ELSIF array_length(parts, 1) = 3 THEN
      v_color := trim(parts[1]);
      v_size  := trim(parts[2]);
      v_stock := COALESCE(NULLIF(trim(parts[3]), '')::int, 0);
      v_sku   := COALESCE(NEW.reference, '') || '-' || v_color || '-' || v_size;
    ELSE
      CONTINUE;
    END IF;
    IF v_sku = '' OR v_sku = '-' THEN CONTINUE; END IF;

    v_skus := array_append(v_skus, v_sku);
    SELECT id INTO v_id FROM variants WHERE product_id = NEW.id AND sku = v_sku;
    IF v_id IS NOT NULL THEN
      UPDATE variants SET color = v_color, size = v_size, stock = v_stock, updated_at = NOW() WHERE id = v_id;
    ELSE
      INSERT INTO variants (product_id, color, size, stock, sku, created_at, updated_at)
      VALUES (NEW.id, v_color, v_size, v_stock, v_sku, NOW(), NOW());
    END IF;
  END LOOP;

  DELETE FROM variants WHERE product_id = NEW.id AND NOT (sku = ANY(v_skus));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_products_variants
  AFTER INSERT OR UPDATE OF variants ON products
  FOR EACH ROW EXECUTE PROCEDURE sync_products_variants_to_table();
