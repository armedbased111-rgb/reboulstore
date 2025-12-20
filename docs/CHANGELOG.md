# 📝 Changelog - Reboul Store

> Généré automatiquement le 16/12/2025 à 15:30

## Vue d'ensemble

**Total phases complétées** : 6

---

## Phases complétées

### Phase 8

#### Phase 8.5 : Feature Brands (COMPLÉTÉ)

**Tâches complétées** :
- Créer entité Brand (id, name, slug, description, logoUrl, megaMenuImage1, megaMenuImage2)
- Relation Brand → Products (OneToMany)
- Relation Product → Brand (ManyToOne, brandId)
- Créer module Brands
- DTOs (CreateBrandDto, UpdateBrandDto)
- Service Brands (findAll, findOne, findBySlug, create, update, delete)
- Controller Brands (CRUD complet)
- Enregistrer dans AppModule
- Ajouter brandId dans Product entity
- Charger relation brand dans ProductsService

**Type** : Backend

---

### Phase 9

#### Phase 9 : Backend - Authentification & Utilisateurs (COMPLÉTÉ)

**Tâches complétées** :
- Créer entité User (id, email, password hash, firstName, lastName, phone, role, isVerified, timestamps)
- Enum UserRole (CLIENT, ADMIN, SUPER_ADMIN)
- Créer entité Address (id, userId, street, city, postalCode, country, isDefault)
- Relations User → Addresses (OneToMany)
- Relations User → Orders (OneToMany)
- Installer @nestjs/jwt, @nestjs/passport, bcrypt
- Créer module Auth
- Service Auth : register(), login(), validateUser(), hashPassword()
- Guard JwtAuthGuard pour protéger routes
- DTOs : RegisterDto, LoginDto

**Type** : Backend

---

### Phase 13

#### Phase 13 : Backend - Paiement Stripe Checkout (Reboul) ✅

**Tâches complétées** :
- Installer stripe, @nestjs/stripe
- Configurer clés API Stripe (STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY, STRIPE_WEBHOOK_SECRET)
- Créer module Stripe
- Service Stripe : createCheckoutSession(), refund()
- Configuration compte Stripe Reboul (mode test - CLI configuré)
- Endpoint POST /checkout/create-session (public, guest checkout supporté)
- Recevoir items du panier (variantId, quantity) depuis frontend
- Vérifier stock disponible pour chaque item
- Calculer montant total (articles + frais livraison fixe pour MVP)
- Charger variants avec relations (Product, images, brand, category)

**Type** : Backend

---

### Phase 14

#### Phase 14 : Frontend - Historique Commandes ✅

**Tâches complétées** :
- Coder page /orders
- Afficher liste des commandes (OrderCard par commande)
- Implémenter filtres par statut (toutes, en cours, livrées, annulées)
- Implémenter tri (date, montant)
- Clic sur commande → /orders/:id
- Coder page /orders/:id
- Afficher numéro de commande
- Afficher date et heure
- Afficher statut avec timeline visuelle (OrderTimeline)
- Afficher articles commandés (liste avec images)

**Type** : Backend

#### Phase 14.5 : Frontend - Page Produit Améliorée (MVP) ✅

**Tâches complétées** :
- Récupérer stock par variant depuis API
- Afficher statut stock (Option C hybride : statut si > seuil, quantité si ≤ seuil)
- Griser variants épuisés dans sélecteurs
- Désactiver bouton "Ajouter au panier" si variant épuisé
- Afficher badge "Dernières pièces" si stock ≤ 5
- Message "Rupture de stock" au clic sur variant épuisé
- Comparer rendu avec Figma
- Tester affichage stock (en stock, stock faible, rupture)
- Tester grisage variants épuisés
- Tester désactivation bouton si épuisé

**Type** : Backend

#### Phase 14.6 : Frontend - Animations GSAP ✅

**Tâches complétées** :
- Créer documentation complète ANIMATIONS_GUIDE.md
- Créer structure animations/ (presets/, components/, utils/)
- Créer hook useGSAP pour nettoyage automatique
- Créer constantes (durées, eases, délais, stagger)
- Documenter workflow dans project-rules.mdc
- fade-in.ts : Animation fade-in réutilisable
- slide-up.ts : Animation slide-up avec fade-in
- slide-down.ts : Animation slide-down (pour menus dropdown)
- reveal-up.ts : Animation reveal depuis le bas (sections importantes)
- stagger-fade-in.ts : Animation en cascade pour listes/grilles

**Type** : Backend

---

