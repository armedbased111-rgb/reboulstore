# figma-workflow

**Commande** : `/figma-workflow`

Workflow complet Figma → Frontend pour Reboul Store.

## 🎯 Workflow Figma → Frontend (PRIORITAIRE)

### Phase 1 : Design dans Figma (TOI)

1. **Avant de commencer le code** : Tu designs dans Figma
   - Créer/ouvrir le fichier Figma du projet
   - Designer la page/composant (respecter design system)
   - Utiliser Auto Layout (≈ Flexbox)
   - Définir couleurs, typo, espacements (Tailwind-friendly)

2. **Design System Reboul** (à respecter) :
   - **Style** : A-COLD-WALL* (minimaliste, premium)
   - **Typo** : Geist
   - **Couleurs** : Palette Reboul (noir, blanc, gris, accent)
   - **Composants** : shadcn/ui comme base

3. **Partage** :
   - Tu me partages le lien Figma (lien de partage public ou commentaire)
   - Tu me dis quelle page/composant tu as designé
   - Tu me précises les interactions importantes (hover, états, animations)

### Phase 2 : Implémentation Code

4. **Je consulte Figma** :
   - J'analyse ton design
   - Je note les mesures (padding, margin, tailles)
   - Je repère les composants shadcn/ui à utiliser
   - Je planifie la structure (composants, props, state)

5. **Implémentation** :
   - **Mode pédagogique** (défaut) : Je te guide pour coder
   - **Mode normal** (si tu demandes) : Je code directement
   - J'utilise shadcn/ui + TailwindCSS
   - Je respecte ton design (couleurs, espacements, typo)
   - Je structure proprement (composants réutilisables)
   - J'ajoute la logique métier (hooks, API, state)

6. **⚠️ IMPORTANT - Export Figma** :
   - **NE PAS** copier-coller l'export Figma tel quel
   - Utiliser Figma comme **référence visuelle**, pas source de code
   - Recoder proprement avec notre stack (React + shadcn + Tailwind)
   - L'export peut donner des idées de structure, mais à adapter

### Phase 3 : Validation & Ajustements

7. **Tests** :
   - Lancer frontend, vérifier rendu
   - Comparer avec Figma
   - Tester responsive (mobile, tablet, desktop)
   - Tester interactions (hover, focus, etc.)

8. **Ajustements** :
   - Si différences : on ajuste le code ou Figma
   - On itère jusqu'à satisfaction
   - On valide ensemble

### Phase 4 : Documentation

9. **Après implémentation** :
   - Mettre à jour obsidian-vault/Projet/roadmap.md (cocher tâche)
   - Mettre à jour FRONTEND.md (ajouter page/composant)
   - Capturer screenshot si nécessaire

## 📐 Quand utiliser Figma ?

**TOUJOURS** avant de créer une nouvelle page ou composant UI complexe :
- ✅ Pages complètes (Login, Register, Profile, Checkout, Admin, etc.)
- ✅ Composants UI complexes (formulaires, cartes, modales, etc.)
- ✅ Nouveaux layouts ou sections
- ✅ Modifications importantes de design

**Pas nécessaire** pour :
- ❌ Corrections mineures (couleur, padding)
- ❌ Composants shadcn/ui standards (déjà designés)
- ❌ Ajustements techniques (fix bugs, optimisations)

## 🛠️ Plugins Figma recommandés

- **Tailwind CSS** : Générer classes Tailwind depuis design
- **Iconify** : Bibliothèque d'icônes (Lucide, Heroicons, etc.)
- **Anima** ou **Figma to Code** : Export React (référence, pas production)
- **Auto Layout** : Déjà intégré (essentiel pour layouts flexibles)

## ✅ Bonnes pratiques Figma

### À FAIRE

- ✅ Nommer clairement les layers (ex: `Button/Primary`, `Form/Input`)
- ✅ Utiliser Auto Layout partout (facilite compréhension structure)
- ✅ Créer des composants réutilisables (Design System)
- ✅ Utiliser variables de couleurs (cohérence)
- ✅ Designer mobile-first (comme notre code)

### À ÉVITER

- ❌ Designs trop complexes (difficile à coder)
- ❌ Positions absolues partout (préférer flexbox/grid)
- ❌ Trop d'effets custom (ombres complexes, gradients multiples)
- ❌ Oublier les états (hover, active, disabled, error)

## 📱 Responsive dans Figma

### Breakpoints (à respecter dans le code)

- **Mobile** : < 768px (styles de base)
- **Tablet** : 768px - 1024px (`md:`)
- **Desktop** : > 1024px (`lg:`)

### Design mobile-first

- Designer d'abord la version mobile
- Puis adapter pour desktop
- Utiliser Auto Layout avec contraintes flexibles

## 🎨 Conversion Figma → TailwindCSS

### Mesures

- **Padding/Margin** : Convertir pixels → classes Tailwind (ex: 16px → `p-4`)
- **Couleurs** : Utiliser palette Tailwind ou valeurs hex dans config
- **Typographie** : Utiliser classes `.text-h1`, `.text-h2`, etc.

### Layout

- **Auto Layout** → `flex` ou `grid` Tailwind
- **Constraints** → `justify-*`, `items-*`, `self-*`
- **Gap** → `gap-*` Tailwind

## 📚 Documentation de référence

- **FIGMA_DEV_GUIDE.md** : Guide détaillé développement depuis Figma
- **FIGMA_WORKFLOW.md** : Workflow complet
- **frontend/FRONTEND.md** : Documentation frontend
- **.cursor/rules/project-rules.mdc** : Règles complètes

## 🔗 Commandes associées

- `/frontend-workflow` : Workflow frontend complet
- `/getcontext` : Recherche de contexte
- `/component-create` : Créer un composant

