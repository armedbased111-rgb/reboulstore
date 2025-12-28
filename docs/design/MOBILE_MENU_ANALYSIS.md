# 📱 Analyse Menu Hamburger Mobile - A-COLD-WALL*

**Date** : 20 décembre 2025  
**Objectif** : Analyser et documenter le menu hamburger mobile de A-COLD-WALL* pour implémentation cohérente

---

## 🎯 Structure générale

### 1. Bouton Hamburger

**Position** : En haut à droite de la navbar (mobile uniquement)  
**Style** : 
- 3 lignes horizontales (icône hamburger classique)
- Taille : ~24px × 24px
- Couleur : Noir (#1A1A1A)
- Animation : Transformation en "X" à l'ouverture

### 2. Menu Overlay

**Comportement** :
- Overlay plein écran (fond blanc ou légèrement transparent)
- Slide depuis la droite ou depuis le haut
- Z-index élevé pour être au-dessus de tout
- Fermeture : Clic sur overlay, bouton X, ou Escape

**Style A-COLD-WALL*** :
- Fond : Blanc (#FFFFFF) ou très légèrement gris (#FAFAFA)
- Typographie : Uppercase, Geist (ou équivalent)
- Espacement : Généreux, minimaliste

---

## 📋 Structure du contenu du menu

### Ordre des éléments (du haut vers le bas) :

1. **Header du menu** (optionnel)
   - Logo ou titre
   - Bouton fermeture (X)

2. **Navigation principale**
   - CATALOGUE (avec sous-menu accordéon)
   - BRANDS (avec sous-menu accordéon)
   - SALE
   - THE CORNER
   - C.P. COMPANY

3. **Recherche** (optionnel)
   - Input de recherche
   - Icône loupe

4. **Compte utilisateur**
   - MON COMPTE / LOGIN
   - Profil (si connecté)

5. **Panier**
   - Badge avec quantité
   - Lien vers /cart

6. **Footer du menu** (optionnel)
   - Liens légaux
   - Social media

---

## 🎨 Style et design

### Typographie
- **Taille** : 16-18px pour les liens principaux
- **Poids** : Regular à Medium
- **Casse** : UPPERCASE
- **Espacement** : Letter-spacing : 0.1-0.2em

### Couleurs
- **Texte** : Noir (#1A1A1A)
- **Fond** : Blanc (#FFFFFF)
- **Hover** : Opacité réduite (0.7) ou underline
- **Séparateurs** : Gris clair (#E5E5E5)

### Espacement
- **Padding vertical** : 16-24px entre sections
- **Padding horizontal** : 20-32px
- **Espacement entre liens** : 12-16px

---

## 🔄 Interactions et animations

### Ouverture/Fermeture
- **Animation** : Slide depuis la droite (ou fade + scale)
- **Durée** : 0.3-0.4s
- **Easing** : easeOutQuad (fluide)

### Sous-menus (Accordéon)
- **Comportement** : Expand/Collapse au clic
- **Animation** : Slide-down avec fade
- **Icône** : Flèche qui tourne (▼ → ▲)

### Hover/Active
- **Liens** : Opacité 0.7 ou underline
- **Transitions** : 0.2s ease

---

## 📐 Structure HTML recommandée

```html
<!-- Bouton hamburger -->
<button className="md:hidden" onClick={toggleMenu}>
  <svg>...</svg> <!-- Icône hamburger/X -->
</button>

<!-- Menu overlay -->
{isOpen && (
  <div className="fixed inset-0 z-[9999] bg-white">
    {/* Header menu */}
    <div className="flex justify-between items-center p-6 border-b">
      <Logo />
      <button onClick={closeMenu}>✕</button>
    </div>

    {/* Navigation */}
    <nav className="p-6">
      {/* CATALOGUE avec accordéon */}
      <div>
        <button onClick={toggleCatalogue}>
          CATALOGUE
          <span>{isCatalogueOpen ? '▲' : '▼'}</span>
        </button>
        {isCatalogueOpen && (
          <ul>
            <li><Link to="/catalog/category1">Category 1</Link></li>
            <li><Link to="/catalog/category2">Category 2</Link></li>
          </ul>
        )}
      </div>

      {/* Autres liens */}
      <Link to="/sale">SALE</Link>
      <Link to="/the-corner">THE CORNER</Link>
      <Link to="/cp-company">C.P. COMPANY</Link>

      {/* BRANDS avec accordéon */}
      <div>
        <button onClick={toggleBrands}>
          BRANDS
          <span>{isBrandsOpen ? '▲' : '▼'}</span>
        </button>
        {isBrandsOpen && (
          <ul>
            <li><Link to="/brand/brand1">Brand 1</Link></li>
            <li><Link to="/brand/brand2">Brand 2</Link></li>
          </ul>
        )}
      </div>
    </nav>

    {/* Footer menu */}
    <div className="p-6 border-t">
      <Link to="/account">MON COMPTE</Link>
      <Link to="/cart">PANIER (3)</Link>
    </div>
  </div>
)}
```

---

## 🎬 Animations AnimeJS recommandées

### Ouverture du menu
```typescript
// Slide depuis la droite
anime.animate(menuRef.current, {
  translateX: ['100%', '0%'],
  opacity: [0, 1],
  duration: 400,
  easing: 'easeOutQuad'
});
```

### Fermeture du menu
```typescript
// Slide vers la droite
anime.animate(menuRef.current, {
  translateX: ['0%', '100%'],
  opacity: [1, 0],
  duration: 300,
  easing: 'easeInQuad'
});
```

### Accordéon (sous-menu)
```typescript
// Slide-down avec fade
anime.animate(submenuRef.current, {
  height: [0, 'auto'],
  opacity: [0, 1],
  duration: 300,
  easing: 'easeOutQuad'
});
```

### Transformation hamburger → X
```typescript
// Rotation des lignes
anime.animate(line1Ref.current, {
  rotate: [0, 45],
  translateY: [0, 8],
  duration: 300
});
anime.animate(line2Ref.current, {
  opacity: [1, 0],
  duration: 200
});
anime.animate(line3Ref.current, {
  rotate: [0, -45],
  translateY: [0, -8],
  duration: 300
});
```

---

## ✅ Checklist d'implémentation

### Structure
- [ ] Bouton hamburger avec icône SVG
- [ ] État `isMobileMenuOpen`
- [ ] Overlay plein écran
- [ ] Header du menu (logo + bouton fermeture)
- [ ] Navigation principale
- [ ] Sous-menus accordéon (CATALOGUE, BRANDS)
- [ ] Liens secondaires (SALE, THE CORNER, etc.)
- [ ] Section compte/panier

### Style
- [ ] Fond blanc minimaliste
- [ ] Typographie uppercase
- [ ] Espacement généreux
- [ ] Séparateurs subtils
- [ ] Hover states

### Animations
- [ ] Ouverture slide/fade
- [ ] Fermeture slide/fade
- [ ] Transformation hamburger → X
- [ ] Accordéon expand/collapse
- [ ] Stagger pour les liens (optionnel)

### Interactions
- [ ] Toggle au clic hamburger
- [ ] Fermeture au clic overlay
- [ ] Fermeture au clic bouton X
- [ ] Fermeture avec Escape
- [ ] Scroll lock quand menu ouvert
- [ ] Navigation vers page ferme le menu

### Accessibilité
- [ ] ARIA labels
- [ ] Focus trap dans le menu
- [ ] Keyboard navigation
- [ ] Respect prefers-reduced-motion

---

## 📝 Notes

- Le menu doit être cohérent avec le style desktop (même typographie, couleurs)
- Les sous-menus peuvent être simplifiés sur mobile (pas besoin de mega menu avec images)
- Penser à la performance : éviter les animations lourdes sur mobile
- Tester sur différents appareils (iPhone, Android, différentes tailles)

---

**Prochaine étape** : Implémenter le menu dans `Header.tsx` en suivant cette structure

