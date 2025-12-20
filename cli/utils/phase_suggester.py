"""
Suggèreur de phases
Analyse les besoins et suggère de nouvelles phases
"""

from pathlib import Path
from typing import Dict, List, Optional
import re


def _get_roadmap_path() -> Path:
    """Trouver le chemin de ROADMAP_COMPLETE.md"""
    base = Path(__file__).parent.parent.parent
    roadmap = base / "docs" / "context" / "ROADMAP_COMPLETE.md"
    if roadmap.exists():
        return roadmap
    return base.parent / "docs" / "context" / "ROADMAP_COMPLETE.md"


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


def _analyze_current_state() -> Dict:
    """Analyser l'état actuel du projet"""
    state = {
        'entities': [],
        'modules': [],
        'components': [],
        'pages': [],
        'hooks': [],
        'completed_phases': [],
    }
    
    # Analyser backend
    backend_path = _get_backend_path()
    if backend_path.exists():
        entities_dir = backend_path / "src" / "entities"
        if entities_dir.exists():
            for entity_file in entities_dir.glob("*.entity.ts"):
                state['entities'].append(entity_file.stem.replace('.entity', ''))
        
        modules_dir = backend_path / "src" / "modules"
        if modules_dir.exists():
            for module_dir in modules_dir.iterdir():
                if module_dir.is_dir():
                    state['modules'].append(module_dir.name)
    
    # Analyser frontend
    frontend_path = _get_frontend_path()
    if frontend_path.exists():
        components_dir = frontend_path / "src" / "components"
        if components_dir.exists():
            for component_file in components_dir.rglob("*.tsx"):
                if 'ui' not in str(component_file):
                    state['components'].append(component_file.stem)
        
        pages_dir = frontend_path / "src" / "pages"
        if pages_dir.exists():
            for page_file in pages_dir.glob("*.tsx"):
                state['pages'].append(page_file.stem)
        
        hooks_dir = frontend_path / "src" / "hooks"
        if hooks_dir.exists():
            for hook_file in hooks_dir.glob("*.ts"):
                state['hooks'].append(hook_file.stem)
    
    # Analyser les phases complétées
    roadmap_path = _get_roadmap_path()
    if roadmap_path.exists():
        content = roadmap_path.read_text(encoding='utf-8')
        # Extraire les phases complétées
        completed_pattern = r'##\s+✅\s+Phase\s+(\d+(?:\.\d+)?)'
        matches = re.findall(completed_pattern, content)
        state['completed_phases'] = [float(m) for m in matches]
    
    return state


def _suggest_phases_for_domain(domain: str, state: Dict) -> List[Dict]:
    """Suggérer des phases pour un domaine spécifique"""
    suggestions = []
    
    domain_lower = domain.lower()
    
    # Suggestions pour "auth" ou "authentication"
    if 'auth' in domain_lower or 'login' in domain_lower or 'user' in domain_lower:
        if 'User' not in state['entities']:
            suggestions.append({
                'title': 'Phase : Authentification & Utilisateurs',
                'description': 'Implémenter le système d\'authentification complet',
                'complexity': 'medium',
                'estimated_time': '2-3 jours',
                'dependencies': [],
                'tasks': [
                    'Créer entité User avec rôles',
                    'Implémenter JWT authentication',
                    'Créer guards et decorators',
                    'Ajouter endpoints login/register',
                ],
            })
    
    # Suggestions pour "payment" ou "stripe"
    if 'payment' in domain_lower or 'stripe' in domain_lower or 'checkout' in domain_lower:
        suggestions.append({
            'title': 'Phase : Intégration Stripe',
            'description': 'Intégrer le paiement avec Stripe',
            'complexity': 'high',
            'estimated_time': '3-5 jours',
            'dependencies': ['orders', 'cart'],
            'tasks': [
                'Configurer Stripe SDK',
                'Créer endpoints de paiement',
                'Implémenter webhooks',
                'Gérer les remboursements',
            ],
        })
    
    # Suggestions pour "search" ou "recherche"
    if 'search' in domain_lower or 'recherche' in domain_lower:
        suggestions.append({
            'title': 'Phase : Recherche Full-Text',
            'description': 'Implémenter la recherche avancée',
            'complexity': 'medium',
            'estimated_time': '2-3 jours',
            'dependencies': ['products'],
            'tasks': [
                'Configurer PostgreSQL Full-Text Search',
                'Créer endpoint de recherche',
                'Ajouter suggestions de recherche',
                'Implémenter filtres avancés',
            ],
        })
    
    # Suggestions pour "admin" ou "dashboard"
    if 'admin' in domain_lower or 'dashboard' in domain_lower:
        suggestions.append({
            'title': 'Phase : Dashboard Admin',
            'description': 'Créer l\'interface d\'administration',
            'complexity': 'high',
            'estimated_time': '5-7 jours',
            'dependencies': ['auth', 'products', 'orders'],
            'tasks': [
                'Créer layout admin',
                'Implémenter gestion produits',
                'Ajouter gestion commandes',
                'Créer statistiques et analytics',
            ],
        })
    
    # Suggestions pour "notification" ou "email"
    if 'notification' in domain_lower or 'email' in domain_lower:
        suggestions.append({
            'title': 'Phase : Notifications & Emails',
            'description': 'Système de notifications et emails',
            'complexity': 'medium',
            'estimated_time': '2-3 jours',
            'dependencies': ['orders', 'auth'],
            'tasks': [
                'Configurer service email (SMTP)',
                'Créer templates d\'emails',
                'Implémenter notifications en temps réel',
                'Ajouter préférences utilisateur',
            ],
        })
    
    # Suggestions génériques si aucune correspondance
    if not suggestions:
        suggestions.append({
            'title': f'Phase : {domain.capitalize()}',
            'description': f'Implémenter les fonctionnalités liées à {domain}',
            'complexity': 'medium',
            'estimated_time': '2-4 jours',
            'dependencies': [],
            'tasks': [
                f'Analyser les besoins pour {domain}',
                'Créer les entités nécessaires',
                'Implémenter les services',
                'Créer les endpoints API',
                'Développer l\'interface frontend',
            ],
        })
    
    return suggestions


def suggest_phases(domain: Optional[str] = None) -> Dict:
    """Suggérer des phases basées sur l'analyse du projet"""
    state = _analyze_current_state()
    
    if domain:
        suggestions = _suggest_phases_for_domain(domain, state)
    else:
        # Suggestions générales basées sur l'état actuel
        suggestions = []
        
        # Vérifier ce qui manque
        if 'auth' not in [m.lower() for m in state['modules']]:
            suggestions.extend(_suggest_phases_for_domain('auth', state))
        
        if 'search' not in [m.lower() for m in state['modules']]:
            suggestions.extend(_suggest_phases_for_domain('search', state))
        
        if not any('admin' in p.lower() for p in state['pages']):
            suggestions.extend(_suggest_phases_for_domain('admin', state))
    
    return {
        'current_state': {
            'entities': len(state['entities']),
            'modules': len(state['modules']),
            'components': len(state['components']),
            'pages': len(state['pages']),
            'hooks': len(state['hooks']),
            'completed_phases': len(state['completed_phases']),
        },
        'suggestions': suggestions,
    }

