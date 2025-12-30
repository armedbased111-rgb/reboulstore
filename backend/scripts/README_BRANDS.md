# 📋 Scripts Import Marques avec Logos

## 🎯 Objectif

Importer les 56 marques avec leurs logos depuis l'archive Reboul 2024 vers Cloudinary et la base de données.

## 📁 Fichiers

- `brands-data.json` : Liste des 56 marques avec chemins vers logos
- `upload-brands-logos.ts` : Script upload logos sur Cloudinary
- `import-brands.ts` : Script import marques en base de données
- `brands-data-with-urls.json` : Généré automatiquement après upload (contient URLs Cloudinary)

## 🚀 Utilisation

### Étape 1 : Upload Logos sur Cloudinary

```bash
cd backend
npx ts-node -r tsconfig-paths/register scripts/upload-brands-logos.ts
```

**Ce que fait le script** :
- Lit `brands-data.json`
- Upload chaque logo sur Cloudinary dans le dossier `brands/logos/`
- Génère `brands-data-with-urls.json` avec les URLs Cloudinary

**Résultat** :
- Logos uploadés sur Cloudinary
- Fichier `brands-data-with-urls.json` créé avec URLs

### Étape 2 : Import Marques en Base de Données

```bash
cd backend
npx ts-node -r tsconfig-paths/register scripts/import-brands.ts
```

**Ce que fait le script** :
- Lit `brands-data-with-urls.json` (ou `brands-data.json` en fallback)
- Crée les marques en base de données
- Met à jour les marques existantes si logoUrl manquant
- Ignore les marques déjà présentes avec logoUrl

**Résultat** :
- 56 marques créées/mises à jour en base
- Logos associés via `logoUrl`

## ✅ Vérification

### Vérifier les marques en base

```bash
# Via psql
docker compose exec postgres psql -U reboulstore -d reboulstore_db -c "SELECT name, slug, logoUrl IS NOT NULL as has_logo FROM brands ORDER BY name;"
```

### Vérifier les endpoints

```bash
# Liste toutes les marques
curl http://localhost:3001/brands

# Une marque par slug
curl http://localhost:3001/brands/slug/nike
```

## 📊 Statistiques

- **Total marques** : 56
- **Organisation Cloudinary** : `brands/logos/[slug]`
- **Format logos** : PNG (versions _w pour blanc, _b pour noir - on utilise _w)

## 🔧 Personnalisation

### Modifier les logos utilisés

Éditer `brands-data.json` et changer le champ `logoFile` et `logoPath` pour chaque marque.

### Ajouter une nouvelle marque

Ajouter une entrée dans `brands-data.json` :

```json
{
  "name": "Nouvelle Marque",
  "slug": "nouvelle-marque",
  "description": null,
  "logoFile": "nouvelle-marque_w.png",
  "logoPath": "brands/NOUVELLEMARQUE/nouvelle-marque_w.png"
}
```

Puis relancer les scripts.

## ⚠️ Notes

- Les logos doivent être dans `frontend/public/archive reboul 2024/`
- Le script d'upload génère automatiquement `brands-data-with-urls.json`
- Le script d'import vérifie les doublons par `slug`
- Les marques existantes sont mises à jour si `logoUrl` manquant

