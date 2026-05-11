---
type: page
fichier: src/pages/Product.tsx
route: /product/:id
statut: a-revoir
phase: "25"
---
# Product

Fiche produit — layout 2 colonnes style A-COLD-WALL* (40% galerie / 60% infos).

Liens : [[Frontend/Frontend]]

---

## Ce qui est en place

- Layout 2 colonnes (galerie gauche sticky, infos droite scrollable)
- ProductGallery — carrousel Swiper mobile, grille desktop
- ProductInfo — titre uppercase, prix, description
- VariantSelector — sélection taille (dropdown ou boutons)
- AddToCartButton — vérifie stock, états (idle / loading / added / out-of-stock)
- ProductTabs — onglets Details / Sizing / Shipping / Returns
- RelatedProducts — produits similaires en bas
- StockBadge — indicateur stock faible / épuisé
- StockNotificationModal — alerte quand le stock revient
- Gestion états loading / error / 404

## Points à revoir
- [ ] Revue desktop + mobile
- [ ] Galerie : vérifier affichage images Cloudinary (formats WebP, fallback)
- [ ] ProductTabs : contenu réel des onglets (Details, Sizing, Shipping, Returns)
- [ ] RelatedProducts : algorithme de suggestion (même marque ? même catégorie ?)
- [ ] VariantSelector : UX sélection — boutons taille plus lisibles que dropdown ?
- [ ] AddToCartButton : feedback visuel après ajout
- [ ] Prix barré : logique de remise (30% hardcodé ou dynamique ?)
- [ ] SEO : title et meta description dynamiques par produit
- [ ] Breadcrumb : Accueil > Catégorie > Produit

## Notes
