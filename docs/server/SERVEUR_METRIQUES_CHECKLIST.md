# Checklist métriques serveur – Reboul Store & Admin

Vérifications habituelles pour confirmer que le serveur et les sites sont OK.

---

## 1. Containers (tout doit être Up)

```bash
./rcli server status --all
```

**Attendu :**
- **Reboul Store** : reboulstore-nginx-prod, reboulstore-frontend-prod, reboulstore-backend-prod (healthy), reboulstore-postgres-prod (healthy), reboulstore-redis-prod (healthy).
- **Admin Central** : admin-central-nginx-prod, admin-central-frontend-prod, admin-central-backend-prod (healthy).

---

## 2. Ressources machine

```bash
./rcli server resources
```

**À surveiller :**
- CPU raisonnable (< 80 % en charge normale).
- RAM : 582 Mi / 22 Gi = OK.
- Disque : 13 G / 194 G (7 %) = OK.

---

## 3. Certificats SSL

```bash
./rcli server ssl --check
```

**Attendu :** tous les domaines (reboulstore.com, www, admin) en **VALIDE**, avec une date d’expiration dans le futur.

---

## 4. DNS / Cloudflare

```bash
./rcli server dns --check www.reboulstore.com
./rcli server dns --check admin.reboulstore.com
```

**Attendu :**
- Les noms résolvent vers des IP **Cloudflare** (104.21.x, 172.67.x) quand le proxy est activé.
- Propagation OK sur les résolveurs testés.

**À vérifier dans Cloudflare :**
- **SSL/TLS** : mode **Full** ou **Full (strict)** (Cloudflare parle en HTTPS à l’origin).
- **Origin server** : adresse = IP du VPS (ex. 152.228.218.35), pas une IP Cloudflare.

---

## 5. Ports et écoute sur le VPS

Sur le serveur, les ports **80** et **443** doivent être **ouverts** et **écoutés** par le bon service (Nginx Reboul) :

```bash
./rcli server exec "ss -tlnp | grep -E ':80|:443'"
```

**Attendu :**
- Au moins une ligne pour **:80** et une pour **:443**.
- Le processus qui écoute doit être celui qui sert Reboul (Nginx du container ou Nginx host qui proxy vers le container).

**Problème fréquent :**
- **Rien n’écoute sur 443** → Cloudflare en mode Full renvoie **521 (Web server is down)**.
- **reboulstore-nginx-prod sans ports publiés** (pas de 80:80 / 443:443) → le trafic n’atteint pas le site.

---

## 6. Health check (depuis ta machine, via Cloudflare)

```bash
./rcli health check
```

**Attendu :** Frontend et Backend Reboul + Admin en **OK** (HTTP 200), pas **521**.

- **521** = Cloudflare n’arrive pas à joindre l’origin (port 443 fermé, mauvais IP origin, ou Nginx down).
- Si les containers sont Up mais health check en 521 → corriger **ports / écoute 443** et **config Cloudflare (origin + SSL)**.

---

## 7. Test direct sur le serveur (origine du trafic)

Pour vérifier que Nginx répond **sur le serveur** (sans passer par Cloudflare) :

```bash
./rcli server exec "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/ -H 'Host: www.reboulstore.com'"
./rcli server exec "curl -s -o /dev/null -w '%{http_code}' https://127.0.0.1/ -k -H 'Host: www.reboulstore.com'"
```

**Attendu :** 200 en HTTP et en HTTPS si Nginx Reboul écoute bien sur 80 et 443.

---

## 8. Résumé des problèmes courants

| Symptôme              | Cause probable                          | Action |
|-----------------------|------------------------------------------|--------|
| Health check 521      | Rien n’écoute sur 443 ou mauvaise origin | Ouvrir 443, vérifier Nginx et Cloudflare (origin + SSL) |
| reboulstore-nginx sans ports | Container créé sans mapping 80/443   | Recréer le container avec `ports: 80:80, 443:443` (et libérer 80/443 sur l’hôte si besoin) |
| Nginx host occupe 80  | systemd nginx écoute 80, Docker ne peut pas binder | Désactiver Nginx host ou le configurer en reverse proxy vers le Nginx Reboul (ex. 127.0.0.1:8080) |
| Certificats expirés    | Let’s Encrypt non renouvelé             | Renouveler (certbot / script) et recharger Nginx |

---

## 9. Commandes utiles en une fois

```bash
# Vue d’ensemble
./rcli server status --all
./rcli server resources
./rcli server ssl --check
./rcli health check

# Détail ports + test local
./rcli server exec "ss -tlnp | grep -E ':80|:443'; curl -s -o /dev/null -w 'Local HTTP: %{http_code}\n' http://127.0.0.1/ -H 'Host: www.reboulstore.com'"
```

---

*Dernière mise à jour : 2026-02-04 – après diagnostic 521 et vérification des ports.*
