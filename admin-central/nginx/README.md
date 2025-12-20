# 📋 Configuration Nginx Production - Admin Central

## Structure des fichiers

```
admin-central/nginx/
├── nginx.prod.conf          # Configuration principale Nginx
├── conf.d/
│   └── admin.conf           # Configuration spécifique Admin Central
├── ssl/                     # Certificats SSL/TLS (à ajouter)
│   └── .gitkeep
└── SSL_SETUP.md            # Guide configuration SSL/TLS (dans nginx/)
```

## Fonctionnalités configurées

### ✅ Routage
- `admin.reboulstore.com` → Frontend Admin React (fichiers statiques)
- `/api` → Backend Admin NestJS (reverse proxy sur port 4001)
- `/health` → Health check backend admin

### ✅ Performance
- **Compression gzip** : Active pour tous les fichiers texte
- **Compression brotli** : Préparée (décommenter si module disponible)
- **Cache assets** : 30 jours pour images/fonts, no-cache pour HTML

### ✅ Sécurité
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- SSL/TLS préparé (à activer avec certificats Let's Encrypt)
- Redirection HTTP → HTTPS (à activer)

### ✅ React Router
- Support SPA : toutes les routes servent `index.html`
- Assets statiques servis correctement

## Utilisation

Les fichiers sont montés dans le container Nginx Admin via `docker-compose.prod.yml` :
- `nginx.prod.conf` → `/etc/nginx/nginx.conf`
- `conf.d/admin.conf` → `/etc/nginx/conf.d/admin.conf`
- `ssl/` → `/etc/nginx/ssl/`

## Configuration SSL/TLS

Voir `../nginx/SSL_SETUP.md` pour les instructions complètes.

## Vérification

```bash
# Vérifier la syntaxe (depuis le container)
docker exec admin-central-nginx-prod nginx -t

# Vérifier les logs
docker logs admin-central-nginx-prod

# Tester le routage
curl http://localhost:4000/api/health
curl http://localhost:4000/
```
