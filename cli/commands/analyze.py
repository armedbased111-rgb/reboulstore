"""
Commandes pour l'analyse et la validation
"""

from pathlib import Path
from typing import Dict, List
from utils.dependency_analyzer import (
    find_entities,
    find_modules,
    generate_dependency_graph,
    find_missing_dependencies,
)
from utils.code_validator import (
    validate_entity_module_consistency,
    find_missing_endpoints,
    validate_typeorm_relations,
)
from utils.dead_code_analyzer import (
    find_unused_files,
    find_isolated_components,
    suggest_cleanup,
)
from utils.pattern_analyzer import (
    analyze_patterns,
    generate_refactoring_suggestions,
)

class AnalyzeManager:
    """Gérer les analyses"""
    
    @staticmethod
    def dependencies():
        """Analyser les dépendances"""
        graph = generate_dependency_graph()
        missing = find_missing_dependencies()
        
        return {
            'graph': graph,
            'missing': missing,
        }
    
    @staticmethod
    def code_consistency():
        """Valider la cohérence du code"""
        issues = validate_entity_module_consistency()
        missing_endpoints = find_missing_endpoints()
        relation_issues = validate_typeorm_relations()
        
        return {
            'consistency': issues,
            'missing_endpoints': missing_endpoints,
            'relations': relation_issues,
        }
    
    @staticmethod
    def dead_code():
        """Analyser le code mort"""
        unused = find_unused_files()
        isolated = find_isolated_components()
        suggestions = suggest_cleanup(unused, isolated)
        
        return {
            'unused_files': unused,
            'isolated_components': isolated,
            'suggestions': suggestions,
        }
    
    @staticmethod
    def patterns(target_dir: str = None):
        """Analyser les patterns et le code dupliqué"""
        results = analyze_patterns(target_dir)
        suggestions = generate_refactoring_suggestions(results)
        
        return {
            'patterns': results['patterns'],
            'duplicates': results['duplicates'],
            'files_analyzed': results['files_analyzed'],
            'suggestions': suggestions,
        }

# Export pour main.py
analyze_manager = AnalyzeManager()

