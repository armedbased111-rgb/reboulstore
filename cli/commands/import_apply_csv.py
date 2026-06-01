"""Import CSV collection → BDD Reboul (VPS), sans Admin Centrale."""

from __future__ import annotations

import csv
import re
import unicodedata
from collections import defaultdict
from typing import Any, Callable, Dict, List, Optional, Tuple

SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

# Alias CSV → nom catégorie en BDD
CATEGORY_ALIASES = {
    't-shirt': 'tee shirt',
    'tshirt': 'tee shirt',
    'tee-shirt': 'tee shirt',
    'teeshirt': 'tee shirt',
}


def _esc(value: str) -> str:
    return (value or '').replace("'", "''")


def _norm_header_key(key: str) -> str:
    s = key.strip().lower()
    n = unicodedata.normalize('NFD', s)
    return ''.join(c for c in n if not unicodedata.combining(c))


def _parse_csv(path: str) -> List[Dict[str, str]]:
    with open(path, 'r', encoding='utf-8-sig') as f:
        first = f.readline()
        if not first.strip():
            raise ValueError('CSV vide')
        sep = ';'
        if ',' in first and (';' not in first or first.index(',') < first.index(';')):
            sep = ','
        f.seek(0)
        reader = csv.DictReader(f, delimiter=sep)
        if not reader.fieldnames:
            raise ValueError('CSV sans en-tête')
        rows = []
        for raw in reader:
            lower: Dict[str, str] = {}
            for k, v in raw.items():
                if k is None:
                    continue
                lower[_norm_header_key(k)] = (v or '').strip()
            rows.append(_normalize_row(lower))
        return rows


def _normalize_row(lower: Dict[str, str]) -> Dict[str, str]:
    def get(*keys: str) -> str:
        for k in keys:
            for alias in (k.lower().strip(), _norm_header_key(k)):
                if alias in lower and lower[alias]:
                    return lower[alias]
        return ''

    ref_val = get('reference')
    size = get('size')
    if not size and ref_val:
        parts = ref_val.split()
        if len(parts) > 1:
            size = parts[-1]
        else:
            size = ref_val
    sku = get('sku')
    if not sku and ref_val:
        sku = ref_val
    return {
        'name': get('name'),
        'reference': ref_val,
        'description': get('description'),
        'price': get('price') or '0',
        'brand': get('brand'),
        'category': get('category'),
        'collection': get('collection'),
        'color': get('color') or 'Uni',
        'size': size,
        'stock': get('stock') or '0',
        'sku': sku,
        'cod_article': get('cod_article', 'codarticle', 'cod article'),
        'materials': get('materials'),
    }


def _ref_base(ref_full: str) -> str:
    ref_full = (ref_full or '').strip()
    parts = ref_full.split()
    if len(parts) > 1:
        return ' '.join(parts[:-1]).strip()
    return ref_full


def _category_lookup_key(name: str) -> str:
    key = (name or '').strip().lower()
    return CATEGORY_ALIASES.get(key, key)


def _ref_key(row: Dict[str, str]) -> str:
    return re.sub(r'\s+', ' ', (row.get('reference') or '').strip())


def _size_sort_key(size: str):
    s = (size or '').strip()
    if s.isdigit():
        return (0, int(s))
    u = s.upper()
    if u in SIZE_ORDER:
        return (1, SIZE_ORDER.index(u))
    return (2, s)


def _group_rows(rows: List[Dict[str, str]]) -> Dict[str, List[Dict[str, str]]]:
    grouped: Dict[str, List[Dict[str, str]]] = defaultdict(list)
    for row in rows:
        price = float(str(row['price']).replace(',', '.'))
        name = (row.get('name') or '').strip()
        cat = (row.get('category') or '').strip().lower()
        brand = (row.get('brand') or '').strip().lower()
        ref_base = _ref_base(row.get('reference') or row.get('name') or '')
        key = f"{ref_base}|{name}|{price}|{cat}|{brand}"
        grouped[key].append(row)
    for key in grouped:
        grouped[key].sort(key=lambda r: _size_sort_key(r.get('size') or ''))
    return grouped


def _validate_rows(
    rows: List[Dict[str, str]],
    run_query: Callable[[str], list],
) -> Tuple[List[str], Optional[int], str]:
    errors: List[str] = []
    categories = {
        (r[0] or '').lower(): int(r[1])
        for r in run_query('SELECT LOWER(name), id FROM categories;')
    }
    brands = {}
    for r in run_query('SELECT LOWER(name), slug, id FROM brands;'):
        brands[(r[0] or '').lower()] = int(r[2])
        if r[1]:
            brands[(r[1] or '').lower()] = int(r[2])

    collection_name = next((r.get('collection') or '' for r in rows if r.get('collection')), '').strip()
    collection_id: Optional[int] = None
    if collection_name:
        coll_rows = run_query(
            "SELECT id, name FROM collections WHERE name ILIKE '%s' LIMIT 1;"
            % _esc(collection_name)
        )
        if coll_rows:
            collection_id = int(coll_rows[0][0])
        else:
            errors.append(f"Collection « {collection_name} » introuvable")

    seen_refs = set()
    for i, row in enumerate(rows, start=1):
        if not (row.get('name') or '').strip():
            errors.append(f"Ligne {i}: name obligatoire")
        if not _ref_key(row):
            errors.append(f"Ligne {i}: reference obligatoire")
        if not (row.get('category') or '').strip():
            errors.append(f"Ligne {i}: category obligatoire")
        else:
            cat = _category_lookup_key(row['category'])
            if cat not in categories:
                errors.append(f"Ligne {i}: catégorie « {row['category']} » introuvable")
        brand = (row.get('brand') or '').strip()
        if brand and brand.lower() not in brands:
            errors.append(f"Ligne {i}: marque « {brand} » introuvable")
        try:
            price = float(str(row.get('price', '0')).replace(',', '.'))
            if price <= 0:
                errors.append(f"Ligne {i}: price invalide")
        except ValueError:
            errors.append(f"Ligne {i}: price invalide")
        if not (row.get('size') or '').strip():
            errors.append(f"Ligne {i}: size obligatoire")
        if not (row.get('sku') or '').strip():
            errors.append(f"Ligne {i}: sku obligatoire")
        rk = _ref_key(row)
        if rk in seen_refs:
            errors.append(f"Ligne {i}: reference en double ({rk})")
        seen_refs.add(rk)

    return errors, collection_id, collection_name


def run_apply_csv(
    console: Any,
    input_path: str,
    collection_id: Optional[int],
    dry_run: bool,
    yes: bool,
    no_backup: bool,
    run_query: Callable[[str], list],
    exec_sql: Callable[[str], None],
    create_backup: Callable[[], None],
) -> None:
    try:
        rows = _parse_csv(input_path)
    except ValueError as e:
        console.print(f"[red]❌ {e}[/red]")
        return

    if not rows:
        console.print('[yellow]⚠️ Aucune ligne dans le CSV[/yellow]')
        return

    errors, coll_from_csv, coll_name = _validate_rows(rows, run_query)
    if collection_id is None:
        collection_id = coll_from_csv
    elif coll_from_csv and coll_from_csv != collection_id:
        console.print(
            f"[yellow]⚠️ --collection-id={collection_id} utilisé (CSV indiquait autre collection)[/yellow]"
        )

    if not collection_id:
        errors.append('Collection introuvable (colonne collection ou --collection-id)')

    if errors:
        console.print('[red]❌ Import impossible :[/red]')
        for err in errors[:30]:
            console.print(f"  • {err}")
        if len(errors) > 30:
            console.print(f"  … et {len(errors) - 30} autre(s)")
        return

    grouped = _group_rows(rows)
    console.print(
        f"[cyan]📋 {len(rows)} variant(s) · {len(grouped)} produit(s) · collection id={collection_id}[/cyan]"
    )

    if dry_run:
        console.print('[green]✅ Dry-run OK — aucune écriture BDD[/green]')
        return

    if not yes:
        import click
        if not click.confirm(
            f"Importer {len(rows)} variant(s) sur le VPS (backup auto) ?",
            default=False,
        ):
            console.print('[yellow]Annulé[/yellow]')
            return

    if not no_backup:
        try:
            create_backup()
        except Exception as e:
            console.print(f"[red]❌ Backup échoué — import annulé: {e}[/red]")
            return

    categories = {
        (r[0] or '').lower(): int(r[1])
        for r in run_query('SELECT LOWER(name), id FROM categories;')
    }
    brands = {}
    for r in run_query('SELECT LOWER(name), slug, id FROM brands;'):
        brands[(r[0] or '').lower()] = int(r[2])
        if r[1]:
            brands[(r[1] or '').lower()] = int(r[2])

    stats = {
        'products_created': 0,
        'products_updated': 0,
        'variants_created': 0,
        'variants_updated': 0,
        'errors': [],
    }

    for group_rows in grouped.values():
        first = group_rows[0]
        try:
            cat_id = categories[_category_lookup_key(first['category'])]
            brand_key = (first.get('brand') or '').strip().lower()
            brand_id = brands.get(brand_key) if brand_key else None
            price = float(str(first['price']).replace(',', '.'))
            ref_base = _ref_base(first.get('reference') or first.get('name') or '')
            if not ref_base:
                ref_base = (first.get('name') or '').strip()

            name_esc = _esc(first['name'])
            ref_esc = _esc(ref_base)
            desc = first.get('description') or ''
            desc_sql = f"'{_esc(desc)}'" if desc else 'NULL'
            materials = first.get('materials') or ''
            materials_sql = f"'{_esc(materials)}'" if materials else 'NULL'
            brand_sql = str(brand_id) if brand_id is not None else 'NULL'

            existing = run_query(
                f"SELECT id FROM products WHERE reference = '{ref_esc}' LIMIT 1;"
            )
            if existing:
                pid = int(existing[0][0])
                exec_sql(
                    f"UPDATE products SET name = '{name_esc}', price = {price}, "
                    f"category_id = {cat_id}, brand_id = {brand_sql}, collection_id = {collection_id}, "
                    f"description = {desc_sql}, materials = {materials_sql}, updated_at = NOW() "
                    f"WHERE id = {pid};"
                )
                stats['products_updated'] += 1
            else:
                exec_sql(
                    f"INSERT INTO products (name, reference, price, category_id, brand_id, collection_id, "
                    f"description, materials, is_published, created_at, updated_at) "
                    f"VALUES ('{name_esc}', '{ref_esc}', {price}, {cat_id}, {brand_sql}, {collection_id}, "
                    f"{desc_sql}, {materials_sql}, false, NOW(), NOW());"
                )
                existing = run_query(
                    f"SELECT id FROM products WHERE reference = '{ref_esc}' LIMIT 1;"
                )
                if not existing:
                    stats['errors'].append(f"{first['name']}: produit non créé")
                    continue
                pid = int(existing[0][0])
                stats['products_created'] += 1

            for v in group_rows:
                sku_esc = _esc(v['sku'])
                color_esc = _esc(v.get('color') or 'Uni')
                size_esc = _esc(v.get('size') or '')
                stock = max(0, int(str(v.get('stock') or '0')))
                cod = (v.get('cod_article') or '').strip()
                cod_sql = f"'{_esc(cod)}'" if cod else 'NULL'

                var_rows = run_query(
                    f"SELECT id FROM variants WHERE sku = '{sku_esc}' LIMIT 1;"
                )
                if var_rows:
                    vid = int(var_rows[0][0])
                    exec_sql(
                        f"UPDATE variants SET stock = {stock}, color = '{color_esc}', size = '{size_esc}', "
                        f"cod_article = {cod_sql}, updated_at = NOW() WHERE id = {vid};"
                    )
                    stats['variants_updated'] += 1
                else:
                    exec_sql(
                        f"INSERT INTO variants (product_id, color, size, stock, sku, cod_article, created_at, updated_at) "
                        f"VALUES ({pid}, '{color_esc}', '{size_esc}', {stock}, '{sku_esc}', {cod_sql}, NOW(), NOW());"
                    )
                    stats['variants_created'] += 1
        except Exception as e:
            stats['errors'].append(f"{first.get('name', '?')}: {e}")

    console.print(
        f"[green]✅ Import terminé[/green] — "
        f"{stats['products_created']} produit(s) créé(s), {stats['products_updated']} mis à jour, "
        f"{stats['variants_created']} variant(s) créé(s), {stats['variants_updated']} mis à jour"
    )
    if stats['errors']:
        console.print('[red]Erreurs :[/red]')
        for err in stats['errors']:
            console.print(f"  • {err}")
