# update-roadmap

**Commande** : `/update-roadmap`

Guide pour mettre à jour `obsidian-vault/Projet/roadmap.md` correctement.

## 🎯 Règle — source de vérité

**`obsidian-vault/Projet/roadmap.md` est la référence principale du projet.**

Point d'entrée global : `obsidian-vault/REBOUL.md` (mettre à jour si l'état global change).

> Ancien fichier obsolète : `obsidian-vault/Projet/roadmap.md` — ne plus utiliser.

## ✅ Quand mettre à jour ?

1. **À CHAQUE tâche complétée** : Cocher `[ ]` → `[x]` immédiatement
2. **Après chaque session de travail** : Mettre à jour l'avancement
3. **Avant de commencer un nouveau bloc** : Relire la section concernée (Images, Frontend, SEO, etc.)
4. **Si état global change** : Mettre à jour `obsidian-vault/REBOUL.md` + créer `obsidian-vault/Sessions/YYYY-MM-DD-sujet.md`

## 📝 Format de mise à jour

### Cocher une tâche

```markdown
- [x] Tâche terminée
```

### Ajouter une nouvelle tâche

```markdown
- [ ] Nouvelle tâche à faire
```

La roadmap est **thématique** (plus de numéros de phase) :

- Images & Collections
- Frontend & UX
- SEO & Métadonnées
- Technique & Sécurité
- Lancement

## 🔄 Processus systématique

### 1. Avant de commencer

1. ✅ Ouvrir **`obsidian-vault/Projet/roadmap.md`**
2. ✅ Identifier la **section** et la **tâche**
3. ✅ Vérifier les **dépendances** (ex. upload batch après génération images)

### 2. Pendant le développement

- ✅ Se référer à la roadmap pour la liste des tâches
- ✅ Noter mentalement ce qui est fait

### 3. Après CHAQUE tâche complétée

1. ✅ **OBLIGATOIRE** : Cocher dans `obsidian-vault/Projet/roadmap.md`
2. ✅ Mettre à jour le fichier vault concerné si pertinent (ex. `Frontend/Home.md`, `Collections/autry.md`)
3. ✅ Sauvegarder immédiatement

### 4. Après une session significative

1. ✅ Créer ou compléter `obsidian-vault/Sessions/YYYY-MM-DD-sujet.md`
2. ✅ Si état global change → `obsidian-vault/REBOUL.md` (section « Dernière session »)
3. ✅ Optionnel : `frontend/FRONTEND.md` ou `backend/BACKEND.md` pour le détail technique

## 🚀 CLI Python — Automatisation

```bash
# Cocher une tâche (libellé partiel) + sync contexte automatique
./rcli roadmap update --task "Upload batch — Stone Island"

# Sans sync auto
./rcli roadmap update --task "..." --no-sync

# Sync manuel (vault maj + BACKEND/FRONTEND + résumé Cursor)
./rcli context sync

# Vue sections
./rcli roadmap status
```

**Gain de temps** : 3 min → 5 sec pour une mise à jour routinière.

Voir `/cli-workflow` pour le guide complet du CLI.

---

## 🔗 Commandes associées

- `/cli-workflow` : Guide complet du CLI Python (recommandé)
- `/getcontext` : Recherche de contexte (vault + docs techniques)
- `/documentation-workflow` : Workflow documentation complet
- `/roadmap-phase-workflow` : Ajouter un bloc de tâches thématique

## ⚠️ IMPORTANT

- **Vault = source de vérité** pour roadmap et état projet
- **Ne pas oublier** de cocher les tâches (manuellement ou via CLI)
- **Permet de savoir** exactement où on en est
- **Facilite la reprise** après une pause (`/init-cursor` en début de session)
