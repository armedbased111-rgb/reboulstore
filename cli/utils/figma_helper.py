"""
Utilitaires pour l'intégration avec Figma
"""

import re
from pathlib import Path
from typing import Dict, List, Optional

def parse_figma_url(figma_url: str) -> Dict[str, str]:
    """
    Parser une URL Figma pour extraire les informations
    
    Args:
        figma_url: URL Figma (ex: https://www.figma.com/file/xxx/yyy)
    
    Returns:
        Dict avec file_id, node_id, etc.
    """
    # Pattern pour URL Figma
    pattern = r'https://www\.figma\.com/(?:file|design)/([a-zA-Z0-9]+)(?:/.*node-id=([^&]+))?'
    match = re.search(pattern, figma_url)
    
    if not match:
        return {}
    
    return {
        'file_id': match.group(1),
        'node_id': match.group(2) if match.group(2) else None,
        'url': figma_url,
    }

def generate_component_from_figma_description(description: str) -> Dict[str, str]:
    """
    Générer des suggestions de composants basées sur une description Figma
    
    Args:
        description: Description du design Figma
    
    Returns:
        Dict avec suggestions de composants shadcn/ui et structure
    """
    suggestions = {
        'shadcn_components': [],
        'structure': [],
        'notes': [],
    }
    
    description_lower = description.lower()
    
    # Détecter les composants shadcn/ui nécessaires
    if 'button' in description_lower or 'bouton' in description_lower:
        suggestions['shadcn_components'].append('button')
    
    if 'input' in description_lower or 'champ' in description_lower or 'formulaire' in description_lower:
        suggestions['shadcn_components'].append('input')
        suggestions['shadcn_components'].append('label')
        suggestions['shadcn_components'].append('form')
    
    if 'card' in description_lower or 'carte' in description_lower:
        suggestions['shadcn_components'].append('card')
    
    if 'dialog' in description_lower or 'modal' in description_lower:
        suggestions['shadcn_components'].append('dialog')
    
    if 'dropdown' in description_lower or 'menu' in description_lower:
        suggestions['shadcn_components'].append('dropdown-menu')
    
    if 'tabs' in description_lower or 'onglets' in description_lower:
        suggestions['shadcn_components'].append('tabs')
    
    if 'table' in description_lower or 'tableau' in description_lower:
        suggestions['shadcn_components'].append('table')
    
    # Notes pour l'implémentation
    suggestions['notes'].append("Analyser le design Figma pour les mesures exactes")
    suggestions['notes'].append("Utiliser TailwindCSS pour le styling")
    suggestions['notes'].append("Respecter le design system A-COLD-WALL*")
    
    return suggestions

def create_figma_analysis_template(figma_url: str, component_name: str) -> str:
    """
    Créer un template d'analyse Figma pour guider l'implémentation
    
    Args:
        figma_url: URL du design Figma
        component_name: Nom du composant à créer
    
    Returns:
        Template markdown avec structure d'analyse
    """
    parsed = parse_figma_url(figma_url)
    
    template = f"""# Analyse Figma - {component_name}

## 📐 Design Figma

**URL** : {figma_url}
**File ID** : {parsed.get('file_id', 'N/A')}
**Node ID** : {parsed.get('node_id', 'N/A')}

## 🎨 Analyse du design

### Structure
- [ ] Layout principal
- [ ] Sections identifiées
- [ ] Composants réutilisables

### Styles
- [ ] Couleurs utilisées
- [ ] Typographie (tailles, poids)
- [ ] Espacements (padding, margin, gap)
- [ ] Bordures et radius

### Composants shadcn/ui à utiliser
- [ ] Liste des composants shadcn nécessaires
- [ ] Variants à utiliser
- [ ] Personnalisations nécessaires

### Responsive
- [ ] Breakpoints identifiés
- [ ] Adaptations mobile/desktop

## 💻 Implémentation

### Fichiers à créer
- `frontend/src/components/{component_name.lower()}/{component_name}.tsx`

### Dépendances
- shadcn/ui : [liste]
- Hooks : [liste]
- Services : [liste]

### Notes
- [Notes d'implémentation]

## ✅ Checklist

- [ ] Design analysé
- [ ] Composants shadcn installés
- [ ] Composant créé
- [ ] Styles appliqués
- [ ] Responsive testé
- [ ] Documentation mise à jour
"""
    
    return template

