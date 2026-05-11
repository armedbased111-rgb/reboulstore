---
type: module
nom: hero
statut: complet
---
# Module — Hero

Slides de la section hero de la Home. Données statiques lues depuis un fichier JSON sur le VPS.

Liens : [[Backend/Backend]]

---

## Endpoints

```
GET /hero     # retourne le tableau de slides
```

## Fonctionnement

- Source : `hero_slides.json` à la racine du projet (process.cwd() = `/app` en Docker)
- Si le fichier n'existe pas → retourne `[]` sans erreur
- Pas d'entité BDD — fichier JSON directement sur le VPS

## Données attendues

```json
[
  {
    "id": 1,
    "imageUrl": "https://res.cloudinary.com/...",
    "mobileImageUrl": "...",
    "title": "...",
    "subtitle": "...",
    "ctaText": "...",
    "ctaLink": "/catalog"
  }
]
```

## Notes

- Modifier les slides = éditer `hero_slides.json` sur le VPS directement
- Pas de gestion admin pour l'instant
- Voir workflow hero dans `memory/workflow_hero_campaign.md`
