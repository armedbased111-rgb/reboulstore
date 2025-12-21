# 🔗 Configuration Webhook Stripe

## 📋 Objectif

Créer un webhook Stripe pour recevoir les événements de paiement en production et récupérer le `STRIPE_WEBHOOK_SECRET`.

---

## 🚀 Étapes de Configuration

### 1. Accéder aux Webhooks dans Stripe Dashboard

1. Va sur **Stripe Dashboard** : https://dashboard.stripe.com/webhooks
2. Assure-toi d'être en mode **"Live"** (pas "Test") pour la production
   - Vérifier en haut à droite : bascule entre "Test" et "Live"
   - Clique sur "Live" pour activer le mode production

### 2. Créer un nouveau Webhook

1. Clique sur le bouton **"+ Add endpoint"** (ou "Ajouter un point de terminaison")
2. Remplis les informations :

   **Endpoint URL** :
   ```
   https://www.reboulstore.com/api/checkout/webhook
   ```
   *(C'est l'URL de ton backend qui recevra les événements Stripe)*
   
   **Note** : L'endpoint est dans le module `checkout`, donc le chemin est `/api/checkout/webhook`

   **Description** (optionnel) :
   ```
   Reboul Store - Webhook Production
   ```

3. Sélectionne les événements à écouter :

   **Événements importants pour un e-commerce** :
   - ✅ `payment_intent.succeeded` - Paiement réussi
   - ✅ `payment_intent.payment_failed` - Échec de paiement
   - ✅ `checkout.session.completed` - Session checkout complétée
   - ✅ `charge.refunded` - Remboursement effectué
   - ✅ `charge.dispute.created` - Contestation créée

   **Ou sélectionner "Select all events"** pour recevoir tous les événements (recommandé au début pour le debug)

4. Clique sur **"Add endpoint"**

### 3. Récupérer le Webhook Secret

Une fois le webhook créé :

1. Clique sur le webhook que tu viens de créer dans la liste
2. Dans la section **"Signing secret"**, clique sur **"Reveal"** ou **"Révéler"**
3. Tu verras un secret qui commence par `whsec_...`
4. **Copie ce secret** - c'est ton `STRIPE_WEBHOOK_SECRET`

**Exemple** :
```
whsec_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

### 4. Configurer le Secret sur le Serveur

Une fois que tu as le `STRIPE_WEBHOOK_SECRET` :

```bash
# Sur le serveur
ssh deploy@152.228.218.35

# Éditer le fichier .env.production
cd /opt/reboulstore
nano .env.production

# Trouver la ligne STRIPE_WEBHOOK_SECRET et remplacer par le nouveau secret
# STRIPE_WEBHOOK_SECRET=whsec_ton_nouveau_secret_ici
```

**OU utiliser sed** (remplacer `whsec_...` par ton vrai secret) :
```bash
ssh deploy@152.228.218.35 "cd /opt/reboulstore && sed -i 's|STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=whsec_ton_nouveau_secret|' .env.production"
```

### 5. Redémarrer les Services (si nécessaire)

Après avoir mis à jour le `.env.production` :

```bash
# Sur le serveur, après le déploiement
cd /opt/reboulstore
docker compose -f docker-compose.prod.yml restart backend
```

---

## 🔍 Vérification

### Tester le Webhook

1. Dans Stripe Dashboard > Webhooks, clique sur ton webhook
2. Clique sur **"Send test webhook"** ou **"Envoyer un webhook de test"**
3. Sélectionne un événement (ex: `payment_intent.succeeded`)
4. Vérifie dans les logs de ton backend que l'événement est bien reçu

### Vérifier les Logs

```bash
# Sur le serveur
ssh deploy@152.228.218.35

# Logs du backend
cd /opt/reboulstore
docker compose -f docker-compose.prod.yml logs -f backend | grep webhook
```

---

## 📝 Différence Test vs Production

### Mode Test (pour développement)
- URL : `https://www.reboulstore.com/api/checkout/webhook` (ou localhost avec ngrok)
- Secret : commence par `whsec_test_...` ou `whsec_...` (en mode test)
- Événements : Utilisent des clés de test (`sk_test_...`)

### Mode Production (Live)
- URL : `https://www.reboulstore.com/api/checkout/webhook`
- Secret : commence par `whsec_...` (en mode live)
- Événements : Utilisent des clés live (`sk_live_...`)

**⚠️ Important** : 
- Créer **2 webhooks séparés** : un pour le mode Test, un pour le mode Live
- Utiliser le bon secret selon l'environnement (dev vs production)

---

## 🛠️ Configuration dans le Code Backend

Ton backend NestJS devrait déjà avoir un endpoint pour recevoir les webhooks :

```typescript
// backend/src/modules/checkout/checkout.controller.ts
@Post('/stripe/webhook')
async handleWebhook(@Req() req: Request, @Res() res: Response) {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET // Utilise le secret depuis .env
    );
    
    // Traiter l'événement
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Paiement réussi
        break;
      case 'checkout.session.completed':
        // Checkout complété
        break;
      // ...
    }
    
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
```

---

## ✅ Checklist

- [ ] Accès au Stripe Dashboard en mode **Live**
- [ ] Webhook créé avec l'URL : `https://www.reboulstore.com/api/checkout/webhook`
- [ ] Événements sélectionnés (au minimum les événements de paiement)
- [ ] `STRIPE_WEBHOOK_SECRET` récupéré (commence par `whsec_...`)
- [ ] Secret configuré dans `/opt/reboulstore/.env.production`
- [ ] Services redémarrés après configuration (si déjà déployé)
- [ ] Webhook testé avec "Send test webhook"

---

## 🔗 Ressources

- **Stripe Dashboard Webhooks** : https://dashboard.stripe.com/webhooks
- **Documentation Stripe Webhooks** : https://stripe.com/docs/webhooks
- **Liste des événements Stripe** : https://stripe.com/docs/api/events/types

---

## 📌 Note pour le Déploiement

**Pour l'instant** (avant le premier déploiement) :
- Tu peux créer le webhook avec l'URL de production même si le serveur n'est pas encore déployé
- Stripe essaiera d'envoyer des événements, mais ils échoueront jusqu'à ce que le backend soit en ligne
- Une fois le backend déployé et accessible, les webhooks commenceront à fonctionner

**Après le déploiement** :
- Vérifier dans Stripe Dashboard > Webhooks que les événements sont bien reçus (statut "Succeeded")
- Surveiller les logs du backend pour s'assurer que les événements sont traités correctement
