# documentation-workflow

**Commande** : `/documentation-workflow`

Workflow pour maintenir la documentation à jour dans Reboul Store.

## 🎯 Règle ROADMAP_COMPLETE.md - OBLIGATOIRE

**`docs/context/ROADMAP_COMPLETE.md` est la référence principale du projet.**

### Quand mettre à jour ROADMAP_COMPLETE.md ?

1. **À CHAQUE étape complétée** : Cocher `[ ]` → `[x]` immédiatement
2. **À CHAQUE phase terminée** : Ajouter ✅ au titre de la phase
3. **Avant de commencer une nouvelle phase** : Vérifier ROADMAP_COMPLETE.md pour savoir quoi faire
4. **Après chaque session de travail** : Mettre à jour l'avancement

### Comment mettre à jour ?

```markdown
### Phase 9 : Backend - Authentification & Utilisateurs ✅
#### 9.1 Entité User
- [x] Créer entité User (id, email, password hash, ...)
- [x] Enum UserRole (CLIENT, ADMIN, SUPER_ADMIN)
- [x] Créer entité Address (id, userId, ...)
```

## 📝 Processus systématique

### 1. Avant de commencer une tâche

- ✅ **Consulter `docs/context/ROADMAP_COMPLETE.md`** (obligatoire)
- ✅ **Identifier la phase et l'étape en cours**
- ✅ **Vérifier les dépendances**

### 2. Pendant le développement

- ✅ **Se référer à ROADMAP_COMPLETE.md** pour la liste des tâches
- ✅ **Noter mentalement ce qui est fait**

### 3. Après CHAQUE tâche complétée

- ✅ **OBLIGATOIRE** : Mettre à jour `docs/context/ROADMAP_COMPLETE.md` (cocher `[x]`)
  - **⭐ RECOMMANDÉ** : Utiliser le CLI (`python cli/main.py roadmap update --task "..."`)
- ✅ **Mettre à jour `docs/context/CONTEXT.md`** (état actuel) si fin de phase
  - **⭐ RECOMMANDÉ** : Utiliser le CLI (`python cli/main.py docs sync`) - synchronise automatiquement
- ✅ **Mettre à jour `frontend/FRONTEND.md` ou `backend/BACKEND.md`** si nécessaire
  - **⭐ RECOMMANDÉ** : Utiliser le CLI (`python cli/main.py docs sync`) - synchronise automatiquement

## 📚 Fichiers de documentation à maintenir

### Documentation principale

- **`docs/context/ROADMAP_COMPLETE.md`** : Roadmap complète (24 phases) - **RÉFÉRENCE PRINCIPALE** ⭐
- **`docs/context/CONTEXT.md`** : Contexte général, état actuel du projet
- **`docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md`** : Architecture complète admin centralisée ⭐ **RÉFÉRENCE ARCHITECTURE**

### Documentation technique

- **`frontend/FRONTEND.md`** : Documentation frontend (pages, composants, services, état)
- **`backend/BACKEND.md`** : Documentation backend (modules, endpoints, entités, état)
- **`docs/context/API_CONFIG.md`** : Configuration API (ports, endpoints, variables d'environnement)

### Documentation spécialisée

- **`docs/animations/ANIMATIONS_GUIDE.md`** : Guide complet animations GSAP ⭐
- **`docs/export/FIGMA_DEV_GUIDE.md`** : Guide développement depuis Figma
- **`docs/export/FIGMA_WORKFLOW.md`** : Workflow Figma → Code
- **`frontend/AUTH_USAGE.md`** : Système authentification frontend

### Documentation décisionnelle

- **`docs/context/BRAINSTORMING_ROADMAP.md`** : Brainstorming & décisions prises
- **`docs/context/CLARIFICATIONS_BRAINSTORMING.md`** : Clarifications et décisions validées
- **`docs/context/POLICIES_TODO.md`** : Notes politiques livraison/retour

## 🔄 Workflow de documentation

### Après création d'une page frontend

1. ✅ **`docs/context/ROADMAP_COMPLETE.md`** : Cocher la tâche
2. ✅ **`frontend/FRONTEND.md`** : Ajouter la page dans la section appropriée
3. ✅ **`docs/context/CONTEXT.md`** : Mettre à jour "État Actuel" si phase terminée

### Après création d'un module backend

1. ✅ **`docs/context/ROADMAP_COMPLETE.md`** : Cocher la tâche
2. ✅ **`backend/BACKEND.md`** : Ajouter module/endpoint/entité
3. ✅ **`docs/context/API_CONFIG.md`** : Ajouter endpoint si nouveau
4. ✅ **`docs/context/CONTEXT.md`** : Mettre à jour "État Actuel" si phase terminée

### Après création d'une animation

1. ✅ **`docs/animations/ANIMATIONS_GUIDE.md`** : Ajouter exemple si nécessaire
2. ✅ **`docs/context/ROADMAP_COMPLETE.md`** : Cocher la tâche si applicable

### Après implémentation depuis Figma

1. ✅ **`docs/context/ROADMAP_COMPLETE.md`** : Cocher la tâche
2. ✅ **`frontend/FRONTEND.md`** : Ajouter page/composant
3. ✅ Capturer screenshot si nécessaire

## ✅ Format de documentation

### Sections standard

```markdown
## 📄 Titre Section

### Description
...

### Structure
...

### Exemple
...
```

### Checklist format

```markdown
- [x] Tâche terminée
- [ ] Tâche à faire
```

### Statut phase

```markdown
### Phase X : Nom Phase ✅
```

## 🔍 Vérification documentation

Avant de finaliser une phase :

1. ✅ **`docs/context/ROADMAP_COMPLETE.md`** : Toutes les tâches cochées
2. ✅ **`docs/context/CONTEXT.md`** : Section "État Actuel" mise à jour
3. ✅ **`frontend/FRONTEND.md` ou `backend/BACKEND.md`** : Nouvelle fonctionnalité documentée
4. ✅ **Format cohérent** : Respecter la structure existante

## 🚀 CLI Python - Documentation automatique

**⭐ RECOMMANDÉ** : Utiliser le CLI Python pour automatiser la documentation :

```bash
# Générer documentation API
python cli/main.py docs generate api

# Générer documentation composants
python cli/main.py docs generate components

# Synchroniser toute la documentation (ROADMAP ↔ BACKEND.md ↔ FRONTEND.md)
python cli/main.py docs sync

# Générer changelog
python cli/main.py docs changelog

# Valider la documentation
python cli/main.py docs validate
```

**Gain de temps** : 10min → 1sec pour synchronisation (**99% de gain**)

Voir `/cli-workflow` pour le guide complet du CLI.

## 🔗 Commandes associées

- `/cli-workflow` : Guide complet du CLI Python ⭐ **NOUVEAU**
- `/getcontext` : Recherche de contexte
- `/frontend-workflow` : Workflow frontend
- `/backend-workflow` : Workflow backend
- `/update-roadmap` : Mettre à jour la roadmap

## ⚡ Astuces

- **Toujours cocher immédiatement** après avoir terminé une tâche
- **Utiliser des emojis** pour la lisibilité (✅, 📄, 🎯, etc.)
- **Respecter le format** existant pour la cohérence
- **Documenter les décisions importantes** dans CLARIFICATIONS_BRAINSTORMING.md

