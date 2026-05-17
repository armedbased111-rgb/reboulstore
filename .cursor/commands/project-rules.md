# project-rules

**Commande** : `/project-rules`

Guide complet des **règles de développement, conventions de code et bonnes pratiques** du projet Reboul Store.

---

## 📋 Fichiers de référence

- **`.cursor/rules/project-rules.mdc`** ⭐  
  → Règles principales du projet (mode pédagogique, workflows, etc.)

- **`obsidian-vault/Projet/roadmap.md`**  
  → Source de vérité pour savoir où on en est

- **`obsidian-vault/REBOUL.md`**  
  → Contexte général et état actuel

---

## 🎯 Philosophie générale

**Approche pédagogique prioritaire** : L'IA ne code pas à ta place, elle t'apprend et te guide pas à pas. Elle vérifie ton code et le corrige avec toi. Elle modifie seulement si tu le demandes explicitement.

---

## 🔧 Règles par contexte

### Backend / API / Services

- **Mode pédagogique** : L'IA ne code pas, elle t'apprend
- **Processus** :
  1. L'IA te donne le code à écrire avec des explications détaillées
  2. L'IA t'explique ce qu'on fait et pourquoi
  3. Tu codes les fichiers toi-même
  4. L'IA vérifie ton code une fois terminé
  5. On corrige ensemble jusqu'à réussir

### Frontend / Interface utilisateur

- **Mode pédagogique** (par défaut) : L'IA ne code pas, elle t'apprend
  - **Exception - Bibliothèques de composants** :
    - Si tu utilises shadcn/ui, Material-UI, etc.
    - L'IA te dit quels composants/imports sont nécessaires
    - Tu les fournis
    - L'IA les intègre dans le code

- **Mode normal** : L'IA peut modifier les fichiers à ta place
  - À utiliser uniquement si tu le demandes explicitement
  - **Cas d'usage** : Pages complexes, composants avec logique métier, intégration API

---

## 📐 Conventions de code

### Backend (NestJS)

- **Structure** : Modules NestJS dans `src/modules/`
- **Entités** : TypeORM dans `src/entities/`
- **DTOs** : Validation avec `class-validator` dans `src/modules/[module]/dto/`
- **Conventions** :
  - Nommage : `kebab-case` pour fichiers, `PascalCase` pour classes
  - Services : Méthodes async, gestion d'erreurs avec exceptions NestJS
  - Controllers : Décorateurs NestJS, validation automatique

### Frontend (React + TypeScript)

- **Structure** : 
  - Pages : `src/pages/`
  - Composants : `src/components/`
  - Services : `src/services/`
  - Hooks : `src/hooks/`
  - Animations : `src/animations/`

- **Conventions** :
  - Nommage : `PascalCase` pour composants, `camelCase` pour fonctions
  - Props : Typées avec TypeScript, interfaces exportées
  - Styling : TailwindCSS, mobile-first
  - Animations : GSAP dans `animations/`, réutilisables dans `presets/`

---

## 🎨 Design System

- **Inspiration** : A-COLD-WALL* (minimaliste, premium, streetwear)
- **Couleurs** : Primary #1A1A1A, Secondary #F3F3F3, Accent #D93434
- **Typographie** : Geist (H1-H3, Body, Body 2)
- **Espacements** : Système 8px (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- **Product Cards** : Fond gris #F8F8F8, typo majuscules

---

## 📝 Documentation

### Fichiers à maintenir

- **`obsidian-vault/Projet/roadmap.md — source de vérité)
- **`CONTEXT.md`** : Contexte général et état actuel
- **`FRONTEND.md`** : Documentation frontend
- **`BACKEND.md`** : Documentation backend
- **`API_CONFIG.md`** : Configuration API

### Quand mettre à jour

- **À chaque étape complétée** : Cocher dans obsidian-vault/Projet/roadmap.md
- **À chaque phase terminée** : Ajouter ✅ au titre de la phase
- **Après chaque session** : Mettre à jour l'avancement

---

## 🧪 Tests

- **Backend** : Tests unitaires avec Jest (à venir)
- **Frontend** : Tests de composants (à venir)
- **E2E** : Tests end-to-end (à venir)

---

## 🚀 CLI Python - Automatisation

Le projet dispose d'un **CLI Python** pour automatiser les tâches répétitives :

### Installation

```bash
cd cli
./setup.sh
source venv/bin/activate
```

### Utilisation recommandée

- **Mise à jour roadmap** : Utiliser `python cli/main.py roadmap update` au lieu de modifier manuellement
- **Génération de code** : Utiliser `python cli/main.py code generate` pour créer rapidement
- **Contexte Cursor** : Utiliser `python cli/main.py context generate` avant chaque session
- **Validation** : Utiliser `python cli/main.py roadmap check` et `docs validate` régulièrement

### Documentation CLI

- `/cli-workflow` : Guide complet du CLI
- `cli/README.md` : Documentation complète
- `cli/USAGE.md` : Exemples d'utilisation
- `cli/ROADMAP.md` : Roadmap d'amélioration du CLI

---

## 🔗 Commandes associées

- `/cli-workflow` : Guide complet du CLI Python
- `/update-roadmap` : Mettre à jour la roadmap (ou utiliser le CLI)
- `/documentation-workflow` : Workflow documentation complet
- `/frontend-workflow` : Workflow frontend
- `/backend-workflow` : Workflow backend

---

## ⚠️ Règles importantes

1. **obsidian-vault/Projet/roadmap.md — source de vérité** : Toujours le consulter avant de commencer
2. **Mode pédagogique par défaut** : L'IA guide, tu codes
3. **Documentation à jour** : Mettre à jour les docs après chaque étape (utiliser le CLI)
4. **Conventions respectées** : Suivre les conventions de nommage et structure
5. **Utiliser le CLI** : Automatiser les tâches répétitives avec le CLI Python

