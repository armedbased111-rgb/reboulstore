---
type: securite
node: hardening
maj: 2026-05-11
---
# Sécurité — Hardening

Liens : [[Securite/Securite]] · [[Securite/checklist]]

---

## Backend NestJS

- [ ] **Helmet** — activer les headers HTTP sécurisés (`@nestjs/helmet`)
- [ ] **Rate limiting** — throttler NestJS : 100 req/min routes publiques, plus strict sur `/auth`
- [ ] **CORS strict** — whitelist `reboulstore.com` uniquement (pas `*`)
- [ ] **`npm audit`** — 0 vulnérabilité critique backend + frontend
- [ ] **Logs structurés** — tracer auth échouées, erreurs 500

```bash
# Installer Helmet
npm install @nestjs/helmet
# Dans main.ts :
app.use(helmet());

# Throttler
npm install @nestjs/throttler
```

## VPS

- [ ] **fail2ban** — protection brute force SSH
- [ ] **Rotation clés SSH** — vérifier et renouveler
- [ ] **Audit permissions** `/opt/reboulstore/` — fichiers sensibles non lisibles par tous
- [ ] **Scan ports** — aucun port inattendu ouvert
- [ ] **Logs SSH centralisés** — surveiller les connexions

```bash
# Installer fail2ban
sudo apt install fail2ban

# Audit permissions
find /opt/reboulstore/ -type f -perm /o+r

# Scan ports
nmap -sV 152.228.218.35
```

## Frontend

- [ ] **CSP** (Content Security Policy) — limiter sources scripts/styles
- [ ] **HSTS** — header `Strict-Transport-Security`
- [ ] **Vérifier bundle Vite** — aucun secret dans les variables `VITE_*` exposées

Référence infra : [[Architecture/vps]]
