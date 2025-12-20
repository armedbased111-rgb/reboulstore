"""
Générateur de tests avancé
"""

from pathlib import Path
from typing import Dict, List, Optional
import re
from jinja2 import Environment, FileSystemLoader

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

class E2ETestGenerator:
    """Générer des tests E2E pour les endpoints"""
    
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    
    def generate(self, endpoint_name: str, method: str, route: str, expected_status: int = 200) -> str:
        """Générer un test E2E"""
        template = self.env.get_template('e2e-test.ts.j2')
        
        method_lower = method.lower()
        
        # Générer le code de validation basique
        validation_code = "expect(res.body).toBeDefined();"
        
        # Générer les cas d'erreur
        error_cases = ""
        if method.upper() in ['GET', 'POST', 'PUT', 'PATCH']:
            error_cases = f"""
    it('should return 404 for non-existent resource', () => {{
      return request(app.getHttpServer())
        .{method_lower}('{route}/999')
        .expect(404);
    }});"""
        
        return template.render(
            endpoint_name=endpoint_name,
            method=method.upper(),
            method_lower=method_lower,
            route=route,
            expected_status=expected_status,
            validation_code=validation_code,
            error_cases=error_cases,
        )

class UnitServiceTestGenerator:
    """Générer des tests unitaires pour les services NestJS"""
    
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    
    def generate(self, service_name: str, entity_name: str, module_name: str) -> str:
        """Générer un test unitaire pour un service"""
        template = self.env.get_template('unit-service-test.ts.j2')
        
        # Déterminer les noms de fichiers
        service_file = f"{module_name}.service"
        entity_file = f"{entity_name.lower()}.entity"
        entity_name_lower = entity_name.lower()
        
        return template.render(
            service_name=service_name,
            entity_name=entity_name,
            entity_name_lower=entity_name_lower,
            service_file=service_file,
            entity_file=entity_file,
        )

class FunctionalTestGenerator:
    """Générer des scripts de test fonctionnels"""
    
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    
    def generate(self, test_name: str, test_cases: List[Dict], supports_auth: bool = False, supports_upload: bool = False) -> str:
        """Générer un script de test fonctionnel"""
        template = self.env.get_template('functional-test.ts.j2')
        
        test_file = f"test-{test_name.lower().replace(' ', '-')}.ts"
        
        # Générer le code des tests
        test_cases_code = ""
        run_tests_code = ""
        
        for i, test_case in enumerate(test_cases):
            test_name_safe = test_case.get('name', f'test_{i}').replace(' ', '_').replace('-', '_')
            test_cases_code += f"""
async function {test_name_safe}() {{
  {test_case.get('code', '// TODO: Implémenter le test')}
}}
"""
            run_tests_code += f"  await runTest('{test_case.get('name', f'Test {i+1}')}', {test_name_safe});\n"
        
        return template.render(
            test_name=test_name,
            test_file=test_file,
            test_cases=test_cases_code,
            run_tests=run_tests_code,
        )

def parse_endpoint_from_controller(controller_file: Path) -> List[Dict]:
    """Parser les endpoints d'un controller"""
    if not controller_file.exists():
        return []
    
    try:
        content = controller_file.read_text(encoding='utf-8')
        endpoints = []
        
        # Pattern pour détecter les décorateurs HTTP
        pattern = r'@(Get|Post|Put|Patch|Delete)\(["\']?([^"\']+)["\']?\)'
        matches = re.findall(pattern, content)
        
        for method, route in matches:
            endpoints.append({
                'method': method,
                'route': route or '',
            })
        
        return endpoints
    except Exception:
        return []

