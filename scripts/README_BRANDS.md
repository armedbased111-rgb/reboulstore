# 📋 Guide Récupération Logos Marques

## 🎯 Objectif

Récupérer les logos des 36 marques depuis l'ancien repository GitHub et les préparer pour l'upload sur Cloudinary.

---

## 📥 Étape 1 : Récupération depuis GitHub

### Option A : Téléchargement Manuel (Recommandé)

1. **Sur GitHub** :
   - Naviguer dans le dossier `public` de l'ancien repo
   - Localiser le dossier contenant les logos
   - Télécharger le dossier complet (bouton "Download" ou clic droit)

2. **Dans le projet actuel** :
   ```bash
   # Créer le dossier
   mkdir -p assets/brands/logos
   
   # Copier les logos téléchargés
   cp -r ~/Downloads/logos/* assets/brands/logos/
   ```

### Option B : Script Automatique

Si tu connais l'URL du repo et le chemin exact des logos :

```bash
./scripts/download-brands-logos.sh <URL_REPO> <CHEMIN_LOGOS>
# Exemple: ./scripts/download-brands-logos.sh https://github.com/user/repo.git public/logos
```

---

## 🔍 Étape 2 : Identifier les Logos

Une fois les logos récupérés, lister les fichiers :

```bash
ls -lh assets/brands/logos/
```

**Questions à répondre** :
- Combien de fichiers logos ? (devrait être 36)
- Quels formats ? (PNG, SVG, JPG ?)
- Comment sont-ils nommés ? (nike.png, adidas.png ?)

---

## 📝 Étape 3 : Créer le Fichier de Données

Créer `backend/scripts/brands-data.json` avec la liste des 36 marques :

```json
{
  "brands": [
    {
      "name": "Nike",
      "slug": "nike",
      "description": null,
      "logoFile": "nike.png"
    },
    {
      "name": "Adidas",
      "slug": "adidas",
      "description": null,
      "logoFile": "adidas.png"
    }
    // ... 34 autres
  ]
}
```

**Génération du slug** :
- Minuscules
- Espaces → tirets
- Caractères spéciaux supprimés
- Exemples :
  - "Nike" → "nike"
  - "A-COLD-WALL*" → "a-cold-wall"
  - "New Balance" → "new-balance"

---

## ✅ Checklist

- [ ] Logos récupérés depuis GitHub
- [ ] Logos copiés dans `assets/brands/logos/`
- [ ] Liste des fichiers vérifiée (36 logos ?)
- [ ] Formats identifiés (PNG, SVG, JPG ?)
- [ ] Fichier `brands-data.json` créé avec 36 marques
- [ ] Slugs générés et uniques
- [ ] Correspondance nom marque ↔ fichier logo vérifiée

---

## 🚀 Prochaines Étapes

Une fois les logos récupérés et le fichier de données créé :

1. **Upload sur Cloudinary** : Script `upload-brands-logos.ts`
2. **Import en base** : Script `import-brands.ts`
3. **Vérification** : Tester endpoints et Admin
4. **Composant BrandCarousel** : Créer le carousel pour la homepage

