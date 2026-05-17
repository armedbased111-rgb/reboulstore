---
type: racine
version: 1.1
maj: 2026-05-17
---
# REBOUL STORE — Intelligence centrale

Point d'entrée du vault. Lire ce fichier en premier.

---

## Le projet

**Reboul Store** — E-commerce multi-sites (Reboul, CP Company, Outlet).
Boutique physique à Marseille / Cassis / Sanary. Site web en finalisation avant lancement.

Stack : React (Vite) + NestJS + PostgreSQL (VPS) + Cloudinary + Stripe.
Design : mobile-first, inspiré A-COLD-WALL* — minimaliste, premium streetwear.
Admin Centrale mutualisée pour tous les sites.

---

## État actuel

| Bloc | Statut |
|------|--------|
| Backend NestJS | Stable et complet — 18 modules |
| Admin Centrale | Fonctionnelle — import, gestion quotidienne |
| Infrastructure prod | ✅ Stable — deploy OK, monitoring UptimeRobot actif (11/05/2026) |
| Frontend | Finalisation page par page en cours |
| Collections | Pipeline data OK — images en cours par marque |
| Sécurité | ✅ Helmet, rate limiting, VPS durci, UptimeRobot, pentest route rédigée |
| AS400 / SFTP | P1 ✅ · P2 ⏸️ · P3a ✅ · P3b B1 test ✅ — **pause** (B2 code) → [[Securite/as400]] |
| Logs / Grafana | ✅ Winston + Loki/Grafana + alertes · guide [[Architecture/grafana]] · [[Sessions/2026-05-17-logs-winston]] |

Roadmap : **[[Projet/roadmap]]** · Sécurité : **[[Securite/Securite]]**

---

## Phases

- [[Projet/roadmap]] — Roadmap thématique (Images, Frontend, SEO, Sécurité, Lancement)
- [[Projet/regles-critiques]] — Règles non-négociables du projet

---

## Frontend — pages

→ [[Frontend/Frontend]] *(hub — toutes les pages + statuts)*

---

## Backend — modules

→ [[Backend/Backend]] *(hub — tous les modules + statuts)*

---

## Collections actives

→ [[Collections/Collections]] *(hub — toutes les marques + état data/images)*

---

## Architecture

→ [[Architecture/Architecture]] *(hub — stack, VPS, API, services tiers, pipeline images, sécurité)*

---

## Database

→ [[Database/Database]] *(hub — entités, schéma, backup, connexion VPS)*

---

## Projet

→ [[Projet/Projet]] *(hub — phases, règles critiques)*

---

## Dernière session

[[Sessions/2026-05-17-as400-phase1-setup]] · [[Sessions/2026-05-17-vault-sync]]

---

## Tâches

[[TODO]]
