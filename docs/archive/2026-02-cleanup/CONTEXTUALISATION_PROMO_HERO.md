# 📋 Contextualisation - Gestion PromoCard & Hero Sections depuis Admin Central

**Date** : 05/01/2026  
**Tâche** : Vérification composant PromoCard + Hero Sections + Modification depuis Admin Central

---

## 🎯 Objectif de la tâche

Permettre la gestion dynamique des sections **PromoCard** et **Hero Sections** (HeroSectionImage, HeroSectionVideo) de la page d'accueil depuis l'**Admin Central**, au lieu d'avoir des valeurs hardcodées dans le code.

---

## 📊 État actuel

### ✅ Composants Frontend existants

#### 1. **PromoCard** (`frontend/src/components/home/PromoCard.tsx`)

**Fichier** : `frontend/src/components/home/PromoCard.tsx`

**Structure** :
- Layout 2 colonnes responsive (image gauche 30%, contenu droite 70%)
- Image principale avec overlay optionnel (topText, title, number)
- Contenu texte avec titre et description (tableau de strings)
- Grille optionnelle de 2 images en bas du contenu
- Liens optionnels sur images (interne ou externe)

**Props actuelles** (toutes les props sont passées manuellement) :
```typescript
interface PromoCardProps {
  // Image principale
  imageUrl: string;
  imageAlt?: string;
  imageLink?: string;
  imageLinkExternal?: boolean;
  
  // Overlay sur l'image
  overlayTopText?: string;
  overlayTitle?: string;
  overlayNumber?: string;
  
  // Contenu texte
  title: string;
  description: string[]; // Tableau de paragraphes
  
  // Grille d'images (optionnel)
  gridImage1?: string;
  gridImage1Alt?: string;
  gridImage1Link?: string;
  gridImage1Description?: string;
  gridImage2?: string;
  gridImage2Alt?: string;
  gridImage2Link?: string;
  gridImage2Description?: string;
}
```

**Utilisation actuelle** (`frontend/src/pages/Home.tsx`) :
```typescript
<PromoCard
  gridImage1='/webdesign/addon.jpeg'
  gridImage1Alt='VISAG3'
  gridImage1Link='/page1'
  gridImage1Description='VISAG3'
  gridImage2='/webdesign/addon2.jpeg'
  gridImage2Alt='VISAG3'
  gridImage2Link='/page2'
  gridImage2Description='VISAG3'
  imageUrl="/webdesign/promoimage.jpeg"
  imageAlt="Material Study"
  overlayTopText="A-COLD-WALL* MATERIAL STUDY"
  overlayTitle="Alaska Alaska"
  overlayNumber="003"
  title="Material Study 03: Alaska Alaska"
  description={[
    "Episode 03, curated by Tawanda Chiweshe and Francisco Gaspar of Alaska Alaska...",
    "Their work reflects a convergence of diverse worldviews..."
  ]}
/>
```

**Problème** : Toutes les valeurs sont hardcodées dans le code.

---

#### 2. **HeroSectionImage** (`frontend/src/components/home/HeroSectionImage.tsx`)

**Fichier** : `frontend/src/components/home/HeroSectionImage.tsx`

**Structure** :
- Image ou vidéo de fond avec aspect ratio responsive
- Overlay noir semi-transparent (20% opacité)
- Texte centré (titre, sous-titre, bouton CTA)
- Lien cliquable sur toute l'image/vidéo

**Props actuelles** :
```typescript
interface HeroSectionImageProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageSrc?: string;
  videoSrc?: string;
  aspectRatioMobile?: string;
  aspectRatioDesktop?: string;
  maxHeightClass?: string;
  heightClass?: string;
  objectFit?: 'cover' | 'contain';
}
```

**Utilisation actuelle** (`frontend/src/pages/Home.tsx`) :
```typescript
<HeroSectionImage
  title="Winter Sale"
  subtitle="Up To 50% Off"
  buttonText="Shop now"
  buttonLink="/catalog"
  imageSrc="/public/webdesign/background.png"
/>
```

**Problème** : Valeurs hardcodées dans le code.

---

#### 3. **HeroSectionVideo** (`frontend/src/components/home/HeroSectionVideo.tsx`)

**Fichier** : `frontend/src/components/home/HeroSectionVideo.tsx`

**Structure** :
- Vidéo de fond avec aspect ratio responsive
- Overlay noir semi-transparent (20% opacité)
- Texte centré (titre, sous-titre, bouton CTA)
- Lien cliquable sur toute la vidéo

**Props actuelles** :
```typescript
interface HeroSectionVideoProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  videoSrc: string;
  videoType?: string;
}
```

**Utilisation actuelle** (`frontend/src/pages/Home.tsx`) :
```typescript
<HeroSectionVideo
  title="Winter Sale"
  subtitle="Up To 50% Off"
  buttonText="Shop now"
  buttonLink="/catalog"
  videoSrc="/public/webdesign/acw-video.mp4"
/>
```

**Problème** : Valeurs hardcodées dans le code.

---

### ✅ Admin Central existant

**Structure** : `admin-central/`

**Modules existants** :
- ✅ Gestion produits (`reboul-products.service.ts`)
- ✅ Gestion catégories (`reboul-categories.service.ts`)
- ✅ Gestion commandes (`reboul-orders.service.ts`)
- ✅ Gestion marques (`reboul-brands.service.ts`)
- ✅ Gestion collections (`reboul-collections.service.ts`)
- ✅ Gestion coupons (`reboul-coupons.service.ts`)
- ✅ Gestion utilisateurs (`reboul-users.service.ts`)
- ✅ Gestion stocks (`reboul-stocks.service.ts`)
- ✅ Gestion settings (`reboul-settings.service.ts`)

**Pages admin existantes** :
- ✅ Dashboard
- ✅ Produits (CRUD)
- ✅ Catégories (CRUD)
- ✅ Commandes
- ✅ Marques
- ✅ Collections
- ✅ Coupons
- ✅ Utilisateurs
- ✅ Stocks
- ✅ Settings

**❌ Manquant** :
- ❌ Gestion Hero Sections
- ❌ Gestion PromoCard

---

## 🎯 Objectifs de la tâche

### 1. **Vérification PromoCard**

**À vérifier** :
- ✅ Structure du composant (grille photo + texte props)
- ✅ Toutes les props sont-elles utilisées correctement ?
- ✅ Le layout responsive fonctionne-t-il bien ?
- ✅ Les images de la grille s'affichent-elles correctement ?
- ✅ Les overlays fonctionnent-ils comme prévu ?

**Actions** :
1. Tester le composant avec différentes configurations de props
2. Vérifier le rendu responsive (mobile, tablette, desktop)
3. Vérifier l'affichage des images (grille + image principale)
4. Vérifier les liens (internes et externes)
5. Vérifier les overlays (texte, positionnement)

---

### 2. **Backend - Entités & API pour Hero Sections**

**À créer** :

#### Entité `HomepageHero` (Backend Reboul Store)

```typescript
@Entity('homepage_hero')
export class HomepageHero {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  subtitle: string;

  @Column({ type: 'varchar', length: 255 })
  buttonText: string;

  @Column({ type: 'varchar', length: 500 })
  buttonLink: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageSrc?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  videoSrc?: string;

  @Column({ type: 'varchar', length: 50, default: '4/5' })
  aspectRatioMobile: string;

  @Column({ type: 'varchar', length: 50, default: '2/1' })
  aspectRatioDesktop: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  maxHeightClass?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  heightClass?: string;

  @Column({ type: 'enum', enum: ['cover', 'contain'], default: 'cover' })
  objectFit: 'cover' | 'contain';

  @Column({ type: 'varchar', length: 50, nullable: true })
  videoType?: string;

  @Column({ type: 'int', default: 0 })
  order: number; // Ordre d'affichage

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: ['image', 'video'], default: 'image' })
  type: 'image' | 'video';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### Module `HomepageHero` (Backend Reboul Store)

- **Service** : `HomepageHeroService` (CRUD complet)
- **Controller** : `HomepageHeroController` (endpoints REST)
- **DTOs** : `CreateHomepageHeroDto`, `UpdateHomepageHeroDto`

**Endpoints** :
- `GET /homepage-hero` : Liste tous les hero sections (triés par order)
- `GET /homepage-hero/active` : Liste uniquement les hero sections actives
- `GET /homepage-hero/:id` : Détails d'un hero section
- `POST /homepage-hero` : Créer un hero section
- `PATCH /homepage-hero/:id` : Modifier un hero section
- `DELETE /homepage-hero/:id` : Supprimer un hero section
- `PATCH /homepage-hero/:id/order` : Modifier l'ordre d'affichage

---

### 3. **Backend - Entités & API pour PromoCard**

**À créer** :

#### Entité `HomepagePromo` (Backend Reboul Store)

```typescript
@Entity('homepage_promo')
export class HomepagePromo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Image principale
  @Column({ type: 'varchar', length: 500 })
  imageUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageAlt?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageLink?: string;

  @Column({ type: 'boolean', default: false })
  imageLinkExternal: boolean;

  // Overlay sur l'image
  @Column({ type: 'varchar', length: 255, nullable: true })
  overlayTopText?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  overlayTitle?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  overlayNumber?: string;

  // Contenu texte
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', array: true })
  description: string[]; // Tableau de paragraphes (JSONB en PostgreSQL)

  // Grille d'images
  @Column({ type: 'varchar', length: 500, nullable: true })
  gridImage1?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gridImage1Alt?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  gridImage1Link?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gridImage1Description?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  gridImage2?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gridImage2Alt?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  gridImage2Link?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gridImage2Description?: string;

  @Column({ type: 'int', default: 0 })
  order: number; // Ordre d'affichage

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### Module `HomepagePromo` (Backend Reboul Store)

- **Service** : `HomepagePromoService` (CRUD complet)
- **Controller** : `HomepagePromoController` (endpoints REST)
- **DTOs** : `CreateHomepagePromoDto`, `UpdateHomepagePromoDto`

**Endpoints** :
- `GET /homepage-promo` : Liste tous les promo cards (triés par order)
- `GET /homepage-promo/active` : Liste uniquement les promo cards actives
- `GET /homepage-promo/:id` : Détails d'un promo card
- `POST /homepage-promo` : Créer un promo card
- `PATCH /homepage-promo/:id` : Modifier un promo card
- `DELETE /homepage-promo/:id` : Supprimer un promo card
- `PATCH /homepage-promo/:id/order` : Modifier l'ordre d'affichage

---

### 4. **Frontend - Services & Hooks**

**À créer** :

#### Service `homepage.ts` (Frontend Reboul Store)

```typescript
// frontend/src/services/homepage.ts

export const getHomepageHeroes = async (): Promise<HomepageHero[]> => {
  const response = await api.get<HomepageHero[]>('/homepage-hero/active');
  return response.data;
};

export const getHomepagePromos = async (): Promise<HomepagePromo[]> => {
  const response = await api.get<HomepagePromo[]>('/homepage-promo/active');
  return response.data;
};
```

#### Hook `useHomepage` (Frontend Reboul Store)

```typescript
// frontend/src/hooks/useHomepage.ts

export const useHomepage = () => {
  const [heroes, setHeroes] = useState<HomepageHero[]>([]);
  const [promos, setPromos] = useState<HomepagePromo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger heroes et promos
  // ...

  return { heroes, promos, loading, error, refetch };
};
```

#### Types `homepage.ts` (Frontend Reboul Store)

```typescript
// frontend/src/types/homepage.ts

export interface HomepageHero {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageSrc?: string;
  videoSrc?: string;
  aspectRatioMobile: string;
  aspectRatioDesktop: string;
  maxHeightClass?: string;
  heightClass?: string;
  objectFit: 'cover' | 'contain';
  videoType?: string;
  order: number;
  isActive: boolean;
  type: 'image' | 'video';
  createdAt: Date;
  updatedAt: Date;
}

export interface HomepagePromo {
  id: string;
  imageUrl: string;
  imageAlt?: string;
  imageLink?: string;
  imageLinkExternal: boolean;
  overlayTopText?: string;
  overlayTitle?: string;
  overlayNumber?: string;
  title: string;
  description: string[];
  gridImage1?: string;
  gridImage1Alt?: string;
  gridImage1Link?: string;
  gridImage1Description?: string;
  gridImage2?: string;
  gridImage2Alt?: string;
  gridImage2Link?: string;
  gridImage2Description?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 5. **Frontend - Modification de Home.tsx**

**À modifier** :

```typescript
// frontend/src/pages/Home.tsx

import { useHomepage } from '../hooks/useHomepage';

export const Home = () => {
  const { heroes, promos, loading, error } = useHomepage();

  // Remplacer les valeurs hardcodées par les données de l'API
  // ...

  return (
    <div className='px-[4px]'>
      {/* Hero Sections dynamiques */}
      {heroes.map((hero) => {
        if (hero.type === 'video') {
          return (
            <HeroSectionVideo
              key={hero.id}
              title={hero.title}
              subtitle={hero.subtitle}
              buttonText={hero.buttonText}
              buttonLink={hero.buttonLink}
              videoSrc={hero.videoSrc!}
              videoType={hero.videoType}
            />
          );
        } else {
          return (
            <HeroSectionImage
              key={hero.id}
              title={hero.title}
              subtitle={hero.subtitle}
              buttonText={hero.buttonText}
              buttonLink={hero.buttonLink}
              imageSrc={hero.imageSrc}
              videoSrc={hero.videoSrc}
              aspectRatioMobile={hero.aspectRatioMobile}
              aspectRatioDesktop={hero.aspectRatioDesktop}
              maxHeightClass={hero.maxHeightClass}
              heightClass={hero.heightClass}
              objectFit={hero.objectFit}
            />
          );
        }
      })}

      {/* Promo Cards dynamiques */}
      {promos.map((promo) => (
        <PromoCard
          key={promo.id}
          imageUrl={promo.imageUrl}
          imageAlt={promo.imageAlt}
          imageLink={promo.imageLink}
          imageLinkExternal={promo.imageLinkExternal}
          overlayTopText={promo.overlayTopText}
          overlayTitle={promo.overlayTitle}
          overlayNumber={promo.overlayNumber}
          title={promo.title}
          description={promo.description}
          gridImage1={promo.gridImage1}
          gridImage1Alt={promo.gridImage1Alt}
          gridImage1Link={promo.gridImage1Link}
          gridImage1Description={promo.gridImage1Description}
          gridImage2={promo.gridImage2}
          gridImage2Alt={promo.gridImage2Alt}
          gridImage2Link={promo.gridImage2Link}
          gridImage2Description={promo.gridImage2Description}
        />
      ))}
    </div>
  );
};
```

---

### 6. **Admin Central - Pages de gestion**

**À créer** :

#### Page `HomepageHeroes.tsx` (Admin Central)

**Fichier** : `admin-central/frontend/src/pages/admin/HomepageHeroes.tsx`

**Fonctionnalités** :
- Liste des hero sections (tableau avec colonnes : title, type, order, isActive, actions)
- Bouton "Créer un hero section"
- Formulaire de création/édition (modal ou page dédiée)
- Upload d'image/vidéo (via Cloudinary)
- Gestion de l'ordre (drag & drop ou inputs)
- Activation/désactivation (toggle)
- Suppression avec confirmation

**Champs du formulaire** :
- Type (image/vidéo) - select
- Titre - input text
- Sous-titre - input text
- Texte bouton - input text
- Lien bouton - input text
- Image (si type = image) - upload
- Vidéo (si type = vidéo) - upload
- Aspect ratio mobile - input text
- Aspect ratio desktop - input text
- Max height class - input text (optionnel)
- Height class - input text (optionnel)
- Object fit - select (cover/contain)
- Video type - input text (optionnel)
- Ordre - input number
- Actif - toggle

---

#### Page `HomepagePromos.tsx` (Admin Central)

**Fichier** : `admin-central/frontend/src/pages/admin/HomepagePromos.tsx`

**Fonctionnalités** :
- Liste des promo cards (tableau avec colonnes : title, order, isActive, actions)
- Bouton "Créer un promo card"
- Formulaire de création/édition (modal ou page dédiée)
- Upload d'images (image principale + grille) - via Cloudinary
- Gestion de l'ordre (drag & drop ou inputs)
- Activation/désactivation (toggle)
- Suppression avec confirmation

**Champs du formulaire** :
- **Image principale** :
  - Image - upload
  - Alt text - input text (optionnel)
  - Lien - input text (optionnel)
  - Lien externe - toggle
  
- **Overlay** :
  - Top text - input text (optionnel)
  - Title - input text (optionnel)
  - Number - input text (optionnel)
  
- **Contenu** :
  - Titre - input text
  - Description - textarea (avec possibilité d'ajouter plusieurs paragraphes)
  
- **Grille d'images** :
  - Image 1 - upload (optionnel)
  - Alt text 1 - input text (optionnel)
  - Lien 1 - input text (optionnel)
  - Description 1 - input text (optionnel)
  - Image 2 - upload (optionnel)
  - Alt text 2 - input text (optionnel)
  - Lien 2 - input text (optionnel)
  - Description 2 - input text (optionnel)
  
- **Paramètres** :
  - Ordre - input number
  - Actif - toggle

---

### 7. **Admin Central - Services & Hooks**

**À créer** :

#### Service `reboul-homepage.service.ts` (Admin Central)

```typescript
// admin-central/frontend/src/services/reboul-homepage.service.ts

export const getHomepageHeroes = async (): Promise<HomepageHero[]> => {
  // Appel API backend admin central
};

export const createHomepageHero = async (dto: CreateHomepageHeroDto): Promise<HomepageHero> => {
  // ...
};

export const updateHomepageHero = async (id: string, dto: UpdateHomepageHeroDto): Promise<HomepageHero> => {
  // ...
};

export const deleteHomepageHero = async (id: string): Promise<void> => {
  // ...
};

// Pareil pour Promos
```

#### Hook `useReboulHomepage.ts` (Admin Central)

```typescript
// admin-central/frontend/src/hooks/useReboulHomepage.ts

export const useReboulHomepage = () => {
  // Gestion heroes
  // Gestion promos
  // ...
};
```

---

### 8. **Admin Central - Backend (Module Reboul)**

**À créer** :

#### Module `HomepageHero` (Admin Central Backend)

**Fichier** : `admin-central/backend/src/modules/reboul/homepage-hero/`

- **Service** : `HomepageHeroService` (connexion à la DB Reboul Store)
- **Controller** : `HomepageHeroController` (endpoints REST)
- **DTOs** : `CreateHomepageHeroDto`, `UpdateHomepageHeroDto`

**Endpoints** :
- `GET /reboul/homepage-hero` : Liste tous les hero sections
- `GET /reboul/homepage-hero/:id` : Détails d'un hero section
- `POST /reboul/homepage-hero` : Créer un hero section
- `PATCH /reboul/homepage-hero/:id` : Modifier un hero section
- `DELETE /reboul/homepage-hero/:id` : Supprimer un hero section

#### Module `HomepagePromo` (Admin Central Backend)

**Fichier** : `admin-central/backend/src/modules/reboul/homepage-promo/`

- **Service** : `HomepagePromoService` (connexion à la DB Reboul Store)
- **Controller** : `HomepagePromoController` (endpoints REST)
- **DTOs** : `CreateHomepagePromoDto`, `UpdateHomepagePromoDto`

**Endpoints** :
- `GET /reboul/homepage-promo` : Liste tous les promo cards
- `GET /reboul/homepage-promo/:id` : Détails d'un promo card
- `POST /reboul/homepage-promo` : Créer un promo card
- `PATCH /reboul/homepage-promo/:id` : Modifier un promo card
- `DELETE /reboul/homepage-promo/:id` : Supprimer un promo card

---

## 📋 Checklist de la tâche

### Phase 1 : Vérification PromoCard ✅
- [ ] Tester le composant PromoCard avec différentes configurations
- [ ] Vérifier le rendu responsive (mobile, tablette, desktop)
- [ ] Vérifier l'affichage des images (grille + image principale)
- [ ] Vérifier les liens (internes et externes)
- [ ] Vérifier les overlays (texte, positionnement)
- [ ] Documenter les problèmes éventuels

### Phase 2 : Backend Reboul Store - Hero Sections
- [ ] Créer entité `HomepageHero`
- [ ] Créer migration pour table `homepage_hero`
- [ ] Créer module `HomepageHero` (Service, Controller, DTOs)
- [ ] Créer endpoints REST
- [ ] Tester les endpoints

### Phase 3 : Backend Reboul Store - Promo Cards
- [ ] Créer entité `HomepagePromo`
- [ ] Créer migration pour table `homepage_promo`
- [ ] Créer module `HomepagePromo` (Service, Controller, DTOs)
- [ ] Créer endpoints REST
- [ ] Tester les endpoints

### Phase 4 : Frontend Reboul Store - Services & Hooks
- [ ] Créer types `homepage.ts`
- [ ] Créer service `homepage.ts`
- [ ] Créer hook `useHomepage`
- [ ] Modifier `Home.tsx` pour utiliser les données de l'API
- [ ] Tester l'affichage dynamique

### Phase 5 : Admin Central Backend - Modules
- [ ] Créer module `HomepageHero` (Admin Central)
- [ ] Créer module `HomepagePromo` (Admin Central)
- [ ] Tester les connexions à la DB Reboul Store

### Phase 6 : Admin Central Frontend - Pages
- [ ] Créer page `HomepageHeroes.tsx`
- [ ] Créer page `HomepagePromos.tsx`
- [ ] Créer services `reboul-homepage.service.ts`
- [ ] Créer hooks `useReboulHomepage.ts`
- [ ] Ajouter les routes dans le router
- [ ] Ajouter les liens dans la navigation admin

### Phase 7 : Tests & Validation
- [ ] Tester création hero section depuis admin
- [ ] Tester modification hero section depuis admin
- [ ] Tester suppression hero section depuis admin
- [ ] Tester création promo card depuis admin
- [ ] Tester modification promo card depuis admin
- [ ] Tester suppression promo card depuis admin
- [ ] Vérifier l'affichage sur la page d'accueil
- [ ] Vérifier le responsive

---

## 🔗 Fichiers concernés

### Backend Reboul Store
- `backend/src/entities/homepage-hero.entity.ts` (à créer)
- `backend/src/entities/homepage-promo.entity.ts` (à créer)
- `backend/src/modules/homepage-hero/` (à créer)
- `backend/src/modules/homepage-promo/` (à créer)

### Frontend Reboul Store
- `frontend/src/components/home/PromoCard.tsx` (existant - à vérifier)
- `frontend/src/components/home/HeroSectionImage.tsx` (existant)
- `frontend/src/components/home/HeroSectionVideo.tsx` (existant)
- `frontend/src/pages/Home.tsx` (existant - à modifier)
- `frontend/src/services/homepage.ts` (à créer)
- `frontend/src/hooks/useHomepage.ts` (à créer)
- `frontend/src/types/homepage.ts` (à créer)

### Admin Central Backend
- `admin-central/backend/src/modules/reboul/homepage-hero/` (à créer)
- `admin-central/backend/src/modules/reboul/homepage-promo/` (à créer)

### Admin Central Frontend
- `admin-central/frontend/src/pages/admin/HomepageHeroes.tsx` (à créer)
- `admin-central/frontend/src/pages/admin/HomepagePromos.tsx` (à créer)
- `admin-central/frontend/src/services/reboul-homepage.service.ts` (à créer)
- `admin-central/frontend/src/hooks/useReboulHomepage.ts` (à créer)

---

## 📚 Références

- **Architecture Admin Central** : `docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md`
- **Frontend Documentation** : `frontend/FRONTEND.md`
- **Backend Documentation** : `backend/BACKEND.md`
- **Roadmap** : `docs/context/ROADMAP_COMPLETE.md`

---

## ✅ Prochaines étapes

1. **Vérifier PromoCard** : Tester le composant et documenter les problèmes éventuels
2. **Créer les entités backend** : HomepageHero et HomepagePromo
3. **Créer les modules backend** : Services, Controllers, DTOs
4. **Créer les services frontend** : Services et hooks pour charger les données
5. **Modifier Home.tsx** : Utiliser les données de l'API au lieu de valeurs hardcodées
6. **Créer les pages admin** : Interfaces de gestion dans Admin Central
7. **Tester** : Vérifier que tout fonctionne de bout en bout

