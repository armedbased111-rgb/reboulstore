# 📊 Analyse Migration GSAP → AnimeJS

**Date** : 20 décembre 2025  
**Objectif** : Analyser l'utilisation actuelle de GSAP et identifier les équivalents AnimeJS

---

## 📋 Table des matières

1. [Inventaire des animations GSAP](#inventaire-des-animations-gsap)
2. [Fonctionnalités GSAP utilisées](#fonctionnalités-gsap-utilisées)
3. [Équivalents AnimeJS](#équivalents-animejs)
4. [Plan de migration](#plan-de-migration)

---

## 📦 Inventaire des animations GSAP

### 1. Presets d'animations réutilisables

#### 1.1 `fade-in.ts`
- **Fichier** : `frontend/src/animations/presets/fade-in.ts`
- **Fonction** : `animateFadeIn(element, options)`
- **Fonctionnalité GSAP** : `gsap.fromTo()` avec `opacity`
- **Usage** : Apparition en fondu simple
- **Options** : `duration`, `delay`, `ease`, `from`, `to`

#### 1.2 `slide-up.ts`
- **Fichier** : `frontend/src/animations/presets/slide-up.ts`
- **Fonction** : `animateSlideUp(element, options)`
- **Fonctionnalité GSAP** : `gsap.fromTo()` avec `opacity` + `y` (translateY)
- **Usage** : Apparition depuis le bas avec slide
- **Options** : `duration`, `delay`, `ease`, `distance`

#### 1.3 `slide-down.ts`
- **Fichier** : `frontend/src/animations/presets/slide-down.ts`
- **Fonction** : `animateSlideDown(element, options)`
- **Fonctionnalité GSAP** : `gsap.fromTo()` avec `opacity` + `y` (translateY négatif)
- **Usage** : Apparition depuis le haut (menus, dropdowns)
- **Options** : `duration`, `delay`, `ease`, `distance`

#### 1.4 `stagger-fade-in.ts`
- **Fichier** : `frontend/src/animations/presets/stagger-fade-in.ts`
- **Fonction** : `animateStaggerFadeIn(elements, options)`
- **Fonctionnalité GSAP** : `gsap.fromTo()` avec `stagger` (animation en cascade)
- **Usage** : Animation de plusieurs éléments en cascade (listes, grilles)
- **Options** : `duration`, `delay`, `ease`, `stagger`, `distance`

#### 1.5 `scale-hover.ts`
- **Fichier** : `frontend/src/animations/presets/scale-hover.ts`
- **Fonction** : `animateScaleHover(element, options)`
- **Fonctionnalité GSAP** : `gsap.to()` avec event listeners (`mouseenter`, `mouseleave`)
- **Usage** : Effet zoom au survol
- **Options** : `scale`, `duration`, `ease`
- **Spécificité** : Retourne fonction de nettoyage pour `useEffect`

#### 1.6 `reveal-up.ts`
- **Fichier** : `frontend/src/animations/presets/reveal-up.ts`
- **Fonction** : `animateRevealUp(element, options)`
- **Fonctionnalité GSAP** : `gsap.fromTo()` avec `opacity` + `y`
- **Usage** : Révélation depuis le bas (sections, hero)
- **Options** : `duration`, `delay`, `ease`, `distance`, `opacity`

#### 1.7 `fade-scale.ts`
- **Fichier** : `frontend/src/animations/presets/fade-scale.ts`
- **Fonction** : `animateFadeScale(element, options)`
- **Fonctionnalité GSAP** : `gsap.fromTo()` avec `opacity` + `scale`
- **Usage** : Apparition avec effet zoom (boutons, badges)
- **Options** : `duration`, `delay`, `ease`, `scaleFrom`, `scaleTo`

### 2. Composants utilisant GSAP directement

#### 2.1 `Header.tsx`
- **Fichier** : `frontend/src/components/layout/Header.tsx`
- **Animations utilisées** :
  - `gsap.fromTo()` : Animation d'apparition du header
  - `animateSlideDown()` : Ouverture mega menu CATALOGUE
  - `animateStaggerFadeIn()` : Animation catégories et images en stagger
  - `gsap.to()` : Fermeture mega menu (fade out)
  - `gsap.fromTo()` : Animation badge panier (scale pulse)
- **Fonctionnalités GSAP** :
  - `gsap.fromTo()` : Animation from/to
  - `gsap.to()` : Animation to
  - `gsap.set()` : Set valeurs (nettoyage)
  - Timeline implicite (chaînage via `animateSlideDown` + `animateStaggerFadeIn`)

#### 2.2 `TopBarLoader.tsx`
- **Fichier** : `frontend/src/components/loaders/TopBarLoader.tsx`
- **Animations utilisées** :
  - `gsap.timeline()` : Timeline avec `repeat: -1` et `yoyo: true`
  - `gsap.fromTo()` : Animation `scaleX` (barre de progression)
- **Fonctionnalités GSAP** :
  - `gsap.timeline()` : Timeline avec repeat et yoyo
  - `tl.kill()` : Nettoyage timeline

#### 2.3 `PageLoader.tsx`
- **Fichier** : `frontend/src/components/loaders/PageLoader.tsx`
- **Animations utilisées** :
  - `gsap.timeline()` : Timeline complexe avec plusieurs animations
  - `gsap.fromTo()` : Animation barre (`scaleX`)
  - `gsap.fromTo()` : Animation objet progressif (`value: 0 → 100`)
  - `onUpdate` callback : Mise à jour texte progression
  - `gsap.fromTo()` : Animation logo (opacity + scale)
  - Positionnement relatif dans timeline (`0`, `-=0.2`)
- **Fonctionnalités GSAP** :
  - Timeline complexe avec chaînage
  - Animation d'objet (pas DOM)
  - Callbacks `onUpdate`
  - Positionnement relatif dans timeline

#### 2.4 `Product.tsx`
- **Fichier** : `frontend/src/pages/Product.tsx`
- **Animations utilisées** :
  - `gsap.timeline()` : Timeline orchestrant plusieurs animations
  - `animateFadeIn()` : Fade-in page
  - `animateSlideUp()` : Slide-up breadcrumbs, galerie, infos, actions
  - Positionnement relatif (`"-=0.2"`, `"-=0.3"`, etc.)
- **Fonctionnalités GSAP** :
  - Timeline avec chaînage d'animations
  - Positionnement relatif dans timeline

#### 2.5 `Catalog.tsx`
- **Fichier** : `frontend/src/pages/Catalog.tsx`
- **Animations utilisées** :
  - `gsap.timeline()` : Timeline orchestrant plusieurs animations
  - `animateSlideUp()` : Slide-up banner
  - `animateRevealUp()` : Reveal-up hero section
  - `animateStaggerFadeIn()` : Stagger fade-in grille produits
  - Positionnement relatif
- **Fonctionnalités GSAP** :
  - Timeline avec chaînage d'animations
  - Positionnement relatif dans timeline

### 3. Utilitaires GSAP

#### 3.1 `gsap-helpers.ts`
- **Fichier** : `frontend/src/animations/utils/gsap-helpers.ts`
- **Fonction** : `useGSAP(callback, deps)`
- **Fonctionnalité GSAP** : `gsap.context()` pour nettoyage automatique
- **Usage** : Hook React pour utiliser GSAP avec nettoyage automatique

#### 3.2 `constants.ts`
- **Fichier** : `frontend/src/animations/utils/constants.ts`
- **Contenu** : Constantes pour durées, easings, délais, stagger
- **Usage** : Cohérence dans toutes les animations

---

## 🔧 Fonctionnalités GSAP utilisées

### 1. Animations de base

| Fonctionnalité GSAP | Usage | Fréquence |
|---------------------|-------|-----------|
| `gsap.fromTo()` | Animation from/to (état initial → état final) | ⭐⭐⭐⭐⭐ Très fréquent |
| `gsap.to()` | Animation to (état actuel → état final) | ⭐⭐⭐ Moyen |
| `gsap.set()` | Set valeurs sans animation (nettoyage) | ⭐ Rare |

### 2. Timelines

| Fonctionnalité GSAP | Usage | Fréquence |
|---------------------|-------|-----------|
| `gsap.timeline()` | Orchestrer plusieurs animations | ⭐⭐⭐⭐ Fréquent |
| `tl.add()` | Ajouter animation à timeline | ⭐⭐⭐⭐ Fréquent |
| Positionnement relatif (`"-=0.2"`) | Décaler animations dans timeline | ⭐⭐⭐ Moyen |
| `tl.kill()` | Nettoyer timeline | ⭐⭐⭐ Moyen |
| `repeat: -1` | Répéter infiniment | ⭐⭐ Rare (loaders) |
| `yoyo: true` | Animation aller-retour | ⭐ Rare (TopBarLoader) |

### 3. Propriétés animées

| Propriété | Usage | Fréquence |
|-----------|-------|-----------|
| `opacity` | Fade in/out | ⭐⭐⭐⭐⭐ Très fréquent |
| `y` (translateY) | Slide up/down | ⭐⭐⭐⭐ Fréquent |
| `scale` | Zoom | ⭐⭐⭐ Moyen |
| `scaleX` | Barre de progression | ⭐⭐ Rare (loaders) |

### 4. Options d'animation

| Option | Usage | Fréquence |
|--------|-------|-----------|
| `duration` | Durée animation (secondes) | ⭐⭐⭐⭐⭐ Très fréquent |
| `delay` | Délai avant animation | ⭐⭐⭐⭐ Fréquent |
| `ease` | Type d'easing | ⭐⭐⭐⭐ Fréquent |
| `stagger` | Délai entre éléments multiples | ⭐⭐⭐ Moyen |
| `onUpdate` | Callback pendant animation | ⭐ Rare (PageLoader) |

### 5. Easings utilisés

| Easing GSAP | Usage | Fréquence |
|-------------|-------|-----------|
| `"power2.out"` | Ease par défaut | ⭐⭐⭐⭐⭐ Très fréquent |
| `"power1.out"` | Ease doux | ⭐⭐⭐ Moyen |
| `"power1.inOut"` | Ease doux in/out | ⭐⭐ Rare |
| `"power2.in"` | Ease rapide in | ⭐ Rare |
| `"none"` | Linéaire | ⭐ Rare |

### 6. Fonctionnalités avancées

| Fonctionnalité | Usage | Fréquence |
|----------------|-------|-----------|
| `gsap.context()` | Nettoyage automatique | ⭐⭐ Rare (useGSAP hook) |
| Animation d'objet (pas DOM) | Progression numérique | ⭐ Rare (PageLoader) |
| Event listeners | Hover effects | ⭐ Rare (scale-hover) |

---

## 🎯 Équivalents AnimeJS

### 1. Animations de base

#### GSAP `gsap.fromTo()` → AnimeJS `anime()`

**GSAP** :
```typescript
gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.5 })
```

**AnimeJS** :
```typescript
anime({
  targets: element,
  opacity: [0, 1],  // Array [from, to]
  duration: 500     // Millisecondes (pas secondes)
})
```

✅ **Équivalent direct** : Oui, syntaxe différente mais même fonctionnalité

#### GSAP `gsap.to()` → AnimeJS `anime()`

**GSAP** :
```typescript
gsap.to(element, { scale: 1.1, duration: 0.3 })
```

**AnimeJS** :
```typescript
anime({
  targets: element,
  scale: 1.1,
  duration: 300
})
```

✅ **Équivalent direct** : Oui

#### GSAP `gsap.set()` → AnimeJS CSS direct ou `anime.set()`

**GSAP** :
```typescript
gsap.set(element, { scale: 1 })
```

**AnimeJS** :
```typescript
// Option 1 : CSS direct
element.style.transform = 'scale(1)';

// Option 2 : AnimeJS set (si disponible)
// Note : AnimeJS n'a pas de méthode set() native, utiliser CSS direct
```

⚠️ **Équivalent partiel** : Utiliser CSS direct ou créer helper

### 2. Timelines

#### GSAP `gsap.timeline()` → AnimeJS `anime.timeline()`

**GSAP** :
```typescript
const tl = gsap.timeline();
tl.fromTo(element1, { opacity: 0 }, { opacity: 1, duration: 0.5 });
tl.fromTo(element2, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2");
```

**AnimeJS** :
```typescript
const tl = anime.timeline();
tl.add({
  targets: element1,
  opacity: [0, 1],
  duration: 500
});
tl.add({
  targets: element2,
  opacity: [0, 1],
  duration: 500
}, '-=200');  // Positionnement relatif (millisecondes)
```

✅ **Équivalent direct** : Oui, syntaxe similaire

#### GSAP `tl.add()` → AnimeJS `tl.add()`

✅ **Équivalent direct** : Oui, même méthode

#### GSAP Positionnement relatif → AnimeJS Positionnement relatif

**GSAP** :
```typescript
tl.add(animation, "-=0.2");  // Secondes
```

**AnimeJS** :
```typescript
tl.add(animation, '-=200');  // Millisecondes
```

✅ **Équivalent direct** : Oui, attention aux unités (secondes vs millisecondes)

#### GSAP `repeat: -1` → AnimeJS `loop: true`

**GSAP** :
```typescript
gsap.timeline({ repeat: -1, yoyo: true })
```

**AnimeJS** :
```typescript
anime.timeline({
  loop: true,
  direction: 'alternate'  // Équivalent yoyo
})
```

✅ **Équivalent direct** : Oui

#### GSAP `tl.kill()` → AnimeJS `tl.pause()` ou `anime.remove()`

**GSAP** :
```typescript
tl.kill();
```

**AnimeJS** :
```typescript
// Option 1 : Pause (peut reprendre)
tl.pause();

// Option 2 : Remove (supprime complètement)
anime.remove(targets);
```

⚠️ **Équivalent partiel** : AnimeJS n'a pas de `kill()` exact, utiliser `remove()` ou `pause()`

### 3. Propriétés animées

| Propriété GSAP | Propriété AnimeJS | Équivalent |
|----------------|-------------------|------------|
| `opacity` | `opacity` | ✅ Direct |
| `y` (translateY) | `translateY` | ✅ Direct |
| `scale` | `scale` | ✅ Direct |
| `scaleX` | `scaleX` | ✅ Direct |

✅ **Toutes les propriétés utilisées ont des équivalents directs**

### 4. Options d'animation

| Option GSAP | Option AnimeJS | Équivalent |
|-------------|----------------|------------|
| `duration` (secondes) | `duration` (millisecondes) | ✅ Direct (conversion nécessaire) |
| `delay` (secondes) | `delay` (millisecondes) | ✅ Direct (conversion nécessaire) |
| `ease` (string) | `easing` (string) | ⚠️ Noms différents |
| `stagger` (secondes) | `delay: anime.stagger(ms)` | ✅ Direct (conversion nécessaire) |
| `onUpdate` | `update` | ✅ Direct |

### 5. Easings

| Easing GSAP | Easing AnimeJS | Équivalent |
|-------------|----------------|------------|
| `"power2.out"` | `"easeOutQuad"` | ✅ Équivalent |
| `"power1.out"` | `"easeOutSine"` | ⚠️ Approximatif |
| `"power1.inOut"` | `"easeInOutSine"` | ⚠️ Approximatif |
| `"power2.in"` | `"easeInQuad"` | ✅ Équivalent |
| `"none"` | `"linear"` | ✅ Équivalent |

⚠️ **Attention** : Les noms d'easing sont différents, créer mapping

### 6. Fonctionnalités avancées

#### GSAP `gsap.context()` → AnimeJS Helper custom

**GSAP** :
```typescript
const ctx = gsap.context(() => {
  // Animations
}, scope);
ctx.revert();  // Nettoyage
```

**AnimeJS** : Pas d'équivalent natif, créer helper custom

⚠️ **Équivalent partiel** : Créer helper `useAnimeJS` similaire à `useGSAP`

#### GSAP Animation d'objet → AnimeJS Animation d'objet

**GSAP** :
```typescript
const progressObj = { value: 0 };
gsap.fromTo(progressObj, { value: 0 }, {
  value: 100,
  onUpdate: () => { /* ... */ }
});
```

**AnimeJS** :
```typescript
const progressObj = { value: 0 };
anime({
  targets: progressObj,
  value: [0, 100],
  update: (anim) => {
    progressObj.value = anim.progress;  // Approximatif
  }
});
```

⚠️ **Équivalent partiel** : AnimeJS peut animer objets mais syntaxe différente

#### GSAP Event listeners → AnimeJS Event listeners

**GSAP** :
```typescript
element.addEventListener('mouseenter', () => {
  gsap.to(element, { scale: 1.1 });
});
```

**AnimeJS** :
```typescript
element.addEventListener('mouseenter', () => {
  anime({ targets: element, scale: 1.1 });
});
```

✅ **Équivalent direct** : Oui, même approche

---

## 📝 Plan de migration

### Étape 1 : Installation & Configuration
- [ ] Installer AnimeJS : `npm install animejs`
- [ ] Installer types : `npm install --save-dev @types/animejs`
- [ ] Créer mapping easings (GSAP → AnimeJS)

### Étape 2 : Migration Presets (ordre recommandé)
1. `fade-in.ts` (le plus simple)
2. `slide-up.ts` (ajoute translateY)
3. `slide-down.ts` (similaire à slide-up)
4. `fade-scale.ts` (ajoute scale)
5. `reveal-up.ts` (combinaison)
6. `stagger-fade-in.ts` (ajoute stagger)
7. `scale-hover.ts` (ajoute event listeners)

### Étape 3 : Migration Utils
- [ ] Créer `animejs-helpers.ts` (équivalent `gsap-helpers.ts`)
- [ ] Créer hook `useAnimeJS` (équivalent `useGSAP`)
- [ ] Adapter `constants.ts` (conversion secondes → millisecondes)

### Étape 4 : Migration Composants
1. `TopBarLoader.tsx` (timeline simple)
2. `PageLoader.tsx` (timeline complexe)
3. `Header.tsx` (plusieurs animations)
4. `Product.tsx` (timeline orchestrée)
5. `Catalog.tsx` (timeline orchestrée)

### Étape 5 : Nettoyage
- [ ] Supprimer imports GSAP
- [ ] Désinstaller GSAP : `npm uninstall gsap`
- [ ] Vérifier qu'aucune référence GSAP ne reste

---

## ⚠️ Points d'attention

### 1. Unités de temps
- **GSAP** : Secondes (0.5 = 500ms)
- **AnimeJS** : Millisecondes (500 = 500ms)
- **Action** : Créer helper de conversion ou multiplier par 1000

### 2. Easings
- **GSAP** : `"power2.out"`
- **AnimeJS** : `"easeOutQuad"`
- **Action** : Créer mapping dans `constants.ts`

### 3. Stagger
- **GSAP** : `stagger: 0.1` (secondes)
- **AnimeJS** : `delay: anime.stagger(100)` (millisecondes)
- **Action** : Adapter syntaxe et unités

### 4. Nettoyage
- **GSAP** : `gsap.context()` + `ctx.revert()`
- **AnimeJS** : Pas d'équivalent natif
- **Action** : Créer helper custom pour nettoyage

### 5. Animation d'objet
- **GSAP** : `gsap.fromTo(obj, {value: 0}, {value: 100})`
- **AnimeJS** : Syntaxe différente
- **Action** : Adapter pour `PageLoader.tsx`

---

## ✅ Conclusion

**Faisabilité** : ✅ **OUI**, migration possible

**Complexité** : ⚠️ **MOYENNE** - Principalement conversion syntaxe et unités

**Points critiques** :
1. Conversion unités (secondes → millisecondes)
2. Mapping easings
3. Helper nettoyage (équivalent `gsap.context()`)
4. Animation d'objet dans `PageLoader.tsx`

**Recommandation** : Migrer étape par étape, tester chaque preset avant de passer au suivant.

