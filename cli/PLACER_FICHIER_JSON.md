# 📁 Comment placer le fichier JSON

## 🎯 Étape simple

1. **Le fichier JSON est téléchargé** (généralement dans ton dossier "Downloads" / Téléchargements)

2. **Renommer le fichier** (optionnel mais recommandé) :
   - Renomme-le en : `ga4-service-account.json`

3. **Le placer dans le bon dossier** :
   ```
   cli/credentials/ga4-service-account.json
   ```

## 📋 Méthodes pour déplacer le fichier

### Méthode 1 : Finder (Mac)

1. Ouvrir Finder
2. Aller dans "Downloads" (Téléchargements)
3. Trouver le fichier JSON téléchargé
4. Le renommer : `ga4-service-account.json` (clic droit > Renommer)
5. Ouvrir un autre Finder
6. Aller dans : `/Users/tripleseptinteractive/code/reboulstore/reboulstore/cli/credentials/`
7. Glisser-déposer le fichier JSON ici

### Méthode 2 : Terminal

```bash
# Si le fichier est dans Downloads
mv ~/Downloads/[NOM-DU-FICHIER].json /Users/tripleseptinteractive/code/reboulstore/reboulstore/cli/credentials/ga4-service-account.json

# Remplacer [NOM-DU-FICHIER] par le vrai nom du fichier téléchargé
```

### Méthode 3 : Vérifier où il est

```bash
# Lister les fichiers JSON récents dans Downloads
ls -lt ~/Downloads/*.json 2>/dev/null | head -5
```

## ✅ Vérifier que c'est bon

```bash
cd /Users/tripleseptinteractive/code/reboulstore/reboulstore/cli
ls -la credentials/
```

Tu devrais voir : `ga4-service-account.json`
