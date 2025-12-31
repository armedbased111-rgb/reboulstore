# Cron Job Optimisation Images - JPG/PNG → WebP ✅

## 📋 Vue d'ensemble

Cron job automatique qui analyse et convertit les images JPG/PNG en WebP pour optimiser les performances du site.

**✅ IMPLÉMENTÉ ET FONCTIONNEL**

## ⚙️ Fonctionnement

### Automatique

Le système exécute automatiquement deux cron jobs :

1. **Quotidien (3h du matin)** : Optimise les nouvelles images des dernières 24h
2. **Hebdomadaire (dimanche 4h)** : Optimise toutes les images non optimisées

### Manuel

Tu peux aussi déclencher l'optimisation manuellement via les endpoints :

```bash
# Optimiser toutes les images non optimisées
POST /images-optimization/optimize-all?limit=100

# Optimiser les nouvelles images (24h)
POST /images-optimization/optimize-new?since=2024-12-29
```

## 🔄 Processus

1. **Scan** : Recherche toutes les images en base de données
2. **Filtrage** : Ignore les images déjà en WebP ou non-Cloudinary
3. **Conversion** : Génère l'URL WebP optimisée via Cloudinary
4. **Mise à jour** : Met à jour l'URL en base de données

## 📊 Statistiques

Le service retourne des statistiques détaillées :

```json
{
  "total": 150,
  "optimized": 120,
  "skipped": 25,
  "errors": 5,
  "details": {
    "optimized": ["uuid1", "uuid2", ...],
    "skipped": ["uuid3: Déjà en WebP", ...],
    "errors": ["uuid4: Image non trouvée", ...]
  }
}
```

## ⚙️ Configuration

### Variables d'environnement

Les variables Cloudinary doivent être configurées dans `.env` :

```env
CLOUDINARY_CLOUD_NAME=ton_cloud_name
CLOUDINARY_API_KEY=ton_api_key
CLOUDINARY_API_SECRET=ton_api_secret
```

### Cron Jobs

Les cron jobs sont configurés dans `images-optimization.scheduler.ts` :

- **Quotidien** : `@Cron(CronExpression.EVERY_DAY_AT_3AM)`
- **Hebdomadaire** : `@Cron('0 4 * * 0')` (dimanche 4h)

Tu peux modifier les horaires si besoin.

## 🚀 Utilisation

### Déclencher manuellement

```bash
# Via curl
curl -X POST http://localhost:3001/images-optimization/optimize-all

# Avec limite
curl -X POST http://localhost:3001/images-optimization/optimize-all?limit=50
```

### Vérifier les logs

Les logs sont disponibles dans les logs NestJS :

```bash
docker compose logs backend | grep "Optimisation"
```

## 📝 Notes

- Les images sont converties **à la volée** par Cloudinary (pas de stockage WebP séparé)
- L'URL est mise à jour pour utiliser la version WebP optimisée
- Les images non-Cloudinary sont ignorées
- Les images déjà en WebP sont ignorées
- Le cron job fonctionne automatiquement dès que le backend démarre
- Aucune dépendance supplémentaire nécessaire (utilise Cloudinary directement)

## 🔧 Personnalisation

### Modifier la fréquence

Édite `images-optimization.scheduler.ts` :

```typescript
// Toutes les 6 heures
@Cron('0 */6 * * *')

// Tous les jours à 2h
@Cron('0 2 * * *')
```

### Modifier les paramètres d'optimisation

Édite `images-optimization.service.ts` → `generateWebPUrl()` :

```typescript
private generateWebPUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    fetch_format: 'webp',
    quality: 'auto:good', // ou 'auto:best', 'auto:eco'
    transformation: [
      {
        quality: 'auto:good',
        fetch_format: 'webp',
      },
    ],
  });
}
```

## 📁 Fichiers

- **Service** : `backend/src/modules/images-optimization/images-optimization.service.ts`
- **Scheduler** : `backend/src/modules/images-optimization/images-optimization.scheduler.ts`
- **Controller** : `backend/src/modules/images-optimization/images-optimization.controller.ts`
- **Module** : `backend/src/modules/images-optimization/images-optimization.module.ts`

## ✅ Statut

**IMPLÉMENTÉ ET PRÊT** - Le cron job fonctionnera automatiquement dès que le backend démarre.
