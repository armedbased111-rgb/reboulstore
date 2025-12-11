# 🗺️ Roadmap Complète - Reboul Store Platform

**Version** : 3.2  
**Date** : 11 décembre 2025  
**Dernière mise à jour** : Système emails invités + persistance BDD + capture manuelle paiements  
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
5. **Multi-sites** : Architecture 3 sites indépendants (Reboul → CP Company → Outlet)
6. **🎨 Workflow Figma** : Design d'abord dans Figma, puis implémentation code (voir [FIGMA_WORKFLOW.md](./FIGMA_WORKFLOW.md))

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

**📐 Workflow** : Design Figma → Code → Validation (voir [FIGMA_WORKFLOW.md](./FIGMA_WORKFLOW.md))

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

**📐 Workflow** : Design Figma → Code → Validation (voir [FIGMA_WORKFLOW.md](./FIGMA_WORKFLOW.md))

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

## 🎨 Phase 14 : Frontend - Historique Commandes

**Objectif** : Permettre à l'utilisateur de consulter ses commandes

**📐 Workflow** : Design Figma → Code → Validation (voir [FIGMA_WORKFLOW.md](./FIGMA_WORKFLOW.md))

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
- [ ] Coder page /orders
- [ ] Afficher liste des commandes (OrderCard par commande)
- [ ] Implémenter filtres par statut (toutes, en cours, livrées, annulées)
- [ ] Implémenter tri (date, montant)
- [ ] Implémenter pagination si beaucoup de commandes
- [ ] Clic sur commande → /orders/:id

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
- [ ] Coder page /orders/:id
- [ ] Afficher numéro de commande
- [ ] Afficher date et heure
- [ ] Afficher statut avec timeline visuelle (OrderTimeline)
- [ ] Afficher articles commandés (liste avec images)
- [ ] Afficher adresse de livraison
- [ ] Afficher total payé (articles + livraison)
- [ ] Afficher tracking colis (si disponible)
- [ ] Bouton "Annuler commande" (si statut PENDING/PAID)
- [ ] Bouton "Télécharger facture" (PDF)

**✅ Phase Validation** :
- [ ] Comparer rendu avec Figma
- [ ] Tester affichage détails commande (API /orders/:id)
- [ ] Tester timeline selon statut
- [ ] Tester bouton annuler (API PATCH /orders/:id/cancel)
- [ ] Tester téléchargement facture PDF

### 14.3 Composants Commandes - Design & Implémentation
**📐 Phase Design (Figma)** :
- [ ] Designer composant OrderCard (pour liste)
- [ ] Designer composant OrderTimeline (états visuels)
- [ ] Designer composant OrderItem (article dans commande)
- [ ] Designer composant TrackingInfo (suivi colis)
- [ ] Partager composants Figma et valider

**💻 Phase Implémentation** :
- [ ] Coder composant OrderCard (résumé commande dans liste)
- [ ] Coder composant OrderTimeline (visualisation étapes)
- [ ] Coder composant OrderItem (article dans commande)
- [ ] Coder composant TrackingInfo (suivi colis)

**✅ Phase Validation** :
- [ ] Comparer composants avec Figma
- [ ] Tester réutilisabilité des composants
- [ ] Tester tous les états (pending, paid, shipped, delivered, cancelled)

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

## 🎨 Phase 17 : Frontend - Admin Centrale (Connectée à Reboul)

**Objectif** : Créer Admin Centrale et la connecter au backend Reboul

**📐 Workflow** : Design Figma → Code → Validation (voir [FIGMA_WORKFLOW.md](./FIGMA_WORKFLOW.md))

**⚠️ IMPORTANT** : Pour **CHAQUE sous-phase** (Dashboard, Produits, Commandes, Users, etc.) :
1. 📐 **Designer d'abord dans Figma** (layout, composants, formulaires, tables)
2. 💻 **Partager design et valider** avant de coder
3. 🔨 **Implémenter en code** (React + shadcn/ui + TailwindCSS)
4. ✅ **Valider** rendu vs Figma + fonctionnel

### 17.1 Setup Admin Centrale
- [ ] Créer dossier `/admin` séparé (hors frontend Reboul)
- [ ] Setup Vite + React + TypeScript
- [ ] Installer TailwindCSS v4 (cohérence avec Reboul)
- [ ] Configurer routing (React Router)
- [ ] Layout admin (sidebar + topbar + site selector)
- [ ] Configuration API : pointer vers backend Reboul

### 17.2 Authentification Admin
- [ ] Page login admin (`/admin/login`)
- [ ] Vérifier rôle (ADMIN ou SUPER_ADMIN uniquement)
- [ ] Context AuthAdmin (JWT token)
- [ ] Service API auth admin
- [ ] Guard ProtectedRoute admin
- [ ] Affichage nom utilisateur + rôle

### 17.3 Dashboard Reboul
- [ ] Page `/admin/dashboard` (statistiques Reboul)
- [ ] Cartes métriques :
  - CA du jour/semaine/mois
  - Nombre commandes (total, en cours, livrées)
  - Produits actifs/en rupture
  - Nouveaux clients
- [ ] Graphiques (Chart.js ou Recharts) :
  - Évolution ventes (7 derniers jours)
  - Top 5 produits vendus
  - Répartition commandes par statut
- [ ] Liste dernières commandes (5 dernières)

### 17.4 Gestion Produits Reboul
- [ ] Page `/admin/products` (liste produits Reboul)
  - Recherche par nom/SKU
  - Filtres (catégorie, marque, stock)
  - Tri (nom, prix, stock, date création)
  - Pagination
- [ ] Page `/admin/products/new` (créer produit)
  - Formulaire complet (nom, description, prix, catégorie, marque)
  - Upload images (drag & drop, max 7)
  - Gestion variants (tableau taille/couleur/stock/prix)
  - Bouton "Créer produit"
- [ ] Page `/admin/products/:id/edit` (éditer produit)
  - Mêmes champs que création
  - Supprimer images existantes
  - Modifier variants existants
  - Preview produit (vue client)
- [ ] Composants :
  - ProductForm (formulaire réutilisable)
  - ImageUploader (drag & drop multiple)
  - VariantTable (tableau éditable variants)

### 17.5 Gestion Commandes Reboul
- [ ] Page `/admin/orders` (liste commandes)
  - Filtres par statut (pending, paid, shipped, delivered, cancelled, refunded)
  - Recherche par numéro commande/email client
  - Tri (date, montant)
  - Badge couleur par statut
- [ ] Page `/admin/orders/:id` (détails commande)
  - Infos client (nom, email, téléphone)
  - Adresse livraison/facturation
  - Liste articles (image, nom, variant, quantité, prix)
  - Total commande
  - Statut actuel avec timeline visuelle
  - Actions :
    - Changer statut (dropdown : processing → shipped → delivered)
    - Ajouter numéro tracking (input + save)
    - Rembourser commande (bouton avec confirmation)
  - Historique changements statut
- [ ] Export CSV commandes (bouton dans liste)

### 17.6 Gestion Utilisateurs Reboul
- [ ] Page `/admin/users` (liste users)
  - Recherche par nom/email
  - Filtres par rôle (CLIENT, ADMIN, SUPER_ADMIN)
  - Tri (date inscription, nombre commandes)
  - Badge rôle
- [ ] Page `/admin/users/:id` (détails user)
  - Infos personnelles (nom, email, téléphone, date inscription)
  - Liste adresses
  - Liste commandes (historique)
  - Changer rôle (dropdown : CLIENT ↔ ADMIN)
  - Désactiver/supprimer compte (avec confirmation)

### 17.7 Gestion Catégories & Marques Reboul
- [ ] Page `/admin/categories` (liste catégories enfants)
  - CRUD catégories (create, edit, delete)
  - Upload image/vidéo hero section
  - Size chart par catégorie
- [ ] Page `/admin/brands` (liste marques)
  - CRUD marques (create, edit, delete)
  - Upload logo + mega menu images/vidéos
  - Statistiques par marque (nombre produits)

### 17.8 Configuration Site Reboul
- [ ] Page `/admin/settings` (paramètres Reboul)
  - Politiques livraison (jsonb)
  - Politiques retour (jsonb)
  - Frais de livraison (standard, express)
  - Informations shop (nom, adresse, email contact)
  - Compte Stripe (affichage ID, lien dashboard Stripe)

### 17.9 Multi-Sites Preparation (UI uniquement)
- [ ] Sidebar : Section "Sites" avec liste
  - 🟢 Reboul (actif - connecté)
  - 🔴 CP Company (inactif - à venir)
  - 🔴 Outlet (inactif - à venir)
- [ ] Sélecteur de site (dropdown topbar)
- [ ] Note : Pour février, seul Reboul est fonctionnel
- [ ] UI préparée pour connexion futurs sites (CP Company, Outlet)

---

## 🐳 Phase 17.10 : Docker & Déploiement Production Ready

**Objectif** : Préparer infrastructure Docker pour déploiement février 2025

### 17.10.1 Docker Compose Production
- [ ] Créer `docker-compose.prod.yml`
- [ ] Service PostgreSQL Reboul (avec volumes persistants)
- [ ] Service Backend Reboul (NestJS production build)
- [ ] Service Frontend Reboul (Vite build + Nginx)
- [ ] Service Admin Centrale (Vite build + Nginx)
- [ ] Nginx reverse proxy (routage /api vers backend)
- [ ] Variables d'environnement (.env.production)

### 17.10.2 Configuration Nginx
- [ ] Créer `nginx.conf` production
- [ ] Routage `reboulstore.com` → Frontend Reboul
- [ ] Routage `admin.reboulstore.com` → Admin Centrale
- [ ] Routage `/api` → Backend Reboul
- [ ] SSL/TLS (Let's Encrypt)
- [ ] Compression gzip/brotli
- [ ] Cache headers assets statiques

### 17.10.3 Scripts Déploiement
- [ ] Script `deploy-reboul.sh` (build + push Docker images)
- [ ] Script `backup-db.sh` (backup PostgreSQL quotidien)
- [ ] Script `rollback.sh` (retour version précédente)
- [ ] Documentation déploiement (`DEPLOY.md`)

### 17.10.4 Monitoring & Logs
- [ ] Configuration logs centralisés (Winston)
- [ ] Health check endpoints (`/health`, `/api/health`)
- [ ] Monitoring uptime (simple ping)
- [ ] Sentry (monitoring erreurs - optionnel)

---

## 🧪 Phase 17.11 : Tests E2E Critiques (Avant Février)

**Objectif** : Tests bout en bout pour valider parcours utilisateur

### 17.11.1 Setup Tests E2E
- [ ] Installer Playwright (ou Cypress)
- [ ] Configuration tests (`playwright.config.ts`)
- [ ] Base de données de test (séparée)
- [ ] Script `npm run test:e2e`

### 17.11.2 Tests Parcours Client
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

### 17.11.3 Tests Parcours Admin
- [ ] Test : Login admin
- [ ] Test : Créer produit complet (avec variants + images)
- [ ] Test : Modifier produit existant
- [ ] Test : Changer statut commande (paid → shipped → delivered)
- [ ] Test : Ajouter tracking number
- [ ] Test : Créer catégorie + marque
- [ ] Test : Dashboard (vérifier chargement statistiques)

### 17.11.4 Tests Critiques Paiement
- [ ] Test : Paiement réussi (carte test Stripe)
- [ ] Test : Paiement échoué (carte test refusée)
- [ ] Test : Webhook Stripe (payment_intent.succeeded)
- [ ] Test : Remboursement commande depuis admin
- [ ] Test : Stock décrémenté après paiement
- [ ] Test : Stock ré-incrémenté après remboursement

### 17.11.5 CI/CD Tests
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

### 🔴 Priorité 1 (MVP Reboul - FÉVRIER 2025) - Phases 9-14
- **Phases 9-10** : Backend Auth + Frontend Auth UI
- **Phases 11-12** : Backend Commandes + Frontend Panier & Checkout
- **Phases 13-14** : Backend Stripe + Frontend Historique Commandes
- **Résultat** : Site Reboul (catégorie enfants) fonctionnel de bout en bout

### 🟡 Priorité 2 (Admin Centrale - FÉVRIER 2025) - Phases 15-17.11
- **Phases 15-16** : Backend Cloudinary + Admin & Permissions
- **Phase 17** : **Admin Centrale** connectée à Reboul (interface complète)
- **Phase 17.10** : Docker Production Ready
- **Phase 17.11** : Tests E2E critiques
- **Résultat** : Gestion complète de Reboul depuis l'Admin Centrale + Infrastructure prête pour déploiement

### 📝 Notes :
- **Page Home** : Améliorations progressives au fil du temps
- **Données réelles** : Ajout de la collection réelle via Admin après Phase 17

### 🟢 Priorité 3 (Expansion Multi-Sites) - Après Reboul
- **CP Company** : Créer Frontend + Backend + Database (même structure que Reboul)
- **Outlet** : Créer Frontend + Backend + Database (même structure que Reboul)
- Connecter CP Company et Outlet à l'Admin Centrale
- **Résultat** : 3 sites indépendants gérés depuis une seule Admin

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

**Semaine 5-6 (8-21 janvier 2025)** : Paiement & Historique
- ✅ Phase 13 : Backend Stripe (5 jours)
- ✅ Phase 14 : Frontend Historique Commandes (3 jours)

**🎉 CHECKPOINT 1** : Site Reboul fonctionnel (client peut acheter) ✅

**Semaine 7 (22-28 janvier 2025)** : Images & Admin Backend
- ✅ Phase 15 : Backend Cloudinary (3 jours)
- ✅ Phase 16 : Backend Admin & Permissions (4 jours)

**Semaine 8-9 (29 janvier - 11 février 2025)** : Admin Centrale
- ✅ Phase 17.1-17.8 : Frontend Admin Centrale complète (10 jours)
- ✅ Phase 17.9 : Préparation UI multi-sites (2 jours)

**Semaine 10 (12-18 février 2025)** : Production & Tests
- ✅ Phase 17.10 : Docker Production + Déploiement (4 jours)
- ✅ Phase 17.11 : Tests E2E critiques (3 jours)

**🎉 CHECKPOINT 2** : Admin Centrale connectée + Infrastructure prod ✅

### 📊 Résumé :

- **🔴 Reboul MVP (Phases 9-14)** : ~6 semaines (10 déc - 21 jan)
- **🟡 Admin Centrale (Phases 15-17.11)** : ~4 semaines (22 jan - 18 fév)
- **📦 TOTAL FÉVRIER 2025** : ~10 semaines (2,5 mois)

### 🚀 Post-Février 2025 :

- **📝 Ajout données réelles** : Utiliser Admin Centrale pour ajouter la collection
- **🎨 Amélioration Home** : Progressivement selon idées
- **📧 Redesign Templates Email** : Designer tous les templates d'email dans Figma et réimporter (basse priorité)
  - Templates : confirmation inscription, confirmation commande, expédition, livraison, annulation
  - Design cohérent avec l'identité de marque Reboul
  - Adaptation HTML/CSS inline pour compatibilité email
- **🟢 CP Company + Outlet** : ~4-6 semaines (mars-avril 2025)
- **🟣 Fonctionnalités avancées** : ~8-12 semaines (mai-juillet 2025)
- **🔵 Optimisation** : Continu

---

**🎯 Prochaine phase recommandée** : **Phase 9 - Backend Auth & Users** 🚀
