# 📚 Project Commands - Reboul Store

Liste complète des project commands disponibles dans Cursor.

**Utilisation** : Taper `/nomcommande` dans le chat Cursor

---

## 🔍 Contexte & Recherche

### `/vault-sync` ⭐
Synchroniser le vault Obsidian apres une tache
- Met a jour phase/page/module/collection impactes
- Aligne `TODO.md` et `REBOUL.md`

### `/vault-session` ⭐
Tracer une session de travail dans Obsidian
- Cree/maj un log dans `obsidian-vault/Sessions/`
- Lie la session aux notes impactees

### `/vault-page-review [PageName]` ⭐
Revue complete d'une page frontend avec sync vault
- Audit UI/UX + corrections code
- MAJ `Frontend/...`, `Projet/phase-25.md`, `TODO.md`

### `/getcontext [sujet]`
Recherche rapide de contexte dans le projet
- Liste tous les fichiers de référence
- Guide de recherche par domaine
- Aide à trouver la documentation pertinente

### `/brainstorm-topic [sujet]`
Mini‑brainstorm guidé sur un point précis pendant le développement
- L’IA lit le contexte (ROADMAP, CONTEXT, docs)
- Pose des questions ciblées
- Propose des options + un plan d’action

### `/architecture-workflow`
Comprendre et travailler avec l’architecture multi‑sites + admin centrale
- Fichiers d’architecture (Admin Central, multi‑shops)
- Comment raisonner quand tu touches à l’archi
- Checklists avant toute modif d’architecture

---

## 🔄 Workflows

### `/frontend-workflow`
Workflow complet frontend
- Création de pages, composants, services
- Structure des fichiers, conventions
- Styling TailwindCSS, responsive
- Intégration animations GSAP

### `/backend-workflow`
Workflow complet backend
- Création de modules NestJS
- Entités TypeORM, DTOs
- Endpoints API, authentification
- Base de données, migrations

### `/auth-workflow`
Workflow Auth (frontend + backend)
- Fichiers auth importants (AuthContext, services, module NestJS)
- Comment ajouter/adapter des features auth
- Rappels sécurité

### `/figma-workflow`
Workflow Figma → Frontend
- Processus complet design → code
- Conventions design system
- Plugins Figma recommandés
- Conversion Figma → TailwindCSS

### `/animation-workflow`
Workflow animations GSAP
- Création d'animations réutilisables
- Structure animations/, presets/, components/
- Utilisation hooks, constantes
- Bonnes pratiques GSAP

### `/documentation-workflow`
Workflow documentation
- Quand et comment mettre à jour les docs
- Fichiers à maintenir
- Format de documentation
- Checklist de vérification

### `/roadmap-phase-workflow`
Ajouter / modifier / contextualiser des phases dans la roadmap
- Comment brainstormer une nouvelle phase
- Où la noter (obsidian-vault/Projet/roadmap.md — source de vérité unique)
- Comment rester cohérent avec la vision globale

### `/claude-code-workflow`
Workflow Toi + Cursor + Claude Code + CLI
- Qui fait quoi (Cursor = code, Claude Code = batch/CLI/doc/git)
- Quand utiliser Claude Code (prompts prêts à coller)
- Référence : CLAUDE_CODE_CURSOR_CONTEXT.md, CLAUDE.md

### `/architecture-workflow`
Architecture multi‑sites + admin centrale
- Fichiers d’architecture (Admin Central, multi‑shops)
- Comment raisonner quand tu touches à l’archi
- Checklists avant toute modif

### `/checkout-workflow`
Workflow spécifique Checkout
- Flow fonctionnel (front + back)
- Stripe + emails + order confirmation
- Tests checkout

### `/product-workflow`
Workflow spécifique Produits / Catalogue
- Entités Product/Variant/Image/Category/Brand
- Pages Catalog/Product, services et hooks
- Checklists de cohérence back/front

### `/admin-workflow`
Workflow futur pour l’admin centrale
- Où lire la doc d’archi admin
- Comment prévoir les phases 16‑17

---

## 🛠️ Création

### `/component-create [nom] [domaine?]`
Créer un composant React
- Template de base avec props typées
- Bonnes pratiques, documentation
- Exemples par domaine

### `/page-create [nom]`
Créer une page React
- Template de base avec structure standard
- Gestion loading/error states
- Intégration routes, services

### `/module-create [nom]`
Créer un module NestJS complet
- Module, Service, Controller
- DTOs, Entités
- Enregistrement dans app.module

---

## 📝 Utilitaires

### `/update-roadmap`
Mettre à jour obsidian-vault/Projet/roadmap.md
- Quand et comment cocher les tâches
- Format de mise à jour
- Processus systématique

### `/export-context-workflow`
Exporter le contexte Reboul vers un nouveau projet
- Brainstorm client (`brainstorm_nouveauprojet.md`)
- Création du nouveau dépôt
- Message type à envoyer à l’IA

### `/new-project-workflow`
Version ultra‑synthétique pour démarrer un nouveau projet
- Étapes minimales
- Ce que l’IA doit générer

### `/stripe-workflow`
Workflow Stripe (paiement + checkout)
- Setup Stripe + Stripe CLI
- Flow de paiement, webhooks, tests
- Mise à jour docs Stripe

### `/bug-report-workflow`
Décrire et diagnostiquer un bug
- Comment formuler le bug dans le chat
- Où le documenter si important
- Processus de debugging conseillé

### `/frontend-perf-workflow`
Checklist performance frontend
- Où regarder (pages clés, composants lourds)
- Checklist simple perf (data, images, animations)
- Lien avec `/brainstorm-topic perf [...]`

### `/images-workflow`
Workflow upload d'images Cloudinary
- Upload simple et multiple
- Configuration Cloudinary
- Optimisation automatique, thumbnails
- Tests et dépannage

### `/test-workflow`
Guide complet pour créer et exécuter des tests
- Tests fonctionnels (scripts Node.js)
- Tests E2E backend
- Tests unitaires (à venir)
- Bonnes pratiques

### `/project-rules`
Règles de développement et conventions de code
- Philosophie pédagogique
- Conventions backend/frontend
- Design system
- Documentation
- CLI Python pour automatisation

### `/implement-phase [numéro-phase]`
Guide pour implémenter une phase complète
- Processus d'implémentation
- Planification et décomposition
- Mise à jour documentation
- Workflow détaillé
- Utilisation du CLI Python

### `/cli-workflow` ⭐ **NOUVEAU - CLI PRÊT POUR PRODUCTION**
Guide complet du CLI Python
- Installation et configuration
- Commandes principales (8 phases complétées)
- Workflow recommandé
- Bénéfices et impact (15-20h/semaine économisées)
- **État actuel** : CLI complet et opérationnel (voir `cli/RECAPITULATIF.md`)

---

## 📖 Documentation associée

Toutes les commandes référencent les fichiers de documentation :

- **obsidian-vault/Projet/roadmap.md** : Roadmap complète (référence principale)
- **obsidian-vault/REBOUL.md** : Contexte et état actuel
- **obsidian-vault/Architecture/Architecture.md** : Architecture globale
- **docs/animations/ANIMATIONS_GUIDE.md** : Guide animations GSAP
- **docs/export/FIGMA_DEV_GUIDE.md** : Guide développement Figma
- **frontend/FRONTEND.md** : Documentation frontend
- **backend/BACKEND.md** : Documentation backend
- **docs/context/API_CONFIG.md** : Configuration API

---

## 🔗 Règles du projet

Toutes les commandes sont documentées dans :
- **`.cursor/rules/project-rules.mdc`** : Règles complètes du projet

---

**Dernière mise à jour** : 16 décembre 2025

---

## 🚀 CLI Python - Automatisation (PRÊT POUR PRODUCTION)

Le projet dispose d'un **CLI Python complet** pour automatiser toutes les tâches répétitives :

### ✅ État actuel : CLI complet (8/10 phases)

**Phases complétées** :
- ✅ Phase 1 : Fondations
- ✅ Phase 2 : Génération code Backend
- ✅ Phase 3 : Génération code Frontend
- ✅ Phase 4 : Analyse et validation
- ✅ Phase 5 : Génération de tests
- ✅ Phase 6 : Migrations et base de données
- ✅ Phase 7 : Documentation automatique
- ✅ Phase 8 : Intelligence et suggestions

### Installation

```bash
cd cli
./setup.sh
source venv/bin/activate
```

### Commandes principales

**Génération de code :**
- `code generate module [nom] --full` : Module complet (gain 92%)
- `code component [nom]` : Composant React (gain 93%)
- `code page [nom]` : Page React (gain 93%)
- `code hook [nom]` : Hook React
- `code animation [nom]` : Animation GSAP

**Documentation :**
- `docs generate api` : Documentation API automatique
- `docs generate components` : Documentation composants
- `docs sync` : Synchronise ROADMAP ↔ BACKEND.md ↔ FRONTEND.md (gain 99%)
- `docs changelog` : Génère changelog

**Analyse :**
- `analyze patterns` : Détecte patterns répétitifs
- `analyze code` : Valide cohérence
- `suggest phase [domaine]` : Suggère des phases
- `context optimize` : Optimise le contexte

**Voir `/cli-workflow` pour le guide complet**

### Documentation

- **Commande Cursor** : `/cli-workflow` (guide complet) ⭐
- **Récapitulatif** : `cli/RECAPITULATIF.md` (état actuel complet) ⭐
- **Fichiers** : `cli/README.md`, `cli/USAGE.md`, `cli/ROADMAP.md`, `cli/CONTEXT.md`

### Impact

- **Temps économisé** : ~15-20 heures par semaine
- **Réduction d'erreurs** : ~90%
- **Gain moyen** : 90-95% sur toutes les tâches automatisées

