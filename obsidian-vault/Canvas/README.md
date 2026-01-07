# Canvas Visuels - Guide

Tous les Canvas visuels du vault pour visualiser les workflows et règles du projet.

## Architecture & Système

### Architecture.canvas
Schéma complet de l'architecture système :
- 3 sites e-commerce (Reboul, CP Company, Outlet)
- Admin Centrale
- Infrastructure (Docker, Nginx, Cloudflare)
- Services externes

### Integrations.canvas
Schéma des intégrations externes :
- Stripe (paiements)
- Cloudinary (images)
- Cloudflare (CDN, SSL)
- GA4 (analytics)
- Connexions Frontend/Backend

## Workflows

### Workflow-Dev.canvas
Processus complet de développement :
1. Consultation roadmap
2. Design (si nécessaire)
3. Backend
4. Frontend
5. Tests
6. Documentation
7. Commit

### Workflow-Deploy.canvas
Processus de déploiement sécurisé :
1. Pré-déploiement (backup, vérifications)
2. Déploiement
3. Vérification
4. Monitoring
5. Maintenance

### Workflow-Pedagogique.canvas
Comment on travaille ensemble :
- Philosophie pédagogique
- Mode Backend/Frontend
- Mode Design/Figma
- Vérification et correction

### Workflow-Figma.canvas
Processus Figma → Frontend :
1. Phase 1 : Design Figma
2. Phase 2 : Implémentation
3. Phase 3 : Validation
- Design System
- Export Figma (ne pas copier-coller)

### Workflow-Animations.canvas
Création d'animations AnimeJS :
1. Décider type (réutilisable/spécifique)
2. Créer fichier
3. Exporter
4. Utiliser
- Structure animations/
- Bonnes pratiques

### Workflow-Git.canvas
Workflow Git complet :
1. Créer branche
2. Développer
3. Pull Request
4. Review & Merge
5. Déploiement
- Conventions commits

### Workflow-CLI.canvas
Utilisation CLI Python :
- Avant développement
- Génération code
- Base de données
- Documentation
- Serveur
- Après tâche

## Règles Critiques

### Regle-Database.canvas
Règle critique base de données :
- DB TOUJOURS sur VPS
- Développement : Tunnel SSH
- Production : Connexion directe
- ❌ Interdictions
- ✅ Bonnes pratiques
- Vérification

### Regle-Deploiement.canvas
Protection volumes DB lors déploiement :
- ❌ Interdictions (docker compose down -v)
- 1. Backup obligatoire
- 2. Arrêt services (sans -v)
- 3. Cleanup build uniquement
- 4. Build & Start
- 5. Vérification
- Rollback si problème

### Workflow-Database-Securite.canvas
Workflow complet Database & Sécurité :
- 💾 Sauvegarde automatique (obligatoire avant modifications)
- ⏰ Backup quotidien (cron job)
- 🔒 Sécurité suppression (vérifications, soft delete)
- ✅ Vérification dépendances
- 🗑️ Soft delete (préféré)
- 📋 Workflow suppression sécurisée
- 🔄 Restauration (si problème)
- 📊 Audit & Logs

## Utilisation

### Modifier un Canvas

1. Ouvrir le Canvas dans Obsidian
2. Modifier les nœuds (déplacer, redimensionner, modifier texte)
3. Ajouter/supprimer des nœuds
4. Modifier les connexions (edges)
5. Sauvegarder automatiquement

### Travailler ensemble

- Je peux lire les Canvas pour comprendre les workflows
- Vous pouvez modifier les Canvas pour ajuster les processus
- Les modifications sont visibles dans Git
- On peut discuter des changements ensemble

### Bonnes pratiques

- Garder les Canvas simples et clairs
- Utiliser des couleurs cohérentes
- Lier les Canvas entre eux si nécessaire
- Mettre à jour quand les workflows changent

## Voir aussi

- [[../Workflows/Development.md|Workflow Development]] - Documentation développement
- [[../Workflows/Deployment.md|Workflow Deployment]] - Documentation déploiement
- [[../Workflows/Design.md|Workflow Design]] - Documentation design
- [[../Server/Database-Securite.md|Database & Sécurité]] - Documentation complète database et sécurité

