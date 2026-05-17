---
type: securite
node: hardening
maj: 2026-05-11 (soir)
---
# Sécurité — Hardening

Liens : [[Securite/Securite]] · [[Securite/checklist]]

---

## Backend NestJS

- [x] **Helmet** — ✅ 11/05/2026 — `helmet` dans `package.json` + activé dans `main.ts`
- [x] **Rate limiting** — ✅ ThrottlerModule actif (100 req/min global, plus strict sur `/auth`)
- [x] **CORS strict** — ✅ whitelist `reboulstore.com` uniquement
- [x] **`npm audit`** — ✅ 0 critical/high (1 moderate restant : nodemailer, breaking change non corrigeable)
- [ ] **Logs structurés** — tracer auth échouées, erreurs 500 → après lancement

## VPS

- [x] **fail2ban** — ✅ actif, jail `sshd` configuré
- [x] **Clés SSH** — ✅ auth par clé uniquement, mot de passe désactivé
- [x] **Audit permissions** — ✅ `.env.production` 644→600 corrigé 11/05/2026
- [x] **Scan ports** — ✅ Syncthing supprimé, ports propres : 22/80/443/4000/4443
- [x] **apt upgrade** — ✅ 35 packages dont Docker 29.4.3 — 11/05/2026
- [ ] **Logs SSH centralisés** — surveiller connexions anormales → après lancement

## Frontend / nginx

- [x] **CSP** — ✅ configuré dans nginx `www.reboulstore.com` 11/05/2026
- [x] **HSTS** — ✅ `max-age=63072000; includeSubDomains; preload` dans nginx
- [x] **Bundle Vite** — ✅ aucun secret dans `VITE_*` (uniquement `VITE_API_URL`)

## Monitoring

- [x] **UptimeRobot** — ✅ 2 moniteurs actifs 11/05/2026 (`www.reboulstore.com` + `/api/health`)
- [x] **`rcli server maintenance`** — ✅ commande toggle on/off ajoutée 11/05/2026
- [ ] **Alertes erreurs 500** — logs structurés NestJS → après lancement

## Restant avant lancement

| Item | Bloquant | Responsable |
|------|----------|-------------|
| Logs structurés erreurs 500 | Non — après lancement | Dev |
| Stripe live | Oui | Julie |
| Pages légales | Oui | Julie |
| Pentest complet (6 phases) | Recommandé | → [[Securite/pentest]] |

Référence infra : [[Architecture/vps]]
