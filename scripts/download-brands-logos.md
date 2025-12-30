# 📥 Guide Récupération Logos Marques depuis GitHub

## 🎯 Objectif

Récupérer les logos des 36 marques depuis l'ancien repository GitHub (dossier `public`).

## 📋 Étapes Manuelles (Recommandé)

### Option 1 : Téléchargement Manuel

1. **Sur GitHub** :
   - Naviguer dans le dossier `public` de l'ancien repo
   - Localiser le dossier contenant les logos (ex: `public/logos/`, `public/brands/`, `public/images/brands/`)
   - Télécharger le dossier complet (bouton "Download" ou clic droit → "Download")

2. **Dans le projet actuel** :
   - Créer le dossier `assets/brands/logos/` à la racine du projet
   - Copier tous les logos téléchargés dans ce dossier
   - Vérifier les formats (PNG, SVG, JPG ?)

### Option 2 : Clone Partiel avec Git

```bash
# Cloner seulement le dossier public
cd /tmp
git clone --depth 1 --filter=blob:none --sparse <URL_ANCIEN_REPO>
cd <nom-repo>
git sparse-checkout set public/logos  # ou le chemin exact vers les logos
```

## 🔍 Identification des Logos

Une fois les logos récupérés, créer un fichier de mapping :

```json
{
  "brands": [
    {
      "name": "Nike",
      "slug": "nike",
      "logoFile": "nike.png"
    },
    {
      "name": "Adidas",
      "slug": "adidas",
      "logoFile": "adidas.png"
    }
    // ... 36 marques
  ]
}
```

## 📁 Structure Recommandée

```
reboulstore/
├── assets/
│   └── brands/
│       └── logos/
│           ├── nike.png
│           ├── adidas.png
│           └── ...
```

## ✅ Checklist

- [ ] Logos récupérés depuis GitHub
- [ ] Logos copiés dans `assets/brands/logos/`
- [ ] Liste des 36 marques créée (nom, slug, fichier logo)
- [ ] Formats vérifiés (PNG préféré pour logos)
- [ ] Tailles vérifiées (optimiser si > 500x500px)

