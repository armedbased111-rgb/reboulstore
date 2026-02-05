-- Colonne JSONB variants sur products : édition dans DBeaver sync vers table variants
ALTER TABLE products ADD COLUMN IF NOT EXISTS variants jsonb;

CREATE OR REPLACE FUNCTION sync_products_variants_to_table()
RETURNS TRIGGER AS $$
DECLARE
  elem jsonb;
  v_sku text;
  v_id int;
BEGIN
  IF NEW.variants IS NULL OR jsonb_typeof(NEW.variants) != 'array' OR jsonb_array_length(NEW.variants) = 0 THEN
    DELETE FROM variants WHERE product_id = NEW.id;
    RETURN NEW;
  END IF;

  FOR elem IN SELECT * FROM jsonb_array_elements(NEW.variants)
  LOOP
    v_sku := COALESCE(elem->>'sku', '');
    IF v_sku = '' THEN CONTINUE; END IF;
    SELECT id INTO v_id FROM variants WHERE product_id = NEW.id AND sku = v_sku;
    IF v_id IS NOT NULL THEN
      UPDATE variants SET
        color = COALESCE(elem->>'color', color),
        size = COALESCE(elem->>'size', size),
        stock = COALESCE((elem->>'stock')::int, stock),
        updated_at = NOW()
      WHERE id = v_id;
    ELSE
      INSERT INTO variants (product_id, color, size, stock, sku, created_at, updated_at)
      VALUES (NEW.id, COALESCE(elem->>'color', ''), COALESCE(elem->>'size', ''),
        COALESCE((elem->>'stock')::int, 0), v_sku, NOW(), NOW());
    END IF;
  END LOOP;

  DELETE FROM variants WHERE product_id = NEW.id AND sku NOT IN (
    SELECT (e->>'sku') FROM jsonb_array_elements(NEW.variants) AS e WHERE (e->>'sku') IS NOT NULL AND (e->>'sku') != ''
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_products_variants ON products;
CREATE TRIGGER trg_sync_products_variants
  AFTER INSERT OR UPDATE OF variants ON products
  FOR EACH ROW EXECUTE PROCEDURE sync_products_variants_to_table();

-- Backfill: remplir variants depuis la table variants existante
UPDATE products p SET variants = (
  SELECT jsonb_agg(jsonb_build_object('color', v.color, 'size', v.size, 'stock', v.stock, 'sku', v.sku))
  FROM variants v WHERE v.product_id = p.id
) WHERE EXISTS (SELECT 1 FROM variants v WHERE v.product_id = p.id);
