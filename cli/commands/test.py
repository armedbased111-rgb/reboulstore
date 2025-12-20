"""
Commandes pour générer des tests
"""

from pathlib import Path
from utils.test_generator import (
    E2ETestGenerator,
    UnitServiceTestGenerator,
    FunctionalTestGenerator,
    parse_endpoint_from_controller,
)

class TestGenerator:
    """Générer des scripts de test"""
    
    @staticmethod
    def create(target, name):
        """Créer un script de test (ancienne méthode - pour compatibilité)"""
        scripts_dir = Path(__file__).parent.parent.parent / "backend" / "scripts"
        
        generator = FunctionalTestGenerator()
        
        # Tests de base
        test_cases = [
            {
                'name': f'Test {name} - Cas nominal',
                'code': f'// TODO: Implémenter le test pour {name}',
            },
        ]
        
        content = generator.generate(name, test_cases)
        
        file_path = scripts_dir / f"test-{name.lower()}.ts"
        file_path.write_text(content, encoding='utf-8')
        file_path.chmod(0o755)
        
        return str(file_path.relative_to(Path(__file__).parent.parent.parent))
    
    @staticmethod
    def create_e2e(endpoint_name: str, method: str = 'GET', route: str = None):
        """Créer un test E2E"""
        test_dir = Path(__file__).parent.parent.parent / "backend" / "test"
        test_dir.mkdir(exist_ok=True)
        
        generator = E2ETestGenerator()
        
        if not route:
            route = f"/{endpoint_name.lower()}"
        
        content = generator.generate(endpoint_name, method, route)
        
        file_path = test_dir / f"{endpoint_name.lower()}.e2e-spec.ts"
        file_path.write_text(content, encoding='utf-8')
        
        return str(file_path.relative_to(Path(__file__).parent.parent.parent))
    
    @staticmethod
    def create_unit_service(service_name: str, module_name: str = None):
        """Créer un test unitaire pour un service"""
        if not module_name:
            module_name = service_name.lower().rstrip('service')
        
        module_dir = Path(__file__).parent.parent.parent / "backend" / "src" / "modules" / module_name
        
        if not module_dir.exists():
            return None
        
        # Déterminer l'entité
        entity_name = module_name.rstrip('s').capitalize()  # products -> Product
        
        generator = UnitServiceTestGenerator()
        content = generator.generate(service_name, entity_name, module_name)
        
        file_path = module_dir / f"{module_name}.service.spec.ts"
        file_path.write_text(content, encoding='utf-8')
        
        return str(file_path.relative_to(Path(__file__).parent.parent.parent))
    
    @staticmethod
    def create_functional(test_name: str, test_cases: list = None, supports_auth: bool = False, supports_upload: bool = False):
        """Créer un script de test fonctionnel"""
        scripts_dir = Path(__file__).parent.parent.parent / "backend" / "scripts"
        scripts_dir.mkdir(exist_ok=True)
        
        if not test_cases:
            test_cases = [
                {
                    'name': f'{test_name} - Cas nominal',
                    'code': f'// TODO: Implémenter le test',
                },
            ]
        
        generator = FunctionalTestGenerator()
        content = generator.generate(test_name, test_cases, supports_auth, supports_upload)
        
        test_file = f"test-{test_name.lower().replace(' ', '-')}.ts"
        file_path = scripts_dir / test_file
        file_path.write_text(content, encoding='utf-8')
        file_path.chmod(0o755)
        
        return str(file_path.relative_to(Path(__file__).parent.parent.parent))

# Export pour main.py
generate_test = TestGenerator()

