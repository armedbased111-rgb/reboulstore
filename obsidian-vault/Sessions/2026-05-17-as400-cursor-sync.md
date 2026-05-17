---
type: session
date: 2026-05-17
sujet: AS400 SFTP planning + Cursor Pro mise à jour
statut: terminé
---
# Session 17/05/2026 — AS400 + Cursor Pro init

## Ce qui a été fait

### AS400 — Décisions réunion 12/05
- Décision : SFTP bidirectionnel sur notre VPS (port 22, chroot jail)
- AS400 → nous : CSV stocks toutes les heures → `entrant/`
- Nous → AS400 : CSV mouvements toutes les heures → `sortant/`
- Phase 1 : setup SFTP basique, transmettre accès à l'expert cyber
- Phase 2 : adapter NestJS au format réel après réception du premier CSV
- Documentation complète → [[Securite/as400]]

### Sécurité — Éléments complétés (session 11/05 → 12/05)
- UptimeRobot configuré (2 moniteurs : frontend + /api/health)
- `./rcli server maintenance [on|off|status]` — nouvelle commande créée
- HSTS + CSP headers configurés dans nginx frontend
- Route pentest complète rédigée (6 phases) → [[Securite/pentest]]
- Vault sync intégral fait

### Cursor Pro — Mise à jour contexte
- Cursor Pro activé par l'utilisateur
- Toutes les commandes `.cursor/commands/*.md` alignées avec le vault
- `project-rules.mdc` mis à jour : paths VPS, SSH key, containers, collections, AS400
- Commande `/init-cursor` créée → `.cursor/commands/init-cursor.md`
- Prompt d'amorçage Cursor rédigé

## Prochaines actions

- [ ] AS400 Phase 1 : setup SFTP (attendre go explicite)
- [ ] Frontend : revue pages (Home → Checkout) — phase 25
- [ ] Stripe live : en attente Julie
- [ ] Upload batch images (Stone Island 61, Carhartt 54, Arte, Off-White…)
