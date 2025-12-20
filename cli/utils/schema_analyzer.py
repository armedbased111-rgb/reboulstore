"""
Analyseur de schéma (entités ↔ base de données/migrations)
"""

from pathlib import Path
from typing import Dict, List, Optional
import re
from .dependency_analyzer import find_entities


def _get_backend_path() -> Optional[Path]:
    """Trouver le chemin du dossier backend"""
    # Depuis cli/utils/schema_analyzer.py :
    # __file__ = .../reboulstore/cli/utils/schema_analyzer.py
    # parent.parent.parent = .../reboulstore (racine du projet)
    base = Path(__file__).parent.parent.parent
    backend = base / "backend"
    if backend.exists():
        return backend
    # Fallback un niveau au-dessus si nécessaire
    fallback = base.parent / "backend"
    return fallback if fallback.exists() else None


def _get_entity_table_name(entity_file: Path) -> Optional[str]:
    """Extraire le nom de table à partir de l'entité (@Entity('table'))"""
    try:
        content = entity_file.read_text(encoding='utf-8')
        # Pattern: @Entity('table_name') ou @Entity("table_name")
        match = re.search(r"@Entity\(['\"]([^'\"]+)['\"]\)", content)
        if match:
            return match.group(1)
        # Fallback: essayer de déduire depuis le nom de la classe
        class_match = re.search(r"export class (\w+)", content)
        if class_match:
            class_name = class_match.group(1)
            # Convertir PascalCase en snake_case pluriel (approximation)
            # Product -> products, Category -> categories
            return class_name.lower() + "s" if not class_name.endswith('s') else class_name.lower()
    except Exception:
        return None
    return None


def _get_seed_entities(backend_path: Path) -> List[str]:
    """Récupérer les entités utilisées dans les scripts seed"""
    scripts_dir = backend_path / "src" / "scripts"
    if not scripts_dir.exists():
        return []
    
    entities = set()
    for seed_file in scripts_dir.glob("*.ts"):
        try:
            content = seed_file.read_text(encoding='utf-8')
            # Pattern TypeORM: dataSource.getRepository(Entity)
            matches = re.findall(r"getRepository\((\w+)\)", content)
            entities.update(matches)
        except Exception:
            continue
    
    return sorted(list(entities))


def _get_migration_tables(backend_path: Path) -> List[str]:
    """Récupérer les tables mentionnées dans les migrations"""
    migrations_dir = backend_path / "src" / "migrations"
    if not migrations_dir.exists():
        return []
    
    tables = set()
    for file in migrations_dir.glob("*.ts"):
        try:
            content = file.read_text(encoding='utf-8')
            # Patterns possibles :
            # - tableName: 'products'
            # - CREATE TABLE "products"
            # - await queryRunner.createTable('products')
            patterns = [
                r"tableName:\s*['\"]([^'\"]+)['\"]",
                r"CREATE TABLE\s+['\"]?([^'\s\"]+)['\"]?",
                r"createTable\(['\"]?([^'\"]+)['\"]?",
            ]
            for pattern in patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                for m in matches:
                    # Nettoyer le nom de table (enlever les guillemets)
                    table = m.strip().strip('"').strip("'")
                    if table and not table.startswith('('):
                        tables.add(table)
        except Exception:
            continue
    
    return sorted(list(tables))


def _get_migration_count(backend_path: Path) -> int:
    """Compter le nombre de fichiers de migration"""
    migrations_dir = backend_path / "src" / "migrations"
    if not migrations_dir.exists():
        return 0
    return len(list(migrations_dir.glob("*.ts")))


def analyze_schema() -> Dict:
    """Analyser le schéma : entités ↔ migrations/seed"""
    backend_path = _get_backend_path()
    if not backend_path:
        return {
            'error': 'Backend introuvable',
        }

    entities = find_entities(backend_path)
    seed_entities = _get_seed_entities(backend_path)
    migration_tables = _get_migration_tables(backend_path)
    migration_count = _get_migration_count(backend_path)

    entities_info = []
    # Normaliser les noms d'entités seedées (PascalCase -> kebab-case)
    seed_entities_normalized = {e.lower().replace('_', '-') for e in seed_entities}
    
    for entity in entities:
        entity_file = backend_path / "src" / "entities" / f"{entity.lower()}.entity.ts"
        table_name = _get_entity_table_name(entity_file) if entity_file.exists() else None
        # Comparer en normalisant (entity est déjà en kebab-case, seed_entities en PascalCase)
        seeded = entity.lower() in seed_entities_normalized or entity.capitalize() in seed_entities
        has_table_migration = bool(migration_tables) and table_name in migration_tables if table_name else False
        
        entities_info.append({
            'entity': entity,
            'table': table_name,
            'seeded': seeded,
            'has_migration_table': has_table_migration,
        })

    # Détecter les problèmes
    entities_without_seed = [e['entity'] for e in entities_info if not e['seeded']]
    entities_without_migration = [e['entity'] for e in entities_info if not e['has_migration_table'] and migration_count > 0]
    
    # Tables dans migrations mais sans entité correspondante
    entity_tables = [e['table'] for e in entities_info if e['table']]
    tables_without_entities = [t for t in migration_tables if t not in entity_tables]

    # Suggestions
    suggestions = []
    if migration_count == 0:
        suggestions.append({
            'type': 'info',
            'message': 'Aucune migration trouvée. En développement, synchronize: true est actif. Pour la production, générer des migrations avec: db generate migration InitialSchema'
        })
    if entities_without_seed:
        suggestions.append({
            'type': 'warning',
            'message': f"Entités sans données de seed: {', '.join(entities_without_seed)}"
        })
    if entities_without_migration and migration_count > 0:
        suggestions.append({
            'type': 'warning',
            'message': f"Entités sans migration correspondante: {', '.join(entities_without_migration)}"
        })
    if tables_without_entities:
        suggestions.append({
            'type': 'warning',
            'message': f"Tables dans migrations sans entité correspondante: {', '.join(tables_without_entities)}"
        })

    return {
        'summary': {
            'total_entities': len(entities),
            'total_migrations': migration_count,
            'total_seeded': len(seed_entities),
            'total_tables_in_migrations': len(migration_tables),
        },
        'entities': entities_info,
        'migrations': {
            'count': migration_count,
            'tables': migration_tables,
        },
        'seeds': {
            'entities': seed_entities,
        },
        'issues': {
            'entities_without_seed': entities_without_seed,
            'entities_without_migration': entities_without_migration,
            'tables_without_entities': tables_without_entities,
        },
        'suggestions': suggestions,
    }
