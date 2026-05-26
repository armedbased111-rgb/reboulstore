---
type: session
date: 2026-05-21
statut: termine
---
# Session 2026-05-21 — RRD + Saucony

Liens : [[Collections/rrd]] · [[Collections/saucony]] · [[Collections/hologram]]

## RRD

- CSV `import-rrd-ss26.csv` (110 variants) — format Hologram, prix **pas** depuis feuille (`100` placeholder)
- 35 dossiers iCloud `RRD/` — shoot **27/35**, **5** restantes (casquettes + pantalon `S26322:26`)
- Exceptions : polo `S26213:60` absent · chemise **V72 seule** (V70/V71 retirés du CSV)
- Pipeline Image UI **RRD** (`brand_configs.json`)

## Saucony

- Nouvelle ref **`S70704-30`** — Progrid Triumph 4, Mist/lapis, **185 €**, 10 tailles (40.5→46.5)
- `cod_article` **54937→54946** (+1 par taille — contrainte unique BDD)
- Import BDD produit **#459** — couleur corrigée `Mist/lapis` (import sans colonne `color` → `Uni` par défaut)
- iCloud `SAUCONY/S70704-30/` — pipeline shoe à lancer après photos

## Pipeline IA

- `brand_configs.json` : **RRD** + **Hologram** ajoutés (garment)

## Suite

- RRD : finir 5 shoots · scan étiquettes · import · IA
- Saucony : photos `S70704-30` · batch shoe · upload 8 refs
