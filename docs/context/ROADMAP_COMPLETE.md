# 🗺️ Roadmap Complète - Reboul Store Platform

**Version** : 4.4  
**Date** : 17 décembre 2025  
**Dernière mise à jour** : 15/02/2026 à 21:04
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
6. **🎨 Workflow Figma** : Design d'abord dans Figma, puis implémentation code (voir [[../export/FIGMA_WORKFLOW.md|FIGMA_WORKFLOW]])
7. **🏗️ Architecture** : Voir [[../architecture/ARCHITECTURE_ADMIN_CENTRAL.md|ARCHITECTURE_ADMIN_CENTRAL]] pour détails complets

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

### 18.4 Promotions & Codes Promo ✅
- [x] Créer entité Coupon (code, discountType, discountValue, expiresAt, maxUses)
- [x] Endpoint POST /orders/apply-coupon (appliquer code promo)
- [x] Vérifier validité (expiré, déjà utilisé, minimum achat)
- [x] Calculer réduction dans panier
- [x] PromoBanner frontend avec rotation automatique des coupons actifs
- [x] Application de coupon dans CartSummary
- [x] Administration complète des coupons dans Admin Central (liste, création, édition, suppression)
- [x] Synchronisation admin backend avec base VPS (même base que backend Reboul)

### 18.5 Notifications Push (WebSockets) ✅
- [x] Installer @nestjs/websockets, socket.io
- [x] Gateway WebSocket
- [x] Event : commande créée (admin notifié)
- [x] Event : statut commande changé (user notifié)
- [x] Event : produit en rupture de stock (admin)
- [x] Service frontend WebSocket (websocket.service.ts)
- [x] Hook React useWebSocket
- [x] Composants notifications (NotificationToast, NotificationContainer, NotificationsProvider)
- [x] Intégration dans l'application frontend avec connexion automatique selon rôle

### 18.6 SMS (Twilio ou similaire) ✅
- [x] Installer twilio ou vonage
- [x] Configurer API keys (variables d'environnement : TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)
- [x] Service SMS : sendSMS()
- [x] Envoi SMS : commande expédiée (avec tracking) - intégré dans OrdersService.updateStatus()
- [x] Envoi SMS : réinitialisation mot de passe - endpoints POST /auth/password-reset/sms et POST /auth/password-reset/confirm

### 18.7 Cache Redis ✅
- [x] Installer @nestjs/cache-manager, cache-manager-redis-store, redis
- [x] Configurer Redis (Docker service) - service redis ajouté dans docker-compose.yml
- [x] Cache produits (TTL 5 min) - findAll() et findOne() avec cache
- [x] Cache catégories (TTL 10 min) - findAll(), findOne(), findBySlug() avec cache
- [x] Invalider cache après modification - invalidation dans create/update/remove pour produits et catégories

### 18.8 Notifications Rupture de Stock (Backend) ✅
**📝 Note** : Version MVP actuelle utilise localStorage. Cette phase migre vers backend pour notifications réelles.

**💻 Phase Implémentation Backend** :
- [x] Créer entité StockNotification (productId, variantId nullable, email, phone nullable, createdAt, notifiedAt nullable)
- [x] Endpoint POST /products/:id/notify-stock (s'inscrire aux notifications)
- [x] Endpoint GET /products/:id/notify-stock (vérifier si déjà inscrit)
- [x] Service StockNotification : subscribe(), checkSubscription(), notifyAll()
- [x] Job cron : Vérifier stock quotidiennement à 9h, envoyer emails si stock > 0
- [x] Template email : "Votre produit est de nouveau disponible" (stock-available.hbs)
  - [x] Logo Reboul depuis Cloudinary intégré
  - [x] Image du produit intégrée (première image)
  - [x] Design responsive et professionnel
- [x] Endpoint test : POST /test/stock-notifications/test-email (pour tests)
- [ ] Migration données localStorage → Backend (script de migration - optionnel)
- [x] Frontend : Remplacer localStorage par appels API
  - [x] Service stock-notifications.service.ts créé
  - [x] StockNotificationModal modifié pour utiliser l'API
  - [x] Vérification automatique si déjà inscrit
  - [x] Messages d'erreur et de succès avec Toast
  - [x] VariantSelector permet de sélectionner les variantes en rupture pour s'abonner

---

## 🎨 Phase 19 : Frontend - Fonctionnalités Avancées

**Objectif** : Compléter expérience utilisateur

### 19.1 Recherche & Filtres
- [x] Barre de recherche Header (autocomplete)
- [x] Page /search?q=query
- [x] Sidebar filtres (catégorie, prix, couleur, taille, note)
- [x] Tri (pertinence, prix, nouveautés, meilleures ventes)
- [x] Pagination ou infinite scroll

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

### 19.4 Codes Promo ✅
- [x] Champ "Code promo" dans CartSummary
- [x] Appliquer code → afficher réduction
- [x] Message erreur si code invalide
- [x] Afficher économies dans récapitulatif
- [x] Intégration coupon dans checkout Stripe
- [x] Application coupon lors de la création de commande
- [x] Application réduction dans les prix Stripe (line_items)
- [x] Message personnalisé sur page Stripe indiquant code promo appliqué

### 19.5 Notifications Temps Réel (WebSockets)
- [ ] Connecter Socket.io client
- [ ] Toast notification : statut commande changé
- [ ] Badge "nouveau message" si admin envoie notif
- [ ] Page /notifications (historique)

### 19.6 Pages Vitrine ✅
- [x] Page /about (à propos de Reboul Store)
- [x] Page /contact (formulaire contact + infos boutique physique)
- [x] Page /stores (localisation boutiques Marseille/Cassis/Sanary)
- [x] Page /shipping-returns (politiques détaillées)
- [x] Page /terms (CGV)
- [x] Page /privacy (mentions légales, RGPD)

### 19.7 Page 404 & Erreurs ✅
- [x] Page 404 personnalisée (style A-COLD-WALL*)
- [x] Page 500 (erreur serveur)
- [x] Composant ErrorBoundary (catch erreurs React)

---

## 🔄 Phase 20 : Automatisation & Intégrations

**Objectif** : Automatiser tâches répétitives

### 20.1 n8n - Workflows

#### 20.1.1 Installation & Configuration
- [ ] Installer n8n (Docker service ou cloud)
- [ ] Configurer accès base de données PostgreSQL
- [ ] Configurer accès API backend (si nécessaire)
- [ ] Configurer variables d'environnement (credentials, URLs)

#### 20.1.2 Synchronisation AS400 → PostgreSQL (PRIORITÉ) ⭐

**Objectif** : Synchronisation temps réel des produits AS400 vers PostgreSQL

##### Phase 1 : Exploration & Compréhension
- [ ] Analyser structure AS400 (tables produits, champs disponibles)
- [ ] Tester connexion AS400 (ODBC, API REST, fichiers)
- [ ] Identifier méthode d'accès (ODBC, API, webhooks, exports)
- [ ] Documenter mapping AS400 → PostgreSQL (champs, formats)
- [ ] Identifier champ "date de modification" ou mécanisme de détection changements

##### Phase 2 : Prototype & Tests
- [ ] Créer workflow N8N basique (récupération 1 produit)
- [ ] Tester connexion AS400 depuis N8N
- [ ] Tester récupération données produit
- [ ] Tester mapping AS400 → structure PostgreSQL
- [ ] Tester création/mise à jour dans PostgreSQL via API backend
- [ ] Valider données synchronisées

##### Phase 3 : Synchronisation Polling (Approche initiale)
- [ ] Workflow N8N avec trigger Schedule (cron toutes les 5-15 min)
- [ ] Requête AS400 : produits modifiés depuis dernière sync
- [ ] Comparer avec PostgreSQL (par référence produit)
- [ ] Créer produits manquants
- [ ] Mettre à jour produits existants
- [ ] Gérer variants (tailles/couleurs) si applicable
- [ ] Logger résultats et erreurs

##### Phase 4 : Optimisation Temps Réel (Si possible)
- [ ] Évaluer possibilité webhooks AS400
- [ ] Si webhooks disponibles : configurer webhook AS400
- [ ] Workflow N8N avec trigger Webhook (temps réel)
- [ ] Synchronisation immédiate à chaque modification AS400
- [ ] Système de déduplication (éviter doublons)
- [ ] Fallback polling si webhook échoue

##### Phase 5 : Gestion Variants & Images
- [ ] Parser variants depuis AS400 (tailles/couleurs)
- [ ] Synchroniser variants vers PostgreSQL
- [ ] Gérer images (téléchargement depuis AS400 si applicable)
- [ ] Upload images vers Cloudinary
- [ ] Mettre à jour Product.images

##### Phase 6 : Mapping & Règles métier
- [ ] Table de mapping catégories AS400 → catégories PostgreSQL
- [ ] Table de mapping marques AS400 → marques PostgreSQL
- [ ] Règles de création automatique (catégories/marques inconnues)
- [ ] Gestion conflits (AS400 = source de vérité)
- [ ] Règles de validation données

##### Phase 7 : Monitoring & Alertes
- [ ] Logger toutes les synchronisations (succès/échec)
- [ ] Métriques : temps sync, taux succès, délai réel
- [ ] Alertes email/SMS en cas d'erreur répétée
- [ ] Dashboard N8N pour monitoring
- [ ] Système de retry automatique

##### Phase 8 : Production & Documentation
- [ ] Déployer N8N sur serveur production
- [ ] Configurer accès AS400 sécurisé
- [ ] Activer synchronisation
- [ ] Tests en production (surveillance 1 semaine)
- [ ] Documenter workflow N8N complet
- [ ] Documenter mapping AS400 → PostgreSQL
- [ ] Guide de troubleshooting

**📝 Documentation** : Voir `obsidian-vault/Context/AS400-Sync-Reflexion.md` pour réflexion complète

#### 20.1.3 Autres Workflows (Après AS400)
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

- [x] **Intégration CI/CD (optionnel)** :
  - [x] Ajouter scripts dans GitHub Actions ✅ (workflows existants)
  - [x] Automatiser vérification build sur chaque commit ✅ (`.github/workflows/build-check.yml`)
  - [x] Automatiser déploiement sur push main/master ✅ (`.github/workflows/deploy.yml`)

### 23.5.4 Vérification & Documentation Git (Prod/Dev)

**Objectif** : Vérifier configuration Git pour prod/dev et documenter guide complet

- [x] **Vérification configuration Git actuelle** :
  - [x] Vérifier `.gitignore` (racine, frontend, backend, admin-central) ✅
  - [x] Vérifier branches Git (main, develop, etc.) ✅ (main, feature/*, test/*)
  - [x] Vérifier workflow Git (merge, rebase, etc.) ✅ (workflow actuel fonctionnel)
  - [x] Vérifier hooks Git (pre-commit, pre-push, etc.) ✅ (exemples créés)
  - [x] Vérifier stratégie de versioning (tags, releases) ✅ (documenté dans GIT_WORKFLOW.md - Semantic Versioning)

- [x] **Configuration branches** :
  - [x] Définir stratégie branches (main = prod, develop = dev, feature/*, etc.) ✅ (documenté dans GIT_WORKFLOW.md)
  - [ ] Configurer protection branches (main, develop) (à faire sur GitHub Settings)
  - [x] Configurer règles merge (pull request requis, reviews, etc.) ✅ (documenté dans GIT_WORKFLOW.md)
  - [x] Documenter workflow branches ✅ (dans GIT_WORKFLOW.md)

- [x] **Configuration .gitignore** :
  - [x] Vérifier que tous les fichiers sensibles sont ignorés (.env, node_modules, etc.) ✅
  - [x] Vérifier que les builds ne sont pas commités (dist/, build/, etc.) ✅ (backend/.gitignore: dist)
  - [x] Vérifier que les logs ne sont pas commités ✅ (*.log dans tous les .gitignore)
  - [x] Ajouter fichiers manquants si nécessaire ✅ (docs/GITHUB_SECRETS_VALUES.md ajouté)

- [x] **Hooks Git** :
  - [x] Créer hook pre-commit (exemple créé: `.git/hooks/pre-commit.sample`) ✅
  - [x] Créer hook pre-push (exemple créé: `.git/hooks/pre-push.sample`) ✅
  - [x] Documenter hooks Git ✅ (exemples avec instructions d'activation)

- [x] **Documentation Git** :
  - [x] Créer `docs/GIT_WORKFLOW.md` ✅
    - [x] Structure branches (main, develop, feature/*) ✅
    - [x] Workflow développement (créer branche, commit, push, PR) ✅
    - [x] Workflow déploiement (merge develop → main, tags, releases) ✅
    - [x] Conventions commits (format, messages) ✅
    - [x] Conventions branches (nommage) ✅
    - [x] Guide résolution conflits ✅
    - [x] Guide rollback ✅

- [x] **CLI commandes Git** :
  - [x] Ajouter commandes Git dans CLI Python ✅
    - [x] `python cli/main.py git status` (statut branches, commits, etc.) ✅
    - [x] `python cli/main.py git create-branch [nom]` (créer branche feature) ✅
    - [x] `python cli/main.py git commit [message]` (commit avec conventions) ✅
    - [x] `python cli/main.py git deploy [env]` (merge et déploiement) ✅
  - [x] Documenter commandes CLI Git ✅ (dans `docs/GIT_WORKFLOW.md`)

- [x] **Documentation dans project-rules** :
  - [x] Ajouter section "Workflow Git" dans `project-rules.mdc`
  - [x] Ajouter section "Conventions Git" (commits, branches)
  - [x] Référencer `docs/GIT_WORKFLOW.md`

---

## 📦 Phase 24 : Préparation Collection Réelle

**🎯 Objectif** : Avoir un **workflow complet et reproductible** pour ajouter une collection réelle au site : données (produits, variants, stocks) + marques + images. Une fois les images produit au bon niveau, le workflow « ajout de collection » est bouclé.

**Où on en est** :
- **Données & ajout de collection** : ✅ **On a trouvé notre manière.** Feuilles de stock → extraction (ou CSV) → CSV au format BDD → `merge-pages` (déduplication) → wipe collection si besoin → création catégories (CLI) → import Admin. Automatisation CLI : `feuille-to-csv`, `merge-pages`, `wipe-products-by-collection`, `category-create`, **Reference Finder** (`db ref <REF>`) pour vérifier les refs en base. Import Stone Island SS26 (7 pages, 69 produits, 332 variants) validé.
- **Images produit** : **On sait comment faire.** Pipeline IA en place (photos brutes → `./rcli images generate` → `./rcli images upload --ref REF`) ; doc récap `docs/integrations/IMAGES_PRODUIT_PIPELINE.md`. Workflow classique (shooting, retouche, Cloudinary, optimisation) à finaliser / valider en parallèle (24.7).

**📅 Après Phase 24** : Phase correctifs/améliorations (liste front à venir) → Phase 25 (Finalisation) → évolution Images IA (24.10) après abo.

---

### 📋 Vue d’ensemble des sous-phases

| # | Sous-phase | Statut | Note |
|---|------------|--------|------|
| 24.1 | Documentation & Contexte | ✅ Terminé | COLLECTION_REAL, FEUILLES_STOCK, IMAGES_WORKFLOW, etc. |
| 24.2 | Marques avec Logos | ✅ Terminé | 57 marques, logos Cloudinary, BrandCarousel, BrandMarquee |
| 24.3 | Politique Livraison Finale | ⏳ À faire | Réunion magasin → config Shop |
| 24.4 | Rotation Collections | ✅ Terminé | Actif/archivée, nouvelle collection remplace l’ancienne |
| 24.5 | AS400 | ⚠️ Suspendu | Approche manuelle adoptée |
| **24.5bis** | **Import collections (feuilles → CSV → Admin)** | ✅ **Terminé** | **Workflow en place** : feuille-to-csv, merge-pages, wipe, categories, import Admin. Réfs vérifiables avec `db ref`. |
| 24.6 | CLI DB (Reference Finder, édition, export) | ✅ Terminé | `db ref`, product-list, variant-list, set-stock, export-csv, etc. |
| **24.7** | **Workflow Images Produits** | ⏳ **À finaliser** | **Dernier bloc pour boucler le workflow.** Doc + optimisation/cron en place ; validation E2E + qualité à faire. Évolution IA en 24.10. |
| 24.8 | Ajout continu produits | ✅ Couvert par 24.5bis | Même processus : nouvelle feuille/CSV → merge si besoin → import. Pas de sous-phase séparée à traiter. |
| 24.9 | Checklist finale – Validation collection | ⏳ À faire | En dernier, une fois données + images OK |
| 24.10 | Évolution Images IA (Nano Banana / Gemini) | ✅ Pipeline en place | Photos brutes → generate (4 vues) → upload Cloudinary par ref. Voir `IMAGES_PRODUIT_PIPELINE.md`. |
| **24.11** | **Plan Claude Code (étape par étape)** | ⏳ À faire | Setup Claude Code, contexte, vérifs CLI/DB/images, roadmap/doc, clôture Phase 24 + support Phase 25. Voir § 24.11. |

**📊 Progression** : Workflow **données / ajout de collection** = en place. **Images produit** : pipeline IA opérationnel (24.10). Reste : finaliser workflow classique images (24.7), politique livraison (24.3), checklist (24.9).

---

### 📊 Décisions prises (résumé)

- **Import données** : Feuilles de stock → CSV (format BDD) → fusion des pages (déduplication) → wipe collection optionnel → création catégories (CLI) → import Admin. Pas d’AS400 pour l’instant.
- **Marques** : 57 marques avec logos (Cloudinary). Affichage front (BrandCarousel, BrandMarquee).
- **Images** : Shooting + retouche + Cloudinary + optimisation WebP (cron). Évolution IA (photos brutes → studio) à explorer après abo (24.10).
- **Stocks** : Gestion manuelle ; alertes réassort (0–5 unités) optionnel.

### 24.1 Documentation & Contexte

**Objectif** : Créer toute la documentation nécessaire pour ce processus spécifique

- [x] **Nouveau document principal** : `docs/COLLECTION_REAL.md` ✅
  - [x] Workflow complet d'intégration collection réelle ✅
  - [x] Mapping données tables/CSV → notre structure ✅
  - [x] Processus validation données ✅
  - [x] Checklist qualité données ✅
  - [x] Guide import manuel via Admin (entrée collection par collection) ✅

- [ ] **Documentation AS400** : `docs/AS400_INTEGRATION.md` ⚠️ **EN SUSPENS**
  - [x] Structure tables AS400 explorée (voir `docs/AS400_ANALYSIS_GUIDE.md`) ✅
  - [ ] Structure tables AS400 (schéma, champs) - À compléter si reprise
  - [ ] Méthode de connexion/extraction (export CSV, API, dump SQL) - À compléter si reprise
  - [ ] Transformation des données (mapping champs) - À compléter si reprise
  - [ ] Validation et nettoyage données - À compléter si reprise
  - **Note** : AS400 en suspens (trop de temps). Approche manuelle adoptée.

- [x] **Documentation Images** : `docs/IMAGES_WORKFLOW.md` ✅
  - [x] Workflow création images produits (comment tu les fais) ✅
  - [x] Standards qualité (résolution, formats, nommage) ✅
  - [x] Organisation fichiers (structure dossiers) ✅
  - [x] Processus upload (manuel vs automatisé) ✅
  - [x] Optimisation images (compression, formats WebP) ✅
  - [x] Documentation cron job optimisation (`docs/IMAGES_OPTIMIZATION_CRON.md`) ✅
  - [x] Documentation compatibilité WebP (`docs/IMAGES_WEBP_COMPATIBILITY.md`) ✅

- [x] **Nouvelles commandes Cursor** : ✅
  - [x] `/collection-workflow` : Guide workflow collection réelle ✅
  - [x] `/as400-integration` : Guide intégration AS400 ✅
  - [x] `/images-workflow` : Guide workflow images produits ✅ (déjà existait)

- [x] **Nouvelles règles project-rules.mdc** : ✅
  - [x] Section "Workflow Collection Réelle" ✅
  - [x] Section "Intégration AS400" ✅
  - [x] Section "Workflow Images Produits" ✅

### 24.2 Insertion Marques avec Logos ✅

**Objectif** : Ajouter toutes les marques de la collection réelle avec leurs logos

**📊 Informations** : 36 marques (enfants + adultes), logos depuis ancien git de reboul (récupération manuelle)

**✅ STATUT : TERMINÉ ET FONCTIONNEL**

- [x] **Backend** : ✅
  - [x] Identifier toutes les marques de la collection réelle (57 marques trouvées) ✅
  - [x] Récupérer dossier logos depuis ancien git de reboul ✅
  - [x] Vérifier formats et optimiser si nécessaire ✅
  - [x] Préparer logos (formats, tailles, optimisation) ✅
  - [x] Créer script seed ou import CSV pour marques ✅
  - [x] Upload logos sur Cloudinary (56 logos uploadés) ✅
  - [x] Insérer marques en base via script (57 marques créées) ✅

- [x] **Admin** :
  - [x] Vérifier interface Brands fonctionne bien ✅
  - [x] Améliorer affichage logos (afficher images au lieu d'icônes) ✅
  - [x] Interface complète : liste, recherche, pagination, CRUD ✅
  - [x] Tester upload logo via Admin (à tester manuellement) ✅
  - [x] Vérifier affichage logos dans navigation frontend (si applicable) ✅

- [x] **Frontend** :
  - [x] Composant BrandCarousel créé pour homepage ✅
  - [x] Intégré dans Home.tsx avec animation scroll ✅
  - [x] Style aligné avec autres titres homepage (text-2xl md:text-3xl lg:text-4xl) ✅
  - [x] Composant BrandMarquee créé (barre publicitaire avec logos blancs défilants) ✅
  - [x] BrandMarquee intégré dans Layout.tsx (attaché au Header, sticky) ✅
  - [x] Logos blancs (_w) utilisés dans BrandMarquee (fond noir) ✅
  - [x] Uniformisation taille logos BrandMarquee (maxHeight: 24px, maxWidth: 80px) ✅
  - [x] Défilement automatique continu (animation CSS marquee) ✅

- [x] **Validation** :
  - [x] Vérifier toutes marques présentes (57 marques en base) ✅
  - [x] Vérifier logos affichés correctement (Admin) ✅
  - [x] Vérifier endpoints backend fonctionnent ✅
  - [x] Composant BrandCarousel créé et intégré dans Homepage ✅
  - [x] Logos noirs (_b) utilisés pour fond blanc (BrandCarousel) ✅
  - [x] BrandMarquee fonctionnel avec défilement automatique ✅
  - [x] Vérifier filtres par marque fonctionnent (frontend - si applicable) ✅
  - [x] Tester BrandCarousel manuellement (affichage, navigation, liens) ✅
  - [x] Tester BrandMarquee manuellement (défilement, logos blancs, sticky) ✅

### 24.3 Politique Livraison Finale

**Objectif** : Définir et configurer les politiques de livraison finales avec l'équipe Reboul

- [ ] **Réunion avec équipe Reboul** (en magasin) :
  - [ ] Définir frais livraison (standard, express)
  - [ ] Définir seuil livraison gratuite
  - [ ] Définir délais livraison
  - [ ] Définir zones de livraison (si applicable)
  - [ ] Définir politique retour (délai, frais, conditions)
  - [ ] Noter toutes les réponses dans `docs/PHASE_24_FAQ_MAGASIN.md`

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

### 24.4 Système Rotation Collections ✅

**Objectif** : Gérer le passage d'une collection à l'autre (actif/archivée)

**📊 Informations** : Première sortie = nouvelle collection uniquement. Quand nouvelle collection arrive, ancienne → archivée, nouvelle → active

**⚠️ IMPORTANT** : À faire AVANT l'import AS400 (24.5) pour assigner une collection aux produits importés

**✅ STATUT : TERMINÉ ET TESTÉ**

- [x] **Backend** :
  - [x] Créer entité Collection (name, displayName, isActive, description)
  - [x] Ajouter champ collectionId sur entité Product (relation ManyToOne)
  - [x] Créer migration TypeORM (table collections + colonne collectionId dans products)
  - [x] Créer module Collections (service, controller, DTOs)
  - [x] Endpoints REST complets : GET, POST, PATCH, DELETE, activate, archive
  - [x] Modifier ProductsService pour filtrer automatiquement par collection active
  - [x] Assignation automatique à la collection active lors de création produit
  - [x] Migration données existantes (assigner collection initiale "current")
  - [x] **Tests validés** ✅ :
    - [x] Création collections
    - [x] Rotation collections (activer/désactiver)
    - [x] Filtrage produits par collection active
    - [x] Assignation automatique nouveau produit
    - [x] Gestion erreurs (archiver/supprimer collection active)

- [x] **Admin** :
  - [x] Créer entité Collection dans admin backend
  - [x] Ajouter champ collectionId dans entité Product (admin backend)
  - [x] Créer service reboul-collections.service.ts (admin backend)
  - [x] Créer controller reboul-collections.controller.ts (admin backend)
  - [x] Ajouter Collection dans reboul.module.ts
  - [x] Créer service reboul-collections.service.ts (admin frontend)
  - [x] Créer page CollectionsPage.tsx (liste, activer, archiver, supprimer)
  - [x] Ajouter route dans App.tsx
  - [x] Ajouter onglet "Collections" dans AdminNavigation.tsx
  - [x] **Tests validés** ✅ :
    - [x] Admin backend démarre correctement
    - [x] Endpoints Collections enregistrés (GET, POST, PATCH, DELETE, activate, archive)
    - [x] Admin frontend accessible
  - [ ] Voir produits par collection (optionnel, à faire si besoin)
  - [ ] Filtrer produits par collection dans Admin (optionnel, à faire si besoin)

- [x] **Frontend** :
  - [x] Filtrage automatique par collection active (côté backend, pas besoin de modification frontend)
  - [x] Composant BrandCarousel créé pour homepage ✅
  - [x] Intégré dans Home.tsx avec animation scroll ✅
  - [ ] Optionnel : Page "Archives" pour voir anciennes collections

- [x] **Validation** :
  - [x] Tester rotation collections (activer/archiver) ✅
  - [x] Vérifier produits archivés masqués (0 produits retournés si collection inactive) ✅
  - [x] Vérifier produits actifs visibles (produits retournés si collection active) ✅

### 24.5 Intégration AS400 - Transformation Données ⚠️ **EN SUSPENS**

**Objectif** : Récupérer données magasin AS400, transformer et intégrer dans notre base

**⚠️ STATUT** : **EN SUSPENS** - Trop de temps nécessaire. Approche alternative adoptée (import manuel via tables/CSV - voir 24.5bis)

**📊 Informations** : Exploration AS400 effectuée (voir `docs/AS400_ANALYSIS_GUIDE.md`), mais intégration automatique suspendue

#### 24.5.1 Analyse & Mapping AS400

**📊 Informations** : Exploration effectuée en magasin, structure identifiée mais pas d'export CSV direct disponible

- [ ] **Journée en magasin** (prévue) :
  - [ ] Analyser tables AS400 disponibles (produits, stocks, marques, catégories)
  - [ ] Documenter schéma AS400 (champs, types, relations)
  - [ ] Identifier méthode extraction (export CSV, connexion directe, dump SQL, API)
  - [ ] Identifier accès AS400 (VPN, accès distant, personne responsable)

- [ ] **Compréhension structure AS400** :
  - [ ] Analyser tables AS400 disponibles (produits, stocks, marques, catégories)
  - [ ] Documenter schéma AS400 (champs, types, relations)
  - [ ] Identifier méthode extraction (export CSV priorité, évaluer autres options)

- [ ] **Mapping données** :
  - [ ] Table produits AS400 → notre entité Product
    - [ ] Champs AS400 probablement : nom, taille, couleur, stock, prix
    - [ ] Champs à compléter manuellement : descriptions, matériaux, instructions d'entretien, pays de fabrication
  - [ ] Table stocks AS400 → notre entité Variant (stock)
  - [ ] Table marques AS400 → notre entité Brand
  - [ ] Table catégories AS400 → notre entité Category
  - [ ] Identifier transformations nécessaires (formats, valeurs, normalisations)
  - [ ] Gérer variants complexes (couleurs multiples, tailles différentes selon marques)

- [ ] **Documenter mapping** :
  - [ ] Créer tableau de correspondance AS400 → notre DB
  - [ ] Documenter règles de transformation
  - [ ] Documenter valeurs par défaut si données manquantes

#### 24.5.2 Processus Transformation

- [ ] **Script transformation** :
  - [ ] Créer script Node.js/Python pour lire données AS400
  - [ ] Implémenter transformations (normalisation, nettoyage)
  - [ ] Validation données (champs requis, formats, contraintes)
  - [ ] Générer erreurs/warnings si données invalides

- [ ] **Format intermédiaire** :
  - [ ] Créer format JSON/CSV intermédiaire (après transformation)
  - [ ] Permettre review manuelle avant import
  - [ ] Prévisualiser données transformées

#### 24.5.3 Import Données

- [ ] **Script import** :
  - [ ] Créer script import données transformées
  - [ ] Gérer création produits (avec vérification doublons)
  - [ ] **Assigner collection active** aux produits importés (dépend de 24.4)
  - [ ] Gérer création variants avec stocks
  - [ ] Gérer création/association marques et catégories
  - [ ] Gérer images (association après upload)

- [ ] **Validation import** :
  - [ ] Logs détaillés (produits créés, erreurs, warnings)
  - [ ] Rapport post-import (statistiques)
  - [ ] Vérification données importées (échantillonnage)

### 24.5bis Import Manuel Collections via Tables/CSV ✅

**Objectif** : Importer les collections reçues une à une sous forme de table (Excel/CSV) via l’Admin. **C’est le cœur du workflow « ajout de collection »** : en amont, feuilles de stock → CSV (CLI `feuille-to-csv`), fusion de pages (`merge-pages`), wipe + catégories si besoin ; en aval, vérification des refs avec `./rcli db ref <REF>`.

**📊 Statut** : **Fonctionnel** (référence = source de vérité, doublons bloqués ; import Stone à finaliser par l'utilisateur)

**📊 Informations** : Collections reçues une à une sous forme de table, entrée manuelle des données une à une

- [x] **Préparation format données** :
  - [x] Définir format table/CSV attendu (colonnes, structure)
  - [x] Créer template Excel/CSV pour faciliter la préparation des données
  - [x] Documenter mapping colonnes table → notre structure DB

- [x] **Interface Admin - Import Collection** :
  - [x] Créer page Admin pour import collection (upload fichier CSV/Excel)
  - [x] Parser fichier CSV/Excel (validation format, délimiteur ; ou ,)
  - [x] Prévisualisation données avant import
  - [x] Validation données (champs requis, formats, contraintes)
  - [x] **Référence produit = source de vérité** (obligatoire, unicité ; SKU dérivé automatiquement)
  - [x] **Détection doublons** : même référence en double → erreur bloquante (ex. L100001-V09A-29 deux fois)
  - [x] Gestion erreurs (afficher lignes avec erreurs)

- [x] **Processus import** :
  - [x] Créer produits depuis données table (regroupement par référence de base, pas par nom seul)
  - [x] **Assigner collection active** aux produits importés (dépend de 24.4 ✅)
  - [x] Créer variants avec stocks (taille, couleur, stock) — ordre trié (tailles numériques puis lettres)
  - [x] Référence produit sans taille (ref base uniquement)
  - [x] Gérer création/association marques et catégories
  - [ ] Gérer images (association après upload - voir 24.7)

- [x] **Workflow entrée manuelle** :
  - [x] Processus validation avant publication
  - [ ] Guide étape par étape pour entrer une collection (optionnel)
  - [ ] Checklist qualité données avant import (optionnel)

- [x] **Documentation** :
  - [x] Documenter workflow import manuel
  - [x] Template Excel/CSV avec exemples
  - [ ] Créer guide utilisation Admin pour import (optionnel)

- [x] **Validation** :
  - [x] Tester import collection complète (ex. Stone Island SS26 : 7 pages fusionnées, 69 produits, 332 variants — OK)
  - [x] Vérifier produits créés correctement (réf sans taille, 1 produit par ref)
  - [x] Vérifier variants et stocks (ordre tailles correct)
  - [x] Vérifier association marques/catégories
  - [x] Workflow complet documenté dans `docs/context/FEUILLES_STOCK_REBOUL.md` (feuille-to-csv, merge-pages, wipe, category-create, import Admin, vérif avec `db ref`)

### 24.6 Interface CLI Base de Données

**Objectif** : Disposer d’une interface CLI dédiée à la base Reboul (lecture/inspect + petites opérations encadrées) pour aller plus vite que via l’Admin, tout en respectant les règles DB (VPS uniquement + backup auto avant opérations risquées).

- [x] **24.6.1 Design CLI DB**
  - [x] Lister les cas d’usage prioritaires (lecture produits/variants/stocks, recherche par **référence produit**, inspection commandes/paniers, check cohérence séquences, etc.)
  - [x] Valider qu’on réutilise `./rcli` et la connexion actuelle (SSH / VPS, jamais DB locale)
  - [x] Définir la convention de commandes `./rcli db ...` avec :
    - [x] Recherche par **référence produit** (`--ref`) en priorité
    - [x] Support `--id` et `--sku` en option
  - [x] Séparer clairement commandes **lecture** vs commandes **mutantes** (qui exigeront backup + confirmation)

- [x] **24.6.2 Commandes lecture (read-only) – MVP** ✅
  - [x] `product-find --ref REF` / `--id ID` / `--sku SKU` → un produit
  - [x] `product-list --brand "Stone Island"` [--collection] [--limit] → liste produits par marque/collection + résumé variants (taille min→max, stock)
  - [x] `variant-list --product-id ID` / `--ref REF` → variants d’un produit (id, sku, size, color, stock)
  - [x] `check-sequences` → séquences critiques (carts, orders, products)
  - [x] Tables Rich + `--json`

- [x] **24.6.3 Commandes d’édition encadrée** ✅
  - [x] Stock : `variant-set-stock`, `product-set-all-stock`
  - [x] Couleur : `variant-set-color`, `product-set-all-color`
  - [x] Taille : `variant-set-size`
  - [x] Ajout / suppression : `variant-add`, `variant-delete`
  - [x] Prix produit : `product-set-price`
  - [x] `product-set-active` (colonne `is_published`)
  - [x] Backup auto + confirmation (`--yes` / prompt) pour toutes les commandes mutantes

- [x] **24.6.4 Intégration CLI & docs** ✅
  - [x] `docs/context/DB_CLI_USAGE.md` (guide complet)
  - [x] Sous-section “Interface CLI DB” dans `docs/context/CONTEXT.md`
  - [x] Commande Cursor `/db-cli-workflow` à jour
  - [x] `project-rules.mdc` : rappel VPS + backup obligatoire avant actions CLI risquées
  - [ ] Optionnel : documenter dans `cli/CONTEXT.md` / `cli/RECAPITULATIF.md` (déjà résumé dans RECAP base de données)

- [x] **24.6.5 Compléter le CLI DB (optionnel – pour clôturer 24.6 à 100 %)** ✅
  - [x] **product-set-active** : colonne `is_published` alignée (migration + entité), commande finalisée
  - [x] **Édition produit** : `product-set-name`, `product-set-ref`, `product-set-category`, `product-set-brand`, `product-set-collection`
  - [x] **Inspection commandes / paniers** : `order-list` (--last N), `order-detail --id <ID>`, `cart-list` (--last N)
  - [x] **Export CSV** : `export-csv --brand "X"` [--collection Y] [--output file.csv] (une ligne par variant)

Phase 24.6 CLI DB considérée terminée à 100 %.

### 24.7 Workflow Images Produits

**Objectif** : Finaliser le processus de création/upload images produits. **C’est le dernier bloc à boucler pour avoir le workflow « ajout de collection » complet** : données ✅, images à valider.

#### 24.7.1 Documentation Workflow Images

**📊 Informations** : Shooting à Aubagne au stock, récupération matériel chez le patron, setup complet ensemble, retouche Photoshop, stockage Cloudinary, 3-5 images/produit

- [x] **Entretien avec toi** :
  - [x] Comprendre comment tu fais les images produits actuellement (shooting à Aubagne, retouche Photoshop)
  - [x] Identifier étapes du processus (récupération matériel → setup → shooting → retouche → nommage → upload)
  - [ ] Identifier points d'amélioration/automatisation
  - [ ] Définir standards qualité

- [x] **Documenter workflow** :
  - [x] Créer guide complet dans `docs/IMAGES_WORKFLOW.md` ✅
  - [x] Étapes détaillées (shooting à Aubagne, retouche Photoshop, nommage, upload Cloudinary) ✅
  - [x] Standards qualité (résolution: 2048px, poids: 200-300KB, formats: JPG/PNG) ✅
  - [x] **Convention nommage fichiers** : `[SKU]_[numero]_[type].jpg` ✅
  - [x] Structure dossiers/organisation : `products/[collection]/[sku]/` ✅
  - [x] Quantité : 3-5 images par produit ✅

#### 24.7.2 Optimisation & Automatisation

- [x] **Optimisation images** :
  - [x] Script compression automatique (WebP, optimisation taille) ✅
  - [x] Batch processing (traiter plusieurs images) ✅
  - [x] Génération thumbnails automatique (via Cloudinary) ✅
  - [ ] Watermarking (si nécessaire) - **Optionnel**

- [x] **Automatisation upload** :
  - [x] Script batch upload (dossier → Cloudinary) ✅
  - [x] Association automatique images → produits (par nommage SKU) ✅
  - [x] Vérification qualité avant upload (résolution min, poids max) ✅
  - [x] Documentation scripts (`backend/scripts/README_IMAGES.md`) ✅

- [x] **Interface Admin améliorée** :
  - [x] Upload multiple images ✅
  - [x] Drag & drop ✅
  - [x] Prévisualisation avant upload ✅
  - [x] Ordre images (flèches haut/bas pour réordonner) ✅

- [x] **Cron Job Optimisation Automatique** :
  - [x] Module ImagesOptimization créé ✅
  - [x] Service d'optimisation (JPG/PNG → WebP via Cloudinary) ✅
  - [x] Cron job quotidien (3h) : nouvelles images 24h ✅
  - [x] Cron job hebdomadaire (dimanche 4h) : toutes les images ✅
  - [x] Endpoints manuels pour déclencher l'optimisation ✅
  - [x] Documentation (`docs/IMAGES_OPTIMIZATION_CRON.md`) ✅
  - [x] Module ajouté dans AppModule ✅
  - [x] @nestjs/schedule installé ✅
  - [x] **Tests validés** ✅ :
    - [x] Backend démarre correctement
    - [x] Endpoints fonctionnels (optimize-all, optimize-new)
    - [x] Compatibilité WebP vérifiée (frontend + API)
  - [x] Documentation compatibilité WebP (`docs/IMAGES_WEBP_COMPATIBILITY.md`) ✅
  - [x] **Note** : Script `optimize-images.ts` nécessite `sharp` (optionnel, pour optimisation locale avant upload) - Déplacé dans `/scripts/` ✅

- [ ] **Validation** :
  - [ ] Vérifier workflow fonctionne end-to-end
  - [ ] Vérifier qualité images sur site
  - [ ] Vérifier performance chargement
  - [ ] Tester cron job optimisation

- **Évolution prévue** : voir **24.10 Évolution Images IA** (photos brutes → images studio + mannequin IA, après abo Nano Banana / Gemini).

### 24.10 Évolution Images IA (Nano Banana / Gemini) – après abonnement

**Objectif** : Explorer, **doucement**, la génération / amélioration d’images IA (photos brutes → images produit type studio, détails, mannequin IA sans visage). Pas de pression : on avance étape par étape après abo.

**Suivi** : La roadmap est mise à jour à chaque tâche faite. Doc de suivi détaillé : `docs/integrations/IMAGES_IA_WORKFLOW.md`. **Récap pipeline (3 étapes)** : `docs/integrations/IMAGES_PRODUIT_PIPELINE.md`.

**État actuel (dernière MAJ)** : **Pipeline images IA validé.** (1) Photos brutes dans `photos/`, refs de style dans `refs/` (refs = style uniquement, pas le produit). (2) `./rcli images generate` (Gemini 3 Pro par défaut) → 4 vues ; les vues 3 et 4 s’appuient sur la 1_face générée comme source de vérité (même vêtement). (3) Optionnel : `./rcli images adjust` avec `--ref` pour recaler les couleurs d’une vue sur une autre. (4) `./rcli images upload --ref REF --dir output/` (Cloudinary + BDD). Préconisations prise de vue (couleurs, produit) dans `IMAGES_IA_WORKFLOW.md`. Récap dans `IMAGES_PRODUIT_PIPELINE.md`.

---

**Vision** (à long terme) :
- Prises de vues brutes au magasin (règles documentées dans `IMAGES_IA_WORKFLOW.md`).
- **Pipeline** : 1 photo brute (face, + optionnel dos) → script → **3–4 images** (face, dos, détail logo, lifestyle).
- **Intégration** : script CLI (`./rcli` ou dédié) qui appelle l’API Nano Banana.

**Plan pipeline + intégration (ordre)** :
1. **Récupérer la clé API Gemini** (https://aistudio.google.com/apikey — gratuit, pas de waitlist).
2. **Script CLI** : client API Gemini (image + prompt → image), puis enchaîner les 4 prompts validés → 3–4 images (face, dos si fourni, détail logo, lifestyle).
3. **Commande** : ex. `./rcli images generate --face photo.jpg [--back photo_dos.jpg] -o ./output`.
4. Doc d’usage dans `IMAGES_IA_WORKFLOW.md`.

---

**Tâches (cocher au fur et à mesure)** :

*Phase 1 – Préparation*
- [x] Choisir et souscrire abonnement → **Nano Banana Pro acheté**
- [x] Décider Nano Banana vs Gemini → **Nano Banana en priorité**
- [x] Documenter vision, options, premier pas → `IMAGES_IA_WORKFLOW.md`
- [x] Premier test manuel fond studio réussi
- [x] Valider 4 prompts (face, dos, détail logo, lifestyle) → sauvegardés dans `IMAGES_IA_WORKFLOW.md`
- [x] Définir règles de prise de vues → documentées dans `IMAGES_IA_WORKFLOW.md`
- [x] Décider où intégrer → **script CLI** (1 photo → 3–4 images)

*Phase 2 – Pipeline + script CLI (API Gemini)*
- [x] Récupérer clé API **Gemini** (https://aistudio.google.com/apikey) et la mettre dans `.env` (`GEMINI_API_KEY=...`)
- [x] Implémenter client API Gemini (image + prompt → image, modèle `gemini-2.5-flash-image`)
- [x] Enchaîner les 4 vues : face, dos (si photo dos fournie), détail logo, lifestyle → sortie 3–4 fichiers
- [x] Exposer en commande CLI : `./rcli images generate --face photo.jpg [--back photo_dos.jpg] -o ./output`
- [x] Documenter usage dans `IMAGES_IA_WORKFLOW.md`
- [x] Mode dossier : lecture auto de `photos/` (face.jpg, back.jpg) et `refs/` (1_face.png, …)
- [x] Images de référence : option refs/ + `gemini-3-pro-image-preview` pour les vues avec ref

*Phase 3 – Améliorations (stabilité / qualité)*
- [x] Stabiliser vue lifestyle : retry auto si pas d’image + gemini-3-pro pour cette vue
- [x] 1_face générée comme source de vérité pour vues 3 et 4 (même vêtement)
- [x] images adjust --ref pour caler couleurs sur une image de référence
- [ ] Optionnel : tout en gemini-3-pro ; prompts structurés ; phrase « same lighting » ; multi-turn (backlog)

*Phase 4 – Upload Cloudinary et rattachement produit*
- [x] Commande `./rcli images upload --ref REF --dir output/` : récupération id produit par ref, envoi bulk au backend, images attachées au produit (Cloudinary + BDD)
- [x] Doc récap pipeline : `docs/integrations/IMAGES_PRODUIT_PIPELINE.md` (photos brutes → generate → upload)

**Note** : Nano Banana retenu pour 24.10. Les 4 prompts et les règles de prise de vues sont la base du pipeline.

### 24.11 Plan Claude Code – étape par étape

**Objectif** : Intégrer **Claude Code** (terminal + contexte projet) pour clôturer la Phase 24 et accompagner la Phase 25. Contexte détaillé : `docs/context/CLAUDE_CODE_CURSOR_CONTEXT.md`. Fichier lu par Claude dans le repo : `CLAUDE.md` (racine).

**État** : **Setup complet (étapes 1–8) terminé.** Étapes 9–10 = usage au fil de l’eau (batch images, clôture Phase 24, support Phase 25).

**À cocher au fur et à mesure** :

*Étape 1 – Installation et connexion*
- [x] Installer Claude Code : `curl -fsSL https://claude.ai/install.sh | bash` (ou `brew install --cask claude-code`)
- [x] Lancer `claude` puis `/login` ; vérifier que le compte est bien connecté
- [ ] Vérifier la version : `claude --version` (ou équivalent selon doc officielle)

*Étape 2 – Contexte projet*
- [x] Vérifier que `CLAUDE.md` existe à la racine du projet (résumé projet, règles DB/déploiement, CLI, références)
- [x] Lire `docs/context/CLAUDE_CODE_CURSOR_CONTEXT.md` (vision Cursor vs Claude Code, workflows, setup)
- [x] Dans le repo : `claude -p "what does this project do?"` → réponse cohérente avec Reboul Store / Phase 24–25

*Étape 3 – Vérification CLI*
- [x] `claude -p "list the main ./rcli command groups"` → doit mentionner db, images, roadmap, docs, server
- [x] `claude -p "how do I generate product images from raw photos?"` → doit décrire `./rcli images generate` et pipeline (photos/ → output/ → upload)
- [x] Demander à Claude : « Run ./rcli images --help and summarize » → exécution correcte et résumé des sous-commandes

*Étape 4 – Première tâche concrète (DB)*
- [x] Donner une ref produit (ex. d’une feuille de stock) et demander : « Vérifie si ce produit existe en base avec ./rcli db ref REF »
- [x] Vérifier que Claude exécute la commande et interprète le résultat (produit trouvé ou non, variants, stocks)

*Étape 5 – Première tâche concrète (images IA)*
- [x] Préparer un dossier `photos/` avec au moins une photo test + `refs/` si besoin
- [x] Demander à Claude : « Run ./rcli images generate --input-dir photos -o output/ and tell me the result »
- [x] Vérifier que les 4 fichiers sortent dans `output/` ; si oui, demander : « Now run ./rcli images upload --ref REF --dir output/ (with a real product ref) » (backend doit tourner)

*Étape 6 – Roadmap et doc*
- [x] Demander : « Update ROADMAP_COMPLETE.md to check the task "24.11 Plan Claude Code – étape par étape" for the steps we just completed »
- [x] Ou : « Run ./rcli roadmap update --task "24.11 Plan Claude Code" » (si une tâche unique existe côté CLI)
- [x] Demander : « Run ./rcli docs sync » et vérifier que la doc est synchronisée

*Étape 7 – Git*
- [x] Demander : « What files have I changed? » puis « Commit my changes with a descriptive message (feat: add Claude Code plan and context) »
- [x] Vérifier que le message suit les conventions (type(scope): message)

*Étape 8 – Règles critiques (vérification)*
- [x] Demander : « Before running a database migration, what should we do? » → doit mentionner backup (./rcli db backup --server)
- [x] Demander : « Can we run docker compose down -v on this project? » → doit répondre non (risque volumes DB)

*Étape 9 – Clôture Phase 24 avec Claude*
- [ ] Utiliser Claude pour batch images : liste de refs → pour chaque ref, `db ref` puis si OK `images generate` (depuis photos dédiées) puis `images upload`
- [ ] Utiliser Claude pour cocher les tâches 24.7 / 24.9 / 24.11 dans la roadmap quand les critères sont remplis
- [ ] Utiliser Claude pour `./rcli docs sync` après chaque grosse avancée

*Étape 10 – Phase 25 (support)*
- [ ] Après chaque livrable Phase 25 (recherche, Home, SEO, etc.) : demander à Claude de mettre à jour la roadmap et lancer `./rcli docs sync`
- [ ] Utiliser Claude pour commits conventionnels et résumés de changements
- [ ] Optionnel : demander à Claude de vérifier les refs d’une feuille de stock avec `db ref` avant import

**Références** : `CLAUDE.md`, `docs/context/CLAUDE_CODE_CURSOR_CONTEXT.md`, `docs/integrations/IMAGES_PRODUIT_PIPELINE.md`, `docs/context/DB_CLI_USAGE.md`.

### 24.8 Ajout continu produits

**Objectif** : Pouvoir ajouter de nouvelles collections ou nouveaux produits en continu.

**📊 Statut** : **Couvert par le workflow 24.5bis.** Pour une nouvelle collection ou de nouveaux produits : même processus (feuille de stock ou CSV → `feuille-to-csv` si besoin → `merge-pages` si plusieurs fichiers → wipe collection si repartir de zéro → `category-create` pour les catégories manquantes → import Admin). Aucune sous-tâche spécifique à faire en plus.

- [x] Processus = import collection (24.5bis), réutilisable pour chaque nouvelle collection ou lot.
- [ ] Optionnel : documenter dans un paragraphe « Ajout d’une nouvelle collection » dans `docs/context/FEUILLES_STOCK_REBOUL.md` (déjà décrit en pratique).

### 24.9 Checklist Finale - Validation Collection

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
  - [ ] Vérification rotation collections
  - [ ] Vérification ajout continu produits
  - [ ] Vérification alertes réassort (stocks 0-5 unités)
  - [ ] Vérification variants complexes (couleurs multiples, tailles différentes)

---

## 🚀 Phase 25 : Finalisation Avant Lancement

**🎯 Objectif** : Finaliser toutes les fonctionnalités critiques et améliorations essentielles avant le lancement officiel

**📅 Timing** : Après Phase 24 (Collection Réelle), avant lancement Février 2025

**⏱️ Durée estimée** : 2-3 semaines

**📅 Date cible** : Février 2025 (avant lancement)

**📋 Statut** : ⏳ À FAIRE

### 📋 Ordre Logique des Sous-Phases

**Ordre d'exécution recommandé** :
1. **25.1** Recherche Produits (Backend + Frontend) - 🔴 **CRITICAL**
2. **25.2** Page Home Complète (Frontend) - 🔴 **CRITICAL**
3. **25.3** SEO de Base (Backend + Frontend) - 🟡 **HIGH**
4. **25.4** Tests Critiques (E2E, Intégration) - 🟡 **HIGH**
5. **25.5** Performance de Base (Optimisations essentielles) - 🟡 **HIGH**
6. **25.6** Dashboard Admin Stats (Admin) - 🟡 **HIGH**
7. **25.7** Filtres Avancés Catalog (Frontend) - 🟡 **HIGH**

**Dépendances clés** :
- 25.1 (Recherche) → **AVANT** 25.7 (Filtres Avancés)
- 25.2 (Home) peut être fait en parallèle
- 25.3 (SEO) peut être fait en parallèle
- 25.4 (Tests) → **APRÈS** toutes les fonctionnalités
- 25.5 (Performance) peut être fait en parallèle

### 25.1 Recherche Produits (Backend + Frontend) 🔴 CRITICAL

**Objectif** : Implémenter recherche full-text des produits

**📊 Informations** : Essentiel pour l'UX, recherche par nom, référence, description

**Note** : Frontend partiellement fait (Phase 19.1), mais backend manquant

- [ ] **Backend** :
  - [ ] Endpoint GET /products/search?q=query (recherche fulltext)
  - [ ] Installer pg-search ou TypeORM fulltext search
  - [ ] Recherche dans : name, reference, description
  - [ ] Filtres combinables (catégorie, marque, prix)
  - [ ] Tri (pertinence, prix, nouveautés)
  - [ ] Pagination

- [x] **Frontend** (déjà fait - Phase 19.1) :
  - [x] Barre de recherche Header (autocomplete) ✅
  - [x] Page /search?q=query ✅
  - [x] Sidebar filtres (catégorie, prix, couleur, taille, note) ✅
  - [x] Tri (pertinence, prix, nouveautés, meilleures ventes) ✅
  - [x] Pagination ou infinite scroll ✅
  - [ ] Connecter au backend search endpoint (à faire)

- [ ] **Validation** :
  - [ ] Tester recherche avec différents termes
  - [ ] Vérifier performance (pas de lag)
  - [ ] Vérifier résultats pertinents

### 25.2 Page Home Complète (Frontend) 🔴 CRITICAL

**Objectif** : Compléter la page d'accueil avec contenu réel et sections

**📊 Informations** : Page actuellement basique, besoin de sections complètes

- [ ] **Sections Home** :
  - [ ] Hero section (image/vidéo + CTA)
  - [ ] Section produits featured/nouveautés
  - [ ] Section marques (BrandCarousel déjà créé ✅)
  - [ ] Section catégories populaires
  - [ ] Section actualités/blog (optionnel)
  - [ ] Footer (déjà créé ✅)

- [ ] **Contenu dynamique** :
  - [ ] Produits featured depuis API (derniers produits, best-sellers)
  - [ ] Catégories populaires depuis API
  - [ ] Gestion loading/error states

- [ ] **Design** :
  - [ ] Style aligné avec design system A-COLD-WALL*
  - [ ] Responsive (mobile/tablette/desktop)
  - [ ] Animations AnimeJS (si nécessaire)

- [ ] **Validation** :
  - [ ] Tester affichage avec données réelles
  - [ ] Vérifier responsive
  - [ ] Vérifier performance

### 25.3 SEO de Base (Backend + Frontend) 🟡 HIGH

**Objectif** : Mettre en place les bases du référencement

**📊 Informations** : Essentiel pour visibilité Google, partage réseaux sociaux

- [ ] **Backend** :
  - [ ] Générer sitemap.xml dynamique (backend)
  - [ ] Endpoint GET /sitemap.xml
  - [ ] robots.txt (fichier statique ou dynamique)
  - [ ] URLs SEO-friendly (vérifier slugs partout)

- [ ] **Frontend** :
  - [ ] Metadata dynamique par page (React Helmet ou équivalent)
  - [ ] Open Graph tags (partage réseaux sociaux)
  - [ ] Structured data (JSON-LD pour produits)
  - [ ] Title, description, keywords par page
  - [ ] Canonical URLs

- [ ] **Validation** :
  - [ ] Tester sitemap.xml (Google Search Console)
  - [ ] Tester Open Graph (Facebook Debugger)
  - [ ] Vérifier structured data (Google Rich Results Test)

### 25.4 Tests Critiques (E2E, Intégration) 🟡 HIGH

**Objectif** : Assurer qualité et stabilité avant lancement

**📊 Informations** : Tests essentiels pour éviter bugs en production

- [ ] **Tests E2E Backend** :
  - [ ] Flow complet : register → login → add cart → checkout
  - [ ] Tests endpoints critiques (products, cart, orders)
  - [ ] Tests authentification (login, register, JWT)

- [ ] **Tests E2E Frontend** :
  - [ ] Parcours utilisateur complet (navigation → produit → panier → checkout)
  - [ ] Tests formulaires (register, login, checkout)
  - [ ] Tests responsive (mobile/tablette/desktop)

- [ ] **Tests Intégration** :
  - [ ] Tests API (endpoints principaux)
  - [ ] Tests services critiques (Products, Cart, Orders, Auth)

- [ ] **Validation** :
  - [ ] Tous les tests passent
  - [ ] Coverage minimum 60% (backend)
  - [ ] Documentation tests

### 25.5 Performance de Base (Optimisations Essentielles) 🟡 HIGH

**Objectif** : Optimiser performance pour expérience utilisateur fluide

**📊 Informations** : Optimisations essentielles, pas toutes les optimisations avancées

- [ ] **Frontend** :
  - [ ] Lazy loading images (react-lazy-load-image ou équivalent)
  - [ ] Code splitting (React.lazy, Suspense pour routes)
  - [ ] Minification assets (Vite build - déjà fait ✅)
  - [ ] Compression (gzip/brotli sur Nginx - déjà configuré ✅)

- [ ] **Backend** :
  - [ ] Index database (colonnes souvent filtrées : name, categoryId, brandId)
  - [ ] Optimiser requêtes TypeORM (éviter N+1 queries)
  - [ ] Pagination obligatoire (max 100 items - déjà fait ✅)
  - [ ] Compression responses (NestJS compression)

- [ ] **Validation** :
  - [ ] Lighthouse score > 80 (Performance)
  - [ ] Temps de chargement < 3s
  - [ ] Pas de lag dans l'interface

### 25.6 Dashboard Admin Stats (Admin) 🟡 HIGH

**Objectif** : Ajouter statistiques et KPIs dans le dashboard Admin

**📊 Informations** : Dashboard actuel basique, besoin de stats utiles

- [ ] **Statistiques à afficher** :
  - [ ] CA total (période : aujourd'hui, semaine, mois)
  - [ ] Nombre commandes (période)
  - [ ] Produits en stock faible (0-5 unités)
  - [ ] Commandes en attente
  - [ ] Top produits vendus
  - [ ] Graphiques (évolution CA, commandes)

- [ ] **Backend** :
  - [ ] Endpoints stats (GET /admin/reboul/stats)
  - [ ] Calculs CA, commandes, produits
  - [ ] Filtres par période (jour, semaine, mois)

- [ ] **Frontend** :
  - [ ] Composants graphiques (Chart.js ou équivalent)
  - [ ] Cards statistiques
  - [ ] Filtres période
  - [ ] Design responsive

- [ ] **Validation** :
  - [ ] Vérifier calculs corrects
  - [ ] Tester avec données réelles
  - [ ] Vérifier performance (pas de lag)

### 25.7 Filtres Avancés Catalog (Frontend) 🟡 HIGH

**Objectif** : Améliorer filtres dans la page Catalog

**📊 Informations** : Filtres actuels basiques (catégorie, marque), besoin de plus

- [ ] **Filtres à ajouter** :
  - [ ] Filtre par prix (slider min/max)
  - [ ] Filtre par couleur
  - [ ] Filtre par taille
  - [ ] Filtre par disponibilité (en stock, rupture)
  - [ ] Tri avancé (pertinence, prix croissant/décroissant, nouveautés)

- [ ] **Interface** :
  - [ ] Sidebar filtres (desktop)
  - [ ] Modal filtres (mobile)
  - [ ] Badges filtres actifs
  - [ ] Bouton "Réinitialiser filtres"

- [ ] **Backend** :
  - [ ] Endpoint GET /products avec tous les filtres
  - [ ] Validation filtres
  - [ ] Performance (index database)

- [ ] **Validation** :
  - [ ] Tester tous les filtres
  - [ ] Vérifier combinaisons filtres
  - [ ] Vérifier performance

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
- **Phase 17.11** : Docker & Déploiement Production Ready ✅
- **Phase 17.12** : Tests E2E critiques
- **Note** : Animations déjà complétées dans Phase 14.6
- **Résultat** : Gestion complète de Reboul depuis l'Admin Centrale + Infrastructure prête pour déploiement

### 🟢 Priorité 3 (Collection Réelle & Finalisation - FÉVRIER 2025) - Phases 24-25
- **Phase 24** : Préparation Collection Réelle 🟢 EN COURS
  - **Workflow collection (données)** : ✅ en place. Reste : **images produit (24.7)** pour boucler.
  - ✅ 24.1 Doc, 24.2 Marques, 24.4 Rotation, 24.5bis Import, 24.6 CLI DB ; 24.8 = couvert par 24.5bis
  - ⏳ 24.3 Politique livraison, 24.7 Images, 24.9 Checklist ; ✅ 24.10 Pipeline images IA en place
- **Phase 25** : Finalisation Avant Lancement ⏳ À FAIRE
  - 🔴 25.1 Recherche Produits (CRITICAL)
  - 🔴 25.2 Page Home Complète (CRITICAL)
  - 🟡 25.3 SEO de Base (HIGH)
  - 🟡 25.4 Tests Critiques (HIGH)
  - 🟡 25.5 Performance de Base (HIGH)
  - 🟡 25.6 Dashboard Admin Stats (HIGH)
  - 🟡 25.7 Filtres Avancés Catalog (HIGH)
- **Résultat** : Site Reboul prêt pour lancement avec collection réelle, recherche, SEO, tests

### 📝 Notes :
- **Page Home** : Améliorations progressives au fil du temps
- **Données réelles** : **Phase 24 - Préparation Collection Réelle** 🟢 **EN COURS**
  - **Workflow ajout de collection (données)** : ✅ en place (feuilles → CSV → merge → wipe → catégories → import Admin ; CLI : feuille-to-csv, merge-pages, db ref, etc.). Ex. Stone SS26 importé (69 produits, 332 variants).
  - ✅ 24.1 Documentation, 24.2 Marques, 24.4 Rotation collections, 24.5bis Import collections, 24.6 CLI DB
  - ⏳ **24.7 Images produit** : à finaliser (dernier bloc pour boucler le workflow)
  - ⏳ 24.3 Politique livraison, 24.9 Checklist finale
  - ✅ 24.10 Pipeline images IA (photos brutes → generate → upload), voir `IMAGES_PRODUIT_PIPELINE.md`
  - **Voir** : `docs/context/FEUILLES_STOCK_REBOUL.md`, `docs/context/DB_CLI_USAGE.md`, `docs/COLLECTION_REAL.md`, `docs/integrations/IMAGES_PRODUIT_PIPELINE.md` (pipeline images IA)
- **Finalisation avant lancement** : **🆕 Phase 25 - Finalisation Avant Lancement** ⏳ **À FAIRE**
  - 🔴 **25.1** Recherche Produits (Backend + Frontend) - CRITICAL
  - 🔴 **25.2** Page Home Complète (Frontend) - CRITICAL
  - 🟡 **25.3** SEO de Base (Backend + Frontend) - HIGH
  - 🟡 **25.4** Tests Critiques (E2E, Intégration) - HIGH
  - 🟡 **25.5** Performance de Base (Optimisations essentielles) - HIGH
  - 🟡 **25.6** Dashboard Admin Stats (Admin) - HIGH
  - 🟡 **25.7** Filtres Avancés Catalog (Frontend) - HIGH

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

**📦 Phase 24 - Préparation Collection Réelle (2-3 semaines après déploiement)** 🟡 **EN PRÉPARATION** :
- **📝 Documentation** : Créer docs (COLLECTION_REAL.md, AS400_INTEGRATION.md, IMAGES_WORKFLOW.md)
- **🏷️ Marques** : Insertion 36 marques avec logos (depuis ancien git)
- **🚚 Politiques** : Finaliser politiques livraison avec équipe Reboul (réunion en magasin)
- **🔗 AS400** : Intégration données magasin (journée en magasin pour analyser structure, transformation, import, sync stocks quotidienne)
- **📸 Images** : Workflow images produits (shooting à Aubagne, retouche Photoshop, Cloudinary, 3-5 images/produit, convention nommage à définir)
- **🔄 Rotation Collections** : Système actif/archivée (nouvelle collection remplace ancienne) ⚠️ **NOUVEAU**
- **➕ Ajout Continu** : Workflow nouveaux produits chaque semaine ⚠️ **NOUVEAU**
- **📊 Stocks** : Sync quotidienne + alertes réassort (0-5 unités) ⚠️ **NOUVEAU**
- **✅ Validation** : Checklist complète collection réelle
- **📋 Voir** : `docs/PHASE_24_SYNTHESE.md` (synthèse) et `docs/PHASE_24_FAQ_MAGASIN.md` (FAQ magasin)

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
