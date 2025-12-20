# Documentation Composants & Hooks - Reboul Store

> Documentation générée automatiquement le 16/12/2025 à 15:27

## Vue d'ensemble

Cette documentation liste tous les composants React et hooks disponibles dans le frontend.

**Total** : 53 composants et 7 hooks

---

## Composants React

### Components

#### `ProtectedRoute`

- **Fichier** : `components/ProtectedRoute.tsx`
- **Props Interface** : `ProtectedRouteProps`

| Prop | Type | Requis |
|------|------|--------|
| `children` | `React.ReactNode` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <ProtectedRoute children={ } />
  ```

---

### Cart

#### `CartItem`

- **Fichier** : `components/cart/CartItem.tsx`
- **Props Interface** : `CartItemProps`

| Prop | Type | Requis |
|------|------|--------|
| `item` | `CartItemType` | ✅ |
| `onUpdateQuantity` | `(itemId: string, quantity: number) => Promise<void>` | ✅ |
| `onRemove` | `(itemId: string) => Promise<void>` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <CartItem item={ item } onUpdateQuantity="onUpdateQuantity" onRemove="onRemove" />
  ```

---

#### `CartSummary`

- **Fichier** : `components/cart/CartSummary.tsx`
- **Props Interface** : `CartSummaryProps`

| Prop | Type | Requis |
|------|------|--------|
| `subtotal` | `number` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <CartSummary subtotal={0} />
  ```

---

#### `EmptyCart`

- **Fichier** : `components/cart/EmptyCart.tsx`
- **Props** : Aucune

- **Exemple d'utilisation** :

  ```tsx
  <EmptyCart />
  ```

---

### Catalog

#### `ProductGrid`

Composant ProductGrid - Grille de produits style A-COLD-WALL Structure exacte copiée depuis A-COLD-WALL* : - Grille CSS avec gap de 2px - Responsive : 2 colonnes mobile, auto-fit avec minmax desktop - Liste <ul> avec <li> pour chaque produit

- **Fichier** : `components/catalog/ProductGrid.tsx`
- **Props Interface** : `ProductGridProps`

| Prop | Type | Requis |
|------|------|--------|
| `products` | `Product[]` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <ProductGrid products={ product } />
  ```

---

### Checkout

#### `ContactForm`

- **Fichier** : `components/checkout/ContactForm.tsx`
- **Props** : Aucune

- **Exemple d'utilisation** :

  ```tsx
  <ContactForm />
  ```

---

#### `DeliveryForm`

- **Fichier** : `components/checkout/DeliveryForm.tsx`
- **Props** : Aucune

- **Exemple d'utilisation** :

  ```tsx
  <DeliveryForm />
  ```

---

#### `ExpressCheckout`

- **Fichier** : `components/checkout/ExpressCheckout.tsx`
- **Props** : Aucune

- **Exemple d'utilisation** :

  ```tsx
  <ExpressCheckout />
  ```

---

#### `OrderSummary`

- **Fichier** : `components/checkout/OrderSummary.tsx`
- **Props Interface** : `OrderSummaryProps`

| Prop | Type | Requis |
|------|------|--------|
| `cart` | `Cart | null` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <OrderSummary cart={ item } />
  ```

---

#### `PaymentForm`

- **Fichier** : `components/checkout/PaymentForm.tsx`
- **Props** : Aucune

- **Exemple d'utilisation** :

  ```tsx
  <PaymentForm />
  ```

---

#### `ShippingMethod`

- **Fichier** : `components/checkout/ShippingMethod.tsx`
- **Props** : Aucune

- **Exemple d'utilisation** :

  ```tsx
  <ShippingMethod />
  ```

---

### Home

#### `CategorySection`

- **Fichier** : `components/home/CategorySection.tsx`
- **Props** : Aucune

- **Exemple d'utilisation** :

  ```tsx
  <CategorySection />
  ```

---

#### `FeaturedProducts`

Composant pour une image produit avec gestion d'erreur Utilise un état pour éviter les boucles infinies de re-render

- **Fichier** : `components/home/FeaturedProducts.tsx`
- **Props Interface** : `FeaturedProductsProps`

| Prop | Type | Requis |
|------|------|--------|
| `ex` | `"Winter Sale", "ACW* Arsenal") */
  title: string` | ✅ |
| `products` | `Product[]` | ❌ |
| `categorySlug` | `string` | ❌ |
| `défaut` | `10) */
  limit?: number` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <FeaturedProducts ex="ex" />
  ```

---

#### `HeroSectionImage`

Props du composant HeroSectionImage Ces props permettent de personnaliser le contenu du hero

- **Fichier** : `components/home/HeroSectionImage.tsx`
- **Props Interface** : `HeroSectionImageProps`

| Prop | Type | Requis |
|------|------|--------|
| `ex` | `"Winter Sale") */
  title: string` | ✅ |
| `ex` | `"Up To 50% Off") */
  subtitle: string` | ✅ |
| `ex` | `"Shop now") */
  buttonText: string` | ✅ |
| `ex` | `"/catalog") */
  buttonLink: string` | ✅ |
| `imageSrc` | `string` | ❌ |
| `videoSrc` | `string` | ❌ |
| `défaut` | `"4/5") */
  aspectRatioMobile?: string` | ❌ |
| `défaut` | `"2/1") - Ignoré si heightClass est fourni */
  aspectRatioDesktop?: string` | ❌ |
| `défaut` | `"md:max-h-[90vh]") */
  maxHeightClass?: string` | ❌ |
| `ex` | `"md:h-[500px]") - Si fourni, remplace aspectRatioDesktop */
  heightClass?: string` | ❌ |
| `vidéo` | `"cover" (remplit tout, peut couper) ou "contain" (affiche tout, peut laisser de l'espace) */
  objectFit?: 'cover' | 'contain'` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <HeroSectionImage ex="ex" ex="ex" ex="ex" ex="ex" />
  ```

---

#### `HeroSectionVideo`

Props du composant HeroSectionVideo Ces props permettent de personnaliser le contenu du hero

- **Fichier** : `components/home/HeroSectionVideo.tsx`
- **Props Interface** : `HeroSectionVideoProps`

| Prop | Type | Requis |
|------|------|--------|
| `ex` | `"Winter Sale") */
  title: string` | ✅ |
| `ex` | `"Up To 50% Off") */
  subtitle: string` | ✅ |
| `ex` | `"Shop now") */
  buttonText: string` | ✅ |
| `ex` | `"/catalog") */
  buttonLink: string` | ✅ |
| `videoSrc` | `string` | ✅ |
| `ex` | `"video/mp4", "video/webm") - optionnel, par défaut "video/mp4" */
  videoType?: string` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <HeroSectionVideo ex="ex" ex="ex" ex="ex" ex="ex" videoSrc="videoSrc" />
  ```

---

#### `PromoCard`

Props du composant PromoCard Ce composant est réutilisable pour promouvoir différents contenus : - Hôtels, boutiques, collaborations, podcasts, etc.

- **Fichier** : `components/home/PromoCard.tsx`
- **Props Interface** : `PromoCardProps`

| Prop | Type | Requis |
|------|------|--------|
| `imageUrl` | `string` | ✅ |
| `imageAlt` | `string` | ❌ |
| `imageLink` | `string` | ❌ |
| `imageLinkExternal` | `boolean` | ❌ |
| `ex` | `"A-COLD-WALL* MATERIAL STUDY") */
  overlayTopText?: string` | ❌ |
| `ex` | `"Alaska Alaska") */
  overlayTitle?: string` | ❌ |
| `ex` | `"003") */
  overlayNumber?: string` | ❌ |
| `title` | `string` | ✅ |
| `description` | `string[]` | ✅ |
| `gridImage1` | `string` | ❌ |
| `gridImage1Alt` | `string` | ❌ |
| `gridImage1Link` | `string` | ❌ |
| `gridImage1Description` | `string` | ❌ |
| `gridImage2` | `string` | ❌ |
| `gridImage2Alt` | `string` | ❌ |
| `gridImage2Link` | `string` | ❌ |
| `gridImage2Description` | `string` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <PromoCard imageUrl="imageUrl" />
  ```

---

### Layout

#### `Footer`

Interface pour les liens de navigation interne (Customer Service)

- **Fichier** : `components/layout/Footer.tsx`
- **Props Interface** : `FooterProps`

| Prop | Type | Requis |
|------|------|--------|
| `Logo` | `texte ou composant React (SVG, etc.) */
  logo?: ReactNode` | ❌ |
| `customerServiceLinks` | `FooterNavLink[]` | ❌ |
| `socialLinks` | `FooterSocialLink[]` | ❌ |
| `slogan` | `string` | ❌ |
| `legalInfo` | `FooterLegalInfo` | ❌ |
| `className` | `string` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <Footer />
  ```

---

#### `Header`

- **Fichier** : `components/layout/Header.tsx`
- **Props** : Aucune

- **Exemple d'utilisation** :

  ```tsx
  <Header />
  ```

---

#### `Layout`

Composant Layout - Wrapper principal de l'application Structure : Header + Contenu principal + Footer TODO: Remplacer le styling placeholder par les maquettes Figma/Framer

- **Fichier** : `components/layout/Layout.tsx`
- **Props Interface** : `LayoutProps`

| Prop | Type | Requis |
|------|------|--------|
| `children` | `ReactNode` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <Layout children={ } />
  ```

---

#### `PromoBanner`

- **Fichier** : `components/layout/PromoBanner.tsx`
- **Props** : Aucune

- **Exemple d'utilisation** :

  ```tsx
  <PromoBanner />
  ```

---

### Loaders

#### `NavigationLoader`

- **Fichier** : `components/loaders/NavigationLoader.tsx`
- **Props** : Aucune

- **Exemple d'utilisation** :

  ```tsx
  <NavigationLoader />
  ```

---

#### `PageLoader`

State du loader tel que défini dans Figma : - "default" : animation en boucle (chargement en cours) - "loaded" : état chargé (barre remplie, animation stoppée)

- **Fichier** : `components/loaders/PageLoader.tsx`
- **Props** : Aucune

- **Exemple d'utilisation** :

  ```tsx
  <PageLoader />
  ```

---

#### `TopBarLoader`

- **Fichier** : `components/loaders/TopBarLoader.tsx`
- **Props** : Aucune

- **Exemple d'utilisation** :

  ```tsx
  <TopBarLoader />
  ```

---

### Orders

#### `OrderCard`

Fonction pour obtenir la couleur du badge selon le statut (selon design Figma)

- **Fichier** : `components/orders/OrderCard.tsx`
- **Props Interface** : `OrderCardProps`

| Prop | Type | Requis |
|------|------|--------|
| `order` | `Order` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <OrderCard order={ } />
  ```

---

#### `OrderDetailHeader`

Fonction pour formater la date complète

- **Fichier** : `components/orders/OrderDetailHeader.tsx`
- **Props Interface** : `OrderDetailHeaderProps`

| Prop | Type | Requis |
|------|------|--------|
| `orderId` | `string` | ✅ |
| `createdAt` | `string` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <OrderDetailHeader orderId="orderId" createdAt="createdAt" />
  ```

---

#### `OrderItem`

Composant OrderItem - Affiche un article dans une commande

- **Fichier** : `components/orders/OrderItem.tsx`
- **Props Interface** : `OrderItemProps`

| Prop | Type | Requis |
|------|------|--------|
| `item` | `CartItem` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <OrderItem item={ item } />
  ```

---

#### `OrderItemDetail`

Composant pour afficher un article individuel dans le détail de commande

- **Fichier** : `components/orders/OrderItemDetail.tsx`
- **Props Interface** : `OrderItemDetailProps`

| Prop | Type | Requis |
|------|------|--------|
| `item` | `CartItem` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <OrderItemDetail item={ item } />
  ```

---

#### `OrderItemsList`

Composant pour afficher la liste des articles d'une commande

- **Fichier** : `components/orders/OrderItemsList.tsx`
- **Props Interface** : `OrderItemsListProps`

| Prop | Type | Requis |
|------|------|--------|
| `items` | `CartItem[]` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <OrderItemsList items={ item } />
  ```

---

#### `OrderShippingAddress`

Composant pour afficher l'adresse de livraison

- **Fichier** : `components/orders/OrderShippingAddress.tsx`
- **Props Interface** : `OrderShippingAddressProps`

| Prop | Type | Requis |
|------|------|--------|
| `address` | `ShippingAddress` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <OrderShippingAddress address={ } />
  ```

---

#### `OrderSummary`

Composant pour afficher le récapitulatif de la commande

- **Fichier** : `components/orders/OrderSummary.tsx`
- **Props Interface** : `OrderSummaryProps`

| Prop | Type | Requis |
|------|------|--------|
| `total` | `number` | ✅ |
| `onDownloadInvoice` | `() => void` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <OrderSummary total={0} />
  ```

---

#### `OrderTimeline`

Définition des étapes de la timeline

- **Fichier** : `components/orders/OrderTimeline.tsx`
- **Props Interface** : `OrderTimelineProps`

| Prop | Type | Requis |
|------|------|--------|
| `status` | `OrderStatus` | ✅ |
| `paidAt` | `string | null` | ❌ |
| `shippedAt` | `string | null` | ❌ |
| `deliveredAt` | `string | null` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <OrderTimeline status={ } />
  ```

---

#### `OrderTimelineVertical`

Composant Timeline Verticale - Style shadcn/Radix Utilise les primitives Timeline avec animations Framer Motion Design minimaliste et moderne

- **Fichier** : `components/orders/OrderTimelineVertical.tsx`
- **Props Interface** : `OrderTimelineVerticalProps`

| Prop | Type | Requis |
|------|------|--------|
| `status` | `OrderStatus` | ✅ |
| `paidAt` | `string | null` | ❌ |
| `shippedAt` | `string | null` | ❌ |
| `deliveredAt` | `string | null` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <OrderTimelineVertical status={ } />
  ```

---

#### `TrackingInfo`

Composant TrackingInfo - Affiche les informations de suivi de colis

- **Fichier** : `components/orders/TrackingInfo.tsx`
- **Props Interface** : `TrackingInfoProps`

| Prop | Type | Requis |
|------|------|--------|
| `trackingNumber` | `string | null` | ❌ |
| `shippedAt` | `string | null` | ❌ |
| `deliveredAt` | `string | null` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <TrackingInfo />
  ```

---

### Product

#### `AddToCartButton`

Composant AddToCartButton - Bouton ajout panier style A-COLD-WALL Bouton avec : - Disabled si pas de variante sélectionnée - Loading state pendant ajout - Toast notification après succès - Vérification stock

- **Fichier** : `components/product/AddToCartButton.tsx`
- **Props Interface** : `AddToCartButtonProps`

| Prop | Type | Requis |
|------|------|--------|
| `variant` | `Variant | null` | ✅ |
| `quantity` | `number` | ✅ |
| `onQuantityChange` | `(quantity: number) => void` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <AddToCartButton variant={ } quantity={0} onQuantityChange={0} />
  ```

---

#### `ProductBadge`

Composant ProductBadge - Badge "Nouveau", "Sale" ou "Stocks insuffisants" style A-COLD-WALL Affiche : - Badge "Stocks insuffisants" si tous les variants sont épuisés (priorité absolue) - Badge "Sale" si produit en promotion (prix barré) - Badge "Nouveau" si produit créé il y a moins de 30 jours

- **Fichier** : `components/product/ProductBadge.tsx`
- **Props Interface** : `ProductBadgeProps`

| Prop | Type | Requis |
|------|------|--------|
| `product` | `Product` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <ProductBadge product={ product } />
  ```

---

#### `ProductCard`

Formate un prix en euros (format A-COLD-WALL* : €XX,XX)

- **Fichier** : `components/product/ProductCard.tsx`
- **Props Interface** : `ProductCardProps`

| Prop | Type | Requis |
|------|------|--------|
| `product` | `Product` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <ProductCard product={ product } />
  ```

---

#### `ProductGallery`

Composant ProductGallery - Carrousel d'images style A-COLD-WALL Carrousel Swiper horizontal avec : - Images triées par order - Navigation prev/next (mobile) - Aspect ratio 4:3 - Grille d'images sur desktop (pas de carrousel)

- **Fichier** : `components/product/ProductGallery.tsx`
- **Props Interface** : `ProductGalleryProps`

| Prop | Type | Requis |
|------|------|--------|
| `images` | `Image[]` | ✅ |
| `productName` | `string` | ✅ |
| `product` | `Product` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <ProductGallery images={ } productName="productName" />
  ```

---

#### `ProductInfo`

Formate un prix en euros (format A-COLD-WALL* : €XX,XX)

- **Fichier** : `components/product/ProductInfo.tsx`
- **Props Interface** : `ProductInfoProps`

| Prop | Type | Requis |
|------|------|--------|
| `product` | `Product` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <ProductInfo product={ product } />
  ```

---

#### `ProductTabs`

Composant ProductTabs - Onglets style A-COLD-WALL Tabs avec : - Liste d'onglets (gauche desktop, horizontal mobile) - Tab actif avec bullet point noir - Contenu dynamique à droite

- **Fichier** : `components/product/ProductTabs.tsx`
- **Props Interface** : `ProductTabsProps`

| Prop | Type | Requis |
|------|------|--------|
| `tabs` | `Tab[]` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <ProductTabs tabs={ } />
  ```

---

#### `QuantitySelector`

Composant QuantitySelector - Sélecteur de quantité style A-COLD-WALL Boutons +/- avec nombre au centre - Minimum : 1 (ou min prop) - Maximum : stock disponible (ou max prop) - Désactivé si stock = 0

- **Fichier** : `components/product/QuantitySelector.tsx`
- **Props Interface** : `QuantitySelectorProps`

| Prop | Type | Requis |
|------|------|--------|
| `quantity` | `number` | ✅ |
| `onDecrease` | `() => void` | ✅ |
| `onIncrease` | `() => void` | ✅ |
| `min` | `number` | ❌ |
| `max` | `number` | ❌ |
| `disabled` | `boolean` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <QuantitySelector quantity={0} onDecrease={() => {}} onIncrease={() => {}} />
  ```

---

#### `RelatedProducts`

Composant RelatedProducts - Produits similaires style A-COLD-WALL Structure exacte A-COLD-WALL* : - Section avec m-[2px], p-[2px], bg-grey - Titre h2 avec text-h2 - Grille responsive (2 cols mobile, auto-fit desktop) - Liste de ProductCard avec même structure que Catalog

- **Fichier** : `components/product/RelatedProducts.tsx`
- **Props Interface** : `RelatedProductsProps`

| Prop | Type | Requis |
|------|------|--------|
| `categoryId` | `string` | ❌ |
| `currentProductId` | `string` | ✅ |
| `limit` | `number` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <RelatedProducts currentProductId="currentProductId" />
  ```

---

#### `StockBadge`

Composant StockBadge - Affichage du stock par variant Option C hybride : - Si stock > seuil : Affiche statut ("En stock") - Si stock ≤ seuil : Affiche quantité exacte ("3 en stock") - Si stock = 0 : Affiche "Rupture de stock"

- **Fichier** : `components/product/StockBadge.tsx`
- **Props Interface** : `StockBadgeProps`

| Prop | Type | Requis |
|------|------|--------|
| `variant` | `Variant | null` | ✅ |
| `stockThreshold` | `number` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <StockBadge variant={ } />
  ```

---

#### `StockNotificationModal`

Composant StockNotificationModal - Modal pour s'inscrire aux notifications de rupture de stock Permet à l'utilisateur de s'inscrire pour être notifié quand le produit sera de nouveau disponible Stockage en localStorage pour MVP (backend à venir)

- **Fichier** : `components/product/StockNotificationModal.tsx`
- **Props Interface** : `StockNotificationModalProps`

| Prop | Type | Requis |
|------|------|--------|
| `product` | `Product` | ✅ |
| `variantId` | `string` | ❌ |
| `isOpen` | `boolean` | ✅ |
| `onClose` | `() => void` | ✅ |
| `onSubscribe` | `() => void` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <StockNotificationModal product={ product } isOpen={true} onClose={() => {}} onSubscribe={() => {}} />
  ```

---

#### `VariantSelector`

Composant VariantSelector - Sélection taille style A-COLD-WALL Select dropdown avec : - Liste des tailles disponibles - Arrow custom (triangle noir) - Border noir arrondie - Callback onVariantChange - Grisage des variants épuisés - Badge stock pour la variante sélectionnée

- **Fichier** : `components/product/VariantSelector.tsx`
- **Props Interface** : `VariantSelectorProps`

| Prop | Type | Requis |
|------|------|--------|
| `variants` | `Variant[]` | ✅ |
| `selectedVariant` | `Variant | null` | ✅ |
| `onVariantChange` | `(variant: Variant) => void` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <VariantSelector variants={ } selectedVariant={ } onVariantChange={() => {}} />
  ```

---

### Profile

#### `ProfileActions`

- **Fichier** : `components/profile/ProfileActions.tsx`
- **Props Interface** : `ProfileActionsProps`

| Prop | Type | Requis |
|------|------|--------|
| `onLogout` | `() => void` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <ProfileActions onLogout={() => {}} />
  ```

---

#### `ProfileHeader`

- **Fichier** : `components/profile/ProfileHeader.tsx`
- **Props** : Aucune

- **Exemple d'utilisation** :

  ```tsx
  <ProfileHeader />
  ```

---

#### `ProfileInfoCard`

- **Fichier** : `components/profile/ProfileInfoCard.tsx`
- **Props Interface** : `ProfileInfoCardProps`

| Prop | Type | Requis |
|------|------|--------|
| `user` | `User` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <ProfileInfoCard user={ } />
  ```

---

#### `ProfileInfoField`

- **Fichier** : `components/profile/ProfileInfoField.tsx`
- **Props Interface** : `ProfileInfoFieldProps`

| Prop | Type | Requis |
|------|------|--------|
| `label` | `string` | ✅ |
| `value` | `string | number` | ✅ |
| `spacing` | `'normal' | 'tight'` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <ProfileInfoField label="label" value="value" />
  ```

---

#### `ProfileQuickAction`

- **Fichier** : `components/profile/ProfileQuickAction.tsx`
- **Props Interface** : `ProfileQuickActionProps`

| Prop | Type | Requis |
|------|------|--------|
| `title` | `string` | ✅ |
| `description` | `string` | ✅ |
| `linkTo` | `string` | ❌ |
| `buttonText` | `string` | ✅ |
| `disabled` | `boolean` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <ProfileQuickAction title="title" description="description" buttonText="buttonText" />
  ```

---

#### `ProfileRoleBadge`

- **Fichier** : `components/profile/ProfileRoleBadge.tsx`
- **Props Interface** : `ProfileRoleBadgeProps`

| Prop | Type | Requis |
|------|------|--------|
| `role` | `string` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <ProfileRoleBadge role="role" />
  ```

---

### Ui

#### `Breadcrumbs`

Composant Breadcrumbs - Fil d'Ariane style A-COLD-WALL Affiche un chemin de navigation avec liens cliquables Dernier élément non cliquable

- **Fichier** : `components/ui/breadcrumbs.tsx`
- **Props Interface** : `BreadcrumbsProps`

| Prop | Type | Requis |
|------|------|--------|
| `items` | `BreadcrumbItem[]` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <Breadcrumbs items={ } />
  ```

---

#### `Timeline`

- **Fichier** : `components/ui/timeline.tsx`
- **Props Interface** : `TimelineProps`

| Prop | Type | Requis |
|------|------|--------|
| `children` | `React.ReactNode` | ✅ |
| `activeIndex` | `number` | ❌ |
| `className` | `string` | ❌ |

- **Exemple d'utilisation** :

  ```tsx
  <Timeline children={ } />
  ```

---

#### `Toast`

Composant Toast - Notification temporaire style A-COLD-WALL Affiche une notification en bas à gauche avec : - Message principal - Action optionnelle (lien cliquable) - Icône de validation - Auto-dismiss après durée définie

- **Fichier** : `components/ui/toast.tsx`
- **Props Interface** : `ToastProps`

| Prop | Type | Requis |
|------|------|--------|
| `message` | `string` | ✅ |
| `actionLabel` | `string` | ❌ |
| `onAction` | `() => void` | ❌ |
| `duration` | `number` | ❌ |
| `onClose` | `() => void` | ✅ |

- **Exemple d'utilisation** :

  ```tsx
  <Toast message="message" onClose={() => {}} />
  ```

---

## Hooks React

### `useAuth`

Hook personnalisé pour accéder au contexte Auth @example const { user, isAuthenticated, login, logout } = useAuth();

- **Fichier** : `hooks/useAuth.ts`
- **Paramètres** : Aucun

- **Exemple d'utilisation** :

  ```tsx
  const {data, loading, error} = useAuth();
  ```

---

### `useBrands`

- **Fichier** : `hooks/useBrands.ts`
- **Paramètres** : Aucun

- **Exemple d'utilisation** :

  ```tsx
  const {data, loading, error} = useBrands();
  ```

---

### `useCart`

- **Fichier** : `hooks/useCart.ts`
- **Paramètres** : Aucun

- **Exemple d'utilisation** :

  ```tsx
  const {data, loading, error} = useCart();
  ```

---

### `useCategories`

- **Fichier** : `hooks/useCategories.ts`
- **Paramètres** : Aucun

- **Exemple d'utilisation** :

  ```tsx
  const {data, loading, error} = useCategories();
  ```

---

### `useOrders`

Hook pour récupérer les commandes de l'utilisateur connecté

- **Fichier** : `hooks/useOrders.ts`
- **Paramètres** : Aucun

- **Exemple d'utilisation** :

  ```tsx
  const {data, loading, error} = useOrders();
  ```

---

### `useProduct`

- **Fichier** : `hooks/useProduct.ts`
- **Paramètres** : Aucun

- **Exemple d'utilisation** :

  ```tsx
  const {data, loading, error} = useProduct();
  ```

---

### `useProducts`

- **Fichier** : `hooks/useProducts.ts`
- **Paramètres** : Aucun

- **Exemple d'utilisation** :

  ```tsx
  const {data, loading, error} = useProducts();
  ```

---

