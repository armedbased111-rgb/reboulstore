# 🎨 Guide Figma Dev → React - Best Practices

**Version** : 1.0  
**Date** : 10 décembre 2025  
**Basé sur** : Expérience Login Page Reboul Store

---

## 🎯 Philosophie

**Figma = Design System de vérité**  
Tout ce qui est dans Figma doit être reproduit **EXACTEMENT** dans le code React.

---

## 🔧 Workflow en 8 étapes

### 1. 📸 Récupérer le design Figma

```typescript
// Dans Cursor, utiliser les tools Figma
get_design_context({ nodeId: "1:19" })
get_screenshot({ nodeId: "1:19" })
```

**Résultat** :
- Code Tailwind généré par Figma
- Screenshot visuel pour comparaison

---

### 2. 🧠 ANALYSER avant de coder

**Questions à se poser** :

#### Structure
- Combien de colonnes ? (1, 2, 3 ?)
- Largeurs fixes ou flexibles ?
- Positions absolues ou relatives ?

#### Espacements
- Quels sont les gaps exacts ? (`gap-[1.5px]`, `gap-6`, etc.)
- Quels sont les margins/paddings ? (`mb-[71px]`, `pl-4`, etc.)
- Où sont les paddings ? (Container principal ou colonnes ?)

#### Responsive
- Mobile : Layout vertical ou horizontal ?
- Desktop : Largeurs fixes ou fluid ?
- Breakpoint de transition ? (768px, 1024px ?)

#### Éléments
- Quels composants HTML ? (`<input>`, `<button>`, `<div>` ?)
- Y a-t-il des états ? (hover, focus, error)

---

### 3. 📝 Planifier la conversion

#### Figma Absolute → React Relative

**Figma génère souvent** :
```typescript
<div className="absolute top-[71px] left-0 right-0">
  <div className="absolute top-[355px]">
    ...
  </div>
</div>
```

**On convertit en** :
```typescript
<div className="space-y-[71px]">
  {/* Premier élément */}
  {/* Deuxième élément (284px plus bas = 355-71) */}
</div>
```

**Règle** : Garder les **MÊMES valeurs d'espacement**, juste changer le layout.

---

### 4. 💻 Coder React propre

#### Minimum de divs

❌ **Mauvais** (trop de divs) :
```typescript
<div>
  <div>
    <div>
      <label>Email</label>
    </div>
  </div>
  <div>
    <div>
      <input type="email" />
    </div>
  </div>
</div>
```

✅ **Bon** (HTML propre) :
```typescript
<div className="space-y-[1.5px]">
  <label htmlFor="email">Email</label>
  <input id="email" type="email" />
</div>
```

#### HTML sémantique

```typescript
<header>     // Pas <div> pour le header
<form>       // Pas <div> pour le formulaire
<label>      // Pas <div> pour les labels
<input>      // Pas <div> pour les inputs
<button>     // Pas <div> pour les boutons
```

#### Utiliser `space-y-*`

```typescript
// Au lieu de margins sur chaque enfant
<div className="space-y-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

### 5. 📱 Responsive dès le début

#### Grid avec largeurs FIXES (pas 50%/50%)

❌ **Mauvais** :
```typescript
<div className="grid grid-cols-2">  // 50% / 50% → crée des espaces
```

✅ **Bon** :
```typescript
<div className="grid grid-cols-1 lg:grid-cols-[478px_1fr]">
  {/* Colonne 1 : 478px fixe */}
  {/* Colonne 2 : Le reste (1fr) */}
</div>
```

#### Garder les MÊMES espacements en responsive

❌ **Mauvais** :
```typescript
<div className="mb-12 lg:mb-[71px]">  // Change l'espacement mobile !
```

✅ **Bon** :
```typescript
<div className="mb-[71px]">  // Même espacement partout
```

#### Alignements responsive

```typescript
// Titre centré mobile, gauche desktop
className="text-center lg:text-left"

// Formulaire centré mobile, gauche desktop
className="justify-center lg:justify-start"
```

---

### 6. 🎨 Valeurs EXACTES (jamais approx)

#### Espacements

```typescript
✅ gap-[1.5px]     // EXACT Figma
✅ mb-[71px]       // EXACT Figma
✅ lg:gap-[10px]   // EXACT Figma

❌ gap-0.5         // Approximation (2px au lieu de 1.5px)
❌ mb-20           // Approximation (80px au lieu de 71px)
❌ lg:gap-2        // Approximation (8px au lieu de 10px)
```

#### Typographie

```typescript
✅ text-[36px] leading-[32px] tracking-[-0.6px]  // EXACT
✅ text-[14px] leading-[20px] tracking-[0.35px]  // EXACT

❌ text-4xl       // Approximation (36px mais leading différent)
❌ text-sm        // Approximation (14px mais leading différent)
```

#### Couleurs

```typescript
✅ text-[#4a5565]           // EXACT Figma
✅ text-[rgba(0,0,0,0.5)]   // EXACT Figma

❌ text-gray-600            // Approximation
❌ text-black/50            // Approximation (peut varier)
```

---

### 7. 🔍 Gaps et Paddings précis

#### Padding sur le container principal (pas sur les colonnes)

❌ **Mauvais** :
```typescript
<div className="grid grid-cols-2">
  <div className="p-6">Colonne 1</div>  // Padding sur colonne
  <div className="p-6">Colonne 2</div>
</div>
```

✅ **Bon** :
```typescript
<div className="grid grid-cols-2 pb-[15px] pl-4 pr-[9px] pt-[10px]">
  <div>Colonne 1</div>  // Pas de padding
  <div>Colonne 2</div>
</div>
```

#### Gap entre colonnes

```typescript
<div className="grid grid-cols-[478px_1fr] lg:gap-[10px]">
  {/* 10px d'espace entre les colonnes en desktop */}
</div>
```

---

### 8. ✅ Validation finale

#### Checklist

- [ ] Comparer avec screenshot Figma (côte à côte)
- [ ] Vérifier tous les espacements (inspecter avec DevTools)
- [ ] Tester responsive (mobile 375px, desktop 1440px)
- [ ] Vérifier typographie (taille, line-height, letter-spacing)
- [ ] Vérifier couleurs (HEX exact)
- [ ] Vérifier gaps et paddings
- [ ] Tester interactions (hover, focus, error)
- [ ] Valider accessibilité (labels, aria, keyboard)

---

## 🧩 Exemples concrets

### Exemple 1 : Field Email/Password

**Figma** :
```typescript
<div className="absolute content-stretch flex flex-col gap-[1.5px] items-start pb-0 pt-[2.5px] px-0 relative shrink-0 w-full">
  <div className="flex flex-col font-['Geist:Medium'] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-nowrap tracking-[0.35px] uppercase">
    <p className="leading-[20px] whitespace-pre">Email</p>
  </div>
  <div className="bg-white border border-black border-solid h-[48px] overflow-clip relative rounded-[2px] shrink-0 w-full">
    ...
  </div>
</div>
```

**React propre** :
```typescript
<div className="space-y-[1.5px]">
  <label 
    htmlFor="email"
    className="block font-[Geist] font-medium text-[14px] leading-[20px] tracking-[0.35px] uppercase"
  >
    Email
  </label>
  <input
    id="email"
    type="email"
    className="w-full h-12 px-3 bg-white border border-black rounded-[2px] font-[Geist] text-[14px]"
  />
</div>
```

**Changements** :
- ✅ `<label>` + `<input>` au lieu de divs
- ✅ `htmlFor` pour accessibilité
- ✅ `space-y-[1.5px]` au lieu de `gap-[1.5px]` (conversion relative)
- ✅ Toutes les valeurs gardées (`text-[14px]`, `leading-[20px]`, etc.)

---

### Exemple 2 : Grid 2 colonnes

**Figma** :
```typescript
<div className="grid grid-cols-[repeat(2,_minmax(0px,_1fr))] pb-0 pl-[16px] pr-[9px] pt-[10px]">
  <div className="w-[478px]">Form</div>
  <div className="w-[920px]">Video</div>
</div>
```

**React propre + responsive** :
```typescript
<div className="grid grid-cols-1 lg:grid-cols-[478px_1fr] lg:gap-[10px] pb-[15px] pl-4 pr-[9px] pt-[10px]">
  <div className="lg:w-[478px]">Form</div>
  <div className="hidden lg:block">Video</div>
</div>
```

**Changements** :
- ✅ `grid-cols-1` en mobile, `lg:grid-cols-[478px_1fr]` en desktop
- ✅ Largeur fixe `478px` pour la colonne form (pas 50%)
- ✅ `1fr` pour la colonne vidéo (prend le reste)
- ✅ `lg:gap-[10px]` pour l'espace entre colonnes
- ✅ Vidéo masquée en mobile (`hidden lg:block`)

---

## 📋 Checklist récapitulative

### Avant de coder
- [ ] `get_design_context` appelé
- [ ] `get_screenshot` pour comparaison
- [ ] Structure Figma analysée
- [ ] Plan de conversion établi

### Pendant le code
- [ ] HTML sémantique (`<header>`, `<form>`, etc.)
- [ ] Minimum de divs
- [ ] Valeurs EXACTES Figma
- [ ] `space-y-*` pour espacements
- [ ] Responsive dès le début

### Après le code
- [ ] Comparaison visuelle avec Figma
- [ ] Test responsive (mobile + desktop)
- [ ] Validation espacements
- [ ] Test interactions
- [ ] Accessibilité OK

---

## 🎓 Principes clés

1. **Analyser d'abord, coder ensuite**
2. **Valeurs exactes, jamais d'approximation**
3. **React propre, minimum de divs**
4. **Responsive dès le début**
5. **Garder les mêmes espacements partout**
6. **Grid avec largeurs fixes (pas 50%/50%)**
7. **Padding sur container, pas sur colonnes**
8. **Comparer visuellement avant de valider**

---

## 🚀 Pour la suite

Ce guide sera le **standard** pour toutes les pages :
- ✅ Login (terminée - espacements Figma exacts)
- ✅ Register (terminée - espacements optimisés pour formulaires longs)
- ⏳ Profile
- ⏳ Checkout
- ⏳ Admin Dashboard

**Objectif** : Workflow Figma → React maîtrisé et reproductible ! 🎯

---

## 📝 Note importante : Formulaires longs

Pour les formulaires avec beaucoup de champs (comme Register), **adapter les espacements** :

### **Login (4 champs)** :
```typescript
space-y-[71px]  // Header → Form (71px)
space-y-6       // Entre champs (24px)
```

### **Register (6 champs)** :
```typescript
space-y-8   // Header → Form (32px) ← Réduit
space-y-4   // Entre champs (16px) ← Réduit
space-y-3   // Sections (12px) ← Réduit
py-2        // Divider (8px) ← Réduit
```

**Règle** : Plus de champs = espacements plus compacts pour que tout soit visible sans scroll.

**Objectif** : Toujours garder la structure Figma, mais ajuster les valeurs d'espacement selon le contexte.
