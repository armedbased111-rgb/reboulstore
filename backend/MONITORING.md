# 📊 Monitoring & Logs - Configuration

## 📋 Vue d'ensemble

Configuration du monitoring et des logs pour la production.

## 🔍 Health Checks

### Endpoint `/health`

Retourne l'état de santé de l'application :

```json
{
  "status": "ok",
  "timestamp": "2025-12-20T03:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0"
}
```

### Utilisation

```bash
# Vérifier la santé
curl http://localhost:3001/health

# Utiliser dans Docker healthcheck
# (déjà configuré dans Dockerfile.prod)
```

## 📝 Logging

### Logger NestJS intégré

Le backend utilise le logger intégré de NestJS :
- **Development** : Logs détaillés (debug, verbose)
- **Production** : Logs essentiels uniquement (error, warn, log)

### Utilisation dans le code

```typescript
import { Logger } from '@nestjs/common';

export class MyService {
  private readonly logger = new Logger(MyService.name);

  someMethod() {
    this.logger.log('Info message');
    this.logger.warn('Warning message');
    this.logger.error('Error message', error.stack);
    this.logger.debug('Debug message'); // Seulement en dev
  }
}
```

### Winston (Optionnel - pour logs avancés)

Si tu veux des logs plus avancés avec Winston :

1. **Installer** :
```bash
npm install winston nest-winston
```

2. **Configurer** dans `app.module.ts` :
```typescript
import { WinstonModule } from 'nest-winston';
import { getLoggerConfig } from './config/logger.config';

@Module({
  imports: [
    WinstonModule.forRoot(getLoggerConfig()),
    // ...
  ],
})
```

3. **Utiliser** :
```typescript
import { LoggerService } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class MyService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}
}
```

## 🚨 Sentry (Monitoring d'erreurs)

### Installation

```bash
npm install @sentry/node @sentry/integrations
```

### Configuration

1. **Créer un compte Sentry** : https://sentry.io
2. **Créer un projet** et récupérer le DSN
3. **Ajouter dans `.env.production`** :
```
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

4. **Décommenter l'initialisation** dans `main.ts` :
```typescript
import { initSentry } from './config/sentry.config';

async function bootstrap() {
  initSentry(); // Décommenter cette ligne
  // ...
}
```

### Fonctionnalités

- Capture automatique des erreurs non gérées
- Stack traces détaillées
- Performance monitoring
- Alertes par email/Slack
- Dashboard de monitoring

## 📈 Monitoring Uptime

### Services recommandés

1. **UptimeRobot** (gratuit) : https://uptimerobot.com
   - Monitoring toutes les 5 minutes (gratuit)
   - Alertes par email/SMS
   - Dashboard public

2. **Pingdom** : https://www.pingdom.com
   - Plus de fonctionnalités
   - Payant

3. **StatusCake** : https://www.statuscake.com
   - Gratuit jusqu'à 10 monitors

### Configuration UptimeRobot

1. Créer un compte UptimeRobot
2. Ajouter un nouveau monitor :
   - **Type** : HTTP(s)
   - **URL** : `https://reboulstore.com/health`
   - **Intervalle** : 5 minutes
   - **Alertes** : Email/SMS
3. Répéter pour `https://admin.reboulstore.com/health`

### Script de monitoring simple (optionnel)

Créer un script cron pour vérifier l'uptime :

```bash
#!/bin/bash
# scripts/monitor-uptime.sh

HEALTH_URL="http://localhost:3001/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ "$RESPONSE" != "200" ]; then
  echo "ALERT: Backend health check failed (HTTP $RESPONSE)"
  # Envoyer une alerte (email, webhook, etc.)
fi
```

## 📊 Logs en Production

### Accès aux logs Docker

```bash
# Logs backend
docker logs reboulstore-backend-prod -f

# Logs Nginx
docker logs reboulstore-nginx-prod -f

# Logs de tous les services
docker compose -f docker-compose.prod.yml logs -f
```

### Rotation des logs

Les logs Docker sont automatiquement limités :
- **Max size** : 10MB par fichier
- **Max files** : 3 fichiers
- Configuration dans `docker-compose.prod.yml`

### Logs Winston (si installé)

Les logs sont stockés dans :
- `logs/error.log` : Erreurs uniquement
- `logs/combined.log` : Tous les logs

Rotation automatique : 10MB max, 5 fichiers max.

## 🔔 Alertes

### Configuration d'alertes

1. **Sentry** : Alertes automatiques pour les erreurs
2. **UptimeRobot** : Alertes si le site est down
3. **Email** : Configurer dans Sentry/UptimeRobot

### Alertes recommandées

- ⚠️ Site down (UptimeRobot)
- ⚠️ Erreurs critiques (Sentry)
- ⚠️ Stock faible (à implémenter dans l'application)
- ⚠️ Paiements échoués (à implémenter)

## 📝 Checklist Production

- [x] Health check endpoint configuré (`/health`)
- [x] Logger NestJS configuré (niveaux selon environnement)
- [ ] Winston installé et configuré (optionnel)
- [ ] Sentry installé et configuré (optionnel mais recommandé)
- [ ] UptimeRobot configuré pour monitoring uptime
- [ ] Alertes configurées (email/SMS)
- [ ] Logs Docker configurés avec rotation
- [ ] Scripts de monitoring créés (optionnel)
