# Trame d'activation — Reboul Store

Procédure pour passer du mode maintenance au mode live, et inversement.

---

## État actuel : MAINTENANCE

La page `www.reboulstore.com` affiche une page "Bientôt disponible".
L'admin (`admin.reboulstore.com`) et l'API (`api.reboulstore.com`) fonctionnent normalement.

---

## Passer en LIVE (désactiver la maintenance)

**1. Modifier `nginx/conf.d/reboulstore.conf`** — bloc `location /` du serveur `www.reboulstore.com` :

```nginx
# AVANT (maintenance active)
location / {
    return 503;
    # try_files $uri $uri/ /index.html;
    ...
}

# APRÈS (live)
location / {
    # return 503;
    try_files $uri $uri/ /index.html;
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
}
```

**2. Recharger nginx sur le VPS :**

```bash
./rcli server reload
# ou directement :
docker exec reboulstore-nginx-prod nginx -s reload
```

**3. Vérifier** : ouvrir `https://www.reboulstore.com` en navigation privée.

---

## Repasser en MAINTENANCE (désactiver le live)

Inverser l'étape 1 ci-dessus (remettre `return 503;` et commenter `try_files`), puis recharger nginx.

---

## Architecture de la page maintenance

| Fichier | Rôle |
|---|---|
| `nginx/maintenance.html` | Page HTML statique (design Reboul minimaliste) |
| `docker-compose.prod.yml` | Monte le fichier à `/etc/nginx/maintenance.html:ro` |
| `nginx/conf.d/reboulstore.conf` | `error_page 503` → `alias /etc/nginx/maintenance.html` |

---

## Problème rencontré lors du déploiement (résolu)

**Erreur :** `make mountpoint "/usr/share/nginx/html/maintenance.html": read-only file system`

**Cause :** Le volume `frontend_build` est monté en `:ro` dans nginx. Docker ne peut pas créer un nouveau mountpoint à l'intérieur d'un volume déjà monté en lecture seule.

**Fix :** Monter `maintenance.html` dans `/etc/nginx/` (hors du volume `frontend_build`), et utiliser `alias` dans nginx plutôt que `root`.

Commit : `fix(nginx): monter maintenance.html dans /etc/nginx/ (pas dans le volume ro)`
