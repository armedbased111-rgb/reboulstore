# Intégration Cloudflare

Documentation complète de l'intégration Cloudflare (CDN, SSL, cache).

## Documents

- [[../docs/integrations/CLOUDFLARE_SETUP_COMPLETE.md|CLOUDFLARE_SETUP_COMPLETE]] - Setup complet Cloudflare
- [[../docs/integrations/CLOUDFLARE_CONFIG_FINAL.md|CLOUDFLARE_CONFIG_FINAL]] - Configuration finale
- [[../docs/integrations/CLOUDFLARE_PURGE_SETUP.md|CLOUDFLARE_PURGE_SETUP]] - Configuration purge cache
- [[../docs/integrations/CDN_CONFIGURATION.md|CDN_CONFIGURATION]] - Configuration CDN

## Vue d'ensemble

Cloudflare est utilisé pour :
- CDN (distribution de contenu)
- SSL/TLS (certificats HTTPS)
- Cache (optimisation performance)
- Protection DDoS

## Configuration

### DNS

Les domaines pointent vers Cloudflare qui proxy vers le serveur VPS.

### SSL

Certificats SSL automatiques via Cloudflare.

### Cache

Purge automatique du cache après déploiement.

Voir [[../docs/integrations/CLOUDFLARE_PURGE_SETUP.md|CLOUDFLARE_PURGE_SETUP]] pour les détails.

## Workflow

1. Déploiement → Build images
2. Redémarrage services
3. Purge cache Cloudflare (automatique)
4. Vérification HTTPS et CDN

