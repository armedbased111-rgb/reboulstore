# 🧪 Tests - Checkout Stripe & Capture Manuelle

## ✅ Checklist de tests à effectuer

### 🔧 Pré-requis

- [ ] Backend démarré (`npm run start:dev`)
- [ ] Frontend démarré (`npm run dev`)
- [ ] Base de données PostgreSQL accessible
- [ ] Stripe CLI démarré : `stripe listen --forward-to localhost:3001/checkout/webhook`
- [ ] Variables d'environnement Stripe configurées (mode TEST)
- [ ] Au moins un produit avec variant(s) en stock dans la base de données

---

## 📋 Tests Frontend - Page Panier (/cart)

### 1. Affichage du panier
- [ ] Le panier affiche correctement les items ajoutés
- [ ] Les images, noms, tailles, couleurs sont correctement affichés
- [ ] Les prix sont formatés en euros (€X,XX)
- [ ] Le sous-total est calculé correctement
- [ ] Le design correspond au Figma (pixel-perfect)
- [ ] Le responsive fonctionne (mobile, tablet, desktop)

### 2. Modification des quantités
- [ ] Augmenter la quantité d'un item fonctionne
- [ ] Diminuer la quantité d'un item fonctionne
- [ ] Supprimer un item du panier fonctionne
- [ ] Le sous-total se met à jour automatiquement

### 3. Bouton "Checkout now"
- [ ] Le bouton est visible et cliquable
- [ ] Le bouton est désactivé si le panier est vide
- [ ] Un état de chargement s'affiche lors du clic ("Redirection...")
- [ ] Redirection vers Stripe Checkout après clic

---

## 💳 Tests Stripe Checkout (Page hébergée Stripe)

### 4. Session Checkout - Authentifié
- [ ] Se connecter avec un compte utilisateur
- [ ] Ajouter des items au panier
- [ ] Cliquer sur "Checkout now"
- [ ] Vérifier que la page Stripe Checkout s'affiche
- [ ] Vérifier que les produits s'affichent avec :
  - [ ] Les images des produits
  - [ ] Les noms des produits
  - [ ] Les descriptions enrichies (nom, marque, catégorie, couleur, taille)
  - [ ] Les quantités
  - [ ] Les prix

### 5. Session Checkout - Invité (Guest)
- [ ] Se déconnecter (ou utiliser un navigateur privé)
- [ ] Ajouter des items au panier
- [ ] Cliquer sur "Checkout now"
- [ ] Vérifier que la redirection vers Stripe fonctionne sans erreur
- [ ] Vérifier que le checkout est accessible sans authentification

### 6. Formulaire Stripe Checkout
- [ ] Remplir les informations de livraison :
  - [ ] Nom complet
  - [ ] Adresse (rue, ville, code postal, pays)
  - [ ] Numéro de téléphone
- [ ] Remplir les informations de paiement (carte de test Stripe)
- [ ] Vérifier que le montant total est correct
- [ ] Compléter le paiement avec une carte de test :
  - [ ] `4242 4242 4242 4242` (succès)
  - [ ] Date d'expiration future
  - [ ] CVC : n'importe quel 3 chiffres
  - [ ] Code postal : n'importe quel code postal

### 7. Redirection après paiement
- [ ] Après paiement réussi, redirection vers `/order-confirmation`
- [ ] Le message de confirmation s'affiche
- [ ] Le panier est vidé automatiquement
- [ ] Le `session_id` est visible dans l'URL

---

## 🔔 Tests Webhook Stripe

### 8. Réception du webhook
- [ ] Dans le terminal Stripe CLI, vérifier que le webhook est reçu :
  ```
  --> checkout.session.completed [evt_...]
  <--  [200] POST http://localhost:3001/checkout/webhook
  ```
- [ ] Vérifier les logs backend pour confirmer la création de la commande
- [ ] Vérifier qu'aucune erreur n'apparaît dans les logs

### 9. Vérification de la commande créée (Base de données)
- [ ] Ouvrir la base de données (pgAdmin, DBeaver, ou psql)
- [ ] Exécuter : `SELECT * FROM orders ORDER BY "createdAt" DESC LIMIT 1;`
- [ ] Vérifier les champs de la commande :
  - [ ] `status` = `'pending'` (pas `'paid'` !)
  - [ ] `userId` = ID de l'utilisateur (ou `NULL` si guest)
  - [ ] `cartId` = `NULL` (pour Stripe Checkout)
  - [ ] `paymentIntentId` = ID du PaymentIntent Stripe (commence par `pi_`)
  - [ ] `total` = Montant total en euros
  - [ ] `shippingAddress` (JSONB) contient toutes les informations de livraison
  - [ ] `billingAddress` (JSONB) contient toutes les informations de facturation
  - [ ] `items` (JSONB) contient `[{variantId, quantity}, ...]`
  - [ ] `customerInfo` (JSONB) contient nom, email, téléphone, adresse
  - [ ] `paidAt` = `NULL` (pas encore payé)

### 10. Email de confirmation
- [ ] ⚠️ **PAS d'email envoyé automatiquement** (car statut PENDING)
- [ ] Vérifier qu'aucun email n'a été reçu après le webhook

---

## 👤 Tests Admin - Capture Manuelle

### 11. Capture de paiement réussie (stock suffisant)
- [ ] Vérifier qu'un produit a du stock disponible dans la base de données
- [ ] Récupérer l'ID de la commande PENDING créée
- [ ] Appeler l'endpoint de capture (pour l'instant sans authentification admin, on le fera en Phase 16) :
  ```bash
  curl -X POST http://localhost:3001/orders/{orderId}/capture \
    -H "Authorization: Bearer {JWT_TOKEN}" \
    -H "Content-Type: application/json"
  ```
- [ ] Vérifier dans les logs backend :
  - [ ] "Checking stock availability..."
  - [ ] "Stock is sufficient. Capturing payment..."
  - [ ] "Payment captured successfully"
  - [ ] "Stock decremented for variant..."
  - [ ] "Order confirmation email sent"

### 12. Vérification après capture réussie
- [ ] Vérifier dans la base de données :
  ```sql
  SELECT * FROM orders WHERE id = '{orderId}';
  ```
  - [ ] `status` = `'paid'` (changé de `'pending'`)
  - [ ] `paidAt` = Date/heure de capture (pas `NULL`)
- [ ] Vérifier que le stock a été décrémenté :
  ```sql
  SELECT "currentStock" FROM variants WHERE id = '{variantId}';
  ```
- [ ] Vérifier qu'un email de confirmation a été envoyé (dans les logs ou boîte mail)

### 13. Capture de paiement échouée (stock insuffisant)
- [ ] Créer une commande avec des items
- [ ] Mettre manuellement le stock à 0 pour un variant de la commande :
  ```sql
  UPDATE variants SET "currentStock" = 0 WHERE id = '{variantId}';
  ```
- [ ] Appeler l'endpoint de capture pour cette commande
- [ ] Vérifier dans les logs :
  - [ ] "Stock insufficient for variant..."
  - [ ] "Cancelling payment intent..."
  - [ ] "Order cancelled due to insufficient stock"
  - [ ] "Cancellation email sent"

### 14. Vérification après capture échouée
- [ ] Vérifier dans la base de données :
  ```sql
  SELECT * FROM orders WHERE id = '{orderId}';
  ```
  - [ ] `status` = `'cancelled'`
- [ ] Vérifier dans Stripe Dashboard que le PaymentIntent a été annulé
- [ ] Vérifier qu'un email d'annulation a été envoyé

---

## 🎨 Tests UI/UX - Page Order Confirmation

### 15. Page de confirmation
- [ ] Le design est cohérent avec le reste du site
- [ ] Le message est clair et rassurant
- [ ] Le bouton "Continuer les achats" fonctionne
- [ ] Le `session_id` est affiché (ou optionnel, selon design)

---

## 🔍 Tests Edge Cases

### 16. Panier vide
- [ ] Essayer de cliquer sur "Checkout now" avec un panier vide
- [ ] Vérifier que le bouton est désactivé
- [ ] Vérifier qu'aucune requête n'est envoyée

### 17. Variant supprimé pendant checkout
- [ ] Ajouter un variant au panier
- [ ] Supprimer le variant de la base de données (ou mettre stock à 0)
- [ ] Essayer de créer une session checkout
- [ ] Vérifier qu'une erreur appropriée est retournée

### 18. Double capture
- [ ] Capturer une commande avec succès
- [ ] Essayer de capturer à nouveau la même commande
- [ ] Vérifier qu'une erreur est retournée (commande déjà payée)

### 19. Webhook dupliqué
- [ ] Vérifier que le webhook peut être appelé plusieurs fois sans créer de doublons
- [ ] (Le code devrait gérer l'idempotence, mais à vérifier)

---

## 📊 Résumé des résultats

Après avoir effectué tous les tests, cocher ce qui fonctionne :

- [ ] ✅ Checkout invité (guest) fonctionne
- [ ] ✅ Checkout authentifié fonctionne
- [ ] ✅ Webhook reçoit les événements correctement
- [ ] ✅ Commandes créées en statut PENDING
- [ ] ✅ Capture manuelle fonctionne (stock suffisant)
- [ ] ✅ Capture échoue correctement (stock insuffisant)
- [ ] ✅ Stock décrémenté après capture réussie
- [ ] ✅ Emails envoyés après capture (pas avant)
- [ ] ✅ PaymentIntent annulé si stock insuffisant
- [ ] ✅ Données complètes extraites (adresses, téléphone, etc.)
- [ ] ✅ Images produits affichées sur Stripe Checkout

---

## 🐛 Bugs trouvés

Liste les bugs ou problèmes rencontrés pendant les tests :

1. 
2. 
3. 

---

## 📝 Notes

Notes supplémentaires ou observations :
