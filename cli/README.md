# 🚀 CLI Python - Reboul Store

CLI Python pour automatiser les tâches répétitives et améliorer le contexte pour Cursor.

## 📋 Installation

```bash
cd cli
pip install -r requirements.txt
```

## 🎯 Commandes disponibles

### `roadmap update`
Mettre à jour la roadmap automatiquement
- Cocher les tâches terminées
- Marquer les phases comme complètes
- Synchroniser avec CONTEXT.md

### `roadmap check`
Vérifier la cohérence de la roadmap
- Détecter les phases incomplètes
- Identifier les dépendances manquantes
- Vérifier la synchronisation avec CONTEXT.md

### `roadmap phase [numéro]`
Afficher les détails d'une phase
- Liste des tâches
- État d'avancement
- Dépendances

### `context generate`
Générer un résumé de contexte pour Cursor
- Analyser ROADMAP_COMPLETE.md
- Générer un résumé structuré
- Identifier les phases en cours

### `context sync`
Synchroniser tous les fichiers de contexte
- ROADMAP_COMPLETE.md ↔ CONTEXT.md
- BACKEND.md ↔ ROADMAP_COMPLETE.md
- FRONTEND.md ↔ ROADMAP_COMPLETE.md

### `code generate component [nom]`
Générer un composant React
- Template avec props typées
- Structure standard
- Documentation JSDoc

### `code module [nom] [--full]`
Générer un module NestJS
- Module, Service, Controller
- Option `--full` : Génère Entity + DTOs + Service + Controller + Module complet

### `code entity [nom]`
Générer une entité TypeORM
- Template avec décorateurs TypeORM
- Support relations (OneToMany, ManyToOne, OneToOne)
- Timestamps automatiques

### `code dto [entity_name] [--type create|update|all]`
Générer des DTOs
- CreateDto avec validation class-validator
- UpdateDto avec PartialType
- Support automatique depuis entité existante

### `code service [nom]`
Générer un service NestJS
- Méthodes CRUD automatiques
- Injection de repository
- Gestion d'erreurs

### `code controller [nom]`
Générer un controller NestJS
- Endpoints CRUD complets
- Validation automatique
- Décorateurs HTTP

### `code generate page [nom]`
Générer une page React
- Template avec structure standard
- Gestion loading/error states
- Intégration routes

### `test generate [endpoint|module]`
Générer un script de test
- Basé sur les endpoints/modules existants
- Template de test fonctionnel
- Configuration automatique

### `docs validate`
Valider la cohérence de la documentation
- Vérifier les liens
- Détecter les incohérences
- Identifier les fichiers obsolètes

### `docs sync`
Synchroniser toute la documentation
- Mettre à jour les dates
- Synchroniser les versions
- Vérifier les références

## 🔧 Utilisation

```bash
# Mettre à jour la roadmap
python cli/main.py roadmap update --phase 15 --task "15.1 Configuration Cloudinary"

# Vérifier la cohérence
python cli/main.py roadmap check

# Générer un composant
python cli/main.py code generate component ProductCard

# Générer un contexte pour Cursor
python cli/main.py context generate --output .cursor/context-summary.md
```

## 📚 Architecture

```
cli/
├── main.py              # Point d'entrée principal
├── commands/            # Commandes modulaires
│   ├── roadmap.py      # Commandes roadmap
│   ├── context.py      # Commandes contexte
│   ├── code.py         # Génération de code
│   ├── test.py         # Génération de tests
│   └── docs.py         # Validation/sync docs
├── utils/               # Utilitaires
│   ├── parser.py       # Parsing markdown
│   ├── generator.py    # Génération de code
│   └── validator.py    # Validation
└── templates/           # Templates de code
    ├── component.tsx
    ├── module.ts
    └── page.tsx
```

