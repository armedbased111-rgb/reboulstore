# Workflow Design

Processus complet de design Figma → Frontend pour Reboul Store.

## Vue d'ensemble

Le workflow design suit une approche : Design d'abord dans Figma, puis implémentation propre en code.

## Processus complet

### Phase 1 : Design dans Figma

1. **Créer/ouvrir le fichier Figma** du projet
2. **Designer la page/composant** (respecter design system)
3. **Utiliser Auto Layout** (équivalent Flexbox)
4. **Définir couleurs, typo, espacements** (Tailwind-friendly)
5. **Partager le lien Figma**

### Phase 2 : Implémentation Code

1. **Consulter Figma** : Analyser le design
2. **Noter les mesures** : padding, margin, tailles
3. **Repérer les composants shadcn/ui** à utiliser
4. **Planifier la structure** : composants, props, state
5. **Implémenter** : React + shadcn/ui + TailwindCSS
6. **Respecter le design** : couleurs, espacements, typo

### Phase 3 : Validation

1. **Comparer avec Figma** : Vérifier le rendu
2. **Tester responsive** : mobile, tablet, desktop
3. **Tester interactions** : hover, focus, etc.
4. **Ajuster si nécessaire**

## Design System

### Inspiration : A-COLD-WALL*

- **Style** : Minimaliste, premium, industriel, streetwear
- **Palette** : Monochrome (noir, blanc, gris) + accent rouge
- **Typo** : Geist
- **Composants** : shadcn/ui comme base

### Couleurs

- Primary : #1A1A1A
- Secondary : #F3F3F3
- Accent : #D93434
- Product Cards : #F8F8F8

### Espacements

Système 8px : 4px, 8px, 16px, 24px, 32px, 48px, 64px

## Références

- [[../docs/export/FIGMA_WORKFLOW.md|FIGMA_WORKFLOW]] - Workflow complet Figma → Frontend
- [[../docs/export/FIGMA_DEV_GUIDE.md|FIGMA_DEV_GUIDE]] - Guide développeur Figma
- [[../frontend/FRONTEND.md|FRONTEND]] - Documentation frontend
- [[../docs/animations/ANIMATIONS_GUIDE.md|ANIMATIONS_GUIDE]] - Guide animations AnimeJS

## Bonnes pratiques

### À faire
- Nommer clairement les layers (ex: `Button/Primary`, `Form/Input`)
- Utiliser Auto Layout partout
- Créer des composants réutilisables
- Utiliser variables de couleurs
- Designer mobile-first

### À éviter
- Designs trop complexes
- Positions absolues partout
- Trop d'effets custom
- Oublier les états (hover, active, disabled, error)

## Plugins Figma recommandés

- **Tailwind CSS** : Générer classes Tailwind depuis design
- **Iconify** : Bibliothèque d'icônes (Lucide, Heroicons)
- **Auto Layout** : Déjà intégré (essentiel)

