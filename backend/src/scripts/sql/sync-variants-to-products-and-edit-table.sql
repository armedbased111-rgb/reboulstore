-- 0) Éviter boucle : le trigger products ne doit pas resync quand la mise à jour vient de la table variants
CREATE OR REPLACE FUNCTION sync_products_variants_to_table()
RETURNS TRIGGER AS $$
DECLARE
  line text;
  parts text[];
  v_color text; v_size text; v_stock int; v_sku text;
  v_id int;
  v_skus text[] := '{}';
BEGIN
  IF current_setting('app.from_variants', true) = '1' THEN RETURN NEW; END IF;
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

-- 1) Trigger : quand la table variants change → mettre à jour products.variants (affichage à jour)
CREATE OR REPLACE FUNCTION sync_variants_to_products_column()
RETURNS TRIGGER AS $$
DECLARE
  pid int;
BEGIN
  pid := COALESCE(NEW.product_id, OLD.product_id);
  PERFORM set_config('app.from_variants', '1', true);
  UPDATE products SET variants = (
    SELECT string_agg(v.color || ';' || v.size || ';' || v.stock::text || ';' || v.sku, E'\n')
    FROM variants v WHERE v.product_id = pid
  ) WHERE id = pid;
  PERFORM set_config('app.from_variants', '', true);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_variants_to_products ON variants;
CREATE TRIGGER trg_sync_variants_to_products
  AFTER INSERT OR UPDATE OF color, size, stock, sku OR DELETE ON variants
  FOR EACH ROW EXECUTE PROCEDURE sync_variants_to_products_column();

-- 2) Table dédiée pour l’édition (DBeaver édite souvent mieux une table simple)
DROP TABLE IF EXISTS products_variants_edit CASCADE;
CREATE TABLE products_variants_edit (
  product_id int PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  variants text
);

-- Remplir depuis products
INSERT INTO products_variants_edit (product_id, variants)
  SELECT id, variants FROM products
  ON CONFLICT (product_id) DO UPDATE SET variants = EXCLUDED.variants;

-- Quand tu édites cette table → on met à jour products.variants (puis le trigger existant sync vers variants)
CREATE OR REPLACE FUNCTION sync_edit_to_products_variants()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET variants = NEW.variants WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_edit_to_products ON products_variants_edit;
CREATE TRIGGER trg_edit_to_products
  AFTER INSERT OR UPDATE OF variants ON products_variants_edit
  FOR EACH ROW EXECUTE PROCEDURE sync_edit_to_products_variants();

-- 3) Nouveaux produits → une ligne dans la table d’édition (sans boucle de triggers)
CREATE OR REPLACE FUNCTION add_product_to_edit_table()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO products_variants_edit (product_id, variants) VALUES (NEW.id, NEW.variants)
  ON CONFLICT (product_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_add_product_to_edit ON products;
CREATE TRIGGER trg_add_product_to_edit
  AFTER INSERT ON products
  FOR EACH ROW EXECUTE PROCEDURE add_product_to_edit_table();

-- 4) Remplir products_variants_edit pour tous les produits existants
INSERT INTO products_variants_edit (product_id, variants)
  SELECT id, variants FROM products
  ON CONFLICT (product_id) DO UPDATE SET variants = EXCLUDED.variants;
