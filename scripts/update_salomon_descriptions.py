#!/usr/bin/env python3
"""Met à jour description + materials des produits Salomon en DB via SSH (VPS)."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "cli"))

from utils.server_helper import ssh_exec, SERVER_CONFIG

UPDATES = [
    {
        "name_like": "Salomon XT-6 GTX",
        "description": (
            "Version imperméable de l'iconique XT-6, le XT-6 GORE-TEX intègre une membrane "
            "GORE-TEX ultra-légère et sans PFC pour une protection totale contre les intempéries. "
            "Confort, amorti et grip signature pour un usage urbain toutes conditions."
        ),
        "materials": (
            "Tige mesh avec TPU anti-abrasion, membrane GORE-TEX ePE (sans PFC), doublure textile, "
            "semelle EnergyCell + agileCHASSIS, semelle OrthoLite® moulée, semelle extérieure Mud contaGRIP®"
        ),
    },
    {
        "name_like": "Salomon XT-4 OG GTX",
        "description": (
            "La version GORE-TEX du XT-4 OG allie l'esthétique vintage iconique à une imperméabilité totale. "
            "Membrane GORE-TEX légère pour un usage urbain tout temps, sans compromis sur le style archive."
        ),
        "materials": (
            "Tige mesh avec TPU anti-abrasion, membrane GORE-TEX (sans PFC), doublure textile, "
            "semelle EnergyCell + agileChassis Skeleton, semelle OrthoLite® moulée, semelle extérieure Mud contaGRIP®"
        ),
    },
    {
        "name_like": "Salomon XT-4 OG",
        "name_not_like": "GTX",
        "description": (
            "Ressortie des archives Salomon, la XT-4 OG apporte une énergie vintage aux rues de la ville. "
            "Silhouette culte des années 90 revisitée avec les technologies de stabilité et de confort "
            "actuelles pour un style affirmé et une polyvalence quotidienne."
        ),
        "materials": (
            "Tige mesh anti-débris, doublure textile, semelle EnergyCell + agileChassis Skeleton, "
            "semelle OrthoLite® moulée, semelle extérieure Mud contaGRIP®"
        ),
    },
    {
        "name_like": "Salomon XT-6",
        "name_not_like": "GTX",
        "description": (
            "Icône légendaire du trail réinterprétée pour la ville, le XT-6 allie un héritage de confort, "
            "d'amorti et de durabilité à des coloris audacieux. Sa semelle EnergyCell, son châssis "
            "agileCHASSIS et sa semelle extérieure Mud contaGRIP® en font une sneaker aussi technique qu'urbaine."
        ),
        "materials": (
            "Tige mesh anti-débris, TPU anti-abrasion, doublure textile, semelle EnergyCell + agileCHASSIS, "
            "semelle OrthoLite® moulée, semelle extérieure Mud contaGRIP®"
        ),
    },
    {
        "name_like": "Salomon Whisper Void",
        "description": (
            "La XT-Whisper Void revisite un classique Salomon dans des coloris éthérés et apaisants. "
            "Silhouette épurée et enveloppante, elle conjugue stabilité, grip et doublure ultra-douce "
            "pour une sneaker unique qui inspire confiance au quotidien."
        ),
        "materials": (
            "Tige mesh 3D respirant, TPU anti-abrasion, mesh anti-débris, système Quicklace™, "
            "doublure textile, semelle OrthoLite® diecut, semelle extérieure contaGRIP®"
        ),
    },
    {
        "name_like": "Salomon XT Pathway",
        "description": (
            "La XT Pathway est pensée pour affronter le quotidien avec légèreté et durabilité. "
            "Sa construction mesh anti-débris, son amorti EnergyCell et son système Quicklace™ en font "
            "la sneaker idéale pour la ville, alliant confort discret et style épuré."
        ),
        "materials": (
            "Tige synthétique mesh anti-débris, doublure textile, semelle EnergyCell + agileCHASSIS, "
            "semelle OrthoLite® diecut, semelle extérieure caoutchouc"
        ),
    },
    {
        "name_like": "MM6 x Salomon Cross",
        "description": (
            "Née de la collaboration entre MM6 Maison Margiela et Salomon, la Cross fusionne l'avant-garde "
            "parisienne et l'expertise technique de montagne. Tige ripstop enveloppante, amorti EnergyCell "
            "et semelle contaGRIP® pour une sneaker hybride à l'intersection du streetwear et de la performance trail."
        ),
        "materials": (
            "Tige ripstop polyester recyclable, mesh et jersey élastique, "
            "semelle intermédiaire EnergyCell, semelle extérieure contaGRIP®"
        ),
    },
]


def escape(s):
    return s.replace("'", "''")


def run_update(name_like, description, materials, name_not_like=None):
    where = f"name ILIKE '%{escape(name_like)}%'"
    if name_not_like:
        where += f" AND name NOT ILIKE '%{escape(name_not_like)}%'"
    sql = (
        f"UPDATE products SET "
        f"description = '{escape(description)}', "
        f"materials = '{escape(materials)}' "
        f"WHERE {where};"
    )

    safe_sql = sql.replace('"', '\\"')
    project_dir = SERVER_CONFIG["project_path"]
    remote_cmd = (
        f"cd {project_dir} && "
        f"docker exec reboulstore-postgres-prod "
        f'psql -U reboulstore -d reboulstore_db -c "{safe_sql}"'
    )

    stdout, stderr, code = ssh_exec(remote_cmd, return_code=True)
    if code != 0:
        print(f"  ❌ ERREUR [{name_like}]: {stderr or stdout}")
    else:
        rows = stdout.strip() if stdout else ""
        print(f"  ✅ {name_like!r} → {rows}")


def main():
    print("🔄 Mise à jour descriptions + materials Salomon...\n")
    for u in UPDATES:
        run_update(
            name_like=u["name_like"],
            description=u["description"],
            materials=u["materials"],
            name_not_like=u.get("name_not_like"),
        )
    print("\n✅ Terminé.")


if __name__ == "__main__":
    main()
