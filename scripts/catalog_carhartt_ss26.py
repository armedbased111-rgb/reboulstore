#!/usr/bin/env python3
"""Catalog Carhartt WIP SS26 — names, colors, FR descriptions, materials → CSV + DB."""

from __future__ import annotations

import csv
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_OUT = ROOT / "docs/imports/import-carhartt-ss26.csv"

# ref → catalog metadata (name without Carhartt WIP prefix, simple color, FR desc, materials)
CATALOG: dict[str, dict] = {
    "I034576": {
        "name": "Planche Skate 8.25",
        "color": "Naturel",
        "category": "autre",
        "description": "Planche de skate Carhartt WIP, taille 8.25 pouces. Érable 7 plis.",
        "materials": "Érable 7 plis",
    },
    "I034577/46": {
        "name": "Planche Skate 8.375",
        "color": "Naturel",
        "category": "autre",
        "description": "Planche de skate Carhartt WIP, taille 8.375 pouces. Érable 7 plis.",
        "materials": "Érable 7 plis",
    },
    "I034578/27": {
        "name": "Planche Skate 8.5",
        "color": "Naturel",
        "category": "autre",
        "description": "Planche de skate Carhartt WIP, taille 8.5 pouces. Érable 7 plis.",
        "materials": "Érable 7 plis",
    },
    "I035943/HZ": {
        "name": "Sac Lunch",
        "color": "Beige",
        "category": "autre",
        "description": "Sac isotherme compact pour le déjeuner. Fermeture zippée et poignée de transport.",
        "materials": "Polyester",
    },
    "I029963/3HX": {
        "name": "Hooded Nelson Sweat",
        "color": "Bleu",
        "category": "sweat",
        "description": "Sweat à capuche en jersey de coton épais, teint en pièce pour un effet délavé. Capuche ajustable, poche kangourou et étiquette carrée ton sur ton.",
        "materials": "100% Coton",
    },
    "I029963/89": {
        "name": "Hooded Nelson Sweat",
        "color": "Noir",
        "category": "sweat",
        "description": "Sweat à capuche en jersey de coton épais, teint en pièce pour un effet délavé. Capuche ajustable, poche kangourou et étiquette carrée ton sur ton.",
        "materials": "100% Coton",
    },
    "I033064/3IE": {
        "name": "Hooded Nelson Sweat",
        "color": "Vert",
        "category": "sweat",
        "description": "Sweat à capuche en jersey de coton épais, teint en pièce. Capuche, poche kangourou et finitions bord-côte.",
        "materials": "100% Coton",
    },
    "I035437/3IJ": {
        "name": "Hooded Benton Sweat Jacket",
        "color": "Rose",
        "category": "sweat",
        "description": "Sweat zippé à capuche en jersey de coton. Logo script brodé, poches kangourou et fermeture éclair métal.",
        "materials": "100% Coton",
    },
    "I035437/3IW": {
        "name": "Hooded Benton Sweat Jacket",
        "color": "Bleu",
        "category": "sweat",
        "description": "Sweat zippé à capuche en jersey de coton. Logo script brodé, poches kangourou et fermeture éclair métal.",
        "materials": "100% Coton",
    },
    "I030130/3HX": {
        "name": "Nelson Sweat Short",
        "color": "Bleu",
        "category": "bermuda molleton",
        "description": "Short en molleton de coton teint en pièce. Taille élastiquée et poches passepoilées.",
        "materials": "100% Coton",
    },
    "I030130/3IE": {
        "name": "Nelson Sweat Short",
        "color": "Vert",
        "category": "bermuda molleton",
        "description": "Short en molleton de coton teint en pièce. Taille élastiquée et poches passepoilées.",
        "materials": "100% Coton",
    },
    "I030130/89": {
        "name": "Nelson Sweat Short",
        "color": "Noir",
        "category": "bermuda molleton",
        "description": "Short en molleton de coton teint en pièce. Taille élastiquée et poches passepoilées.",
        "materials": "100% Coton",
    },
    "I030469/0160": {
        "name": "Landon Short",
        "color": "Bleu",
        "category": "Bermuda",
        "description": "Short en denim à cinq poches. Braguette boutonnée et passants de ceinture.",
        "materials": "100% Coton",
    },
    "I033333/89": {
        "name": "Simple Short",
        "color": "Noir",
        "category": "Bermuda",
        "description": "Short en coton léger à taille élastique. Poches latérales et coupe décontractée.",
        "materials": "100% Coton",
    },
    "I034570/3NP": {
        "name": "Canby Swim Trunks",
        "color": "Bleu",
        "category": "Bermuda",
        "description": "Short de bain en nylon léger. Taille élastique, surpiqûres contrastées et logo script.",
        "materials": "100% Nylon",
    },
    "I034570/3N7": {
        "name": "Canby Swim Trunks",
        "color": "Mauve",
        "category": "Bermuda",
        "description": "Short de bain en nylon léger. Taille élastique, surpiqûres contrastées et logo script.",
        "materials": "100% Nylon",
    },
    "I034570/3N8": {
        "name": "Canby Swim Trunks",
        "color": "Noir",
        "category": "Bermuda",
        "description": "Short de bain en nylon léger. Taille élastique, surpiqûres contrastées et logo script.",
        "materials": "100% Nylon",
    },
    "I034877/11": {
        "name": "Landon Cord Short",
        "color": "Vert",
        "category": "Bermuda",
        "description": "Short en velours côtelé. Taille élastique, poches latérales et coupe ample.",
        "materials": "100% Coton",
    },
    "I034877/3IT": {
        "name": "Landon Cord Short",
        "color": "Bleu",
        "category": "Bermuda",
        "description": "Short en velours côtelé. Taille élastique, poches latérales et coupe ample.",
        "materials": "100% Coton",
    },
    "I035062/00F": {
        "name": "Chase Swim Trunks",
        "color": "Noir",
        "category": "Bermuda",
        "description": "Short de bain en nylon avec logo C brodé. Taille élastique et cordon de serrage.",
        "materials": "100% Nylon",
    },
    "I035062/3H4": {
        "name": "Chase Swim Trunks",
        "color": "Vert",
        "category": "Bermuda",
        "description": "Short de bain en nylon avec logo C brodé. Taille élastique et cordon de serrage.",
        "materials": "100% Nylon",
    },
    "I035062/3RK": {
        "name": "Chase Swim Trunks",
        "color": "Bleu",
        "category": "Bermuda",
        "description": "Short de bain en nylon avec logo C brodé. Taille élastique et cordon de serrage.",
        "materials": "100% Nylon",
    },
    "I036138/3IR": {
        "name": "Double Knee Short",
        "color": "Beige",
        "category": "Bermuda",
        "description": "Short en toile de coton avec empiècements renfort aux genoux. Poches latérales et passants de ceinture.",
        "materials": "100% Coton",
    },
    "I036141/11": {
        "name": "Kade Cargo Short",
        "color": "Vert",
        "category": "Bermuda",
        "description": "Short cargo en toile résistante. Poches cargo à rabat sur les cuisses et passants de ceinture.",
        "materials": "100% Coton",
    },
    "I036141/89": {
        "name": "Kade Cargo Short",
        "color": "Noir",
        "category": "Bermuda",
        "description": "Short cargo en toile résistante. Poches cargo à rabat sur les cuisses et passants de ceinture.",
        "materials": "100% Coton",
    },
    "I036196/3JQ": {
        "name": "Rochester Short",
        "color": "Bleu",
        "category": "Bermuda",
        "description": "Short à carreaux en toile texturée. Taille élastique et poches latérales.",
        "materials": "100% Coton",
    },
    "I036493/1NK": {
        "name": "Rainer Short",
        "color": "Gris",
        "category": "Bermuda",
        "description": "Short léger à taille élastique et cordon de serrage. Poches latérales et coupe décontractée.",
        "materials": "100% Coton",
    },
    "I036493/11GD": {
        "name": "Rainer Short",
        "color": "Kaki",
        "category": "Bermuda",
        "description": "Short léger à taille élastique et cordon de serrage. Poches latérales et coupe décontractée.",
        "materials": "100% Coton",
    },
    "I024898/0102": {
        "name": "Simple Pant",
        "color": "Indigo",
        "category": "pantalon",
        "description": "Jean en denim indigo à cinq poches. Surpiqûres contrastées et braguette boutonnée.",
        "materials": "100% Coton",
    },
    "I029208/0112": {
        "name": "Newel Pant",
        "color": "Bleu",
        "category": "pantalon",
        "description": "Pantalon en denim délavé, coupe relaxed tapered. Cinq poches et étiquette carrée.",
        "materials": "100% Coton",
    },
    "I029919/11": {
        "name": "Flint Pant",
        "color": "Vert",
        "category": "pantalon",
        "description": "Pantalon en toile de coton, coupe droite. Poches latérales et finitions workwear.",
        "materials": "100% Coton",
    },
    "I029919/3IT": {
        "name": "Flint Pant",
        "color": "Bleu",
        "category": "pantalon",
        "description": "Pantalon en toile de coton, coupe droite. Poches latérales et finitions workwear.",
        "materials": "100% Coton",
    },
    "I031456/1C": {
        "name": "Newel Pant",
        "color": "Marron",
        "category": "pantalon",
        "description": "Pantalon en velours côtelé 15 wales, coupe relaxed tapered. Cinq poches et braguette boutonnée.",
        "materials": "100% Coton",
    },
    "I034816/3IM": {
        "name": "Floyde Pant",
        "color": "Bleu",
        "category": "pantalon",
        "description": "Pantalon décontracté en jersey de coton. Taille élastique avec cordon et poches latérales.",
        "materials": "100% Coton",
    },
    "I034816/87GD": {
        "name": "Floyde Pant",
        "color": "Gris",
        "category": "pantalon",
        "description": "Pantalon décontracté en jersey de coton. Taille élastique avec cordon et poches latérales.",
        "materials": "100% Coton",
    },
    "I036137/89": {
        "name": "Aviation Cargo Pant",
        "color": "Noir",
        "category": "pantalon",
        "description": "Pantalon cargo en toile résistante. Poches cargo latérales et cordons de serrage aux chevilles.",
        "materials": "100% Coton",
    },
    "I036490/11GD": {
        "name": "Double Knee Pant",
        "color": "Kaki",
        "category": "pantalon",
        "description": "Pantalon en toile de coton avec empiècements double genou. Coutures triples et rivets métal.",
        "materials": "100% Coton",
    },
    "I036194/3JQ": {
        "name": "Rochester Shirt",
        "color": "Bleu",
        "category": "chemise",
        "description": "Chemise à carreaux en toile texturée. Col cubain, deux poches poitrine et boutons devant.",
        "materials": "100% Coton",
    },
    "I036203/3K5": {
        "name": "Michigan Shirt",
        "color": "Rayures",
        "category": "chemise",
        "description": "Chemise à rayures hickory. Col cubain, deux poches poitrine et étiquette carrée.",
        "materials": "100% Coton",
    },
    "I036206/3GD": {
        "name": "Rochester Shirt",
        "color": "Vert",
        "category": "chemise",
        "description": "Chemise à rayures ton sur ton. Col camp, deux poches poitrine et logo C brodé.",
        "materials": "100% Coton",
    },
    "I026391/3LR": {
        "name": "S/S Chase T-Shirt",
        "color": "Vert",
        "category": "tee shirt",
        "description": "T-shirt manches courtes en jersey de coton peigné. Logo C brodé sur la poitrine, coupe loose.",
        "materials": "100% Coton",
    },
    "I029949/3HX": {
        "name": "S/S Nelson T-Shirt",
        "color": "Bleu",
        "category": "tee shirt",
        "description": "T-shirt en jersey de coton teint en pièce. Étiquette carrée sur la poitrine, coupe décontractée.",
        "materials": "100% Coton",
    },
    "I029949/3IE": {
        "name": "S/S Nelson T-Shirt",
        "color": "Vert",
        "category": "tee shirt",
        "description": "T-shirt en jersey de coton teint en pièce. Étiquette carrée sur la poitrine, coupe décontractée.",
        "materials": "100% Coton",
    },
    "I030434/3IR": {
        "name": "S/S Pocket T-Shirt",
        "color": "Kaki",
        "category": "tee shirt",
        "description": "T-shirt en jersey de coton avec poche poitrine. Étiquette carrée et coupe regular.",
        "materials": "100% Coton",
    },
    "I031373/00A": {
        "name": "S/S Link Script T-Shirt",
        "color": "Blanc",
        "category": "tee shirt",
        "description": "T-shirt en jersey de coton. Logo CARHARTT imprimé en bas du devant, coupe boxy.",
        "materials": "100% Coton",
    },
    "I031373/3HL": {
        "name": "S/S Link Script T-Shirt",
        "color": "Vert",
        "category": "tee shirt",
        "description": "T-shirt en jersey de coton. Logo CARHARTT imprimé en bas du devant, coupe boxy.",
        "materials": "100% Coton",
    },
    "I035590/3IW": {
        "name": "Vista T-Shirt",
        "color": "Bleu",
        "category": "tee shirt",
        "description": "T-shirt en coton teint en pièce, effet délavé. Logo script ton sur ton, coupe boxy.",
        "materials": "100% Coton",
    },
    "I036185/05": {
        "name": "S/S Nelson Waffle T-Shirt",
        "color": "Blanc",
        "category": "tee shirt",
        "description": "T-shirt en maille gaufrée waffle. Étiquette carrée sur la poitrine et col rond côtelé.",
        "materials": "100% Coton",
    },
    "I036185/3HX": {
        "name": "S/S Nelson Waffle T-Shirt",
        "color": "Bleu",
        "category": "tee shirt",
        "description": "T-shirt en maille gaufrée waffle. Étiquette carrée sur la poitrine et col rond côtelé.",
        "materials": "100% Coton",
    },
    "I036212/02": {
        "name": "S/S Monogram T-Shirt",
        "color": "Blanc",
        "category": "tee shirt",
        "description": "T-shirt avec logo CARHARTT floral brodé en arc de cercle sur la poitrine.",
        "materials": "100% Coton",
    },
    "I036220/0106": {
        "name": "Script T-Shirt",
        "color": "Bleu",
        "category": "tee shirt",
        "description": "T-shirt en jersey de coton. Logo script Carhartt WIP ton sur ton sur la poitrine.",
        "materials": "100% Coton",
    },
    "I036220/02": {
        "name": "Script T-Shirt",
        "color": "Blanc",
        "category": "tee shirt",
        "description": "T-shirt en jersey de coton. Logo script Carhartt WIP sur la poitrine.",
        "materials": "100% Coton",
    },
    "I036233/02": {
        "name": "S/S C Trip T-Shirt",
        "color": "Blanc",
        "category": "tee shirt",
        "description": "T-shirt graphique avec logo C stylisé sur la poitrine.",
        "materials": "100% Coton",
    },
    "I036238/02": {
        "name": "S/S Primary T-Shirt",
        "color": "Blanc",
        "category": "tee shirt",
        "description": "T-shirt graphique Work In Progress avec gribouillis colorés sur la poitrine.",
        "materials": "100% Coton",
    },
    "I036238/89": {
        "name": "S/S Primary T-Shirt",
        "color": "Noir",
        "category": "tee shirt",
        "description": "T-shirt graphique Work In Progress avec gribouillis colorés sur la poitrine.",
        "materials": "100% Coton",
    },
    "I036245/02": {
        "name": "S/S Harlequin BBQ T-Shirt",
        "color": "Blanc",
        "category": "tee shirt",
        "description": "T-shirt avec graphique Harlequin Barbeque sur la poitrine.",
        "materials": "100% Coton",
    },
    "I036254/02": {
        "name": "S/S Heart T-Shirt",
        "color": "Blanc",
        "category": "tee shirt",
        "description": "T-shirt en jersey de coton avec motif cœur sur la poitrine.",
        "materials": "100% Coton",
    },
    "I036260/02": {
        "name": "Apple Heart T-Shirt",
        "color": "Blanc",
        "category": "tee shirt",
        "description": "T-shirt avec graphique pomme verte et logo Carhartt WIP en forme de cœur.",
        "materials": "100% Coton",
    },
    "I036260/89": {
        "name": "Apple Heart T-Shirt",
        "color": "Noir",
        "category": "tee shirt",
        "description": "T-shirt avec graphique pomme et logo Carhartt WIP en forme de cœur.",
        "materials": "100% Coton",
    },
    "I036264/02": {
        "name": "Spiral T-Shirt",
        "color": "Blanc",
        "category": "tee shirt",
        "description": "T-shirt avec logo circulaire spiral rouge sur la poitrine.",
        "materials": "100% Coton",
    },
    "I036495/30K": {
        "name": "Detroit Shirt",
        "color": "Rayures",
        "category": "veste",
        "description": "Surchemise zippée à rayures hickory. Deux poches poitrine à rabat et étiquette carrée.",
        "materials": "100% Coton",
    },
    "I036586/0102": {
        "name": "Belmar Jacket",
        "color": "Indigo",
        "category": "veste",
        "description": "Veste en denim indigo avec surpiqûres dorées. Deux poches poitrine et fermeture boutonnée.",
        "materials": "100% Coton",
    },
}


def fetch_variants():
    sys.path.insert(0, str(ROOT / "cli"))
    from main import _run_db_query

    sql = """
    SELECT p.reference, p.price, c.name, v.sku, v.size, v.stock, v.color, v.cod_article
    FROM products p
    JOIN collections col ON col.id = p.collection_id
    JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
    JOIN variants v ON v.product_id = p.id
    WHERE b.slug = 'carhartt' AND col.name = 'SS26'
    ORDER BY p.reference, v.size;
    """
    return _run_db_query(sql)


def build_csv_rows(variants):
    rows = []
    missing = set()
    for ref, price, cat, sku, size, stock, _old_color, cod in variants:
        meta = CATALOG.get(ref)
        if not meta:
            missing.add(ref)
            continue
        ref_variant = f"{ref} {size}" if " " not in ref.split("/")[-1] or size not in ("UN",) else (
            f"{ref} {size}" if size and size != ref.split()[-1] else ref
        )
        # reference column = product ref + size (Admin format)
        if size == "UN":
            ref_col = ref
        else:
            ref_col = f"{ref} {size}"

        rows.append({
            "cod_article": cod or "",
            "name": meta["name"],
            "reference": ref_col,
            "description": meta["description"],
            "price": str(int(float(price))),
            "brand": "carhartt",
            "category": meta.get("category") or (cat or "").lower(),
            "collection": "SS26",
            "color": meta["color"],
            "size": size,
            "stock": str(stock),
            "sku": sku,
            "materials": meta["materials"],
        })
    return rows, missing


def write_csv(rows):
    fields = [
        "cod_article", "name", "reference", "description", "price", "brand",
        "category", "collection", "color", "size", "stock", "sku", "materials",
    ]
    with CSV_OUT.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields, delimiter=";")
        w.writeheader()
        w.writerows(rows)
    print(f"CSV written: {CSV_OUT} ({len(rows)} variant rows)")


def apply_csv():
    r = subprocess.run(
        [str(ROOT / "rcli"), "import", "apply-csv", "-i", str(CSV_OUT), "--yes"],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    print(r.stdout)
    if r.stderr:
        print(r.stderr, file=sys.stderr)
    if r.returncode != 0:
        sys.exit(r.returncode)


def main():
    variants = fetch_variants()
    rows, missing = build_csv_rows(variants)
    if missing:
        print(f"ERROR: missing catalog entries for: {sorted(missing)}")
        sys.exit(1)
    product_refs = {r[0] for r in variants}
    catalog_refs = set(CATALOG.keys())
    if product_refs != catalog_refs:
        extra = catalog_refs - product_refs
        lacking = product_refs - catalog_refs
        if extra:
            print(f"WARN: catalog has extra refs not in DB: {sorted(extra)}")
        if lacking:
            print(f"ERROR: DB refs without catalog: {sorted(lacking)}")
            sys.exit(1)
    write_csv(rows)
    print(f"Products cataloged: {len(CATALOG)}")
    apply_csv()


if __name__ == "__main__":
    main()
