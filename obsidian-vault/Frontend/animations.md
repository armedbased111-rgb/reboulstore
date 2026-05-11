---
type: frontend
---
# Animations — AnimeJS

Liens : [[Frontend/Frontend]]

---

## Règles fondamentales

- **Bibliothèque unique** : AnimeJS
- Chaque animation dans `frontend/src/animations/`
- Animations réutilisables dans `animations/presets/`
- Hook `useAnimation()` via AnimationProvider (nettoyage automatique au démontage)
- Respecter `prefers-reduced-motion` (géré par `useAnimation()`)
- Constantes dans `animations/utils/constants.ts`

## Structure

```
frontend/src/animations/
├── index.ts
├── presets/            ← animations réutilisables (fadeIn, slideUp, etc.)
├── components/         ← animations spécifiques par composant
└── utils/
    ├── constants.ts    ← ANIMATION_DURATIONS, ANIMATION_EASES
    └── animejs-helpers.ts  ← toMilliseconds(), convertEasing()
```

## Bonnes pratiques

- Créer dans `presets/` si l'animation peut servir ailleurs
- Utiliser `useAnimation()` — ne jamais gérer le nettoyage manuellement
- Utiliser les constantes (pas de valeurs hardcodées)
- Documenter avec JSDoc si l'animation est complexe
- Tester `prefers-reduced-motion`

## À éviter

- Dupliquer le code d'animation dans plusieurs composants
- Oublier de nettoyer au démontage (= fuite mémoire)
- Animations trop longues ou trop intrusives (reste premium, subtil)

## Référence complète

`docs/animations/ANIMATIONS_GUIDE.md`
