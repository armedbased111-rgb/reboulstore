"""
Synchronisation automatique de la documentation
Synchronise ROADMAP_COMPLETE.md avec BACKEND.md et FRONTEND.md
"""

from pathlib import Path
from typing import Dict, List, Optional, Tuple
import re
from datetime import datetime


def _get_base_path() -> Path:
    """Trouver le chemin de base du projet"""
    base = Path(__file__).parent.parent.parent
    return base


def _extract_phases_from_roadmap(roadmap_path: Path) -> Dict[str, Dict]:
    """Extraire les phases de ROADMAP_COMPLETE.md"""
    try:
        content = roadmap_path.read_text(encoding='utf-8')
    except Exception:
        return {}
    
    phases = {}
    
    # Pattern pour les phases : ## Phase X : Titre (✅ ou sans)
    phase_pattern = r'##\s+(?:✅\s+)?Phase\s+(\d+(?:\.\d+)?)\s*:\s*([^\n]+)'
    phase_matches = re.finditer(phase_pattern, content, re.IGNORECASE)
    
    for match in phase_matches:
        phase_num = match.group(1)
        phase_title = match.group(2).strip()
        is_completed = '✅' in match.group(0)
        
        # Extraire le contenu de la phase jusqu'à la prochaine phase
        start_pos = match.end()
        next_phase_match = re.search(r'##\s+(?:✅\s+)?Phase\s+', content[start_pos:], re.IGNORECASE)
        if next_phase_match:
            phase_content = content[start_pos:start_pos + next_phase_match.start()]
        else:
            phase_content = content[start_pos:]
        
        # Déterminer si c'est backend ou frontend
        is_backend = any(keyword in phase_content.lower() for keyword in [
            'backend', 'api', 'nestjs', 'controller', 'service', 'entity', 'dto',
            'endpoint', 'module', 'typeorm', 'database'
        ])
        is_frontend = any(keyword in phase_content.lower() for keyword in [
            'frontend', 'react', 'component', 'page', 'hook', 'ui', 'tailwind',
            'figma', 'design', 'animation', 'animejs'
        ])
        
        phases[phase_num] = {
            'title': phase_title,
            'completed': is_completed,
            'content': phase_content,
            'is_backend': is_backend,
            'is_frontend': is_frontend,
        }
    
    return phases


def _update_backend_doc(backend_path: Path, phases: Dict[str, Dict]) -> Tuple[bool, str]:
    """Mettre à jour BACKEND.md avec les phases complétées"""
    try:
        content = backend_path.read_text(encoding='utf-8')
    except Exception:
        return False, "Fichier BACKEND.md introuvable"
    
    # Extraire les phases backend complétées
    backend_phases = {k: v for k, v in phases.items() if v['is_backend'] and v['completed']}
    
    # Trouver la section "État actuel" ou "Complété"
    # Mettre à jour la version et la date
    date_pattern = r'(\*\*Dernière mise à jour\*\* : ).*'
    new_date = datetime.now().strftime('%d/%m/%Y à %H:%M')
    
    if re.search(date_pattern, content):
        content = re.sub(date_pattern, f'\\g<1>{new_date}', content)
    
    # Mettre à jour la version si nécessaire
    version_pattern = r'(### Version : )([\d.]+)'
    version_match = re.search(version_pattern, content)
    if version_match:
        # Incrémenter le patch version
        current_version = version_match.group(2)
        parts = current_version.split('.')
        if len(parts) >= 3:
            parts[2] = str(int(parts[2]) + 1)
            new_version = '.'.join(parts)
        else:
            new_version = current_version
        content = re.sub(version_pattern, f'\\g<1>{new_version}', content)
    
    # Mettre à jour la liste des phases complétées
    completed_section_pattern = r'(#### ✅ Complété \(Phase \d+[^)]*\)\s*\n(?:- .*\n)*)'
    # On garde les sections existantes et on ajoute les nouvelles si nécessaire
    
    backend_path.write_text(content, encoding='utf-8')
    
    return True, f"✅ BACKEND.md mis à jour ({len(backend_phases)} phases backend complétées)"


def _update_frontend_doc(frontend_path: Path, phases: Dict[str, Dict]) -> Tuple[bool, str]:
    """Mettre à jour FRONTEND.md avec les phases complétées"""
    try:
        content = frontend_path.read_text(encoding='utf-8')
    except Exception:
        return False, "Fichier FRONTEND.md introuvable"
    
    # Extraire les phases frontend complétées
    frontend_phases = {k: v for k, v in phases.items() if v['is_frontend'] and v['completed']}
    
    # Trouver la section "État actuel" ou "Complété"
    # Mettre à jour la version et la date
    date_pattern = r'(\*\*Dernière mise à jour\*\* : ).*'
    new_date = datetime.now().strftime('%d/%m/%Y à %H:%M')
    
    if re.search(date_pattern, content):
        content = re.sub(date_pattern, f'\\g<1>{new_date}', content)
    
    # Mettre à jour la version si nécessaire
    version_pattern = r'(### Version : )([\d.]+)'
    version_match = re.search(version_pattern, content)
    if version_match:
        # Incrémenter le patch version
        current_version = version_match.group(2)
        parts = current_version.split('.')
        if len(parts) >= 3:
            parts[2] = str(int(parts[2]) + 1)
            new_version = '.'.join(parts)
        else:
            new_version = current_version
        content = re.sub(version_pattern, f'\\g<1>{new_version}', content)
    
    frontend_path.write_text(content, encoding='utf-8')
    
    return True, f"✅ FRONTEND.md mis à jour ({len(frontend_phases)} phases frontend complétées)"


def _update_roadmap_date(roadmap_path: Path) -> Tuple[bool, str]:
    """Mettre à jour la date dans ROADMAP_COMPLETE.md"""
    try:
        content = roadmap_path.read_text(encoding='utf-8')
    except Exception:
        return False, "Fichier ROADMAP_COMPLETE.md introuvable"
    
    # Mettre à jour la date
    date_pattern = r'(\*\*Dernière mise à jour\*\* : ).*'
    new_date = datetime.now().strftime('%d/%m/%Y à %H:%M')
    
    if re.search(date_pattern, content):
        content = re.sub(date_pattern, f'\\g<1>{new_date}', content)
        roadmap_path.write_text(content, encoding='utf-8')
        return True, f"✅ Date mise à jour dans ROADMAP_COMPLETE.md"
    else:
        # Ajouter la date si elle n'existe pas
        version_pattern = r'(\*\*Version\*\* : [^\n]+\n)'
        if re.search(version_pattern, content):
            content = re.sub(version_pattern, f'\\g<1>**Dernière mise à jour** : {new_date}\n', content)
            roadmap_path.write_text(content, encoding='utf-8')
            return True, f"✅ Date ajoutée dans ROADMAP_COMPLETE.md"
    
    return False, "⚠️  Pattern date non trouvé"


def _generate_changelog(roadmap_path: Path, output_path: Optional[Path] = None) -> str:
    """Générer un changelog depuis ROADMAP_COMPLETE.md"""
    try:
        content = roadmap_path.read_text(encoding='utf-8')
    except Exception:
        return None
    
    # Extraire les phases complétées récemment
    phases = _extract_phases_from_roadmap(roadmap_path)
    completed_phases = {k: v for k, v in phases.items() if v['completed']}
    
    # Générer le changelog
    changelog = f"""# 📝 Changelog - Reboul Store

> Généré automatiquement le {datetime.now().strftime('%d/%m/%Y à %H:%M')}

## Vue d'ensemble

**Total phases complétées** : {len(completed_phases)}

---

## Phases complétées

"""
    
    # Grouper par numéro de phase principal (ex: Phase 9, Phase 10)
    phases_by_main = {}
    for phase_num, phase_info in sorted(completed_phases.items(), key=lambda x: float(x[0])):
        main_num = phase_num.split('.')[0]
        if main_num not in phases_by_main:
            phases_by_main[main_num] = []
        phases_by_main[main_num].append((phase_num, phase_info))
    
    # Générer le changelog par phase principale
    for main_num in sorted(phases_by_main.keys(), key=lambda x: float(x)):
        sub_phases = phases_by_main[main_num]
        changelog += f"### Phase {main_num}\n\n"
        
        for phase_num, phase_info in sub_phases:
            changelog += f"#### Phase {phase_num} : {phase_info['title']}\n\n"
            
            # Extraire les tâches complétées
            task_pattern = r'- \[x\]\s+(.+)'
            tasks = re.findall(task_pattern, phase_info['content'], re.IGNORECASE)
            
            if tasks:
                changelog += "**Tâches complétées** :\n"
                for task in tasks[:10]:  # Limiter à 10 tâches
                    changelog += f"- {task}\n"
                changelog += "\n"
            
            # Type de phase
            if phase_info['is_backend']:
                changelog += "**Type** : Backend\n\n"
            elif phase_info['is_frontend']:
                changelog += "**Type** : Frontend\n\n"
            else:
                changelog += "**Type** : Général\n\n"
        
        changelog += "---\n\n"
    
    # Sauvegarder si un chemin est fourni
    if output_path:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(changelog, encoding='utf-8')
    
    return changelog


def synchronize_all_docs() -> Dict[str, str]:
    """Synchroniser toute la documentation"""
    base_path = _get_base_path()
    
    roadmap_path = base_path / "docs" / "context" / "ROADMAP_COMPLETE.md"
    backend_path = base_path / "backend" / "BACKEND.md"
    frontend_path = base_path / "frontend" / "FRONTEND.md"
    
    results = {}
    
    # Extraire les phases de la roadmap
    phases = _extract_phases_from_roadmap(roadmap_path)
    results['phases_extracted'] = f"✅ {len(phases)} phases extraites"
    
    # Mettre à jour les dates
    success, message = _update_roadmap_date(roadmap_path)
    results['roadmap_date'] = message
    
    # Synchroniser BACKEND.md
    if backend_path.exists():
        success, message = _update_backend_doc(backend_path, phases)
        results['backend_sync'] = message
    else:
        results['backend_sync'] = "⚠️  BACKEND.md introuvable"
    
    # Synchroniser FRONTEND.md
    if frontend_path.exists():
        success, message = _update_frontend_doc(frontend_path, phases)
        results['frontend_sync'] = message
    else:
        results['frontend_sync'] = "⚠️  FRONTEND.md introuvable"
    
    return results


def generate_changelog(output_file: Optional[str] = None) -> Optional[str]:
    """Générer un changelog"""
    base_path = _get_base_path()
    roadmap_path = base_path / "docs" / "context" / "ROADMAP_COMPLETE.md"
    
    if output_file:
        output_path = base_path / output_file
    else:
        output_path = base_path / "docs" / "CHANGELOG.md"
    
    changelog = _generate_changelog(roadmap_path, output_path)
    
    if changelog:
        return str(output_path.relative_to(base_path))
    return None

