# update-roadmap

**Commande** : `/update-roadmap`

Guide pour mettre à jour ROADMAP_COMPLETE.md correctement.

## 🎯 Règle ROADMAP_COMPLETE.md - OBLIGATOIRE

**ROADMAP_COMPLETE.md est la référence principale du projet.**

## ✅ Quand mettre à jour ?

1. **À CHAQUE étape complétée** : Cocher `[ ]` → `[x]` immédiatement
2. **À CHAQUE phase terminée** : Ajouter ✅ au titre de la phase
3. **Avant de commencer une nouvelle phase** : Vérifier ROADMAP_COMPLETE.md
4. **Après chaque session de travail** : Mettre à jour l'avancement

## 📝 Format de mise à jour

### Cocher une tâche

```markdown
- [x] Tâche terminée
```

### Marquer une phase comme terminée

```markdown
### Phase 9 : Backend - Authentification & Utilisateurs ✅
```

### Ajouter une nouvelle tâche

```markdown
- [ ] Nouvelle tâche à faire
```

## 🔄 Processus systématique

### 1. Avant de commencer

1. ✅ Ouvrir **ROADMAP_COMPLETE.md**
2. ✅ Identifier la **phase en cours**
3. ✅ Identifier la **tâche à faire**
4. ✅ Vérifier les **dépendances**

### 2. Pendant le développement

- ✅ Se référer à ROADMAP_COMPLETE.md pour la liste des tâches
- ✅ Noter mentalement ce qui est fait

### 3. Après CHAQUE tâche complétée

1. ✅ **OBLIGATOIRE** : Ouvrir ROADMAP_COMPLETE.md
2. ✅ **Cocher la tâche** : `[ ]` → `[x]`
3. ✅ **Sauvegarder** immédiatement

### 4. Après fin de phase

1. ✅ **Ajouter ✅** au titre de la phase
2. ✅ **Mettre à jour CONTEXT.md** (section "État Actuel")
3. ✅ **Mettre à jour** FRONTEND.md ou BACKEND.md si nécessaire

## 📋 Exemple complet

### Avant

```markdown
### Phase 14 : Frontend - Historique Commandes

#### 14.1 Page Liste Commandes
- [ ] Créer page /orders
- [ ] Afficher liste des commandes utilisateur
- [ ] Filtrer par statut
```

### Après tâche terminée

```markdown
### Phase 14 : Frontend - Historique Commandes

#### 14.1 Page Liste Commandes
- [x] Créer page /orders
- [x] Afficher liste des commandes utilisateur
- [ ] Filtrer par statut
```

### Après phase terminée

```markdown
### Phase 14 : Frontend - Historique Commandes ✅

#### 14.1 Page Liste Commandes
- [x] Créer page /orders
- [x] Afficher liste des commandes utilisateur
- [x] Filtrer par statut
```

## ⚡ Astuces

1. **Cocher immédiatement** après avoir terminé une tâche (ne pas attendre)
2. **Ne pas oublier** de mettre à jour si tu fais plusieurs tâches
3. **Vérifier** avant de commencer une nouvelle phase que la précédente est bien cochée
4. **Utiliser Ctrl+F** pour trouver rapidement une phase/tâche

## 🔗 Commandes associées

- `/getcontext` : Recherche de contexte (inclut ROADMAP_COMPLETE.md)
- `/documentation-workflow` : Workflow documentation complet

## ⚠️ IMPORTANT

- **Ne pas oublier** de cocher les tâches
- **ROADMAP_COMPLETE.md = source de vérité** du projet
- **Permet de savoir** exactement où on en est
- **Facilite la reprise** après une pause
- **Évite les oublis** et doublons

