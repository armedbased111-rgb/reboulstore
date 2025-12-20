# 📋 Configuration Nginx Production

## Structure des fichiers

```
nginx/
├── nginx.prod.conf          # Configuration principale Nginx
├── conf.d/
│   └── reboulstore.conf     # Configuration spécifique Reboul Store
├── ssl/                     # Certificats SSL/TLS (à ajouter)
│   └── .gitkeep
└── SSL_SETUP.md            # Guide configuration SSL/TLS
```

## Fonctionnalités configurées

### ✅ Routage
- `reboulstore.com` → Frontend React (fichiers statiques)
- `/api` → Backend NestJS (reverse proxy sur port 3001)
- `/health` → Health check backend

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

### En développement
Ces fichiers ne sont pas utilisés. On utilise le serveur de dev Vite.

### En production
Les fichiers sont montés dans le container Nginx via `docker-compose.prod.yml` :
- `nginx.prod.conf` → `/etc/nginx/nginx.conf`
- `conf.d/reboulstore.conf` → `/etc/nginx/conf.d/reboulstore.conf`
- `ssl/` → `/etc/nginx/ssl/`

## Configuration SSL/TLS

Voir `SSL_SETUP.md` pour les instructions complètes.

## Vérification

```bash
# Vérifier la syntaxe (depuis le container)
docker exec reboulstore-nginx-prod nginx -t

# Vérifier les logs
docker logs reboulstore-nginx-prod

# Tester le routage
curl http://localhost/api/health
curl http://localhost/
```
