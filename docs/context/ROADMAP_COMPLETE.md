# 🗺️ Roadmap Complète - Reboul Store Platform

**Version** : 4.1  
**Date** : 17 décembre 2025  
**Dernière mise à jour** : 29/12/2025 (Phase 17.11.3 Scripts Déploiement - Correction build production: utilisation /api au lieu de localhost:3001)
**Approche** : Backend ↔ Frontend alternés, fonctionnalités complètes, Workflow Figma intégré

---

## 🎯 OBJECTIF FÉVRIER 2025

**🚀 Site REBOUL (catégorie enfants) prêt à la vente + Admin Centrale connectée**

### Focus absolu :
1. ✅ Finir **Reboul** (site e-commerce complet)
2. ✅ Créer **Admin Centrale** (connectée à Reboul)
3. 🔜 **CP Company** et **Outlet** après lancement Reboul

---

## 🎯 Principes de cette roadmap

1. **Alternance Backend ↔ Frontend** : Chaque phase alterne entre backend et frontend
2. **Fonctionnalités complètes** : Chaque phase livre une fonctionnalité utilisable de bout en bout
3. **Incrémental** : On peut tester à chaque étape
4. **MVP First** : Les fonctionnalités essentielles d'abord, les optimisations ensuite
5. **Multi-sites** : Architecture 3 projets Docker séparés + 1 Admin Centralisée
6. **🎨 Workflow Figma** : Design d'abord dans Figma, puis implémentation code (voir [FIGMA_WORKFLOW.md](../export/FIGMA_WORKFLOW.md))
7. **🏗️ Architecture** : Voir [`ARCHITECTURE_ADMIN_CENTRAL.md`](../architecture/ARCHITECTURE_ADMIN_CENTRAL.md) pour détails complets
7. **🏗️ Architecture** : Voir [`ARCHITECTURE_ADMIN_CENTRAL.md`](../architecture/ARCHITECTURE_ADMIN_CENTRAL.md) pour détails complets

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

**Note** : Page Home et données réelles de la collection seront ajoutées progressivement au fil du développement

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

## ✅ Phase 9 : Backend - Authentification & Utilisateurs (COMPLÉTÉ)

**Objectif** : Permettre aux utilisateurs de créer un compte, se connecter, et gérer leur profil

### 9.1 Entité User ✅
- [x] Créer entité User (id, email, password hash, firstName, lastName, phone, role, isVerified, timestamps)
- [x] Enum UserRole (CLIENT, ADMIN, SUPER_ADMIN)
- [x] Créer entité Address (id, userId, street, city, postalCode, country, isDefault)
- [x] Relations User → Addresses (OneToMany)
- [x] Relations User → Orders (OneToMany)

### 9.2 Module Auth - JWT ✅
- [x] Installer @nestjs/jwt, @nestjs/passport, bcrypt
- [x] Créer module Auth
- [x] Service Auth : register(), login(), validateUser(), hashPassword()
- [x] Guard JwtAuthGuard pour protéger routes
- [x] DTOs : RegisterDto, LoginDto
- [x] Endpoints :
  - POST /auth/register (créer compte)
  - POST /auth/login (connexion, retourne JWT)
  - GET /auth/me (profil utilisateur, protégé)
- [x] Stratégie JWT (JwtStrategy)
- [x] Tests Insomnia : Register, Login, Get Me

### 9.3 Module Auth - OAuth (Google, Apple) - FUTUR
- [ ] OAuth Google et Apple reportés après MVP (phase 18+)

### 9.4 Module Users ✅
- [x] Créer module Users
- [x] Service Users : findOne(), updateProfile(), gestion adresses complète
- [x] Controller Users avec endpoints :
  - GET /users/me (profil avec adresses)
  - PATCH /users/me (modifier profil)
  - GET /users/me/addresses (liste adresses)
  - POST /users/me/addresses (ajouter adresse)
  - PATCH /users/me/addresses/:id (modifier adresse)
  - DELETE /users/me/addresses/:id (supprimer adresse)
- [x] Système d'adresse par défaut (isDefault)
- [x] Tests Insomnia : Tous les endpoints fonctionnels

### 9.5 Sécurité ✅
- [x] Passwords hachés avec bcrypt (salt rounds 10)
- [x] Validation email unique lors register
- [x] Password jamais retourné (select: false + delete)
- [x] Routes protégées avec JwtAuthGuard
- [ ] Rate limiting → Phase 18 (fonctionnalités avancées)
- [ ] Vérification email → Phase 18 (fonctionnalités avancées)
- [ ] Réinitialisation mot de passe → Phase 18 (fonctionnalités avancées)

---

## 🎨 Phase 10 : Frontend - Authentification UI

**Objectif** : Pages de connexion, inscription, profil utilisateur

**📐 Workflow** : Design Figma → Code → Validation (voir [FIGMA_WORKFLOW.md](../export/FIGMA_WORKFLOW.md))

### 10.1 Context & Hooks Auth ✅
- [x] Créer AuthContext (contexte global utilisateur)
- [x] Hook useAuth() (login, logout, register, user)
- [x] Service auth.ts (loginUser, registerUser, getMe, refreshToken)
- [x] Stockage JWT (localStorage ou cookie sécurisé)
- [x] Auto-refresh token avant expiration
- [x] Correction syntaxe import/export (export type + import type)
- [x] Composant TestAuth.tsx pour tester le système auth
- [x] Tests complets : Register, Login, Logout, Persistance, LocalStorage

### 10.2 Pages Auth - Design & Implémentation ✅ (TERMINÉ - 10 déc 2025)

**📐 Phase Design (Figma)** :
- [x] Import code existant dans Figma (plugin "HTML to Design")
- [x] Design page Login dans Figma (layout 2 colonnes, vidéo, typographie exacte)
- [x] Utilisation de `get_design_context` + `get_screenshot` pour récupérer code Figma exact
- [x] **Workflow Figma → Code maîtrisé** (voir FIGMA_WORKFLOW.md + FIGMA_DEV_GUIDE.md)

**💻 Phase Implémentation - Login Page** :
- [x] Créer composants shadcn/ui manquants (Input, Label)
- [x] Coder page /login **pixel-perfect depuis Figma** ⭐
  - [x] Layout 2 colonnes avec **largeurs fixes** (478px + 1fr, pas 50%/50%)
  - [x] Typographie exacte (font-[Geist], leading-[20px], tracking-[-0.6px])
  - [x] Espacements précis **identiques partout** (gap-[1.5px], mb-[71px], gap-6)
  - [x] Couleurs exactes (#4a5565, #6a7282, rgba(0,0,0,0.5))
  - [x] Logo overlay avec mix-blend-luminosity et opacity-[0.81]
  - [x] **Responsive intelligent** :
    - Mobile : Formulaire centré, vidéo masquée
    - Desktop : Formulaire aligné gauche, vidéo collée avec gap-[10px]
  - [x] Grid responsive : `grid-cols-1 lg:grid-cols-[478px_1fr]`
  - [x] Padding container principal : `pb-[15px] pl-4 pr-[9px] pt-[10px]`
  - [x] **Code React propre** : HTML sémantique, minimum divs, space-y-*
- [x] Implémenter redirection après login (vers page précédente ou /)
- [x] Créer page /profile basique (affichage infos user, déconnexion)
- [x] Créer ProtectedRoute (HOC pour protéger routes)
- [x] Mettre à jour Header (bouton CONNEXION / prénom selon état auth)
- [x] Ajouter routes dans App.tsx (/login, /register, /profile)

**💻 Phase Implémentation - Register Page** ✅ (TERMINÉ - 10 déc 2025) :
- [x] Copier structure Login.tsx (même grid, même responsive, même vidéo)
- [x] Ajouter champs supplémentaires :
  - Prénom (optionnel)
  - Nom (optionnel)
  - Email (requis, uppercase)
  - Téléphone (optionnel)
  - Mot de passe (requis, min 8 caractères)
  - Confirmer mot de passe (requis)
- [x] Adapter responsive (même workflow que Login)
- [x] Valider formulaire (password match, email valide, min 8 chars)
- [x] **Optimiser espacements pour formulaires longs** :
  - Header → Form : `space-y-8` (32px) au lieu de `space-y-[71px]`
  - Entre champs : `space-y-4` (16px) au lieu de `space-y-6`
  - Sections : `space-y-3` (12px) pour compacité
  - Divider : `py-2` (8px) au lieu de `py-4`
  - Tout visible sans scroll ✅

**⏸️ Fonctionnalités avancées (Phase 18)** :
- [ ] Page /forgot-password (demande reset)
- [ ] Page /reset-password/:token (nouveau mot de passe)
- [ ] Boutons OAuth Google/Apple (UI + logique)

**📝 Documentation complète** :
- [x] **FIGMA_WORKFLOW.md** : Retour d'expérience Login + leçons apprises
- [x] **FIGMA_DEV_GUIDE.md** : Guide complet best practices Figma → React ⭐
- [x] Login.tsx = **fichier de référence** pour toutes futures pages
- [x] Workflow en 8 étapes validé et documenté

**✅ Phase Validation** :
- [x] Tester page /login (formulaire, validation, erreurs)
- [x] Tester page /register (formulaire, validation, erreurs)
- [x] Tester page /profile (affichage, déconnexion, protection)
- [x] Tester redirections (login → home, non-auth → login)
- [x] Tester Header (CONNEXION vs prénom/MON COMPTE)
- [x] Style A-COLD-WALL* respecté (minimaliste, noir/blanc, uppercase)

### 10.3 Page Profil - Design & Implémentation ✅ (TERMINÉ - 10 déc 2025)

**📐 Phase Design (Figma)** :
- [x] Design Figma récupéré (node-id: 6:273)
- [x] Layout 2 colonnes : Infos personnelles (gauche) + Quick actions (droite)
- [x] Responsive analysé (mobile 1 colonne, desktop 2 colonnes)

**💻 Phase Implémentation** :
- [x] **get_design_context + get_screenshot** pour récupérer design exact
- [x] Coder page /profile **pixel-perfect depuis Figma** ⭐
  - Grid `grid-cols-1 lg:grid-cols-[1fr_720px]` (gauche flexible + droite 720px)
  - Gap 24px entre colonnes
  - Espacements exacts : p-[33px] (gauche), p-[25px] (droite)
  - Typographie exacte (font-[Geist], text-[36px], text-[20px], text-[16px], text-[14px])
  - Couleurs exactes (#4a5565, #e7000b)
- [x] **Refactorisation en composants propres** :
  - `ProfileHeader` (header)
  - `ProfileInfoField` (field réutilisable)
  - `ProfileRoleBadge` (badge rôle)
  - `ProfileInfoCard` (card infos)
  - `ProfileQuickAction` (card action réutilisable)
  - `ProfileActions` (boutons déconnexion + retour)
  - **Avant** : 130 lignes → **Après** : 53 lignes (Profile.tsx)
- [x] Section "Mes informations" (affichage lecture seule)
  - Email, Prénom, Nom, Téléphone
  - Badge rôle (bg-black, text-white)
  - Date membre depuis
- [x] Quick actions (2 cards)
  - "Mes Commandes" (lien vers /orders)
  - "Mes Adresses" (disabled, bientôt disponible)
  - Cards adaptées au contenu (`h-fit`)
- [x] Bouton déconnexion (border rouge #e7000b)
- [x] Responsive pixel-perfect
  - Mobile : 1 colonne verticale
  - Desktop : 2 colonnes (gauche + 2 cards droite)

**📝 Composants créés** :
- `ProfileHeader.tsx` (11 lignes)
- `ProfileInfoField.tsx` (13 lignes)
- `ProfileRoleBadge.tsx` (13 lignes)
- `ProfileInfoCard.tsx` (38 lignes)
- `ProfileQuickAction.tsx` (35 lignes)
- `ProfileActions.tsx` (19 lignes)

**⏸️ Fonctionnalités avancées (Phase 11)** :
- [ ] Édition informations personnelles (formulaire)
- [ ] Gestion adresses CRUD (liste, ajout, modification, suppression)
- [ ] Changer mot de passe (formulaire, validation)

### 10.4 Protection de routes ✅
- [x] HOC ProtectedRoute (redirect /login si non connecté)
- [x] Protéger /profile
- [x] Affichage conditionnel Header (bouton CONNEXION vs prénom/MON COMPTE)
- [ ] Protéger /orders (Phase 14)
- [ ] Protéger /checkout (Phase 12)

---

## 🔄 Phase 11 : Backend - Gestion Commandes Complète ✅

**Objectif** : Gérer le cycle de vie complet d'une commande

### 11.1 Extension entité Order
- [x] Ajouter userId (relation ManyToOne User)
- [x] Ajouter shippingAddress (jsonb)
- [x] Ajouter billingAddress (jsonb)
- [x] Ajouter paymentIntentId (Stripe)
- [x] Ajouter trackingNumber (suivi colis)
- [x] Enum OrderStatus enrichi (PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED)
- [x] Ajouter paidAt, shippedAt, deliveredAt

### 11.2 Module Orders - Extension
- [x] Service Orders : findByUser(userId), updateStatus(), cancel(), refund()
- [x] Endpoint GET /orders/me (commandes utilisateur connecté)
- [x] Endpoint GET /orders/:id (détails commande, protégé)
- [x] Endpoint PATCH /orders/:id/cancel (annuler commande)
- [x] Guard : seul propriétaire ou admin peut voir commande

### 11.3 Gestion Stock
- [x] Service Stock : decrementStock(variantId, quantity), incrementStock()
- [x] Vérifier stock disponible avant création commande
- [x] Décrémenter stock après paiement validé
- [x] Re-incrémenter stock si commande annulée/remboursée
- [ ] Webhook Stripe pour synchroniser stock (Phase 13)

### 11.4 Notifications Emails (Nodemailer)
- [x] Installer @nestjs-modules/mailer, nodemailer
- [x] Configurer Nodemailer (SMTP Gmail ou SendGrid)
- [x] Templates emails (HTML) :
  - Confirmation inscription
  - Confirmation commande
  - Commande expédiée (avec tracking)
  - Commande livrée
  - Annulation/remboursement
- [x] Service Emails : sendOrderConfirmation(), sendShippingNotification()
- [x] Envoyer email après chaque changement statut commande

**📝 Note future** : Redesign des templates email dans Figma prévu post-lancement (basse priorité - voir section Post-Février 2025)

---

## 🎨 Phase 12 : Frontend - Panier & Checkout Complet

**Objectif** : Tunnel d'achat complet avec paiement

**📐 Workflow** : Design Figma → Code → Validation (voir [FIGMA_WORKFLOW.md](../export/FIGMA_WORKFLOW.md))

### 12.1 Page Panier (/cart) - Design & Implémentation
**📐 Phase Design (Figma)** :
- [x] Designer page Cart dans Figma (layout, composants)
- [x] Designer CartItem (image, nom, variant, quantité, prix, actions)
- [x] Designer QuantitySelector (bouton + pour augmenter)
- [x] Designer CartSummary (sous-total, shipping info, bouton checkout)
- [x] Designer état panier vide (EmptyCart avec CTA)
- [x] Designer états responsive (mobile, tablet, desktop)
- [x] Partager design Figma et valider

**💻 Phase Implémentation** :
- [x] Coder page Cart.tsx complète
- [x] Coder composant CartItem (image, nom, variant, quantité, prix, supprimer)
- [x] Coder composant QuantitySelector (+ pour augmenter quantité)
- [x] Coder composant CartSummary (sous-total, shipping info, bouton checkout)
- [x] Ajouter bouton "Checkout now" (vers /checkout)
- [x] Gérer panier vide (EmptyCart)
- [x] Nettoyer code et structurer composants React proprement
- [x] Ajouter responsive mobile-first (sans toucher valeurs desktop Figma)
- [ ] Calcul frais de livraison dynamique (standard/express) - À faire dans Checkout

**✅ Phase Validation** :
- [x] Comparer rendu avec Figma (valeurs exactes pixel-perfect)
- [x] Tester ajout/suppression articles
- [x] Tester changement quantités
- [x] Tester calcul total (articles)
- [x] Tester responsive

### 12.2 Intégration Stripe Checkout (Solution hébergée - MVP)
**📝 Note** : Utilisation de Stripe Checkout (solution hébergée) pour MVP. Phase d'amélioration prévue plus tard (voir Post-Février 2025) pour version personnalisée avec Payment Element.

**💻 Phase Implémentation** :
- [x] Modifier bouton "Checkout now" dans CartSummary
- [x] Créer service checkoutService.ts (appel API backend)
- [x] Appeler backend POST /checkout/create-session avec items du panier
- [x] Rediriger vers URL Checkout Session Stripe (redirectToCheckout)
- [x] Gérer redirection après paiement (success_url vers /order-confirmation)
- [x] Gérer annulation (cancel_url vers /cart)
- [x] Gestion erreurs (session creation failed)

**✅ Phase Validation** :
- [x] Tester redirection vers Stripe Checkout
- [x] Tester paiement test (carte 4242 4242 4242 4242)
- [x] Tester redirection après succès
- [ ] Tester annulation checkout
- [x] Vérifier création commande après paiement (via webhook)
- [x] Tester checkout invité (guest) et authentifié
- [x] Vérifier emails envoyés à chaque étape (PENDING, PAID, SHIPPED, DELIVERED, CANCELLED)
- [x] Vérifier emails pour utilisateurs invités (via customerInfo.email)
- [x] Implémenter persistance emails en BDD (entité OrderEmail)

### 12.4 Page Confirmation Commande - Design & Implémentation
**📐 Phase Design (Figma)** :
- [ ] Designer page Order Confirmation (layout, infos commande)
- [ ] Designer affichage numéro de commande (visuel, copiable)
- [ ] Designer sections (statut, adresse, articles, total)
- [ ] Designer CTA "Voir mes commandes", "Continuer shopping"
- [ ] Partager design Figma et valider

**💻 Phase Implémentation** :
- [ ] Coder page /order-confirmation/:orderId
- [ ] Affichage récapitulatif commande (fetch API /orders/:id)
- [ ] Afficher numéro de commande
- [ ] Afficher statut (payé, en cours de traitement)
- [ ] Afficher adresse de livraison
- [ ] Afficher articles commandés
- [ ] Afficher total payé
- [ ] Bouton "Voir mes commandes" (vers /orders)

**✅ Phase Validation** :
- [ ] Comparer rendu avec Figma
- [ ] Tester affichage après paiement réussi
- [ ] Tester récupération données commande (API)
- [ ] Tester navigation vers /orders

---

## ✅ Phase 13 : Backend - Paiement Stripe Checkout (Reboul) ✅

**Objectif** : Intégration Stripe Checkout (solution hébergée) pour Reboul (simple, pas de Connect)

**📝 Note** : Utilisation de Stripe Checkout (session-based) plutôt que PaymentIntent pour MVP. Plus simple et rapide à implémenter.

**✅ Statut** : TERMINÉE - Checkout fonctionnel avec capture manuelle, emails invités, persistance BDD

### 13.1 Module Stripe - Configuration
- [x] Installer stripe, @nestjs/stripe
- [x] Configurer clés API Stripe (STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY, STRIPE_WEBHOOK_SECRET)
- [x] Créer module Stripe
- [x] Service Stripe : createCheckoutSession(), refund()
- [x] Configuration compte Stripe Reboul (mode test - CLI configuré)

### 13.2 Création Checkout Session
- [x] Endpoint POST /checkout/create-session (public, guest checkout supporté)
- [x] Recevoir items du panier (variantId, quantity) depuis frontend
- [x] Vérifier stock disponible pour chaque item
- [x] Calculer montant total (articles + frais livraison fixe pour MVP)
- [x] Charger variants avec relations (Product, images, brand, category)
- [x] Construire images produits pour Stripe (priorité image couleur variant)
- [x] Enrichir descriptions produits (nom, marque, catégorie, couleur, taille)
- [x] Créer Checkout Session Stripe avec :
  - line_items (produits avec prix, quantité, images, descriptions)
  - mode: 'payment'
  - payment_intent_data: { capture_method: 'manual' } (capture manuelle)
  - shipping_address_collection (avec pays autorisés)
  - phone_number_collection (actif)
  - success_url (vers /order-confirmation?session_id={CHECKOUT_SESSION_ID})
  - cancel_url (vers /cart)
  - metadata (userId nullable pour guest, items JSON, total, itemCount)
- [x] Retourner session.url au frontend
- [x] Gérer devise (EUR)

### 13.3 Webhooks Stripe Checkout
- [x] Endpoint POST /checkout/webhook (recevoir events Stripe)
- [x] Vérifier signature webhook (sécurité avec STRIPE_WEBHOOK_SECRET)
- [x] Gérer events :
  - checkout.session.completed → Créer commande PENDING (pas PAID, capture manuelle)
  - checkout.session.async_payment_succeeded → Gérer si applicable
- [x] Extraction complète données Stripe (adresses livraison/facturation, téléphone, email)
- [x] Stockage items commande dans Order.items (JSONB) pour vérification stock lors capture
- [x] Configuration Stripe CLI pour développement local
- [x] Support guest checkout (userId nullable dans metadata)

### 13.4 Gestion Remboursements
- [ ] Endpoint POST /admin/orders/:id/refund (admin uniquement)
- [ ] Vérifier statut commande (PAID ou SHIPPED)
- [ ] Appeler Stripe API pour créer refund
- [ ] Mettre à jour statut commande → REFUNDED
- [ ] Incrémenter stock variants
- [ ] Envoyer email confirmation remboursement

### 13.5 Gestion Erreurs & Logs
- [ ] Logger toutes transactions Stripe
- [ ] Gestion erreurs paiement (carte refusée, fonds insuffisants, etc.)
- [ ] Retry logic pour webhooks (si échec)
- [ ] Dashboard Stripe : vérifier transactions en temps réel

### 13.6 Configuration Stripe Live (Production) - À faire avant lancement
**📝 Note** : Configuration Stripe en mode live pour la production. À faire juste avant la mise en production du site.

**💻 Configuration** :
- [ ] Passer du mode TEST au mode LIVE dans Stripe Dashboard
- [ ] Récupérer les clés LIVE (STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY) depuis Dashboard Stripe
- [ ] Configurer endpoint webhook HTTPS réel (pas localhost) dans Stripe Dashboard
- [ ] Récupérer STRIPE_WEBHOOK_SECRET du webhook HTTPS (pas CLI)
- [ ] Mettre à jour variables d'environnement production (.env.production)
- [ ] Configurer success_url et cancel_url avec le domaine de production
- [ ] Tester un paiement réel avec une carte de test (mode live mais montant minimal)
- [ ] Vérifier que les webhooks sont bien reçus en production
- [ ] Documenter les credentials Stripe Live (de manière sécurisée)

**⚠️ IMPORTANT** :
- Ne jamais commiter les clés LIVE dans Git
- Utiliser un gestionnaire de secrets (variables d'environnement serveur, secrets Docker, etc.)
- Tester en mode test jusqu'à la dernière minute avant la sortie

---

## ✅ Phase 14 : Frontend - Historique Commandes ✅

**Objectif** : Permettre à l'utilisateur de consulter ses commandes

**📐 Workflow** : Design Figma → Code → Validation (voir [FIGMA_WORKFLOW.md](../export/FIGMA_WORKFLOW.md))

**✅ Statut** : TERMINÉE - Implémentation complète avec génération PDF factures (design Figma à faire ensuite)

### 14.1 Page Mes Commandes (/orders) - Design & Implémentation
**📐 Phase Design (Figma)** :
- [ ] Designer page /orders (layout liste commandes)
- [ ] Designer OrderCard (résumé commande : date, statut, total, produits)
- [ ] Designer filtres par statut (toutes, en cours, livrées, annulées)
- [ ] Designer tri (date, montant)
- [ ] Designer pagination (si beaucoup de commandes)
- [ ] Designer état vide (aucune commande)
- [ ] Partager design Figma et valider

**💻 Phase Implémentation** :
- [x] Coder page /orders
- [x] Afficher liste des commandes (OrderCard par commande)
- [x] Implémenter filtres par statut (toutes, en cours, livrées, annulées)
- [x] Implémenter tri (date, montant)
- [ ] Implémenter pagination si beaucoup de commandes (optionnel pour MVP)
- [x] Clic sur commande → /orders/:id

**✅ Phase Validation** :
- [ ] Comparer rendu avec Figma
- [ ] Tester récupération commandes (API /orders/me)
- [ ] Tester filtres et tri
- [ ] Tester navigation vers détail commande

### 14.2 Page Détail Commande (/orders/:id) - Design & Implémentation
**📐 Phase Design (Figma)** :
- [ ] Designer page /orders/:id (layout détail commande)
- [ ] Designer header (numéro commande, date, statut)
- [ ] Designer OrderTimeline (visualisation étapes/statuts)
- [ ] Designer section articles (liste avec images)
- [ ] Designer section livraison (adresse, tracking)
- [ ] Designer section paiement (total, moyens paiement)
- [ ] Designer actions (annuler, télécharger facture)
- [ ] Partager design Figma et valider

**💻 Phase Implémentation** :
- [x] Coder page /orders/:id
- [x] Afficher numéro de commande
- [x] Afficher date et heure
- [x] Afficher statut avec timeline visuelle (OrderTimeline)
- [x] Afficher articles commandés (liste avec images)
- [x] Afficher adresse de livraison
- [x] Afficher total payé (articles + livraison)
- [x] Afficher tracking colis (si disponible)
- [x] Bouton "Annuler commande" (si statut PENDING/PAID)
- [x] Bouton "Télécharger facture" (PDF généré avec pdfkit) ✅

**✅ Phase Validation** :
- [ ] Comparer rendu avec Figma
- [x] Tester affichage détails commande (API /orders/:id)
- [x] Tester timeline selon statut
- [x] Tester bouton annuler (API PATCH /orders/:id/cancel)
- [x] Tester téléchargement facture PDF

### 14.3 Composants Commandes - Design & Implémentation
**📐 Phase Design (Figma)** :
- [ ] Designer composant OrderCard (pour liste)
- [ ] Designer composant OrderTimeline (états visuels)
- [ ] Designer composant OrderItem (article dans commande)
- [ ] Designer composant TrackingInfo (suivi colis)
- [ ] Partager composants Figma et valider

**💻 Phase Implémentation** :
- [x] Coder composant OrderCard (résumé commande dans liste avec 1-3 miniatures)
- [x] Coder composant OrderTimeline (visualisation étapes)
- [x] Coder composant OrderItem (article dans commande)
- [x] Coder composant TrackingInfo (suivi colis)

**✅ Phase Validation** :
- [x] Comparer composants avec Figma
- [x] Tester réutilisabilité des composants
- [x] Tester tous les états (pending, paid, shipped, delivered, cancelled)

---

## ✅ Phase 14.5 : Frontend - Page Produit Améliorée (MVP) ✅

**Objectif** : Améliorer la page produit avec affichage stock, guide taille et désactivation variants épuisés

**📐 Workflow** : Design Figma → Code → Validation (voir [FIGMA_WORKFLOW.md](../export/FIGMA_WORKFLOW.md))

**✅ Statut** : TERMINÉE - Implémentation complète avec améliorations UX

**⚠️ MVP** : Seulement les fonctionnalités essentielles (stock + guide taille). Le reste (matières, dimensions, produits similaires) sera ajouté post-lancement.

### 14.5.1 Affichage Stock par Variant - Design & Implémentation
**📐 Phase Design (Figma)** :
- [ ] Designer affichage stock par variant (badge "En stock" / "Stock faible" / "Rupture")
- [ ] Designer sélecteurs couleur/taille avec grisage si épuisé
- [ ] Designer badge "Dernières pièces" si stock ≤ seuil (5 unités)
- [ ] Designer désactivation bouton "Ajouter au panier" si variant épuisé
- [ ] Partager design Figma et valider

**💻 Phase Implémentation** :
- [x] Récupérer stock par variant depuis API
- [x] Afficher statut stock (Option C hybride : statut si > seuil, quantité si ≤ seuil)
- [x] Griser variants épuisés dans sélecteurs
- [x] Désactiver bouton "Ajouter au panier" si variant épuisé
- [x] Afficher badge "Dernières pièces" si stock ≤ 5
- [x] Message "Rupture de stock" au clic sur variant épuisé

**✅ Phase Validation** :
- [x] Comparer rendu avec Figma
- [x] Tester affichage stock (en stock, stock faible, rupture)
- [x] Tester grisage variants épuisés
- [x] Tester désactivation bouton si épuisé

### 14.5.3 Améliorations UX Ajoutées ✅
- [x] Toast notification après ajout au panier (bas à droite, 2 secondes)
- [x] Compteur quantité intégré dans le bouton "Ajouter au panier"
- [x] Breadcrumbs (fil d'Ariane) en haut de page
- [x] Badge produit (Nouveau/Sale/Stocks insuffisants) sur galerie
- [x] Modal notification rupture de stock avec localStorage
- [x] Tous les textes en uppercase (style A-COLD-WALL*)

### 14.5.2 Guide Taille - Design & Implémentation
**📐 Phase Design (Figma)** :
- [ ] Designer tableau des tailles (déjà prévu dans tab "Sizing")
- [ ] Designer mesures (tour de poitrine, longueur, etc.)
- [ ] Designer responsive (mobile : scroll horizontal, desktop : tableau complet)
- [ ] Partager design Figma et valider

**💻 Phase Implémentation** :
- [x] Afficher tableau des tailles dans tab "Sizing"
- [x] Récupérer size chart depuis catégorie ou produit (override)
- [x] Afficher mesures par taille (tour de poitrine, longueur, etc.)
- [x] Responsive : scroll horizontal sur mobile si tableau large
- [ ] Bouton "Comment choisir sa taille ?" avec modal explicatif (optionnel MVP)

**✅ Phase Validation** :
- [x] Comparer rendu avec Figma
- [x] Tester affichage size chart (catégorie vs produit override)
- [x] Tester responsive (mobile scroll, desktop tableau)

**⏸️ Post-MVP (Phase 18+)** :
- [ ] Recommandation taille basée sur historique client
- [ ] Recommandation taille basée sur taille moyenne par produit
- [ ] Informations détaillées (matières, dimensions, entretien)
- [ ] Produits similaires

---

## ✅ Phase 14.6 : Frontend - Animations GSAP ✅

**Objectif** : Ajouter des animations fluides et professionnelles avec GSAP sur toutes les pages principales

**✅ Statut** : TERMINÉE - Système d'animations complet avec workflow et presets réutilisables

### 14.6.1 Workflow Animations GSAP ✅
- [x] Créer documentation complète ANIMATIONS_GUIDE.md
- [x] Créer structure animations/ (presets/, components/, utils/)
- [x] Créer hook useGSAP pour nettoyage automatique
- [x] Créer constantes (durées, eases, délais, stagger)
- [x] Documenter workflow dans project-rules.mdc

### 14.6.2 Presets d'animations créés ✅
- [x] fade-in.ts : Animation fade-in réutilisable
- [x] slide-up.ts : Animation slide-up avec fade-in
- [x] slide-down.ts : Animation slide-down (pour menus dropdown)
- [x] reveal-up.ts : Animation reveal depuis le bas (sections importantes)
- [x] stagger-fade-in.ts : Animation en cascade pour listes/grilles
- [x] scale-hover.ts : Animation scale au hover (boutons, interactifs)
- [x] fade-scale.ts : Animation fade avec scale (zoom)

### 14.6.3 Hook scroll animation ✅
- [x] Créer useScrollAnimation avec Intersection Observer
- [x] Support threshold, rootMargin, once
- [x] Déclenchement automatique au scroll

### 14.6.4 Animations Page Product ✅
- [x] Fade-in de la page au chargement
- [x] Slide-up breadcrumbs
- [x] Slide-up galerie + infos produit en parallèle
- [x] Slide-up actions (variant selector + add to cart)
- [x] Fade-in onglets
- [x] Timeline GSAP orchestrée

### 14.6.5 Animations Page Home ✅
- [x] HeroSectionImage : reveal-up au scroll (1.5s)
- [x] FeaturedProducts : stagger-fade-in au scroll (1.2s, stagger 0.15s)
- [x] CategorySection : reveal-up au scroll (1.4s)
- [x] HeroSectionVideo : reveal-up au scroll (1.5s)
- [x] PromoCard : reveal-up au scroll (1.4s)
- [x] Animations déclenchées au scroll (useScrollAnimation)

### 14.6.6 Animations Page Catalog ✅
- [x] Banner titre : slide-up (0.6s)
- [x] HeroSectionImage : reveal-up (0.8s)
- [x] ProductGrid : stagger-fade-in des cartes produits (0.5s, stagger 0.08s)
- [x] Timeline GSAP orchestrée

### 14.6.7 Animations Header/Navbar ✅
- [x] Header : fade-in + slide-down au chargement (0.6s)
- [x] Mega menu CATALOGUE : slide-down à l'ouverture (0.4s)
- [x] Catégories : stagger-fade-in dans le menu (0.3s, stagger 0.05s)
- [x] Images menu : stagger-fade-in (0.4s, stagger 0.1s)
- [x] Mega menu BRANDS : slide-down à l'ouverture (0.4s)
- [x] Marques : stagger-fade-in dans le menu (0.3s, stagger 0.05s)
- [x] Images/vidéos menu : stagger-fade-in (0.4s, stagger 0.1s)
- [x] Badge panier : scale animation quand nombre change

### 14.6.8 Exports & Documentation ✅
- [x] Tous les presets exportés dans animations/index.ts
- [x] Hook useScrollAnimation exporté
- [x] Documentation complète dans ANIMATIONS_GUIDE.md
- [x] Project commands créées (/animation-workflow, etc.)

**📚 Documentation** :
- **ANIMATIONS_GUIDE.md** : Guide complet animations GSAP
- **.cursor/commands/animation-workflow.md** : Workflow animations

---

## 🔄 Phase 14.7 : Frontend - Loaders Reboul (Animation de chargement)

**Objectif** : Créer deux loaders professionnels pour améliorer l'expérience utilisateur lors des chargements

**📐 Workflow** : Design Figma → Code → Validation (voir [FIGMA_WORKFLOW.md](../export/FIGMA_WORKFLOW.md))

### 14.7.1 Loader Complexe - Démarrage du Site

**Objectif** : Animation de chargement complexe et élaborée affichée lors du premier chargement du site

**📐 Phase Design (Figma)** :
- [ ] Designer loader complexe style Reboul (inspiration A-COLD-WALL*)
- [ ] Animation principale : Logo REBOULSTORE 2.0* avec animation complexe
- [ ] Éléments visuels : Effets de transition, morphing, particules, etc.
- [ ] Durée estimée : 2-3 secondes
- [ ] États : Initial → Loading → Complete → Fade out
- [ ] Responsive : Mobile + Desktop
- [ ] Partager design Figma et valider

**💻 Phase Implémentation** :
- [ ] Créer composant `AppLoader.tsx` (loader complexe)
- [ ] Implémenter animation GSAP complexe (timeline)
- [ ] Intégrer logo Reboul avec animations
- [ ] Ajouter effets visuels (particules, morphing, etc.)
- [ ] Gérer états de chargement (initial, loading, complete)
- [x] Fade out automatique après chargement
- [x] Précharger ressources critiques (fonts, images logo)
- [x] Intégrer dans `main.tsx` ou `App.tsx` (affiché au mount)

**✅ Phase Validation** :
- [ ] Tester animation complexe (fluide, 60fps)
- [ ] Vérifier affichage sur mobile et desktop
- [ ] Vérifier fade out propre après chargement
- [ ] Optimiser performance (pas de lag)
- [ ] Comparer rendu avec Figma

### 14.7.2 Loader Simple - Chargement Inter-Page

**Objectif** : Loader minimaliste affiché lors de la navigation entre pages (transitions)

**📐 Phase Design (Figma)** :
- [ ] Designer loader simple style Reboul
- [ ] Animation minimale : Spinner, barre de progression, ou logo simple
- [ ] Style cohérent avec l'identité Reboul (noir/blanc, minimaliste)
- [ ] Position : En haut de la page ou centre de l'écran
- [ ] Durée : Variable selon vitesse de chargement de la page
- [ ] Responsive : Mobile + Desktop
- [ ] Partager design Figma et valider

**💻 Phase Implémentation** :
- [x] Créer composant `PageLoader.tsx` (loader simple)
- [x] Implémenter animation GSAP simple (spinner ou barre)
- [x] Intégrer dans React Router (affiché lors des transitions)
- [ ] Utiliser `useNavigation()` hook de React Router (si disponible)
- [x] Ou utiliser context/state global pour gérer affichage
- [x] Afficher en haut de page (barre) ou centre (spinner)
- [ ] Gérer multiple requêtes simultanées
- [x] Masquer automatiquement après chargement page

**✅ Phase Validation** :
- [x] Tester affichage lors de navigation entre pages
- [x] Vérifier que le loader disparaît correctement
- [ ] Tester sur pages lentes (simuler délai réseau)
- [ ] Vérifier affichage sur mobile et desktop
- [ ] Comparer rendu avec Figma

### 14.7.3 Optimisations & Accessibilité

**💻 Implémentations techniques** :
- [ ] Réduire motion pour `prefers-reduced-motion` (accessibilité)
- [x] Précharger ressources critiques avant affichage loader
- [x] Optimiser animations GSAP (performance)
- [ ] Lazy loading du loader complexe (code splitting)
- [ ] Cache loader simple pour éviter re-render inutile

**✅ Phase Validation** :
- [ ] Tester avec `prefers-reduced-motion: reduce`
- [x] Vérifier performance (pas de lag, 60fps)
- [ ] Tester code splitting (bundle size)
- [ ] Vérifier accessibilité (screen readers)

**📚 Ressources** :
- **ANIMATIONS_GUIDE.md** : Guide animations GSAP
- **.cursor/commands/animation-workflow.md** : Workflow animations

**⏸️ Priorité** : Moyenne (amélioration UX, pas critique MVP)

---

## 🔄 Phase 15 : Backend - Upload Images Cloudinary (Dans admin-central) ✅

**Objectif** : Gérer upload et optimisation images via Cloudinary

### 15.1 Configuration Cloudinary
- [x] Installer cloudinary, @nestjs/cloudinary (ou wrapper)
- [x] Configurer clés API (CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET)
- [x] Créer module Cloudinary
- [x] Service Cloudinary : uploadImage(), deleteImage(), transformImage()

### 15.2 Integration dans Products
- [x] Modifier endpoint POST /products/:id/images pour upload Cloudinary
- [x] Stocker URL Cloudinary dans entité Image
- [x] Optimisation automatique (compression, format webp)
- [x] Générer thumbnails (200x200, 400x400, 1200x1200)
- [x] Supprimer image Cloudinary lors DELETE /images/:id

### 15.3 Upload Multiple
- [x] Endpoint POST /products/:id/images/bulk (upload jusqu'à 7 images)
- [x] Vérification format (jpg, png, webp)
- [x] Vérification taille (max 10MB par image)
- [x] Ordre automatique (1, 2, 3...)

### 15.4 Tests & Documentation
- [x] Script de test automatisé (test-images-upload.ts)
- [x] Documentation complète (IMAGES_UPLOAD.md)
- [x] Filtre d'exception global pour erreurs multer
- [x] Tests fonctionnels validés (6/6 tests réussis)

---

## ✅ Phase 15.5 : Infrastructure Admin-Centrale (Docker & Structure) ✅

**Objectif** : Préparer l'architecture technique de l'admin centrale (projet séparé) avant d'implémenter le backend (Phase 16) et le frontend (Phase 17).

**✅ Statut** : TERMINÉE - Infrastructure complète créée et validée

### 15.5.1 Structure des projets admin-central ✅

- [x] Créer dossier `admin-central/` à la racine du repo
- [x] Créer structure `admin-central/backend/` (NestJS minimal)
- [x] Créer structure `admin-central/frontend/` (Vite + React + TypeScript)
- [x] Ajouter READMEs minimalistes dans `admin-central/backend` et `admin-central/frontend` (objectifs + liens vers ARCHITECTURE_ADMIN_CENTRAL.md)

### 15.5.2 Docker & Réseaux ✅

- [x] Créer `admin-central/docker-compose.yml` pour inclure :
  - [x] Service `admin-central-backend` (NestJS, port 4001)
  - [x] Service `admin-central-frontend` (Vite/React, port 4000)
- [x] S'assurer que tous les services (Reboul + Admin) utilisent un réseau Docker commun (`reboulstore-network`)
- [x] Monter les volumes nécessaires (code, node_modules si besoin, etc.)
- [x] Vérifier que `backend` Reboul, `frontend` Reboul et `admin-central` cohabitent correctement
- [x] Ajouter nom explicite au réseau dans `reboulstore/docker-compose.yml` pour partage

### 15.5.3 Connexions bases de données & config ✅

- [x] Définir variables d'environnement spécifiques admin-central (connexion Reboul via `REBOUL_DB_HOST`, `REBOUL_DB_PORT`, etc.)
- [x] Configurer connexions multiples TypeORM dans `admin-central/backend/src/config/databases.config.ts` :
  - [x] Connexion `'reboul'` active (MVP)
  - [x] Connexions `'cpcompany'` et `'outlet'` préparées (commentées pour futur)
- [x] Configurer `app.module.ts` avec connexion Reboul active
- [x] Vérifier accès admin-central/backend à la base Reboul (connexion TypeORM validée - queries SQL fonctionnelles)

### 15.5.4 Validation de l'infra ✅

- [x] Démarrer tous les services via Docker et vérifier :
  - [x] `backend` Reboul OK
  - [x] `frontend` Reboul OK
  - [x] `admin-central-backend` répond avec endpoint `/health` (testé et fonctionnel)
  - [x] `admin-central-frontend` affiche page de test "Hello Admin" (ex: “Hello Admin”)
- [x] Backend admin : Endpoint `/health` retourne `{"status":"ok","message":"Admin Central Backend is running"}`
- [x] Connexion TypeORM admin → base Reboul validée (logs montrent queries SQL réussies)

---

## 🔄 Phase 16 : Backend - Admin & Permissions (admin-central)

**Objectif** : Créer backend admin-central avec connexions multiples TypeORM et gérer produits, commandes, utilisateurs Reboul

**Architecture** : 
- Créer structure `admin-central/backend/`
- Configurer connexions multiples TypeORM (Reboul pour MVP)
- Copier entités Reboul dans `admin-central/backend/src/modules/reboul/entities/`
- Créer services et controllers pour Reboul

**📚 Documentation** : Voir [`ARCHITECTURE_ADMIN_CENTRAL.md`](../architecture/ARCHITECTURE_ADMIN_CENTRAL.md)

### 16.1 Setup admin-central/backend ✅
- [x] Créer structure `admin-central/backend/` (NestJS) ✅ Phase 15.5
- [x] Configurer connexions multiples TypeORM ✅ Phase 15.5
  - [x] Config connexion Reboul (`databases.config.ts`)
  - [x] Config connexion CP Company (futur, commenté)
  - [x] Config connexion Outlet (futur, commenté)
- [x] Configurer `app.module.ts` avec connexions multiples ✅ Phase 15.5
- [x] Copier entités Reboul dans `admin-central/backend/src/modules/reboul/entities/` (11 entités : Product, Order, User, Variant, Category, Image, Brand, Shop, Address, Cart, CartItem)
- [x] Créer module Reboul (`reboul.module.ts`) avec toutes les entités enregistrées avec connexion 'reboul'

### 16.2 Rôles & Permissions ✅
- [x] Créer entité AdminUser (séparée de User client) dans `shared/auth/admin-user.entity.ts`
- [x] Enum AdminRole (ADMIN, SUPER_ADMIN)
- [x] Service AdminAuthService (register, login, validateUser)
- [x] Strategy AdminJwtStrategy pour validation JWT
- [x] Guard AdminJwtAuthGuard pour protéger routes
- [x] Guard RolesGuard pour vérifier rôle
- [x] Decorator @Roles() pour spécifier rôles requis
- [x] Controller AdminAuthController (POST /admin/auth/register, POST /admin/auth/login, GET /admin/auth/me)
- [x] Appliquer guards sur toutes les routes admin (products, orders, users, stocks)
- [x] Table `admin_users` créée automatiquement (synchronize en dev)
- [x] Tests : Inscription, connexion, token JWT, routes protégées validées

### 16.3 Module Admin - Produits Reboul ✅
- [x] Créer `ReboulProductsService` (injecter repository avec connexion 'reboul')
- [x] Créer `ReboulProductsController`
- [x] Endpoint GET /admin/reboul/products (tous produits Reboul, pagination, filtres)
- [x] Endpoint GET /admin/reboul/products/stats (statistiques produits)
- [x] Endpoint GET /admin/reboul/products/:id (détails produit)
- [x] Endpoint POST /admin/reboul/products (créer produit - TODO: DTOs complets)
- [x] Endpoint PATCH /admin/reboul/products/:id (modifier)
- [x] Endpoint DELETE /admin/reboul/products/:id (supprimer)
- [ ] Gestion variants en bulk → Phase 17 (Frontend Admin)
- [ ] Gestion images en bulk (Cloudinary) → Phase 17 (Frontend Admin)

### 16.4 Module Admin - Commandes Reboul ✅
- [x] Créer `ReboulOrdersService` (injecter repository avec connexion 'reboul')
- [x] Créer `ReboulOrdersController`
- [x] Endpoint GET /admin/reboul/orders (toutes commandes Reboul, pagination, filtres)
- [x] Endpoint GET /admin/reboul/orders/stats (statistiques commandes)
- [x] Endpoint GET /admin/reboul/orders/:id (détails commande)
- [x] Endpoint PATCH /admin/reboul/orders/:id/status (changer statut avec validation transitions)
- [x] Endpoint POST /admin/reboul/orders/:id/tracking (ajouter tracking)
- [ ] Endpoint POST /admin/reboul/orders/:id/capture (capture paiement PENDING) → À implémenter avec Stripe
- [ ] Endpoint POST /admin/reboul/orders/:id/refund (rembourser) → À implémenter avec Stripe
- [x] Statistiques commandes Reboul (CA, nombre, par statut)

### 16.5 Module Admin - Utilisateurs Reboul ✅
- [x] Créer `ReboulUsersService` (injecter repository avec connexion 'reboul')
- [x] Créer `ReboulUsersController`
- [x] Endpoint GET /admin/reboul/users (liste users Reboul, pagination, recherche, filtres par rôle)
- [x] Endpoint GET /admin/reboul/users/stats (statistiques utilisateurs)
- [x] Endpoint GET /admin/reboul/users/:id (détails utilisateur)
- [x] Endpoint PATCH /admin/reboul/users/:id/role (changer rôle avec validation)
- [x] Endpoint DELETE /admin/reboul/users/:id (supprimer compte avec vérification commandes actives)
- [x] Statistiques users Reboul (inscrits, par rôle, avec/sans commandes)

### 16.6 Module Admin - Stocks Reboul ✅
- [x] Créer `ReboulStocksService` (injecter repository avec connexion 'reboul')
- [x] Créer `ReboulStocksController`
- [x] Endpoint GET /admin/reboul/stocks (vue stocks, filtres rupture/stock faible)
- [x] Endpoint GET /admin/reboul/stocks/stats (statistiques stocks)
- [x] Endpoint GET /admin/reboul/stocks/:variantId (détails stock variant)
- [x] Endpoint PATCH /admin/reboul/stocks/:variantId (modifier stock variant)
- [ ] Import CSV stocks (bulk update) → Phase 17 (Frontend Admin)
- [ ] Alertes stock faible (notifications admin) → Phase 18 (Fonctionnalités avancées)

### 16.7 Docker Compose Admin ✅
- [x] Créer `admin-central/docker-compose.yml` ✅ Phase 15.5
- [x] Configurer backend admin (port 4001) ✅ Phase 15.5
- [x] Configurer frontend admin (port 4000) ✅ Phase 15.5
- [x] Configurer réseaux Docker partagés (reboulstore-network) ✅ Phase 15.5
- [x] Variables d'environnement (connexions databases) ✅ Phase 15.5

---

## 🎨 Phase 17 : Frontend - Admin Centrale (admin-central)

**Objectif** : Créer Frontend Admin Centrale (React + GeistUI) et le connecter au backend admin-central

**Architecture** : 
- Créer structure `admin-central/frontend/`
- React + Vite + TypeScript + GeistUI
- Connexion à `admin-central/backend` (port 4001)

**📐 Workflow** : Design Figma → Code → Validation (voir [FIGMA_WORKFLOW.md](../export/FIGMA_WORKFLOW.md))

**⚠️ IMPORTANT** : Pour **CHAQUE sous-phase** (Dashboard, Produits, Commandes, Users, etc.) :
1. 📐 **Designer d'abord dans Figma** (layout, composants, formulaires, tables)
2. 💻 **Partager design et valider** avant de coder
3. 🔨 **Implémenter en code** (React + GeistUI + TailwindCSS)
4. ✅ **Valider** rendu vs Figma + fonctionnel

**📚 Documentation** : Voir [`ARCHITECTURE_ADMIN_CENTRAL.md`](../architecture/ARCHITECTURE_ADMIN_CENTRAL.md)

### 17.1 Setup Admin Centrale ✅
- [x] Créer structure `admin-central/frontend/` (séparé de reboulstore) ✅ Phase 15.5
- [x] Setup Vite + React + TypeScript ✅ Phase 15.5
- [x] Installer TailwindCSS v4 (@tailwindcss/vite)
- [x] Installer dépendances (axios, clsx, tailwind-merge, geist, lucide-react)
- [x] Configurer routing (React Router) ✅ Phase 15.5
- [x] Configuration API : Service API avec Axios (baseURL http://localhost:4001)
- [x] Types TypeScript (AdminUser, AdminRole, AdminLoginDto, etc.)
- [x] Service admin-auth.service.ts (login, register, getMe, logout)
- [x] Context AuthAdminContext (gestion état utilisateur)
- [x] Composant ProtectedRoute (protection routes)
- [x] Utilitaire cn() (combiner classes TailwindCSS)
- [ ] Layout admin (sidebar + topbar + site selector) → Phase 17.2-17.3

### 17.2 Authentification Admin ✅
- [x] Page login admin (`/admin/login`) avec formulaire email/password
- [x] Validation des champs (email format, password min 8 caractères)
- [x] Gestion des erreurs (affichage messages d'erreur)
- [x] Context AuthAdmin (JWT token) ✅ Phase 17.1
- [x] Service API auth admin ✅ Phase 17.1
- [x] Guard ProtectedRoute admin ✅ Phase 17.1
- [x] Layout AdminLayout avec topbar (nom utilisateur + rôle + bouton logout)
- [x] Page Dashboard placeholder (`/admin/reboul/dashboard`) protégée
- [x] Redirection automatique si déjà connecté
- [x] Redirection après login réussi vers dashboard

### 17.3 Dashboard Reboul ✅
- [x] Page `/admin/reboul/dashboard` (statistiques Reboul)
- [x] Services API : reboul-stats.service.ts (statistiques produits, commandes, users, stocks)
- [x] Service API : reboul-orders.service.ts (récupération commandes)
- [x] Hooks : useReboulStats() (statistiques complètes)
- [x] Hooks : useRecentOrders() (dernières commandes)
- [x] Composant StatsCard (cartes métriques avec icônes)
- [x] Composant RecentOrdersTable (tableau dernières commandes avec badges statut)
- [x] Cartes métriques :
  - CA Total (revenus totaux)
  - Nombre commandes (total)
  - Produits (total, en stock, rupture)
  - Clients (total, avec commandes)
- [ ] Graphiques (Chart.js ou Recharts) : → Phase future (optionnel)
  - Évolution ventes (7 derniers jours)
  - Top 5 produits vendus
  - Répartition commandes par statut
- [x] Liste dernières commandes (5 dernières avec statut, montant, date)

### 17.4 Gestion Produits Reboul
- [x] Service API : reboul-products.service.ts (getProducts, getProduct)
- [x] Hook : useReboulProducts() (pagination, filtres, recherche)
- [x] Page `/admin/reboul/products` (liste produits Reboul)
  - [x] Recherche par nom (input avec icône search)
  - [x] Filtres (catégorie, marque) - TODO: Charger options depuis API
  - [ ] Tri (nom, prix, stock, date création) → À implémenter côté backend
  - [x] Pagination complète (prev/next, numéros de page, ellipsis)
  - [x] Tableau produits (nom, catégorie, prix, date création)
  - [x] Actions (éditer, supprimer)
  - [x] Bouton "Nouveau produit" vers `/admin/reboul/products/new`
- [x] Page `/admin/reboul/products/new` (créer produit)
  - [x] Formulaire complet (nom, description, prix, catégorie, marque)
  - [ ] Upload images (drag & drop, max 7) → Phase future
  - [ ] Gestion variants (tableau taille/couleur/stock/prix) → Phase future
  - [x] Bouton "Créer produit"
- [x] Page `/admin/reboul/products/:id/edit` (éditer produit)
  - [x] Mêmes champs que création (pré-remplis)
  - [ ] Supprimer images existantes → Phase future
  - [ ] Modifier variants existants → Phase future
  - [ ] Preview produit (vue client) → Phase future
- [x] Composants :
  - [x] ProductForm (formulaire réutilisable avec validation)
  - [ ] ImageUploader (drag & drop multiple) → Phase future
- [x] Services API : reboul-categories.service.ts, reboul-brands.service.ts (récupération catégories/marques)
- [x] Endpoints backend : GET /admin/reboul/products/categories, GET /admin/reboul/products/brands
  - VariantTable (tableau éditable variants)

### 17.5 Gestion Commandes Reboul
- [x] Service API : reboul-orders.service.ts (getOrders, getOrder, updateOrderStatus)
- [x] Hook : useReboulOrders() (pagination, filtres, recherche)
- [x] Page `/admin/reboul/orders` (liste commandes Reboul)
  - [x] Filtres par statut (PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED)
  - [x] Recherche par numéro commande/email client
  - [x] Badge couleur par statut (StatusBadge component)
  - [x] Pagination complète
  - [ ] Tri (date, montant) → À implémenter côté backend
  - [x] Lien vers détails commande
- [x] Page `/admin/reboul/orders/:id` (détails commande Reboul)
  - [x] Infos client (nom, email, téléphone)
  - [x] Adresse livraison/facturation
  - [x] Liste articles (nom, variant, quantité, prix)
  - [x] Total commande
  - [x] Statut actuel avec timeline visuelle
  - [x] Actions :
    - [x] Changer statut (dropdown avec transitions valides)
    - [x] Ajouter numéro tracking (input + save)
    - [ ] Rembourser commande (bouton avec confirmation) → À implémenter
  - [x] Timeline avec dates (createdAt, paidAt, shippedAt, deliveredAt)
- [ ] Export CSV commandes (bouton dans liste)

### 17.6 Gestion Utilisateurs Reboul
- [x] Service API : reboul-users.service.ts (getUsers, getUser, updateUserRole, deleteUser)
- [x] Hook : useReboulUsers() (pagination, filtres, recherche)
- [x] Page `/admin/reboul/users` (liste users Reboul)
  - [x] Recherche par nom/email
  - [x] Filtres par rôle (CLIENT, ADMIN, SUPER_ADMIN)
  - [x] Badge rôle (RoleBadge component)
  - [x] Pagination complète
  - [ ] Tri (date inscription, nombre commandes) → À implémenter côté backend
  - [x] Lien vers détails utilisateur
- [x] Page `/admin/reboul/users/:id` (détails user Reboul)
  - [x] Infos personnelles (nom, email, téléphone, date inscription)
  - [x] Liste adresses
  - [x] Liste commandes (historique avec liens vers détails)
  - [x] Changer rôle (dropdown : CLIENT ↔ ADMIN)
  - [x] Supprimer compte (avec confirmation)
  - [x] Statistiques (nombre commandes, adresses, date inscription)

### 17.7 Gestion Catégories & Marques Reboul
- [x] Page `/admin/reboul/categories` (liste catégories Reboul)
  - CRUD catégories (create, edit, delete)
  - Upload image/vidéo hero section
  - Size chart par catégorie
- [x] Page `/admin/reboul/brands` (liste marques Reboul)
  - CRUD marques (create, edit, delete)
  - Upload logo + mega menu images/vidéos
  - Statistiques par marque (nombre produits)

### 17.8 Configuration Site Reboul ✅
#### 17.8.1 Amélioration Responsive Design (Mobile, Tablette, Desktop)
- [x] Audit responsive de toutes les pages admin
  - [ ] DashboardPage (stats cards, graphiques)
  - [ ] ProductsPage (tableau, filtres, pagination)
  - [ ] CreateProductPage / EditProductPage (formulaires)
  - [ ] CategoriesPage / BrandsPage (tableaux, CRUD)
  - [ ] CreateCategoryPage / EditCategoryPage (formulaires avec uploads)
  - [ ] CreateBrandPage / EditBrandPage (formulaires avec uploads)
  - [ ] OrdersPage / OrderDetailPage (tableaux, détails)
  - [ ] UsersPage / UserDetailPage (tableaux, profils)
- [x] Optimisation tableaux pour mobile
  - [x] Remplacer tableaux par cards sur mobile (< 768px)
  - [ ] Garder tableaux sur tablette/desktop (≥ 768px)
  - [ ] Pagination responsive (simplifiée sur mobile)
- [x] Optimisation formulaires
  - [x] Layout responsive (colonnes adaptatives)
  - [x] FileUpload responsive (taille adaptative)
  - [x] Size chart responsive (scroll horizontal si nécessaire)
  - [x] Boutons actions (stack vertical sur mobile)
- [x] Amélioration navigation
  - [x] Menu mobile optimisé (hamburger amélioré)
  - [ ] Tabs navigation responsive (scroll horizontal si nécessaire)
  - [x] Topbar responsive (éléments masqués/affichés selon breakpoint)
- [x] Breakpoints standards Tailwind
  - [ ] Mobile : < 640px (sm)
  - [ ] Tablette : 640px - 1024px (sm - lg)
  - [ ] Desktop : ≥ 1024px (lg+)
- [ ] Tests responsive
  - [ ] Tester sur différentes tailles d'écran
  - [ ] Tester sur vrais appareils (mobile, tablette)
  - [ ] Vérifier touch targets (min 44x44px sur mobile)

- [x] Page `/admin/reboul/settings` (paramètres Reboul)
  - [x] Politiques livraison (jsonb)
  - [x] Politiques retour (jsonb)
  - [x] Frais de livraison (standard, express)
  - [x] Informations shop (nom, adresse, email contact)
  - [x] Compte Stripe (affichage ID, lien dashboard Stripe)


### 17.10 Multi-Sites Preparation (UI uniquement)

**🎯 Objectif** : Préparer l'UI pour la gestion multi-sites. Page de sélection de magasin accessible sans login.

#### 17.10.1 Page de sélection de magasin (`/`)
- [x] Créer/remplacer `Home.tsx` par `ShopSelectorPage`
  - [x] Route `/` pointe vers cette page
  - [x] Page publique (accessible sans authentification)
  - [x] Layout centré avec design cohérent (style A-COLD-WALL*, minimaliste)
  
- [x] Afficher les 3 magasins disponibles
  - [x] Reboul (actif)
    - [x] 🟢 Indicateur visuel "Actif"
    - [x] Bouton "Accéder" cliquable
    - [x] Clic redirige vers `/admin/reboul/login`
    - [x] Style : carte interactive (hover, focus)
  - [x] CP Company (inactif)
    - [x] 🔴 Indicateur visuel "À venir"
    - [x] Message "Disponible prochainement"
    - [x] Bouton désactivé ou non cliquable
    - [x] Style : carte avec opacité réduite
  - [x] Outlet (inactif)
    - [x] 🔴 Indicateur visuel "À venir"
    - [x] Message "Disponible prochainement"
    - [x] Bouton désactivé ou non cliquable
    - [x] Style : carte avec opacité réduite

- [x] Design et UX
  - [x] Cartes responsive (mobile, tablet, desktop)
  - [x] Espacement cohérent avec design system
  - [x] Typographie Geist
  - [x] Couleurs : palette Reboul (noir, blanc, gris)
  - [x] Accessibilité : états focus, contrastes suffisants

#### 17.10.2 Flow utilisateur et routing
- [x] Vérifier le flow complet
  - [x] Arrivée sur `/` → Affiche ShopSelectorPage
  - [x] Clic sur Reboul (actif) → Redirection vers `/admin/reboul/login`
  - [x] Clic sur CP Company/Outlet (inactifs) → Aucune action (ou message informatif)
  - [x] Après login réussi → Redirection vers `/admin/reboul/dashboard` (déjà en place)
  
- [x] Routing (App.tsx)
  - [x] Route `/` → ShopSelectorPage (publique)
  - [x] Route `/admin/reboul/login` → LoginPage (ajoutée, publique)
  - [x] Routes protégées `/admin/reboul/*` → Inchangées

#### 17.10.3 Notes importantes
- [x] Pour février 2025, seul Reboul est fonctionnel
- [x] UI préparée pour connexion futurs sites (CP Company, Outlet) dans Phase 20-21
- [x] **Architecture** : Les connexions CP Company et Outlet seront ajoutées dans Phase 20-21
- [x] **Décision** : Pas de sidebar ni dropdown dans navbar (le magasin est sélectionné AVANT le login)
- [x] Un compte admin est associé à un magasin (sauf SUPER_ADMIN qui peut accéder à tous)
- [x] **Déconnexion** : Redirection vers `/` (page de sélection de magasin) au lieu de `/admin/login`
  - [x] Modifié dans AdminLayout (bouton logout)
  - [x] Modifié dans api.ts (erreur 401 - token invalide)
  - [x] Modifié dans ProtectedRoute (accès route protégée sans auth)

### 17.9 Brainstorming & Plan d'Amélioration Reboul & Admin ✅

**🎯 Objectif** : Faire un état des lieux complet, identifier ce qui manque (CRITICAL pour février 2025), et planifier les améliorations avant déploiement production

#### 17.9.1 État des Lieux - Ce qui existe ✅

##### Backend - Modules & Features
- [x] **Entités complètes** : Category, Product, Image, Variant, Cart, CartItem, Order, Shop, Brand, User, Address
- [x] **Modules CRUD** : Categories, Products (avec images/variants), Brands, Shops
- [x] **E-commerce core** : Cart, Orders (avec gestion stock, emails, factures), Checkout (Stripe)
- [x] **Authentification** : JWT, Auth module, User management
- [x] **Upload images** : Local storage (uploads/) + Cloudinary module (prêt)
- [x] **Paiements** : Stripe Checkout intégré (sessions, webhooks, remboursements)
- [x] **Multi-shops** : Architecture Shop entity + filtrage par shopId

##### Frontend Reboul (Client) - Pages & Features
- [x] **Pages principales** : Home, Catalog (filtres catégorie/brand), Product (galerie, variants, stock), Cart, Checkout, Orders
- [x] **Layout** : Header (navigation brands/categories avec mega menu), Footer
- [x] **Animations GSAP** : Système complet (presets, hooks, scroll animations)
- [x] **Design System** : Style A-COLD-WALL* (minimaliste, premium)
- [x] **Panier** : Session-based, gestion quantité, calcul total
- [x] **Authentification** : Login/Register, gestion session utilisateur
- [x] **Responsive** : Mobile-first, breakpoints Tailwind

##### Admin Central - Pages & Features
- [x] **Dashboard** : Vue d'ensemble (à compléter avec stats)
- [x] **Gestion produits** : Liste, création, édition (images, variants, stock)
- [x] **Gestion catégories** : CRUD complet
- [x] **Gestion marques** : CRUD complet (Brands)
- [x] **Gestion commandes** : Liste, détails, changement statut
- [x] **Gestion utilisateurs** : Liste, détails
- [x] **Paramètres shop** : Configuration (infos, politiques livraison/retour, Stripe)
- [x] **Multi-sites UI** : Page sélection magasin (Reboul actif, CP Company/Outlet à venir)
- [x] **Authentification** : Login admin, JWT, rôles (ADMIN, SUPER_ADMIN)

#### 17.9.2 Ce qui manque - CRITICAL pour février 2025 🔴

##### Backend - Must Have
- [ ] **Recherche produits** : Full-text search PostgreSQL (essentiel pour UX)
- [ ] **Gestion promotions** : Système de codes promo/réductions (important pour lancement)
- [ ] **Notifications emails** : Confirmations commande, expédition (actuellement basique)
- [ ] **SEO** : Meta tags, sitemap, structured data (important référencement)
- [ ] **Analytics de base** : Tracking vues produits, ventes (pour comprendre performance)
- [ ] **Gestion stocks avancée** : Alertes stock faible, historique mouvements

##### Frontend Reboul - Must Have
- [ ] **Page Home complète** : Contenu réel, sections hero, featured products, actualités
- [ ] **Recherche produits** : Barre de recherche fonctionnelle (connectée au backend full-text)
- [ ] **Filtres avancés** : Prix, taille, couleur, marque (améliorer Catalog)
- [ ] **Wishlist/Favoris** : Pour améliorer engagement utilisateur
- [ ] **SEO** : Meta tags dynamiques, sitemap, robots.txt, structured data
- [ ] **Page About** : Contenu réel (concept-store, histoire, localisation)
- [ ] **Optimisation images** : Lazy loading, formats modernes (WebP), responsive images
- [ ] **Error pages** : 404, 500 avec design cohérent

##### Admin - Must Have
- [ ] **Dashboard stats** : Ventes, commandes, produits, revenus (graphiques)
- [ ] **Gestion promotions** : Interface création/modification codes promo
- [ ] **Analytics** : Vues produits, conversion, revenus par période
- [ ] **Export données** : Export CSV/Excel des commandes, produits
- [ ] **Logs** : Historique actions admin (audit trail)

#### 17.9.3 Améliorations - Should Have / Nice to Have 🟡

##### Backend - Should Have
- [ ] **Avis produits** : Système notes/commentaires clients
- [ ] **Recommandations** : Produits similaires, "vous pourriez aimer"
- [ ] **Blog/Actualités** : Articles, carrousel Home
- [ ] **Chat support** : Support client en direct (optionnel)
- [ ] **Cache** : Redis pour améliorer performances (produits fréquents)
- [ ] **Webhooks externes** : Intégration avec outils tiers (analytics, CRM)

##### Frontend Reboul - Should Have
- [ ] **Comparaison produits** : Comparer plusieurs produits côte à côte
- [ ] **Produits similaires** : Section "Vous pourriez aimer" sur page produit
- [ ] **Reviews produits** : Affichage avis clients sur page produit
- [ ] **Animations micro-interactions** : Améliorer feedback utilisateur (hover, clicks)
- [ ] **PWA** : Mode offline, installation mobile
- [ ] **Performance** : Code splitting, lazy loading routes, optimisation bundle
- [ ] **Accessibilité (a11y)** : ARIA labels, navigation clavier, contrastes

##### Admin - Should Have
- [ ] **Templates emails** : Éditeur de templates (confirmations, expéditions)
- [ ] **Bulk actions** : Actions en masse (supprimer plusieurs produits, changer statut commandes)
- [ ] **Import produits** : Import CSV/Excel pour ajout en masse
- [ ] **Gestion avis** : Modération avis clients
- [ ] **Rapports avancés** : Analytics détaillés, export PDF

#### 17.9.4 Priorisation & Planification 🎯

##### 🔴 PRIORITÉ 1 - Must Have (Avant février 2025)
**Objectif** : Site Reboul fonctionnel et prêt à vendre

1. **Recherche produits** (Backend + Frontend)
   - Effort : 2-3 jours
   - Impact : CRITICAL (UX essentielle)
   - Backend : Full-text search PostgreSQL
   - Frontend : Barre recherche + résultats

2. **Page Home complète** (Frontend)
   - Effort : 2-3 jours
   - Impact : CRITICAL (première impression)
   - Contenu réel, sections hero, featured products

3. **SEO de base** (Backend + Frontend)
   - Effort : 1-2 jours
   - Impact : HIGH (référencement)
   - Meta tags, sitemap, robots.txt

4. **Dashboard Admin stats** (Admin)
   - Effort : 2 jours
   - Impact : HIGH (suivi activité)
   - Graphiques ventes, commandes, revenus

5. **Filtres avancés Catalog** (Frontend)
   - Effort : 1-2 jours
   - Impact : HIGH (UX améliorée)
   - Prix, taille, couleur, marque

##### 🟡 PRIORITÉ 2 - Should Have (Post-lancement)
**Objectif** : Améliorer l'expérience et les fonctionnalités

1. **Promotions/Codes promo** (Backend + Frontend + Admin)
2. **Wishlist/Favoris** (Backend + Frontend)
3. **Analytics avancé** (Backend + Admin)
4. **Optimisation performance** (Frontend : lazy loading, code splitting)
5. **Avis produits** (Backend + Frontend + Admin)

##### 🟢 PRIORITÉ 3 - Nice to Have (Long terme)
1. **PWA** (Frontend)
2. **Chat support** (Backend + Frontend)
3. **Recommandations produits** (Backend + Frontend)
4. **Comparaison produits** (Frontend)
5. **Blog/Actualités** (Backend + Frontend)

#### 17.9.5 Plan d'Action - Prochaines Étapes 📋

**⚠️ Note** : Les phases mentionnées ci-dessous doivent être vérifiées/créées dans la roadmap. Certaines existent déjà (18, 19, 20, 21) mais avec un contenu différent.

**Phase immédiate (Avant février 2025 - Must Have)** :
1. ✅ Phase 17.10 : Multi-sites UI - FAIT
2. ✅ Phase 17.9 : Brainstorming & Plan - FAIT
3. 🔄 Phase 17.11 : Docker & Déploiement Production Ready
4. 🔄 Phase 17.12 : Tests E2E Critiques
5. 📋 **À créer** : Phase 17.13 : Recherche produits (Backend + Frontend) - Priorité CRITICAL
6. 📋 **À créer** : Phase 17.14 : Page Home complète (Frontend) - Priorité CRITICAL  
7. 📋 **À créer** : Phase 17.15 : SEO de base (Backend + Frontend) - Priorité HIGH
8. 📋 **À créer** : Phase 17.16 : Dashboard Admin stats (Admin) - Priorité HIGH
9. 📋 **À créer** : Phase 17.17 : Filtres avancés Catalog (Frontend) - Priorité HIGH

**Post-lancement (Février-Mars 2025)** :
7. Phase 18 : Promotions/Codes promo - ✅ Existe (18.4)
8. Phase 19 : Wishlist/Favoris - ✅ Existe (18.2)
9. Phase 20 : Analytics avancé - ✅ Existe (20.x)
10. Phase 21 : Optimisations performance - ✅ Existe (21.x)
11. **🆕 Phase 24 : Préparation Collection Réelle** - NOUVELLE PHASE (AS400, images, marques, stocks)

**📋 Phases Must Have à créer** : 
- Phase 17.13 : Recherche produits (Backend + Frontend) - CRITICAL
- Phase 17.14 : Page Home complète (Frontend) - CRITICAL
- Phase 17.15 : SEO de base (Backend + Frontend) - HIGH
- Phase 17.16 : Dashboard Admin stats (Admin) - HIGH
- Phase 17.17 : Filtres avancés Catalog (Frontend) - HIGH

**Note** : Ces phases peuvent être intégrées avant ou après déploiement selon priorités business.

---

## 🐳 Phase 17.11 : Docker & Déploiement Production Ready

**Objectif** : Préparer infrastructure Docker pour déploiement février 2025

### 17.11.1 Docker Compose Production ✅
- [x] Créer `reboulstore/docker-compose.prod.yml` (production Reboul)
- [x] Service PostgreSQL Reboul (avec volumes persistants)
- [x] Service Backend Reboul (NestJS production build)
- [x] Service Frontend Reboul (Vite build + Nginx)
- [x] Créer `admin-central/docker-compose.prod.yml` (production Admin)
- [x] Service Backend Admin (NestJS production build)
- [x] Service Frontend Admin (Vite build + Nginx)
- [x] Nginx reverse proxy (routage /api vers backend)
- [x] Variables d'environnement (.env.production) - Configurées dans docker-compose
- [x] Réseaux Docker partagés (reboulstore-network)
- [x] Créer Dockerfile.prod pour backend Reboul
- [x] Créer Dockerfile.prod pour frontend Reboul
- [x] Créer Dockerfile.prod pour backend Admin
- [x] Créer Dockerfile.prod pour frontend Admin
- [x] Ajouter endpoint /health dans backend Reboul (pour healthcheck)

### 17.11.2 Configuration Nginx ✅
- [x] Créer `nginx.prod.conf` production (Reboul + Admin)
- [x] Routage `reboulstore.com` → Frontend Reboul
- [x] Routage `admin.reboulstore.com` → Admin Centrale
- [x] Routage `/api` → Backend Reboul (reverse proxy)
- [x] Routage `/api` → Backend Admin (reverse proxy)
- [x] SSL/TLS (Let's Encrypt) - Configuration préparée (à activer avec certificats)
- [x] Compression gzip configurée
- [x] Compression brotli préparée (commentée, à activer si module disponible)
- [x] Cache headers assets statiques (30 jours pour images/fonts, no-cache pour HTML)
- [x] Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- [x] Health check endpoints configurés
- [x] Support React Router (try_files pour SPA)
- [x] Guide SSL/TLS créé (nginx/SSL_SETUP.md)

### 17.11.3 Scripts Déploiement ✅
- [x] Script `deploy-reboul.sh` (build + démarrage containers)
- [x] Script `backup-db.sh` (backup PostgreSQL avec compression, garde 30 derniers)
- [x] Script `rollback.sh` (retour version précédente avec backup auto)
- [x] Script `deploy-admin.sh` (déploiement Admin Central)
- [x] Script `deploy-prod.sh` (déploiement complet Reboul Store + Admin Central) ✅
- [x] Documentation déploiement (`DEPLOY_PRODUCTION.md`)
- [x] Scripts rendus exécutables (chmod +x)

**⚠️ RÈGLE CRITIQUE DE BUILD DOCKER** :
- ✅ **Suppression AVANT build** : Toujours supprimer les anciennes images Docker **AVANT** de builder (plus rapide, libère l'espace)
- ✅ **UNIQUEMENT sur le serveur** : Toutes les commandes `docker rmi` sont exécutées via SSH sur le serveur distant
- ❌ **JAMAIS en local** : Les images Docker locales ne sont **JAMAIS** supprimées (rester intactes pour tests locaux)
- ✅ **S'applique à** : Reboul Store (`reboulstore-frontend`, `reboulstore-backend`) ET Admin Central (`admin-central-frontend`, `admin-central-backend`)
- ✅ **Script automatique** : `deploy-prod.sh` applique automatiquement cette règle pour les deux projets

### 17.11.4 Monitoring & Logs ✅
- [x] Configuration logs centralisés
  - [x] Logger NestJS configuré (niveaux selon environnement)
  - [x] Configuration Winston préparée (`backend/src/config/logger.config.ts`)
  - [x] Logs structurés en production (JSON)
  - [x] Logs colorés en développement
- [x] Health check endpoints améliorés
  - [x] `/health` backend Reboul (avec uptime, version, environment)
  - [x] `/health` backend Admin (avec uptime, version, environment)
  - [x] Configuration monitoring (`monitoring.config.ts`)
- [x] Monitoring uptime
  - [x] Script `monitor-uptime.sh` créé (vérification locale)
  - [x] Documentation services externes (UptimeRobot, Pingdom)
  - [x] Guide configuration UptimeRobot
- [x] Sentry (monitoring erreurs - optionnel)
  - [x] Configuration Sentry préparée (`sentry.config.ts`)
  - [x] Documentation installation et configuration
  - [x] Guide dans `backend/MONITORING.md`
- [x] Documentation complète
  - [x] `backend/MONITORING.md` : Guide complet monitoring
  - [x] Instructions Winston (optionnel)
  - [x] Instructions Sentry (optionnel)
  - [x] Instructions UptimeRobot

### 17.11.5 Achat & Configuration Serveur OVH 🆕

**🎯 Objectif** : Acheter et configurer le serveur OVH pour héberger l'application en production

**⏰ Timing** : À faire avant le déploiement final (Phase 23)

#### 17.11.5.1 Achat Serveur OVH ✅
- [x] Choisir le type de serveur : **VPS-3 (VPS 2026)**
- [x] Sélectionner les caractéristiques :
  - [x] CPU : **8 vCores**
  - [x] RAM : **24 GB**
  - [x] Stockage : **200 GB SSD NVMe**
  - [x] Bande passante : **1,5 Gbit/s (illimitée)**
- [x] Choisir la localisation : **France (Gravelines)**
- [x] OS : **Ubuntu 22.04 LTS**
- [x] Commander le serveur OVH ✅
- [x] Noter les informations d'accès :
  - [x] IP : **152.228.218.35**
  - [x] Utilisateur : **ubuntu** (puis **deploy** créé)
  - [x] Connexion SSH avec clés configurée ✅

#### 17.11.5.2 Configuration Initiale Serveur ✅
- [x] Accéder au serveur (SSH avec clés) ✅
- [x] Mettre à jour le système (apt update && apt upgrade) ✅
- [x] Installer Docker et Docker Compose ✅
  - [x] Docker version 29.1.3 installé
  - [x] Docker Compose version v5.0.0 installé
  - [x] Docker démarré au boot
- [x] Configurer le firewall (UFW) ✅
  - [x] Port 22 (SSH) ouvert ✅
  - [x] Port 80 (HTTP) ouvert ✅
  - [x] Port 443 (HTTPS) ouvert ✅
  - [x] Autres ports bloqués ✅
- [x] Créer un utilisateur non-root pour Docker ✅
  - [x] Utilisateur `deploy` créé
  - [x] Ajouté au groupe docker
  - [x] Ajouté au groupe sudo (sans mot de passe)
- [x] Configurer SSH avec clés ✅
  - [x] Clé SSH copiée vers utilisateur `deploy`
  - [x] PasswordAuthentication désactivé
  - [x] PubkeyAuthentication activé
  - [x] Connexion SSH fonctionnelle avec `deploy` ✅
- [x] Installer Fail2ban (protection bruteforce) ✅

#### 17.11.5.3 Configuration DNS ⏳

**📋 Stratégie DNS** :
- ✅ **Phase 1 (Maintenant)** : Option 1 - Garder domaine sur Vercel, pointer DNS vers serveur OVH
- 🔄 **Phase 2 (Mois prochain)** : Option 2 - Transférer domaine de Vercel vers OVH (centralisation)

**Configuration DNS Phase 1 (Vercel → OVH)** :
- [x] Se connecter à Vercel (domaine reboulstore.com) ✅
- [x] Retirer domaine du projet Vercel ✅
- [x] Supprimer zone DNS Vercel ✅
- [x] Recréer les enregistrements DNS A ✅
  - [x] A record : reboulstore → 152.228.218.35 ✅
  - [x] A record : www → 152.228.218.35 ✅
  - [x] A record : admin → 152.228.218.35 ✅
- [x] Vérification propagation DNS ✅
  - [x] ✅ `www.reboulstore.com` → `152.228.218.35` (fonctionne)
  - [x] ✅ `admin.reboulstore.com` → `152.228.218.35` (fonctionne)
  - [x] ⚠️ `reboulstore.com` → encore bloqué par ALIAS Vercel (non supprimables)

**📝 Notes** :
- Domaine actuellement hébergé sur Vercel (ancienne architecture)
- **www.reboulstore.com** et **admin.reboulstore.com** pointent correctement vers serveur OVH (152.228.218.35) ✅
- **reboulstore.com** (domaine principal) reste bloqué par les ALIAS automatiques Vercel (non supprimables)
- **Solution** : Transfert domaine vers OVH le mois prochain (Phase 17.11.5.5) résoudra ce problème
- Pour l'instant, www et admin suffisent pour continuer le développement

#### 17.11.5.4 Vérification Builds Locaux (Avant Déploiement) ✅

**🎯 Objectif** : S'assurer que les builds frontend et backend fonctionnent sans erreur avant de déployer sur le serveur

**Processus** :
- [x] Vérifier build Backend (Reboul Store) ✅
  - [x] `cd backend && npm run build` ✅
  - [x] Vérifier qu'il n'y a aucune erreur TypeScript ✅
  - [x] Vérifier qu'il n'y a aucune erreur de compilation ✅
  - [x] Noter les warnings (si critiques) ✅ (0 warnings)
- [x] Vérifier build Frontend (Reboul Store) ✅
  - [x] `cd frontend && npm run build` ✅
  - [x] Vérifier qu'il n'y a aucune erreur TypeScript ✅
  - [x] Vérifier qu'il n'y a aucune erreur de compilation ✅
  - [x] Noter les warnings (si critiques) ✅ (1 warning non critique)
- [x] Vérifier build Backend Admin Central ✅
  - [x] `cd admin-central/backend && npm run build` ✅
  - [x] Vérifier qu'il n'y a aucune erreur TypeScript ✅
  - [x] Vérifier qu'il n'y a aucune erreur de compilation ✅
  - [x] Noter les warnings ✅ (0 warnings)
- [x] Vérifier build Frontend Admin Central ✅
  - [x] `cd admin-central/frontend && npm run build` ✅
  - [x] Vérifier qu'il n'y a aucune erreur TypeScript ✅
  - [x] Vérifier qu'il n'y a aucune erreur de compilation ✅
  - [x] Noter les warnings ✅ (1 warning non critique)
- [x] Utiliser CLI pour analyser et corriger les builds ✅
  - [x] `python cli/main.py build verify` ✅ (⭐ RECOMMANDÉ : analyse, corrige et vérifie automatiquement)
  - [x] 11 corrections automatiques appliquées ✅
  - [x] 63 erreurs → 0 erreur ✅
  - [x] Vérifier que tous les builds passent sans erreurs ✅

**📝 Commandes CLI disponibles** :
- `python cli/main.py build verify` : ⭐ Workflow automatique (analyse → corrige → vérifie en boucle)
- `python cli/main.py build analyze` : Analyser tous les builds
- `python cli/main.py build fix` : Corriger automatiquement les erreurs détectables
- `python cli/main.py analyze code` : Analyser le code pour cohérence
- `python cli/main.py analyze dependencies` : Vérifier les dépendances

**✅ Résultats** :
- ✅ **Backend Reboul Store** : Build réussi, 0 erreur, 0 warning
- ✅ **Frontend Reboul Store** : Build réussi, 0 erreur, 1 warning (non critique)
- ✅ **Backend Admin Central** : Build réussi, 0 erreur, 0 warning
- ✅ **Frontend Admin Central** : Build réussi, 0 erreur, 1 warning (non critique)
- ✅ **Total** : 63 erreurs corrigées (11 automatiques + 52 manuelles)
- ✅ **Patterns documentés** : 9 patterns de correction documentés dans `.cursor/commands/build-check-workflow.md`

**📝 Notes** :
- ⚠️ **Important** : Ne pas déployer si des erreurs de build existent
- ✅ Tous les builds passent sans erreurs (2 warnings acceptables)
- ✅ Workflow CLI automatisé fonctionnel pour futures vérifications
- ✅ Patterns de correction documentés pour maintenance future

#### 17.11.5.5 Préparation Déploiement ✅

**✅ Complété** :
- [x] Cloner le repository sur le serveur ✅
  - [x] Repository cloné dans `/opt/reboulstore` ✅
  - [x] Clé SSH générée et ajoutée à GitHub ✅
- [x] Générer les secrets (JWT_SECRET, DB_PASSWORD, etc.) ✅
  - [x] JWT_SECRET Reboul Store : généré (stocké dans `.env.production`) ✅
  - [x] JWT_SECRET Admin Central : généré (stocké dans `.env.production`) ✅
  - [x] DB_PASSWORD : généré (stocké dans `.env.production`) ✅
- [x] Créer les fichiers `.env.production` (Reboul + Admin) ✅
  - [x] `.env.production` créé pour Reboul Store ✅
  - [x] `.env.production` créé pour Admin Central ✅
  - [x] Secrets JWT et DB configurés ✅
  - [x] URLs configurées (`www.reboulstore.com` et `admin.reboulstore.com`) ✅
  - [x] NODE_ENV=production configuré ✅
  - [x] Clés Stripe configurées ✅
    - [x] STRIPE_SECRET_KEY : `sk_live_...` (clé de production LIVE) ✅
    - [x] STRIPE_WEBHOOK_SECRET : `whsec_...` (secret webhook production LIVE) ✅
  - [x] Clés Cloudinary configurées ✅
    - [x] CLOUDINARY_CLOUD_NAME : `dxen69pdo` ✅
    - [x] CLOUDINARY_API_KEY : `699182784731453` ✅
    - [x] CLOUDINARY_API_SECRET : configuré ✅
- [x] Vérifier que les ports sont disponibles (80, 443) ✅
  - [x] Ports 80 et 443 libres ✅
- [x] Tester la connexion SSH depuis la machine locale ✅
- [x] Préparer les scripts de déploiement sur le serveur ✅
  - [x] Scripts rendus exécutables ✅
  - [x] Docker Compose disponible (v5.0.0) ✅

**📝 Notes** :
- ✅ **Toutes les clés sont configurées** : Stripe (LIVE) et Cloudinary
- Repository accessible via SSH : `git@github.com:armedbased111-rgb/reboulstore.git`
- Tous les fichiers sont en place et prêts pour le déploiement
- Webhook Stripe configuré : `https://www.reboulstore.com/api/checkout/webhook`
- Secrets stockés localement dans `.secrets.production.local` (non commité)
- Documentation : `docs/STRIPE_LIVE_KEY.md`, `docs/STRIPE_WEBHOOK_SETUP.md`

#### 17.11.5.6 Transfert Domaine Vercel → OVH (Mois Prochain) 🔄

**📋 Objectif** : Transférer complètement reboulstore.com de Vercel vers OVH pour centraliser (serveur + domaine)

**⏰ Timing** : Mois prochain (pour ne pas oublier et centraliser tout chez OVH)

**Étapes prévues** :
- [ ] Vérifier code d'autorisation de transfert (Vercel)
- [ ] Initier transfert depuis OVH
- [ ] Valider le transfert (peut prendre 5-7 jours)
- [ ] Vérifier que les DNS sont bien configurés après transfert
- [ ] Documenter le processus complet

**📝 Notes** :
- Transfert optionnel mais recommandé pour centralisation
- Pas urgent (DNS fonctionnent déjà avec Vercel)
- Budget : ~10-15€ (frais de transfert domaine)

#### 17.11.5.6 Documentation ✅
- [x] Guide de configuration serveur OVH créé (`docs/OVH_SERVER_SETUP.md`)
  - [x] Analyse complète de l'architecture
  - [x] Calcul des besoins en ressources (CPU, RAM, stockage, bande passante)
  - [x] Recommandations serveur (VPS-3 choisi)
  - [x] Guide d'achat OVH
  - [x] Configuration initiale complète
  - [x] Configuration DNS
  - [x] Préparation déploiement
  - [x] Checklist complète
- [x] Serveur configuré et opérationnel ✅
  - [x] IP serveur : **152.228.218.35**
  - [x] Utilisateur : **deploy** (SSH avec clés)
  - [x] Docker fonctionnel
  - [x] Firewall configuré
  - [x] SSH sécurisé

**✅ État actuel** :
- ✅ Serveur OVH acheté (VPS-3, 8 vCores / 24 GB RAM / 200 GB SSD)
- ✅ Configuration initiale complétée (Docker, firewall, SSH sécurisé, Fail2ban)
- ✅ Serveur opérationnel et accessible
- ✅ Configuration DNS Phase 1 complétée :
  - ✅ `www.reboulstore.com` → `152.228.218.35` (fonctionne)
  - ✅ `admin.reboulstore.com` → `152.228.218.35` (fonctionne)
  - ⚠️ `reboulstore.com` → bloqué par ALIAS Vercel (sera résolu lors du transfert)
- ✅ Vérification builds locaux complétée (Phase 17.11.5.4) - Tous les builds passent sans erreurs ✅
- ✅ Préparation déploiement complétée (Phase 17.11.5.5) - Repository cloné, secrets configurés, clés Stripe/Cloudinary ajoutées ✅

**📝 Notes importantes** :
- ⚠️ Ne jamais commiter les credentials serveur dans Git
- 🔐 Clés SSH uniquement pour connexion (password auth désactivé)
- 📋 Informations serveur documentées dans `docs/OVH_SERVER_SETUP.md` section 14
- 🔄 Le serveur est prêt pour Phase 23 (Déploiement & Production) après DNS configuré

---

## 🧪 Phase 17.12 : Tests E2E Critiques (Avant Février)

**Objectif** : Tests bout en bout pour valider parcours utilisateur

### 17.12.1 Setup Tests E2E
- [ ] Installer Playwright (ou Cypress)
- [ ] Configuration tests (`playwright.config.ts`)
- [ ] Base de données de test (séparée)
- [ ] Script `npm run test:e2e`

### 17.12.2 Tests Parcours Client
- [ ] Test : Parcours complet achat
  1. Arriver sur homepage
  2. Cliquer catégorie enfants
  3. Filtrer par marque
  4. Cliquer produit
  5. Sélectionner variant (taille)
  6. Ajouter au panier
  7. Aller au panier
  8. Modifier quantité
  9. Procéder au checkout
  10. Créer compte / Login
  11. Ajouter adresse livraison
  12. Payer (Stripe test mode)
  13. Vérifier confirmation commande
- [ ] Test : Inscription + Login + Profil
- [ ] Test : Réinitialisation mot de passe
- [ ] Test : Navigation (header, footer, mega menu)

### 17.12.3 Tests Parcours Admin
- [ ] Test : Login admin
- [ ] Test : Créer produit complet (avec variants + images)
- [ ] Test : Modifier produit existant
- [ ] Test : Changer statut commande (paid → shipped → delivered)
- [ ] Test : Ajouter tracking number
- [ ] Test : Créer catégorie + marque
- [ ] Test : Dashboard (vérifier chargement statistiques)

### 17.12.4 Tests Critiques Paiement
- [ ] Test : Paiement réussi (carte test Stripe)
- [ ] Test : Paiement échoué (carte test refusée)
- [ ] Test : Webhook Stripe (payment_intent.succeeded)
- [ ] Test : Remboursement commande depuis admin
- [ ] Test : Stock décrémenté après paiement
- [ ] Test : Stock ré-incrémenté après remboursement

### 17.12.5 CI/CD Tests
- [ ] GitHub Actions : Run tests E2E sur push
- [ ] Workflow : lint → test:unit → test:e2e → build
- [ ] Badge statut tests dans README.md

---

## 🔄 Phase 18 : Backend - Fonctionnalités Avancées (POST-FÉVRIER)

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

### 18.8 Notifications Rupture de Stock (Backend)
**📝 Note** : Version MVP actuelle utilise localStorage. Cette phase migre vers backend pour notifications réelles.

**💻 Phase Implémentation Backend** :
- [ ] Créer entité StockNotification (productId, variantId nullable, email, phone nullable, createdAt, notifiedAt nullable)
- [ ] Endpoint POST /products/:id/notify-stock (s'inscrire aux notifications)
- [ ] Endpoint GET /products/:id/notify-stock (vérifier si déjà inscrit)
- [ ] Service StockNotification : subscribe(), checkSubscription(), notifyAll()
- [ ] Job cron : Vérifier stock quotidiennement, envoyer emails si stock > 0
- [ ] Template email : "Votre produit est de nouveau disponible"
- [ ] Migration données localStorage → Backend (script de migration)
- [ ] Frontend : Remplacer localStorage par appels API

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

## 🖥️ Phase 25 : Upgrade/Migration Serveur OVH (OPTIONNEL)

**🎯 Objectif** : Upgrade ou migration vers un serveur plus puissant si nécessaire

**⏰ Timing** : Seulement si besoin de ressources supplémentaires (pas nécessaire pour CP Company/Outlet)

**📋 Contexte** :
- ✅ VPS-3 actuel (8 vCores / 24 GB RAM / 200 GB SSD) supporte déjà l'architecture complète
- ✅ Pas de migration nécessaire pour ajouter CP Company ou Outlet
- ⚠️ Cette phase devient nécessaire uniquement si :
  - Upgrade vers VPS supérieur nécessaire (VPS-4, VPS-5, VPS-6)
  - Besoin de ressources supplémentaires (CPU, RAM, stockage)
  - Migration vers Serveur Dédié pour performance garantie

**📋 Prérequis** (si migration nécessaire) :
- Serveur VPS-3 actuel en production (8 vCores / 24 GB RAM / 200 GB SSD)
- Serveur actuel fonctionne correctement mais ressources insuffisantes
- Décision prise d'upgrade/migration

### 25.1 Analyse & Planification Migration

- [ ] **Évaluer besoins nouveaux serveur** :
  - [ ] Calculer ressources nécessaires (3 sites + admin = 15 containers)
  - [ ] Choisir nouveau serveur (VPS Scalable 8+ cores / 16+ GB ou Dédié)
  - [ ] Estimer coût nouveau serveur
  - [ ] Estimer temps migration (1-2h prévu)

- [ ] **Planifier migration** :
  - [ ] Choisir fenêtre de maintenance (hors heures de pointe)
  - [ ] Prévoir backup complet avant migration
  - [ ] Préparer checklist migration
  - [ ] Notifier équipe/maintenance window

### 25.2 Achat & Configuration Nouveau Serveur

- [ ] **Acheter nouveau serveur OVH** :
  - [ ] Choisir VPS Scalable (8+ cores / 16+ GB RAM / 100+ GB SSD) ou Dédié
  - [ ] Commander nouveau serveur
  - [ ] Noter informations accès (IP, credentials)

- [ ] **Configuration nouveau serveur** :
  - [ ] Suivre guide `docs/OVH_SERVER_SETUP.md` (sections 5-7)
  - [ ] Installer Docker, configurer firewall
  - [ ] Créer utilisateur deploy
  - [ ] Configurer DNS pour nouveau serveur (si changement IP)

### 25.3 Migration Données & Application

- [ ] **Backup complet serveur actuel** :
  - [ ] Backup base de données PostgreSQL (script `backup-db.sh`)
  - [ ] Backup fichiers `.env.production`
  - [ ] Backup certificats SSL (si applicable)
  - [ ] Vérifier intégrité backups

- [ ] **Déploiement sur nouveau serveur** :
  - [ ] Cloner repository sur nouveau serveur
  - [ ] Copier fichiers `.env.production` (avec modifications si besoin)
  - [ ] Restaurer backup base de données
  - [ ] Déployer application (scripts `deploy-reboul.sh`, `deploy-admin.sh`)
  - [ ] Vérifier fonctionnement (health checks, endpoints)

- [ ] **Configuration DNS** :
  - [ ] Si changement IP : mettre à jour enregistrements DNS
  - [ ] Vérifier propagation DNS (24-48h)
  - [ ] Tester accès nouveaux domaines

### 25.4 Tests & Validation

- [ ] **Tests fonctionnels** :
  - [ ] Tester site Reboul (frontend + backend)
  - [ ] Tester Admin Central (frontend + backend)
  - [ ] Tester paiements Stripe
  - [ ] Tester upload images Cloudinary
  - [ ] Vérifier performances (CPU, RAM, disque)

- [ ] **Tests monitoring** :
  - [ ] Vérifier health checks (`/health`)
  - [ ] Vérifier logs (Docker logs, monitoring)
  - [ ] Vérifier backups automatiques fonctionnent
  - [ ] Vérifier UptimeRobot (monitoring uptime)

### 25.5 Bascule & Cleanup

- [ ] **Bascule DNS** :
  - [ ] Mettre à jour enregistrements DNS vers nouveau serveur
  - [ ] Attendre propagation (24-48h)
  - [ ] Vérifier trafic arrive sur nouveau serveur

- [ ] **Arrêt ancien serveur** :
  - [ ] Arrêter containers Docker sur ancien serveur
  - [ ] Garder ancien serveur actif 1 semaine (sécurité)
  - [ ] Annuler/resilier ancien serveur OVH après validation

- [ ] **Documentation** :
  - [ ] Mettre à jour `docs/OVH_SERVER_SETUP.md` avec nouvelles informations
  - [ ] Mettre à jour documentation déploiement
  - [ ] Noter nouvelles informations serveur (IP, accès, etc.)

**📝 Notes importantes** :
- ⚠️ Migration nécessite maintenance window (1-2h downtime possible)
- 🔐 Garder ancien serveur actif 1 semaine après migration (sécurité)
- 💾 Backups complets avant migration obligatoires
- 📋 Checklist complète dans `docs/OVH_SERVER_SETUP.md` section migration

**💰 Coût estimé nouveau serveur** :
- VPS Scalable (8 cores / 16 GB / 100 GB SSD) : ~60-80€/mois
- Serveur Dédié (8 cores / 16 GB / 2x 250 GB SSD) : ~80-120€/mois

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

## 🌍 Phase 23 : Déploiement & Production ✅

**Objectif** : Mettre en production sur le serveur OVH

**Status** : ✅ **COMPLÈTE** - Déploiement opérationnel et production-ready

**📋 Prérequis** :
- ✅ Phase 17.11.5 (Achat & Configuration Serveur OVH) - Configuration initiale complétée
- ✅ Phase 17.11.5.3 (Configuration DNS) - Complétée ✅
- ✅ Phase 17.11.5.4 (Vérification Builds Locaux) - Complétée ✅
- ✅ Phase 17.11.5.5 (Préparation Déploiement) - Complétée ✅
  - Repository cloné, secrets générés, clés Stripe (LIVE) et Cloudinary configurées

**Prérequis** : Phase 17.11.5 (Achat & Configuration Serveur OVH) doit être complétée

### 23.1 Infrastructure
- [x] Choisir hébergeur : **OVH** (Phase 17.11.5)
- [x] Setup serveur : Configuration OVH (Phase 17.11.5)
- [x] Déployer application Reboul Store sur serveur OVH ✅
  - [x] Frontend accessible sur www.reboulstore.com ✅
  - [x] Backend healthcheck fonctionne ✅
  - [x] PostgreSQL healthy ✅
  - [x] Routes API (/api/*) : ✅ **FONCTIONNENT** (migrations exécutées - tables créées)
- [x] Déployer application Admin Central sur serveur OVH ✅
  - [x] Containers Admin Central déployés ✅
  - [x] Configuration nginx pour admin.reboulstore.com ✅
  - [x] Frontend accessible sur admin.reboulstore.com ✅
- [x] Certificat SSL (Let's Encrypt) ✅ **ACTIVÉ** (Certificats générés pour www et admin, HTTPS fonctionnel, renouvellement auto configuré)
- [x] Domain DNS (reboulstore.com) ✅ **ACTIVÉ** (Cloudflare actif : nameservers propagés, CDN opérationnel)

### 23.2 Backend Prod (Reboul Store)
- [x] Variables d'environnement sécurisées ✅
- [x] Docker containers UP et healthy ✅
- [x] Routes API fonctionnelles ✅ (migrations exécutées)
- [x] Migrations TypeORM créées et exécutées ✅ (toutes les tables créées en production)
- [x] Database backups automatiques (daily) ✅ (cron job configuré - backup quotidien à 2h)
- [x] Logs centralisés ✅ (Docker logging driver json-file avec rotation - 10MB max, 3 fichiers)

### 23.3 Frontend Prod (Reboul Store)
- [x] Build optimisé (Vite build) ✅
- [x] Frontend accessible et servi correctement ✅
- [x] CDN pour assets (Cloudflare) ✅ **CONFIGURÉ** (Cloudflare activé : SSL/TLS, Speed, Caching, WAF - propagation DNS en cours)
- [x] Cache navigateur (headers) ✅ (Headers configurés : assets 1y immutable, HTML no-cache, API no-cache)

### 23.4 Backend Prod (Admin Central) ✅
- [x] Déployer containers Admin Central ✅
- [x] Variables d'environnement sécurisées ✅
- [x] Backend Admin accessible sur admin.reboulstore.com/api ✅
- [x] Database backups automatiques (daily) ✅ (Utilise la même DB que Reboul Store - backups déjà configurés en Phase 23.2)

### 23.5 Frontend Prod (Admin Central) ✅
- [x] Build optimisé (Vite build) ✅
- [x] Frontend accessible sur admin.reboulstore.com ✅
- [x] CDN pour assets (Cloudflare) ✅ **ACTIVÉ** (Même configuration que Reboul Store - Cloudflare opérationnel)
- [x] Cache navigateur (headers) ✅ (Headers configurés : assets 1y immutable, HTML no-cache, API no-cache)
- [x] Monitoring (Google Analytics 4) ✅ **ACTIVÉ** (GA4 configuré : Measurement ID G-S8LMN95862, tracking actif, CLI realtime opérationnel)

### 23.4 Sécurité Prod ✅
- [x] Firewall (Cloudflare WAF) ✅ **ACTIVÉ** (Cloudflare WAF configuré et activé - protection DDoS active)
- [x] Rate limiting strict ✅ **ACTIVÉ** (Zones configurées dans nginx.prod.conf : 10 req/s API, 5 req/s Auth)
- [x] HTTPS obligatoire ✅ **ACTIVÉ** (Certificats Let's Encrypt générés et configurés, redirection HTTP → HTTPS active)
- [x] Headers sécurité (Helmet.js) ✅ (Headers configurés dans nginx - Helmet.js optionnel documenté)
- [x] Audit dépendances (npm audit, Snyk) ✅ (Script security-audit.sh créé - Documentation complète)

---

## 🔧 Phase 23.5 : Améliorations & Finalisations Avant Collection Réelle

**🎯 Objectif** : Finaliser les détails techniques, améliorer les workflows et compléter les fonctionnalités manquantes avant l'intégration de la collection réelle

**📅 Timing** : Après Phase 23 (Production), avant Phase 24 (Collection Réelle)

**⏱️ Durée estimée** : 1-2 semaines

### 23.5.1 Migration GSAP → AnimeJS (Pédagogique)

**Objectif** : Migrer de GSAP vers AnimeJS pour simplifier les animations et apprendre AnimeJS (approche pédagogique)

- [x] **Analyse structure actuelle GSAP** ✅
  - [x] Lister toutes les animations GSAP utilisées (presets, composants)
  - [x] Documenter les fonctionnalités GSAP utilisées (timeline, stagger, scroll triggers, etc.)
  - [x] Identifier les équivalents AnimeJS pour chaque fonctionnalité
  - [x] Créer document d'analyse : `docs/animations/GSAP_TO_ANIMEJS_ANALYSIS.md`

- [x] **Installation & Configuration AnimeJS** ✅
  - [x] Installer AnimeJS (`npm install animejs`)
  - [x] Installer types TypeScript (`npm install --save-dev @types/animejs`)
  - [x] Créer structure animations AnimeJS (même structure que GSAP)

- [x] **Création guide pédagogique AnimeJS** ✅
  - [x] Créer `docs/animations/ANIMEJS_GUIDE.md` (guide complet AnimeJS)
  - [x] Expliquer concepts AnimeJS (animations, timelines, easings, etc.)
  - [x] Comparer GSAP vs AnimeJS (avantages/inconvénients)
  - [x] Exemples pratiques avec code commenté
  - [x] Bonnes pratiques AnimeJS

- [x] **Migration animations presets** ✅
  - [x] Migrer `fade-in.ts` (GSAP → AnimeJS)
  - [x] Migrer `slide-up.ts` (GSAP → AnimeJS)
  - [x] Migrer `slide-down.ts` (GSAP → AnimeJS)
  - [x] Migrer `stagger-fade-in.ts` (GSAP → AnimeJS)
  - [x] Migrer `scale-hover.ts` (GSAP → AnimeJS)
  - [x] Migrer `reveal-up.ts` (GSAP → AnimeJS)
  - [x] Migrer `fade-scale.ts` (GSAP → AnimeJS)
  - [x] Adapter `constants.ts` pour AnimeJS (durées, easings, mapping GSAP→AnimeJS, helpers conversion)

- [x] **Migration utils & helpers** ✅
  - [x] Migrer `gsap-helpers.ts` → `animejs-helpers.ts`
  - [x] Créer hook `useAnimeJS` (équivalent `useGSAP`)
  - [x] Adapter `useScrollAnimation.ts` pour AnimeJS ✅ (Déjà compatible, exemples mis à jour)

- [x] **Migration composants utilisant GSAP** ✅
  - [x] Migrer `Header.tsx` (animations mega menu, badge panier, etc.)
  - [x] Migrer `TopBarLoader.tsx` (timeline avec repeat/yoyo)
  - [x] Migrer `PageLoader.tsx` (timeline complexe avec animation d'objet)
  - [x] Migrer `Product.tsx` (timeline orchestrée)
  - [x] Migrer `Catalog.tsx` (timeline orchestrée)
  - [x] Créer presets supplémentaires (`fade-out.ts`, `scale-pulse.ts`)
  - [x] Build réussi (TypeScript compile sans erreurs) ✅
  - [ ] Tester toutes les animations après migration (guide créé : `docs/animations/TESTING_ANIMEJS.md`)

- [x] **Mise à jour documentation & workflows** :
  - [x] Mettre à jour `ANIMATIONS_GUIDE.md` (remplacer GSAP par AnimeJS)
  - [x] Mettre à jour commande Cursor `/animation-workflow` (AnimeJS au lieu de GSAP)
  - [x] Mettre à jour CLI Python (génération animations AnimeJS)
  - [x] Mettre à jour `project-rules.mdc` (section animations AnimeJS)
  - [x] Mettre à jour `FRONTEND.md` (stack technique AnimeJS)

- [x] **Nettoyage GSAP** :
  - [x] Désinstaller GSAP (`npm uninstall gsap`) ✅ Fait précédemment
  - [x] Supprimer imports GSAP restants ✅ Aucun import actif restant
  - [x] Vérifier qu'aucune référence GSAP ne reste ✅ Seulement dans commentaires/docs (mapping de référence)

- [ ] **Tests & validation** :
  - [ ] Tester toutes les animations sur desktop
  - [ ] Tester toutes les animations sur mobile
  - [ ] Vérifier performance (60fps)
  - [ ] Vérifier accessibilité (prefers-reduced-motion)

### 23.5.2 Navbar Mobile - Menu Hamburger

**Objectif** : Implémenter le menu hamburger mobile complet inspiré de A-COLD-WALL*

- [x] **Analyse menu hamburger A-COLD-WALL*** :
  - [x] Analyser le menu mobile sur le site A-COLD-WALL* ✅ Document créé : `docs/design/MOBILE_MENU_ANALYSIS.md`
  - [x] Documenter structure HTML/CSS ✅ Structure complète documentée
  - [x] Documenter animations et interactions ✅ Animations AnimeJS documentées
  - [x] Documenter navigation (liens, catégories, etc.) ✅ Navigation avec accordéons documentée

- [x] **Implémentation menu hamburger** :
  - [x] Créer état `isMobileMenuOpen` dans `Header.tsx` ✅
  - [x] Implémenter toggle menu au clic sur bouton hamburger ✅
  - [x] Créer section menu mobile dans `Header.tsx` ✅
  - [x] Structure menu : Logo, Navigation (Catalogue, Brands, SALE, etc.), Compte, Panier ✅
  - [x] Style minimaliste A-COLD-WALL* (fond blanc, texte noir, uppercase) ✅

- [x] **Navigation mobile** :
  - [x] Intégrer liens navigation (Catalogue, Brands, SALE, THE CORNER, C.P. COMPANY) ✅
  - [x] Intégrer accordéons catégories et brands (expand/collapse) ✅
  - [x] Intégrer lien compte/connexion ✅
  - [x] Intégrer badge panier avec compteur ✅
  - [ ] Intégrer recherche mobile (optionnel, peut être ajouté plus tard)

- [x] **Animations menu mobile** :
  - [x] Animation ouverture/fermeture menu (slide depuis droite) ✅
  - [x] Animation overlay (fade + blur) ✅
  - [x] Animation bouton hamburger → X (rotation) ✅
  - [x] Animation accordéons (slide-down avec fade) ✅
  - [ ] Animation items menu (stagger fade-in) - Optionnel pour amélioration future

- [x] **Responsive & UX** :
  - [x] Menu visible uniquement sur mobile (< md breakpoint) ✅
  - [x] Fermeture menu au clic sur overlay ✅
  - [x] Fermeture menu au clic sur lien ✅
  - [x] Fermeture menu avec Escape ✅
  - [x] Scroll lock quand menu ouvert (body scroll disabled) ✅

- [ ] **Tests** :
  - [ ] Tester sur différents devices (iPhone, Android, tablette)
  - [ ] Tester toutes les interactions (ouverture, fermeture, navigation)
  - [ ] Tester animations (fluidité, performance)
  - [ ] Vérifier accessibilité (keyboard navigation, ARIA)

### 23.5.2 Connexion Base de Données Production en Développement ✅

**Objectif** : Permettre de connecter l'environnement de développement local à la base de données de production via un tunnel SSH sécurisé.

**✅ Complété** :
- [x] Script `scripts/db-tunnel.sh` pour gérer le tunnel SSH (start, stop, status, restart)
- [x] Script `scripts/db-proxy-server.sh` pour proxy socat sur serveur (expose PostgreSQL sur localhost)
- [x] Fichier `.env.local.example` avec configuration de base
- [x] Modification `docker-compose.yml` pour supporter connexion DB distante
- [x] Support `host.docker.internal` pour accéder au tunnel depuis les containers
- [x] Documentation complète (`docs/DEV_DATABASE_TUNNEL.md`)
- [x] Scripts rendus exécutables et testés
- [x] Proxy socat configuré et fonctionnel sur le serveur

**Configuration** :
- Tunnel SSH : Port local 5433 → Port distant 5432 sur le serveur VPS
- Sécurité : Connexion chiffrée via SSH (pas d'exposition directe PostgreSQL)
- Basculement : Facilement basculer entre DB locale et DB distante via `.env.local`

**Usage** :
```bash
# 1. Démarrer le proxy PostgreSQL sur le serveur (une seule fois)
./scripts/db-proxy-server.sh start

# 2. Démarrer le tunnel SSH
./scripts/db-tunnel.sh start

# 3. Charger variables d'environnement et démarrer services
set -a
source .env.local
set +a
docker compose up backend frontend
```

**Documentation** : Voir `docs/DEV_DATABASE_TUNNEL.md` pour guide complet

---

### 23.5.3 Amélioration Scripts Build & Deploy

**Objectif** : Améliorer les scripts de build et déploiement pour séparer vérification et déploiement

- [ ] **Analyse scripts actuels** :
  - [ ] Analyser `scripts/deploy-reboul.sh` (fonctionnalités actuelles)
  - [ ] Identifier ce qui manque (vérification build, tests, etc.)
  - [ ] Documenter workflow actuel

- [ ] **Création script vérification build** :
  - [x] Créer `scripts/check-build.sh` :
    - [x] Vérifier que tous les fichiers nécessaires existent (.env.production, etc.)
    - [x] Lancer build frontend (`npm run build` dans frontend/)
    - [x] Lancer build backend (si nécessaire)
    - [x] Vérifier erreurs de build (TypeScript, ESLint, etc.)
    - [x] Vérifier taille bundle (avertir si trop gros)
    - [x] Vérifier dépendances (npm audit)
    - [x] Afficher rapport détaillé (succès/erreurs)
  - [x] **Correction build production (29/12/2024)** : Configuration variables d'environnement Vite pour utiliser `/api` au lieu de `localhost:3001`
    - [x] Modifier `frontend/Dockerfile.prod` : Ajouter `ARG` et `ENV` pour `VITE_API_URL` et `VITE_API_BASE_URL`
    - [x] Modifier `docker-compose.prod.yml` : Passer variables via `build.args` (pas `environment`)
    - [x] Vérifier que tous les fichiers frontend utilisent les variables d'environnement correctement (`api.ts`, `orders.ts`, `auth.ts`, `imageUtils.ts`)
    - [x] Rebuild complet et déploiement réussi (0 occurrence de `localhost:3001` dans le build)
    - [x] Documenter dans `DEPLOY_PRODUCTION.md` (section Troubleshooting)

- [x] **Script déploiement serveur prod** :
  - [x] Créer `scripts/deploy-prod.sh` ✅
    - [x] Vérification build (appel `check-build.sh`) ✅
    - [x] Upload fichiers sur serveur (rsync) ✅
    - [x] Backup base de données avant déploiement ✅
    - [x] Redémarrage services Docker sur serveur ✅
    - [x] Vérification healthcheck après déploiement ✅
    - [x] Option `--skip-check` (déploiement sans vérification) ✅
    - [ ] Rollback automatique si échec (à prévoir si nécessaire)
    - [ ] Notification (email, Slack, etc.) - optionnel
  - [x] Messages améliorés (couleurs, emojis, détails) ✅
  - [x] Gestion erreurs améliorée ✅

- [x] **Documentation** :
  - [x] Documenter `scripts/check-build.sh` (usage, options) ✅ (dans `deploy-prod.sh` et `DEPLOY_PRODUCTION.md`)
  - [x] Documenter `scripts/deploy-prod.sh` (usage, configuration serveur) ✅ (`DEPLOY_PRODUCTION.md`)
  - [x] Guide workflow déploiement (`DEPLOY_PRODUCTION.md`) ✅
  - [x] Documenter variables d'environnement nécessaires ✅ (`DEPLOY_PRODUCTION.md`)
  - [x] Documenter configuration serveur (SSH, rsync, etc.) ✅ (`DEPLOY_PRODUCTION.md`)

- [ ] **Intégration CI/CD (optionnel)** :
  - [ ] Ajouter scripts dans GitHub Actions (ou autre CI)
  - [ ] Automatiser vérification build sur chaque commit
  - [ ] Automatiser déploiement sur push main/master

### 23.5.4 Vérification & Documentation Git (Prod/Dev)

**Objectif** : Vérifier configuration Git pour prod/dev et documenter guide complet

- [ ] **Vérification configuration Git actuelle** :
  - [ ] Vérifier `.gitignore` (racine, frontend, backend, admin-central)
  - [ ] Vérifier branches Git (main, develop, etc.)
  - [ ] Vérifier workflow Git (merge, rebase, etc.)
  - [ ] Vérifier hooks Git (pre-commit, pre-push, etc.)
  - [ ] Vérifier stratégie de versioning (tags, releases)

- [ ] **Configuration branches** :
  - [ ] Définir stratégie branches (main = prod, develop = dev, feature/*, etc.)
  - [ ] Configurer protection branches (main, develop)
  - [ ] Configurer règles merge (pull request requis, reviews, etc.)
  - [ ] Documenter workflow branches

- [ ] **Configuration .gitignore** :
  - [ ] Vérifier que tous les fichiers sensibles sont ignorés (.env, node_modules, etc.)
  - [ ] Vérifier que les builds ne sont pas commités (dist/, build/, etc.)
  - [ ] Vérifier que les logs ne sont pas commités
  - [ ] Ajouter fichiers manquants si nécessaire

- [ ] **Hooks Git** :
  - [ ] Créer hook pre-commit (lint, format, tests rapides)
  - [ ] Créer hook pre-push (build check, tests complets)
  - [ ] Documenter hooks Git

- [ ] **Documentation Git** :
  - [ ] Créer `docs/GIT_WORKFLOW.md` :
    - [ ] Structure branches (main, develop, feature/*)
    - [ ] Workflow développement (créer branche, commit, push, PR)
    - [ ] Workflow déploiement (merge develop → main, tags, releases)
    - [ ] Conventions commits (format, messages)
    - [ ] Conventions branches (nommage)
    - [ ] Guide résolution conflits
    - [ ] Guide rollback

- [ ] **CLI commandes Git** :
  - [ ] Ajouter commandes Git dans CLI Python :
    - [ ] `python cli/main.py git status` (statut branches, commits, etc.)
    - [ ] `python cli/main.py git create-branch [nom]` (créer branche feature)
    - [ ] `python cli/main.py git commit [message]` (commit avec conventions)
    - [ ] `python cli/main.py git deploy [env]` (merge et déploiement)
  - [ ] Documenter commandes CLI Git

- [ ] **Documentation dans project-rules** :
  - [ ] Ajouter section "Workflow Git" dans `project-rules.mdc`
  - [ ] Ajouter section "Conventions Git" (commits, branches)
  - [ ] Référencer `docs/GIT_WORKFLOW.md`

---

## 📦 Phase 24 : Préparation Collection Réelle

**🎯 Objectif** : Intégrer les données réelles du magasin dans le site (AS400, marques, images, stocks)

**📅 Timing** : Après déploiement sur serveur (Phase 23), avant lancement réel

**⏱️ Durée estimée** : 2-3 semaines (selon volume données et automatisation)

### 24.1 Documentation & Contexte

**Objectif** : Créer toute la documentation nécessaire pour ce processus spécifique

- [ ] **Nouveau document principal** : `docs/COLLECTION_REAL.md`
  - [ ] Workflow complet d'intégration collection réelle
  - [ ] Mapping données AS400 → notre structure
  - [ ] Processus validation données
  - [ ] Checklist qualité données

- [ ] **Documentation AS400** : `docs/AS400_INTEGRATION.md`
  - [ ] Structure tables AS400 (schéma, champs)
  - [ ] Méthode de connexion/extraction (export CSV, API, dump SQL)
  - [ ] Transformation des données (mapping champs)
  - [ ] Validation et nettoyage données

- [ ] **Documentation Images** : `docs/IMAGES_WORKFLOW.md`
  - [ ] Workflow création images produits (comment tu les fais)
  - [ ] Standards qualité (résolution, formats, nommage)
  - [ ] Organisation fichiers (structure dossiers)
  - [ ] Processus upload (manuel vs automatisé)
  - [ ] Optimisation images (compression, formats WebP)

- [ ] **Nouvelles commandes Cursor** :
  - [ ] `/collection-workflow` : Guide workflow collection réelle
  - [ ] `/as400-integration` : Guide intégration AS400
  - [ ] `/images-workflow` : Guide workflow images produits

- [ ] **Nouvelles règles project-rules.mdc** :
  - [ ] Section "Workflow Collection Réelle"
  - [ ] Section "Intégration AS400"
  - [ ] Section "Workflow Images Produits"

### 24.2 Insertion Marques avec Logos

**Objectif** : Ajouter toutes les marques de la collection réelle avec leurs logos

- [ ] **Backend** :
  - [ ] Identifier toutes les marques de la collection réelle
  - [ ] Préparer logos (formats, tailles, optimisation)
  - [ ] Créer script seed ou import CSV pour marques
  - [ ] Upload logos sur Cloudinary (ou storage)
  - [ ] Insérer marques en base via Admin ou script

- [ ] **Admin** :
  - [ ] Vérifier interface Brands fonctionne bien
  - [ ] Tester upload logo via Admin
  - [ ] Vérifier affichage logos dans navigation frontend

- [ ] **Validation** :
  - [ ] Vérifier toutes marques présentes
  - [ ] Vérifier logos affichés correctement (frontend)
  - [ ] Vérifier filtres par marque fonctionnent

### 24.3 Politique Livraison Finale

**Objectif** : Définir et configurer les politiques de livraison finales avec l'équipe Reboul

- [ ] **Réunion avec équipe Reboul** :
  - [ ] Définir frais livraison (standard, express)
  - [ ] Définir seuil livraison gratuite
  - [ ] Définir délais livraison
  - [ ] Définir zones de livraison (si applicable)
  - [ ] Définir politique retour (délai, frais, conditions)

- [ ] **Configuration Backend** :
  - [ ] Mettre à jour Shop entity avec politiques finales
  - [ ] Vérifier calcul livraison dans checkout
  - [ ] Tester différents scénarios (sous/seuil gratuit, express, etc.)

- [ ] **Configuration Admin** :
  - [ ] Vérifier page Settings permet bien configuration
  - [ ] Tester modification politiques depuis Admin

- [ ] **Affichage Frontend** :
  - [ ] Vérifier affichage frais livraison (panier, checkout)
  - [ ] Vérifier messages livraison gratuite
  - [ ] Vérifier page politique retour affichée correctement

### 24.4 Intégration AS400 - Transformation Données

**Objectif** : Récupérer données magasin AS400, transformer et intégrer dans notre base

#### 24.4.1 Analyse & Mapping AS400

- [ ] **Compréhension structure AS400** :
  - [ ] Analyser tables AS400 disponibles (produits, stocks, marques, catégories)
  - [ ] Documenter schéma AS400 (champs, types, relations)
  - [ ] Identifier méthode extraction (export CSV, connexion directe, dump)

- [ ] **Mapping données** :
  - [ ] Table produits AS400 → notre entité Product
  - [ ] Table stocks AS400 → notre entité Variant (stock)
  - [ ] Table marques AS400 → notre entité Brand
  - [ ] Table catégories AS400 → notre entité Category
  - [ ] Identifier transformations nécessaires (formats, valeurs, normalisations)

- [ ] **Documenter mapping** :
  - [ ] Créer tableau de correspondance AS400 → notre DB
  - [ ] Documenter règles de transformation
  - [ ] Documenter valeurs par défaut si données manquantes

#### 24.4.2 Processus Transformation

- [ ] **Script transformation** :
  - [ ] Créer script Node.js/Python pour lire données AS400
  - [ ] Implémenter transformations (normalisation, nettoyage)
  - [ ] Validation données (champs requis, formats, contraintes)
  - [ ] Générer erreurs/warnings si données invalides

- [ ] **Format intermédiaire** :
  - [ ] Créer format JSON/CSV intermédiaire (après transformation)
  - [ ] Permettre review manuelle avant import
  - [ ] Prévisualiser données transformées

#### 24.4.3 Import Données

- [ ] **Script import** :
  - [ ] Créer script import données transformées
  - [ ] Gérer création produits (avec vérification doublons)
  - [ ] Gérer création variants avec stocks
  - [ ] Gérer création/association marques et catégories
  - [ ] Gérer images (association après upload)

- [ ] **Validation import** :
  - [ ] Logs détaillés (produits créés, erreurs, warnings)
  - [ ] Rapport post-import (statistiques)
  - [ ] Vérification données importées (échantillonnage)

### 24.5 Amélioration Processus Stocks - Automatisation

**Objectif** : Améliorer et accélérer la mise à jour des stocks depuis AS400

- [ ] **Analyse processus actuel** :
  - [ ] Documenter processus manuel actuel (si existant)
  - [ ] Identifier goulots d'étranglement
  - [ ] Identifier points d'automatisation possibles

- [ ] **Automatisation IA/ML (si pertinent)** :
  - [ ] Discuter avec toi : besoins spécifiques, volume, fréquence
  - [ ] Identifier tâches répétitives automatisables
  - [ ] Proposer solutions (scripts, IA, workflow)
  - [ ] Implémenter automatisation si valeur ajoutée

- [ ] **Scripts synchronisation stocks** :
  - [ ] Créer script sync stocks AS400 → notre DB
  - [ ] Gérer différences (AS400 vs DB)
  - [ ] Gérer cas spéciaux (produits supprimés, nouveaux, variants)
  - [ ] Logs et alertes si écarts importants

- [ ] **Workflow Admin** :
  - [ ] Interface Admin pour lancer sync stocks
  - [ ] Affichage rapport sync (produits modifiés, erreurs)
  - [ ] Historique synchronisations

- [ ] **Documentation** :
  - [ ] Documenter workflow stocks final
  - [ ] Guide utilisation Admin
  - [ ] Troubleshooting guide

### 24.6 Workflow Images Produits

**Objectif** : Documenter et optimiser le processus de création/upload images produits

#### 24.6.1 Documentation Workflow Images

- [ ] **Entretien avec toi** :
  - [ ] Comprendre comment tu fais les images produits actuellement
  - [ ] Identifier étapes du processus
  - [ ] Identifier points d'amélioration/automatisation
  - [ ] Définir standards qualité

- [ ] **Documenter workflow** :
  - [ ] Créer guide complet dans `docs/IMAGES_WORKFLOW.md`
  - [ ] Étapes détaillées (shooting, retouche, nommage, upload)
  - [ ] Standards qualité (résolution, formats, couleurs)
  - [ ] Convention nommage fichiers
  - [ ] Structure dossiers/organisation

#### 24.6.2 Optimisation & Automatisation

- [ ] **Optimisation images** :
  - [ ] Script compression automatique (WebP, optimisation taille)
  - [ ] Batch processing (traiter plusieurs images)
  - [ ] Génération thumbnails automatique
  - [ ] Watermarking (si nécessaire)

- [ ] **Automatisation upload** :
  - [ ] Script batch upload (dossier → Cloudinary)
  - [ ] Association automatique images → produits (par nommage)
  - [ ] Vérification qualité avant upload (résolution min, poids max)

- [ ] **Interface Admin améliorée** :
  - [ ] Upload multiple images
  - [ ] Drag & drop
  - [ ] Prévisualisation avant upload
  - [ ] Ordre images (drag & drop pour réordonner)

- [ ] **Validation** :
  - [ ] Vérifier workflow fonctionne end-to-end
  - [ ] Vérifier qualité images sur site
  - [ ] Vérifier performance chargement

### 24.7 Checklist Finale - Validation Collection

- [ ] **Données** :
  - [ ] Tous produits importés et validés
  - [ ] Tous stocks synchronisés
  - [ ] Toutes marques avec logos
  - [ ] Toutes catégories correctement associées

- [ ] **Images** :
  - [ ] Tous produits ont au moins 1 image
  - [ ] Qualité images validée
  - [ ] Images optimisées (poids, format)

- [ ] **Politiques** :
  - [ ] Politiques livraison configurées et validées
  - [ ] Politiques retour configurées et validées

- [ ] **Tests** :
  - [ ] Parcours complet achat testé avec données réelles
  - [ ] Vérification stocks cohérents
  - [ ] Vérification calculs (totaux, livraison, taxes)

---

## 🎯 Phase 26 : Post-Lancement

**Objectif** : Amélioration continue

### 26.1 Analytics & KPIs
- [ ] Dashboard analytics (Google Analytics 4)
- [ ] Tracking conversions (objectifs)
- [ ] Heatmaps (Hotjar)
- [ ] A/B testing (boutons CTA, checkout flow)

### 26.2 Marketing
- [ ] Newsletter (Mailchimp ou Sendinblue)
- [ ] Intégration réseaux sociaux (Instagram, Facebook)
- [ ] Pixels tracking (Meta, Google Ads)
- [ ] Programme fidélité (points, réductions)

### 26.3 Support Client
- [ ] Chat live (Crisp, Intercom, ou custom)
- [ ] FAQ dynamique
- [ ] Tickets support (système de ticketing)
- [ ] Bot FAQ automatique

### 26.4 Évolutions Futures
- [ ] Application mobile (React Native)
- [ ] Mode sombre (dark theme)
- [ ] Multi-langue (i18n)
- [ ] Multi-devise (EUR, USD, GBP)
- [ ] Programme affiliation
- [ ] Vente en magasin (POS intégré)

---

## 📊 Récapitulatif par Priorité

### 🔴 Priorité 1 (MVP Reboul - FÉVRIER 2025) - Phases 9-14.6
- **Phases 9-10** : Backend Auth + Frontend Auth UI
- **Phases 11-12** : Backend Commandes + Frontend Panier & Checkout
- **Phases 13-14.6** : Backend Stripe + Frontend Historique Commandes + Page Produit Améliorée + Animations GSAP
- **Résultat** : Site Reboul (catégorie enfants) fonctionnel de bout en bout avec animations fluides

### 🟡 Priorité 2 (Admin Centrale - FÉVRIER 2025) - Phases 15-17.12
- **Phases 15-16** : Backend Cloudinary + Admin & Permissions
- **Phase 17.1-17.8** : **Admin Centrale** connectée à Reboul (interface complète)
- **Phase 17.9** : Brainstorming & Plan d'Amélioration ✅
- **Phase 17.10** : Multi-sites UI ✅
- **Phase 17.11** : Docker & Déploiement Production Ready
- **Phase 17.12** : Tests E2E critiques
- **Note** : Animations déjà complétées dans Phase 14.6
- **Résultat** : Gestion complète de Reboul depuis l'Admin Centrale + Infrastructure prête pour déploiement

### 📝 Notes :
- **Page Home** : Améliorations progressives au fil du temps
- **Données réelles** : **🆕 Phase 24 - Préparation Collection Réelle** (après déploiement, avant lancement réel)
  - Intégration AS400 (transformation données magasin)
  - Workflow images produits (documentation, optimisation)
  - Insertion marques avec logos
  - Politiques livraison finales
  - Amélioration processus stocks (automatisation)

### 🟢 Priorité 3 (Expansion Multi-Sites) - Après Reboul
- **CP Company** : Créer Frontend + Backend + Database (même structure que Reboul)
- **Outlet** : Créer Frontend + Backend + Database (même structure que Reboul)
- Connecter CP Company et Outlet à l'Admin Centrale
- **Résultat** : 3 sites indépendants gérés depuis une seule Admin
- **Note Serveur** : VPS-3 (8 vCores / 24 GB RAM / 200 GB SSD) supporte déjà l'architecture complète, pas de migration nécessaire ✅

### 🟣 Priorité 4 (Fonctionnalités Avancées) - Phases 18-19
- Backend : Recherche avancée, Wishlist, Reviews, Promos, WebSockets, SMS, Redis
- Frontend : Recherche UI, Wishlist, Reviews, Promos, Notifications, Pages vitrine
- Déployer sur les 3 sites progressivement
- **Résultat** : Expérience utilisateur premium sur tous les sites

### 🔵 Priorité 5 (Optimisation) - Phases 20-24
- Automatisation, Tests, SEO, Performance, Déploiement, Post-lancement
- **Résultat** : 3 sites professionnels, stables, performants, scalables

---

## 🎯 Timeline Estimée DÉTAILLÉE (Objectif Février 2025)

### 📅 Semaine par semaine :

**Semaine 1-2 (10-24 décembre 2025)** : Auth & Users
- ✅ Phase 9 : Backend Auth & Users (7 jours)
- ✅ Phase 10 : Frontend Auth UI (5 jours)

**Semaine 3-4 (25 décembre - 7 janvier 2025)** : Commandes & Panier
- ✅ Phase 11 : Backend Commandes complètes + Emails (7 jours)
- ✅ Phase 12 : Frontend Panier & Checkout (7 jours)

**Semaine 5-6 (8-21 janvier 2025)** : Paiement & Historique & Page Produit & Animations
- ✅ Phase 13 : Backend Stripe (5 jours)
- ✅ Phase 14 : Frontend Historique Commandes (3 jours)
- ✅ Phase 14.5 : Frontend Page Produit Améliorée (3 jours)
- ✅ Phase 14.6 : Frontend Animations GSAP (2 jours)

**🎉 CHECKPOINT 1** : Site Reboul fonctionnel (client peut acheter) ✅

**Semaine 7 (22-28 janvier 2025)** : Images & Admin Backend
- ✅ Phase 15 : Backend Cloudinary (3 jours)
- ✅ Phase 16 : Backend Admin & Permissions (4 jours)

**Semaine 8-9 (29 janvier - 11 février 2025)** : Admin Centrale
- ✅ Phase 17.1-17.8 : Frontend Admin Centrale complète (10 jours)
- ✅ Phase 17.9 : Brainstorming & Plan d'Amélioration (1 jour)
- ✅ Phase 17.10 : Multi-sites UI (1 jour)

**Semaine 10 (12-18 février 2025)** : Production & Tests
- ✅ Phase 17.9 : Brainstorming & Plan d'Amélioration (1 jour)
- ✅ Phase 17.10 : Multi-sites UI (1 jour)
- 🔄 Phase 17.11 : Docker Production + Déploiement (2 jours)
- 🔄 Phase 17.12 : Tests E2E critiques (3 jours)

**🎉 CHECKPOINT 2** : Admin Centrale connectée + Infrastructure prod + UI optimisée ✅

### 📊 Résumé :

- **🔴 Reboul MVP (Phases 9-14.6)** : ~6 semaines (10 déc - 21 jan)
- **🟡 Admin Centrale (Phases 15-17.12)** : ~4 semaines (22 jan - 18 fév)
- **📦 TOTAL FÉVRIER 2025** : ~10 semaines (2,5 mois)

### 🚀 Post-Février 2025 :

**📦 Phase 24 - Préparation Collection Réelle (2-3 semaines après déploiement)** :
- **📝 Documentation** : Créer docs (COLLECTION_REAL.md, AS400_INTEGRATION.md, IMAGES_WORKFLOW.md)
- **🏷️ Marques** : Insertion toutes marques avec logos
- **🚚 Politiques** : Finaliser politiques livraison avec équipe Reboul
- **🔗 AS400** : Intégration données magasin (transformation, import, sync stocks)
- **📸 Images** : Workflow images produits (documentation, optimisation, automatisation)
- **✅ Validation** : Checklist complète collection réelle

- **🎨 Amélioration Home** : Progressivement selon idées
- **📧 Redesign Templates Email** : Designer tous les templates d'email dans Figma et réimporter (basse priorité)
  - Templates : confirmation inscription, confirmation commande, expédition, livraison, annulation
  - Design cohérent avec l'identité de marque Reboul
  - Adaptation HTML/CSS inline pour compatibilité email
- **🟢 CP Company + Outlet** : ~4-6 semaines (mars-avril 2025)
- **🟣 Fonctionnalités avancées** : ~8-12 semaines (mai-juillet 2025)
- **🔵 Optimisation** : Continu (Phase 25+)

---

**🎯 Prochaine phase recommandée** : **Phase 9 - Backend Auth & Users** 🚀
