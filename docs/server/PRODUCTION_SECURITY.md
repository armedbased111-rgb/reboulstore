# Sécurité Production - Reboul Store

## 🛡️ Vue d'ensemble

Documentation complète des mesures de sécurité mises en place pour la production.

## ✅ Mesures déjà en place

### Headers de sécurité (Nginx)

Les headers de sécurité suivants sont configurés dans nginx pour tous les sites :

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

**Protection** :
- **X-Frame-Options** : Empêche le clickjacking
- **X-Content-Type-Options** : Empêche le MIME-sniffing
- **X-XSS-Protection** : Active la protection XSS du navigateur
- **Referrer-Policy** : Contrôle les informations de référent envoyées

### Validation des données (Backend NestJS)

- **ValidationPipe global** : Validation automatique de toutes les requêtes
- **whitelist: true** : Supprime les propriétés non définies dans les DTOs
- **forbidNonWhitelisted: true** : Rejette les requêtes avec propriétés non autorisées
- **transform: true** : Transformation automatique des types

### Firewall serveur (UFW)

- Port 22 (SSH) : Ouvert avec clés uniquement
- Port 80 (HTTP) : Ouvert
- Port 443 (HTTPS) : Ouvert (à activer avec SSL)
- Tous les autres ports : Bloqués

---

## 🔒 Configuration à compléter

### 1. Rate Limiting

#### Rate Limiting Nginx

**Configuration recommandée** pour `nginx/conf.d/reboulstore.conf` :

```nginx
# Zone de rate limiting (définir dans nginx.conf ou dans le fichier de config)
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;

# Dans le bloc server, appliquer les limites
location /api/auth {
    limit_req zone=auth_limit burst=10 nodelay;
    # ... reste de la config
}

location /api {
    limit_req zone=api_limit burst=20 nodelay;
    # ... reste de la config
}

location / {
    limit_req zone=general_limit burst=50 nodelay;
    # ... reste de la config
}
```

**Limites recommandées** :
- `/api/auth/*` : 5 requêtes/seconde (burst 10)
- `/api/*` : 10 requêtes/seconde (burst 20)
- Routes générales : 30 requêtes/seconde (burst 50)

#### Rate Limiting Backend (NestJS - Optionnel)

Si tu veux un rate limiting plus granulaire au niveau backend :

```bash
npm install @nestjs/throttler
```

```typescript
// app.module.ts
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10, // 10 requêtes par minute par IP
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

---

### 2. HTTPS obligatoire (Let's Encrypt)

**Prérequis** : Avoir configuré les DNS pour pointer vers le serveur

**Installation Certbot** :
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

**Génération des certificats** :
```bash
# Pour Reboul Store
sudo certbot certonly --standalone -d www.reboulstore.com -d reboulstore.com

# Pour Admin Central
sudo certbot certonly --standalone -d admin.reboulstore.com
```

**Configuration Nginx** :

1. **Copier les certificats dans les dossiers nginx** :
```bash
# Reboul Store
sudo cp /etc/letsencrypt/live/www.reboulstore.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/www.reboulstore.com/privkey.pem nginx/ssl/
sudo chmod 644 nginx/ssl/fullchain.pem
sudo chmod 600 nginx/ssl/privkey.pem

# Admin Central
sudo cp /etc/letsencrypt/live/admin.reboulstore.com/fullchain.pem admin-central/nginx/ssl/
sudo cp /etc/letsencrypt/live/admin.reboulstore.com/privkey.pem admin-central/nginx/ssl/
sudo chmod 644 admin-central/nginx/ssl/fullchain.pem
sudo chmod 600 admin-central/nginx/ssl/privkey.pem
```

2. **Décommenter la configuration SSL** dans les fichiers nginx :
   - `nginx/conf.d/reboulstore.conf`
   - `admin-central/nginx/conf.d/admin.conf`

3. **Redémarrer les containers nginx**

**Renouvellement automatique** :
```bash
# Tester le renouvellement
sudo certbot renew --dry-run

# Le renouvellement automatique est configuré par défaut via systemd timer
```

---

### 3. Firewall WAF (Web Application Firewall)

#### Option 1 : Cloudflare (Recommandé - Gratuit)

Si tu utilises Cloudflare comme CDN (voir `docs/CDN_CONFIGURATION.md`), le WAF est inclus :

**Configuration Cloudflare WAF** :
1. Aller dans Cloudflare Dashboard → Security → WAF
2. Activer les règles par défaut :
   - **Cloudflare Managed Ruleset** : Activer (défense contre attaques communes)
   - **OWASP Core Ruleset** : Activer (protection OWASP Top 10)
3. Configurer des règles custom si nécessaire

**Protection incluse** :
- Protection DDoS automatique
- Protection contre SQL injection
- Protection contre XSS
- Protection contre CSRF
- Rate limiting au niveau Cloudflare

#### Option 2 : AWS WAF (Si tu utilises CloudFront)

**Configuration AWS WAF** :
1. Créer un Web ACL dans AWS WAF
2. Ajouter des règles :
   - AWS Managed Rules (Core Rule Set, Known Bad Inputs)
   - Rate-based rules (limiter requêtes par IP)
3. Associer le Web ACL à la distribution CloudFront

**Coûts** : ~$1 par Web ACL + $0.60 par million de requêtes évaluées

---

### 4. Audit des dépendances

#### NPM Audit

**Vérification régulière** :
```bash
# Backend
cd backend
npm audit

# Frontend
cd frontend
npm audit

# Admin Central Frontend
cd admin-central/frontend
npm audit
```

**Correction automatique** :
```bash
npm audit fix
```

**Vérification stricte** :
```bash
npm audit --audit-level=moderate
```

#### Snyk (Recommandé pour un monitoring continu)

**Installation** :
```bash
npm install -g snyk
snyk auth
```

**Test d'un projet** :
```bash
cd backend
snyk test
```

**Monitoring continu** :
```bash
snyk monitor
```

Snyk créera un projet sur https://app.snyk.io avec :
- Alertes pour nouvelles vulnérabilités
- Suggestions de correctifs
- Rapports de sécurité

**Gratuit pour** : Open source projects, projets privés (limité)

---

### 5. Headers de sécurité supplémentaires (Helmet.js - Optionnel)

Si tu veux des headers supplémentaires au niveau backend :

**Installation** :
```bash
cd backend
npm install helmet
```

**Configuration** :
```typescript
// main.ts
import helmet from 'helmet';

const app = await NestFactory.create<NestExpressApplication>({
  // ...
});

// Configuration Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

**Note** : Les headers de base sont déjà configurés dans nginx. Helmet.js ajoute des protections supplémentaires (CSP, HSTS, etc.).

---

## 📋 Checklist de sécurité

### Headers de sécurité ✅
- [x] X-Frame-Options configuré
- [x] X-Content-Type-Options configuré
- [x] X-XSS-Protection configuré
- [x] Referrer-Policy configuré
- [ ] HSTS (à activer avec HTTPS)
- [ ] Content-Security-Policy (optionnel - Helmet.js)

### Rate Limiting
- [ ] Rate limiting Nginx configuré
- [ ] Rate limiting Backend (optionnel - Throttler)

### HTTPS
- [ ] Certificats Let's Encrypt générés
- [ ] Configuration SSL activée dans nginx
- [ ] Redirection HTTP → HTTPS configurée
- [ ] Renouvellement automatique vérifié

### Firewall WAF
- [ ] Cloudflare WAF activé (si Cloudflare utilisé)
- [ ] OU AWS WAF configuré (si CloudFront utilisé)

### Audit des dépendances
- [ ] Script npm audit créé
- [ ] Snyk configuré (optionnel mais recommandé)
- [ ] Monitoring continu configuré

### Autres mesures
- [x] Firewall serveur (UFW) configuré
- [x] SSH avec clés uniquement
- [x] Validation des données (ValidationPipe)
- [ ] Backup automatique (déjà configuré en Phase 23.2)
- [ ] Logs centralisés (déjà configuré en Phase 23.2)

---

## 🔧 Scripts utiles

### Script d'audit complet

Créer `scripts/security-audit.sh` :

```bash
#!/bin/bash

echo "🔍 Audit de sécurité..."

echo ""
echo "1. Audit NPM (Backend)"
cd backend && npm audit --audit-level=moderate
cd ..

echo ""
echo "2. Audit NPM (Frontend)"
cd frontend && npm audit --audit-level=moderate
cd ..

echo ""
echo "3. Audit NPM (Admin Central Frontend)"
cd admin-central/frontend && npm audit --audit-level=moderate
cd ../..

echo ""
echo "✅ Audit terminé"
```

### Script de vérification headers sécurité

```bash
#!/bin/bash

echo "🔒 Vérification des headers de sécurité..."

echo ""
echo "Reboul Store:"
curl -I https://www.reboulstore.com 2>/dev/null | grep -E "X-Frame-Options|X-Content-Type-Options|X-XSS-Protection|Strict-Transport-Security"

echo ""
echo "Admin Central:"
curl -I https://admin.reboulstore.com 2>/dev/null | grep -E "X-Frame-Options|X-Content-Type-Options|X-XSS-Protection|Strict-Transport-Security"
```

---

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Nginx Security Headers](https://nginx.org/en/docs/http/ngx_http_headers_module.html)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Cloudflare WAF](https://developers.cloudflare.com/waf/)
- [Snyk Documentation](https://docs.snyk.io/)

---

## 🚨 En cas d'incident de sécurité

1. **Isoler** : Bloquer l'accès si nécessaire (UFW, Cloudflare)
2. **Analyser** : Vérifier les logs (`scripts/view-logs.sh`)
3. **Corriger** : Appliquer les correctifs nécessaires
4. **Documenter** : Noter l'incident et les mesures prises
5. **Prévenir** : Renforcer les mesures de sécurité si nécessaire

---

## ⚠️ Notes importantes

1. **Ne jamais commiter** :
   - Secrets (JWT, DB passwords, API keys)
   - Certificats privés
   - Fichiers `.env.production`

2. **Rotation régulière** :
   - Mots de passe base de données (tous les 6-12 mois)
   - Clés JWT (si compromise)
   - Certificats SSL (renouvellement automatique via certbot)

3. **Monitoring** :
   - Surveiller les logs pour activités suspectes
   - Configurer des alertes pour erreurs critiques
   - Vérifier régulièrement les audits de dépendances
