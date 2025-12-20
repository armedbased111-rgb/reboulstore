"""
Commandes pour la documentation
"""

from pathlib import Path
from typing import Optional
import re
from utils.api_doc_generator import generate_api_documentation
from utils.components_doc_generator import generate_components_documentation
from utils.docs_syncer import synchronize_all_docs, generate_changelog

ROADMAP_PATH = Path(__file__).parent.parent.parent / "docs" / "context" / "ROADMAP_COMPLETE.md"
CONTEXT_PATH = Path(__file__).parent.parent.parent / "docs" / "context" / "CONTEXT.md"
BACKEND_PATH = Path(__file__).parent.parent.parent / "backend" / "BACKEND.md"
FRONTEND_PATH = Path(__file__).parent.parent.parent / "frontend" / "FRONTEND.md"

class DocsValidator:
    """Valider la cohérence de la documentation"""
    
    @staticmethod
    def check():
        """Vérifier la documentation et retourner les problèmes"""
        from pathlib import Path
        
        base_path = Path(__file__).parent.parent.parent.parent
        docs_path = base_path / "docs"
        
        issues = {
            'broken_links': [],
            'obsolete_sections': [],
            'missing_files': [],
        }
        
        # Vérifier les liens markdown
        if docs_path.exists():
            for doc_file in docs_path.rglob("*.md"):
                try:
                    content = doc_file.read_text(encoding='utf-8')
                    
                    # Détecter les liens
                    link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
                    links = re.findall(link_pattern, content)
                    
                    for link_text, link_path in links:
                        # Vérifier si le lien est valide
                        if link_path.startswith('http'):
                            continue  # Lien externe
                        
                        # Lien relatif
                        if link_path.startswith('/'):
                            target = base_path / link_path.lstrip('/')
                        else:
                            target = doc_file.parent / link_path
                        
                        if not target.exists():
                            issues['broken_links'].append({
                                'file': str(doc_file.relative_to(base_path)),
                                'link': link_path,
                                'text': link_text,
                            })
                
                except Exception:
                    continue
        
        return issues

class DocsSyncer:
    """Synchroniser la documentation"""
    
    @staticmethod
    def synchronize():
        """Synchroniser toute la documentation"""
        return synchronize_all_docs()
    
    @staticmethod
    def generate_changelog_doc(output_file: Optional[str] = None):
        """Générer un changelog"""
        return generate_changelog(output_file)
    
    @staticmethod
    def generate_api(output_file: Optional[str] = None):
        """Générer la documentation API"""
        base_path = Path(__file__).parent.parent.parent
        if output_file:
            output_path = base_path / output_file
        else:
            output_path = base_path / "docs" / "API.md"
        
        content = generate_api_documentation(output_path)
        
        if content:
            return str(output_path.relative_to(base_path))
        return None
    
    @staticmethod
    def generate_components(output_file: Optional[str] = None):
        """Générer la documentation des composants et hooks"""
        base_path = Path(__file__).parent.parent.parent
        if output_file:
            output_path = base_path / output_file
        else:
            output_path = base_path / "docs" / "COMPONENTS.md"
        
        content = generate_components_documentation(output_path)
        
        if content:
            return str(output_path.relative_to(base_path))
        return None

# Export pour main.py
validate_docs = DocsValidator()
sync_docs = DocsSyncer()

