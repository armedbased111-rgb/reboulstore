---
type: architecture
---
# Stack technique

Liens : [[Architecture/Architecture]]

---

## Frontend

| Couche | Tech | Notes |
|--------|------|-------|
| Framework | React 18 (TypeScript) | |
| Build | Vite | |
| Styling | TailwindCSS v4 | |
| Composants | shadcn/ui + custom | shadcn dans `components/ui/shadcn/` |
| Animations | AnimeJS | via AnimationProvider |
| Routing | React Router v6 | |
| HTTP | Axios | |
| Forms | React Hook Form | |
| Typographie | Geist | toutes variantes |
| Design | Mobile-first | inspiré A-COLD-WALL* |

## Backend

| Couche | Tech | Notes |
|--------|------|-------|
| Framework | NestJS | |
| ORM | TypeORM | |
| DB | PostgreSQL | VPS uniquement — jamais Docker local |
| Cache | Redis | |
| Paiement | Stripe | clés test → live en Phase 27 |
| CDN Images | Cloudinary | |
| Email | SMTP + Handlebars | templates transactionnels |
| SMS | Twilio | reset password, notifications |
| WebSockets | Socket.io | notifications temps réel |

## Ports dev

| Service | Port |
|---------|------|
| Frontend | 3000 |
| Backend | 3001 |
| Redis | 6379 |
| DB tunnel SSH | 5433 (VPS via SSH) |

## Admin Centrale

Stack identique (React + NestJS). Mutualisée pour Reboul, CP Company, Outlet.
Fonctions : import CSV, gestion produits, images, collections, marques, commandes.
