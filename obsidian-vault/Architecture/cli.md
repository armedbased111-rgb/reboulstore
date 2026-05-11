---
type: architecture
---
# CLI — ./rcli

Wrapper Python Click. Toujours lancer depuis la **racine** du projet.

Liens : [[Architecture/Architecture]]

---

## DB

```bash
./rcli db ref <REF>                          # hub complet : produit + variants + commandes d'édition
./rcli db product-find --ref REF
./rcli db product-list --brand "Stone Island"
./rcli db variant-list --ref REF
./rcli db variant-set-stock --ref REF --size S --stock 3
./rcli db product-set-all-stock --ref REF --stock 0
./rcli db export-csv --brand "Arte" -o arte.csv
./rcli db order-list --last 10
./rcli db order-detail --id ID
./rcli db cart-list --last 10
./rcli db backup --server
./rcli db backup-list
./rcli db backup-restore <fichier> --yes
```

## Images

```bash
# Génération unitaire
./rcli images generate --input-dir photos/ -o output/

# Batch multi-refs
./rcli images generate-batch \
  --input-dir DIR -o output/ \
  --refs-dir refs_empty \
  --gemini-flash --flash-attempts 4 \
  --delay 30

# Chaussures (ajouter le flag)
./rcli images generate-batch ... --product-type shoe

# Retouche/ajustement (Gemini)
./rcli images adjust --image <img.png> --prompt "..." -o <img.png> --gemini-pro

# Correction couleur
./rcli images color-fix --dir output/REF/
./rcli images color-fix --batch output_batch_stone_island/

# Upload
./rcli images upload --ref REF --dir output/REF/
./rcli images upload-batch --batch output_batch_stone_island/
```

## Règles images rappel

- Pas de `--ref` pour les chaussures (hallucinations)
- `sips -Z` pour resize (jamais `sips -z`)
- Centrage PIL uniquement (jamais IA)
- `--gemini-pro` pour les ajustements de qualité
- `--skip-existing` : skip si `1_face` + `1_back` présents dans le dossier

## Serveur

```bash
./rcli server status
./rcli server logs backend
./rcli server logs --errors --last 1h
./rcli server monitor --once
./rcli server ssl --check
./rcli deploy deploy --service reboul --pull --rebuild
./rcli health check
```

## Docs + Roadmap

```bash
./rcli roadmap update --task "25.1 Home"
./rcli roadmap update --phase 25 --complete
./rcli roadmap check
./rcli docs sync              # synchronise ROADMAP ↔ BACKEND.md ↔ FRONTEND.md
./rcli docs generate api
```

## Référence complète

`docs/context/DB_CLI_USAGE.md`
