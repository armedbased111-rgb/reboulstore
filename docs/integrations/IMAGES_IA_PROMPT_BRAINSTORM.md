# Images IA (24.10) – Brainstorm & plan prompts / refs

**Objectif** : améliorer la génération (plus de données ref, variation mannequin, et règle stricte « ne jamais générer l’image de ref à la place du produit »).  
**Statut** : brainstorm et plan uniquement — **aucune modification de code tant qu’on n’a pas validé ensemble**.

---

## 1. Contexte actuel

- **Entrée** : 1 image produit (face, éventuellement back) + 1 image de référence par vue (refs/ : 1_face, 2_back, 3_detail_logo, 4_lifestyle).
- **Envoi API** : `[prompt, image_produit, image_ref]` — ordre fixe, produit toujours en premier.
- **Prompts** :
  - Avec ref : `REFERENCE_PROMPT` (Image 1 = produit à photographier, Image 2 = ref de style uniquement ; sortie = vêtement de l’image 1 dans le setup de l’image 2).
  - Vues 3 et 4 : on envoie la **1_face générée** comme « source de vérité » + ref style → `REFERENCE_FROM_SOURCE_OF_TRUTH`.

---

## 2. Les trois axes à traiter

### Axe 1 : Donner plus de data (plusieurs refs par vue)

**Souhait** : remplir les dossiers de refs avec **plusieurs variantes** (ex. plusieurs mannequins différents pour lifestyle / détail) pour que le modèle ait plus d’exemples de style.

**Options à discuter** :

| Option | Description | Avantages | Inconvénients |
|--------|-------------|-----------|----------------|
| **A. Multi-ref dans un seul appel** | Envoyer 1 image produit + N images ref (2, 3, 4…) dans le même `contents.parts`. | Un seul appel, modèle voit toute la variété. | Limite API (ex. Gemini : combien d’images max par requête ?). Prompt doit dire « style inspiré de l’une de ces refs » ou « moyenne ». |
| **B. Un ref par appel, choisi aléatoirement** | Pour chaque génération, choisir **une** ref parmi plusieurs (ex. refs/4_lifestyle_1.png, 4_lifestyle_2.png…). | Simple, un appel = une ref comme aujourd’hui. | Pas d’utilisation simultanée de toute la variété dans un même shot. |
| **C. Plusieurs appels par vue, garder le meilleur** | Générer 2–3 fois la même vue avec des refs différentes, puis choisir (manuel ou heuristique) la meilleure. | Meilleure qualité / variation. | Coût ×2 ou ×3, plus de temps. |

**À préciser** : structure des dossiers refs (ex. `4_lifestyle_1.png`, `4_lifestyle_2.png` ou sous-dossiers par type de mannequin).

---

### Axe 2 : Améliorer le prompt pour créer de la variation (mannequin différent, etc.)

**Souhait** : que les sorties varient (mannequins différents, poses variées) au lieu d’un rendu toujours similaire.

**Options à discuter** :

| Option | Description | Avantages | Inconvénients |
|--------|-------------|-----------|----------------|
| **A. Prompt explicite « varier »** | Ajouter dans le prompt : « Vary the model: different body type, skin tone, pose inspired by the reference(s). Do not always output the same person. » | Pas de changement technique. | Efficacité variable selon le modèle. |
| **B. Références multiples (axe 1)** | Si on envoie plusieurs refs, le prompt dit : « Use one of these references for pose and style; the garment must always be from Image 1. » | Le modèle puise dans plusieurs exemples. | Dépend de l’option choisie en axe 1. |
| **C. Paramètre de variation (seed / temperature)** | Si l’API expose temperature ou seed, l’augmenter légèrement pour plus de diversité. | Comportement plus « aléatoire » entre runs. | Peut dégrader la fidélité au produit. |
| **D. Instructions par « type » de vue** | Prompts dédiés lifestyle (ex. « urban male », « minimal female », « neutral androgynous ») et en choisir un au hasard ou selon config. | Contrôle fin. | Plus de maintenance, besoin de définir les types. |

---

### Axe 3 : Règle stricte « ne pas générer l’image de ref » (bug actuel)

**Problème** : parfois la sortie = **fond + vêtement de l’image de ref** au lieu du **vêtement du produit (image 1)** dans le style de la ref. Le modèle « copie » la ref au lieu de « transférer le style de la ref sur le produit ».

**Objectif** : rendre la règle impossible à ignorer : **sortie = uniquement le vêtement de l’image 1**, présenté comme l’image 2 (cadrage, fond, lumière). Jamais le vêtement de l’image 2.

**Options à discuter** :

| Option | Description | Avantages | Inconvénients |
|--------|-------------|-----------|----------------|
| **A. Renforcer le prompt textuel** | Reformuler de façon très explicite et répétée : « CRITICAL: The garment in the output MUST be the garment from IMAGE 1 only. IMAGE 2 is for composition and lighting ONLY. Do NOT draw or copy the garment from IMAGE 2. If you output the garment from IMAGE 2, the result is wrong. » Répéter en début et fin de prompt. | Pas de changement d’API. | Les modèles peuvent quand même glisser. |
| **B. Structure du prompt (sections)** | Décomposer en blocs : `[ROLE]` / `[IMAGE 1 = ...]` / `[IMAGE 2 = ...]` / `[OUTPUT RULE]` / `[FORBIDDEN]`. Avec une section « FORBIDDEN: Output must not contain the garment from Image 2. » | Clarté pour le modèle. | À tester. |
| **C. Ordre et libellé des parts** | S’assurer que dans `parts` le produit est toujours clairement « Image 1 » et la ref « Image 2 », et que le prompt utilise exactement ces termes (« Image 1 », « Image 2 ») partout. | Cohérence. | Déjà en place ; on peut renforcer les libellés. |
| **D. Post-check ou détection** | Après génération, comparer (similarité visuelle ou par modèle) la sortie à la ref ; si trop proche de la ref, retry avec un prompt encore plus strict. | Détection du bug. | Complexe, coût supplémentaire, seuils à définir. |
| **E. Deux étapes** | Étape 1 : générer uniquement à partir du produit (sans ref) pour obtenir une « base ». Étape 2 : « Re-style this garment to match this reference (composition/lighting only) ». | Séparation nette produit vs style. | Deux appels par vue, coût et latence. |

**À clarifier** : est-ce que le bug arrive surtout sur une vue (face, dos, détail, lifestyle) ou sur toutes ? Ça peut orienter vers un renforcement ciblé (ex. lifestyle uniquement).

---

## 3. Plan proposé (à valider ensemble)

### Phase 1 : Règle « ne pas générer la ref » (priorité haute)

**Référence des numéros d’images (ordre envoyé à l’API)** :
- **IMAGE 1** = la **photo produit** (dossier `photos/` ou `--input-dir`) : le vêtement à photographier — face.jpg, back.jpg, etc. C’est « le truc » qu’on veut voir en sortie.
- **IMAGE 2** = l’**image de référence de style** (dossier `refs/`) : 1_face.png, 2_back.png, 3_detail_logo.png, 4_lifestyle.png. Elle sert uniquement au cadrage, fond, éclairage, pose. Le modèle ne doit **jamais** redessiner le vêtement de l’IMAGE 2 en sortie.

L’API reçoit : `[prompt, IMAGE 1 (produit), IMAGE 2 (ref style)]`. Le prompt doit utiliser exactement ces termes pour que le modèle sache quelle image est le produit et laquelle est la ref.

1. **Reformuler** `REFERENCE_PROMPT` et `REFERENCE_FROM_SOURCE_OF_TRUTH` avec :
   - Une phrase d’interdiction explicite : « Do not output the garment from Image 2. The output must show only the garment from Image 1. »
   - Une structure claire : IMAGE 1 = …, IMAGE 2 = …, OUTPUT = …
   - Répétition de la règle en fin de prompt (short).
2. **Vérifier** l’ordre des `parts` dans le code (prompt → image produit → image ref) et ajouter un commentaire indiquant « Image 1 » / « Image 2 » pour éviter toute inversion future.
3. **Tester** sur quelques cas (dont un où le bug est déjà arrivé) et noter si le problème persiste.

### Phase 2 : Plus de data (multi-ref) ✅

1. **Convention adoptée** : un dossier par vue dans `refs/` :
   - `refs/face/` → refs pour la vue 1_face (fichiers quelconques : `1.png`, `ref_a.jpg`, …)
   - `refs/back/` → vue 2_back
   - `refs/details/` → vue 3_detail_logo
   - `refs/lifestyle/` → vue 4_lifestyle  
   Fallback : si un sous-dossier est vide, le script utilise les fichiers à la racine (`face.jpg`, `2_back.png`, `3-detail.jpg`, `4-lifestyle.jpg`).
2. **Stratégie** : (B) une ref **aléatoire** par appel (une image parmi celles du dossier, pour varier le style sans multiplier les appels).
3. **Script** : `_list_refs_for_view(refs_dir, view_key)` + `_pick_one_ref(paths)` dans `cli/commands/images.py`. Limites Gemini (nombre max d’images par requête) : un seul ref par vue envoyé par appel, pas de changement.

### Phase 3 : Variation mannequin ✅ (point 1)

1. **Fait** : consigne de variation intégrée dans `REFERENCE_FROM_SOURCE_OF_TRUTH` (vues 3_detail_logo et 4_lifestyle) via `VARIATION_MANNEQUIN` : « When a person is shown wearing the garment: vary the model (body type, pose, stance); do not always output the same person. Use the reference for pose and style only; the garment must always be the one from Image 1. »
2. **Fait** : `generationConfig` : temperature 1.0 + seed **par produit** (même seed pour 3 et 4 → même mannequin pour ce produit).
3. **Fait** : 1 ref produit = 1 mannequin. Pour garantir même personne sur 3 et 4 : on envoie **3_detail_logo en référence visuelle** pour la vue 4 (prompt `LIFESTYLE_SAME_MODEL_PROMPT` : IMAGE 3 = the model to replicate ; output = same person as IMAGE 3 wearing garment from IMAGE 1).
4. **Fait** : cohérence shorts / torse nu : « If shorts or topless in one view, keep the same in the other (topless in both 3 and 4). »
5. **Optionnel** : prompts ou refs différents par « type » (urban, minimal, etc.) si on veut contrôler finement.

---

## 4. Points à trancher ensemble

- **Bug « ref générée à la place du produit »** : sur quelles vues ça arrive le plus (face, dos, détail, lifestyle) ? Avez-vous des exemples (ref + sortie erronée) à garder en référence pour les tests ?
- **Multi-ref** : préférence entre (A) tout envoyer en un appel, (B) une ref aléatoire, (C) plusieurs générations puis choix ?
- **Nommage des refs** : une ref par vue (comme aujourd’hui) vs plusieurs fichiers (ex. `4_lifestyle_1.png`, `4_lifestyle_2.png`) — quelle convention pour les dossiers refs ?
- **Ordre des phases** : on valide d’abord la Phase 1 (règle stricte) avant de toucher au multi-ref et à la variation, ou on veut traiter les trois en un seul passage ?

---

## 5. Références

- Prompts actuels : `cli/commands/images.py` (PROMPT_FACE, PROMPT_BACK, PROMPT_DETAIL_LOGO, PROMPT_LIFESTYLE, REFERENCE_PROMPT, REFERENCE_FROM_SOURCE_OF_TRUTH).
- Envoi API : `_call_gemini`, `parts = [prompt, image_produit, image_ref]`.
- Pipeline : `docs/integrations/IMAGES_PRODUIT_PIPELINE.md`, `docs/integrations/IMAGES_IA_WORKFLOW.md`.

---

*Document à mettre à jour au fil de la discussion. Une fois le plan validé, on pourra passer à l’implémentation (prompts, puis script si besoin).*
