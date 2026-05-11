---
type: module
nom: images-optimization
statut: complet
---
# Module — Images Optimization

Cron job de conversion automatique JPG/PNG → WebP via Cloudinary.

Liens : [[Backend/Backend]] · [[Frontend/Frontend]]

## Tables BDD

[[Database/tables/images]]

---

## Cron jobs

- **Quotidien (3h)** : nouvelles images des dernières 24h → WebP
- **Hebdomadaire (dimanche 4h)** : toutes les images → WebP

## Endpoints manuels

```
POST /images-optimization/optimize-all    # déclencher optimisation complète
POST /images-optimization/optimize-new    # déclencher optimisation nouvelles images
```

## Dépendances

- `@nestjs/schedule` pour les cron jobs
- Cloudinary API pour la conversion WebP

## Notes

- Compatibilité WebP vérifiée côté frontend (fallback JPG si non supporté)
- `sharp` disponible dans `/scripts/` pour optimisation locale avant upload (optionnel)
