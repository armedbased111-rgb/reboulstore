"""
Analyseur de builds pour vérifier les erreurs avant déploiement
"""

import subprocess
import os
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import json
import re

class BuildAnalyzer:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent.parent
        self.backend_path = self.project_root / "backend"
        self.frontend_path = self.project_root / "frontend"
        self.admin_backend_path = self.project_root / "admin-central" / "backend"
        self.admin_frontend_path = self.project_root / "admin-central" / "frontend"
    
    def analyze_all(self) -> Dict:
        """Analyser tous les builds"""
        results = {
            'backend_reboul': self._analyze_build(self.backend_path, "Backend Reboul Store"),
            'frontend_reboul': self._analyze_build(self.frontend_path, "Frontend Reboul Store", is_frontend=True),
            'backend_admin': self._analyze_build(self.admin_backend_path, "Backend Admin Central"),
            'frontend_admin': self._analyze_build(self.admin_frontend_path, "Frontend Admin Central", is_frontend=True),
        }
        
        total_errors = sum(r.get('errors_count', 0) for r in results.values())
        total_warnings = sum(r.get('warnings_count', 0) for r in results.values())
        
        return {
            'results': results,
            'summary': {
                'total_errors': total_errors,
                'total_warnings': total_warnings,
                'all_passed': total_errors == 0,
            }
        }
    
    def _analyze_build(self, path: Path, name: str, is_frontend: bool = False) -> Dict:
        """Analyser un build spécifique"""
        if not path.exists():
            return {
                'name': name,
                'status': 'error',
                'error': f'Chemin introuvable: {path}',
                'errors_count': 1,
                'warnings_count': 0,
            }
        
        # Vérifier si node_modules existe
        node_modules = path / "node_modules"
        if not node_modules.exists():
            return {
                'name': name,
                'status': 'warning',
                'warning': 'node_modules introuvable - exécutez npm install',
                'errors_count': 0,
                'warnings_count': 1,
            }
        
        # Lancer le build
        build_command = ["npm", "run", "build"]
        
        try:
            result = subprocess.run(
                build_command,
                cwd=str(path),
                capture_output=True,
                text=True,
                timeout=300  # 5 minutes max
            )
            
            errors = self._extract_errors(result.stdout + result.stderr, is_frontend)
            warnings = self._extract_warnings(result.stdout + result.stderr, is_frontend)
            
            if result.returncode == 0:
                return {
                    'name': name,
                    'status': 'success',
                    'errors_count': len(errors),
                    'warnings_count': len(warnings),
                    'errors': errors,
                    'warnings': warnings,
                    'output': result.stdout[-1000:] if result.stdout else '',  # Derniers 1000 chars
                }
            else:
                return {
                    'name': name,
                    'status': 'error',
                    'errors_count': len(errors),
                    'warnings_count': len(warnings),
                    'errors': errors,
                    'warnings': warnings,
                    'output': result.stderr[-2000:] if result.stderr else result.stdout[-2000:],
                    'returncode': result.returncode,
                }
        except subprocess.TimeoutExpired:
            return {
                'name': name,
                'status': 'error',
                'error': 'Timeout: Le build a pris plus de 5 minutes',
                'errors_count': 1,
                'warnings_count': 0,
            }
        except Exception as e:
            return {
                'name': name,
                'status': 'error',
                'error': f'Erreur lors du build: {str(e)}',
                'errors_count': 1,
                'warnings_count': 0,
            }
    
    def _extract_errors(self, output: str, is_frontend: bool) -> List[str]:
        """Extraire les erreurs du output"""
        errors = []
        lines = output.split('\n')
        
        for line in lines:
            line_lower = line.lower()
            # Patterns d'erreur TypeScript/JavaScript
            if any(keyword in line_lower for keyword in ['error', '✖', '×', 'failed', 'cannot', "can't"]):
                # Ignorer les lignes de warning
                if 'warning' not in line_lower and 'deprecated' not in line_lower:
                    errors.append(line.strip())
        
        return errors[:50]  # Limiter à 50 erreurs
    
    def _extract_warnings(self, output: str, is_frontend: bool) -> List[str]:
        """Extraire les warnings du output"""
        warnings = []
        lines = output.split('\n')
        
        for line in lines:
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in ['warning', 'warn', 'deprecated']):
                warnings.append(line.strip())
        
        return warnings[:50]  # Limiter à 50 warnings
    
    def extract_file_paths_from_errors(self, errors: List[str]) -> Dict[str, List[str]]:
        """Extraire les chemins de fichiers depuis les erreurs"""
        file_errors = {}
        
        for error in errors:
            # Pattern: path/to/file.ts(line,column): error message
            match = re.match(r'^(.+?)\((\d+),(\d+)\):\s*(.+)', error)
            if match:
                file_path = match.group(1).strip()
                error_msg = match.group(4).strip()
                
                # Nettoyer le chemin (enlever les préfixes comme src/)
                file_path = re.sub(r'^src/', '', file_path)
                
                if file_path not in file_errors:
                    file_errors[file_path] = []
                file_errors[file_path].append(error_msg)
        
        return file_errors

build_analyzer = BuildAnalyzer()
