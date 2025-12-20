# 🚀 Guide d'utilisation du CLI Python

## 📦 Installation

```bash
cd cli
./setup.sh
source venv/bin/activate
```

## 🎯 Cas d'usage principaux

### 1. Mettre à jour la roadmap après avoir terminé une tâche

```bash
# Cocher une tâche spécifique
python main.py roadmap update --task "15.1 Configuration Cloudinary"

# Marquer une phase complète
python main.py roadmap update --phase 15 --complete
```

### 2. Vérifier la cohérence de la roadmap

```bash
python main.py roadmap check
```

### 3. Obtenir les détails d'une phase

```bash
python main.py roadmap phase 15
```

### 4. Générer un résumé de contexte pour Cursor

```bash
# Génère .cursor/context-summary.md
python main.py context generate

# Ou spécifier un fichier de sortie
python main.py context generate --output .cursor/my-context.md
```

### 5. Synchroniser tous les fichiers de contexte

```bash
python main.py context sync
```

### 6. Générer du code rapidement

```bash
# Générer un composant React
python main.py code component ProductCard --domain UI

# Générer un module NestJS (basique)
python main.py code module Reviews

# Générer un module NestJS complet (Entity + DTOs + Service + Controller + Module)
python main.py code module Reviews --full

# Générer une entité TypeORM
python main.py code entity Review

# Générer des DTOs
python main.py code dto Review --type all

# Générer un service NestJS
python main.py code service Review

# Générer un controller NestJS
python main.py code controller Review

# Générer une page React
python main.py code page Orders
```

### 7. Générer un script de test

```bash
# Pour un endpoint
python main.py test generate endpoint products

# Pour un module
python main.py test generate module orders
```

### 8. Valider la documentation

```bash
python main.py docs validate
```

### 9. Synchroniser la documentation

```bash
python main.py docs sync
```

## 🔄 Workflow recommandé

### Après avoir terminé une tâche

```bash
# 1. Cocher la tâche dans la roadmap
python main.py roadmap update --task "15.1 Configuration Cloudinary"

# 2. Vérifier la cohérence
python main.py roadmap check

# 3. Si la phase est complète, la marquer
python main.py roadmap update --phase 15 --complete

# 4. Synchroniser le contexte
python main.py context sync

# 5. Générer un nouveau résumé pour Cursor
python main.py context generate
```

### Avant de commencer une nouvelle phase

```bash
# 1. Vérifier l'état de la roadmap
python main.py roadmap check

# 2. Obtenir les détails de la phase précédente
python main.py roadmap phase 14

# 3. Générer un résumé de contexte à jour
python main.py context generate
```

## 🎨 Intégration avec Cursor

Le CLI peut être utilisé directement depuis Cursor :

1. **Générer un résumé de contexte** avant une session de travail
2. **Mettre à jour la roadmap** après chaque tâche
3. **Valider la cohérence** avant de commiter

## 📚 Commandes complètes

Voir `python main.py --help` pour la liste complète des commandes.

