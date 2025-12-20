# 🚀 Guide de Déploiement Production

## 📋 Prérequis

- ✅ **Phase 17.11.5 complétée** : Serveur OVH acheté et configuré
  - Voir `docs/OVH_SERVER_SETUP.md` pour la configuration initiale
- Docker et Docker Compose installés sur le serveur
- Accès SSH au serveur de production
- Variables d'environnement configurées (`.env.production`)
- DNS configuré (reboulstore.com, admin.reboulstore.com → IP serveur)

## 🔧 Configuration Initiale

### 1. Créer les fichiers d'environnement

```bash
# Pour Reboul Store
cp env.production.example .env.production
# Éditer .env.production avec tes vraies valeurs

# Pour Admin Central
cd admin-central
cp env.production.example .env.production
# Éditer .env.production avec tes vraies valeurs
cd ..
```

### 2. Générer des secrets sécurisés

```bash
# Générer un JWT_SECRET aléatoire
openssl rand -base64 32

# Générer un mot de passe DB fort
openssl rand -base64 24
```

## 🏗️ Build des Images Docker

### Reboul Store

```bash
# Build toutes les images
docker-compose -f docker-compose.prod.yml build

# Vérifier la configuration
docker-compose -f docker-compose.prod.yml config
```

### Admin Central

```bash
cd admin-central

# Build toutes les images
docker-compose -f docker-compose.prod.yml build

# Vérifier la configuration
docker-compose -f docker-compose.prod.yml config

cd ..
```

## 🚀 Démarrage en Production

### Ordre de démarrage

1. **D'abord Reboul Store** (crée le réseau Docker)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

2. **Ensuite Admin Central** (utilise le réseau existant)
```bash
cd admin-central
docker-compose -f docker-compose.prod.yml up -d
cd ..
```

## ✅ Vérification

### Vérifier que tout fonctionne

```bash
# Vérifier les containers
docker-compose -f docker-compose.prod.yml ps

# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs -f

# Vérifier le healthcheck backend
curl http://localhost:3001/health
```

### Vérifier Admin Central

```bash
cd admin-central
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
curl http://localhost:4001/health
cd ..
```

## 🔄 Commandes Utiles

### Arrêter les services

```bash
# Reboul Store
docker-compose -f docker-compose.prod.yml down

# Admin Central
cd admin-central
docker-compose -f docker-compose.prod.yml down
cd ..
```

### Redémarrer un service spécifique

```bash
docker-compose -f docker-compose.prod.yml restart backend
```

### Voir les logs d'un service

```bash
docker-compose -f docker-compose.prod.yml logs -f backend
```

## ⚠️ Notes Importantes

- **Ne jamais commiter** `.env.production` dans Git
- Les mots de passe doivent être **forts et uniques**
- Le réseau Docker `reboulstore-network` est partagé entre Reboul et Admin
- Les volumes persistants sauvegardent les données PostgreSQL
- Les healthchecks vérifient automatiquement l'état des services

## 🔐 Sécurité

- Utiliser HTTPS en production (SSL/TLS)
- Configurer un firewall
- Limiter l'accès aux ports Docker
- Utiliser des secrets managés (Docker Secrets, Vault, etc.)

## 📝 Prochaines Étapes

Une fois que tout fonctionne :
1. Configurer Nginx (Phase 17.11.2)
2. Configurer SSL/TLS (Let's Encrypt)
3. Créer les scripts de déploiement (Phase 17.11.3)
4. Configurer le monitoring (Phase 17.11.4)
