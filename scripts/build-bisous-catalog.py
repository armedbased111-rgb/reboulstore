#!/usr/bin/env python3
"""Regenerate import-bisous-ss26.csv with catalog metadata."""

import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_OUT = ROOT / "docs/imports/import-bisous-ss26.csv"

# ref base -> catalog (name without brand, color, price, category, description FR, materials)
CATALOG = {
    "SS26/49": {
        "name": "Sweat Écusson Peace",
        "color": "Noir",
        "price": "135",
        "category": "sweat",
        "description": "Sweat à capuche noir avec poche kangourou. Écusson Bisous Skateboards et symbole peace rose sur la poitrine.",
        "materials": "80% coton, 20% polyester",
    },
    "SS26/85": {
        "name": "Chaussettes Logo Triple",
        "color": "Vert clair",
        "price": "25",
        "category": "chaussettes",
        "description": "Chaussettes mi-hautes vert clair, logo BISOUS triple imprimé en noir sur la cheville.",
        "materials": "80% coton, 17% polyamide, 3% élasthanne",
    },
    "SS26/86": {
        "name": "Chaussettes Logo Triple",
        "color": "Jaune pâle",
        "price": "25",
        "category": "chaussettes",
        "description": "Chaussettes mi-hautes jaune pâle, logo BISOUS triple brodé en bordeaux.",
        "materials": "80% coton, 17% polyamide, 3% élasthanne",
    },
    "SS26/87": {
        "name": "Chaussettes Logo Triple",
        "color": "Noir",
        "price": "25",
        "category": "chaussettes",
        "description": "Chaussettes mi-hautes noires, triple logo Bisous brodé en rose.",
        "materials": "80% coton, 17% polyamide, 3% élasthanne",
    },
    "SS26/88": {
        "name": "Chaussettes Logo Triple",
        "color": "Blanc",
        "price": "25",
        "category": "chaussettes",
        "description": "Chaussettes mi-hautes blanches, triple logo Bisous brodé bleu ciel.",
        "materials": "80% coton, 17% polyamide, 3% élasthanne",
    },
    "SS26/91": {
        "name": "Chaussettes Logo Triple",
        "color": "Vert forêt",
        "price": "25",
        "category": "chaussettes",
        "description": "Chaussettes mi-hautes vert forêt, triple logo Bisous brodé blanc.",
        "materials": "80% coton, 17% polyamide, 3% élasthanne",
    },
    "SS26/92": {
        "name": "Chaussettes Tie-Dye",
        "color": "Violet",
        "price": "25",
        "category": "chaussettes",
        "description": "Chaussettes tie-dye violet et lilas, triple logo Bisous brodé bleu ciel.",
        "materials": "80% coton, 17% polyamide, 3% élasthanne",
    },
    "SS26/93": {
        "name": "Chaussettes Love Tie-Dye",
        "color": "Bleu",
        "price": "25",
        "category": "chaussettes",
        "description": "Chaussettes tie-dye bleu et blanc, broderie Love triple en blanc.",
        "materials": "80% coton, 17% polyamide, 3% élasthanne",
    },
    "SS26/94": {
        "name": "Chaussettes Logo",
        "color": "Orange",
        "price": "25",
        "category": "chaussettes",
        "description": "Chaussettes mi-hautes orange vif, logo Bisous brodé verticalement en noir.",
        "materials": "80% coton, 17% polyamide, 3% élasthanne",
    },
    "SS26/60": {
        "name": "Short de bain Vichy",
        "color": "Vert",
        "price": "70",
        "category": "maillot homme",
        "description": "Short de bain à carreaux vichy vert et noir. Triple logo Bisous rose sur la jambe.",
        "materials": "100% polyester",
    },
    "SS26/61": {
        "name": "Short de bain Rayures",
        "color": "Navy",
        "price": "70",
        "category": "maillot homme",
        "description": "Short de bain à rayures bleu marine et blanc. Triple logo Bisous rose.",
        "materials": "100% polyester",
    },
    "SS26/62": {
        "name": "Short de bain Vichy",
        "color": "Bleu",
        "price": "70",
        "category": "maillot homme",
        "description": "Short de bain vichy bleu et blanc. Triple logo Bisous rose, taille élastique.",
        "materials": "100% polyester",
    },
    "SS26/74": {
        "name": "Laisse pour chien",
        "color": "Uni",
        "price": "100",
        "category": "accessoires",
        "description": "Laisse pour chien Bisous Skateboards, finition résistante pour la promenade.",
        "materials": "Polyester, métal",
    },
    "SS26/75": {
        "name": "Collier pour chien",
        "color": "Uni",
        "price": "100",
        "category": "accessoires",
        "description": "Collier pour chien Bisous Skateboards, boucle métal et sangle réglable.",
        "materials": "Nylon, métal",
    },
    "SS26/76": {
        "name": "Accessoire",
        "color": "Uni",
        "price": "100",
        "category": "accessoires",
        "description": "Accessoire lifestyle Bisous Skateboards.",
        "materials": "Mixte",
    },
    "SS26/77": {
        "name": "Porte-clés",
        "color": "Modèle 1",
        "price": "25",
        "category": "accessoires",
        "description": "Porte-clés Bisous Skateboards, finition métal et logo marque.",
        "materials": "Métal, résine",
    },
    "SS26/78": {
        "name": "Porte-clés",
        "color": "Modèle 2",
        "price": "25",
        "category": "accessoires",
        "description": "Porte-clés Bisous Skateboards, finition métal et logo marque.",
        "materials": "Métal, résine",
    },
    "SS26/79": {
        "name": "Porte-clés",
        "color": "Modèle 3",
        "price": "25",
        "category": "accessoires",
        "description": "Porte-clés Bisous Skateboards, finition métal et logo marque.",
        "materials": "Métal, résine",
    },
    "SS26/80": {
        "name": "Porte-clés",
        "color": "Modèle 4",
        "price": "25",
        "category": "accessoires",
        "description": "Porte-clés Bisous Skateboards, finition métal et logo marque.",
        "materials": "Métal, résine",
    },
    "SS26/81": {
        "name": "Porte-clés",
        "color": "Modèle 5",
        "price": "25",
        "category": "accessoires",
        "description": "Porte-clés Bisous Skateboards, finition métal et logo marque.",
        "materials": "Métal, résine",
    },
    "SS26/12": {
        "name": "T-shirt Logo Triple",
        "color": "Blanc",
        "price": "65",
        "category": "tee shirt",
        "description": "T-shirt coton blanc, triple logo BISOUS rose et vert sur la poitrine.",
        "materials": "100% coton",
    },
    "SS26/16": {
        "name": "T-shirt Logo Triple",
        "color": "Bleu Royal",
        "price": "65",
        "category": "tee shirt",
        "description": "T-shirt bleu royal, triple logo Bisous rose script sur la poitrine.",
        "materials": "100% coton",
    },
    "SS26/22": {
        "name": "T-shirt Logo Géométrique",
        "color": "Blanc",
        "price": "65",
        "category": "tee shirt",
        "description": "T-shirt blanc, logo Bisous dans un losange rose et bleu sur la poitrine.",
        "materials": "100% coton",
    },
    "SS26/24": {
        "name": "T-shirt Pal For Life",
        "color": "Rose",
        "price": "65",
        "category": "tee shirt",
        "description": "T-shirt rose chiné, imprimé Pal For Life avec portrait de chien et message fidélité.",
        "materials": "100% coton",
    },
    "SS26/27": {
        "name": "T-shirt Bisous du Monde",
        "color": "Blanc",
        "price": "65",
        "category": "tee shirt",
        "description": "T-shirt blanc, grille multilingue du mot bisou et illustration de baiser.",
        "materials": "100% coton",
    },
    "SS26/28": {
        "name": "T-shirt Glamour Club",
        "color": "Navy",
        "price": "65",
        "category": "tee shirt",
        "description": "T-shirt navy, logo Bisous rose et inscription Glamour Skateboard Club.",
        "materials": "100% coton",
    },
    "SS26/30": {
        "name": "T-shirt Logo Psyché",
        "color": "Jaune",
        "price": "65",
        "category": "tee shirt",
        "description": "T-shirt jaune, motif BISOUS psyché répété au dos en lettrage bubble.",
        "materials": "100% coton",
    },
    "SS26/34": {
        "name": "T-shirt Logo Central",
        "color": "Blanc",
        "price": "65",
        "category": "tee shirt",
        "description": "T-shirt blanc, grand logo BISOUS rose effet grainé centré sur la poitrine.",
        "materials": "100% coton",
    },
    "SS26/37": {
        "name": "T-shirt Écusson Peace",
        "color": "Blanc",
        "price": "65",
        "category": "tee shirt",
        "description": "T-shirt blanc, écusson Bisous Skateboards violet et symbole peace rose.",
        "materials": "100% coton",
    },
    "SS26/38": {
        "name": "T-shirt Écusson Peace",
        "color": "Noir",
        "price": "65",
        "category": "tee shirt",
        "description": "T-shirt noir, écusson Bisous Skateboards et symbole peace rose sur la poitrine.",
        "materials": "100% coton",
    },
    "SS26/4": {
        "name": "T-shirt Logo Triple",
        "color": "Bleu Poudré",
        "price": "65",
        "category": "tee shirt",
        "description": "T-shirt bleu poudré, triple logo Bisous bordeaux sur la poitrine.",
        "materials": "100% coton",
    },
    "SS26/8": {
        "name": "T-shirt Logo Triple",
        "color": "Blanc",
        "price": "65",
        "category": "tee shirt",
        "description": "T-shirt blanc, triple logo Bisous rose script empilé sur la poitrine.",
        "materials": "100% coton",
    },
    "SS26/9": {
        "name": "T-shirt Logo Triple",
        "color": "Noir",
        "price": "65",
        "category": "tee shirt",
        "description": "T-shirt noir, triple logo Bisous rose script sur la poitrine gauche.",
        "materials": "100% coton",
    },
}


def ref_base(ref: str) -> str:
    ref = ref.strip()
    parts = ref.split()
    if len(parts) > 1:
        return " ".join(parts[:-1])
    return ref


def main():
    rows_out = []
    with open(CSV_OUT, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, delimiter=";")
        fieldnames = [
            "cod_article",
            "name",
            "reference",
            "description",
            "price",
            "brand",
            "category",
            "collection",
            "color",
            "size",
            "stock",
            "sku",
            "materials",
        ]
        for row in reader:
            base = ref_base(row.get("reference", ""))
            cat = CATALOG.get(base)
            if not cat:
                raise SystemExit(f"Missing catalog entry for {base}")
            ref_full = row["reference"].strip()
            size = ref_full.split()[-1] if " " in ref_full else "UN"
            sku = ref_full.replace("/", "-").replace(" ", "-")
            rows_out.append(
                {
                    "cod_article": row.get("cod_article", ""),
                    "name": cat["name"],
                    "reference": ref_full,
                    "description": cat["description"],
                    "price": cat["price"],
                    "brand": "Bisous Skateboards",
                    "category": cat["category"],
                    "collection": "SS26",
                    "color": cat["color"],
                    "size": size,
                    "stock": row.get("stock", "2"),
                    "sku": sku,
                    "materials": cat["materials"],
                }
            )

    with open(CSV_OUT, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, delimiter=";")
        w.writeheader()
        w.writerows(rows_out)

    bases = {ref_base(r["reference"]) for r in rows_out}
    print(f"Wrote {len(rows_out)} variant rows, {len(bases)} products -> {CSV_OUT}")


if __name__ == "__main__":
    main()
