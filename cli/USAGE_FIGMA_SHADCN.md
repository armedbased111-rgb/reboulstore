# 🎨 Guide d'utilisation - Figma & shadcn/ui

**Date** : 16 décembre 2025

---

## 🎯 Workflow Figma → Code avec le CLI

### Étape 1 : Designer dans Figma

1. Créer/ouvrir le fichier Figma
2. Designer le composant/page
3. Partager le lien Figma

### Étape 2 : Analyser avec le CLI

```bash
# Créer un template d'analyse
python cli/main.py figma analyze "https://www.figma.com/file/xxx/yyy" ProductCard
```

**Résultat** : Crée `figma/productcard-analysis.md` avec un template structuré

### Étape 3 : Suggérer des composants shadcn/ui

```bash
# Basé sur une description
python cli/main.py figma suggest "Un formulaire avec bouton et champs"

# Ou basé sur le design Figma analysé
# (remplir le template d'analyse d'abord)
```

**Résultat** : Liste des composants shadcn/ui à installer

### Étape 4 : Installer les composants shadcn/ui

```bash
# Lister les composants installés
python cli/main.py shadcn list

# Installer un composant
python cli/main.py shadcn install button
python cli/main.py shadcn install input
python cli/main.py shadcn install card

# Voir les composants disponibles
python cli/main.py shadcn available
```

### Étape 5 : Créer le composant

```bash
# Avec template shadcn/ui (variants)
python cli/main.py code component ProductCard --shadcn

# Ou composant standard
python cli/main.py code component ProductCard --domain product
```

### Étape 6 : Implémenter

1. Ouvrir le template d'analyse (`figma/productcard-analysis.md`)
2. Remplir avec les détails du design Figma
3. Utiliser les composants shadcn/ui installés
4. Appliquer les styles TailwindCSS depuis Figma
5. Ajouter la logique métier

---

## 📋 Exemples complets

### Exemple 1 : Créer un formulaire de contact

```bash
# 1. Analyser le design Figma
python cli/main.py figma analyze "https://figma.com/file/xxx" ContactForm

# 2. Suggérer des composants
python cli/main.py figma suggest "Formulaire avec champs nom, email, message et bouton"

# 3. Installer les composants nécessaires
python cli/main.py shadcn install input
python cli/main.py shadcn install button
python cli/main.py shadcn install label
python cli/main.py shadcn install form

# 4. Créer le composant
python cli/main.py code component ContactForm --shadcn

# 5. Implémenter en utilisant le template d'analyse
```

### Exemple 2 : Créer une carte produit

```bash
# 1. Analyser le design Figma
python cli/main.py figma analyze "https://figma.com/file/xxx" ProductCard

# 2. Installer card si nécessaire
python cli/main.py shadcn install card

# 3. Créer le composant
python cli/main.py code component ProductCard --domain product --shadcn

# 4. Implémenter avec le style A-COLD-WALL*
```

---

## 🎨 Composants shadcn/ui courants

### Formulaires
- `input` : Champs de saisie
- `label` : Labels
- `button` : Boutons
- `form` : Formulaires
- `textarea` : Zones de texte
- `select` : Sélecteurs
- `checkbox` : Cases à cocher
- `radio-group` : Boutons radio

### Layout
- `card` : Cartes
- `separator` : Séparateurs
- `sheet` : Panneaux latéraux
- `dialog` : Modales

### Navigation
- `tabs` : Onglets
- `dropdown-menu` : Menus déroulants
- `navigation-menu` : Navigation

### Feedback
- `toast` : Notifications
- `alert` : Alertes
- `skeleton` : Placeholders de chargement

---

## 💡 Bonnes pratiques

### Avec shadcn/ui

1. **Vérifier d'abord** si un composant shadcn existe
   ```bash
   python cli/main.py shadcn list
   ```

2. **Installer** les composants nécessaires
   ```bash
   python cli/main.py shadcn install [nom]
   ```

3. **Créer** des composants basés sur shadcn
   ```bash
   python cli/main.py code component [nom] --shadcn
   ```

4. **Personnaliser** selon le design system A-COLD-WALL*

### Avec Figma

1. **Analyser** le design d'abord
   ```bash
   python cli/main.py figma analyze [url] [nom]
   ```

2. **Remplir** le template d'analyse avec les détails

3. **Suggérer** les composants nécessaires
   ```bash
   python cli/main.py figma suggest [description]
   ```

4. **Installer** et créer les composants

5. **Implémenter** en suivant le template

---

## 🔗 Commandes associées

- `/figma-workflow` : Workflow Figma complet
- `/cli-workflow` : Guide complet du CLI
- `cli/USAGE.md` : Guide d'utilisation général

---

**Dernière mise à jour** : 16 décembre 2025

