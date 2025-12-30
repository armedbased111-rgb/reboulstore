# 📝 Préparation Données Marques

## 🎯 Objectif

Créer le fichier de données des 36 marques avec leurs logos pour l'import.

## 📋 Structure Fichier JSON

Créer `backend/scripts/brands-data.json` :

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
    // ... 34 autres marques
  ]
}
```

## 🔧 Génération Automatique du Slug

Le slug doit être généré depuis le nom :
- Minuscules
- Espaces → tirets
- Caractères spéciaux → supprimés ou remplacés
- Exemples :
  - "Nike" → "nike"
  - "A-COLD-WALL*" → "a-cold-wall"
  - "New Balance" → "new-balance"

## 📝 Liste des 36 Marques

**À compléter avec les vraies marques** :

1. Nike
2. Adidas
3. ...
(34 autres à identifier depuis les logos récupérés)

## ✅ Checklist

- [ ] Tous les logos nommés correctement
- [ ] Fichier JSON créé avec 36 marques
- [ ] Slugs générés et uniques
- [ ] Correspondance nom marque ↔ fichier logo vérifiée

