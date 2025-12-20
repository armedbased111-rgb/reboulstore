"""
Analyseur de dépendances pour le projet
"""

from pathlib import Path
from typing import Dict, List, Set, Optional
import re
import json

def find_entities(backend_path: Optional[Path] = None) -> List[str]:
    """Trouver toutes les entités TypeORM"""
    if backend_path is None:
        backend_path = Path(__file__).parent.parent.parent.parent / "backend"
        if not backend_path.exists():
            backend_path = Path(__file__).parent.parent.parent.parent.parent / "backend"
    
    entities_dir = backend_path / "src" / "entities"
    
    if not entities_dir.exists():
        return []
    
    entities = []
    for file in entities_dir.glob("*.entity.ts"):
        entities.append(file.stem.replace(".entity", ""))
    
    return sorted(entities)

def find_modules(backend_path: Optional[Path] = None) -> List[str]:
    """Trouver tous les modules NestJS"""
    if backend_path is None:
        backend_path = Path(__file__).parent.parent.parent.parent / "backend"
        if not backend_path.exists():
            backend_path = Path(__file__).parent.parent.parent.parent.parent / "backend"
    
    modules_dir = backend_path / "src" / "modules"
    
    if not modules_dir.exists():
        return []
    
    modules = []
    for dir in modules_dir.iterdir():
        if dir.is_dir():
            module_file = dir / f"{dir.name}.module.ts"
            if module_file.exists():
                modules.append(dir.name)
    
    return sorted(modules)

def find_services(backend_path: Optional[Path] = None) -> List[str]:
    """Trouver tous les services NestJS"""
    if backend_path is None:
        backend_path = Path(__file__).parent.parent.parent.parent / "backend"
    
    modules_dir = backend_path / "src" / "modules"
    
    if not modules_dir.exists():
        return []
    
    services = []
    for dir in modules_dir.iterdir():
        if dir.is_dir():
            service_file = dir / f"{dir.name}.service.ts"
            if service_file.exists():
                services.append(dir.name)
    
    return sorted(services)

def find_controllers(backend_path: Optional[Path] = None) -> List[str]:
    """Trouver tous les controllers NestJS"""
    if backend_path is None:
        backend_path = Path(__file__).parent.parent.parent.parent / "backend"
    
    modules_dir = backend_path / "src" / "modules"
    
    if not modules_dir.exists():
        return []
    
    controllers = []
    for dir in modules_dir.iterdir():
        if dir.is_dir():
            controller_file = dir / f"{dir.name}.controller.ts"
            if controller_file.exists():
                controllers.append(dir.name)
    
    return sorted(controllers)

def analyze_entity_dependencies(entity_name: str, backend_path: Optional[Path] = None) -> Dict[str, List[str]]:
    """Analyser les dépendances d'une entité"""
    if backend_path is None:
        backend_path = Path(__file__).parent.parent.parent.parent / "backend"
    
    entity_file = backend_path / "src" / "entities" / f"{entity_name.lower()}.entity.ts"
    
    if not entity_file.exists():
        return {}
    
    try:
        content = entity_file.read_text(encoding='utf-8')
        
        dependencies = {
            'relations': [],
            'imports': [],
        }
        
        # Détecter les relations TypeORM
        relation_patterns = [
            r'@OneToMany\([^)]*\)\s*\w+:\s*(\w+)\[?',
            r'@ManyToOne\([^)]*\)\s*\w+:\s*(\w+)',
            r'@OneToOne\([^)]*\)\s*\w+:\s*(\w+)',
            r'@ManyToMany\([^)]*\)\s*\w+:\s*(\w+)\[?',
        ]
        
        for pattern in relation_patterns:
            matches = re.findall(pattern, content)
            dependencies['relations'].extend(matches)
        
        # Détecter les imports
        import_pattern = r'import\s+.*\s+from\s+["\']([^"\']+)["\']'
        imports = re.findall(import_pattern, content)
        dependencies['imports'] = imports
        
        return dependencies
    except Exception:
        return {}

def check_module_completeness(module_name: str, backend_path: Optional[Path] = None) -> Dict[str, bool]:
    """Vérifier la complétude d'un module"""
    if backend_path is None:
        backend_path = Path(__file__).parent.parent.parent.parent / "backend"
    
    module_dir = backend_path / "src" / "modules" / module_name
    
    if not module_dir.exists():
        return {}
    
    checks = {
        'has_module_file': (module_dir / f"{module_name}.module.ts").exists(),
        'has_service': (module_dir / f"{module_name}.service.ts").exists(),
        'has_controller': (module_dir / f"{module_name}.controller.ts").exists(),
        'has_dto': (module_dir / "dto").exists() and len(list((module_dir / "dto").glob("*.dto.ts"))) > 0,
    }
    
    return checks

def generate_dependency_graph(backend_path: Optional[Path] = None) -> Dict[str, Dict]:
    """Générer un graphe de dépendances"""
    entities = find_entities(backend_path)
    modules = find_modules(backend_path)
    
    graph = {
        'entities': {},
        'modules': {},
    }
    
    # Analyser les entités
    for entity in entities:
        deps = analyze_entity_dependencies(entity, backend_path)
        graph['entities'][entity] = {
            'relations': list(set(deps.get('relations', []))),
            'used_by_modules': [],
        }
    
    # Analyser les modules
    for module in modules:
        completeness = check_module_completeness(module, backend_path)
        graph['modules'][module] = {
            'completeness': completeness,
            'dependencies': [],
        }
    
    return graph

def find_missing_dependencies(backend_path: Optional[Path] = None) -> Dict[str, List[str]]:
    """Trouver les dépendances manquantes"""
    entities = find_entities(backend_path)
    modules = find_modules(backend_path)
    
    missing = {
        'entities_without_modules': [],
        'modules_without_entities': [],
        'incomplete_modules': [],
    }
    
    # Entités sans modules
    for entity in entities:
        entity_lower = entity.lower()
        if entity_lower not in modules:
            missing['entities_without_modules'].append(entity)
    
    # Modules sans entités
    for module in modules:
        module_entity = module.rstrip('s')  # products -> product
        if module_entity.capitalize() not in [e.capitalize() for e in entities]:
            missing['modules_without_entities'].append(module)
    
    # Modules incomplets
    for module in modules:
        completeness = check_module_completeness(module, backend_path)
        if not all(completeness.values()):
            missing['incomplete_modules'].append({
                'module': module,
                'missing': [k for k, v in completeness.items() if not v],
            })
    
    return missing

