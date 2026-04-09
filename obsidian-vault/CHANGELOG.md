# Changelog - Vault Obsidian

Historique des améliorations apportées au vault Obsidian.

## 2025-01-05 - Création initiale

### Structure créée
- `Home.md` - Point d'entrée principal
- `Index.md` - Index complet des documents
- `README.md` - Guide d'utilisation
- `Workflows/` - Dossiers workflows (Development, Deployment, Design)
- `Architecture/` - Documentation architecture
- `Canvas/` - Canvas visuels (Architecture, Workflow-Dev, Workflow-Deploy)

### Canvas créés
- **Architecture.canvas** - Schéma visuel de l'architecture système
- **Workflow-Dev.canvas** - Processus complet de développement
- **Workflow-Deploy.canvas** - Processus de déploiement sécurisé

### Liens internes ajoutés
- `ROADMAP_COMPLETE.md` - Liens vers FIGMA_WORKFLOW et ARCHITECTURE_ADMIN_CENTRAL
- `CONTEXT.md` - Lien vers ARCHITECTURE_ADMIN_CENTRAL
- `BACKEND.md` - Liens vers API_CONFIG, CONTEXT, ROADMAP_COMPLETE
- `FRONTEND.md` - Liens vers AUTH_USAGE, CONTEXT, FIGMA_WORKFLOW, ANIMATIONS_GUIDE
- `ARCHITECTURE_ADMIN_CENTRAL.md` - Liens vers CONTEXT, ROADMAP_COMPLETE, API_CONFIG
- `FIGMA_WORKFLOW.md` - Liens vers ROADMAP_COMPLETE, FRONTEND, ANIMATIONS_GUIDE
- `ANIMATIONS_GUIDE.md` - Liens vers FRONTEND, FIGMA_WORKFLOW
- `GIT_WORKFLOW.md` - Liens vers ROADMAP_COMPLETE, CONTEXT
- `API_CONFIG.md` - Liens vers ARCHITECTURE_ADMIN_CENTRAL, CONTEXT, BACKEND

### Configuration Obsidian
- `.obsidian/app.json` - Configuration de base (liens markdown activés)
- `.obsidian/graph.json` - Configuration graph view
- `.obsidian/core-plugins.json` - Plugins activés (Canvas, Graph, Backlinks)

## 2025-01-05 - Canvas Workflows & Règles

### Canvas créés pour workflows et règles
- **Workflow-Pedagogique.canvas** - Comment on travaille ensemble (mode pédagogique)
- **Regle-Database.canvas** - Règle critique base de données (VPS toujours)
- **Workflow-Figma.canvas** - Processus Figma → Frontend
- **Workflow-Animations.canvas** - Création animations AnimeJS
- **Workflow-Git.canvas** - Workflow Git (branches, commits, PR)
- **Regle-Deploiement.canvas** - Protection volumes DB lors déploiement
- **Workflow-CLI.canvas** - Utilisation CLI Python

### Mise à jour
- `Home.md` enrichi avec tous les Canvas
- `Index.md` enrichi avec catégorisation Canvas

## 2025-01-05 - Enrichissement complet

### Structure complète créée
- `Integrations/` - Toutes les intégrations (Stripe, Cloudflare, GA4, Images)
- `Server/` - Documentation serveur (Production, Development)
- `CLI/` - Documentation CLI Python
- `Context/` - Contexte et planning
- `Phases/` - Récapitulatifs phases

### Documents créés
- **Integrations** : Stripe.md, Cloudflare.md, GA4.md, Images.md
- **Server** : Production.md, Development.md
- **CLI** : Overview.md
- **Context** : Planning.md
- **Phases** : Overview.md
- **Workflows** : CLI.md, Integrations.md, Testing.md

### Canvas ajoutés
- **Integrations.canvas** - Schéma visuel des intégrations

### Index mis à jour
- `Index.md` enrichi avec toutes les catégories
- `Home.md` enrichi avec liens vers nouvelles sections

### Liens internes
- Tous les workflows interconnectés
- Toutes les intégrations liées
- Tous les contextes accessibles

## 2026-03-29 — Flow Paiement + Fix Cart Bug

### Canvas paiement créés
- **Workflow-Paiement-Client.canvas** — Flow complet côté navigateur (11 étapes, Playwright validé)
- **Workflow-Paiement-Serveur.canvas** — Architecture NestJS + Stripe (capture manuelle, webhook, PENDING → PAID/CANCELLED)

### Test Playwright réel
- Flow complet simulé avec `armedbased111@gmail.com`
- Produit : Arte Jacket Green M — 145€ (ref 231J/GREEN, variantId 1180)
- Carte test `4242 4242 4242 4242` → paiement soumis → `/order-confirmation` ✅
- Script : `.claude/skills/playwright/scripts/payment-flow-test.js`

### Bug corrigé — `useLocalStorage` sessionId non persisté
- **Fichier** : `frontend/src/hooks/useLocalStorage.ts`
- **Symptôme** : `cart_session_id` généré mais jamais écrit en localStorage → panier perdu à chaque rechargement
- **Fix** : écriture de la valeur initiale dans localStorage si la clé est absente
- **Validé** : même sessionId avant et après navigation inter-pages

### Intégrations/Stripe.md mis à jour
- Architecture capture manuelle documentée
- Bug cart résolu documenté

## Prochaines améliorations possibles

- Créer des Canvas supplémentaires (ex: Workflow Design détaillé)
- Ajouter des tags pour catégoriser les documents
- Créer des templates de notes pour nouveaux documents
- Enrichir les Canvas avec plus de détails visuels

