#!/usr/bin/env python3
"""Apply Birkenstock SS26 catalog to DB + CSV."""
import csv
import json
import psycopg2
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "docs/imports/import-birkenstock-ss26.csv"

CATALOG = [
    {"ref": "ARIZON/1009527", "name": "Arizona", "color": "Brown", "description": "Sandale Arizona deux brides en daim mink, lit de pied anatomique en liège.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole"},
    {"ref": "ARIZON/1009921", "name": "Arizona", "color": "White", "description": "Sandale Arizona en Birko-Flor nacré blanc perle, confortable et facile d'entretien.", "materials": "Birko-Flor upper, cork footbed, EVA sole"},
    {"ref": "ARIZON/1011073", "name": "Arizona", "color": "Brown", "description": "Sandale Arizona en cuir ciré cognac, double bride ajustable.", "materials": "Oiled leather upper, leather insole, cork footbed, EVA sole"},
    {"ref": "ARIZON/1016111", "name": "Arizona", "color": "Gold", "description": "Sandale Arizona finition métallisée dorée, double bride iconique.", "materials": "Birko-Flor upper, cork footbed, EVA sole"},
    {"ref": "ARIZON/1021476", "name": "Arizona Big Buckle", "color": "Black", "description": "Sandale Arizona Big Buckle finition vernie noire, grande boucle ardillon.", "materials": "Patent Birko-Flor upper, cork footbed, EVA sole"},
    {"ref": "ARIZON/1023960", "name": "Arizona", "color": "Copper", "description": "Sandale Arizona finition cuivre métallisée, double bride classique.", "materials": "Birko-Flor upper, cork footbed, EVA sole"},
    {"ref": "ARIZON/1024950", "name": "Arizona", "color": "Sand", "description": "Sandale Arizona en daim warm sand, lit de pied en liège naturel.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole"},
    {"ref": "ARIZON/1029260", "name": "Arizona", "color": "Beige", "description": "Sandale Arizona en daim sandcastle beige, double bride ajustable.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole"},
    {"ref": "ARIZON/1029353", "name": "Arizona Big Buckle", "color": "Black", "description": "Sandale Arizona Big Buckle vernie noire haute brillance, boucle oversize.", "materials": "Patent Birko-Flor upper, cork footbed, EVA sole"},
    {"ref": "ARIZON/1029390", "name": "Arizona", "color": "Taupe", "description": "Sandale Arizona en daim taupe, double bride et semelle EVA légère.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole"},
    {"ref": "ARIZON/1029651", "name": "Arizona Big Buckle EVA", "color": "White", "description": "Sandale Arizona Big Buckle en EVA blanc coquille, imperméable et ultra-légère.", "materials": "EVA upper and footbed, adjustable buckle"},
    {"ref": "ARIZON/1030389", "name": "Arizona Big Buckle EVA", "color": "Grey", "description": "Sandale Arizona Big Buckle en EVA gris taupe, lavable et antidérapante.", "materials": "EVA upper and footbed, adjustable buckle"},
    {"ref": "ARIZON/1030395", "name": "Arizona", "color": "Brown", "description": "Sandale Arizona en daim tabacco brown, double bride iconique Birkenstock.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole"},
    {"ref": "ARIZON/1030865", "name": "Arizona", "color": "Green", "description": "Sandale Arizona en daim dark tea avec lit de pied tonal assorti.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole"},
    {"ref": "ARIZON/1031254", "name": "Arizona", "color": "Pink", "description": "Sandale Arizona en daim pink clay, double bride confortable.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole"},
    {"ref": "ARIZON/1031596", "name": "Arizona", "color": "Purple", "description": "Sandale Arizona en daim faded purple avec lit de pied tonal violet.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole"},
    {"ref": "ARIZON/1031651", "name": "Arizona", "color": "Pink", "description": "Sandale Arizona en daim pink clay, lit de pied anatomique en liège.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole"},
    {"ref": "ARIZON/1032061", "name": "Arizona", "color": "Khaki", "description": "Sandale Arizona en daim faded khaki, double bride ajustable.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole"},
    {"ref": "ARIZONA/151183", "name": "Arizona", "color": "Brown", "description": "Sandale Arizona en daim mocca, double bride et semelle souple.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole, soft footbed"},
    {"ref": "ARIZONA/951303", "name": "Arizona", "color": "Taupe", "description": "Sandale Arizona en daim taupe, lit de pied souple et semelle EVA.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole, soft footbed"},
    {"ref": "ARIZONA/951313", "name": "Arizona", "color": "Brown", "description": "Sandale Arizona en daim mocca, double bride iconique Birkenstock.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole, soft footbed"},
    {"ref": "BOSTON/1024714", "name": "Boston", "color": "Green", "description": "Sabot Boston en daim thyme vert, bride ajustable et lit de pied souple.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole, soft footbed"},
    {"ref": "BOSTON/1025844", "name": "Boston", "color": "Khaki", "description": "Sabot Boston en daim faded khaki, modèle iconique à bride unique.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole, soft footbed"},
    {"ref": "BOSTON/1030418", "name": "Boston", "color": "Taupe", "description": "Sabot Boston en daim taupe, confort Birkenstock avec semelle souple.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole, soft footbed"},
    {"ref": "BOSTON/1030861", "name": "Boston", "color": "Green", "description": "Sabot Boston en daim dark tea avec lit de pied tonal vert.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole, soft footbed"},
    {"ref": "BOSTON/1030883", "name": "Boston", "color": "Beige", "description": "Sabot Boston en daim sandcastle beige, bride ajustable en liège.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole, soft footbed"},
    {"ref": "BOSTON/1031577", "name": "Boston", "color": "Purple", "description": "Sabot Boston en daim faded purple avec lit de pied tonal violet.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole, soft footbed"},
    {"ref": "BOSTON/1031635", "name": "Boston", "color": "Pink", "description": "Sabot Boston en daim pink clay, sabot fermé iconique Birkenstock.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole, soft footbed"},
    {"ref": "BOSTON/660463", "name": "Boston", "color": "Brown", "description": "Sabot Boston en cuir velours mocca, lit de pied souple et semelle EVA.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole, soft footbed"},
    {"ref": "BOSTON/660473", "name": "Boston", "color": "Black", "description": "Sabot Boston en cuir velours noir, bride ajustable et confort Birkenstock.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole, soft footbed"},
    {"ref": "FLORI/1029385", "name": "Florida Fresh", "color": "Black", "description": "Sandale Florida Fresh vernie noire, entre-doigt avec semelle légère.", "materials": "Patent Birko-Flor upper, cork footbed, EVA sole"},
    {"ref": "FLORI/1029818", "name": "Florida", "color": "White", "description": "Sandale Florida en Birko-Flor nacré blanc perle, modèle entre-doigt.", "materials": "Birko-Flor upper, cork footbed, EVA sole"},
    {"ref": "FLORI/1030352", "name": "Florida", "color": "Taupe", "description": "Sandale Florida en Birko-Flor taupe nacré, entre-doigt confortable.", "materials": "Birko-Flor upper, cork footbed, EVA sole"},
    {"ref": "FLORI/1031867", "name": "Florida Fresh", "color": "Brown", "description": "Sandale Florida Fresh en daim mink, entre-doigt avec finition premium.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole"},
    {"ref": "LOMA/1031652", "name": "Loma", "color": "Grey", "description": "Mule Loma en daim charcoal, design minimaliste à enfiler.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole"},
    {"ref": "MADRID/1006525", "name": "Madrid Big Buckle", "color": "Brown", "description": "Sandale Madrid Big Buckle en cuir ciré cognac, large boucle ardillon.", "materials": "Oiled leather upper, leather insole, cork footbed, EVA sole"},
    {"ref": "MADRID/1020632", "name": "Madrid", "color": "Taupe", "description": "Sandale Madrid en Birko-Flor taupe nacré, bride unique ajustable.", "materials": "Birko-Flor upper, cork footbed, EVA sole"},
    {"ref": "MADRID/1022650", "name": "Madrid Big Buckle", "color": "Black", "description": "Sandale Madrid Big Buckle vernie noire, bride large et semelle EVA.", "materials": "Patent Birko-Flor upper, cork footbed, EVA sole"},
    {"ref": "MAYARI/1016408", "name": "Mayari", "color": "Taupe", "description": "Sandale Mayari en Birko-Flor taupe nacré, entre-doigt avec bride croisée.", "materials": "Birko-Flor upper, cork footbed, EVA sole"},
    {"ref": "MAYARI/71661", "name": "Mayari", "color": "White", "description": "Sandale Mayari en Birko-Flor blanc perle, entre-doigt élégant.", "materials": "Birko-Flor upper, cork footbed, EVA sole"},
    {"ref": "NAPLES/1029710", "name": "Naples Wrapped", "color": "Taupe", "description": "Mule Naples Wrapped en daim taupe, bout enveloppé style mocassin.", "materials": "Suede leather upper, leather insole, cork footbed, EVA sole"},
]


def load_env():
    env = {}
    for line in (ROOT / ".env").read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env[k] = v
    return env


def apply_db(catalog):
    env = load_env()
    host = env.get("DB_HOST", "localhost")
    if host == "host.docker.internal":
        host = "127.0.0.1"
    conn = psycopg2.connect(
        host=host, port=env.get("DB_PORT", "5433"),
        user=env.get("DB_USERNAME"), password=env.get("DB_PASSWORD"),
        dbname=env.get("DB_DATABASE"),
    )
    cur = conn.cursor()
    for item in catalog:
        cur.execute(
            "UPDATE products SET name=%s, description=%s, materials=%s, updated_at=NOW() WHERE reference=%s",
            (item["name"], item["description"], item["materials"], item["ref"]),
        )
        cur.execute(
            "UPDATE variants SET color=%s, updated_at=NOW() WHERE product_id=(SELECT id FROM products WHERE reference=%s)",
            (item["color"], item["ref"]),
        )
    conn.commit()
    cur.execute(
        "SELECT COUNT(*) FROM products p JOIN brands b ON b.id=p.brand_id WHERE b.slug='birkenstock' AND p.description IS NOT NULL AND trim(p.description)!=''"
    )
    enriched = cur.fetchone()[0]
    conn.close()
    return enriched


def sync_csv(catalog):
    name_map = {c["ref"]: c["name"] for c in catalog}
    color_map = {c["ref"]: c["color"] for c in catalog}
    desc_map = {c["ref"]: c["description"] for c in catalog}
    mat_map = {c["ref"]: c["materials"] for c in catalog}

    rows = []
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter=";")
        fieldnames = list(reader.fieldnames or [])
        for col in ("description", "materials"):
            if col not in fieldnames:
                fieldnames.append(col)
        for row in reader:
            ref_full = row.get("reference", "")
            ref_base = ref_full.rsplit(" ", 1)[0] if ref_full else ""
            if ref_base in name_map:
                row["name"] = name_map[ref_base]
                row["color"] = color_map[ref_base]
                row["description"] = desc_map[ref_base]
                row["materials"] = mat_map[ref_base]
            rows.append(row)

    with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, delimiter=";", extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def main():
    assert len(CATALOG) == 41, f"Expected 41 entries, got {len(CATALOG)}"
    out = ROOT / "docs/imports/birkenstock-ss26-catalog.json"
    out.write_text(json.dumps(CATALOG, ensure_ascii=False, indent=2))
    print(f"Wrote {out} ({len(CATALOG)} refs)")
    enriched = apply_db(CATALOG)
    sync_csv(CATALOG)
    print(f"DB enriched: {enriched}/41 products")
    print(f"CSV synced: {CSV_PATH}")


if __name__ == "__main__":
    main()
