---
type: page
fichier: src/pages/Checkout.tsx
route: /checkout
statut: a-revoir
phase: "25"
---
# Checkout

Tunnel de commande — livraison + paiement Stripe. Critique pour le lancement.

Liens : [[Frontend/Frontend]]

---

## Ce qui est en place

- DeliveryForm — adresse livraison (nom, email, adresse, ville, code postal, pays)
- ContactForm — infos contact si non connecté
- ShippingMethod — sélection mode de livraison (standard / express)
- PaymentForm — intégration Stripe Elements
- OrderSummary — récapitulatif commande (articles, livraison, total)
- ExpressCheckout — Apple Pay / Google Pay si dispo
- Gestion guest checkout (sans compte)

## Points à revoir
- [ ] Revue desktop + mobile
- [ ] Étapes : stepper visuel (livraison → paiement → confirmation) ?
- [ ] Validation formulaire livraison (champs requis, formats)
- [ ] Stripe Elements : style cohérent avec le design system
- [ ] Frais livraison : valeurs réelles à confirmer avec l'équipe Reboul
- [ ] Seuil livraison gratuite : à définir et afficher
- [ ] Guest checkout : UX claire (pas besoin de compte)
- [ ] Gestion erreurs paiement (carte refusée, etc.)
- [ ] Récapitulatif : images produits visibles

## Notes
Politique livraison finale (Phase 24.3) : réunion magasin requise avant de figer les frais.
