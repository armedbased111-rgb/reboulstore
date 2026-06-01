#!/usr/bin/env python3
"""Catalog Birkenstock SS26 products from PDF scans + face images, update DB + CSV."""
import base64
import csv
import json
import os
import re
import subprocess
import time
from pathlib import Path
from typing import List, Optional, Tuple

import psycopg2
import requests

ROOT = Path(__file__).resolve().parent.parent
ICLOUD = Path.home() / "Library/Mobile Documents/com~apple~CloudDocs/Collection reboulstore /BIRKENSTOCK"
OUTPUT = ROOT / "output_batch_birkenstock"
SCAN_TMP = Path("/tmp/birkenstock_scans")
CSV_PATH = ROOT / "docs/imports/import-birkenstock-ss26.csv"

REF_ALIASES = {"BOSTON/1030861": "BOSTON/1030851"}

MODEL_NAMES = {
    "BOSTON": "Boston",
    "ARIZONA": "Arizona",
    "ARIZON": "Arizona",
    "FLORI": "Florida",
    "MADRID": "Madrid",
    "MAYARI": "Mayari",
    "NAPLES": "Naples Wrapped",
    "LOMA": "Loma",
}

SIMPLE_COLORS = {
    "Mocca": "Brown",
    "Black": "Black",
    "Faded Khaki": "Khaki",
    "Sandcastle": "Beige",
    "Charcoal": "Grey",
    "Taupe": "Taupe",
    "Mink": "Brown",
    "Graceful Pearl White": "White",
    "Graceful Taupe": "Taupe",
    "Cognac": "Brown",
    "Gold": "Gold",
    "High-Shine Black": "Black",
    "Copper": "Copper",
    "Warm Sand": "Sand",
    "Tabacco Brown": "Brown",
    "Dark Tea Tonal FB": "Green",
    "Pink Clay": "Pink",
    "Faded Purple Tonal FB": "Purple",
    "Eggshell": "White",
    "Gray Taupe": "Grey",
    "Thyme": "Green",
}


def load_env():
    env = {}
    for line in (ROOT / ".env").read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env[k] = v
    return env


def db_connect(env):
    host = env.get("DB_HOST", "localhost")
    if host == "host.docker.internal":
        host = "127.0.0.1"
    return psycopg2.connect(
        host=host,
        port=env.get("DB_PORT", "5433"),
        user=env.get("DB_USERNAME", "reboulstore"),
        password=env.get("DB_PASSWORD", ""),
        dbname=env.get("DB_DATABASE", "reboulstore_db"),
    )


def ref_to_folder(ref: str) -> str:
    alias = REF_ALIASES.get(ref, ref)
    return alias.replace("/", "_")


def find_pdf(ref: str) -> Optional[Path]:
    alias = REF_ALIASES.get(ref, ref)
    prefix, code = alias.split("/")
    folder = ICLOUD / f"{prefix}:{code}"
    if not folder.exists():
        return None
    pdfs = list(folder.glob("*.pdf"))
    return pdfs[0] if pdfs else None


def find_face(ref: str) -> Optional[Path]:
    folder = OUTPUT / ref_to_folder(ref)
    if not folder.exists():
        return None
    faces = sorted(folder.glob("1_face*.png"))
    if faces:
        return faces[0]
    alias_folder = OUTPUT / ref.replace("/", "_")
    if alias_folder.exists():
        faces = sorted(alias_folder.glob("1_face*.png"))
        if faces:
            return faces[0]
    icloud_ref = REF_ALIASES.get(ref, ref)
    prefix, code = icloud_ref.split("/")
    icloud_dir = ICLOUD / f"{prefix}:{code}"
    if icloud_dir.exists():
        for ext in ("face.jpeg", "face.jpg", "face.JPG", "face.png"):
            p = icloud_dir / ext
            if p.exists():
                return p
    return None


def pdf_to_png(pdf: Path, out_base: Path) -> List[Path]:
    SCAN_TMP.mkdir(parents=True, exist_ok=True)
    out_base.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["pdftoppm", "-png", "-r", "150", str(pdf), str(out_base)],
        check=True,
        capture_output=True,
    )
    return sorted(out_base.parent.glob(f"{out_base.name}-*.png"))


def b64(path: Path) -> Tuple[str, str]:
    mime = "image/png" if path.suffix.lower() == ".png" else "image/jpeg"
    return base64.b64encode(path.read_bytes()).decode(), mime


def gemini_catalog(api_key: str, ref: str, db_name: str, db_color: str, images: List[Path]) -> dict:
    prefix = ref.split("/")[0]
    default_name = MODEL_NAMES.get(prefix, db_name.replace(" BS", "").replace(" Birkenstock", ""))

    prompt = f"""Analyze these Birkenstock product images (box label + product photo if present).
Reference: {ref}
Current DB name: {db_name}
Current DB color: {db_color}

Return ONLY valid JSON (no markdown):
{{
  "name": "Model name WITHOUT Birkenstock prefix (e.g. Boston, Arizona, Arizona Big Buckle EVA, Madrid Big Buckle, Florida Fresh, Naples Wrapped, Loma, Mayari)",
  "color": "Simple English color (e.g. Brown, Black, White, Taupe, Khaki - NOT marketing names like Mocca or Graceful Pearl White)",
  "description": "One concise French sentence describing the sandal/clog (style, material, key feature). Max 200 chars.",
  "materials": "English materials from box label if visible, e.g. Suede leather upper, leather insole, cork footbed, EVA sole. Include Soft Footbed if mentioned."
}}

Rules:
- name: drop BS suffix unless it's a distinct sub-model (Big Buckle EVA, Big Buckle, Fresh, Wrapped)
- For EVA models: materials should mention EVA upper/footbed
- For Birko-Flor/Graceful: synthetic upper
- For suede/leather (Veloursleder): suede leather upper
- Use box label page 2 for exact materials when visible"""

    parts = [{"text": prompt}]
    for img in images[:3]:
        data, mime = b64(img)
        parts.append({"inline_data": {"mime_type": mime, "data": data}})

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {"responseModalities": ["TEXT"], "temperature": 0.2},
    }
    resp = requests.post(
        url,
        headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
        json=body,
        timeout=60,
    )
    resp.raise_for_status()
    text = ""
    for part in resp.json().get("candidates", [{}])[0].get("content", {}).get("parts", []):
        if "text" in part:
            text += part["text"]
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\n?", "", text)
        text = re.sub(r"\n?```$", "", text)
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        data = {
            "name": default_name,
            "color": SIMPLE_COLORS.get(db_color, db_color),
            "description": f"Sabot/sandale Birkenstock {default_name} couleur {db_color}.",
            "materials": "Suede leather upper, leather insole, cork footbed, EVA sole",
        }
    data["ref"] = ref
    return data


def fallback_catalog(ref: str, db_name: str, db_color: str) -> dict:
    prefix = ref.split("/")[0]
    name = MODEL_NAMES.get(prefix, db_name.replace(" BS", ""))
    if "Big Buckle EVA" in db_name:
        name = "Arizona Big Buckle EVA"
    elif "Big Buckle" in db_name:
        name = f"{MODEL_NAMES.get(prefix, prefix.title())} Big Buckle"
    elif "Fresh" in db_name:
        name = "Florida Fresh"
    elif "Wrapped" in db_name:
        name = "Naples Wrapped"

    color = SIMPLE_COLORS.get(db_color, db_color)
    is_eva = "EVA" in db_name or "EVA" in db_color
    if is_eva:
        materials = "EVA upper and footbed, adjustable buckle"
        desc = f"Sabot/sandale {name} Birkenstock en EVA léger, imperméable et facile d'entretien."
    elif "Graceful" in db_color or "Pearl" in db_color:
        materials = "Birko-Flor upper, cork footbed, EVA sole"
        desc = f"Sandale {name} Birkenstock en Birko-Flor finition nacrée, lit de pied en liège."
    elif "High-Shine" in db_color:
        materials = "Patent Birko-Flor upper, cork footbed, EVA sole"
        desc = f"Sandale {name} Birkenstock finition vernie brillante, double boucle ajustable."
    else:
        materials = "Suede leather upper, leather insole, cork footbed, EVA sole"
        desc = f"Sabot {name} Birkenstock en cuir velours, bride ajustable et lit de pied anatomique en liège."

    return {"ref": ref, "name": name, "color": color, "description": desc, "materials": materials}


def get_db_products(conn) -> List[dict]:
    cur = conn.cursor()
    cur.execute(
        """
        SELECT p.id, p.reference, p.name,
               (SELECT v.color FROM variants v WHERE v.product_id = p.id LIMIT 1)
        FROM products p
        JOIN brands b ON p.brand_id = b.id
        WHERE b.slug = 'birkenstock'
        ORDER BY p.reference
        """
    )
    return [{"id": r[0], "ref": r[1], "name": r[2], "color": r[3]} for r in cur.fetchall()]


def apply_db(conn, catalog: List[dict]) -> int:
    cur = conn.cursor()
    count = 0
    for item in catalog:
        cur.execute(
            "UPDATE products SET name=%s, description=%s, materials=%s, updated_at=NOW() WHERE reference=%s",
            (item["name"], item["description"], item["materials"], item["ref"]),
        )
        cur.execute(
            "UPDATE variants SET color=%s, updated_at=NOW() WHERE product_id=(SELECT id FROM products WHERE reference=%s)",
            (item["color"], item["ref"]),
        )
        count += cur.rowcount
    conn.commit()
    return len(catalog)


def sync_csv(catalog: List[dict]):
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
    env = load_env()
    api_key = env.get("GEMINI_API_KEY", "")
    products = get_db_products(db_connect(env))
    print(f"Found {len(products)} products in DB")

    catalog = []
    for i, p in enumerate(products, 1):
        ref = p["ref"]
        images = []
        pdf = find_pdf(ref)
        if pdf:
            scan_base = SCAN_TMP / ref_to_folder(ref)
            pages = sorted(SCAN_TMP.glob(f"{scan_base.name}-*.png"))
            if not pages:
                try:
                    pages = pdf_to_png(pdf, scan_base)
                except subprocess.CalledProcessError as e:
                    print(f"  [{i}] PDF convert failed {ref}: {e.stderr.decode()[:100]}")
            if len(pages) >= 2:
                images.append(pages[1])
            elif pages:
                images.append(pages[0])
        face = find_face(ref)
        if face:
            images.append(face)

        if api_key and images:
            try:
                item = gemini_catalog(api_key, ref, p["name"], p["color"], images)
                print(f"  [{i}/{len(products)}] {ref} -> {item['name']} / {item['color']}")
                time.sleep(0.5)
            except Exception as e:
                print(f"  [{i}] Gemini failed {ref}: {e}, using fallback")
                item = fallback_catalog(ref, p["name"], p["color"])
        else:
            item = fallback_catalog(ref, p["name"], p["color"])
            print(f"  [{i}/{len(products)}] {ref} -> {item['name']} (fallback)")

        catalog.append(item)

    out_json = ROOT / "docs/imports/birkenstock-ss26-catalog.json"
    out_json.write_text(json.dumps(catalog, ensure_ascii=False, indent=2))
    print(f"\nWrote {out_json}")

    conn = db_connect(env)
    n = apply_db(conn, catalog)
    conn.close()
    sync_csv(catalog)
    print(f"Updated {n} products in DB + synced CSV")
    return catalog


if __name__ == "__main__":
    main()
