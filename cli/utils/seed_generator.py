"""
Générateur de scripts de seed
"""

from pathlib import Path
from typing import Dict, List, Optional
from jinja2 import Environment, FileSystemLoader

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

class SeedGenerator:
    """Générer des scripts de seed"""
    
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    
    def generate(self, seed_name: str, entities: List[str] = None, supports_cloudinary: bool = False) -> str:
        """Générer un script de seed"""
        template = self.env.get_template('seed.ts.j2')
        
        seed_file = seed_name.lower().replace(' ', '-')
        
        if not entities:
            entities = ['Category', 'Product']
        
        entities_str = ', '.join(entities)
        
        # Générer le code de seed basique
        if entities and len(entities) > 0:
            # Générer du code pour chaque entité
            seed_parts = []
            for entity in entities:
                entity_lower = entity.lower()
                seed_parts.append(f"""
    // Exemple : Créer des {entity_lower}s
    const {entity_lower}Repo = dataSource.getRepository({entity});
    
    const {entity_lower}s = [
      {{
        // TODO: Ajouter les champs de {entity}
      }},
    ];
    
    await {entity_lower}Repo.save({entity_lower}s);
    console.log(`✅ ${{{entity_lower}s.length}} {entity_lower}s créés`);
""")
            seed_code = '\n'.join(seed_parts)
        else:
            seed_code = """
    // Exemple : Créer des catégories
    const categoryRepo = dataSource.getRepository(Category);
    
    const categories = [
      {
        name: 'Adult',
        slug: 'adult',
        description: 'Vêtements pour adultes',
      },
      {
        name: 'Kids',
        slug: 'kids',
        description: 'Vêtements pour enfants',
      },
    ];
    
    await categoryRepo.save(categories);
    console.log(`✅ ${categories.length} catégories créées`);
"""
        
        if supports_cloudinary:
            seed_code += """
    // Support Cloudinary pour les images
    // TODO: Intégrer CloudinaryService si nécessaire
"""
        
        return template.render(
            seed_name=seed_name,
            seed_file=seed_file,
            entities=entities_str,
            seed_code=seed_code,
        )

