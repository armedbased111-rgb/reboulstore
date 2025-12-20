"""
Parser pour analyser les entités TypeORM existantes et extraire les patterns
"""

import re
from pathlib import Path
from typing import Dict, List, Optional

def parse_entity_file(file_path: Path) -> Dict:
    """Parser un fichier d'entité TypeORM et extraire sa structure"""
    content = file_path.read_text(encoding='utf-8')
    
    # Extraire le nom de l'entité
    entity_match = re.search(r'export class (\w+)', content)
    if not entity_match:
        return None
    
    entity_name = entity_match.group(1)
    
    # Extraire le nom de la table
    table_match = re.search(r"@Entity\('([^']+)'\)", content)
    table_name = table_match.group(1) if table_match else entity_name.lower() + 's'
    
    # Extraire les colonnes
    fields = []
    column_pattern = r'@Column\([^)]+\)\s+(\w+):\s+([^;]+);'
    for match in re.finditer(column_pattern, content):
        field_name = match.group(1)
        field_type = match.group(2).strip()
        
        # Déterminer le type de base
        column_decorator = re.search(r'@Column\([^)]+\)', content[:match.end()])
        if column_decorator:
            col_content = column_decorator.group(0)
            if 'varchar' in col_content:
                base_type = 'string'
                length_match = re.search(r"length:\s*(\d+)", col_content)
                length = int(length_match.group(1)) if length_match else 255
            elif 'text' in col_content:
                base_type = 'text'
                length = None
            elif 'decimal' in col_content:
                base_type = 'number'
                length = None
            elif 'jsonb' in col_content:
                base_type = 'jsonb'
                length = None
            elif 'uuid' in col_content:
                base_type = 'uuid'
                length = None
            else:
                base_type = 'string'
                length = 255
            
            nullable = 'nullable: true' in col_content
            unique = 'unique: true' in col_content
        else:
            base_type = 'string'
            length = 255
            nullable = False
            unique = False
        
        fields.append({
            'name': field_name,
            'type': base_type,
            'ts_type': field_type,
            'length': length,
            'nullable': nullable,
            'unique': unique,
        })
    
    # Extraire les relations
    relations = []
    
    # ManyToOne
    many_to_one_pattern = r'@ManyToOne\([^)]+\)\s+@JoinColumn\([^)]+\)\s+(\w+):\s+(\w+)'
    for match in re.finditer(many_to_one_pattern, content, re.DOTALL):
        rel_name = match.group(1)
        target = match.group(2)
        relations.append({
            'type': 'ManyToOne',
            'name': rel_name,
            'target': target,
            'target_lower': target.lower(),
        })
    
    # OneToMany
    one_to_many_pattern = r'@OneToMany\([^)]+\)\s+(\w+):\s+(\w+)\[\]'
    for match in re.finditer(one_to_many_pattern, content, re.DOTALL):
        rel_name = match.group(1)
        target = match.group(2)
        relations.append({
            'type': 'OneToMany',
            'name': rel_name,
            'target': target,
            'target_lower': target.lower(),
        })
    
    return {
        'entity_name': entity_name,
        'table_name': table_name,
        'fields': fields,
        'relations': relations,
    }

