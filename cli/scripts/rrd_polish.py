#!/usr/bin/env python3
"""Polish RRD SS26 products: names, colors, descriptions, materials."""

from __future__ import annotations

import csv
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "cli"))

from main import _create_server_backup, _exec_db_sql, _run_db_query  # noqa: E402

UPDATES = {
    "S26017/61": {
        "name": "Blouson",
        "color": "Navy",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Blouson léger en tissu technique stretch avec grandes poches plaquées bordées de noir et fermeture à boutons-pression.",
    },
    "S26051/20": {
        "name": "Blazer",
        "color": "Dark Green",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Blazer technique un bouton en tissu stretch, avec poches plaquées et finitions sobres pour un style smart casual.",
    },
    "S26056/13": {
        "name": "Blazer",
        "color": "Light Grey",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Blazer technique un bouton en tissu stretch, avec poches plaquées et finitions sobres pour un style smart casual.",
    },
    "S26056/60": {
        "name": "Blazer",
        "color": "Navy",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Blazer technique un bouton en tissu stretch, avec poches plaquées et finitions sobres pour un style smart casual.",
    },
    "S26213/10": {
        "name": "Polo Manches Courtes",
        "color": "Navy",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Polo manches courtes en tissu technique stretch, avec poche poitrine à liseré orange contrasté.",
    },
    "S26213/20": {
        "name": "Polo Manches Courtes",
        "color": "Anthracite",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Polo manches courtes en tissu technique stretch, avec poche poitrine à liseré orange contrasté.",
    },
    "S26213/60": {
        "name": "Polo Manches Courtes",
        "color": "Navy",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Polo manches courtes en tissu technique stretch, avec poche poitrine à liseré orange contrasté.",
    },
    "S26222/43": {
        "name": "Polo Technique",
        "color": "Dusty Pink",
        "materials": "Cotton piqué, elastane",
        "description": "Polo technique en jersey stretch avec badge brodé sur la manche et détail orange signature.",
    },
    "S26222/61": {
        "name": "Polo Technique",
        "color": "Grey",
        "materials": "Cotton piqué, elastane",
        "description": "Polo technique en jersey stretch avec badge brodé sur la manche et détail orange signature.",
    },
    "S26222/64": {
        "name": "Polo Technique",
        "color": "Light Grey",
        "materials": "Cotton piqué, elastane",
        "description": "Polo technique en jersey stretch avec badge brodé sur la manche et détail orange signature.",
    },
    "S26271/V72": {
        "name": "Chemise",
        "color": "Light Blue Stripe",
        "materials": "Cotton, elastane",
        "description": "Chemise à fines rayures bleu ciel et blanches, en tissu léger et respirant, coupe regular.",
    },
    "S26300/10": {
        "name": "Pantalon Surflex Chino",
        "color": "Navy",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Pantalon chino Surflex ultra-léger et stretch, coupe slim avec revers au bas de jambe.",
    },
    "S26300/20": {
        "name": "Pantalon Surflex Chino",
        "color": "Anthracite",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Pantalon chino Surflex ultra-léger et stretch, coupe slim avec revers au bas de jambe.",
    },
    "S26300/60": {
        "name": "Pantalon Surflex Chino",
        "color": "Navy",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Pantalon chino Surflex ultra-léger et stretch, coupe slim avec revers au bas de jambe.",
    },
    "S26315/20": {
        "name": "Pantalon Terzilight Chino",
        "color": "Dark Green",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Pantalon Terzilight en tissu technique léger, coupe slim avec revers élégant au bas de jambe.",
    },
    "S26315/84M": {
        "name": "Pantalon Terzilight Chino",
        "color": "Khaki",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Pantalon Terzilight en tissu technique léger, coupe slim avec revers élégant au bas de jambe.",
    },
    "S26321/20": {
        "name": "Short Week End",
        "color": "Petrol Blue",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Short en tissu extralight ultra-léger, coupe moderne pour un style casual premium.",
    },
    "S26321/84": {
        "name": "Short Week End",
        "color": "Khaki",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Short en tissu extralight ultra-léger, coupe moderne pour un style casual premium.",
    },
    "S26322/20": {
        "name": "Pantalon Cargo",
        "color": "Dark Grey",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Pantalon cargo en tissu technique performant avec poches latérales fonctionnelles.",
    },
    "S26322/26": {
        "name": "Pantalon Cargo",
        "color": "Olive",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Pantalon cargo en tissu technique performant avec poches latérales fonctionnelles.",
    },
    "S26322/60": {
        "name": "Pantalon Cargo",
        "color": "Navy",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Pantalon cargo en tissu technique performant avec poches latérales fonctionnelles.",
    },
    "S26322/84": {
        "name": "Pantalon Cargo",
        "color": "Brown",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Pantalon cargo en tissu technique performant avec poches latérales fonctionnelles.",
    },
    "S26322/85": {
        "name": "Pantalon Cargo",
        "color": "Beige",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Pantalon cargo en tissu technique performant avec poches latérales fonctionnelles.",
    },
    "S26323/26": {
        "name": "Short Cargo",
        "color": "Olive",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Short cargo en tissu technique léger avec poches latérales plaquées.",
    },
    "S26323/85": {
        "name": "Short Cargo",
        "color": "Beige",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Short cargo en tissu technique léger avec poches latérales plaquées.",
    },
    "S26325/43": {
        "name": "Short Cargo",
        "color": "Mauve",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Short cargo en tissu technique léger avec poches latérales plaquées.",
    },
    "S26325/64": {
        "name": "Short Cargo",
        "color": "Sky Blue",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Short cargo en tissu technique léger avec poches latérales plaquées.",
    },
    "S26335/13": {
        "name": "Pantalon Slim",
        "color": "Grey",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Pantalon slim en tissu technique extensible, coupe ajustée avec revers au bas de jambe.",
    },
    "S26335/60": {
        "name": "Pantalon Slim",
        "color": "Navy",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Pantalon slim en tissu technique extensible, coupe ajustée avec revers au bas de jambe.",
    },
    "S26450/10": {
        "name": "Casquette",
        "color": "Black",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Casquette en tissu Surflex stretch, logo micro-injection et réglable.",
    },
    "S26450/27": {
        "name": "Casquette",
        "color": "Green",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Casquette en tissu Surflex stretch, logo micro-injection et réglable.",
    },
    "S26450/60": {
        "name": "Casquette",
        "color": "Navy",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Casquette en tissu Surflex stretch, logo micro-injection et réglable.",
    },
    "S26450/85": {
        "name": "Casquette",
        "color": "White Sand",
        "materials": "80% Polyamide, 20% Elastane",
        "description": "Casquette en tissu Surflex stretch, logo micro-injection et réglable.",
    },
}


def _esc(val: str) -> str:
    return (val or "").replace("'", "''")


def ref_base(ref_full: str) -> str:
    parts = ref_full.strip().split()
    return " ".join(parts[:-1]) if len(parts) > 1 else ref_full.strip()


def apply_db():
    print("Creating backup...")
    _create_server_backup()

    rows = _run_db_query(
        "SELECT p.id, p.reference FROM products p "
        "JOIN brands b ON b.id = p.brand_id WHERE b.slug = 'rrd' ORDER BY p.reference;"
    )
    by_ref = {r[1]: int(r[0]) for r in rows}

    missing = set(UPDATES) - set(by_ref)
    if missing:
        raise SystemExit(f"Missing refs in DB: {sorted(missing)}")

    for ref, data in UPDATES.items():
        pid = by_ref[ref]
        sql = (
            f"UPDATE products SET "
            f"name = '{_esc(data['name'])}', "
            f"description = '{_esc(data['description'])}', "
            f"materials = '{_esc(data['materials'])}', "
            f"updated_at = NOW() "
            f"WHERE id = {pid};"
        )
        _exec_db_sql(sql)
        print(f"  updated product {ref} (id={pid})")

        color_esc = data["color"].replace("'", "''")
        _exec_db_sql(
            f"UPDATE variants SET color = '{color_esc}', updated_at = NOW() "
            f"WHERE product_id = {pid};"
        )
        print(f"  color -> {data['color']}")


def sync_csv():
    csv_path = ROOT / "docs/imports/import-rrd-ss26.csv"
    rows_out = []
    with open(csv_path, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, delimiter=";")
        fieldnames = list(reader.fieldnames or [])
        for col in ("description", "materials"):
            if col not in fieldnames:
                fieldnames.append(col)
        for row in reader:
            ref_full = (row.get("reference") or "").strip()
            base = ref_base(ref_full)
            data = UPDATES.get(base)
            if data:
                row["name"] = data["name"]
                row["description"] = data["description"]
                row["materials"] = data["materials"]
                row["color"] = data["color"]
            rows_out.append(row)

    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, delimiter=";", lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows_out)
    print(f"CSV synced: {csv_path} ({len(rows_out)} rows)")


def verify():
    rows = _run_db_query(
        "SELECT p.reference, p.name, COALESCE(p.materials,''), "
        "(SELECT v.color FROM variants v WHERE v.product_id = p.id LIMIT 1) "
        "FROM products p JOIN brands b ON b.id = p.brand_id "
        "WHERE b.slug = 'rrd' ORDER BY p.reference;"
    )
    issues = []
    for ref, name, materials, color in rows:
        exp = UPDATES.get(ref)
        if not exp:
            issues.append(f"{ref}: not in UPDATES")
            continue
        if name != exp["name"]:
            issues.append(f"{ref}: name={name!r} expected {exp['name']!r}")
        if not materials:
            issues.append(f"{ref}: materials empty")
        if color != exp["color"]:
            issues.append(f"{ref}: color={color!r} expected {exp['color']!r}")
        if name.startswith("RRD"):
            issues.append(f"{ref}: still has RRD prefix")
    if issues:
        print("VERIFICATION ISSUES:")
        for i in issues:
            print(f"  - {i}")
        return False
    print(f"Verified {len(rows)} products OK")
    return True


if __name__ == "__main__":
    apply_db()
    sync_csv()
    ok = verify()
    sys.exit(0 if ok else 1)
