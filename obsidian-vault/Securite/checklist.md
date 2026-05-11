---
type: securite
node: checklist
maj: 2026-05-11
---
# Sécurité — Checklist pré-lancement

Liens : [[Securite/Securite]] · [[Securite/hardening]] · [[Securite/pentest]]

---

## Backend

- [x] Helmet activé (`helmet` dans `main.ts`) — ✅ 11/05/2026
- [x] Rate limiting actif (ThrottlerModule + ThrottlerGuard) — ✅ déjà configuré
- [x] CORS origin strict (`reboulstore.com` uniquement) — ✅ whitelist en place
- [x] `npm audit` — 0 critical/high en backend (1 moderate restant : nodemailer, breaking change)
- [x] `npm audit` — 0 critical/high en frontend (1 moderate restant : next/postcss, breaking change)
- [ ] Logs structurés — auth échouées + erreurs 500 tracées

## VPS

- [ ] fail2ban actif
- [ ] Clés SSH à jour
- [ ] Permissions `/opt/reboulstore/` auditées
- [ ] `nmap` — aucun port inattendu ouvert
- [ ] Backup automatique quotidien vérifié et testé
- [ ] SSL Let's Encrypt valide + auto-renouvellement actif

## Frontend

- [ ] CSP headers configurés
- [ ] HSTS activé
- [ ] Aucun secret dans les variables `VITE_*` du bundle

## Paiement

- [ ] Clés Stripe basculées de test → live
- [ ] Webhook Stripe vérifié en prod
- [ ] Test flux paiement complet (live)

## AS400 (si intégré avant lancement)

- [ ] Architecture réseau validée avec expert
- [ ] Auth inter-systèmes en place
- [ ] TLS sur tous les flux
- [ ] File d'attente commandes opérationnelle
- [ ] Monitoring flux AS400 ↔ site actif

## Monitoring & Ops

- [ ] Alertes logs erreurs 500 en place
- [ ] Alertes down containers Docker
- [ ] Backup DB testé (restore vérifié)
- [ ] Variables `.env.production` complètes et vérifiées
