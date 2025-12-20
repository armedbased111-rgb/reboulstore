"""
Commandes pour gérer la roadmap
"""

import re
from pathlib import Path

ROADMAP_PATH = Path(__file__).parent.parent.parent / "docs" / "context" / "ROADMAP_COMPLETE.md"

class RoadmapUpdater:
    """Mettre à jour la roadmap"""
    
    @staticmethod
    def check_task(task_description):
        """Cocher une tâche dans la roadmap"""
        content = ROADMAP_PATH.read_text(encoding='utf-8')
        
        # Pattern pour trouver la tâche
        pattern = rf'- \[ \] {re.escape(task_description)}'
        replacement = f'- [x] {task_description}'
        
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            ROADMAP_PATH.write_text(content, encoding='utf-8')
            return True
        return False
    
    @staticmethod
    def mark_phase_complete(phase_num):
        """Marquer une phase comme complète"""
        content = ROADMAP_PATH.read_text(encoding='utf-8')
        
        # Pattern pour trouver le titre de phase
        pattern = rf'## (.*Phase {phase_num}[^✅]*?)(\s*✅)?'
        replacement = rf'## \1 ✅'
        
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            ROADMAP_PATH.write_text(content, encoding='utf-8')
            return True
        return False

class RoadmapChecker:
    """Vérifier la cohérence de la roadmap"""
    
    @staticmethod
    def validate():
        """Valider la roadmap et retourner les problèmes"""
        issues = []
        content = ROADMAP_PATH.read_text(encoding='utf-8')
        
        # Vérifier les phases sans ✅ mais toutes les tâches cochées
        phase_pattern = r'## (.*Phase (\d+)[^✅]*?)(\s*✅)?\n(.*?)(?=## |$)'
        
        for match in re.finditer(phase_pattern, content, re.DOTALL):
            phase_title = match.group(1).strip()
            phase_num = match.group(2)
            is_complete = match.group(3) is not None
            phase_content = match.group(4)
            
            # Compter les tâches
            total_tasks = len(re.findall(r'- \[[ x]\]', phase_content))
            completed_tasks = len(re.findall(r'- \[x\]', phase_content))
            
            # Si toutes les tâches sont complètes mais pas marqué ✅
            if total_tasks > 0 and completed_tasks == total_tasks and not is_complete:
                issues.append({
                    'type': 'Phase incomplète',
                    'message': f'Phase {phase_num} ({phase_title}) a toutes les tâches complètes mais n\'est pas marquée ✅'
                })
        
        return issues

class PhaseGetter:
    """Obtenir les détails d'une phase"""
    
    @staticmethod
    def details(phase_num):
        """Obtenir les détails d'une phase"""
        content = ROADMAP_PATH.read_text(encoding='utf-8')
        
        # Pattern pour trouver la phase
        pattern = rf'## (.*Phase {phase_num}[^✅]*?)(\s*✅)?\n(.*?)(?=## |$)'
        match = re.search(pattern, content, re.DOTALL)
        
        if not match:
            return None
        
        phase_title = match.group(1).strip()
        is_complete = match.group(3) is not None
        phase_content = match.group(4)
        
        # Compter les tâches
        total_tasks = len(re.findall(r'- \[[ x]\]', phase_content))
        completed_tasks = len(re.findall(r'- \[x\]', phase_content))
        
        return {
            'title': phase_title,
            'status': '✅ Complète' if is_complete else '⏳ En cours',
            'completed': completed_tasks,
            'total': total_tasks,
            'description': phase_content[:200] + '...' if len(phase_content) > 200 else phase_content
        }

# Export pour main.py
update_roadmap = RoadmapUpdater()
check_roadmap = RoadmapChecker()
get_phase = PhaseGetter()

