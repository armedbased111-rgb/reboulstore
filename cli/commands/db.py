"""
Commandes pour la base de données
"""

from pathlib import Path
from utils.migration_generator import MigrationGenerator, analyze_entity_changes
from utils.seed_generator import SeedGenerator
from utils.schema_analyzer import analyze_schema

class DatabaseManager:
    """Gérer les migrations et seeds"""
    
    @staticmethod
    def generate_migration(migration_name: str, entity_name: str = None):
        """Générer une migration"""
        generator = MigrationGenerator()
        
        changes = None
        if entity_name:
            # Analyser les changements de l'entité
            backend_path = Path(__file__).parent.parent.parent.parent / "backend"
            entity_file = backend_path / "src" / "entities" / f"{entity_name.lower()}.entity.ts"
            
            if entity_file.exists():
                changes = analyze_entity_changes(entity_file)
        
        content = generator.generate(migration_name, changes)
        
        # Sauvegarder la migration
        migrations_dir = Path(__file__).parent.parent.parent.parent / "backend" / "src" / "migrations"
        migrations_dir.mkdir(parents=True, exist_ok=True)
        
        timestamp = __import__('datetime').datetime.now().strftime('%Y%m%d%H%M%S')
        migration_name_safe = __import__('re').sub(r'[^a-zA-Z0-9]', '', migration_name)
        file_name = f"{timestamp}-{migration_name_safe}.ts"
        
        file_path = migrations_dir / file_name
        file_path.write_text(content, encoding='utf-8')
        
        return str(file_path.relative_to(Path(__file__).parent.parent.parent.parent))
    
    @staticmethod
    def generate_seed(seed_name: str, entities: list = None, supports_cloudinary: bool = False):
        """Générer un script de seed"""
        generator = SeedGenerator()
        
        content = generator.generate(seed_name, entities, supports_cloudinary)
        
        # Sauvegarder le seed
        scripts_dir = Path(__file__).parent.parent.parent.parent / "backend" / "src" / "scripts"
        scripts_dir.mkdir(parents=True, exist_ok=True)
        
        seed_file = seed_name.lower().replace(' ', '-')
        file_path = scripts_dir / f"{seed_file}.ts"
        file_path.write_text(content, encoding='utf-8')
        file_path.chmod(0o755)
        
        return str(file_path.relative_to(Path(__file__).parent.parent.parent.parent))
    
    @staticmethod
    def analyze_schema():
        """Analyser le schéma de la base de données"""
        return analyze_schema()

# Export pour main.py
db_manager = DatabaseManager()

