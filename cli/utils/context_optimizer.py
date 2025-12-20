"""
Optimiseur de contexte
Analyse et optimise le contexte pour Cursor
"""

from pathlib import Path
from typing import Dict, List, Optional
import re


def _get_context_path() -> Path:
    """Trouver le chemin de CONTEXT.md"""
    base = Path(__file__).parent.parent.parent
    context = base / "docs" / "context" / "CONTEXT.md"
    if context.exists():
        return context
    return base.parent / "docs" / "context" / "CONTEXT.md"


def _analyze_context() -> Dict:
    """Analyser le contexte actuel"""
    context_path = _get_context_path()
    
    if not context_path.exists():
        return {
            'exists': False,
            'size': 0,
            'sections': [],
            'issues': [],
        }
    
    try:
        content = context_path.read_text(encoding='utf-8')
    except Exception:
        return {
            'exists': True,
            'size': 0,
            'sections': [],
            'issues': ['Impossible de lire le fichier'],
        }
    
    # Analyser la structure
    sections = []
    section_pattern = r'^##+\s+(.+)$'
    for match in re.finditer(section_pattern, content, re.MULTILINE):
        sections.append(match.group(1))
    
    # Détecter les problèmes
    issues = []
    
    # Vérifier la taille
    size_kb = len(content) / 1024
    if size_kb > 100:
        issues.append(f'Fichier très volumineux ({size_kb:.1f} KB) - risque de dépasser les limites de contexte')
    
    # Vérifier les sections manquantes
    required_sections = ['État actuel', 'Architecture', 'Stack technique']
    for required in required_sections:
        if not any(required.lower() in s.lower() for s in sections):
            issues.append(f'Section "{required}" manquante')
    
    # Vérifier les liens cassés
    link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
    links = re.findall(link_pattern, content)
    broken_links = []
    for link_text, link_path in links:
        if not link_path.startswith('http') and not link_path.startswith('#'):
            # Vérifier si le fichier existe
            if link_path.startswith('/'):
                target = context_path.parent.parent.parent / link_path.lstrip('/')
            else:
                target = context_path.parent / link_path
            if not target.exists():
                broken_links.append(f'Lien cassé: {link_text} -> {link_path}')
    
    if broken_links:
        issues.extend(broken_links[:5])  # Limiter à 5
    
    # Vérifier les informations obsolètes
    if 'TODO' in content or 'FIXME' in content:
        issues.append('Contient des TODO/FIXME - peut être obsolète')
    
    return {
        'exists': True,
        'size': size_kb,
        'sections': sections,
        'issues': issues,
        'link_count': len(links),
    }


def _generate_optimized_summary(context_path: Path) -> str:
    """Générer un résumé optimisé du contexte"""
    try:
        content = context_path.read_text(encoding='utf-8')
    except Exception:
        return ""
    
    # Extraire les sections importantes
    summary_sections = []
    
    # Section État actuel
    state_match = re.search(r'##\s+État actuel\s*\n(.*?)(?=##|\Z)', content, re.DOTALL)
    if state_match:
        state_content = state_match.group(1)[:500]  # Limiter à 500 caractères
        summary_sections.append(f"**État actuel** :\n{state_content.strip()}\n")
    
    # Section Architecture
    arch_match = re.search(r'##\s+Architecture\s*\n(.*?)(?=##|\Z)', content, re.DOTALL)
    if arch_match:
        arch_content = arch_match.group(1)[:500]
        summary_sections.append(f"**Architecture** :\n{arch_content.strip()}\n")
    
    # Section Stack
    stack_match = re.search(r'##\s+Stack\s+technique\s*\n(.*?)(?=##|\Z)', content, re.DOTALL)
    if stack_match:
        stack_content = stack_match.group(1)[:300]
        summary_sections.append(f"**Stack** :\n{stack_content.strip()}\n")
    
    return "\n".join(summary_sections)


def optimize_context() -> Dict:
    """Analyser et optimiser le contexte"""
    analysis = _analyze_context()
    
    suggestions = []
    
    if not analysis['exists']:
        suggestions.append({
            'type': 'critical',
            'title': 'Créer CONTEXT.md',
            'description': 'Le fichier CONTEXT.md n\'existe pas',
            'action': 'Créer un fichier CONTEXT.md avec les informations essentielles du projet',
        })
        return {
            'analysis': analysis,
            'suggestions': suggestions,
            'optimized_summary': None,
        }
    
    # Suggestions basées sur l'analyse
    if analysis['size'] > 100:
        suggestions.append({
            'type': 'warning',
            'title': 'Réduire la taille du contexte',
            'description': f'Le fichier fait {analysis["size"]:.1f} KB',
            'action': 'Extraire les sections détaillées dans des fichiers séparés et garder seulement un résumé',
        })
    
    if analysis['issues']:
        for issue in analysis['issues'][:5]:
            suggestions.append({
                'type': 'info',
                'title': 'Problème détecté',
                'description': issue,
                'action': 'Corriger le problème identifié',
            })
    
    # Générer un résumé optimisé
    context_path = _get_context_path()
    optimized_summary = _generate_optimized_summary(context_path)
    
    # Identifier les informations manquantes
    missing_info = []
    if not any('roadmap' in s.lower() for s in analysis['sections']):
        missing_info.append('Section Roadmap manquante')
    if not any('dépendances' in s.lower() or 'dependencies' in s.lower() for s in analysis['sections']):
        missing_info.append('Section Dépendances manquante')
    
    if missing_info:
        suggestions.append({
            'type': 'info',
            'title': 'Informations manquantes',
            'description': ', '.join(missing_info),
            'action': 'Ajouter les sections manquantes pour améliorer le contexte',
        })
    
    return {
        'analysis': analysis,
        'suggestions': suggestions,
        'optimized_summary': optimized_summary,
        'missing_info': missing_info,
    }

