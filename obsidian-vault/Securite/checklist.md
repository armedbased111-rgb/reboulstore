---
type: securite
node: checklist
maj: 2026-05-11 (soir)
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
- [ ] Backup 12/05/2026 — vérifier ce soir : `./rcli server exec "tail -5 /var/log/reboulstore-backup.log && ls -lht /var/www/reboulstore/backups/ | head -5"`

## Frontend

- [x] CSP headers configurés — ajouté dans nginx `www.reboulstore.com` ✅ 11/05/2026
- [x] HSTS activé — `max-age=63072000; includeSubDomains; preload` dans nginx ✅ 11/05/2026
- [x] Aucun secret dans les variables `VITE_*` — uniquement `VITE_API_URL` ✅

## Paiement

- [ ] Clés Stripe basculées de test → live — ⏳ en attente Julie
- [ ] Webhook Stripe vérifié en prod — ⏳ en attente Julie
- [ ] Test flux paiement complet (live) — ⏳ en attente Julie

## AS400 / SFTP → [[Securite/as400]]

- [x] SFTP VPS (`entrant/` + `sortant/`) ✅ 17/05
- [x] Export sortant automatisé (module `sync-as400`, cron horaire) ✅ 18/05
- [ ] Fiche expert + identifiants transmis
- [ ] Flux `entrant/` (leur CSV stocks) — après 1er fichier réel
- [ ] Validation expert import `sortant/` (delta + full)
- [ ] Monitoring dédié export AS400 (logs Grafana : `AS400 cron`) — optionnel

## Monitoring & Ops

- [ ] Alertes logs erreurs 500 — après lancement (logs structurés NestJS)
- [x] Alertes down containers — ✅ UptimeRobot configuré (11/05/2026) — 2 moniteurs actifs : `https://www.reboulstore.com` + `/api/health` — alertes email `armedbased111@gmail.com`
- [x] Backup DB testé (restore vérifié) ✅ 11/05/2026 — 21 tables, 296 produits restaurés correctement
- [x] Variables `.env.production` complètes ✅ — DB, JWT, Stripe, Cloudinary, SMTP présents. REDIS/NODE_ENV ont des défauts sûrs.
