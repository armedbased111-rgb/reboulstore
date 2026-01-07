# Workflow Développement

Processus complet de développement pour le projet Reboul Store.

## Vue d'ensemble

Le workflow de développement suit une approche pédagogique avec alternance Backend ↔ Frontend.

## Processus général

1. **Consultation roadmap** : Vérifier [[../docs/context/ROADMAP_COMPLETE.md|ROADMAP_COMPLETE]] pour identifier la phase en cours
2. **Design (si nécessaire)** : Créer design dans Figma (voir [[Workflows/Design]])
3. **Développement** : Implémenter la fonctionnalité (Backend ou Frontend)
4. **Tests** : Tester la fonctionnalité
5. **Documentation** : Mettre à jour la documentation
6. **Commit** : Commiter avec message clair (voir [[../docs/GIT_WORKFLOW.md|GIT_WORKFLOW]])

## Workflow Backend

### Création d'un module

1. Créer entité TypeORM dans `backend/src/entities/`
2. Créer DTOs dans `backend/src/dto/`
3. Créer service dans `backend/src/modules/[module]/`
4. Créer controller dans `backend/src/modules/[module]/`
5. Enregistrer dans `app.module.ts`
6. Tester les endpoints

### Références

- [[../backend/BACKEND.md|BACKEND]] - Documentation backend complète
- [[../docs/context/API_CONFIG.md|API_CONFIG]] - Configuration API
- [[CLI.md|CLI]] - Workflow CLI pour génération de code

## Workflow Frontend

### Création d'une page

1. Créer composant dans `frontend/src/pages/`
2. Ajouter route dans `App.tsx`
3. Créer services API si nécessaire
4. Créer hooks personnalisés si nécessaire
5. Styling avec TailwindCSS
6. Tester responsive

### Références

- [[../frontend/FRONTEND.md|FRONTEND]] - Documentation frontend complète
- [[Workflows/Design]] - Workflow design Figma

## Workflow Design

Voir [[Workflows/Design]] pour le processus complet Figma → Code.

## Animations

Pour créer des animations AnimeJS, voir [[../docs/animations/ANIMATIONS_GUIDE.md|ANIMATIONS_GUIDE]].

## Tests

- Tests unitaires : `backend/test/` et `frontend/src/__tests__/`
- Tests E2E : `backend/test/app.e2e-spec.ts`
- Tests manuels : Vérifier fonctionnalité dans le navigateur

## Documentation

Après chaque fonctionnalité complétée :

1. Mettre à jour [[../docs/context/ROADMAP_COMPLETE.md|ROADMAP_COMPLETE]] (cocher les tâches)
2. Mettre à jour [[../docs/context/CONTEXT.md|CONTEXT]] si fin de phase
3. Mettre à jour [[../backend/BACKEND.md|BACKEND]] ou [[../frontend/FRONTEND.md|FRONTEND]] selon le contexte

## Git

Voir [[../docs/GIT_WORKFLOW.md|GIT_WORKFLOW]] pour :
- Conventions de branches
- Conventions de commits
- Processus de Pull Request

