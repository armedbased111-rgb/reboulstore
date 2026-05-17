---
type: session
date: 2026-05-17
sujet: Vault sync — AS400 phases + Grafana
statut: terminé
---
# Session vault — 17/05/2026

## Changements

### AS400 — Phases clarifiées ([[Securite/as400]])

| Phase | Contenu | Statut |
|-------|---------|--------|
| 1 | SFTP VPS | ✅ |
| 2 | `entrant/` — stocks AS400 → DB | ⏸️ attend 1er CSV expert |
| 3 | `sortant/` — mouvements Reboul → AS400 | 🔜 spec en cours |

- Roadmap et `REBOUL.md` alignés
- Suppression doublon `as400-mouvements-sortant.md` (tout dans `as400.md`)
- Fiche expert = envoi uniquement ([[Securite/as400-fiche-expert]])

### Grafana

- Nœud [[Architecture/grafana]] : bloc **Référence rapide** (tunnel, mdp, events trackés)

## Suite

- Compléter spec Phase 3 (décisions mouvements) dans `as400.md`
- Transmission fiche expert quand prêt
