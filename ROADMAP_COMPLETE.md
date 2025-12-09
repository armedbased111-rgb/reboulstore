# 🗺️ Roadmap Complète - Reboul Store

**Version** : 2.0  
**Date** : 9 décembre 2025  
**Approche** : Backend ↔ Frontend alternés, fonctionnalités complètes

---

## 🎯 Principes de cette roadmap

1. **Alternance Backend ↔ Frontend** : Chaque phase alterne entre backend et frontend
2. **Fonctionnalités complètes** : Chaque phase livre une fonctionnalité utilisable de bout en bout
3. **Incrémental** : On peut tester à chaque étape
4. **MVP First** : Les fonctionnalités essentielles d'abord, les optimisations ensuite

---

## ✅ Phase 1-8 : Infrastructure & Catalogue (COMPLÉTÉ)

**Résumé** :
- ✅ Docker + PostgreSQL + NestJS + React configurés
- ✅ Entités de base (Category, Product, Image, Variant, Cart, Order, Shop, Brand)
- ✅ Modules API (Categories, Products, Cart, Orders, Shops, Brands)
- ✅ Frontend : Layout, Header, Footer, Navigation
- ✅ Pages : Home (partiel), Catalog (filtres category + brand), Product
- ✅ Composants produits (ProductCard, ProductGallery, ProductInfo, etc.)
- ✅ Logique multi-shops (Shop entity + politiques)
- ✅ **Navigation Brands** (onglet + mega menu avec hover, filtres produits)
- ✅ **Support vidéo/image** (Brand et Category avec priorité vidéo dans hero sections)

**État actuel** : Catalogue fonctionnel avec filtres brands, pages produits OK, politiques de base OK, support vidéo/image complet

---

## ✅ Phase 8.5 : Feature Brands (COMPLÉTÉ)

**Objectif** : Ajouter navigation par marques avec mega menu style A-COLD-WALL*

### 8.5.1 Backend - Entité Brand ✅
- [x] Créer entité Brand (id, name, slug, description, logoUrl, megaMenuImage1, megaMenuImage2)
- [x] Relation Brand → Products (OneToMany)
- [x] Relation Product → Brand (ManyToOne, brandId)

### 8.5.2 Backend - Module Brands ✅
- [x] Créer module Brands
- [x] DTOs (CreateBrandDto, UpdateBrandDto)
- [x] Service Brands (findAll, findOne, findBySlug, create, update, delete)
- [x] Controller Brands (CRUD complet)
- [x] Enregistrer dans AppModule

### 8.5.3 Backend - Extension Products ✅
- [x] Ajouter brandId dans Product entity
- [x] Charger relation brand dans ProductsService
- [x] Ajouter brandId dans CreateProductDto
- [x] Ajouter filtre brand dans ProductQueryDto
- [x] Implémenter filtre par brand dans findAll()

### 8.5.4 Frontend - Types & Services ✅
- [x] Créer interface Brand dans types/index.ts
- [x] Étendre Product avec brand et brandId
- [x] Créer service brands.ts (getBrands, getBrand, getBrandBySlug)
- [x] Créer hook useBrands
- [x] Ajouter brand dans ProductQuery

### 8.5.5 Frontend - Header Navigation ✅
- [x] Import useBrands dans Header
- [x] Ajouter état isBrandsMenuOpen et hoveredBrand
- [x] Créer onglet "Brands" après "Catalogue"
- [x] Créer mega menu Brands (liste marques + 2 images)
- [x] Implémenter hover pour changer images (transition 300ms)
- [x] Gestion fermeture menus (mutually exclusive)

### 8.5.6 Frontend - Page Catalog ✅
- [x] Import getBrandBySlug
- [x] Ajouter état brand, brandLoading, brandError
- [x] Récupérer brand depuis URL (?brand=slug)
- [x] Passer brand.id au hook useProducts
- [x] Afficher titre avec nom de marque
- [x] Afficher HeroSectionImage avec image de marque

### 8.5.7 Tests ✅
- [x] Créer 4 marques de test (A-COLD-WALL*, NIKE, ADIDAS, STONE ISLAND)
- [x] Lier produit à marque
- [x] Tester endpoint GET /brands
- [x] Tester filtre GET /products?brand=:brandId
- [x] Tester navigation et mega menu dans navigateur
- [x] Tester hover images dans mega menu

### 8.5.8 Améliorations Vidéo/Image ✅
- [x] Ajouter support vidéo dans entité Brand (megaMenuVideo1, megaMenuVideo2)
- [x] Ajouter support vidéo dans entité Category (videoUrl)
- [x] Mettre à jour DTOs (CreateBrandDto, CreateCategoryDto)
- [x] Mettre à jour types frontend (Brand, Category)
- [x] Améliorer HeroSectionImage pour supporter vidéo OU image (priorité vidéo)
- [x] Implémenter logique vidéo/image dans Header mega menu (priorité vidéo)
- [x] Implémenter logique vidéo/image dans Catalog hero section (priorité vidéo)
- [x] Corriger bug routing brands (ordre routes : slug avant :id)
- [x] Corriger filtrage produits par brand (ajouter brand dans useMemo de useProducts)
- [x] Tester affichage vidéo dans hero section et mega menu

---

## 🔄 Phase 9 : Backend - Authentification & Utilisateurs

**Objectif** : Permettre aux utilisateurs de créer un compte, se connecter, et gérer leur profil

### 9.1 Entité User
- [ ] Créer entité User (id, email, password hash, firstName, lastName, phone, role, isVerified, timestamps)
- [ ] Enum UserRole (CLIENT, ADMIN, SUPER_ADMIN)
- [ ] Créer entité Address (id, userId, street, city, postalCode, country, isDefault)
- [ ] Relations User → Addresses (OneToMany)
- [ ] Relations User → Orders (OneToMany)

### 9.2 Module Auth - JWT
- [ ] Installer @nestjs/jwt, @nestjs/passport, bcrypt
- [ ] Créer module Auth
- [ ] Service Auth : register(), login(), validateUser(), hashPassword()
- [ ] Guard JwtAuthGuard pour protéger routes
- [ ] DTOs : RegisterDto, LoginDto
- [ ] Endpoints :
  - POST /auth/register (créer compte)
  - POST /auth/login (connexion, retourne JWT)
  - GET /auth/me (profil utilisateur, protégé)
  - POST /auth/refresh (refresh token)

### 9.3 Module Auth - OAuth (Google, Apple)
- [ ] Installer @nestjs/passport-google-oauth20
- [ ] Configurer stratégie Google OAuth
- [ ] Endpoint GET /auth/google (redirect OAuth)
- [ ] Endpoint GET /auth/google/callback (retour OAuth)
- [ ] Installer passport-apple (ou équivalent)
- [ ] Configurer stratégie Apple OAuth
- [ ] Endpoint GET /auth/apple
- [ ] Endpoint GET /auth/apple/callback
- [ ] Créer ou lier compte User après OAuth

### 9.4 Module Users
- [ ] Créer module Users
- [ ] Service Users : findAll(), findOne(), findByEmail(), update(), delete()
- [ ] Controller Users avec endpoints :
  - GET /users/me (profil)
  - PATCH /users/me (modifier profil)
  - GET /users/me/addresses (liste adresses)
  - POST /users/me/addresses (ajouter adresse)
  - PATCH /users/me/addresses/:id (modifier adresse)
  - DELETE /users/me/addresses/:id (supprimer adresse)
- [ ] Guard RolesGuard pour admin

### 9.5 Sécurité
- [ ] Implémenter rate limiting (express-rate-limit)
- [ ] Validation email unique lors register
- [ ] Vérification email (envoi code vérification)
- [ ] Réinitialisation mot de passe (forgot password)

---

## 🎨 Phase 10 : Frontend - Authentification UI

**Objectif** : Pages de connexion, inscription, profil utilisateur

### 10.1 Context & Hooks Auth
- [ ] Créer AuthContext (contexte global utilisateur)
- [ ] Hook useAuth() (login, logout, register, user)
- [ ] Service auth.ts (loginUser, registerUser, getMe, refreshToken)
- [ ] Stockage JWT (localStorage ou cookie sécurisé)
- [ ] Auto-refresh token avant expiration

### 10.2 Pages Auth
- [ ] Page /login (formulaire connexion)
- [ ] Page /register (formulaire inscription)
- [ ] Page /forgot-password (demande reset)
- [ ] Page /reset-password/:token (nouveau mot de passe)
- [ ] Boutons OAuth Google/Apple
- [ ] Redirection après login (vers page précédente ou /)

### 10.3 Page Profil
- [ ] Page /profile (affichage infos utilisateur)
- [ ] Section "Mes informations" (nom, email, téléphone)
- [ ] Section "Mes adresses" (liste, ajout, modification, suppression)
- [ ] Section "Changer mot de passe"
- [ ] Bouton déconnexion

### 10.4 Protection de routes
- [ ] HOC ProtectedRoute (redirect /login si non connecté)
- [ ] Protéger /profile, /orders, /checkout
- [ ] Affichage conditionnel Header (bouton Login vs Profil)

---

## 🔄 Phase 11 : Backend - Gestion Commandes Complète

**Objectif** : Gérer le cycle de vie complet d'une commande

### 11.1 Extension entité Order
- [ ] Ajouter userId (relation ManyToOne User)
- [ ] Ajouter shippingAddress (jsonb)
- [ ] Ajouter billingAddress (jsonb)
- [ ] Ajouter paymentIntentId (Stripe)
- [ ] Ajouter trackingNumber (suivi colis)
- [ ] Enum OrderStatus enrichi (PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED)
- [ ] Ajouter paidAt, shippedAt, deliveredAt

### 11.2 Module Orders - Extension
- [ ] Service Orders : findByUser(userId), updateStatus(), cancel(), refund()
- [ ] Endpoint GET /orders/me (commandes utilisateur connecté)
- [ ] Endpoint GET /orders/:id (détails commande, protégé)
- [ ] Endpoint PATCH /orders/:id/cancel (annuler commande)
- [ ] Guard : seul propriétaire ou admin peut voir commande

### 11.3 Gestion Stock
- [ ] Service Stock : decrementStock(variantId, quantity), incrementStock()
- [ ] Vérifier stock disponible avant création commande
- [ ] Décrémenter stock après paiement validé
- [ ] Re-incrémenter stock si commande annulée/remboursée
- [ ] Webhook Stripe pour synchroniser stock

### 11.4 Notifications Emails (Nodemailer)
- [ ] Installer @nestjs-modules/mailer, nodemailer
- [ ] Configurer Nodemailer (SMTP Gmail ou SendGrid)
- [ ] Templates emails (HTML) :
  - Confirmation inscription
  - Confirmation commande
  - Commande expédiée (avec tracking)
  - Commande livrée
  - Annulation/remboursement
- [ ] Service Emails : sendOrderConfirmation(), sendShippingNotification()
- [ ] Envoyer email après chaque changement statut commande

---

## 🎨 Phase 12 : Frontend - Panier & Checkout Complet

**Objectif** : Tunnel d'achat complet avec paiement

### 12.1 Page Panier (/cart)
- [ ] Créer page Cart.tsx complète
- [ ] Composant CartItem (image, nom, variant, quantité, prix, supprimer)
- [ ] Composant QuantitySelector (+/- pour changer quantité)
- [ ] Composant CartSummary (sous-total, frais livraison, total)
- [ ] Bouton "Procéder au paiement" (vers /checkout)
- [ ] Gestion panier vide (EmptyCart)
- [ ] Groupement par shop (si multi-shops)
- [ ] Calcul frais de livraison dynamique selon shop

### 12.2 Page Checkout (/checkout)
- [ ] Étape 1 : Vérification panier (récapitulatif articles)
- [ ] Étape 2 : Adresse de livraison (liste adresses ou nouvelle)
- [ ] Étape 3 : Mode de livraison (standard, express si dispo)
- [ ] Étape 4 : Paiement (Stripe Payment Element)
- [ ] Composant StepIndicator (indicateur d'étape)
- [ ] Validation chaque étape avant passage suivante
- [ ] Affichage total final (articles + livraison)

### 12.3 Intégration Stripe (Frontend)
- [ ] Installer @stripe/stripe-js, @stripe/react-stripe-js
- [ ] Créer PaymentForm.tsx (Stripe Elements)
- [ ] Appeler backend pour créer PaymentIntent
- [ ] Confirmer paiement avec Stripe
- [ ] Redirection vers /order-confirmation/:orderId après succès
- [ ] Gestion erreurs paiement

### 12.4 Page Confirmation Commande
- [ ] Page /order-confirmation/:orderId
- [ ] Affichage récapitulatif commande
- [ ] Numéro de commande
- [ ] Statut (payé, en cours de traitement)
- [ ] Adresse de livraison
- [ ] Articles commandés
- [ ] Total payé
- [ ] Bouton "Voir mes commandes"

---

## 🔄 Phase 13 : Backend - Paiement Stripe + Stripe Connect

**Objectif** : Intégration paiement avec répartition multi-shops

### 13.1 Module Stripe - Configuration
- [ ] Installer stripe, @nestjs/stripe (ou wrapper)
- [ ] Configurer clés API Stripe (STRIPE_SECRET_KEY)
- [ ] Créer module Stripe
- [ ] Service Stripe : createPaymentIntent(), confirmPayment(), refund()

### 13.2 Stripe Connect - Multi-shops
- [ ] Ajouter stripeAccountId dans entité Shop
- [ ] Configurer Stripe Connect (comptes connectés par shop)
- [ ] Endpoint POST /shops/:id/connect-stripe (lier compte Stripe)
- [ ] Calculer répartition paiement par shop dans panier
- [ ] Créer PaymentIntent avec application_fee (pour chaque shop)
- [ ] Transfer automatique vers comptes shops

### 13.3 Webhooks Stripe
- [ ] Endpoint POST /stripe/webhook (recevoir events Stripe)
- [ ] Vérifier signature webhook
- [ ] Gérer events :
  - payment_intent.succeeded → Créer commande, décrémenter stock
  - payment_intent.payment_failed → Logger erreur
  - charge.refunded → Marquer commande REFUNDED, incrémenter stock
- [ ] Mettre à jour statut commande selon events

### 13.4 Gestion Remboursements
- [ ] Endpoint POST /orders/:id/refund (admin uniquement)
- [ ] Appeler Stripe API pour créer refund
- [ ] Mettre à jour statut commande
- [ ] Incrémenter stock
- [ ] Envoyer email confirmation remboursement

---

## 🎨 Phase 14 : Frontend - Historique Commandes

**Objectif** : Permettre à l'utilisateur de consulter ses commandes

### 14.1 Page Mes Commandes (/orders)
- [ ] Liste des commandes (OrderCard par commande)
- [ ] Filtres par statut (toutes, en cours, livrées, annulées)
- [ ] Tri (date, montant)
- [ ] Pagination si beaucoup de commandes
- [ ] Clic sur commande → /orders/:id

### 14.2 Page Détail Commande (/orders/:id)
- [ ] Numéro de commande
- [ ] Date et heure
- [ ] Statut avec timeline visuelle
- [ ] Articles commandés (liste avec images)
- [ ] Adresse de livraison
- [ ] Total payé (articles + livraison)
- [ ] Tracking colis (si disponible)
- [ ] Bouton "Annuler commande" (si statut PENDING/PAID)
- [ ] Bouton "Télécharger facture" (PDF)

### 14.3 Composants Commandes
- [ ] Composant OrderCard (résumé commande dans liste)
- [ ] Composant OrderTimeline (visualisation étapes)
- [ ] Composant OrderItem (article dans commande)
- [ ] Composant TrackingInfo (suivi colis)

---

## 🔄 Phase 15 : Backend - Upload Images Cloudinary

**Objectif** : Gérer upload et optimisation images via Cloudinary

### 15.1 Configuration Cloudinary
- [ ] Installer cloudinary, @nestjs/cloudinary (ou wrapper)
- [ ] Configurer clés API (CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET)
- [ ] Créer module Cloudinary
- [ ] Service Cloudinary : uploadImage(), deleteImage(), transformImage()

### 15.2 Integration dans Products
- [ ] Modifier endpoint POST /products/:id/images pour upload Cloudinary
- [ ] Stocker URL Cloudinary dans entité Image
- [ ] Optimisation automatique (compression, format webp)
- [ ] Générer thumbnails (200x200, 400x400, 1200x1200)
- [ ] Supprimer image Cloudinary lors DELETE /images/:id

### 15.3 Upload Multiple
- [ ] Endpoint POST /products/:id/images/bulk (upload jusqu'à 7 images)
- [ ] Vérification format (jpg, png, webp)
- [ ] Vérification taille (max 10MB par image)
- [ ] Ordre automatique (1, 2, 3...)

---

## 🔄 Phase 16 : Backend - Admin & Permissions

**Objectif** : Panel admin pour gérer produits, commandes, utilisateurs

### 16.1 Rôles & Permissions
- [ ] Enum UserRole déjà créé (CLIENT, ADMIN, SUPER_ADMIN)
- [ ] Guard RolesGuard pour vérifier rôle
- [ ] Decorator @Roles('admin', 'super_admin')
- [ ] Appliquer sur routes sensibles (création produit, gestion users, etc.)

### 16.2 Module Admin - Produits
- [ ] Endpoint GET /admin/products (tous produits, pagination)
- [ ] Endpoint POST /admin/products (créer produit complet)
- [ ] Endpoint PATCH /admin/products/:id (modifier)
- [ ] Endpoint DELETE /admin/products/:id (supprimer avec images)
- [ ] Gestion variants en bulk
- [ ] Gestion images en bulk

### 16.3 Module Admin - Commandes
- [ ] Endpoint GET /admin/orders (toutes commandes, filtres)
- [ ] Endpoint PATCH /admin/orders/:id/status (changer statut)
- [ ] Endpoint POST /admin/orders/:id/tracking (ajouter tracking)
- [ ] Endpoint POST /admin/orders/:id/refund (rembourser)
- [ ] Statistiques commandes (CA, nombre, taux conversion)

### 16.4 Module Admin - Utilisateurs
- [ ] Endpoint GET /admin/users (liste users, recherche, filtres)
- [ ] Endpoint PATCH /admin/users/:id/role (changer rôle)
- [ ] Endpoint DELETE /admin/users/:id (supprimer compte)
- [ ] Statistiques users (inscrits, actifs, taux conversion)

### 16.5 Module Admin - Shops
- [ ] Endpoint PATCH /admin/shops/:id (modifier shop, politiques)
- [ ] Endpoint POST /admin/shops (créer nouveau shop)
- [ ] Gestion Stripe Connect par shop (lier/délier compte)

---

## 🎨 Phase 17 : Frontend - Admin Panel (Application séparée)

**Objectif** : Interface admin pour gérer le site

### 17.1 Setup Admin App
- [ ] Créer dossier /admin séparé
- [ ] Setup Vite + React + TypeScript
- [ ] Installer TailwindCSS ou GeistUI (selon préférence)
- [ ] Configurer routing (React Router)
- [ ] Layout admin (sidebar + topbar)

### 17.2 Authentification Admin
- [ ] Page login admin (/admin/login)
- [ ] Vérifier rôle (ADMIN ou SUPER_ADMIN)
- [ ] Context AuthAdmin
- [ ] Guard ProtectedRoute admin

### 17.3 Dashboard
- [ ] Page /admin/dashboard (statistiques globales)
- [ ] Cartes : CA du jour/semaine/mois, nombre commandes, produits actifs, users
- [ ] Graphiques : évolution ventes, top produits
- [ ] Liste dernières commandes

### 17.4 Gestion Produits
- [ ] Page /admin/products (liste produits, recherche, filtres)
- [ ] Page /admin/products/new (formulaire création produit)
- [ ] Page /admin/products/:id/edit (formulaire édition)
- [ ] Upload images (drag & drop)
- [ ] Gestion variants (tableau éditable)
- [ ] Preview produit

### 17.5 Gestion Commandes
- [ ] Page /admin/orders (liste commandes, filtres par statut)
- [ ] Page /admin/orders/:id (détails commande)
- [ ] Changer statut commande (dropdown)
- [ ] Ajouter numéro tracking
- [ ] Bouton rembourser
- [ ] Export CSV

### 17.6 Gestion Utilisateurs
- [ ] Page /admin/users (liste users)
- [ ] Recherche par nom/email
- [ ] Voir détails user (commandes, adresses)
- [ ] Changer rôle
- [ ] Désactiver/supprimer compte

### 17.7 Gestion Shops
- [ ] Page /admin/shops (liste shops)
- [ ] Éditer politiques livraison/retour
- [ ] Lier compte Stripe Connect
- [ ] Statistiques par shop

---

## 🔄 Phase 18 : Backend - Fonctionnalités Avancées

**Objectif** : Ajouter fonctionnalités manquantes

### 18.1 Recherche & Filtres Avancés
- [ ] Endpoint GET /products/search?q=query (recherche fulltext)
- [ ] Filtres avancés (couleur, taille, matière, prix, note)
- [ ] Tri multi-critères
- [ ] Installer pg-search ou TypeORM fulltext search

### 18.2 Wishlist
- [ ] Créer entité Wishlist (userId, productId)
- [ ] Endpoint POST /wishlist (ajouter produit)
- [ ] Endpoint GET /wishlist/me (ma wishlist)
- [ ] Endpoint DELETE /wishlist/:productId (retirer)

### 18.3 Reviews & Ratings
- [ ] Créer entité Review (userId, productId, rating, comment, createdAt)
- [ ] Endpoint POST /products/:id/reviews (laisser avis)
- [ ] Endpoint GET /products/:id/reviews (liste avis)
- [ ] Calcul rating moyen par produit
- [ ] Seul acheteur peut laisser avis (vérifier commande livrée)

### 18.4 Promotions & Codes Promo
- [ ] Créer entité Coupon (code, discountType, discountValue, expiresAt, maxUses)
- [ ] Endpoint POST /orders/apply-coupon (appliquer code promo)
- [ ] Vérifier validité (expiré, déjà utilisé, minimum achat)
- [ ] Calculer réduction dans panier

### 18.5 Notifications Push (WebSockets)
- [ ] Installer @nestjs/websockets, socket.io
- [ ] Gateway WebSocket
- [ ] Event : commande créée (admin notifié)
- [ ] Event : statut commande changé (user notifié)
- [ ] Event : produit en rupture de stock (admin)

### 18.6 SMS (Twilio ou similaire)
- [ ] Installer twilio ou vonage
- [ ] Configurer API keys
- [ ] Service SMS : sendSMS()
- [ ] Envoi SMS : commande expédiée (avec tracking)
- [ ] Envoi SMS : réinitialisation mot de passe

### 18.7 Cache Redis
- [ ] Installer @nestjs/cache-manager, cache-manager-redis-store
- [ ] Configurer Redis (Docker service)
- [ ] Cache produits (TTL 5 min)
- [ ] Cache catégories (TTL 10 min)
- [ ] Invalider cache après modification

---

## 🎨 Phase 19 : Frontend - Fonctionnalités Avancées

**Objectif** : Compléter expérience utilisateur

### 19.1 Recherche & Filtres
- [ ] Barre de recherche Header (autocomplete)
- [ ] Page /search?q=query
- [ ] Sidebar filtres (catégorie, prix, couleur, taille, note)
- [ ] Tri (pertinence, prix, nouveautés, meilleures ventes)
- [ ] Pagination ou infinite scroll

### 19.2 Wishlist
- [ ] Bouton "Ajouter à la wishlist" (coeur) sur ProductCard
- [ ] Page /wishlist (liste produits favoris)
- [ ] Retirer de la wishlist
- [ ] Badge nombre produits dans Header

### 19.3 Reviews & Ratings
- [ ] Section "Avis clients" dans Product.tsx
- [ ] Affichage rating moyen (étoiles)
- [ ] Liste avis (pagination)
- [ ] Formulaire ajouter avis (si achat validé)
- [ ] Trier avis (récents, mieux notés, moins bien notés)

### 19.4 Codes Promo
- [ ] Champ "Code promo" dans CartSummary
- [ ] Appliquer code → afficher réduction
- [ ] Message erreur si code invalide
- [ ] Afficher économies dans récapitulatif

### 19.5 Notifications Temps Réel (WebSockets)
- [ ] Connecter Socket.io client
- [ ] Toast notification : statut commande changé
- [ ] Badge "nouveau message" si admin envoie notif
- [ ] Page /notifications (historique)

### 19.6 Pages Vitrine
- [ ] Page /about (à propos de Reboul Store)
- [ ] Page /contact (formulaire contact + infos boutique physique)
- [ ] Page /stores (localisation boutiques Marseille/Cassis/Sanary)
- [ ] Page /shipping-returns (politiques détaillées)
- [ ] Page /terms (CGV)
- [ ] Page /privacy (mentions légales, RGPD)

### 19.7 Page 404 & Erreurs
- [ ] Page 404 personnalisée (style A-COLD-WALL*)
- [ ] Page 500 (erreur serveur)
- [ ] Composant ErrorBoundary (catch erreurs React)

---

## 🔄 Phase 20 : Automatisation & Intégrations

**Objectif** : Automatiser tâches répétitives

### 20.1 n8n - Workflows
- [ ] Installer n8n (Docker service ou cloud)
- [ ] Workflow : Auto-remboursement si retour validé
- [ ] Workflow : Relance panier abandonné (email après 24h)
- [ ] Workflow : Notification stock bas (email admin)
- [ ] Workflow : Export commandes vers comptabilité (CSV daily)

### 20.2 Cron Jobs (NestJS)
- [ ] Installer @nestjs/schedule
- [ ] Job : Nettoyage paniers expirés (> 7 jours)
- [ ] Job : Archivage commandes anciennes (> 1 an)
- [ ] Job : Génération statistiques mensuelles
- [ ] Job : Sync stock avec ERP (si externe)

### 20.3 Logs & Monitoring
- [ ] Installer @nestjs/logger ou Winston
- [ ] Logger toutes requêtes API (avec temps réponse)
- [ ] Logger erreurs (stack trace)
- [ ] Intégrer Sentry (monitoring erreurs)
- [ ] Dashboard monitoring (Grafana + Prometheus optionnel)

---

## 🎨 Phase 21 : SEO & Performance

**Objectif** : Optimiser référencement et performance

### 21.1 SEO
- [ ] Générer sitemap.xml dynamique (backend)
- [ ] robots.txt
- [ ] Metadata dynamique par page (React Helmet)
- [ ] Open Graph tags (partage réseaux sociaux)
- [ ] Structured data (JSON-LD pour produits)
- [ ] URLs SEO-friendly (slugs partout)

### 21.2 Performance Frontend
- [ ] Lazy loading images (react-lazy-load-image)
- [ ] Code splitting (React.lazy, Suspense)
- [ ] Minification assets (Vite build)
- [ ] Compression (gzip/brotli sur Nginx)
- [ ] Service Worker (PWA optionnel)

### 21.3 Performance Backend
- [ ] Index database (colonnes souvent filtrées)
- [ ] Optimiser requêtes TypeORM (avoid N+1)
- [ ] Pagination obligatoire (max 100 items)
- [ ] Compression responses (NestJS compression)

### 21.4 Accessibilité (A11y)
- [ ] Contraste couleurs WCAG AA
- [ ] Navigation clavier (tab order)
- [ ] ARIA labels sur composants
- [ ] Alt text images
- [ ] Test avec screen reader

---

## 🚀 Phase 22 : Tests & Qualité

**Objectif** : Assurer qualité et stabilité

### 22.1 Tests Backend
- [ ] Setup Jest (déjà installé avec NestJS)
- [ ] Tests unitaires services (Auth, Products, Orders)
- [ ] Tests intégration (endpoints API)
- [ ] Tests E2E (flow complet : register → login → add cart → checkout)
- [ ] Coverage minimum 70%

### 22.2 Tests Frontend
- [ ] Setup Vitest + React Testing Library
- [ ] Tests composants (ProductCard, CartItem, etc.)
- [ ] Tests hooks (useAuth, useCart, useProduct)
- [ ] Tests pages (snapshot tests)
- [ ] Tests E2E (Playwright ou Cypress)

### 22.3 CI/CD
- [ ] GitHub Actions (ou GitLab CI)
- [ ] Pipeline : lint → test → build → deploy
- [ ] Auto-deploy sur push main (staging)
- [ ] Manual deploy prod (avec tag Git)

---

## 🌍 Phase 23 : Déploiement & Production

**Objectif** : Mettre en production

### 23.1 Infrastructure
- [ ] Choisir hébergeur (AWS, DigitalOcean, Heroku, Vercel+Railway)
- [ ] Setup serveur (Nginx reverse proxy)
- [ ] Certificat SSL (Let's Encrypt)
- [ ] Domain DNS (reboulstore.fr)

### 23.2 Backend Prod
- [ ] Variables d'environnement sécurisées
- [ ] Database backups automatiques (daily)
- [ ] Migrations TypeORM (vs synchronize)
- [ ] PM2 ou Docker Swarm (restart auto)
- [ ] Logs centralisés

### 23.3 Frontend Prod
- [ ] Build optimisé (Vite build)
- [ ] CDN pour assets (Cloudflare ou CloudFront)
- [ ] Cache navigateur (headers)
- [ ] Monitoring (Google Analytics, Hotjar)

### 23.4 Sécurité Prod
- [ ] Firewall (Cloudflare, AWS WAF)
- [ ] Rate limiting strict
- [ ] HTTPS obligatoire
- [ ] Headers sécurité (Helmet.js)
- [ ] Audit dépendances (npm audit, Snyk)

---

## 🎯 Phase 24 : Post-Lancement

**Objectif** : Amélioration continue

### 24.1 Analytics & KPIs
- [ ] Dashboard analytics (Google Analytics 4)
- [ ] Tracking conversions (objectifs)
- [ ] Heatmaps (Hotjar)
- [ ] A/B testing (boutons CTA, checkout flow)

### 24.2 Marketing
- [ ] Newsletter (Mailchimp ou Sendinblue)
- [ ] Intégration réseaux sociaux (Instagram, Facebook)
- [ ] Pixels tracking (Meta, Google Ads)
- [ ] Programme fidélité (points, réductions)

### 24.3 Support Client
- [ ] Chat live (Crisp, Intercom, ou custom)
- [ ] FAQ dynamique
- [ ] Tickets support (système de ticketing)
- [ ] Bot FAQ automatique

### 24.4 Évolutions Futures
- [ ] Application mobile (React Native)
- [ ] Mode sombre (dark theme)
- [ ] Multi-langue (i18n)
- [ ] Multi-devise (EUR, USD, GBP)
- [ ] Programme affiliation
- [ ] Vente en magasin (POS intégré)

---

## 📊 Récapitulatif par Priorité

### 🔴 Priorité 1 (MVP) - Phases 9-14
- Backend : Auth + Users + Commandes complètes
- Frontend : Auth UI + Panier + Checkout + Historique
- **Résultat** : Site e-commerce fonctionnel de bout en bout

### 🟡 Priorité 2 (Essentiel) - Phases 15-17
- Backend : Cloudinary + Admin + Stripe Connect
- Frontend : Admin Panel
- **Résultat** : Gestion complète du site, paiements multi-shops

### 🟢 Priorité 3 (Nice to have) - Phases 18-19
- Backend : Recherche avancée, Wishlist, Reviews, Promos, WebSockets, SMS, Redis
- Frontend : Recherche UI, Wishlist, Reviews, Promos, Notifications, Pages vitrine
- **Résultat** : Expérience utilisateur premium

### 🔵 Priorité 4 (Optimisation) - Phases 20-24
- Automatisation, Tests, SEO, Performance, Déploiement, Post-lancement
- **Résultat** : Site professionnel, stable, performant, scalable

---

**Total estimé** : ~6-9 mois de développement (selon rythme et équipe)

**Prochaine phase recommandée** : **Phase 9 - Backend Auth & Users** 🚀
