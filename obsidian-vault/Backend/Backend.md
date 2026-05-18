---
type: hub
section: Backend
---
# Backend — Hub

NestJS + TypeORM + PostgreSQL (VPS). 18 modules documentés.

Liens : [[REBOUL]] · [[Architecture/Architecture]]

---

## Catalogue

| Module | Endpoints clés | Statut |
|--------|----------------|--------|
| [[Backend/products]] | GET /products, /products/:id, variants, images | ✅ complet |
| [[Backend/categories]] | GET /categories, CRUD admin | ✅ complet |
| [[Backend/brands]] | GET /brands, CRUD admin | ✅ complet |
| [[Backend/collections-module]] | GET /collections | ✅ complet |
| [[Backend/hero]] | GET /hero (slides JSON) | ✅ complet |

## Panier & Paiement

| Module | Endpoints clés | Statut |
|--------|----------------|--------|
| [[Backend/cart]] | GET/POST/PATCH/DELETE /cart | ✅ complet |
| [[Backend/checkout]] | POST /checkout/create-session, /webhook | ✅ complet |
| [[Backend/coupons]] | POST /coupons/validate, CRUD admin | ✅ complet |
| [[Backend/orders]] | GET /orders, /orders/:id | ✅ complet |

## Auth & Utilisateurs

| Module | Endpoints clés | Statut |
|--------|----------------|--------|
| [[Backend/auth]] | POST /auth/login, /register, /refresh, GET /auth/me | ✅ complet |

## Engagement & Notifications

| Module | Endpoints clés | Statut |
|--------|----------------|--------|
| [[Backend/newsletter]] | POST /newsletter/subscribe | ✅ complet |
| [[Backend/stock-notifications]] | POST /products/:id/notify-stock | ✅ complet |
| [[Backend/notifications]] | WebSocket Gateway (Socket.io) | ✅ complet |
| [[Backend/sms]] | Service Twilio interne (pas d'endpoint public) | ✅ complet |

## Boutiques & SEO

| Module | Endpoints clés | Statut |
|--------|----------------|--------|
| [[Backend/shops]] | GET /shops, CRUD admin | ✅ complet |
| [[Backend/og]] | GET /og/product/:id (OpenGraph HTML) | ✅ complet |

## Médias & Optimisation

| Module | Rôle | Statut |
|--------|------|--------|
| [[Backend/cloudinary]] | Upload + gestion images CDN | ✅ complet |
| [[Backend/images-optimization]] | Resize + optimisation à la volée | ✅ complet |

## Intégrations

| Module | Rôle | Statut |
|--------|------|--------|
| `sync-as400` | Export CSV delta → SFTP `sortant/` | ✅ B2–B3 · cron B4 ⏳ — [[Securite/as400]] |
