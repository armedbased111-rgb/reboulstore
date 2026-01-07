# Utilisation Obsidian - Règles pour l'IA

Document expliquant comment l'IA utilise et maintient le vault Obsidian.

## Quand l'IA consulte Obsidian

### Au début d'une session
- Consulter `Home.md` pour voir l'état actuel
- Consulter les Canvas pertinents selon la tâche
- Vérifier les workflows avant de commencer

### Avant d'exécuter un workflow
- Consulter le Canvas correspondant
- Vérifier les règles critiques
- Suivre les étapes définies

### Quand vous modifiez un Canvas
- Lire les modifications
- Comprendre les changements de workflow
- Adapter le comportement selon les modifications

### Pour comprendre les règles critiques
- Consulter `Regle-Database.canvas` avant toute opération DB
- Consulter `Regle-Deploiement.canvas` avant déploiement
- Vérifier les interdictions et bonnes pratiques

## Quand l'IA met à jour Obsidian

### Après modification d'un fichier MD principal
- Si `ROADMAP_COMPLETE.md` modifié → Vérifier si Canvas à mettre à jour
- Si `CONTEXT.md` modifié → Vérifier si workflows ont changé
- Si `BACKEND.md` ou `FRONTEND.md` modifié → Vérifier Canvas workflows

### Après création d'un nouveau workflow
- Créer un nouveau Canvas pour le workflow
- Ajouter le lien dans `Home.md` et `Index.md`
- Documenter dans `Canvas/README.md`

### Après modification d'une règle critique
- Mettre à jour le Canvas correspondant
- Vérifier que les interdictions et bonnes pratiques sont à jour

### Après complétion d'une phase
- Vérifier si les Canvas doivent refléter les changements
- Mettre à jour les workflows si nécessaire

## Ce que l'IA ne fait PAS

- Ne modifie PAS les Canvas si vous les modifiez (vous gérez)
- Ne modifie PAS sans demander confirmation si modification importante
- Ne modifie PAS si les modifications sont mineures

## Comment l'IA suit les workflows

### Processus de suivi

1. **Identifier le workflow** :
   - Vous demandez une tâche → Identifier le workflow concerné
   - Consulter le Canvas correspondant

2. **Lire le Canvas** :
   - Ouvrir le fichier `.canvas`
   - Comprendre les étapes définies
   - Identifier les règles et interdictions

3. **Suivre les étapes** :
   - Exécuter les étapes dans l'ordre défini
   - Respecter les règles critiques
   - Vérifier les interdictions avant d'agir

4. **Adapter selon modifications** :
   - Si vous avez modifié le Canvas → Lire les modifications
   - Adapter le comportement selon les changements
   - Suivre la nouvelle version du workflow

## Exemples concrets

### Développement Backend
1. Consulter `Workflow-Dev.canvas` → Voir les étapes
2. Consulter `Workflow-Pedagogique.canvas` → Mode pédagogique
3. Suivre : donner code, expliquer, vérifier, corriger

### Déploiement
1. Consulter `Regle-Deploiement.canvas` → Voir les interdictions
2. Consulter `Workflow-Deploy.canvas` → Voir les étapes
3. Suivre : backup, arrêt (sans -v), build, vérification

### Design Figma
1. Consulter `Workflow-Figma.canvas` → Voir les phases
2. Consulter `Workflow-Pedagogique.canvas` → Mode guide
3. Suivre : guider, valider design, coder

## Modification des Canvas par vous

### Quand vous modifiez un Canvas

L'IA va :
1. **Détecter les modifications** :
   - Lire le fichier Canvas modifié
   - Comparer avec sa compréhension précédente
   - Identifier les changements

2. **Comprendre les changements** :
   - Analyser les modifications
   - Adapter sa compréhension du workflow
   - Suivre la nouvelle version

3. **Appliquer les changements** :
   - Utiliser la nouvelle version dans ses réponses
   - Référencer les modifications si pertinent
   - Ne pas revenir à l'ancienne version

## Communication

### Quand l'IA consulte Obsidian
- Informer : "📓 Consultation du workflow dans Obsidian..."
- Référencer : "Selon `Workflow-Dev.canvas`, les étapes sont..."

### Quand l'IA détecte une modification
- Informer : "📝 J'ai détecté des modifications dans `Workflow-X.canvas`"
- Confirmer : "Je vais suivre la nouvelle version du workflow"

### Quand l'IA doit mettre à jour
- Demander confirmation : "Souhaitez-vous que je mette à jour le Canvas `X.canvas` ?"
- Informer : "✅ Canvas `X.canvas` mis à jour"

## Structure Obsidian

### Fichiers principaux
- `Home.md` - Point d'entrée
- `Index.md` - Index complet
- `Canvas/` - Tous les Canvas visuels
- `Workflows/` - Documentation workflows
- `Integrations/` - Documentation intégrations

### Canvas par catégorie
- **Architecture** : `Architecture.canvas`, `Integrations.canvas`
- **Workflows** : `Workflow-Dev.canvas`, `Workflow-Deploy.canvas`, etc.
- **Règles** : `Regle-Database.canvas`, `Regle-Deploiement.canvas`

## Voir aussi

- [[../Canvas/README.md|Canvas README]] - Guide des Canvas
- [[../Home.md|Home]] - Point d'entrée du vault
- [[../Index.md|Index]] - Index complet

