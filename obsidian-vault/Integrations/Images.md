# Intégration Images (Cloudinary)

Documentation complète de la gestion des images avec Cloudinary.

## Documents

- [[../docs/integrations/IMAGES_WORKFLOW.md|IMAGES_WORKFLOW]] - Workflow images complet
- [[../docs/integrations/IMAGES_UPLOAD.md|IMAGES_UPLOAD]] - Upload images
- [[../docs/integrations/IMAGES_WEBP_COMPATIBILITY.md|IMAGES_WEBP_COMPATIBILITY]] - Compatibilité WebP
- [[../docs/integrations/IMAGES_OPTIMIZATION_CRON.md|IMAGES_OPTIMIZATION_CRON]] - Optimisation automatique

## Vue d'ensemble

Cloudinary est utilisé pour :
- Stockage des images
- Optimisation automatique (WebP, compression)
- Transformations (resize, crop, etc.)
- CDN pour distribution

## Workflow

1. Upload image → Cloudinary
2. Optimisation automatique (WebP si supporté)
3. Stockage dans Cloudinary
4. URL Cloudinary utilisée dans l'application

## Formats supportés

- JPEG
- PNG
- WebP (automatique si supporté)
- AVIF (futur)

Voir [[../docs/integrations/IMAGES_WEBP_COMPATIBILITY.md|IMAGES_WEBP_COMPATIBILITY]] pour les détails.

## Optimisation

Cron job automatique pour optimiser les images existantes.

Voir [[../docs/integrations/IMAGES_OPTIMIZATION_CRON.md|IMAGES_OPTIMIZATION_CRON]] pour les détails.

