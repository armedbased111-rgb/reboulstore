"""
Analyseur de verbosité du code
Détecte le code verbeux selon les règles du projet
"""

from pathlib import Path
from typing import Dict, List, Optional
import re
from collections import defaultdict


def _get_frontend_path() -> Path:
    """Trouver le chemin du dossier frontend"""
    base = Path(__file__).parent.parent.parent
    frontend = base / "frontend"
    if frontend.exists():
        return frontend
    return base.parent / "frontend"


def _get_backend_path() -> Path:
    """Trouver le chemin du dossier backend"""
    base = Path(__file__).parent.parent.parent
    backend = base / "backend"
    if backend.exists():
        return backend
    return base.parent / "backend"


def _detect_redundant_comments(content: str, file_path: Path) -> List[Dict]:
    """Détecter les commentaires redondants"""
    issues = []
    lines = content.split('\n')
    
    # Patterns de commentaires redondants
    redundant_patterns = [
        (r'//\s*(Récupérer|Get|Fetch|Load)\s+', 'Commentaire explique une action évidente'),
        (r'//\s*(Mémoriser|Memoize|Cache)\s+', 'Commentaire explique une optimisation évidente'),
        (r'//\s*(Déclencher|Trigger|Execute)\s+', 'Commentaire explique une action évidente'),
        (r'/\*\*\s*\*\s*(Page|Component|Function)\s+', 'JSDoc redondant si le nom est explicite'),
    ]
    
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        for pattern, description in redundant_patterns:
            if re.search(pattern, stripped, re.IGNORECASE):
                # Vérifier si le commentaire est vraiment redondant
                next_code_line = None
                for j in range(i, min(i + 3, len(lines))):
                    if lines[j].strip() and not lines[j].strip().startswith('//') and not lines[j].strip().startswith('*'):
                        next_code_line = lines[j].strip()
                        break
                
                if next_code_line:
                    # Si le code suivant est explicite, le commentaire est redondant
                    if any(keyword in next_code_line.lower() for keyword in ['get', 'fetch', 'load', 'use', 'const', 'let']):
                        issues.append({
                            'line': i,
                            'type': 'redundant-comment',
                            'description': description,
                            'code': stripped[:80],
                            'severity': 'low',
                        })
    
    return issues


def _detect_duplicate_blocks(content: str, file_path: Path) -> List[Dict]:
    """Détecter les blocs de code dupliqués (répétitions)"""
    issues = []
    lines = content.split('\n')
    
    # Détecter les patterns répétitifs (3+ occurrences similaires)
    # Ex: useScrollAnimation avec la même structure
    
    # Pattern: useScrollAnimation répétitif
    scroll_animation_pattern = r'useScrollAnimation\s*\([^)]+\)'
    matches = list(re.finditer(scroll_animation_pattern, content, re.MULTILINE))
    
    if len(matches) >= 3:
        # Vérifier si les configurations sont similaires
        configs = []
        for match in matches:
            start_line = content[:match.start()].count('\n') + 1
            block = match.group(0)
            # Extraire les paramètres
            if 'threshold' in block and 'rootMargin' in block:
                configs.append({
                    'line': start_line,
                    'block': block[:100],
                })
        
        if len(configs) >= 3:
            # Vérifier la similarité
            similar_count = 0
            for i in range(len(configs)):
                for j in range(i + 1, len(configs)):
                    # Comparer les configurations
                    if 'threshold: 0.2' in configs[i]['block'] and 'threshold: 0.2' in configs[j]['block']:
                        similar_count += 1
            
            if similar_count >= 2:
                issues.append({
                    'line': configs[0]['line'],
                    'type': 'duplicate-animations',
                    'description': f'{len(configs)} animations similaires détectées - Factoriser avec des fonctions helper',
                    'code': configs[0]['block'],
                    'severity': 'high',
                    'suggestion': 'Créer des fonctions helper (ex: createRevealUp, createStaggerFade)',
                })
    
    # Pattern: useState répétitif avec même structure
    useState_pattern = r'const\s+\w+\s*=\s*useState\s*\([^)]+\)'
    useState_matches = list(re.finditer(useState_pattern, content))
    
    if len(useState_matches) >= 5:
        issues.append({
            'line': content[:useState_matches[0].start()].count('\n') + 1,
            'type': 'multiple-usestate',
            'description': f'{len(useState_matches)} useState détectés - Considérer useReducer',
            'code': useState_matches[0].group(0)[:80],
            'severity': 'medium',
            'suggestion': 'Considérer useReducer ou un state management library',
        })
    
    return issues


def _detect_verbose_functions(content: str, file_path: Path) -> List[Dict]:
    """Détecter les fonctions trop verbeuses"""
    issues = []
    
    # Détecter les fonctions avec trop de commentaires
    function_pattern = r'(export\s+)?(async\s+)?(function|const)\s+(\w+)\s*[=\(]'
    functions = list(re.finditer(function_pattern, content))
    
    for func_match in functions:
        func_name = func_match.group(4)
        func_start = func_match.start()
        func_start_line = content[:func_start].count('\n') + 1
        
        # Extraire le corps de la fonction (approximatif)
        brace_count = 0
        in_function = False
        func_lines = []
        comment_count = 0
        
        for i, char in enumerate(content[func_start:], func_start):
            if char == '{':
                brace_count += 1
                in_function = True
            elif char == '}':
                brace_count -= 1
                if brace_count == 0 and in_function:
                    func_content = content[func_start:i+1]
                    func_lines = func_content.split('\n')
                    # Compter les commentaires
                    comment_count = sum(1 for line in func_lines if line.strip().startswith('//') or '/*' in line)
                    break
        
        # Si plus de 30% de commentaires dans la fonction
        if len(func_lines) > 10 and comment_count > len(func_lines) * 0.3:
            issues.append({
                'line': func_start_line,
                'type': 'verbose-function',
                'description': f'Fonction "{func_name}" avec {comment_count} commentaires ({len(func_lines)} lignes) - Trop verbeuse',
                'code': f'{func_name}(...)',
                'severity': 'medium',
                'suggestion': 'Réduire les commentaires, privilégier des noms de variables/fonctions explicites',
            })
    
    return issues


def _detect_repetitive_code(content: str, file_path: Path) -> List[Dict]:
    """Détecter le code répétitif (pas juste dupliqué, mais répétitions évidentes)"""
    issues = []
    lines = content.split('\n')
    
    # Détecter les séquences répétitives (ex: même pattern 3+ fois)
    # Pattern: const XRef = useScrollAnimation(...) avec variations minimes
    
    ref_pattern = r'const\s+(\w+Ref\d?)\s*=\s*useScrollAnimation'
    ref_matches = list(re.finditer(ref_pattern, content))
    
    if len(ref_matches) >= 3:
        # Vérifier si les configurations sont très similaires
        similar_refs = []
        for match in ref_matches:
            var_name = match.group(1)
            start_line = content[:match.start()].count('\n') + 1
            # Extraire le bloc complet
            end_pos = content.find('};', match.end())
            if end_pos > 0:
                block = content[match.start():end_pos+2]
                similar_refs.append({
                    'line': start_line,
                    'var': var_name,
                    'block': block[:150],
                })
        
        if len(similar_refs) >= 3:
            # Vérifier la similarité des blocs
            first_block_normalized = re.sub(r'\d+\.\d+', 'NUMBER', similar_refs[0]['block'])
            first_block_normalized = re.sub(r'\w+Ref\d?', 'VAR', first_block_normalized)
            
            similar_count = sum(1 for ref in similar_refs[1:] 
                              if abs(len(ref['block']) - len(similar_refs[0]['block'])) < 50)
            
            if similar_count >= 2:
                issues.append({
                    'line': similar_refs[0]['line'],
                    'type': 'repetitive-code',
                    'description': f'{len(similar_refs)} références similaires détectées - Factoriser avec des fonctions helper',
                    'code': similar_refs[0]['var'],
                    'severity': 'high',
                    'suggestion': 'Créer des fonctions factory (ex: createRevealUp, createStaggerFade)',
                })
    
    return issues


def analyze_verbosity(file_path: Optional[Path] = None, target_dir: Optional[str] = None) -> Dict:
    """Analyser la verbosité du code"""
    results = {
        'issues': [],
        'files_analyzed': 0,
        'summary': {
            'redundant_comments': 0,
            'duplicate_blocks': 0,
            'verbose_functions': 0,
            'repetitive_code': 0,
        }
    }
    
    # Déterminer les fichiers à analyser
    files_to_analyze = []
    if file_path:
        if isinstance(file_path, str):
            file_path = Path(file_path)
        if file_path.exists():
            files_to_analyze.append(file_path)
    elif target_dir:
        base = Path(__file__).parent.parent.parent
        target_path = base / target_dir
        if target_path.exists():
            if target_path.is_file():
                files_to_analyze.append(target_path)
            else:
                # rglob ne supporte pas les patterns avec accolades, faire plusieurs appels
                files_to_analyze.extend(target_path.rglob("*.ts"))
                files_to_analyze.extend(target_path.rglob("*.tsx"))
                files_to_analyze.extend(target_path.rglob("*.js"))
                files_to_analyze.extend(target_path.rglob("*.jsx"))
    else:
        # Analyser frontend et backend
        frontend_path = _get_frontend_path()
        backend_path = _get_backend_path()
        
        if frontend_path.exists():
            files_to_analyze.extend((frontend_path / "src").rglob("*.ts"))
            files_to_analyze.extend((frontend_path / "src").rglob("*.tsx"))
        if backend_path.exists():
            files_to_analyze.extend((backend_path / "src").rglob("*.ts"))
    
    # Filtrer les fichiers (ignorer node_modules, tests, etc.)
    files_to_analyze = [
        f for f in files_to_analyze
        if 'node_modules' not in str(f) and 
           'test' not in f.name.lower() and
           '.test.' not in f.name and
           '.spec.' not in f.name
    ]
    
    # Analyser chaque fichier
    for file_path in files_to_analyze:
        try:
            content = file_path.read_text(encoding='utf-8')
            results['files_analyzed'] += 1
            
            # Détecter les problèmes
            redundant_comments = _detect_redundant_comments(content, file_path)
            duplicate_blocks = _detect_duplicate_blocks(content, file_path)
            verbose_functions = _detect_verbose_functions(content, file_path)
            repetitive_code = _detect_repetitive_code(content, file_path)
            
            # Ajouter les issues avec le chemin du fichier
            for issue in redundant_comments + duplicate_blocks + verbose_functions + repetitive_code:
                issue['file'] = str(file_path.relative_to(file_path.parent.parent.parent))
                results['issues'].append(issue)
            
            # Mettre à jour le résumé
            results['summary']['redundant_comments'] += len(redundant_comments)
            results['summary']['duplicate_blocks'] += len(duplicate_blocks)
            results['summary']['verbose_functions'] += len(verbose_functions)
            results['summary']['repetitive_code'] += len(repetitive_code)
            
        except Exception as e:
            # Ignorer les erreurs de lecture
            continue
    
    # Trier par sévérité (high > medium > low)
    severity_order = {'high': 3, 'medium': 2, 'low': 1}
    results['issues'].sort(key=lambda x: (severity_order.get(x.get('severity', 'low'), 0), x.get('line', 0)), reverse=True)
    
    return results
