"""
Utilitaires pour shadcn/ui
"""

import subprocess
import json
from pathlib import Path
from typing import List, Optional

def _find_frontend_path() -> Optional[Path]:
    """Trouver le chemin vers le dossier frontend"""
    # Depuis cli/utils/shadcn_helper.py
    # Structure: reboulstore/reboulstore/cli/utils/shadcn_helper.py
    # Donc: cli/utils -> cli -> reboulstore/reboulstore
    base = Path(__file__).parent.parent.parent
    
    # Essayer reboulstore/frontend (structure normale)
    frontend_path = base / "frontend"
    if frontend_path.exists() and (frontend_path / "src").exists():
        return frontend_path
    
    # Essayer reboulstore/reboulstore/frontend (si double niveau)
    frontend_path = base.parent / "frontend"
    if frontend_path.exists() and (frontend_path / "src").exists():
        return frontend_path
    
    # Essayer un niveau au-dessus
    frontend_path = base.parent.parent / "frontend"
    if frontend_path.exists() and (frontend_path / "src").exists():
        return frontend_path
    
    # Chercher récursivement depuis le dossier parent
    search_base = base
    for _ in range(3):  # Limiter la recherche à 3 niveaux
        frontend_path = search_base / "frontend"
        if frontend_path.exists() and (frontend_path / "src").exists():
            return frontend_path
        search_base = search_base.parent
    
    return None

def get_shadcn_config(frontend_path: Optional[Path] = None) -> dict:
    """Récupérer la configuration shadcn/ui"""
    if frontend_path is None:
        frontend_path = _find_frontend_path()
        if not frontend_path:
            return {}
    
    config_path = frontend_path / "components.json"
    
    if not config_path.exists():
        return {}
    
    with open(config_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_installed_components(frontend_path: Optional[Path] = None) -> List[str]:
    """Récupérer la liste des composants shadcn/ui installés"""
    if frontend_path is None:
        frontend_path = _find_frontend_path()
        if not frontend_path:
            return []
    
    ui_dir = frontend_path / "src" / "components" / "ui"
    
    if not ui_dir.exists():
        return []
    
    # Lister les fichiers .tsx dans ui/
    components = []
    for file in ui_dir.glob("*.tsx"):
        components.append(file.stem)
    
    return sorted(components)

def is_component_installed(component_name: str, frontend_path: Optional[Path] = None) -> bool:
    """
    Vérifier si un composant shadcn/ui est déjà installé
    
    Args:
        component_name: Nom du composant (ex: "button", "card")
        frontend_path: Chemin vers le dossier frontend
    
    Returns:
        True si installé, False sinon
    """
    if frontend_path is None:
        frontend_path = _find_frontend_path()
        if not frontend_path:
            return False
    
    ui_dir = frontend_path / "src" / "components" / "ui"
    
    if not ui_dir.exists():
        return False
    
    # Vérifier si le fichier existe
    component_file = ui_dir / f"{component_name}.tsx"
    return component_file.exists()

def install_shadcn_component(component_name: str, frontend_path: Optional[Path] = None, force: bool = False) -> dict:
    """
    Installer un composant shadcn/ui via leur CLI
    
    Args:
        component_name: Nom du composant (ex: "button", "card")
        frontend_path: Chemin vers le dossier frontend
        force: Si True, force l'installation même si déjà installé (non recommandé)
    
    Returns:
        Dict avec status, message, et action
    """
    if frontend_path is None:
        frontend_path = _find_frontend_path()
    
    if not frontend_path or not frontend_path.exists():
        return {
            'status': 'error',
            'message': f'Dossier frontend introuvable: {frontend_path}',
            'action': 'failed',
            'installed': False,
        }
    
    # Vérifier si déjà installé
    if is_component_installed(component_name, frontend_path):
        if force:
            return {
                'status': 'warning',
                'message': f'Composant {component_name} déjà installé (forcé)',
                'action': 'skipped',
                'installed': False,
            }
        else:
            return {
                'status': 'already_installed',
                'message': f'Composant {component_name} déjà installé',
                'action': 'skipped',
                'installed': False,
            }
    
    try:
        # Utiliser npx shadcn@latest add [component] avec --overwrite=false pour ne pas écraser
        result = subprocess.run(
            ['npx', 'shadcn@latest', 'add', component_name, '--yes', '--overwrite=false'],
            cwd=str(frontend_path),
            capture_output=True,
            text=True,
            timeout=60,
        )
        
        if result.returncode == 0:
            return {
                'status': 'success',
                'message': f'Composant {component_name} installé avec succès',
                'action': 'installed',
                'installed': True,
            }
        else:
            # Vérifier si c'est parce que le fichier existe déjà
            if 'already exists' in result.stderr.lower() or 'file already exists' in result.stderr.lower():
                return {
                    'status': 'already_exists',
                    'message': f'Composant {component_name} existe déjà (non écrasé)',
                    'action': 'skipped',
                    'installed': False,
                }
            
            return {
                'status': 'error',
                'message': f'Erreur lors de l\'installation de {component_name}',
                'action': 'failed',
                'installed': False,
                'error': result.stderr,
            }
    except subprocess.TimeoutExpired:
        return {
            'status': 'error',
            'message': f'Timeout lors de l\'installation de {component_name}',
            'action': 'timeout',
            'installed': False,
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': f'Erreur lors de l\'installation: {str(e)}',
            'action': 'failed',
            'installed': False,
            'error': str(e),
        }

def ensure_shadcn_components(
    component_names: List[str],
    frontend_path: Optional[Path] = None,
    auto_install: bool = True
) -> dict:
    """
    S'assurer que les composants shadcn/ui requis sont installés
    
    Args:
        component_names: Liste des composants requis
        frontend_path: Chemin vers le dossier frontend
        auto_install: Si True, installe automatiquement les composants manquants
    
    Returns:
        Dict avec résultats pour chaque composant
    """
    if frontend_path is None:
        frontend_path = _find_frontend_path()
    
    if not frontend_path or not frontend_path.exists():
        return {}
    
    results = {}
    
    for component_name in component_names:
        # Vérifier si déjà installé
        if is_component_installed(component_name, frontend_path):
            results[component_name] = {
                'status': 'already_installed',
                'message': f'{component_name} déjà installé',
                'action': 'skipped',
                'installed': False,
            }
        elif auto_install:
            # Installer automatiquement
            install_result = install_shadcn_component(component_name, frontend_path, force=False)
            results[component_name] = install_result
        else:
            results[component_name] = {
                'status': 'missing',
                'message': f'{component_name} non installé',
                'action': 'needs_install',
                'installed': False,
            }
    
    return results

def list_available_components() -> List[str]:
    """
    Lister les composants shadcn/ui disponibles
    Note: Cette fonction nécessite une connexion internet pour récupérer la liste
    """
    # Liste des composants shadcn/ui les plus courants
    common_components = [
        'accordion', 'alert', 'alert-dialog', 'aspect-ratio', 'avatar',
        'badge', 'button', 'calendar', 'card', 'carousel', 'checkbox',
        'collapsible', 'combobox', 'command', 'context-menu', 'dialog',
        'drawer', 'dropdown-menu', 'form', 'hover-card', 'input',
        'label', 'menubar', 'navigation-menu', 'popover', 'progress',
        'radio-group', 'scroll-area', 'select', 'separator', 'sheet',
        'skeleton', 'slider', 'sonner', 'switch', 'table', 'tabs',
        'textarea', 'toast', 'toggle', 'tooltip',
    ]
    
    return common_components

