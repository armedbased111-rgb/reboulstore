"""
Commandes pour gérer les shops (politiques livraison/retour)
"""

import json
import urllib.request
import urllib.error


def get_shop(backend_url: str, shop_id: int) -> dict:
    with urllib.request.urlopen(f"{backend_url}/shops/{shop_id}") as r:
        return json.load(r)


def patch_shop(backend_url: str, shop_id: int, payload: dict) -> dict:
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"{backend_url}/shops/{shop_id}", data=data, method="PATCH"
    )
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req) as r:
        return json.load(r)


def list_shops(backend_url: str) -> list:
    with urllib.request.urlopen(f"{backend_url}/shops") as r:
        d = json.load(r)
    return d if isinstance(d, list) else d.get("shops", d.get("data", []))
