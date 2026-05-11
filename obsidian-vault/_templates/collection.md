---
type: collection
marque: 
slug-bdd: 
saison: SS26
statut-data: a-importer
statut-images: a-faire
maj: {{date}}
---
# {{marque}} SS26

Liens : [[Collections/Collections]] · [[Backend/products]] · [[Backend/cloudinary]] · [[Architecture/cli]]

---

## Données BDD

- Refs importées :
- Slug exact : ``
- Collection : SS26

## Images

- Type : (flat lay / shoe)
- Photos iCloud : 
- Dossier output : 

## Pipeline images

```bash
./rcli images generate-batch \
  --input-dir "..." \
  -o ./output_batch_XXX \
  --refs-dir refs_empty \
  --gemini-flash --flash-attempts 4 \
  --delay 30
```

## Tâches

- [ ] Importer les données (CSV → Admin)
- [ ] Vérifier les refs en BDD
- [ ] Lancer le pipeline images
- [ ] Uploader vers Cloudinary
- [ ] Valider affichage sur le site
