---
type: racine
version: 1.1
maj: 2026-05-27
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
| Collections | Hologram ✅ uploadé · Bisous ✅ uploadé (24/25) · Stone Island / Arte / Autry en cours |
| Sécurité | ✅ Helmet, rate limiting, VPS durci, UptimeRobot, pentest route rédigée |
| AS400 / SFTP | **Sortant ✅** · **Fiche expert envoyée à Jacques ✅ 27/05** · Phase 2 `entrant/` en attente réponse Jacques → [[Securite/as400]] |
| Logs / Grafana | ✅ Guide nœud [[Architecture/grafana]] — logs techniques 30 j (pas stocks/AS400 métier) |

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

[[Sessions/archive/2026-05-27-bisous-ispublished-logos]] · [[Sessions/archive/2026-05-27-pipeline-as400-hologram]] · [[Sessions/Sessions]]

---

## Tâches

[[TODO]]
