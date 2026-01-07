# Workflow Intégrations

Processus de configuration et utilisation des intégrations externes.

## Intégrations principales

### Stripe

Workflow paiement :
1. Client → Checkout Stripe
2. Paiement → Webhook
3. Backend → Création commande
4. Confirmation client

Voir [[../Integrations/Stripe.md|Stripe]] pour les détails.

### Cloudflare

Workflow déploiement :
1. Déploiement → Build
2. Redémarrage services
3. Purge cache Cloudflare (automatique)
4. Vérification HTTPS

Voir [[../Integrations/Cloudflare.md|Cloudflare]] pour les détails.

### GA4

Workflow tracking :
1. Événements frontend → GA4
2. API GA4 → Récupération données
3. Dashboard analytics

Voir [[../Integrations/GA4.md|GA4]] pour les détails.

### Images (Cloudinary)

Workflow images :
1. Upload → Cloudinary
2. Optimisation automatique
3. URL Cloudinary → Application

Voir [[../Integrations/Images.md|Images]] pour les détails.

## Configuration initiale

Voir [[../docs/integrations/QUICK_START_CONFIGURATIONS.md|QUICK_START_CONFIGURATIONS]] pour la configuration rapide.

## Activation

Voir [[../docs/integrations/ACTIVATION_CONFIGURATIONS.md|ACTIVATION_CONFIGURATIONS]] pour activer toutes les intégrations.

## Résumé configurations

Voir [[../docs/integrations/CONFIGURATIONS_FINALES_RESUME.md|CONFIGURATIONS_FINALES_RESUME]] pour le résumé complet.

