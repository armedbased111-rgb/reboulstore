# Vault Obsidian - Reboul Store

Vault Obsidian complet pour le projet Reboul Store. Structure organisée pour naviguer dans toute la documentation et visualiser les workflows.

## Structure complète

```
obsidian-vault/
├── Home.md                    # Point d'entrée principal
├── Index.md                   # Index complet de tous les documents
├── README.md                  # Ce fichier
├── CHANGELOG.md               # Historique des améliorations
│
├── Workflows/                 # Tous les workflows
│   ├── Development.md        # Workflow développement
│   ├── Deployment.md         # Workflow déploiement
│   ├── Design.md             # Workflow design Figma
│   ├── CLI.md                # Workflow CLI
│   ├── Integrations.md       # Workflow intégrations
│   └── Testing.md            # Workflow tests
│
├── Integrations/              # Intégrations externes
│   ├── Stripe.md             # Paiements Stripe
│   ├── Cloudflare.md         # CDN et SSL
│   ├── GA4.md                # Analytics
│   └── Images.md             # Gestion images Cloudinary
│
├── Server/                    # Documentation serveur
│   ├── Production.md         # Serveur production VPS
│   └── Development.md        # Développement local
│
├── CLI/                       # CLI Python
│   └── Overview.md           # Vue d'ensemble CLI
│
├── Context/                   # Contexte et planning
│   └── Planning.md           # Planning et roadmap
│
├── Architecture/              # Architecture
│   └── Overview.md           # Vue d'ensemble architecture
│
├── Phases/                    # Phases du projet
│   └── Overview.md           # Récapitulatifs phases
│
└── Canvas/                    # Canvas visuels
    ├── Architecture.canvas   # Schéma architecture système
    ├── Workflow-Dev.canvas   # Processus développement
    ├── Workflow-Deploy.canvas # Processus déploiement
    └── Integrations.canvas   # Schéma intégrations
```

## Utilisation

### Ouvrir le vault dans Obsidian

1. Ouvrir Obsidian
2. Ouvrir un vault existant
3. Sélectionner le dossier `obsidian-vault/`

### Navigation

- **Home.md** : Point d'entrée avec liens vers toutes les sections
- **Index.md** : Index complet organisé par catégories
- **Workflows/** : Tous les processus de développement
- **Integrations/** : Toutes les intégrations externes
- **Server/** : Documentation serveur
- **CLI/** : Documentation CLI Python
- **Context/** : Contexte et planning
- **Phases/** : Récapitulatifs phases

### Canvas

Les Canvas sont des schémas visuels interactifs :
- **Architecture.canvas** : Vue d'ensemble de l'architecture système
- **Workflow-Dev.canvas** : Processus complet de développement
- **Workflow-Deploy.canvas** : Processus de déploiement sécurisé
- **Integrations.canvas** : Schéma des intégrations externes

### Liens internes

Les liens `[[...]]` permettent de naviguer entre les documents. Les liens vers les fichiers dans `docs/` utilisent le chemin relatif `../docs/...`.

## Contenu couvert

### Workflows
- Développement (Backend, Frontend)
- Déploiement (Production, Sécurité)
- Design (Figma → Code)
- CLI (Automatisation)
- Intégrations (Stripe, Cloudflare, GA4, Images)
- Tests (Unitaires, E2E, Fonctionnels)

### Intégrations
- **Stripe** : Paiements, webhooks, checkout
- **Cloudflare** : CDN, SSL, cache
- **GA4** : Analytics, tracking
- **Cloudinary** : Images, optimisation

### Serveur
- **Production** : VPS OVH, Docker, Nginx, sécurité
- **Development** : Tunnel SSH, configuration locale

### CLI
- Génération de code
- Gestion base de données
- Gestion serveur
- Documentation

### Contexte
- Roadmap complète (24 phases)
- Statut projet
- Planning
- Phases complétées

## Avantages

- Navigation rapide entre documents
- Visualisation des workflows avec Canvas
- Graph view pour voir les relations entre concepts
- Recherche full-text dans tout le vault
- Backlinks pour voir qui référence un document
- Structure organisée par catégories

## Maintenance

- Les fichiers dans `docs/` restent la source de vérité
- Le vault pointe vers ces fichiers (pas de duplication)
- Ajouter des liens `[[...]]` progressivement dans les docs existantes
- Créer de nouveaux Canvas selon les besoins
- Mettre à jour l'Index.md quand de nouveaux documents sont ajoutés

## Voir aussi

- [[CHANGELOG.md|CHANGELOG]] - Historique des améliorations
- [[Index.md|Index]] - Index complet de tous les documents
