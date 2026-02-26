# Pipeline images produit : photos brutes → IA → Cloudinary

**Contexte** : Phase 24.10. Pipeline validé : photos brutes → génération IA (Gemini, refs style) → ajustements optionnels → upload Cloudinary rattaché au produit.

---

## Les deux workflows

| Workflow | Objectif | En bref |
|----------|----------|--------|
| **1. Génération de masse** | Produire face + back pour tout un batch (ex. Stone Island) | `generate-batch` (Flash, 4 tentatives/vue) → `color-fix --batch` → `upload-batch`. (Le fond #F3F3F3 est géré dans les prompts de génération.) Sortie dans un dossier par ref ; toutes les images (nom contenant face/back) sont uploadées. |
| **2. Ajustement (pour le 100 %)** | Corriger au cas par cas : plis, ombre, étiquette, lumière | `adjust` sur une image : **Gemini 3 Pro**, **sans --ref**, **prompt minimal**. Sortie en `*_adjusted.png` (original non écrasé). Vérifier puis remplacer l’original si OK. Ex. : pli/ombre flat lay, enlever étiquette volante en gardant le logo sur le col. |

On enchaîne : **génération de masse** pour avoir la base sur toutes les refs, puis **ajustement** ciblé sur les images qui ne sont pas encore parfaites, jusqu’au résultat visé.

---

## Règle : refs vs trucs

- **`photos/`** (ou `--input-dir`) = **les trucs** : le produit à photographier (face.jpg, back.jpg). C’est lui qui doit apparaître en sortie.
- **`refs/`** = **les refs** : images de **style uniquement** (1_face, 2_back, 3_detail_logo). Cadrage, flat lay, fond gris très clair **#F3F3F3** (même fond que le site). Le modèle ne doit pas copier le vêtement des refs, seulement le style.

L’API reçoit toujours **image produit** puis **image ref** ; le prompt impose : sortie = vêtement de l’image 1 dans le style de l’image 2.

### Guidage erreurs (1_face / 2_back)

Pour réduire mauvais cadrage, ombres, pliage ou rotation, tu peux alimenter le prompt avec des exemples « à éviter » :

- **`refs/errors/AVOID.txt`** (optionnel) : texte ajouté au prompt (ex. « AVOID: tilted garment, messy fold, harsh shadows… GOOD: fold and alignment like IMAGE 2, waistband horizontal, centered, soft shadow »). Si absent, un texte par défaut est utilisé.
- **`refs/errors/bad/`** (optionnel) : une ou plusieurs images de **mauvais** rendus (cadrage, ombre, pli, position). Une image est choisie aléatoirement et envoyée en dernière position avec la consigne « ne pas reproduire cette image ; viser le style de IMAGE 2 ».

Utile après une première génération : tu mets les pires sorties dans `refs/errors/bad/` et éventuellement tu rédiges `AVOID.txt` pour préciser ce qu’il ne faut pas faire.

---

### Pliage et ombres (adjust) — workflow validé

**Règle** : utiliser les **refs** (`refs/face.jpg`, `refs/back.jpg`) **uniquement pour le pliage et le cadrage**. Le vêtement en sortie = celui de l'image 1, jamais une copie de la ref. Pas d'invention.

**Ombres** : supprimer l'**ombre allongée en bas** (effet flottant). La remplacer par une **ombre douce autour du vêtement** (sous les bords, contact uniquement) pour l'**effet aplat** (flat lay).

**Pliage** : caler sur la ref (image 2) — même disposition, ceinture horizontale, centré — sans recopier le vêtement de la ref.

```bash
# Face (ref = style pliage uniquement)
./rcli images adjust --image output/PRODUIT/1_face.png --ref refs/face.jpg \
  --prompt "Use second image ONLY for fold and alignment (same lay, waistband horizontal, centered). Remove the elongated shadow at the bottom; keep only a soft shadow around the garment edges for a flat lay effect. Same garment as image 1 — do not copy the garment from image 2." \
  -o output/PRODUIT/1_face.png --gemini-flash --skip-verify

# Dos (ref = style pliage uniquement)
./rcli images adjust --image output/PRODUIT/2_back.png --ref refs/back.jpg \
  --prompt "Use second image ONLY for fold and alignment (same lay, waistband horizontal, centered). Remove the elongated shadow at the bottom; keep only a soft shadow around the garment edges for a flat lay effect. Same garment as image 1 — do not copy the garment from image 2." \
  -o output/PRODUIT/2_back.png --gemini-flash --skip-verify
```

Puis **`./rcli images color-fix --dir output/PRODUIT`** pour aligner la couleur dos sur la face.

**À éviter** : prompts trop larges (« smooth wrinkles », « clean and pressed ») — risque de substitution du produit (ex. veste au lieu de short). Rester sur : pliage = ref, ombre = autour du vêtement (effet aplat), même vêtement que l'image 1.

### Correction couleur programmatique (color-fix) — recommandé

L'IA (adjust) ne corrige pas toujours la couleur. La commande **`color-fix`** fait un transfert couleur **pixel par pixel** (PIL/numpy) : extrait le hex de la face (source de vérité) et recale le dos dessus. Pas d'IA, 100% déterministe.

```bash
# Un produit (auto : 1_face → 2_back)
./rcli images color-fix --dir output_batch_stone_island/B100004-V20

# Explicite (source + target)
./rcli images color-fix --source output/1_face.png --target output/2_back.png

# Batch : corrige tous les dos d'un dossier d'un coup
./rcli images color-fix --batch output_batch_stone_island
```

**Workflow recommandé** : après `generate` ou `adjust`, lancer `color-fix` sur le dossier (ou en batch) pour garantir face et dos = même couleur exacte.

### Vérifications après adjust (même produit + couleur)

Après chaque `adjust`, le CLI vérifie automatiquement (sauf si `--skip-verify`) :

1. **Même produit** : la sortie montre le même type de vêtement et la même vue que l’entrée (ex. short dos → short dos, pas veste). En cas d’échec, le fichier n’est pas enregistré.
2. **Cohérence couleur** : si `--ref` est fourni, la sortie doit avoir la même couleur de vêtement que la ref ; sinon, la sortie ne doit pas avoir dérivé par rapport à l’entrée. En cas d’échec, le fichier n’est pas enregistré.

Pour forcer l’enregistrement sans vérif : `--skip-verify`.

### Workflow type validé (ex. L100020-V29, B100004-V05G)

1. **Génération** : `./rcli images generate --input-dir "…/REF" -o output_batch_stone_island/REF --gemini-flash`
2. **Régénérer une vue seule** : `--only 2_back` ou `--only 1_face` pour ne régénérer qu'une image.
3. **Adjust pliage + ombres** : face et dos avec `--ref refs/face.jpg` et `--ref refs/back.jpg` (voir section « Pliage et ombres » ci-dessus) — ombre en bas supprimée, ombre autour du vêtement (effet aplat), pliage calé sur les refs, même vêtement que l'image 1.
4. **Couleur** : `./rcli images color-fix --dir output_batch_stone_island/REF` pour aligner la couleur dos sur la face.
5. **Upload** : `./rcli images upload --ref REF --dir output_batch_stone_island/REF`

Avec `--skip-verify` sur l'adjust, le produit reste garanti par le prompt (« Same garment as image 1 — do not copy the garment from image 2 »).


---

## En 3 étapes

| Étape | Action | Résultat |
|-------|--------|----------|
| **1. Photos brutes** | Mettre face (et optionnel dos) dans `photos/`, fond uni, bon éclairage (voir préconisations dans `IMAGES_IA_WORKFLOW.md`) | Fichiers prêts pour le script |
| **2. Génération IA** | `./rcli images generate --input-dir photos -o output/` (avec `refs/` pour le style) | 3 images : 1_face, 2_back, 3_detail_logo. Puis `./rcli images color-fix --dir output/` pour garantir la couleur dos = face. |
| **3. Upload** | `./rcli images upload --ref REF --dir output/` (backend démarré) | Images sur Cloudinary et attachées au produit |

---

## Détail des commandes

**Génération** (API Gemini, `GEMINI_API_KEY` dans `.env`) : par défaut **Gemini 3 Pro**. Avec `--gemini-flash`, chaque vue est générée **4 fois** par défaut (`--flash-attempts 4`) : plus de chances d'obtenir une sortie sans invention (badge/capuche). Option `--gemini-flash` pour l’économique.
```bash
./rcli images generate --input-dir photos -o output/
# Avec refs/ (1_face.png, 2_back.png, etc.) le style est calé sur ces images.
# La vue 3 utilise la 1_face générée comme contexte (même vêtement garanti).
```
Pour ne régénérer qu'une vue : `--only 1_face` ou `--only 2_back`. Sortie : `1_face.png`, `2_back.png`, `3_detail_logo.png` dans `output/`.

**Ajustement** (retouche une vue) : option **`--ref`** pour caler les couleurs sur une image de référence. Après chaque adjust, **vérifications automatiques** : même produit (pas de substitution veste/short) et cohérence couleur (avec `--ref` ou entrée). En cas d’échec, le fichier n’est pas enregistré ; `--skip-verify` pour désactiver. Option **`--add-to-errors`** pour copier l’image d’entrée dans `refs/errors/bad/`.

**Méthode recommandée pour adjust produit** : **Gemini 3 Pro** (`--gemini-pro`), **sans `--ref`**, **prompt minimal**. La sortie va dans `*_adjusted.png` (l’original n’est pas écrasé). Pour les étiquettes : enlever uniquement l’étiquette volante / prix / taille (celle qui dépasse ou se voit à travers), **garder** l’étiquette marque (ex. Stone Island) sur le col. Exemple : *"Smooth folds, flat lay. Remove any visible hanging tag, size tag or price tag. Keep the Stone Island label on the collar."*
```bash
# Exemple : caler les couleurs du dos sur la face
./rcli images adjust --image output/2_back.png --ref output/1_face.png --prompt "Match the garment colors to the reference image (second image). Same blue tone." -o output/2_back.png --gemini-pro

# Sans ref : consigne seule
./rcli images adjust --image output/3_detail_logo.png --prompt "Remove the t-shirt under the hoodie." -o output/3_detail_logo.png --gemini-pro

# Enregistrer l’image avant ajustement comme exemple d’erreur (remplir refs/errors/bad/ au fil de l’eau)
./rcli images adjust --image output/1_face.png --prompt "Center the garment, remove harsh shadow." -o output/1_face.png --add-to-errors
```

**Correction couleur** (programmatique, PIL/numpy — pas d'IA) :
```bash
# Un produit
./rcli images color-fix --dir output_batch/REF

# Tout un batch
./rcli images color-fix --batch output_batch_stone_island

# Explicite
./rcli images color-fix --source face.png --target back.png [-o result.png]
```
Extrait le hex moyen du vêtement sur la source (1_face) et recale la distribution couleur de la target (2_back) pixel par pixel. Le fond n'est pas touché.

**Upload** (backend Reboul doit tourner) :
```bash
./rcli images upload --ref L100001/V09A --dir output/
```
Par défaut : supprime les images existantes du produit (Cloudinary + BDD) puis upload les 3 nouvelles. Pour ajouter sans supprimer : `--append`.
Ordre des images : 1_face, 2_back, 3_detail_logo (ordre 0, 1, 2 en BDD).

**Génération en masse (batch)** : un dossier parent contient un sous-dossier par ref (nom = ref avec `-` au lieu de `/`, ex. `L100001-V09A`). Chaque sous-dossier contient les photos produit (face.jpg, back.jpg). Une seule commande génère puis optionnellement upload pour toutes les refs.
```bash
# Génération seule (sortie dans output_batch/<ref>/)
./rcli images generate-batch --input-dir "/path/to/STONE ISLAND" -o ./output_batch

# Génération + upload (backend doit tourner)
./rcli images generate-batch --input-dir "/path/to/STONE ISLAND" -o ./output_batch --upload --backend http://localhost:3001

# Reprendre en ignorant les refs déjà générées
./rcli images generate-batch --input-dir "/path/to/STONE ISLAND" --skip-existing --upload
```
Options : `--refs-dir refs` (partagé), `--gemini-flash` (économique), `--flash-attempts 4` (défaut : 4 générations par vue en Flash, pour limiter les inventions), `--only-face-back` (uniquement 1_face et 2_back), `--skip-existing` (ne pas régénérer si `1_face.png` existe déjà), `--delay 30` (défaut : secondes **après chaque image générée** ; recommandé 30 pour éviter 429).

**Vérifier la connexion API avant un batch** : `./rcli images check-api` — teste la clé et indique si tout est OK ou si tu es en 429 (attendre puis relancer avec `--delay` plus élevé).

**Quotas et crédits** : les limites (RPM, requêtes/jour) dépendent du tier (Free / payant). Consulter **Google AI Studio** : [Rate limits & usage](https://aistudio.google.com/rate-limit?timeRange=last-28-days). Avec **--delay 30** (défaut), une requête = une image puis 30 s de pause → 2 requêtes/min, très en dessous des limites. Un batch 27 refs × 2 vues × 4 tentatives = 216 requêtes → ~108 min de pause + temps API (avec `--only-face-back` et `--flash-attempts 4`).

---

### Batch Stone Island validé (paramètres de référence)

Paramètres qui donnent un rendu **fond / ombre / pliage** correct, avec **4 tentatives par vue** pour limiter les inventions :

- **Modèle** : `--gemini-flash` (Gemini 2.5 Flash)
- **Refs** : `--refs-dir refs_empty` (pas de ref de style qui recopie un vêtement ; fond #F3F3F3 dans le prompt)
- **Vues** : `--only-face-back` (1_face + 2_back uniquement)
- **Tentatives** : `--flash-attempts 4` (défaut) — 4 générations par vue, on garde la meilleure (sans invention)
- **Délai** : `--delay 30` pour éviter 429
- **Après génération** : `./rcli images color-fix --batch output_batch_stone_island`

**Pièges connus (inventions)** : le modèle peut parfois **ajouter un badge/logo inexistant** sur la cible, ou **inventer une capuche** sur un pull sans capuche. Les prompts incluent désormais une consigne explicite : ne pas ajouter badge/logo/patch/capuche non visibles en source ; si pas de capuche en source, pas de capuche en sortie. Avec 4 tentatives, on a plus de chances d'obtenir au moins une sortie fidèle — choisir ensuite 1_face.png / 1_face_2.png … et 2_back.png / 2_back_2.png … à la main ou via un script de sélection.

**Workflow batch recommandé** : premier passage = lancer le batch sur toutes les refs (ex. 69 Stone Island). Même si quelques refs échouent (rate limit, photo manquante), la majorité est générée ; le script affiche un résumé (X générés, Y échecs). Reprise possible avec `--skip-existing` pour ne régénérer que les refs manquantes. Ensuite, passage au peigne fin optionnel : pour les refs où le rendu ne convient pas, utiliser `./rcli images adjust` sur la vue concernée (couleurs, détail, etc.) puis ré-upload. Si le premier passage est déjà très bon, pas besoin d’adjust. L’important : la première génération batch fonctionne et produit l’essentiel ; les retouches ciblées viennent après si besoin.

---

## Reprise plus tard (pour refaire ou faire évoluer)

**Où c’est dans le projet** :
- **CLI** : `cli/commands/images.py` (groupe `images` : `generate`, `adjust`, `color-fix`, `upload`)
- **Enregistrement** : `cli/main.py` (commande `images`)
- **Backend upload** : `backend/src/modules/products/products.controller.ts` → `POST :id/images/bulk` (multer, puis service → Cloudinary + BDD)

**À avoir** :
- `.env` à la racine avec `GEMINI_API_KEY=...` (pour generate/adjust)
- Pour upload : backend Reboul démarré (défaut `http://localhost:3001`) ; en dev, tunnel SSH si `product-find` interroge la DB sur le VPS

**Workflow à refaire** :
1. Photos dans `photos/` (face.jpg, optionnel back.jpg) ; refs de style dans `refs/` (1_face, 2_back, 3_detail_logo).
2. `./rcli images generate --input-dir photos -o output/`
3. Optionnel : `./rcli images adjust --image output/... --prompt "..." [-ref output/1_face.png] -o output/...`
4. `./rcli images upload --ref REF --dir output/` (REF = référence produit en base)

**Tests rapides** : `./rcli images --help` ; `./rcli images upload --ref FAKE --dir output` → « Aucun produit trouvé » ; dossier inexistant → « Dossier introuvable ».

---

## Références

- **Workflow détaillé, prompts, préconisations prise de vues** : `docs/integrations/IMAGES_IA_WORKFLOW.md`
- **Phase 24.10** : `docs/context/ROADMAP_COMPLETE.md` § 24.10
