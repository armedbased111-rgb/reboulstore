# 📜 Scripts utilitaires

Scripts shell pour faciliter le développement et la gestion du projet Reboul Store.

## 🗂️ Scripts disponibles

### `create-category.sh`

Crée une catégorie via l'API backend.

**Usage :**
```bash
./scripts/create-category.sh "Nom de la catégorie" [description]
```

**Exemples :**
```bash
# Catégorie simple
./scripts/create-category.sh "T-Shirts"

# Catégorie avec description
./scripts/create-category.sh "Pulls" "Collection de pulls premium et streetwear"

# Catégorie avec caractères spéciaux (le slug sera automatiquement généré)
./scripts/create-category.sh "Vêtements Adultes"
```

**Ce que fait le script :**
- ✅ Génère automatiquement le slug depuis le nom (minuscules, tirets, sans accents)
- ✅ Envoie la requête POST à l'API backend
- ✅ Affiche le résultat avec des couleurs
- ✅ Formate la réponse JSON pour une meilleure lisibilité

**Configuration :**
- API URL : `http://localhost:3001` (modifiable dans le script)
- Endpoint : `/categories`

### `claude-prompt.sh`

Envoie une requête one-shot à **Claude Code** (réponse puis exit). Pour une session interactive, lancer `claude` directement.

**Usage :**
```bash
./scripts/claude-prompt.sh "Run ./rcli docs sync and tell me the result"
./scripts/claude-prompt.sh "What files have I changed?"
```

**Prérequis :** Claude Code installé et connecté (`claude`, `/login`).

---

## ➕ Ajouter un nouveau script

Quand tu ajoutes un nouveau script :
1. Crée le fichier dans ce dossier `scripts/`
2. Ajoute la ligne `chmod +x` pour rendre le script exécutable
3. Documente-le dans ce README
4. Teste-le avant de commiter
