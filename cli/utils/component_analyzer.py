"""
Analyseur de code pour détecter les composants shadcn/ui utilisés
"""

import re
from pathlib import Path
from typing import List, Set

def detect_shadcn_imports_in_file(file_path: Path) -> List[str]:
    """
    Détecter les imports shadcn/ui dans un fichier
    
    Args:
        file_path: Chemin vers le fichier à analyser
    
    Returns:
        Liste des composants shadcn/ui détectés
    """
    if not file_path.exists():
        return []
    
    try:
        content = file_path.read_text(encoding='utf-8')
        
        # Pattern pour détecter les imports shadcn/ui
        # Ex: import { Button } from "@/components/ui/button"
        # Ex: import { Card, CardHeader } from "@/components/ui/card"
        pattern = r'from\s+["\']@/components/ui/(\w+)["\']'
        
        matches = re.findall(pattern, content)
        
        # Retourner la liste unique
        return list(set(matches))
    except Exception:
        return []

def detect_shadcn_imports_in_code(code: str) -> List[str]:
    """
    Détecter les imports shadcn/ui dans du code
    
    Args:
        code: Code source à analyser
    
    Returns:
        Liste des composants shadcn/ui détectés
    """
    # Pattern pour détecter les imports shadcn/ui
    pattern = r'from\s+["\']@/components/ui/(\w+)["\']'
    
    matches = re.findall(pattern, code)
    
    # Retourner la liste unique
    return list(set(matches))

def analyze_component_dependencies(component_path: Path) -> Set[str]:
    """
    Analyser les dépendances shadcn/ui d'un composant
    
    Args:
        component_path: Chemin vers le fichier composant
    
    Returns:
        Set des composants shadcn/ui requis
    """
    if not component_path.exists():
        return set()
    
    dependencies = set()
    
    # Analyser le fichier lui-même
    dependencies.update(detect_shadcn_imports_in_file(component_path))
    
    # Analyser les imports relatifs (si nécessaire)
    # TODO: Parser les imports relatifs et analyser récursivement
    
    return dependencies

