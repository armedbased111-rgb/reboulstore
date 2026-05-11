---
type: page
fichier: src/pages/OrderConfirmation.tsx
route: /order-confirmation
statut: a-revoir
phase: "25"
---
# OrderConfirmation

Page de confirmation après paiement Stripe réussi.

Liens : [[Frontend/Frontend]]

---

## Ce qui est en place

- Message de confirmation de commande
- Numéro de commande
- Récapitulatif (articles, total)
- Email de confirmation envoyé (SMTP)
- CTA retour vers le catalogue ou le profil

## Points à revoir
- [ ] Revue desktop + mobile
- [ ] Message de confirmation : ton, contenu, chaleur
- [ ] Récapitulatif : articles avec images
- [ ] Upsell subtil : "Découvrir d'autres articles" ?
- [ ] Email de confirmation : template HTML, contenu

## Notes
Page atteinte uniquement après webhook Stripe `checkout.session.completed`.
