"""
Analyseur de patterns et de code dupliqué
Détecte les patterns répétitifs et suggère des refactorings
"""

from pathlib import Path
from typing import Dict, List, Tuple, Optional
import re
from collections import defaultdict


def _get_backend_path() -> Path:
    """Trouver le chemin du dossier backend"""
    base = Path(__file__).parent.parent.parent
    backend = base / "backend"
    if backend.exists():
        return backend
    return base.parent / "backend"


def _get_frontend_path() -> Path:
    """Trouver le chemin du dossier frontend"""
    base = Path(__file__).parent.parent.parent
    frontend = base / "frontend"
    if frontend.exists():
        return frontend
    return base.parent / "frontend"


def _extract_code_blocks(file_path: Path) -> List[Tuple[int, str]]:
    """Extraire les blocs de code d'un fichier"""
    try:
        content = file_path.read_text(encoding='utf-8')
    except Exception:
        return []
    
    blocks = []
    lines = content.split('\n')
    
    # Détecter les fonctions/méthodes
    in_function = False
    function_start = 0
    function_lines = []
    indent_level = 0
    
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        
        # Détecter le début d'une fonction
        if re.match(r'^(export\s+)?(async\s+)?(function|const)\s+\w+', stripped):
            if in_function and len(function_lines) > 3:
                blocks.append((function_start, '\n'.join(function_lines)))
            in_function = True
            function_start = i
            function_lines = [line]
            indent_level = len(line) - len(line.lstrip())
        elif in_function:
            if stripped and not stripped.startswith('//') and not stripped.startswith('*'):
                current_indent = len(line) - len(line.lstrip())
                if current_indent <= indent_level and stripped and not line.startswith(' ' * (indent_level + 1)):
                    # Fin de la fonction
                    if len(function_lines) > 3:
                        blocks.append((function_start, '\n'.join(function_lines)))
                    in_function = False
                    function_lines = []
                else:
                    function_lines.append(line)
            else:
                function_lines.append(line)
    
    # Ajouter la dernière fonction si elle existe
    if in_function and len(function_lines) > 3:
        blocks.append((function_start, '\n'.join(function_lines)))
    
    return blocks


def _normalize_code(code: str) -> str:
    """Normaliser le code pour la comparaison (enlever noms de variables, etc.)"""
    # Remplacer les noms de variables par des placeholders
    normalized = code
    
    # Remplacer les strings par "STRING"
    normalized = re.sub(r'["\'][^"\']*["\']', '"STRING"', normalized)
    
    # Remplacer les nombres par "NUMBER"
    normalized = re.sub(r'\b\d+\b', 'NUMBER', normalized)
    
    # Remplacer les noms de variables par "VAR"
    normalized = re.sub(r'\b[a-z_][a-z0-9_]*\b', 'VAR', normalized, flags=re.IGNORECASE)
    
    # Normaliser les espaces
    normalized = re.sub(r'\s+', ' ', normalized)
    
    return normalized.strip()


def _detect_duplicate_code(blocks: List[Tuple[int, str]]) -> List[Dict]:
    """Détecter le code dupliqué"""
    duplicates = []
    normalized_blocks = {}
    
    # Normaliser tous les blocs
    for start_line, code in blocks:
        normalized = _normalize_code(code)
        if normalized not in normalized_blocks:
            normalized_blocks[normalized] = []
        normalized_blocks[normalized].append((start_line, code))
    
    # Trouver les duplications (plus de 2 occurrences)
    for normalized, occurrences in normalized_blocks.items():
        if len(occurrences) > 1:
            # Calculer la similarité
            if len(occurrences) >= 2:
                duplicates.append({
                    'count': len(occurrences),
                    'occurrences': occurrences,
                    'normalized': normalized[:200] + '...' if len(normalized) > 200 else normalized,
                })
    
    return sorted(duplicates, key=lambda x: x['count'], reverse=True)


def _detect_patterns(file_path: Path) -> List[Dict]:
    """Détecter les patterns répétitifs dans un fichier"""
    try:
        content = file_path.read_text(encoding='utf-8')
    except Exception:
        return []
    
    patterns = []
    
    # Pattern 1: Try-catch répétitifs
    try_catch_count = len(re.findall(r'try\s*{', content))
    if try_catch_count > 3:
        patterns.append({
            'type': 'try-catch',
            'description': f'{try_catch_count} blocs try-catch détectés',
            'suggestion': 'Créer une fonction utilitaire pour gérer les erreurs',
            'severity': 'medium',
        })
    
    # Pattern 2: Validation répétitive
    validation_patterns = [
        r'@IsString\(\)',
        r'@IsNotEmpty\(\)',
        r'@IsOptional\(\)',
        r'@IsNumber\(\)',
    ]
    validation_count = sum(len(re.findall(pattern, content)) for pattern in validation_patterns)
    if validation_count > 10:
        patterns.append({
            'type': 'validation',
            'description': f'{validation_count} validations détectées',
            'suggestion': 'Créer des DTOs de base réutilisables',
            'severity': 'low',
        })
    
    # Pattern 3: Appels API répétitifs
    api_calls = len(re.findall(r'(fetch|axios\.(get|post|put|delete))', content, re.IGNORECASE))
    if api_calls > 5:
        patterns.append({
            'type': 'api-calls',
            'description': f'{api_calls} appels API détectés',
            'suggestion': 'Créer un service API centralisé',
            'severity': 'medium',
        })
    
    # Pattern 4: useState répétitifs
    useState_count = len(re.findall(r'useState', content))
    if useState_count > 5:
        patterns.append({
            'type': 'state-management',
            'description': f'{useState_count} useState détectés',
            'suggestion': 'Considérer useReducer ou un state management library',
            'severity': 'low',
        })
    
    # Pattern 5: Logique métier dans les composants
    if 'component' in str(file_path).lower() or 'tsx' in file_path.suffix:
        business_logic = len(re.findall(r'(calculate|compute|process|validate)', content, re.IGNORECASE))
        if business_logic > 3:
            patterns.append({
                'type': 'business-logic',
                'description': f'{business_logic} fonctions de logique métier dans le composant',
                'suggestion': 'Extraire la logique métier dans des hooks ou services',
                'severity': 'high',
            })
    
    return patterns


def analyze_patterns(target_dir: Optional[str] = None) -> Dict:
    """Analyser les patterns dans le code"""
    results = {
        'duplicates': [],
        'patterns': [],
        'files_analyzed': 0,
    }
    
    # Déterminer les dossiers à analyser
    dirs_to_analyze = []
    if target_dir:
        base = Path(__file__).parent.parent.parent
        target_path = base / target_dir
        if target_path.exists():
            dirs_to_analyze.append(target_path)
    else:
        backend_path = _get_backend_path()
        frontend_path = _get_frontend_path()
        if backend_path.exists():
            dirs_to_analyze.append(backend_path / "src")
        if frontend_path.exists():
            dirs_to_analyze.append(frontend_path / "src")
    
    # Analyser chaque fichier
    for dir_path in dirs_to_analyze:
        for file_path in dir_path.rglob("*.{ts,tsx}"):
            # Ignorer node_modules et fichiers de test
            if 'node_modules' in str(file_path) or 'test' in file_path.name.lower():
                continue
            
            results['files_analyzed'] += 1
            
            # Détecter les patterns
            patterns = _detect_patterns(file_path)
            for pattern in patterns:
                pattern['file'] = str(file_path.relative_to(dir_path.parent))
                results['patterns'].append(pattern)
            
            # Détecter le code dupliqué
            blocks = _extract_code_blocks(file_path)
            duplicates = _detect_duplicate_code(blocks)
            for dup in duplicates:
                dup['file'] = str(file_path.relative_to(dir_path.parent))
                results['duplicates'].append(dup)
    
    return results


def generate_refactoring_suggestions(results: Dict) -> List[Dict]:
    """Générer des suggestions de refactoring"""
    suggestions = []
    
    # Analyser les patterns pour générer des suggestions
    pattern_counts = defaultdict(int)
    for pattern in results['patterns']:
        pattern_counts[pattern['type']] += 1
    
    # Suggestion 1: Code dupliqué
    if results['duplicates']:
        total_duplicates = sum(d['count'] for d in results['duplicates'])
        suggestions.append({
            'title': 'Refactoriser le code dupliqué',
            'description': f'{len(results["duplicates"])} blocs de code dupliqués détectés ({total_duplicates} occurrences)',
            'priority': 'high',
            'action': 'Extraire les blocs dupliqués dans des fonctions utilitaires',
        })
    
    # Suggestion 2: Patterns répétitifs
    if pattern_counts['try-catch'] > 0:
        suggestions.append({
            'title': 'Créer un gestionnaire d\'erreurs centralisé',
            'description': f'{pattern_counts["try-catch"]} fichiers avec plusieurs blocs try-catch',
            'priority': 'medium',
            'action': 'Créer une fonction utilitaire pour gérer les erreurs',
        })
    
    if pattern_counts['api-calls'] > 0:
        suggestions.append({
            'title': 'Centraliser les appels API',
            'description': f'{pattern_counts["api-calls"]} fichiers avec des appels API directs',
            'priority': 'medium',
            'action': 'Créer un service API centralisé',
        })
    
    if pattern_counts['business-logic'] > 0:
        suggestions.append({
            'title': 'Extraire la logique métier des composants',
            'description': f'{pattern_counts["business-logic"]} composants avec logique métier',
            'priority': 'high',
            'action': 'Créer des hooks ou services pour la logique métier',
        })
    
    return suggestions

