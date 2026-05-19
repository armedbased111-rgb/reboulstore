---
type: architecture
---
# Workflow — Intégration d'une collection

Liens : [[Architecture/Architecture]]

Pipeline standard pour toute nouvelle marque / réassort SS26.

---

## Les 5 étapes dans l'ordre

### 1. Photos + scan étiquettes

- Photographier chaque ref : `face.jpeg` + `back.jpeg`
- Scanner l'étiquette boîte : `Document scanné.pdf` dans le même dossier
- Dossier iCloud : `Collection reboulstore /MARQUE/REF/`
- L'étiquette = source de vérité pour : nom modèle, couleur exacte, prix, tailles

### 2. Mise à jour CSV

- Comparer feuilles de stock (`feuille de stockage/MARQUE/`) avec le CSV existant
- Identifier les refs manquantes / à ajouter
- Lire les étiquettes scannées pour renseigner : nom, couleur, prix, tailles exactes
- Si tailles inconnues → utiliser pattern des refs similaires, ajuster après
- Importer dans le CSV : `docs/imports/import-MARQUE-ss26.csv`

```
Format CSV : cod_article;name;reference;brand;category;collection;stock;price;color (+ sku si besoin). `cod_article` en 1ʳᵉ colonne (vide si inconnu).
```

### 3. Import Admin Centrale

- Admin → Import Collection → uploader le CSV
- Upsert sur reference/SKU → pas de doublon, stock mis à jour
- Vérifier avec `./rcli db product-list --brand "marque"`

### 4. Pipeline images IA

```bash
# Flat lay (vêtements)
./rcli images generate-batch \
  --input-dir "~/iCloud/Collection reboulstore/MARQUE/" \
  -o ./output_batch_marque \
  --refs-dir refs_empty \
  --gemini-flash --flash-attempts 4 \
  --delay 30

# Chaussures / sandales
./rcli images generate-batch ... --product-type shoe
```

- Vérifier hallucinations après génération
- Correction couleur : `./rcli images color-fix --batch output_batch_marque/`

### 5. Retouche Photoshop

- Ouvrir les images générées dans Photoshop
- Ajustements fins : lumière, contraste, cohérence entre face et back
- Recadrage si nécessaire (centrage PIL d'abord si pb de centrage)
- Valider qualité avant upload

---

## Après validation

```bash
./rcli images upload-batch --batch output_batch_marque/
```

URLs Cloudinary enregistrées en BDD → images visibles sur le site immédiatement.

---

## Notes par type de produit

| Type | Pipeline IA | Vues |
|------|-------------|------|
| Vêtements (flat lay) | `generate-batch` standard | face + back |
| Chaussures / sandales | `--product-type shoe` | face (latéral) + top (adjust) |
| Sabots | À définir (shoe ou flat lay ?) | — |

---

## Checklist par marque

- [ ] Photos complètes (face + back pour chaque ref)
- [ ] Étiquettes scannées (prix + couleur + tailles)
- [ ] CSV complet et validé
- [ ] Import Admin Centrale OK
- [ ] Pipeline images lancé
- [ ] Retouche Photoshop faite
- [ ] Upload Cloudinary OK
- [ ] Vérification affichage sur le site
