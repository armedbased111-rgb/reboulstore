# Stone Island – Liste shooting (ref + nom)

**69 refs** · Dossier batch = ref avec `-` au lieu de `/` (ex. `L100001-V09A`).  
Dans chaque dossier : `face.jpeg` ou `face.jpg` (+ optionnel `back.jpeg` / `back.jpg`).

**Prises de vues (iCloud)** :  
`/Users/tripleseptinteractive/Library/Mobile Documents/com~apple~CloudDocs/Collection reboulstore /STONE ISLAND`

**Première run (génération seule, sans upload)** :
```bash
./rcli images generate-batch --input-dir "/Users/tripleseptinteractive/Library/Mobile Documents/com~apple~CloudDocs/Collection reboulstore /STONE ISLAND" -o ./output_batch
```
Reprise sans régénérer les refs déjà faites : ajouter `--skip-existing`.  
Avec upload (backend démarré) : ajouter `--upload --backend http://localhost:3001`.

| # | Ref (dossier) | Nom produit |
|---|---------------|-------------|
| 1 | L100001-V09A | Stone Island Bermuda |
| 2 | L100020-V05G | Stone Island Bermuda |
| 3 | L100020-V24 | Stone Island Bermuda |
| 4 | L100020-V29 | Stone Island Bermuda |
| 5 | 6100014-V29 | Stone Island Cardigan |
| 6 | 6200021-V29 | Stone Island Jogging Molleton |
| 7 | 2200010-V05G | Stone Island Polo MC |
| 8 | 2200010-V1001 | Stone Island Polo MC |
| 9 | 2200010-V20 | Stone Island Polo MC |
| 10 | 2200010-V24 | Stone Island Polo MC |
| 11 | 2200010-V29 | Stone Island Polo MC |
| 12 | 1200005-V05G | Stone Island Surchemise |
| 13 | 1200011-V20 | Stone Island Surchemise | en boutique
| 14 | 5100023-V29 | Stone Island Sweat |
| 15 | 5100023-V93 | Stone Island Sweat |
| 16 | 5100035E-V20 | Stone Island Sweat | en boutique
| 17 | 5100035E-V64 | Stone Island Sweat | en boutique
| 18 | 5100038-V02E | Stone Island Sweat | dispo uniquement en shop
| 19 | 6100058-V29 | Stone Island Sweat |
| 20 | 6100058-V34 | Stone Island Sweat |
| 21 | 6100060E-V04A | Stone Island Sweat |
| 22 | 6100060E-V08G | Stone Island Sweat |
| 23 | 6100060E-V29 | Stone Island Sweat |
| 24 | 6100062E-V05G | Stone Island Sweat |
| 25 | 9100001-V29 | Stone Island Casquette |
| 26 | 9100011E-V08F | Stone Island Casquette |
| 27 | 9100011E-V29 | Stone Island Casquette |
| 28 | 9100011E-V59 | Stone Island Casquette |
| 29 | 9100013-V20 | Stone Island Casquette |
| 30 | 9100013-V93 | Stone Island Casquette |
| 31 | B100003-V05G | Stone Island Maillot homme |
| 32 | B100003-V08G | Stone Island Maillot homme |
| 33 | B100003-V20 | Stone Island Maillot homme |
| 34 | B100003-V24 | Stone Island Maillot homme |
| 35 | B100003-V29 | Stone Island Maillot homme |
| 36 | B100003-V31 | Stone Island Maillot homme |
| 37 | B100004-V05G | Stone Island Maillot homme |
| 38 | B100004-V20 | Stone Island Maillot homme |
| 39 | B100004-V61 | Stone Island Maillot homme |
| 40 | J100007-VJ201 | Stone Island Pantalon |
| 41 | 3100018-V20 | Stone Island Pantalon |
| 42 | 3100031-V05G | Stone Island Pantalon |
| 43 | 3100032-V09A | Stone Island Pantalon |
| 44 | 3100032-V20 | Stone Island Pantalon |
| 45 | 3100032-V29 | Stone Island Pantalon |
| 46 | 9200013-V29 | Stone Island Pochette |
| 47 | 5100074-V20 | Stone Island Pull ete |
| 48 | 5100074-V29 | Stone Island Pull ete |
| 49 | 2200012-V20 | Stone Island Polo manches longues |
| 50 | 2200012-V29 | Stone Island Polo manches longues |
| 51 | 9200012-V29 | Stone Island Sac |
| 52 | 2100001-V05G | Stone Island Tee shirt |
| 53 | 2100001-V29 | Stone Island Tee shirt |
| 54 | 2100001-V41 | Stone Island Tee shirt |
| 55 | 2100023-V09A | Stone Island Tee shirt |
| 56 | 2100023-V29 | Stone Island Tee shirt |
| 57 | 2100027E-V01 | Stone Island Tee shirt |
| 58 | 2100027E-V08G | Stone Island Tee shirt |
| 59 | 2100027E-V09A | Stone Island Tee shirt |
| 60 | 2100027E-V20 | Stone Island Tee shirt |
| 61 | 2100027E-V29 | Stone Island Tee shirt |
| 62 | 4100001-V05G | Stone Island Veste |
| 63 | 4100001-V08F | Stone Island Veste |
| 64 | 4100001-V29 | Stone Island Veste |
| 65 | 4100001-V41 | Stone Island Veste |
| 66 | 4100057-V20 | Stone Island Veste |
| 67 | 4100076-V65 | Stone Island Veste |
| 68 | 4100111-V20 | Stone Island Veste |
| 69 | 4100111-V34 | Stone Island Veste |

---

Après shooting : placer les dossiers dans un parent (ex. `STONE ISLAND/`) puis :
```bash
./rcli images generate-batch --input-dir "/path/to/STONE ISLAND" -o ./output_batch --upload
```
