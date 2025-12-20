"""
Commandes pour l'intégration avec Figma
"""

from pathlib import Path
from utils.figma_helper import (
    parse_figma_url,
    generate_component_from_figma_description,
    create_figma_analysis_template,
)

class FigmaHelper:
    """Aide à l'intégration avec Figma"""
    
    @staticmethod
    def analyze_url(figma_url: str):
        """Analyser une URL Figma"""
        return parse_figma_url(figma_url)
    
    @staticmethod
    def suggest_components(description: str):
        """Suggérer des composants basés sur une description"""
        return generate_component_from_figma_description(description)
    
    @staticmethod
    def create_analysis_template(figma_url: str, component_name: str):
        """Créer un template d'analyse Figma"""
        template = create_figma_analysis_template(figma_url, component_name)
        
        # Sauvegarder dans un dossier figma/
        figma_dir = Path(__file__).parent.parent.parent / "figma"
        figma_dir.mkdir(exist_ok=True)
        
        file_path = figma_dir / f"{component_name.lower()}-analysis.md"
        file_path.write_text(template, encoding='utf-8')
        
        return str(file_path.relative_to(Path(__file__).parent.parent.parent))

# Export pour main.py
help_figma = FigmaHelper()

