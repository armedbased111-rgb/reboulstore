"""
Tests d'intégration pour le CLI
"""

import unittest
import tempfile
import shutil
from pathlib import Path
import sys
import subprocess

# Ajouter le dossier parent au path
sys.path.insert(0, str(Path(__file__).parent.parent))

class TestCLIIntegration(unittest.TestCase):
    """Tests d'intégration du CLI"""
    
    def setUp(self):
        """Setup pour chaque test"""
        self.test_dir = Path(tempfile.mkdtemp())
        self.cli_path = Path(__file__).parent.parent / "main.py"
        
        # Créer une structure de test
        self.backend_dir = self.test_dir / "backend" / "src"
        self.entities_dir = self.backend_dir / "entities"
        self.modules_dir = self.backend_dir / "modules"
        
        self.entities_dir.mkdir(parents=True, exist_ok=True)
        self.modules_dir.mkdir(parents=True, exist_ok=True)
    
    def tearDown(self):
        """Nettoyage après chaque test"""
        shutil.rmtree(self.test_dir)
    
    def test_help_command(self):
        """Test que la commande --help fonctionne"""
        result = subprocess.run(
            ['python3', str(self.cli_path), '--help'],
            capture_output=True,
            text=True,
            cwd=str(Path(__file__).parent.parent),
        )
        
        self.assertEqual(result.returncode, 0)
        self.assertIn('CLI Python', result.stdout)
    
    def test_code_generate_help(self):
        """Test que code generate --help fonctionne"""
        result = subprocess.run(
            ['python3', str(self.cli_path), 'code', 'generate', '--help'],
            capture_output=True,
            text=True,
            cwd=str(Path(__file__).parent.parent),
        )
        
        self.assertEqual(result.returncode, 0)
        self.assertIn('code generate', result.stdout.lower())

if __name__ == '__main__':
    unittest.main()

