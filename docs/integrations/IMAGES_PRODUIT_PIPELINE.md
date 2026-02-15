# Pipeline images produit : photos brutes → IA → Cloudinary

**Contexte** : Phase 24.10. Pipeline validé : photos brutes → génération IA (Gemini, refs style) → ajustements optionnels → upload Cloudinary rattaché au produit.

---

## Règle : refs vs trucs

- **`photos/`** (ou `--input-dir`) = **les trucs** : le produit à photographier (face.jpg, back.jpg). C’est lui qui doit apparaître en sortie.
- **`refs/`** = **les refs** : images de **style uniquement** (1_face, 2_back, 3_detail_logo, 4_lifestyle). Cadrage, flat lay, fond gris. Le modèle ne doit pas copier le vêtement des refs, seulement le style.

L’API reçoit toujours **image produit** puis **image ref** ; le prompt impose : sortie = vêtement de l’image 1 dans le style de l’image 2.

---

## En 3 étapes

| Étape | Action | Résultat |
|-------|--------|----------|
| **1. Photos brutes** | Mettre face (et optionnel dos) dans `photos/`, fond uni, bon éclairage (voir préconisations dans `IMAGES_IA_WORKFLOW.md`) | Fichiers prêts pour le script |
| **2. Génération IA** | `./rcli images generate --input-dir photos -o output/` (avec `refs/` pour le style) | 4 images : 1_face, 2_back, 3_detail_logo, 4_lifestyle. Les vues 3 et 4 s’appuient sur la 1_face générée comme source de vérité (même vêtement). |
| **3. Upload** | `./rcli images upload --ref REF --dir output/` (backend démarré) | Images sur Cloudinary et attachées au produit |

---

## Détail des commandes

**Génération** (API Gemini, `GEMINI_API_KEY` dans `.env`) : par défaut **Gemini 3 Pro**. Option `--gemini-flash` pour l’économique.
```bash
./rcli images generate --input-dir photos -o output/
# Avec refs/ (1_face.png, 2_back.png, etc.) le style est calé sur ces images.
# Les vues 3 et 4 utilisent la 1_face générée comme contexte (même vêtement garanti).
```
Sortie : `1_face.png`, `2_back.png`, `3_detail_logo.png`, `4_lifestyle.png` dans `output/`.

**Ajustement** (retouche une vue) : option **`--ref`** pour caler les couleurs (ou autre) sur une image de référence.
```bash
# Exemple : caler les couleurs du dos sur la face
./rcli images adjust --image output/2_back.png --ref output/1_face.png --prompt "Match the garment colors to the reference image (second image). Same blue tone." -o output/2_back.png --gemini-pro

# Sans ref : consigne seule
./rcli images adjust --image output/3_detail_logo.png --prompt "Remove the t-shirt under the hoodie." -o output/3_detail_logo.png --gemini-pro
```

**Upload** (backend Reboul doit tourner) :
```bash
./rcli images upload --ref L100001/V09A --dir output/
```
Par défaut : supprime les images existantes du produit (Cloudinary + BDD) puis upload les 4 nouvelles. Pour ajouter sans supprimer : `--append`.
Ordre des images : 1_face, 2_back, 3_detail_logo, 4_lifestyle (ordre 0, 1, 2, 3 en BDD).

---

## Reprise plus tard (pour refaire ou faire évoluer)

**Où c’est dans le projet** :
- **CLI** : `cli/commands/images.py` (groupe `images` : `generate`, `adjust`, `upload`)
- **Enregistrement** : `cli/main.py` (commande `images`)
- **Backend upload** : `backend/src/modules/products/products.controller.ts` → `POST :id/images/bulk` (multer, puis service → Cloudinary + BDD)

**À avoir** :
- `.env` à la racine avec `GEMINI_API_KEY=...` (pour generate/adjust)
- Pour upload : backend Reboul démarré (défaut `http://localhost:3001`) ; en dev, tunnel SSH si `product-find` interroge la DB sur le VPS

**Workflow à refaire** :
1. Photos dans `photos/` (face.jpg, optionnel back.jpg) ; refs de style dans `refs/` (1_face, 2_back, 3_detail_logo, 4_lifestyle).
2. `./rcli images generate --input-dir photos -o output/`
3. Optionnel : `./rcli images adjust --image output/... --prompt "..." [-ref output/1_face.png] -o output/...`
4. `./rcli images upload --ref REF --dir output/` (REF = référence produit en base)

**Tests rapides** : `./rcli images --help` ; `./rcli images upload --ref FAKE --dir output` → « Aucun produit trouvé » ; dossier inexistant → « Dossier introuvable ».

---

## Références

- **Workflow détaillé, prompts, préconisations prise de vues** : `docs/integrations/IMAGES_IA_WORKFLOW.md`
- **Phase 24.10** : `docs/context/ROADMAP_COMPLETE.md` § 24.10
