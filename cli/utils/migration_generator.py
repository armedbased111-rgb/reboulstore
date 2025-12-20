"""
Générateur de migrations TypeORM
"""

from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime
import re
from jinja2 import Environment, FileSystemLoader

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

class MigrationGenerator:
    """Générer des migrations TypeORM"""
    
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    
    def generate(self, migration_name: str, changes: Dict = None) -> str:
        """Générer une migration TypeORM"""
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        migration_name_safe = re.sub(r'[^a-zA-Z0-9]', '', migration_name)
        class_name = f"{migration_name_safe}{timestamp}"
        
        # SQL basique (à améliorer avec analyse d'entités)
        up_sql = "    // TODO: Ajouter les changements de schéma"
        down_sql = "    // TODO: Ajouter le rollback"
        
        if changes:
            # Générer le SQL depuis les changements
            up_sql = self._generate_sql_from_changes(changes, 'up')
            down_sql = self._generate_sql_from_changes(changes, 'down')
        
        template_content = f"""import {{ MigrationInterface, QueryRunner }} from 'typeorm';

export class {class_name} implements MigrationInterface {{
  name = '{class_name}'

  public async up(queryRunner: QueryRunner): Promise<void> {{
{up_sql}
  }}

  public async down(queryRunner: QueryRunner): Promise<void> {{
{down_sql}
  }}
}}
"""
        
        return template_content
    
    def _generate_sql_from_changes(self, changes: Dict, direction: str) -> str:
        """Générer le SQL depuis les changements"""
        # Simplifié - pourrait être amélioré avec analyse d'entités
        sql_lines = []
        
        if direction == 'up':
            # Créer les tables/colonnes
            for change in changes.get('add', []):
                sql_lines.append(f"    // {change}")
        else:
            # Rollback
            for change in changes.get('remove', []):
                sql_lines.append(f"    // {change}")
        
        return '\n'.join(sql_lines) if sql_lines else "    // Pas de changements"

def analyze_entity_changes(entity_file: Path) -> Dict:
    """Analyser les changements d'une entité"""
    # Simplifié - pourrait être amélioré avec comparaison git
    return {
        'add': [],
        'remove': [],
        'modify': [],
    }

