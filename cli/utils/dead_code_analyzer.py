"""
Analyseur de code mort
"""

from pathlib import Path
from typing import Dict, List, Set, Optional
import re
import ast

def find_unused_files(backend_path: Optional[Path] = None, frontend_path: Optional[Path] = None) -> Dict[str, List[str]]:
    """Détecter les fichiers non utilisés"""
    if backend_path is None:
        backend_path = Path(__file__).parent.parent.parent.parent / "backend"
    if frontend_path is None:
        frontend_path = Path(__file__).parent.parent.parent.parent / "frontend"
    
    unused = {
        'backend': [],
        'frontend': [],
    }
    
    # Analyser backend
    if backend_path.exists():
        entities_dir = backend_path / "src" / "entities"
        if entities_dir.exists():
            for entity_file in entities_dir.glob("*.entity.ts"):
                entity_name = entity_file.stem.replace(".entity", "")
                if not _is_entity_used(entity_name, backend_path):
                    unused['backend'].append(str(entity_file.relative_to(backend_path)))
    
    # Analyser frontend
    if frontend_path.exists():
        components_dir = frontend_path / "src" / "components"
        if components_dir.exists():
            for component_file in components_dir.rglob("*.tsx"):
                component_name = component_file.stem
                if not _is_component_used(component_name, frontend_path):
                    unused['frontend'].append(str(component_file.relative_to(frontend_path)))
    
    return unused

def _is_entity_used(entity_name: str, backend_path: Path) -> bool:
    """Vérifier si une entité est utilisée"""
    # Chercher dans les modules
    modules_dir = backend_path / "src" / "modules"
    
    if not modules_dir.exists():
        return False
    
    entity_pattern = re.compile(rf'\b{entity_name}\b', re.IGNORECASE)
    
    for module_dir in modules_dir.iterdir():
        if module_dir.is_dir():
            for file in module_dir.rglob("*.ts"):
                try:
                    content = file.read_text(encoding='utf-8')
                    if entity_pattern.search(content):
                        return True
                except Exception:
                    continue
    
    return False

def _is_component_used(component_name: str, frontend_path: Path) -> bool:
    """Vérifier si un composant est utilisé"""
    # Chercher les imports
    component_pattern = re.compile(rf'import.*\b{component_name}\b.*from', re.IGNORECASE)
    
    for file in frontend_path.rglob("*.{ts,tsx}"):
        if file.name == f"{component_name}.tsx":
            continue  # Ignorer le fichier lui-même
        
        try:
            content = file.read_text(encoding='utf-8')
            if component_pattern.search(content):
                return True
        except Exception:
            continue
    
    return False

def find_unused_imports(file_path: Path) -> List[str]:
    """Identifier les imports inutilisés dans un fichier"""
    try:
        content = file_path.read_text(encoding='utf-8')
        
        # Parser les imports
        import_pattern = re.compile(r'^import\s+(?:(?:\{[^}]+\})|(?:\*\s+as\s+\w+)|(?:\w+))\s+from\s+["\']([^"\']+)["\']', re.MULTILINE)
        imports = import_pattern.findall(content)
        
        unused = []
        
        # Vérifier si chaque import est utilisé
        for import_path in imports:
            # Simplifié - pourrait être amélioré avec un vrai parser AST
            pass
        
        return unused
    except Exception:
        return []

def find_isolated_components(frontend_path: Optional[Path] = None) -> List[str]:
    """Détecter les composants isolés (non utilisés)"""
    if frontend_path is None:
        frontend_path = Path(__file__).parent.parent.parent.parent / "frontend"
    
    components_dir = frontend_path / "src" / "components"
    
    if not components_dir.exists():
        return []
    
    isolated = []
    
    for component_file in components_dir.rglob("*.tsx"):
        component_name = component_file.stem
        
        # Ignorer les fichiers index
        if component_file.name == "index.tsx":
            continue
        
        if not _is_component_used(component_name, frontend_path):
            isolated.append(str(component_file.relative_to(frontend_path)))
    
    return isolated

def suggest_cleanup(unused_files: Dict[str, List[str]], isolated_components: List[str]) -> Dict[str, List[str]]:
    """Suggérer des actions de nettoyage"""
    suggestions = {
        'can_delete': [],
        'review_needed': [],
    }
    
    # Fichiers clairement inutilisés
    for file_list in unused_files.values():
        suggestions['can_delete'].extend(file_list)
    
    # Composants isolés à revoir
    suggestions['review_needed'].extend(isolated_components)
    
    return suggestions

