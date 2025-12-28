# 🧪 Guide de Test - Migration GSAP → AnimeJS

**Date** : 20 décembre 2025  
**Objectif** : Tester toutes les animations migrées vers AnimeJS avant le nettoyage final

---

## ✅ Build réussi

Le build TypeScript compile sans erreurs. Toutes les animations ont été migrées vers AnimeJS v4.

---

## 🧪 Checklist de test

### 1. Header & Navigation

**Fichier** : `frontend/src/components/layout/Header.tsx`

- [ ] **Animation d'apparition du header** :
  - Ouvrir la page d'accueil
  - Vérifier que le header apparaît en fade + slide depuis le haut
  - Animation fluide (0.6s)

- [ ] **Mega menu CATALOGUE** :
  - Cliquer sur "Catalogue" ou survoler
  - Vérifier que le menu slide-down depuis le haut avec fade
  - Vérifier que les catégories apparaissent en stagger (cascade)
  - Vérifier que les images apparaissent en stagger
  - Fermer le menu (clic ailleurs ou mouseLeave)
  - Vérifier que le menu se ferme avec fade-out

- [ ] **Mega menu BRANDS** :
  - Cliquer sur "Brands" ou survoler
  - Vérifier que le menu slide-down depuis le haut avec fade
  - Vérifier que les marques apparaissent en stagger
  - Vérifier que les images/vidéos apparaissent en stagger
  - Survoler une marque → vérifier changement d'image/vidéo
  - Fermer le menu → vérifier fade-out

- [ ] **Badge panier** :
  - Ajouter un article au panier
  - Vérifier que le badge pulse (scale up/down) quand le nombre change
  - Animation fluide (0.2s)

### 2. Loaders

**Fichiers** : `TopBarLoader.tsx`, `PageLoader.tsx`

- [ ] **TopBarLoader** (barre fine en haut) :
  - Naviguer entre les pages
  - Vérifier que la barre apparaît en haut
  - Vérifier que la barre se remplit et se vide en boucle (yoyo)
  - Animation fluide, pas de saccades

- [ ] **PageLoader** (loader centré) :
  - Recharger la page d'accueil
  - Vérifier que le loader apparaît avec le logo
  - Vérifier que la barre se remplit progressivement (0-100%)
  - Vérifier que le texte "CHARGEMENT : X%" s'actualise
  - Vérifier que le logo fait un léger "breathing" (opacity + scale)
  - Vérifier que l'animation se répète en boucle
  - Animation fluide, pas de saccades

### 3. Pages

**Fichiers** : `Product.tsx`, `Catalog.tsx`

- [ ] **Page Product** :
  - Ouvrir une page produit (`/product/:id`)
  - Vérifier l'animation d'apparition de la page (fade-in)
  - Vérifier que les breadcrumbs slide-up
  - Vérifier que la galerie slide-up
  - Vérifier que les infos produit slide-up (en parallèle avec la galerie)
  - Vérifier que les actions (variant selector + add to cart) slide-up
  - Vérifier que les onglets fade-in
  - Toutes les animations doivent être fluides et coordonnées

- [ ] **Page Catalog** :
  - Ouvrir la page catalogue (`/catalog`)
  - Vérifier que le banner titre slide-up
  - Vérifier que la hero section (si présente) reveal-up
  - Vérifier que les produits apparaissent en stagger (cascade)
  - Animation fluide, pas de saccades

### 4. Animations réutilisables (presets)

**Fichiers** : `animations/presets/*.ts`

- [ ] **Fade-in** : Utilisé dans plusieurs endroits
- [ ] **Fade-out** : Utilisé pour fermer les menus
- [ ] **Slide-up** : Utilisé dans Product, Catalog
- [ ] **Slide-down** : Utilisé pour ouvrir les menus
- [ ] **Stagger-fade-in** : Utilisé pour les listes (catégories, produits)
- [ ] **Scale-pulse** : Utilisé pour le badge panier
- [ ] **Reveal-up** : Utilisé dans Catalog pour la hero section
- [ ] **Fade-scale** : Disponible mais peut-être pas utilisé
- [ ] **Scale-hover** : Disponible mais peut-être pas utilisé

### 5. Performance

- [ ] **60fps** : Toutes les animations doivent être fluides (60fps)
- [ ] **Pas de saccades** : Vérifier qu'il n'y a pas de saccades ou de freezes
- [ ] **Console** : Vérifier qu'il n'y a pas d'erreurs dans la console
- [ ] **Mobile** : Tester sur mobile (responsive)

### 6. Accessibilité

- [ ] **prefers-reduced-motion** :
  - Activer "Réduire les animations" dans les paramètres système
  - Vérifier que les animations sont désactivées ou simplifiées
  - Les loaders doivent s'afficher instantanément

---

## 🔍 Comment tester

### 1. Lancer le frontend

```bash
cd frontend
npm run dev
```

### 2. Ouvrir dans le navigateur

- Ouvrir `http://localhost:3000`
- Ouvrir les DevTools (F12)
- Onglet Console pour vérifier les erreurs
- Onglet Performance pour vérifier les FPS

### 3. Tester chaque animation

Suivre la checklist ci-dessus et cocher chaque point testé.

### 4. Tester sur mobile

- Utiliser les DevTools (mode responsive)
- Ou tester sur un vrai device mobile

---

## ⚠️ Problèmes connus à vérifier

1. **AnimeJS v4 API différente** :
   - Utilise `anime.animate()` au lieu de `anime()`
   - Utilise `anime.createTimeline()` au lieu de `anime.timeline()`
   - Syntaxe `tl.add(targets, params, offset)` au lieu de `tl.add({...})`

2. **Types TypeScript** :
   - Utilise `ReturnType<typeof anime.animate>` au lieu de `anime.AnimeInstance`
   - Timeline retourne `ReturnType<typeof anime.createTimeline>`

3. **Stagger** :
   - Utilise `anime.stagger(ms)` au lieu de `stagger: 0.1` (secondes)

---

## 📝 Notes de test

**Date du test** : _______________

**Tester** : _______________

**Résultats** :
- [ ] Toutes les animations fonctionnent
- [ ] Performance OK (60fps)
- [ ] Pas d'erreurs console
- [ ] Accessibilité OK (prefers-reduced-motion)
- [ ] Mobile OK

**Problèmes rencontrés** :
- 

**Actions à prendre** :
- 

---

## ✅ Une fois les tests validés

Si tous les tests passent, on peut procéder au nettoyage final :
1. Désinstaller GSAP
2. Supprimer `gsap-helpers.ts`
3. Vérifier qu'aucune référence GSAP ne reste
4. Mettre à jour la documentation

