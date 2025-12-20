"""
Commandes pour gérer le contexte
"""

from pathlib import Path
from datetime import datetime
import re

ROADMAP_PATH = Path(__file__).parent.parent.parent / "docs" / "context" / "ROADMAP_COMPLETE.md"
CONTEXT_PATH = Path(__file__).parent.parent.parent / "docs" / "context" / "CONTEXT.md"
BACKEND_PATH = Path(__file__).parent.parent.parent / "backend" / "BACKEND.md"
FRONTEND_PATH = Path(__file__).parent.parent.parent / "frontend" / "FRONTEND.md"

class ContextGenerator:
    """Générer un résumé de contexte pour Cursor"""
    
    @staticmethod
    def create_summary():
        """Créer un résumé structuré du contexte"""
        roadmap_content = ROADMAP_PATH.read_text(encoding='utf-8')
        context_content = CONTEXT_PATH.read_text(encoding='utf-8')
        
        # Extraire les phases en cours
        phase_pattern = r'## (.*Phase (\d+)[^✅]*?)(\s*✅)?\n(.*?)(?=## |$)'
        phases_in_progress = []
        phases_complete = []
        
        for match in re.finditer(phase_pattern, roadmap_content, re.DOTALL):
            phase_num = match.group(2)
            phase_title = match.group(1).strip()
            is_complete = match.group(3) is not None
            phase_content = match.group(4)
            
            # Compter les tâches
            total_tasks = len(re.findall(r'- \[[ x]\]', phase_content))
            completed_tasks = len(re.findall(r'- \[x\]', phase_content))
            
            phase_info = {
                'num': phase_num,
                'title': phase_title,
                'completed': completed_tasks,
                'total': total_tasks,
                'progress': f"{completed_tasks}/{total_tasks}"
            }
            
            if is_complete:
                phases_complete.append(phase_info)
            else:
                phases_in_progress.append(phase_info)
        
        # Générer le résumé
        summary = f"""# 📊 Résumé de contexte - Reboul Store

**Généré le** : {datetime.now().strftime('%d/%m/%Y %H:%M')}

## 🎯 État actuel

### Phases en cours ({len(phases_in_progress)})
"""
        
        for phase in phases_in_progress[:5]:  # Top 5
            summary += f"- **Phase {phase['num']}** : {phase['title']} ({phase['progress']} tâches)\n"
        
        summary += f"\n### Phases complètes ({len(phases_complete)})\n"
        summary += f"Dernières phases complétées : {', '.join([f'Phase {p['num']}' for p in phases_complete[-3:]])}\n"
        
        # Extraire l'objectif
        objective_match = re.search(r'## 🎯 OBJECTIF.*?\n\n(.*?)\n\n', roadmap_content, re.DOTALL)
        if objective_match:
            summary += f"\n## 🎯 Objectif\n\n{objective_match.group(1).strip()}\n"
        
        # Extraire l'état actuel du contexte
        current_state_match = re.search(r'## 📊 État actuel.*?\n\n(.*?)(?=## |$)', context_content, re.DOTALL)
        if current_state_match:
            summary += f"\n## 📊 État actuel\n\n{current_state_match.group(1).strip()[:500]}...\n"
        
        summary += """
## 📚 Fichiers de référence

- `docs/context/ROADMAP_COMPLETE.md` : Roadmap complète (source de vérité)
- `docs/context/CONTEXT.md` : Contexte général
- `backend/BACKEND.md` : Documentation backend
- `frontend/FRONTEND.md` : Documentation frontend

## 🔗 Commandes Cursor utiles

- `/getcontext [sujet]` : Recherche de contexte
- `/roadmap-phase-workflow` : Créer/modifier une phase
- `/implement-phase [numéro]` : Implémenter une phase
- `/update-roadmap` : Mettre à jour la roadmap
"""
        
        return summary

class ContextSyncer:
    """Synchroniser les fichiers de contexte"""
    
    @staticmethod
    def synchronize():
        """Synchroniser tous les fichiers de contexte"""
        results = {}
        
        # Synchroniser CONTEXT.md avec ROADMAP_COMPLETE.md
        try:
            roadmap_content = ROADMAP_PATH.read_text(encoding='utf-8')
            context_content = CONTEXT_PATH.read_text(encoding='utf-8')
            
            # Extraire la phase actuelle de la roadmap
            phase_pattern = r'## (.*Phase (\d+)[^✅]*?)(\s*✅)?\n(.*?)(?=## |$)'
            last_incomplete = None
            
            for match in re.finditer(phase_pattern, roadmap_content, re.DOTALL):
                is_complete = match.group(3) is None
                if not is_complete:
                    last_incomplete = match.group(2)
            
            # Mettre à jour CONTEXT.md si nécessaire
            if last_incomplete:
                # Pattern pour trouver "Phase actuelle"
                context_pattern = r'(Phase actuelle.*?:.*?Phase )\d+'
                if re.search(context_pattern, context_content):
                    context_content = re.sub(
                        context_pattern,
                        f'\\g<1>{last_incomplete}',
                        context_content
                    )
                    CONTEXT_PATH.write_text(context_content, encoding='utf-8')
                    results['CONTEXT.md'] = '✅ Synchronisé'
                else:
                    results['CONTEXT.md'] = '⚠️  Pattern non trouvé'
            else:
                results['CONTEXT.md'] = '✅ Aucune mise à jour nécessaire'
        
        except Exception as e:
            results['CONTEXT.md'] = f'❌ Erreur: {str(e)}'
        
        return results

# Export pour main.py
generate_context = ContextGenerator()
sync_context = ContextSyncer()

