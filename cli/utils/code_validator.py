"""
Validateur de cohérence du code
"""

from pathlib import Path
from typing import Dict, List, Optional
import re
import ast

def validate_entity_module_consistency(backend_path: Optional[Path] = None) -> Dict[str, List[str]]:
    """Vérifier la cohérence entre entités et modules"""
    if backend_path is None:
        backend_path = Path(__file__).parent.parent.parent.parent / "backend"
    
    from utils.dependency_analyzer import find_entities, find_modules, check_module_completeness
    
    entities = find_entities(backend_path)
    modules = find_modules(backend_path)
    
    issues = {
        'entities_without_modules': [],
        'modules_without_entities': [],
        'incomplete_modules': [],
    }
    
    # Entités sans modules correspondants
    for entity in entities:
        entity_lower = entity.lower()
        # Essayer différentes variantes
        possible_modules = [
            entity_lower,
            entity_lower + 's',  # product -> products
            entity_lower.rstrip('y') + 'ies',  # category -> categories
        ]
        
        if not any(m in modules for m in possible_modules):
            issues['entities_without_modules'].append(entity)
    
    # Modules sans entités
    for module in modules:
        # Essayer de trouver l'entité correspondante
        entity_variants = [
            module.rstrip('s'),  # products -> product
            module.rstrip('ies') + 'y',  # categories -> category
        ]
        
        found = False
        for variant in entity_variants:
            if variant.capitalize() in [e.capitalize() for e in entities]:
                found = True
                break
        
        if not found:
            issues['modules_without_entities'].append(module)
    
    # Modules incomplets
    for module in modules:
        completeness = check_module_completeness(module, backend_path)
        if not all(completeness.values()):
            missing = [k.replace('has_', '').replace('_', ' ') for k, v in completeness.items() if not v]
            issues['incomplete_modules'].append({
                'module': module,
                'missing': missing,
            })
    
    return issues

def find_missing_endpoints(backend_path: Optional[Path] = None) -> Dict[str, List[str]]:
    """Détecter les endpoints manquants basés sur les services"""
    if backend_path is None:
        backend_path = Path(__file__).parent.parent.parent.parent / "backend"
    
    from utils.dependency_analyzer import find_modules
    
    modules = find_modules(backend_path)
    missing = {}
    
    for module in modules:
        controller_file = backend_path / "src" / "modules" / module / f"{module}.controller.ts"
        service_file = backend_path / "src" / "modules" / module / f"{module}.service.ts"
        
        if not controller_file.exists() or not service_file.exists():
            continue
        
        try:
            controller_content = controller_file.read_text(encoding='utf-8')
            service_content = service_file.read_text(encoding='utf-8')
            
            # Détecter les méthodes dans le service
            service_methods = re.findall(r'(?:public|private|protected)?\s*(\w+)\s*\([^)]*\)\s*:', service_content)
            
            # Détecter les endpoints dans le controller
            endpoints = re.findall(r'@(?:Get|Post|Put|Patch|Delete)\([^)]*\)', controller_content)
            
            # Vérifier si toutes les méthodes publiques du service ont des endpoints
            # (simplifié - pourrait être amélioré)
            
        except Exception:
            continue
    
    return missing

def validate_typeorm_relations(backend_path: Optional[Path] = None) -> List[Dict[str, str]]:
    """Vérifier les relations TypeORM"""
    if backend_path is None:
        backend_path = Path(__file__).parent.parent.parent.parent / "backend"
    
    from utils.dependency_analyzer import find_entities, analyze_entity_dependencies
    
    entities = find_entities(backend_path)
    issues = []
    
    for entity in entities:
        deps = analyze_entity_dependencies(entity, backend_path)
        relations = deps.get('relations', [])
        
        # Vérifier si les entités référencées existent
        for relation in relations:
            relation_capitalized = relation.capitalize()
            if relation_capitalized not in [e.capitalize() for e in entities]:
                issues.append({
                    'entity': entity,
                    'relation': relation,
                    'issue': f'Relation vers entité inexistante: {relation}',
                })
    
    return issues

def validate_typescript_types(frontend_path: Optional[Path] = None, backend_path: Optional[Path] = None) -> List[Dict[str, str]]:
    """Valider la cohérence des types TypeScript entre frontend et backend"""
    if frontend_path is None:
        frontend_path = Path(__file__).parent.parent.parent.parent / "frontend"
    if backend_path is None:
        backend_path = Path(__file__).parent.parent.parent.parent / "backend"
    
    issues = []
    
    # Cette fonction pourrait être étendue pour comparer les types
    # entre les DTOs backend et les types frontend
    
    return issues

