# 🎨 Guide TailwindCSS - Classes utiles pour Reboul Store

Document de référence des classes TailwindCSS utilisées dans le projet. Mis à jour au fur et à mesure du développement.

## 📋 Table des matières

- [Espacements (Spacing)](#espacements-spacing)
- [Typographie](#typographie)
- [Couleurs](#couleurs)
- [Layout & Flexbox](#layout--flexbox)
- [Dimensions](#dimensions)
- [Borders & Ombres](#borders--ombres)
- [États interactifs](#états-interactifs)
- [Position](#position)
- [Backgrounds](#backgrounds)
- [Effets visuels](#effets-visuels)

---

## Espacements (Spacing)

### Padding (intérieur)
```css
/* Horizontal (gauche + droite) */
px-[4px]    /* Valeur arbitraire précise */
px-1        /* 4px */
px-2        /* 8px */
px-4        /* 16px */
px-6        /* 24px */
px-8        /* 32px */
px-12       /* 48px */
px-16       /* 64px */

/* Vertical (haut + bas) */
py-[4px]    /* Valeur arbitraire */
py-1        /* 4px */
py-2        /* 8px */
py-4        /* 16px */

/* Tous les côtés */
p-4         /* 16px partout */
```

### Margin (extérieur)
```css
/* Horizontal */
mx-auto     /* Centre horizontalement */
ml-auto     /* Pousse vers la droite */
mr-auto     /* Pousse vers la gauche */

/* Vertical */
mt-4        /* 16px en haut */
mb-4        /* 16px en bas */

/* Gap (entre éléments flex/grid) */
gap-2       /* 8px */
gap-4       /* 16px */
gap-6       /* 24px */
gap-8       /* 32px */
gap-[4px]   /* Valeur arbitraire */
```

### Espacement entre éléments
```css
space-y-4   /* Espacement vertical entre enfants */
space-y-5   /* 20px */
space-x-4   /* Espacement horizontal */
```

---

## Typographie

### Tailles de texte
```css
text-xs     /* 12px */
text-sm     /* 14px */
text-base   /* 16px */
text-lg     /* 18px */
text-xl     /* 20px */
text-2xl    /* 24px */
text-[18px] /* Valeur arbitraire précise */
```

### Poids de police
```css
font-light      /* 300 */
font-normal     /* 400 */
font-medium     /* 500 */
font-semibold   /* 600 */
font-bold       /* 700 */
```

### Transformations
```css
uppercase       /* MAJUSCULES */
lowercase       /* minuscules */
capitalize      /* Première Lettre */
```

### Espacement des lettres
```css
tracking-tight  /* Espacement serré */
tracking-normal /* Normal */
tracking-wide   /* Espacement large */
```

---

## Couleurs

### Couleurs de texte
```css
text-black      /* #000000 */
text-white      /* #FFFFFF */
text-gray-500   /* Gris moyen */
text-gray-700   /* Gris foncé */
```

### Couleurs de fond
```css
bg-white        /* Blanc */
bg-black        /* Noir */
bg-gray-100     /* Gris très clair */
bg-gray-200     /* Gris clair */
bg-[#0000F5]    /* Couleur hex arbitraire (bleu promo banner) */
```

### Opacité
```css
bg-black/10     /* Noir avec 10% d'opacité */
bg-black/20     /* 20% */
text-black/70   /* Texte noir avec 70% d'opacité */
```

---

## Layout & Flexbox

### Display
```css
flex            /* display: flex */
grid            /* display: grid */
hidden          /* display: none */
block           /* display: block */
inline-flex     /* display: inline-flex */
```

### Flex Direction & Alignement
```css
/* Direction */
flex-row        /* Horizontal (défaut) */
flex-col        /* Vertical */

/* Alignement horizontal */
items-center    /* Aligne verticalement au centre */
items-start     /* Aligne en haut */
items-end       /* Aligne en bas */

/* Alignement vertical */
justify-center  /* Centre horizontalement */
justify-between /* Espace entre (extrêmes) */
justify-start   /* Début */
justify-end     /* Fin */
justify-around  /* Espace autour */

/* Répartition */
flex-1          /* Prend tout l'espace disponible */
flex-shrink-0   /* Ne rétrécit pas */
```

---

## Dimensions

### Largeur
```css
w-full          /* 100% */
w-screen        /* 100vw (largeur écran) */
w-64            /* 256px */
w-80            /* 320px */
w-[500px]       /* Valeur arbitraire précise */
```

### Hauteur
```css
h-full          /* 100% */
h-screen        /* 100vh (hauteur écran) */
h-[46px]        /* Valeur arbitraire (navbar) */
h-[500px]       /* Valeur arbitraire (mega menu) */
h-[calc(100vh-46px)] /* Calcul (hauteur écran - navbar) */
```

### Aspect Ratio
```css
aspect-[3/4]    /* Ratio 3:4 (portrait) */
aspect-[4/5]    /* Ratio 4:5 */
aspect-square   /* 1:1 (carré) */
```

---

## Borders & Ombres

### Bordures
```css
border          /* Bordure 1px */
border-t        /* Bordure haut */
border-b        /* Bordure bas */
border-r        /* Bordure droite */
border-l        /* Bordure gauche */
border-gray-200 /* Couleur grise */
border-gray-300 /* Gris un peu plus foncé */
```

### Rayons (border-radius)
```css
rounded         /* 4px */
rounded-md      /* 6px */
rounded-lg      /* 8px */
rounded-full    /* Cercle complet */
```

### Ombres
```css
shadow          /* Ombre légère */
shadow-lg       /* Grande ombre */
shadow-none     /* Pas d'ombre */
```

---

## États interactifs

### Hover
```css
hover:opacity-70    /* Réduit opacité au survol */
hover:opacity-90    /* Légère réduction */
hover:bg-gray-100   /* Change fond au survol */
hover:text-black    /* Change couleur texte */
```

### Focus
```css
focus:outline-none  /* Supprime contour focus */
focus:ring-2        /* Ajoute ring focus */
```

### Transition
```css
transition-opacity  /* Transition douce opacité */
transition-colors   /* Transition douce couleurs */
transition-all      /* Transition toutes propriétés */
```

---

## Position

### Position
```css
relative        /* position: relative */
absolute        /* position: absolute */
fixed           /* position: fixed */
sticky          /* position: sticky */
```

### Positionnement
```css
top-0           /* top: 0 */
top-[46px]      /* Valeur arbitraire */
top-[100px]     /* Valeur arbitraire */
left-0          /* left: 0 */
right-0         /* right: 0 */
inset-0         /* top/right/bottom/left: 0 */
```

### Z-index
```css
z-10            /* z-index: 10 */
z-40            /* z-index: 40 */
z-50            /* z-index: 50 */
```

### Transform
```css
-translate-x-1/2    /* Déplace de -50% horizontalement */
translate-y-1/2     /* Déplace de 50% verticalement */
rotate-180          /* Rotation 180° */
```

---

## Backgrounds

### Fond
```css
bg-white        /* Blanc */
bg-black        /* Noir */
bg-gray-100     /* Gris très clair */
bg-transparent  /* Transparent */
```

### Image de fond
```css
bg-cover        /* Couvre tout l'espace */
bg-center       /* Centre l'image */
bg-no-repeat    /* Pas de répétition */
```

---

## Effets visuels

### Backdrop Blur
```css
backdrop-blur-sm    /* Flou léger (derrière overlay) */
backdrop-blur-md    /* Flou moyen */
backdrop-blur-lg    /* Flou fort */
```

### Opacité
```css
opacity-50      /* 50% d'opacité */
opacity-70      /* 70% */
opacity-90      /* 90% */
```

### Overflow
```css
overflow-hidden     /* Cache le débordement */
overflow-x-auto     /* Scroll horizontal si besoin */
overflow-y-auto     /* Scroll vertical si besoin */
```

---

## Responsive (Breakpoints)

### Préfixes
```css
sm:     /* 640px et plus */
md:     /* 768px et plus */
lg:     /* 1024px et plus */
xl:     /* 1280px et plus */
2xl:    /* 1536px et plus */
```

### Exemples
```css
hidden md:flex       /* Caché sur mobile, visible desktop */
flex md:hidden       /* Visible mobile, caché desktop */
px-4 md:px-8         /* 16px mobile, 32px desktop */
text-sm md:text-base /* Petit mobile, normal desktop */
```

---

## Classes combinées utiles

### Navbar
```css
className="bg-white sticky top-0 z-50"
className="flex items-center justify-between h-[46px] px-[4px]"
```

### Mega Menu
```css
className="fixed top-[100px] left-0 right-0 w-screen h-[500px] bg-white border-b border-gray-200 z-50"
```

### Overlay avec blur
```css
className="fixed inset-0 top-[100px] bg-black/10 backdrop-blur-sm z-40"
```

### Liens navigation
```css
className="text-black uppercase text-sm font-medium hover:opacity-70 transition-opacity"
```

### Boutons
```css
className="bg-black text-white px-4 py-2 rounded-full uppercase text-sm font-medium hover:opacity-90 transition-opacity"
```

---

## Valeurs arbitraires

TailwindCSS permet d'utiliser des valeurs précises avec des crochets `[]` :

```css
w-[500px]           /* Largeur exacte */
h-[46px]            /* Hauteur exacte */
px-[4px]            /* Padding précis */
text-[18px]         /* Taille texte précise */
bg-[#0000F5]        /* Couleur hex précise */
top-[100px]         /* Position précise */
space-y-[4px]       /* Espacement précis */
```

---

## 📝 Notes

- Ce document sera enrichi au fur et à mesure du développement
- Les classes les plus utilisées dans le projet sont en haut de chaque section
- N'hésite pas à ajouter des exemples concrets utilisés dans le projet

---

**Dernière mise à jour :** Navbar & Mega Menu créés ✅
