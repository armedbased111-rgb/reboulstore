"""
Lookup produit en base pour déterminer le product_type (shoe / garment).
Connexion via psycopg2 sur le tunnel SSH (port 5433 par défaut).
Fallback silencieux si DB inaccessible.
"""
import os
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv

# Charge le .env du projet racine
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
load_dotenv(_PROJECT_ROOT / ".env")

# Catégories considérées comme "shoe"
SHOE_CATEGORIES = {"basket", "baskets", "sneakers", "sneaker", "chaussures", "chaussure", "boots", "boot", "sandales", "sandale"}


def _get_db_conn():
    try:
        import psycopg2
        # host.docker.internal est pour Docker — depuis le Mac on utilise localhost (tunnel SSH)
        host = os.getenv("DB_HOST", "host.docker.internal")
        if host == "host.docker.internal":
            host = "localhost"
        return psycopg2.connect(
            host=host,
            port=int(os.getenv("DB_PORT", 5433)),
            user=os.getenv("DB_USERNAME", "reboulstore"),
            password=os.getenv("DB_PASSWORD", "reboulstore_password"),
            dbname=os.getenv("DB_DATABASE", "reboulstore_db"),
            connect_timeout=3,
        )
    except Exception:
        return None


def get_products_info_batch(folder_names: list[str]) -> dict[str, dict]:
    """
    Retourne un dict {folder_name: {name, category}} pour une liste de refs.
    Fallback silencieux si DB inaccessible.
    """
    if not folder_names:
        return {}
    conn = _get_db_conn()
    if conn is None:
        return {}
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT REPLACE(p.reference, '/', '-'), p.name, c.name
                FROM products p
                JOIN categories c ON c.id = p.category_id
                WHERE REPLACE(p.reference, '/', '-') = ANY(%s)
                """,
                (folder_names,),
            )
            return {
                row[0]: {"name": row[1], "category": row[2]}
                for row in cur.fetchall()
            }
    except Exception:
        return {}
    finally:
        conn.close()


def folder_name_to_ref(folder_name: str) -> str:
    """Convertit nom de dossier (AULM-BH02) en ref DB (AULM/BH02)."""
    return folder_name.replace("-", "/")


def get_product_type_from_db(folder_name: str, fallback: str = "garment") -> str:
    """
    Retourne 'shoe' ou 'garment' en cherchant la catégorie du produit en DB.
    Utilise REPLACE(reference, '/', '-') pour matcher le nom de dossier directement.
    Fallback sur `fallback` si DB inaccessible ou ref introuvable.
    """
    conn = _get_db_conn()
    if conn is None:
        return fallback

    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT c.name
                FROM products p
                JOIN categories c ON c.id = p.category_id
                WHERE REPLACE(p.reference, '/', '-') ILIKE %s
                LIMIT 1
                """,
                (folder_name,),
            )
            row = cur.fetchone()
            if row:
                category = row[0].lower().strip()
                return "shoe" if category in SHOE_CATEGORIES else "garment"
            return fallback
    except Exception:
        return fallback
    finally:
        conn.close()
