# 🔀 Guide Workflow Git - Reboul Store

## 📋 Vue d'ensemble

Ce document décrit les conventions et le workflow Git pour le projet Reboul Store.

## 🌿 Structure des Branches

### Branches Principales

- **`main`** : Branche de production
  - Contient le code en production
  - Toujours stable et déployable
  - Protection activée (pull request requise, reviews)
  - Déploiement automatique via GitHub Actions

- **`develop`** (optionnel) : Branche de développement
  - Contient le code en cours de développement
  - Utilisée pour intégrer les features avant merge dans `main`
  - Peut être utilisée pour les tests d'intégration

### Branches de Fonctionnalités

- **`feature/*`** : Nouvelles fonctionnalités
  - Format : `feature/nom-fonctionnalite`
  - Exemples : `feature/user-authentication`, `feature/payment-integration`
  - Créées depuis `main` ou `develop`
  - Mergées via Pull Request dans `main` ou `develop`

- **`fix/*`** : Corrections de bugs
  - Format : `fix/description-bug`
  - Exemples : `fix/login-error`, `fix/cart-calculation`
  - Créées depuis `main`
  - Mergées via Pull Request dans `main`

- **`hotfix/*`** : Corrections urgentes en production
  - Format : `hotfix/description-urgence`
  - Créées depuis `main`
  - Mergées directement dans `main` et déployées rapidement

### Branches de Test

- **`test/*`** : Tests et expérimentations
  - Format : `test/description-test`
  - Utilisées pour tester des configurations, des workflows, etc.
  - Peuvent être supprimées après utilisation

## 🔄 Workflow de Développement

### 1. Créer une Nouvelle Branche

```bash
# Depuis main (ou develop)
git checkout main
git pull origin main

# Créer et basculer sur la nouvelle branche
git checkout -b feature/nom-fonctionnalite

# Ou avec le CLI Python (si implémenté)
python cli/main.py git create-branch feature/nom-fonctionnalite
```

### 2. Développer et Commiter

```bash
# Faire des modifications
# ...

# Ajouter les fichiers modifiés
git add .

# Commiter avec un message conventionnel
git commit -m "feat: Add user authentication"

# Pousser la branche
git push origin feature/nom-fonctionnalite
```

### 3. Créer une Pull Request

1. Aller sur GitHub
2. Cliquer sur "New Pull Request"
3. Sélectionner la branche source (`feature/*`) et la branche cible (`main`)
4. Remplir la description de la PR
5. Assigner des reviewers si nécessaire
6. Créer la PR

### 4. Review et Merge

- Les reviewers vérifient le code
- Les tests CI/CD s'exécutent automatiquement
- Une fois approuvée, la PR est mergée dans `main`
- La branche `feature/*` peut être supprimée après le merge

### 5. Déploiement Automatique

- Après merge dans `main`, GitHub Actions déploie automatiquement en production
- Voir `.github/workflows/deploy.yml`

## 📝 Conventions de Commits

### Format

```
<type>(<scope>): <description>

[corps optionnel]

[footer optionnel]
```

### Types de Commits

- **`feat`** : Nouvelle fonctionnalité
  - Exemple : `feat(auth): Add JWT authentication`

- **`fix`** : Correction de bug
  - Exemple : `fix(cart): Fix price calculation error`

- **`docs`** : Documentation
  - Exemple : `docs(readme): Update installation instructions`

- **`style`** : Formatage, style (pas de changement de code)
  - Exemple : `style(frontend): Format code with Prettier`

- **`refactor`** : Refactoring (pas de nouvelle fonctionnalité ni correction)
  - Exemple : `refactor(api): Simplify user service`

- **`perf`** : Amélioration de performance
  - Exemple : `perf(database): Optimize product queries`

- **`test`** : Ajout/modification de tests
  - Exemple : `test(auth): Add unit tests for login`

- **`chore`** : Tâches de maintenance (build, dépendances, etc.)
  - Exemple : `chore(deps): Update dependencies`

- **`ci`** : Configuration CI/CD
  - Exemple : `ci(github): Add build check workflow`

- **`build`** : Système de build
  - Exemple : `build(docker): Update Dockerfile`

- **`revert`** : Annulation d'un commit précédent
  - Exemple : `revert: Revert "feat: Add new feature"`

### Scopes (optionnel)

- `frontend`, `backend`, `admin-central`, `cli`, `docs`, `config`, etc.

### Exemples de Messages

```
feat(auth): Add JWT authentication middleware
fix(cart): Fix total calculation for discounted items
docs(readme): Add deployment instructions
refactor(api): Simplify product service logic
test(users): Add integration tests for user creation
chore(deps): Update React to v19.2.0
ci(github): Add build check workflow
```

## 🔀 Stratégie de Merge

### Merge vs Rebase

- **Merge** : Utilisé pour les Pull Requests
  - Préserve l'historique complet
  - Crée un commit de merge
  - Recommandé pour les branches partagées

- **Rebase** : Utilisé pour mettre à jour une branche locale
  - Réécrit l'historique
  - Crée un historique linéaire
  - Recommandé uniquement pour les branches locales non partagées

### Processus de Merge

```bash
# Sur GitHub (via Pull Request)
# - Cliquer sur "Merge pull request"
# - Choisir "Create a merge commit" (recommandé)

# En local (si nécessaire)
git checkout main
git pull origin main
git merge feature/nom-fonctionnalite
git push origin main
```

## 🔧 Résolution de Conflits

### 1. Détecter les Conflits

```bash
git pull origin main
# Si conflits détectés, Git affiche :
# CONFLICT (content): Merge conflict in fichier.ts
```

### 2. Résoudre les Conflits

1. Ouvrir les fichiers en conflit
2. Chercher les marqueurs de conflit :
   ```
   <<<<<<< HEAD
   Code de la branche actuelle
   =======
   Code de la branche à merger
   >>>>>>> feature/branche
   ```
3. Résoudre le conflit en gardant le code approprié
4. Supprimer les marqueurs de conflit
5. Sauvegarder le fichier

### 3. Finaliser le Merge

```bash
# Ajouter les fichiers résolus
git add fichier-resolu.ts

# Compléter le merge
git commit -m "merge: Resolve conflicts in fichier.ts"

# Pousser les changements
git push origin feature/branche
```

## 🔙 Guide Rollback

### Annuler un Commit Local (non poussé)

```bash
# Annuler le dernier commit (garder les modifications)
git reset --soft HEAD~1

# Annuler le dernier commit (perdre les modifications)
git reset --hard HEAD~1

# Annuler les 3 derniers commits
git reset --hard HEAD~3
```

### Revert un Commit Déjà Poussé

```bash
# Créer un nouveau commit qui annule les changements
git revert <commit-hash>

# Exemple
git revert abc1234
git push origin main
```

### Rollback à un Commit Spécifique

```bash
# Trouver le commit
git log --oneline

# Créer une branche depuis ce commit
git checkout -b rollback-to-abc1234 abc1234

# Ou reset (dangerous - seulement si non partagé)
git reset --hard abc1234
```

## 🏷️ Tags et Releases

### Créer un Tag

```bash
# Tag annoté (recommandé)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag léger
git tag v1.0.0

# Pousser le tag
git push origin v1.0.0

# Pousser tous les tags
git push origin --tags
```

### Convention de Versioning (Semantic Versioning)

- **MAJOR.MINOR.PATCH** (ex: `v1.2.3`)
  - **MAJOR** : Changements incompatibles
  - **MINOR** : Nouvelles fonctionnalités compatibles
  - **PATCH** : Corrections de bugs compatibles

### Lister les Tags

```bash
# Liste tous les tags
git tag

# Filtrer les tags
git tag -l "v1.*"
```

### Supprimer un Tag

```bash
# Local
git tag -d v1.0.0

# Remote
git push origin --delete v1.0.0
```

## 🔒 Protection des Branches

### Branche `main`

- ✅ Pull request requise
- ✅ Reviews approuvées requises (1 reviewer minimum)
- ✅ Status checks doivent passer (CI/CD)
- ✅ Pas de force push autorisé
- ✅ Pas de suppression autorisée

### Configuration sur GitHub

1. Aller dans Settings > Branches
2. Ajouter une règle pour `main`
3. Configurer les restrictions ci-dessus

## 🛠️ Commandes Utiles

### État et Historique

```bash
# Statut des fichiers
git status

# Historique des commits
git log --oneline --graph --decorate

# Différences
git diff
git diff --staged
```

### Branches

```bash
# Lister les branches
git branch -a

# Supprimer une branche locale
git branch -d feature/branche

# Supprimer une branche distante
git push origin --delete feature/branche
```

### Stash (Mise en cache temporaire)

```bash
# Sauvegarder les modifications temporairement
git stash

# Lister les stash
git stash list

# Appliquer le dernier stash
git stash pop

# Appliquer un stash spécifique
git stash apply stash@{0}
```

## 🛠️ CLI Python - Commandes Git

Le projet inclut des commandes Git dans le CLI Python pour faciliter les opérations courantes :

### Commandes Disponibles

```bash
# Afficher le statut Git
python cli/main.py git status

# Créer une nouvelle branche
python cli/main.py git create-branch feature/nom-fonctionnalite

# Créer un commit avec convention
python cli/main.py git commit "description du commit" --scope frontend

# Déployer sur un environnement
python cli/main.py git deploy --env production
```

### Détails des Commandes

- **`git status`** : Affiche la branche actuelle, les fichiers modifiés et les derniers commits
- **`git create-branch <nom>`** : Crée et bascule sur une nouvelle branche avec validation du format
- **`git commit <message> [--scope]`** : Crée un commit avec convention (type(scope): message)
- **`git deploy [--env]`** : Déploie sur l'environnement spécifié (défaut: production)

## 📚 Ressources

- [Git Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

**Dernière mise à jour** : 29 décembre 2025

