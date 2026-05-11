---
type: hub
section: Frontend
---
# Frontend — Hub

React 18 + Vite + TailwindCSS v4. 22 pages, 70+ composants. Mobile-first, inspiré A-COLD-WALL*.

Liens : [[REBOUL]] · [[Backend/Backend]] · [[Architecture/Architecture]]

---

## Pages — statut Phase 25

### Commerce

| Page | Route | Fichier | Statut |
|------|-------|---------|--------|
| [[Frontend/Home]] | `/` | Home.tsx | 🟡 à revoir |
| [[Frontend/Catalog]] | `/catalog` | Catalog.tsx | 🟡 à revoir |
| [[Frontend/Product]] | `/product/:id` | Product.tsx | 🟡 à revoir |
| [[Frontend/Search]] | `/search` | Search.tsx | 🟡 à revoir |
| [[Frontend/Cart]] | `/cart` | Cart.tsx | 🟡 à revoir |
| [[Frontend/Checkout]] | `/checkout` | Checkout.tsx | 🟡 à revoir |
| [[Frontend/OrderConfirmation]] | `/order-confirmation` | OrderConfirmation.tsx | 🟡 à revoir |

### Compte client

| Page | Route | Fichier | Statut |
|------|-------|---------|--------|
| [[Frontend/Login]] | `/login` | Login.tsx | 🟡 à revoir |
| [[Frontend/Register]] | `/register` | Register.tsx | 🟡 à revoir |
| [[Frontend/Profile]] | `/profile` | Profile.tsx | 🟡 à revoir |
| [[Frontend/Orders]] | `/orders` | Orders.tsx | 🟡 à revoir |
| [[Frontend/OrderDetail]] | `/orders/:id` | OrderDetail.tsx | 🟡 à revoir |

### Institutionnel & Légal

| Page | Route | Fichier | Statut |
|------|-------|---------|--------|
| [[Frontend/About]] | `/about` | About.tsx | 🟡 à revoir |
| [[Frontend/Contact]] | `/contact` | Contact.tsx | 🟡 à revoir |
| [[Frontend/Stores]] | `/stores` | Stores.tsx | 🟡 à revoir |
| [[Frontend/ShippingReturns]] | `/shipping-returns` | ShippingReturns.tsx | 🟡 à revoir |
| [[Frontend/Livraison]] | `/livraison` | Livraison.tsx | 🟡 à revoir |
| [[Frontend/Terms]] | `/terms` `/cgv` `/conditions-generales-de-vente` | Terms.tsx | ✅ complet |
| [[Frontend/Privacy]] | `/privacy` `/politique-de-confidentialite` | Privacy.tsx | ✅ complet |
| [[Frontend/MentionsLegales]] | `/mentions-legales` | MentionsLegales.tsx | ✅ complet |
| [[Frontend/Cookies]] | `/cookies` | Cookies.tsx | ✅ complet |

### Erreurs

| Page | Route | Fichier | Statut |
|------|-------|---------|--------|
| [[Frontend/ServerError]] | `/500` | ServerError.tsx | ✅ complet |
| [[Frontend/NotFound]] | `*` | NotFound.tsx | ✅ complet |

---

## Composants & Architecture

→ [[Frontend/composants-cles]] — Layout, Cart, Product, Search, Decoratifs, Consent, Newsletter

## Design & Animations

| Fichier | Contenu |
|---------|---------|
| [[Frontend/design-system]] | Palette, typo, spacing, A-COLD-WALL* |
| [[Frontend/animations]] | AnimeJS, AnimationProvider, presets |

## API — Frontend ↔ Backend

Base URL : `http://localhost:3001` (dev) · `https://reboulstore.com/api` (prod) · Swagger : `/api/docs`
Client HTTP : `frontend/src/services/api.ts` — Axios + intercepteur JWT.

| Groupe | Endpoints |
|--------|-----------|
| Catalogue | `GET /products` · `/products/:id` · `/products/:id/variants` · `/brands` · `/categories` · `/collections` |
| Panier | `GET/POST/PATCH/DELETE /cart` |
| Checkout | `POST /checkout/create-session` · `/checkout/webhook` · `/coupons/validate` |
| Commandes | `GET /orders` · `/orders/:id` |
| Auth | `POST /auth/login` · `/auth/register` · `/auth/refresh` · `GET/PATCH /auth/me` |
| Engagement | `POST /newsletter/subscribe` · `/products/:id/notify-stock` · WS Socket.io |
| Boutiques | `GET /shops` · `/og/product/:id` · `/hero` |

Routes publiques : catalogue, login, register, webhook Stripe, shops.
Routes protégées (JWT) : panier, commandes, profil, admin.

Codes d'erreur : `400` validation · `401` token · `403` accès · `404` introuvable · `409` conflit · `500` serveur

---

## Hooks custom

| Hook | Rôle |
|------|------|
| `useProducts` | Fetch liste produits + pagination |
| `useProduct` | Fetch produit unique |
| `useBrands` | Fetch marques |
| `useCategories` | Fetch catégories |
| `useCart` | État panier (CartContext) |
| `useSearch` | Recherche avec debounce |
| `useSearchHistory` | Historique recherches (localStorage) |
| `useDebounce` | Debounce générique |
| `useLocalStorage` | Persistance locale |
| `useWebSocket` | Connexion Socket.io |
