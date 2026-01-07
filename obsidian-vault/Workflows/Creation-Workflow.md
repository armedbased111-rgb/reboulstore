# Création de Nouveaux Workflows

Processus pour créer et intégrer de nouveaux workflows dans le projet.

## Processus de création

### Phase 1 : Design dans Obsidian (PRIORITAIRE)

**Étape 1 : Créer un Canvas**
- Créer un nouveau fichier `.canvas` dans `obsidian-vault/Canvas/`
- Nommer selon le workflow : `Workflow-[Nom].canvas` ou `Regle-[Nom].canvas`
- Visualiser le workflow avec des nœuds et connexions

**Étape 2 : Itérer ensemble**
- Discuter le workflow visuellement
- Modifier le Canvas pour ajuster
- Valider ensemble avant de passer à l'étape suivante

**Étape 3 : Documenter**
- Créer un document Markdown dans `obsidian-vault/Workflows/`
- Expliquer le workflow en détail
- Ajouter les liens dans `Home.md` et `Index.md`

### Phase 2 : Ajout aux project-rules

**Une fois le workflow validé dans Obsidian** :
- Ajouter la section correspondante dans `.cursor/rules/project-rules.mdc`
- Référencer le Canvas Obsidian dans les règles
- Définir les règles d'application

### Phase 3 : Utilisation

**Appliquer le workflow** :
- Utiliser le workflow dans le projet
- Suivre les étapes définies dans le Canvas
- Référencer le Canvas si besoin

## Ordre recommandé

```
1. Obsidian (Canvas + document)
   ↓
   Design et validation visuelle
   ↓
2. Project-rules
   ↓
   Ajout aux règles une fois validé
   ↓
3. Utilisation
   ↓
   Appliquer dans le projet
```

## Avantages

### Design d'abord
- Visualisation claire avant implémentation
- Itération facile sur le design
- Validation ensemble

### Séparation claire
- Obsidian = Design et visualisation
- Project-rules = Règles d'application
- Documentation = Référence complète

### Trace permanente
- Canvas visuel toujours disponible
- Historique des itérations
- Référence pour l'IA

## Exemples

### Workflow simple
- Peut être ajouté directement aux project-rules
- Pas besoin de Canvas si évident

### Workflow complexe
- Toujours commencer par Obsidian
- Créer Canvas pour visualiser
- Itérer avant d'ajouter aux règles

## Communication

### Quand vous proposez un nouveau workflow

L'IA va :
1. Suggérer : "Créons d'abord un Canvas dans Obsidian pour visualiser ce workflow ?"
2. Créer le Canvas ensemble
3. Itérer sur le design
4. Une fois validé : "Souhaitez-vous que j'ajoute ce workflow aux project-rules ?"

### Quand vous modifiez un workflow existant

L'IA va :
1. Détecter les modifications dans le Canvas
2. Comprendre les changements
3. Adapter son comportement
4. Proposer de mettre à jour les project-rules si nécessaire

## Voir aussi

- [[Obsidian-Usage.md|Obsidian Usage]] - Comment l'IA utilise Obsidian
- [[../Canvas/README.md|Canvas README]] - Guide des Canvas
- [[../Home.md|Home]] - Point d'entrée

