#!/usr/bin/env python3
"""Apply Stone Island SS26 catalog enrichment to DB + sync import CSV."""
import csv
import os
import re
import sys
from pathlib import Path

import psycopg2

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "docs/imports/import-stone-island-ss26.csv"

STYLES = {
    "11000027": {
        "name": "Script Logo Oxford Shirt",
        "description": "Chemise oxford à col boutonné avec poche poitrine et logo script brodé.",
        "materials": "100% Cotton",
    },
    "1200005": {
        "name": "Zip Overshirt with Chest Pockets",
        "description": "Surchemise zippée en coton avec deux grandes poches poitrine et badge boussole.",
        "materials": "100% Cotton",
    },
    "2100001": {
        "name": "SS26 Graphic T-Shirt",
        "description": "T-shirt coton avec logo boussole et graphique SS26 imprimé au centre poitrine.",
        "materials": "100% Cotton",
    },
    "2100023": {
        "name": "Archivio Logo T-Shirt",
        "description": "T-shirt coton avec logo Archivio imprimé au centre poitrine.",
        "materials": "100% Cotton",
    },
    "2100027E": {
        "name": "Compass Patch T-Shirt",
        "description": "T-shirt coton à manches courtes avec petit écusson boussole sur la poitrine.",
        "materials": "100% Cotton",
    },
    "2200010": {
        "name": "Tipped Polo Shirt",
        "description": "Polo manches courtes en piqué coton avec liserés contrastés col et poignets.",
        "materials": "100% Cotton piqué",
    },
    "2200012": {
        "name": "Long Sleeve Tipped Polo",
        "description": "Polo manches longues en piqué coton avec liserés contrastés et badge boussole.",
        "materials": "100% Cotton piqué",
    },
    "3100008": {
        "name": "Cargo Pants with Compass Patch",
        "description": "Pantalon cargo en coton avec poche latérale et badge boussole sur la jambe.",
        "materials": "100% Cotton",
    },
    "3100031": {
        "name": "Elasticated Cargo Pants",
        "description": "Pantalon cargo coton taille et chevilles élastiquées avec poches cargo.",
        "materials": "100% Cotton",
    },
    "3100032": {
        "name": "Tapered Cargo Pants",
        "description": "Pantalon cargo en coton avec poches latérales et badge boussole sur la jambe.",
        "materials": "100% Cotton",
    },
    "3100049": {
        "name": "Garment Dyed Cargo Pants",
        "description": "Pantalon cargo en coton garment-dyed avec poches plaquées et badge boussole.",
        "materials": "100% Cotton",
    },
    "4100001": {
        "name": "Hooded Zip Jacket",
        "description": "Veste à capuche zippée en nylon avec poches inclinées et badge boussole.",
        "materials": "100% Polyamide",
    },
    "4100024": {
        "name": "Field Jacket with Four Pockets",
        "description": "Veste style field en coton-nylon avec quatre poches plaquées et badge boussole.",
        "materials": "Cotton and polyamide blend",
    },
    "4100052": {
        "name": "Hooded Parka with Flap Pockets",
        "description": "Parka à capuche avec grandes poches à rabat et badge boussole sur la manche.",
        "materials": "100% Polyamide",
    },
    "4100057": {
        "name": "Hooded Technical Jacket",
        "description": "Veste technique à capuche avec poche poitrine zippée et badge boussole.",
        "materials": "100% Polyamide",
    },
    "4100111": {
        "name": "Lightweight Bomber Jacket",
        "description": "Blouson bomber léger en nylon avec col montant et poches inclinées.",
        "materials": "100% Polyamide",
    },
    "5100023": {
        "name": "Waffle Knit Crewneck",
        "description": "Pull col rond en maille gaufrée avec badge boussole sur la manche.",
        "materials": "100% Cotton",
    },
    "5100074": {
        "name": "Lightweight Knit Sweater",
        "description": "Pull léger été en maille coton avec badge boussole sur la manche.",
        "materials": "100% Cotton",
    },
    "6100014": {
        "name": "Zip Knit Bomber Cardigan",
        "description": "Cardigan bomber zippé en maille coton avec poches plaquées et badge boussole.",
        "materials": "100% Cotton",
    },
    "6100058": {
        "name": "Waffle Knit Zip Hoodie",
        "description": "Sweat à capuche zippé en maille gaufrée avec badge boussole sur la manche.",
        "materials": "100% Cotton",
    },
    "6100060E": {
        "name": "Compass Patch Crewneck Sweatshirt",
        "description": "Sweat col rond en coton avec badge boussole sur la manche.",
        "materials": "100% Cotton",
    },
    "6100062E": {
        "name": "Kangaroo Pocket Hoodie",
        "description": "Sweat à capuche en coton avec poche kangourou et badge boussole.",
        "materials": "100% Cotton",
    },
    "6200011E": {
        "name": "Fleece Cargo Shorts",
        "description": "Bermuda molleton coton avec poche cargo et badge boussole sur la jambe.",
        "materials": "100% Cotton fleece",
    },
    "6200021": {
        "name": "Fleece Cargo Joggers",
        "description": "Jogging molleton coton avec poche cargo et chevilles resserrées.",
        "materials": "100% Cotton fleece",
    },
    "9100001": {
        "name": "Compass Logo Cap",
        "description": "Casquette coton avec logo boussole brodé sur le devant.",
        "materials": "100% Cotton",
    },
    "9100011E": {
        "name": "Curved Brim Cap",
        "description": "Casquette coton à visière courbe avec badge boussole sur le côté.",
        "materials": "100% Cotton",
    },
    "9100013": {
        "name": "Nylon Cap with Compass Badge",
        "description": "Casquette nylon technique avec badge boussole amovible.",
        "materials": "100% Polyamide",
    },
    "9200012": {
        "name": "Nylon Tote Bag with Zip Pocket",
        "description": "Sac cabas nylon avec poche frontale zippée et badge boussole.",
        "materials": "100% Polyamide",
    },
    "9200013": {
        "name": "Nylon Zip Pouch with Wrist Strap",
        "description": "Pochette zippée en nylon avec dragonne et logo boussole.",
        "materials": "100% Polyamide",
    },
    "B100003": {
        "name": "Nylon Metal Swim Shorts with Stripes",
        "description": "Short de bain nylon métal avec bandes latérales et badge boussole.",
        "materials": "100% Polyamide",
    },
    "B100004": {
        "name": "Nylon Metal Swim Shorts",
        "description": "Short de bain nylon métal avec fini froissé et badge boussole.",
        "materials": "100% Polyamide",
    },
    "J100007": {
        "name": "Five-Pocket Denim Jeans",
        "description": "Jean cinq poches en denim avec logo boussole brodé sur la cuisse.",
        "materials": "100% Cotton denim",
    },
    "L100001": {
        "name": "Cargo Shorts with Side Pockets",
        "description": "Bermuda cargo en coton avec poches latérales et badge boussole.",
        "materials": "100% Cotton",
    },
    "L100020": {
        "name": "Garment Dyed Cargo Shorts",
        "description": "Bermuda cargo en coton garment-dyed avec poches plaquées et badge boussole.",
        "materials": "100% Cotton",
    },
}

COLOR_EN = {
    "Vert": "Green",
    "Noir": "Black",
    "Blanc": "White",
    "Beige": "Beige",
    "Gris": "Grey",
    "Rose": "Pink",
    "Blanc Cassé": "Off-White",
    "Ecru": "Ecru",
    "Jaune": "Yellow",
    "Bleu Ciel": "Light Blue",
    "Vieux Rose": "Dusty Pink",
    "Kaki": "Khaki",
    "Denim Brut": "Raw Denim",
    "Denim Noir": "Black Denim",
    "Vert Anis": "Lime Green",
    "Uni": "Olive",
}


def load_env():
    env = {}
    for line in (ROOT / ".env").read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env[k] = v.strip().strip('"')
    return env


def style_code(ref: str) -> str:
    return ref.rsplit("/", 1)[0]


def color_en(fr: str) -> str:
    return COLOR_EN.get(fr, fr)


def main():
    env = load_env()
    conn = psycopg2.connect(
        host="127.0.0.1",
        port=env.get("DB_PORT", "5433"),
        user=env["DB_USERNAME"],
        password=env["DB_PASSWORD"],
        dbname=env["DB_DATABASE"],
    )
    cur = conn.cursor()
    cur.execute(
        """
        SELECT p.id, p.reference, p.name,
               (SELECT v.color FROM variants v WHERE v.product_id = p.id LIMIT 1)
        FROM products p
        JOIN brands b ON b.id = p.brand_id
        JOIN collections col ON col.id = p.collection_id
        WHERE b.slug = 'stone-island' AND col.name = 'SS26'
        ORDER BY p.reference
        """
    )
    products = cur.fetchall()
    updated = 0
    name_by_ref = {}

    for pid, ref, _old_name, fr_color in products:
        style = style_code(ref)
        meta = STYLES.get(style)
        if not meta:
            print(f"MISSING STYLE: {ref} ({style})", file=sys.stderr)
            continue
        en_color = color_en(fr_color or "")
        cur.execute(
            """
            UPDATE products
            SET name = %s, description = %s, materials = %s, updated_at = NOW()
            WHERE id = %s
            """,
            (meta["name"], meta["description"], meta["materials"], pid),
        )
        cur.execute(
            "UPDATE variants SET color = %s, updated_at = NOW() WHERE product_id = %s",
            (en_color, pid),
        )
        name_by_ref[ref] = meta["name"]
        updated += 1
        print(f"OK {ref:<22} {meta['name']:<40} {en_color}")

    conn.commit()

    # Sync CSV names
    rows = []
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter=";")
        fieldnames = reader.fieldnames
        for row in reader:
            ref_full = row.get("reference", "").strip()
            base = ref_full.rsplit(" ", 1)[0] if " " in ref_full else ref_full
            if base in name_by_ref:
                row["name"] = name_by_ref[base]
            rows.append(row)

    with CSV_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, delimiter=";")
        writer.writeheader()
        writer.writerows(rows)

    conn.close()
    print(f"\nDone: {updated} products updated, CSV synced ({len(rows)} rows)")


if __name__ == "__main__":
    main()
