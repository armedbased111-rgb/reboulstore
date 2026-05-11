---
type: page
fichier: src/pages/Cart.tsx
route: /cart
statut: a-revoir
phase: "25"
---
# Cart

Panier — liste des articles, quantités modifiables, total, accès checkout.

Liens : [[Frontend/Frontend]]

---

## Ce qui est en place

- CartItem — article avec image, nom, taille, couleur, quantité (modifiable), suppression
- CartSummary — sous-total, frais livraison, total
- EmptyCart — état vide avec CTA retour catalogue
- Bouton "Passer commande" → /checkout
- Bouton "Continuer les achats" → /catalog

## Points à revoir
- [ ] Revue desktop + mobile
- [ ] CartItem : UX modification quantité (+ / - ou input)
- [ ] CartSummary : affichage frais livraison (gratuit au-dessus d'un seuil ?)
- [ ] Code promo — champ coupon dans le panier ou dans le checkout ?
- [ ] Persistance panier : survit au rechargement de page ? (localStorage ou session)
- [ ] Animation ajout/suppression article
- [ ] Accessibilité : labels ARIA sur les boutons + / -

## Notes
