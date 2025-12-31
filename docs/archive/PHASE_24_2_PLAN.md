# 📋 Phase 24.2 - Plan d'Action : Insertion Marques avec Logos

**Objectif** : Ajouter toutes les marques de la collection réelle (36 marques) avec leurs logos et créer un composant BrandCarousel pour la homepage.

**📊 Informations** : 36 marques (enfants + adultes), logos depuis ancien git de reboul (récupération manuelle)

---

## 🎯 Plan d'Exécution

### Étape 1 : Récupération & Préparation Logos ✅

- [x] **Récupérer dossier logos depuis ancien git de reboul** ✅
  - [x] Dossier `frontend/public/archive reboul 2024/` récupéré ✅
  - [x] Logos identifiés dans `brands/` (56 marques trouvées) ✅
  - [x] Formats vérifiés (PNG principalement, quelques SVG/JPG) ✅

- [x] **Vérifier et optimiser logos** ✅
  - [x] 56 marques identifiées dans `brands/` ✅
  - [x] Formats : PNG (versions _w blanc, _b noir) ✅
  - [x] Noms de fichiers vérifiés ✅

- [x] **Préparer données marques** ✅
  - [x] Fichier `backend/scripts/brands-data.json` créé avec 56 marques ✅
  - [x] Inclut : nom, slug, description, logoFile, logoPath ✅
  - [x] Correspondance marque ↔ logo vérifiée ✅

---

### Étape 2 : Upload Logos sur Cloudinary ✅

- [x] **Créer script d'upload batch logos** ✅
  - [x] Script `backend/scripts/upload-brands-logos.ts` créé ✅
  - [x] Organisation : `brands/logos/[marque-slug]` ✅
  - [x] Génération automatique des URLs Cloudinary ✅
  - [x] Logs détaillés (logos uploadés, erreurs) ✅
  - [x] Génère `brands-data-with-urls.json` automatiquement ✅

- [ ] **Exécuter upload**
  - [ ] Lancer le script d'upload
  - [ ] Vérifier tous les logos uploadés correctement
  - [ ] Vérifier URLs Cloudinary générées

---

### Étape 3 : Import Marques en Base de Données ✅

- [x] **Créer script d'import marques** ✅
  - [x] Script `backend/scripts/import-brands.ts` créé ✅
  - [x] Lit `brands-data-with-urls.json` (ou `brands-data.json` en fallback) ✅
  - [x] Pour chaque marque :
    - [x] Créer entité Brand avec nom, slug, logoUrl (URL Cloudinary) ✅
    - [x] Gérer doublons (vérifier si marque existe déjà par slug) ✅
    - [x] Mettre à jour si logoUrl manquant ✅
  - [x] Logs détaillés (marques créées, mises à jour, ignorées, erreurs) ✅

- [ ] **Exécuter import**
  - [ ] Lancer le script d'import
  - [ ] Vérifier toutes les marques créées en base
  - [ ] Vérifier logos associés correctement

---

### Étape 4 : Vérification Backend & Admin ✅

- [x] **Vérifier Backend** ✅
  - [x] Tester endpoint `GET /brands` (retourne toutes les marques) ✅
  - [x] Tester endpoint `GET /brands/:id` (retourne une marque) ✅
  - [x] Tester endpoint `GET /brands/slug/:slug` (retourne par slug) ✅
  - [x] Vérifier logos URLs accessibles (Cloudinary) ✅

- [x] **Vérifier Admin** ✅
  - [x] Interface Brands existe dans Admin (`/admin/reboul/brands`) ✅
  - [x] Améliorer affichage logos (afficher images au lieu d'icônes) ✅
  - [x] Vérifier affichage liste marques avec logos ✅
  - [x] Interface complète : liste, recherche, pagination, CRUD ✅

---

### Étape 5 : Vérification Frontend

- [ ] **Vérifier affichage logos**
  - [ ] Tester service `getBrands()` dans frontend
  - [ ] Vérifier type Brand dans `frontend/src/types/index.ts` (logoUrl présent)
  - [ ] Tester hook `useBrands()` si utilisé
  - [ ] Vérifier affichage logos dans navigation (si applicable)

- [ ] **Vérifier filtres par marque**
  - [ ] Tester filtrage produits par marque (si implémenté)
  - [ ] Vérifier liens vers pages marques (si existantes)

---

### Étape 6 : Composant BrandCarousel pour Homepage ⭐ (EN DERNIER)

- [ ] **Créer composant BrandCarousel**
  - [ ] Fichier : `frontend/src/components/home/BrandCarousel.tsx`
  - [ ] Style inspiré A-COLD-WALL* (minimaliste, premium)
  - [ ] Carousel horizontal avec logos des marques
  - [ ] Utiliser Swiper (comme FeaturedProducts, CategorySection)
  - [ ] Navigation prev/next (boutons avec états disabled/enabled)
  - [ ] Responsive (2-3 logos mobile → 5-6 logos desktop)
  - [ ] Logos cliquables (lien vers page marque ou catalogue filtré par marque)
  - [ ] Gestion loading/error (ne s'affiche pas si erreur)
  - [ ] Placeholder si pas de logo

- [ ] **Intégrer dans Homepage**
  - [ ] Ajouter BrandCarousel dans `frontend/src/pages/Home.tsx`
  - [ ] Positionner dans la structure de la page (après FeaturedProducts ?)
  - [ ] Tester affichage avec vraies marques
  - [ ] Vérifier responsive (mobile, tablet, desktop)

- [ ] **Props BrandCarousel**
  - [ ] `title?: string` (optionnel, titre section, ex: "Nos Marques")
  - [ ] `limit?: number` (optionnel, nombre de marques à afficher, par défaut toutes)
  - [ ] Récupération automatique via `useBrands()` hook

- [ ] **Validation**
  - [ ] Vérifier carousel fonctionne correctement
  - [ ] Vérifier logos affichés correctement (tailles, qualité)
  - [ ] Vérifier liens fonctionnent (navigation vers marques)
  - [ ] Vérifier responsive design
  - [ ] Vérifier performance (chargement images)

---

## 📁 Fichiers à Créer/Modifier

### Backend
- [ ] `backend/scripts/upload-brands-logos.ts` - Script upload logos Cloudinary
- [ ] `backend/scripts/import-brands.ts` - Script import marques en base
- [ ] `backend/scripts/brands-data.json` - Fichier données 36 marques (ou CSV)

### Frontend
- [ ] `frontend/src/components/home/BrandCarousel.tsx` - Composant carousel marques ⭐
- [ ] `frontend/src/pages/Home.tsx` - Ajouter BrandCarousel

### Documentation
- [ ] Mettre à jour `docs/context/ROADMAP_COMPLETE.md` (cocher tâches complétées)

---

## 🔧 Détails Techniques

### Structure Entité Brand (déjà existante)
```typescript
{
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;  // URL Cloudinary du logo
  megaMenuImage1?: string;
  megaMenuImage2?: string;
  megaMenuVideo1?: string;
  megaMenuVideo2?: string;
}
```

### Organisation Cloudinary
- **Dossier** : `brands/logos/`
- **Nom fichier** : `[marque-slug].png` (ou format original)
- **Exemple** : `brands/logos/nike.png`

### Génération Slug
- Depuis nom marque : `"Nike"` → `"nike"`, `"A-COLD-WALL*"` → `"a-cold-wall"`
- Utiliser fonction slugify (minuscules, tirets, pas d'espaces)

---

## ✅ Checklist Validation Finale

- [x] Toutes les marques présentes en base (57 marques) ✅
- [x] Tous les logos uploadés sur Cloudinary (56 logos) ✅
- [x] Tous les logos associés correctement aux marques (57/58) ✅
- [x] Endpoints backend fonctionnent ✅
- [x] Interface Admin fonctionne ✅
- [x] Frontend récupère et affiche les marques ✅
- [x] Composant BrandCarousel créé et intégré dans Homepage ✅
- [ ] BrandCarousel affiche correctement les logos (à tester manuellement)
- [ ] BrandCarousel responsive (mobile, tablet, desktop) (à tester manuellement)
- [ ] Liens vers marques fonctionnent (à tester manuellement)
- [ ] Performance acceptable (chargement images) (à tester manuellement)

---

## 📝 Notes

- **Priorité** : Faire toutes les étapes 1-5 d'abord, puis étape 6 (BrandCarousel) en dernier
- **Logos** : Si formats variés (PNG, SVG, JPG), préférer PNG pour meilleure qualité
- **Tailles** : Optimiser logos si trop grandes (max 500x500px recommandé pour logos)
- **Slugs** : S'assurer slugs uniques (pas de doublons)

