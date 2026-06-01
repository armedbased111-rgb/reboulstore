#!/usr/bin/env python3
"""Sync saucony-ss26-catalog.json → import-saucony-ss26.csv (name, color, description, materials)."""

import csv
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CATALOG = ROOT / "saucony-ss26-catalog.json"
CSV_PATH = ROOT / "import-saucony-ss26.csv"


def ref_base(reference: str) -> str:
    reference = (reference or "").strip()
    parts = reference.split()
    if len(parts) > 1:
        return " ".join(parts[:-1]).strip()
    return reference


def main() -> None:
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    by_ref = {p["reference"]: p for p in catalog["products"]}

    with CSV_PATH.open(encoding="utf-8-sig") as f:
        first = f.readline()
        sep = ";" if ";" in first else ","
        f.seek(0)
        reader = csv.DictReader(f, delimiter=sep)
        fieldnames = list(reader.fieldnames or [])
        for col in ("description", "materials", "color"):
            if col not in fieldnames:
                fieldnames.append(col)
        rows = list(reader)

    updated = 0
    for row in rows:
        base = ref_base(row.get("reference", ""))
        info = by_ref.get(base)
        if not info:
            continue
        row["name"] = info["name"]
        row["color"] = info["color"]
        row["description"] = info["description"]
        row["materials"] = info["materials"]
        updated += 1

    with CSV_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, delimiter=sep, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)

    print(f"CSV synced: {updated} rows enriched ({len(by_ref)} products)")


if __name__ == "__main__":
    main()
