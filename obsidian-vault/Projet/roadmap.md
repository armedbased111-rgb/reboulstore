---
type: roadmap
statut: en-cours
maj: 2026-05-11
---
# Roadmap — Reboul Store SS26

Liens : [[Projet/Projet]] · [[Collections/Collections]]

---

## Images & Collections

Tout ce qui est pipeline IA, tri, upload Cloudinary.

- [ ] **Hologram** — importer le CSV via Admin Centrale (8 refs)
- [ ] **Hologram** — lancer pipeline flat lay
- [ ] **Birkenstock** — lancer `generate-batch --product-type shoe` (34 refs)
- [ ] **Autry** — générer pipeline shoe sur les 4 nouvelles refs (SCLM/CQ02, CU01, CU03, SVLM/PJ02)
- [ ] **Autry** — générer 4_top manquants via Gemini ADJUST (10 refs : HIPX-032K · JAPM-026B · PAPM-027B · PAPX-019K · SHPM-079Y · SWPX-036W · TSPM-044W · TSPX-047W · TSPX-053W · TSPX-053Y)
- [ ] **Bisous** — décider du sort des 9 refs vides (SS26-30, SS26-74→81) : shooter ou supprimer
- [ ] **Bisous** — régénérer back pour SS26-91 et SS26-94
- [ ] **RRD** — démarrer : feuille stock → CSV → photos → pipeline
- [ ] Trier + vérifier qualité toutes collections avant upload
- [ ] **Upload batch** — Stone Island (61 refs)
- [ ] **Upload batch** — Carhartt (54 refs)
- [ ] **Upload batch** — Autry (quand complet)
- [ ] **Upload batch** — Arte Antwerp (10 refs)
- [ ] **Upload batch** — Off-White (7 refs)
- [ ] **Upload batch** — Saucony (7 refs)
- [ ] **Upload batch** — Asics (15 refs)
- [ ] **Upload batch** — Salomon (13 refs)
- [ ] **Upload batch** — Hologram (après génération)
- [ ] **Upload batch** — Birkenstock (après génération)

---

## Frontend & UX

Revue pages, corrections UI, responsive, copywriting.

- [ ] [[Frontend/Home]] + popup newsletter — revue desktop + mobile
- [ ] [[Frontend/Catalog]] — revue desktop + mobile
- [ ] [[Frontend/Product]] — revue desktop + mobile
- [ ] [[Frontend/Cart]] — revue desktop + mobile
- [ ] [[Frontend/Checkout]] — revue desktop + mobile
- [ ] [[Frontend/Search]] — revue desktop + mobile
- [ ] [[Frontend/Login]] / [[Frontend/Register]] — revue
- [ ] [[Frontend/Profile]] / [[Frontend/Orders]] / [[Frontend/OrderDetail]] / [[Frontend/OrderConfirmation]] — revue
- [ ] [[Frontend/About]] / [[Frontend/Contact]] / [[Frontend/Stores]] / [[Frontend/ShippingReturns]] — revue
- [ ] Harmonisation spacing / typo / couleurs globale
- [ ] Relecture copywriting FR — ton, orthographe, cohérence
- [ ] Nettoyage composants dupliqués ou legacy

---

## SEO & Métadonnées

- [ ] `react-helmet-async` sur toutes les pages principales
- [ ] Titles + meta descriptions propres (FR) par page
- [ ] Open Graph minimal (title, description, image) — s'appuie sur [[Backend/og]]
- [ ] Favicon + cohérence branding
- [ ] Vérification sitemap.xml + robots.txt

---

## Technique & Sécurité

Détail complet → [[Securite/Securite]]

### Hardening
- [ ] Helmet — headers HTTP sécurisés (NestJS)
- [ ] Rate limiting — throttler NestJS (100 req/min par IP)
- [ ] CORS strict — whitelist `reboulstore.com` uniquement
- [ ] fail2ban — brute force SSH sur VPS
- [ ] Audit permissions `/opt/reboulstore/`
- [ ] `nmap` — vérifier ports ouverts VPS
- [ ] `npm audit` — 0 critical (backend + frontend)
- [ ] CSP + HSTS headers frontend
- [ ] Logs structurés — auth échouées, erreurs 500

### AS400 — Connexion ERP ↔ Site
- [ ] Réunion expert cyber AS400 — **12/05/2026** → [[Architecture/securite#AS400]]
- [ ] Définir architecture réseau (VPN / IP whitelist / middleware)
- [ ] Définir protocole (REST, SFTP batch, bus message)
- [ ] Implémenter flux stock AS400 → site
- [ ] Implémenter flux commandes site → AS400
- [ ] File d'attente Redis pour résilience AS400 down
- [ ] Audit & monitoring des flux inter-systèmes

### Tests
- [ ] Tests unitaires frontend — composants critiques, hooks, panier/checkout (Vitest)
- [ ] Tests non-régression API — endpoints critiques
- [ ] Checklist pré-lancement : domaine, SSL, monitoring, backup auto, variables prod

---

## Lancement

- [ ] Basculer clés Stripe test → live — ⏳ en attente Julie
- [ ] Valider webhooks Stripe en prod — ⏳ en attente Julie
- [ ] Test flux paiement complet mode live (PaymentIntent → success → commande créée) — ⏳ en attente Julie
- [ ] Smoke tests prod : catalog → produit → panier → checkout → confirmation
- [ ] Smoke tests auth : login / register / profile
- [ ] Smoke tests pages légales / contact — ⏳ en attente Julie
- [ ] Monitoring en place (logs, alertes)
- [ ] Ouverture publique
