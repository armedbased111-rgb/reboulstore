# documentation-workflow

**Commande** : `/documentation-workflow`

Workflow pour maintenir la documentation à jour dans Reboul Store.

## 🎯 Règle vault Obsidian — OBLIGATOIRE

**Le vault `obsidian-vault/` est la source de vérité du projet** (remplace `obsidian-vault/Projet/roadmap.md`, `CONTEXT.md`, etc.)

| Besoin | Fichier |
|--------|---------|
| État global | `obsidian-vault/REBOUL.md` |
| Roadmap & tâches | `obsidian-vault/Projet/roadmap.md` |
| Tâches agrégées | `obsidian-vault/TODO.md` |
| Sessions | `obsidian-vault/Sessions/YYYY-MM-DD-sujet.md` |

### Quand mettre à jour la roadmap ?

1. **À CHAQUE tâche complétée** : Cocher `[ ]` → `[x]` dans `obsidian-vault/Projet/roadmap.md`
2. **Après chaque session** : Session log + `REBOUL.md` si état global change
3. **Avant un nouveau bloc de travail** : Relire la section concernée dans la roadmap

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

- ✅ **Consulter `obsidian-vault/Projet/roadmap.md`** (obligatoire)
- ✅ **Identifier la phase et l'étape en cours**
- ✅ **Vérifier les dépendances**

### 2. Pendant le développement

- ✅ **Se référer à `obsidian-vault/Projet/roadmap.md`** pour la liste des tâches
- ✅ **Noter mentalement ce qui est fait**

### 3. Après CHAQUE tâche complétée

- ✅ **OBLIGATOIRE** : Mettre à jour `obsidian-vault/Projet/roadmap.md` (cocher `[x]`)
  - **⭐ RECOMMANDÉ** : Utiliser le CLI (`python cli/main.py roadmap update --task "..."`)
- ✅ **Mettre à jour `obsidian-vault/REBOUL.md`** (état actuel) si fin de phase
  - **⭐ RECOMMANDÉ** : `./rcli context sync` (vault + BACKEND/FRONTEND + `.cursor/context-summary.md`)
- ✅ **Mettre à jour `frontend/FRONTEND.md` ou `backend/BACKEND.md`** si nécessaire
  - **⭐ RECOMMANDÉ** : `./rcli context sync` (vault + BACKEND/FRONTEND + `.cursor/context-summary.md`)

## 📚 Fichiers de documentation à maintenir

### Documentation principale

- **`obsidian-vault/Projet/roadmap.md`** : Roadmap thématique (Images, Frontend, SEO, Sécurité, Lancement) - **RÉFÉRENCE PRINCIPALE** ⭐
- **`obsidian-vault/REBOUL.md`** : Contexte général, état actuel du projet
- **`obsidian-vault/Architecture/Architecture.md`** : Architecture complète admin centralisée ⭐ **RÉFÉRENCE ARCHITECTURE**

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

1. ✅ **`obsidian-vault/Projet/roadmap.md`** : Cocher la tâche
2. ✅ **`frontend/FRONTEND.md`** : Ajouter la page dans la section appropriée
3. ✅ **`obsidian-vault/REBOUL.md`** : Mettre à jour "État Actuel" si phase terminée

### Après création d'un module backend

1. ✅ **`obsidian-vault/Projet/roadmap.md`** : Cocher la tâche
2. ✅ **`backend/BACKEND.md`** : Ajouter module/endpoint/entité
3. ✅ **`docs/context/API_CONFIG.md`** : Ajouter endpoint si nouveau
4. ✅ **`obsidian-vault/REBOUL.md`** : Mettre à jour "État Actuel" si phase terminée

### Après création d'une animation

1. ✅ **`docs/animations/ANIMATIONS_GUIDE.md`** : Ajouter exemple si nécessaire
2. ✅ **`obsidian-vault/Projet/roadmap.md`** : Cocher la tâche si applicable

### Après implémentation depuis Figma

1. ✅ **`obsidian-vault/Projet/roadmap.md`** : Cocher la tâche
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

1. ✅ **`obsidian-vault/Projet/roadmap.md`** : Toutes les tâches cochées
2. ✅ **`obsidian-vault/REBOUL.md`** : Section "État Actuel" mise à jour
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

