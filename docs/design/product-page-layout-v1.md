# Product Page – Layout Stitch v1

**Space:** reboul-frontend-pages
**Tags:** frontend, page, product, layout
**Date:** 05/03/2026

---

## Objectifs

- Mettre le visuel produit au centre, style lookbook premium.
- Garder le CTA "Ajouter au panier" toujours visible (surtout en mobile).
- Limiter la longueur de page en groupant les infos dans un accordéon.

## Décisions

- Hero en 2 colonnes : galerie à gauche, infos produit à droite (max-w-sm).
- CTA sticky en bas de l'écran sur mobile, bouton désactivé tant qu'aucune taille n'est sélectionnée.
- Détails du produit regroupés en accordéon (Description, Composition, Entretien).
- Section "Produits similaires" en grille 2 → 4 colonnes avec hover subtil (scale 105%).

## Contraintes

- Style A-COLD-WALL* : fond blanc, beaucoup de vide, tracking large sur les labels.
- Ratio image produit 3/4 pour matcher les photos Stone Island.
- Pas de carrousel lourd ni d'animations agressives (micro-interactions seulement).

## Historique

- v1 générée avec Stitch (/design) le 05/03/2026 et intégrée en page demo `ProductStitchDemo`.
