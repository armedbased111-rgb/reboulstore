---
type: hub
section: Architecture
---
# Architecture — Hub

Stack, infra, VPS, API, services tiers, pipeline images, sécurité.

Liens : [[REBOUL]]

---

## Infrastructure & Déploiement

| Fichier | Contenu |
|---------|---------|
| [[Architecture/vps]] | VPS OVH, Docker containers, Nginx, deploy, backup, monitoring |
| [[Architecture/observability]] | Loki + Promtail + Grafana (Phase 3 — infra) |
| [[Architecture/grafana]] | **Nœud Grafana** — accès tunnel, mdp, commandes, ce qu’on track / ne track pas |
| [[Architecture/commands-logs]] | Commandes logs : tests Winston, docker logs, rcli prod, backup cron |
| [[Architecture/stack]] | Stack technique complète (Frontend + Backend + ports) |
| [[Architecture/infra]] | Dev local, tunnel SSH, variables d'environnement |

## API & Intégrations

| Fichier | Contenu |
|---------|---------|
| [[Frontend/Frontend]] | Relations Frontend↔Backend, tous les endpoints, format réponses |
| [[Architecture/services-tiers]] | Stripe, Cloudinary, Gemini, Redis, SMTP, Twilio |
| [[Architecture/workflow]] | Flux complet du site — catalogue, panier, paiement, pipeline images |
| [[Architecture/workflow-collection]] | Pipeline standard collection : photos → CSV → import → IA → PS → upload |

## CLI

| Fichier | Contenu |
|---------|---------|
| [[Architecture/cli]] | Toutes les commandes ./rcli |

## Images

| Fichier | Contenu |
|---------|---------|
| [[Architecture/pipeline-images]] | Pipeline produit : photos → IA → couleur → upload Cloudinary |
| [[Architecture/workflow-pub-elevenlabs]] | **Pipeline pub/campagne** : GPT Image 2 → Kontext Pro → Flux 2 → PS · prompts validés · formats · templates Off-White + Stone Island |

## Sécurité

→ [[Securite/Securite]] — cluster dédié (état actuel, hardening, pentest, AS400, checklist)
