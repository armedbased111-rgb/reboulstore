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

- [x] fail2ban actif — jail `sshd` configuré ✅ 11/05/2026
- [x] Clés SSH à jour — auth par clé uniquement, mot de passe désactivé ✅
- [x] Permissions `.env.production` corrigées — 644→600 ✅ 11/05/2026
- [x] Ports ouverts vérifiés — 80/443 (Reboul), 4000/4443 (Admin), 8384/53 localhost only ✅ — Syncthing supprimé (port 22000 fermé)
- [x] SSL Let's Encrypt valide 66 jours (exp. 17/07/2026), 3 domaines ✅
- [x] `apt upgrade` — 35 packages mis à jour dont Docker 29.4.3 ✅ 11/05/2026
- [x] Backup automatique quotidien vérifié et testé ✅ 11/05/2026 — script OK, log `/var/log/reboulstore-backup.log` créé avec permissions deploy

## Frontend

- [ ] CSP headers configurés
- [ ] HSTS activé
- [ ] Aucun secret dans les variables `VITE_*` du bundle

## Paiement

- [ ] Clés Stripe basculées de test → live — ⏳ en attente Julie
- [ ] Webhook Stripe vérifié en prod — ⏳ en attente Julie
- [ ] Test flux paiement complet (live) — ⏳ en attente Julie

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
