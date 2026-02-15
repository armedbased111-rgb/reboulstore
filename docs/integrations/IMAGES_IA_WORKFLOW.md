# Évolution Images IA (24.10) – Vision & Premier pas

**Contexte** : Phase 24.10 – exploration douce, pas à pas. Objectif long terme : photos brutes produit (Reboul) → images prêtes site (fond studio, détails, option mannequin IA sans visage).

---

## Vision

- **Entrée** : photos brutes du produit prises à Reboul (règles de bonne prise de vues à définir).
- **Sortie** : 4 images par référence — 2 vues produit (plein cadre + variante) + 2 vues détail (logo, tissu/construction).
- **Intégration** : à définir (script CLI, endpoint Admin, ou outil externe + import).

---

## Où aller : Nano Banana en priorité

Pour **photos brutes → images produit (fond studio + détails + option mannequin IA sans visage)** :

| Critère | Nano Banana | Gemini (pur) |
|--------|-------------|--------------|
| Cas d’usage | E‑commerce produit, prêt à l’emploi | Généraliste, à composer soi‑même |
| Image-to-image (notre photo → fond studio) | Oui, cœur de l’offre | Possible mais à brancher (Merchant API ou custom) |
| Lifestyle / mannequin | Oui (lifestyle scenes, try-on vêtements) | À construire (prompts, flux) |
| Fond, éclairage, batch | Oui (remplacement fond, batch) | À coder |
| API / intégration | REST, clé API, exemples Python/JS | Vertex AI / Merchant API, plus technique |

**Recommandation** : **partir sur Nano Banana** pour 24.10. C’est pensé pour notre besoin (produit → studio + lifestyle). Si besoin de secours ou de combiner plus tard (ex. détourage + autre modèle), Gemini ou d’autres outils peuvent compléter.

---

## Nano Banana (détail)

- **Quoi** : API de génération / édition d’images pour l’e‑commerce, basée sur la tech Google.
- **Offre** :
  - **Image-to-image** : upload photo produit → changement de fond, éclairage, contexte en gardant le produit.
  - **Text-to-image** : description → image (concepts, mises en scène).
  - **E‑commerce** : fond blanc, **lifestyle** (mannequin / scène), try-on vêtements, variantes couleur, batch.
- **API** : REST, clé API, exemples Python / JavaScript.
- **Inscription** : nano-banana.ai ou nano-banana.run (gratuit + offres payantes).
- **Recommandations** : images claires, bien éclairées, fond uni, **min 1024×1024 px**.

## Gemini (API directe Google) – **choix pour le script**

- **Nano Banana = Gemini** : le modèle « Nano Banana » sur nanobanana.im est en fait **Gemini 2.5 Flash Image** (et Pro = Gemini 3 Pro Image). L’API est celle de Google.
- **Accès direct** : clé API **gratuite** (ou payante selon usage) sur **https://aistudio.google.com/apikey** — pas de waitlist.
- **Image editing** : photo + prompt → image (même principe que Nano Banana). Modèle `gemini-2.5-flash-image` ou `gemini-3-pro-image-preview`.
- **Doc** : [Gemini API – Image generation](https://ai.google.dev/gemini-api/docs/image-generation) (text-to-image et **image + text → image**).
- **Pour 24.10** : on utilise l’**API Gemini** pour le script CLI (1 photo → 4 vues). Les 4 prompts validés sur Nano Banana restent utilisables ; interface nanobanana.im reste dispo en manuel avec ton compte Pro.

---

## Règles de prise de vues

À respecter **dans l’ordre** pour des photos brutes exploitables par Nano Banana (fond studio, détail, vue de dos, lifestyle).

### 1. Avant la prise de vue

- **Fond** : uni, clair (blanc ou gris clair), sans objet ni texte visible.
- **Espace** : assez de recul pour cadrer le produit en entier (face ou dos).
- **Préparer le produit** : propre, repassé si besoin, pas de plis majeurs ; cintre retiré pour le shot (ou accepté si on garde « No hanger » dans le prompt).

### 2. Réglages et technique

- **Résolution** : **min 1024×1024 px** (idéalement 2048 ou plus pour les détails).
- **Éclairage** : homogène, pas d’ombre dure sur le produit ni sur le fond ; lumière douce de face ou légèrement latérale.
- **Stabilité** : appareil stable (trépied ou appui), flou évité.

### 3. Cadrage par type de vue

| Vue à obtenir en IA | Photo brute à fournir | Règle de cadrage |
|--------------------|------------------------|------------------|
| 1re image produit (face) | Produit de face, entier | Produit centré, bien cadré, visible en entier (manches, capuche, bas). |
| 1re image produit (dos) | Produit de dos, entier | Même chose, dos entièrement visible. |
| Détail logo / poitrine | Même photo face ou zoom poitrine | Si possible, zone poitrine + logo bien visibles (sinon la face entière suffit). |
| Détail tissu / construction | Face ou détail poche/couture | Optionnel ; sinon on part de la face. |
| Lifestyle (mannequin) | Photo face du produit | Nano Banana génère le mannequin à partir du produit. |

### 4. À éviter

- Fond encombré, motifs, ombres marquées.
- Sous-exposition ou sur-exposition forte.
- Produit coupé (manches, capuche ou bas hors cadre).
- Flou ou bougé.

---

## Préconisations prise de vue (couleurs, produit)

Pour que le pipeline prenne **le bon produit** et limite les **dérives de couleurs** :

**Couleurs**
- **Éclairage neutre** : lumière du jour ou LED neutres (éviter néons colorés, ampoules chaudes) pour que la teinte du tissu soit fidèle.
- **Balance des blancs** : régler sur « lumière du jour » ou « neutre » ; pas de filtre chaud/froid qui dénature le bleu ou le noir.
- **Contraste produit / fond** : fond gris clair ou blanc uni pour que le vêtement se détache bien ; le modèle s’appuie sur ta photo pour la couleur, une photo trop sombre ou trop jaune peut dériver en sortie.
- **Si dérive** : utiliser `./rcli images adjust --image output/2_back.png --ref output/1_face.png --prompt "Match garment colors to reference" -o output/2_back.png --gemini-pro` pour recaler une vue sur une autre.

**Produit bien identifiable**
- **Un seul produit par shot** : pas plusieurs vêtements dans le cadre ; le script envoie ta photo comme « image 1 = produit à montrer », un cadre clair évite toute ambiguïté.
- **Produit entier et lisible** : face (et dos si fourni) bien visibles, logo/étiquette lisibles si possible ; le modèle génère d’abord 1_face et 2_back, puis s’en sert comme **source de vérité** pour les vues 3 (détail) et 4 (lifestyle), donc une photo face nette et complète améliore toute la série.
- **Refs = style uniquement** : les images dans `refs/` (1_face, 2_back, etc.) servent uniquement au cadrage et au fond. Ne pas mettre ta photo produit dans `refs/` ; mettre les refs dans `refs/`, les photos du produit dans `photos/`.

**Résumé** : fond uni, lumière neutre, produit seul et bien cadré → bonnes couleurs et bon produit en sortie. En cas de petit écart, `adjust --ref` permet de recaler une vue sur une autre.

---

## Statut

- **Abonnement** : Nano Banana **Pro** acheté.
- **4 prompts validés** : 1re image produit (fond gris), 1re image vue de dos, détail logo/poitrine (perspective + zoom), lifestyle (mannequin sans tête). Voir sections dédiées ci‑dessous.
- **Règles de prise de vues** : définies (ordre : avant / technique / cadrage par vue / à éviter), section ci‑dessus.
- **Script CLI** : opérationnel (mode dossier `photos/` + `refs/`, **Pro par défaut**, `--gemini-flash` pour l’économique). Voir Usage CLI ci‑dessous.
- **Refs vs trucs** : `photos/` = produit à shooter ; `refs/` = style uniquement. Les vues 3 et 4 utilisent la **1_face générée** comme source de vérité (même vêtement). `adjust --ref` pour recaler les couleurs.
- **Pipeline 24.10** : validé (generate → optionnel adjust → upload). Préconisations prise de vue ci‑dessus.
- **Fond** : plain light grey or white sur toutes les vues ; pas de props (règle `BG` dans le script).
- **Taille du vêtement** : vues face et dos : même échelle flat lay ; vues 3 et 4 : cadrage dédié (détail porté, lifestyle épaules vers le bas).
- **Suivi** : mettre à jour la checklist 24.10 dans `ROADMAP_COMPLETE.md` et « État actuel » à chaque avancée.

---

## Prompts de référence

| Usage | Prompt |
|--------|--------|
| **1re image produit** (fond gris, variante validée) | Base + `Natural fabric texture. Sleeves clearly visible, subtle volume.` (voir section dédiée). |
| **1re image produit – vue de dos** | Photo brute de dos en entrée + prompt vue arrière (voir section dédiée). |
| **Lifestyle** (mannequin sans tête, style premium) | `Model wearing this garment, shot from chest down only, no head no face visible, crop at neck. Stone Island and CP Company lookbook style: technical fabric, clean lines, urban minimal, understated, soft studio lighting, neutral or light gray background, high-end fashion e-commerce.` |
| **Détail logo / poitrine** | Perspective + zoom validé → voir section « Détail 1 – Logo / poitrine » ci‑dessous. |
| **Détail tissu / construction** | `Close-up product detail, fabric texture or construction detail in focus, pocket or cuff or label, plain light grey background, soft even lighting, sharp focus, Stone Island CP Company style, premium e-commerce.` |

---

## Première image produit (style ref Stone Island / CP Company)

**Prompt de référence** (à utiliser tel quel — pas de surcharge « photorealistic » qui donne un rendu trop réaliste / flottant) :

```
Product flat lay or on invisible mannequin, plain light grey background, soft even lighting, subtle diffused shadow under the garment for depth. No hanger visible. Clean technical product shot, Stone Island CP Company style, minimal wrinkles, fabric and details sharp, premium e-commerce.
```

**À éviter** : ajouter "photorealistic", "floating", "volume" → ombre trop marquée, rendu trop réaliste. Rester sur ce prompt.

**Référence visuelle (peak)** : Le rendu qu’on vise est celui du **hoodie bleu sur fond gris clair** obtenu avec ce prompt : produit en flat lay ou mannequin invisible, fond gris uni, éclairage doux et homogène, **ombre très subtile et diffuse sous le vêtement** (pas d’ombre marquée type flottant), pas de cintre, plis minimaux, tissu et détails nets, style e‑commerce premium Stone Island / CP Company. Quand un rendu dérive (trop réaliste, ombre trop forte, effet flottant), l’objectif est de revenir à ce type d’image.

**Retour tissu** : Parfois le rendu donne un tissu un peu « jeu vidéo ». Pour rapprocher **légèrement** du réel sans retomber dans le trop réaliste : ajouter en fin de prompt par exemple « natural fabric texture » ou « subtle real fabric feel ». À tester ; si le rendu dérive (ombre, flottant), revenir au prompt de base.

**Variante validée** : Base + « Natural fabric texture. Sleeves clearly visible, subtle volume. »

**Vue face (v5 – prompt structuré COMPOSITION / LIGHTING / STYLE)** : flat lay uniquement, jamais de mannequin ou corps visible.
```
COMPOSITION: Product flat lay on surface only. Garment alone. No visible mannequin, dummy, or body form. No hanger. Plain light grey background. Sleeves visible, relaxed natural drape—not stretched, not tight. LIGHTING: Soft even lighting. Subtle diffused shadow under the garment only, for depth. No strong cast shadow, no harsh shadows on fabric. STYLE: Clean technical product shot. Stone Island CP Company style. Minimal wrinkles, fabric and details sharp. Natural fabric texture. Premium e-commerce.
```

**Vue de dos** (prompt v2 – renforcé) : dos en flat lay uniquement, pas de mannequin ni corps visible.
```
Product back view only. Flat lay on surface, garment alone—no mannequin, no body, no neck, no shoulders visible. Plain light grey background, soft even lighting, minimal shadow—only very subtle diffused shadow under the garment, no strong cast shadow, no harsh shadows on seams or fabric. No hanger. Clean technical product shot, Stone Island CP Company style, minimal wrinkles, fabric and details sharp, premium e-commerce. Natural fabric texture.
```

---

## Images détail produit (2 vues)

Produit en plus serré, à plat ou léger angle, pour mettre en avant **logo / poitrine** ou **tissu / construction** (poche, poignet, étiquette). Même univers que la 1re image : fond gris clair, lumière douce, style Stone Island / CP Company.

**Détail 1 – Logo / poitrine** (prompt v4 – angle dramatique, même ombre qu’image 2)  
Pas de vue de face ; angle d’en haut, ombre douce comme la vue produit, focus logo + tissu, pas de taches.
```
Close-up detail: dramatic angle from above, not front view. Same soft subtle diffused shadow as product shot—minimal shadow under garment. Maximum zoom on logo and fabric: logo and textile fill the frame, fabric texture prominent (weave, softness, quality). Embroidered logo sharp and crisp, centered. Clean garment—no stains, no spots, no marks. Plain light grey background. Soft even lighting, Stone Island CP Company style, premium e-commerce.
```

**Détail 2 – Tissu / construction**
```
Close-up product detail, fabric texture or construction detail in focus, pocket or cuff or label, plain light grey background, soft even lighting, sharp focus, Stone Island CP Company style, premium e-commerce.
```

---

## Test lifestyle : mannequin sans tête + style de référence

**Retour test** : Génération lifestyle OK (hoodie sur mannequin, fond gris) mais **la tête du mannequin reste visible** (même floutée). On veut : **pas de tête du tout** (cadrage cou / poitrine, ou mannequin sans tête).

**Style de référence** : On veut pouvoir s’inspirer des visuels **Stone Island**, **CP Company** et de ce que fait **Family 3.0 / Prada** (lookbook, mood). Idéalement : donner des **exemples d’images** ou des **indications de style** (couleurs, cadrage, ambiance) pour que le rendu colle à ces marques.

### Prompt lifestyle (v3 – mannequin humain, pas de tête)

Éviter mannequin plastique ; demander un vrai modèle humain, cadré au cou.

```
Real human model wearing this garment—not a mannequin, not plastic, not dummy. Living person. From shoulders down only: no head, no face, no chin, no mouth, no hair visible. Frame starts at base of neck, crop at neck. Stone Island and CP Company lookbook style: technical fabric, clean lines, urban minimal, understated, soft studio lighting, neutral or light gray background, high-end fashion e-commerce.
```

Si une tête apparaît encore : recadrer après (crop sous le cou) ou flouter.

### Style Stone Island / CP Company / Prada (à intégrer dans le prompt)

Pour l’instant Nano Banana ne semble pas accepter une **image de référence** dans le prompt ; on peut **décrire le style en texte** dans le même champ :

- **Stone Island** : `Stone Island lookbook style, technical fabric, clean lines, urban minimal, neutral or industrial background, no face visible`
- **CP Company** : `CP Company style, functional wear, understated, soft lighting, minimalist backdrop, model from chest down only`
- **Prada / Family 3.0** : `High-end fashion e-commerce style, clean composition, subtle shadows, model cropped at neck, luxury aesthetic`

**À vérifier** : Si Nano Banana propose plus tard un champ « reference image » ou « style image », on pourra uploader une photo type Stone Island / CP Company pour guider le rendu. En attendant, enchaîner les tests avec ces formulations et noter celles qui donnent le meilleur résultat.

---

## Premier pas (on démarre)

1. ~~Créer un compte~~ → **Pro acheté** ✅
2. **Récupérer la clé API** → voir « Étape 1 : Récupérer la clé API » ci‑dessous.
3. ~~Test manuel fond studio~~ → **Réussi**
4. ~~Valider prompts + règles de prise de vues~~ → **4 prompts + règles documentés**
5. **En cours** : script CLI 1 photo → 3–4 images (voir ROADMAP_COMPLETE.md § 24.10).

---

### Étape 1 : Récupérer la clé API (Gemini)

**Pivot** : l’API nanobanana.im est en waitlist. **Gemini = la même tech** (Nano Banana est le nom commercial de Gemini image). On passe par l’**API Google** : pas de waitlist, clé tout de suite.

1. Aller sur **https://aistudio.google.com/apikey** et se connecter avec un compte Google.
2. Cliquer sur **« Get API key »** (ou « Create API key »), créer ou sélectionner un projet si demandé.
3. Copier la clé générée.
4. **Stocker sans commiter** : à la racine du projet, dans **`.env`** ou **`.env.local`**, ajouter :
   ```bash
   GEMINI_API_KEY=ta_cle_copiee
   ```
   (Fichiers déjà dans `.gitignore`.)

**Quota** : Google AI Studio propose un tier gratuit ; au-delà, facturation selon usage. Pour 1 photo → 4 images par produit, rester dans le gratuit est plausible au début.

---

## API Gemini (pour le script CLI)

**Doc** : [Gemini API – Image generation](https://ai.google.dev/gemini-api/docs/image-generation)

**Image editing (photo + prompt → image)** :  
- **Endpoint** : `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`  
- **Header** : `x-goog-api-key: $GEMINI_API_KEY`  
- **Body** : `contents[].parts[]` = `[{ "text": "<prompt>" }, { "inline_data": { "mime_type": "image/jpeg", "data": "<base64>" } }]`  
- **Config** : `responseModalities: ["TEXT", "IMAGE"]` pour recevoir une image en réponse.  
- **Réponse** : dans `candidates[0].content.parts[]`, une part `inline_data` avec `data` (base64) = image générée.

Pour le pipeline : 1 appel par vue (face, dos si fourni, détail logo, lifestyle) avec la même photo en entrée et le prompt correspondant ; extraire l’image base64 et la sauver en fichier.

**Modèle** : `gemini-2.5-flash-image` (rapide) ou `gemini-3-pro-image-preview` (qualité pro, si dispo).

---

## Retours test (output_testprod – Gemini)

- **1_face** : Correct (fond gris, produit net). À peaufiner : ombre très légère, tissu naturel.
- **2_back** : Dos rendu sur mannequin (cou/épaules visibles). À corriger : **flat lay uniquement**, pas de corps visible → prompt v2.
- **3_detail_logo** : Fond type mur/pièce (beige), pas le même univers que le reste. À corriger : **fond gris clair uniquement**, pas de décor → prompt v2.
- **4_lifestyle** : Tête partiellement visible (menton, bouche). À corriger : **cadre à la base du cou**, zéro visage → prompt v2.

**Retours output_testprod_v3** : (2) dos = parfait, (4) lifestyle = parfait. (1) face = mannequin visible → v4 flat lay only. (3) détail logo = vue de face, pas d’angle dramatique, ombre à aligner sur (2) → v4.

---

## Pistes pour rendre les prompts plus précis

### 1. **Images de référence (recommandé)**

Gemini peut recevoir **plusieurs images** en entrée. Le modèle **Gemini 3 Pro Image** (`gemini-3-pro-image-preview`) accepte **jusqu’à 14 images de référence** pour guider le rendu.

**Idée** : pour chaque vue (face, détail logo, etc.), garder **une image “cible”** que tu valides (ex. la meilleure sortie, ou un visuel Stone Island). Lors de l’appel API :
- Envoyer **photo produit** + **image de référence** (ex. `2_back.png` pour la vue dos).
- Prompt du type : *« Transform the first image (the product) to match exactly the style, composition, lighting and framing of the second image (reference). Keep only the product from the first image, same look as reference. »*

**À faire côté script** : option `--reference-face`, `--reference-detail`, etc. ou un dossier `references/` (1_face.png, 3_detail_logo.png). Utiliser le modèle `gemini-3-pro-image-preview` et construire `contents.parts = [texte, image_produit_base64, image_ref_base64]`.

### 2. **Modèle**

- **gemini-2.5-flash-image** : actuel, rapide, parfois moins fidèle au prompt.
- **gemini-3-pro-image-preview** : meilleure compréhension, support des images de référence, multi-turn. À tester pour les vues qui dérivent (1 et 3).

### 3. **Prompt structuré**

Découper le prompt en blocs explicites pour limiter les ambiguïtés :
- `COMPOSITION: flat lay, garment alone, no mannequin.`
- `LIGHTING: soft even, subtle diffused shadow under garment only.`
- `STYLE: Stone Island CP Company, premium e-commerce.`

### 4. **Description textuelle d’une sortie réussie**

Quand une sortie est bonne (ex. ton 2_back), la décrire dans le prompt pour les autres vues : *« Same lighting and shadow as a back-view product shot: plain grey background, garment flat on surface, very soft shadow under the garment only. »* Réutiliser cette phrase dans les prompts face et détail.

### 5. **Multi-turn (éditions en chaîne)**

Faire un premier rendu, puis un second appel avec la sortie + *« Adjust: more relaxed sleeves »* ou *« Same but zoom tighter on logo »*. Plus coûteux (2 appels par vue), à réserver aux cas difficiles.

---

**Prochaine étape concrète** : si tu as une image “parfaite” par type (ex. un 2_back ou un 1_face que tu valides), on peut ajouter le support **image de référence** dans le script (option `--reference-dir` ou chemins par vue) et basculer sur `gemini-3-pro-image-preview` pour ces appels.

---

## Plan d'amélioration (ordre recommandé)

| # | Piste | Statut |
|---|--------|--------|
| 1 | **Stabiliser 4_lifestyle** : retry auto si pas d'image + gemini-3-pro pour cette vue | Fait |
| 2 | Optionnel : tout passer en gemini-3-pro (4 vues) pour homogénéité | À faire |
| 3 | Optionnel : prompts structurés (COMPOSITION / LIGHTING / STYLE) pour face et détail | Fait |
| 4 | Optionnel : phrase « same lighting as back view » dans prompts face et détail | À faire |
| 5 | Multi-turn : commande `adjust` (image + consigne → image ajustée) | Fait |

Détails : (1)(3) Fait. (2) Optionnel. (4) Phrase « same lighting ». (5) Commande `adjust` disponible (image + consigne → image ajustée).

---

## Règle coût : Gemini 3 Pro par défaut (une run propre), Flash en option

**Objectif** : Une run Pro propre plutôt que plusieurs runs Flash. 0 miss, coût maîtrisé sur le volume.

- **Par défaut** : **Gemini 3 Pro** pour toute la génération (refs utilisées si présentes dans `refs/`). Une run = 4 images prêtes.
- **Économique** : `--gemini-flash` pour **Gemini 2.5 Flash** (~0,15–0,20 $/run). Plus de retouches possibles après.
- **Résumé** : `./rcli images generate -o ./output` = Pro ; `./rcli images generate --gemini-flash -o ./output` = Flash.

**Deuxième passe (adjust)** : si une image générée est presque bonne, envoyer celle-ci + une consigne d’ajustement. Commande : `./rcli images adjust --image output/1_face.png --prompt "More relaxed sleeves" -o output/` → crée `1_face_adjusted.png`. Option `--gemini-pro` pour forcer Pro sur l’ajustement.

**Upload Cloudinary** : une fois les images générées dans un dossier (ex. `output/`), les envoyer au backend pour upload Cloudinary et rattachement au produit par référence : `./rcli images upload --ref L100001/V09A --dir output/`. Par défaut les images existantes du produit sont supprimées (Cloudinary + BDD) puis les nouvelles sont uploadées ; pour ajouter sans supprimer : `--append`. Le backend Reboul doit être démarré (défaut `http://localhost:3001`). Option `--backend https://...` pour un autre hôte. Les fichiers attendus sont `1_face.png`, `2_back.png`, `3_detail_logo.png`, `4_lifestyle.png` (ou .jpg).

---

## Usage CLI (script prêt)

À la racine du projet (avec `GEMINI_API_KEY` dans `.env`) :

```bash
# 3 images : face, détail logo, lifestyle (à partir d’une seule photo face)
./rcli images generate --face chemin/vers/photo_face.jpg -o ./output

# 4 images : + vue de dos (si tu as une photo dos)
./rcli images generate --face photo_face.jpg --back photo_dos.jpg -o ./output

# Avec images de référence (une par vue, optionnel)
# Le modèle reçoit : ta photo produit + ton image cible → il reproduit le style/compo de la cible.
./rcli images generate --face photo_face.jpg --back photo_dos.jpg \
  --reference-face refs/1_face.png --reference-back refs/2_back.png \
  --reference-detail refs/3_details_logo.png --reference-lifestyle refs/4_lifestyle.png \
  -o ./output
```

**Mode dossier** : dans **photos/** mets `face.jpg` (obligatoire), `back.jpg` (optionnel). Dans **refs/** : `1_face.png`, `2_back.png`, `3_detail_logo.png` ou `3_details_logo.png`, `4_lifestyle.png`. Le script les lit tout seul. Sorties : `1_face.png`, `2_back.png`, `3_detail_logo.png`, `4_lifestyle.png`.

---

## Références

- [Nano Banana – AI Product Photography Guide](https://www.nano-banana.ai/en/posts/ai-product-photography-ecommerce-guide)
- [Nano Banana](https://nanobanana.im) – site principal (compte Pro, dashboard, API)
- [Nano Banana API – Developer Guide](https://www.nano-banana.run/nano-banana-api) (doc technique API)
- [Gemini – Image generation](https://ai.google.dev/gemini-api/docs/image-generation) (Google AI for Developers)
- Roadmap : `docs/context/ROADMAP_COMPLETE.md` – Phase 24.10
