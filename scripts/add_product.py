#!/usr/bin/env python3
"""
Ajout d'un produit Reboul un par un (interactif).
Demande : ref, marque, genre, taille, couleur, stock, nom temporaire, prix temporaire.
Utilise l'API Admin (backend sur 4001). Collection = collection active.
Sans dépendance : uniquement stdlib (urllib, json).
"""
import json
import os
import sys
import urllib.request
import urllib.error

BASE_URL = os.environ.get("ADMIN_API_URL", "http://localhost:4001")


def _req(method, path, data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        print("Erreur API:", e.code, e.read().decode())
        sys.exit(1)
    except OSError as e:
        print("Connexion impossible (backend Admin sur 4001 ?):", e)
        sys.exit(1)


def get_token():
    token = os.environ.get("ADMIN_TOKEN")
    if token:
        return token
    email = os.environ.get("ADMIN_EMAIL")
    password = os.environ.get("ADMIN_PASSWORD")
    if not email or not password:
        print("Définis ADMIN_EMAIL et ADMIN_PASSWORD, ou ADMIN_TOKEN")
        sys.exit(1)
    out = _req("POST", "/admin/auth/login", {"email": email, "password": password})
    return out["accessToken"]


def main():
    token = get_token()
    categories = _req("GET", "/admin/reboul/products/categories", token=token)
    brands = _req("GET", "/admin/reboul/products/brands", token=token)

    ref = input("Référence : ").strip()
    if not ref:
        print("Référence obligatoire")
        sys.exit(1)

    marque = input("Marque : ").strip()
    brand_id = None
    if marque:
        for b in brands:
            if b.get("name", "").lower() == marque.lower():
                brand_id = b["id"]
                break
        if not brand_id:
            print(f"Marque '{marque}' non trouvée dans l'admin. Crée-la d'abord.")
            sys.exit(1)

    genre = input("Genre (catégorie) : ").strip()
    if not genre:
        print("Genre obligatoire")
        sys.exit(1)
    category_id = None
    for c in categories:
        if c.get("name", "").lower() == genre.lower():
            category_id = c["id"]
            break
    if not category_id:
        print(f"Catégorie '{genre}' non trouvée. Crée-la d'abord.")
        sys.exit(1)

    taille = input("Taille : ").strip()
    if not taille:
        print("Taille obligatoire")
        sys.exit(1)

    couleur = input("Couleur (vide = —) : ").strip() or "—"

    stock_s = input("Stock : ").strip()
    try:
        stock = int(stock_s)
    except ValueError:
        print("Stock doit être un nombre")
        sys.exit(1)

    nom_sugg = f"{genre} {marque}" if marque else genre
    nom = input(f"Nom produit temporaire [{nom_sugg}] : ").strip() or nom_sugg

    prix_s = input("Prix temporaire (€) : ").strip()
    try:
        price = float(prix_s.replace(",", "."))
    except ValueError:
        print("Prix invalide")
        sys.exit(1)

    sku = f"{ref}-{taille}" if taille else ref

    body = {
        "name": nom,
        "reference": ref,
        "price": price,
        "categoryId": category_id,
        "brandId": brand_id,
        "variants": [{"color": couleur, "size": taille, "stock": stock, "sku": sku}],
    }

    out = _req("POST", "/admin/reboul/products", body, token=token)
    print("Produit créé :", out.get("name", ref))


if __name__ == "__main__":
    main()
