"""
Utilitaire pour mettre à jour app.module.ts automatiquement
"""

import re
from pathlib import Path
from typing import Optional

def add_module_to_app_module(module_name: str, app_module_path: Optional[Path] = None) -> bool:
    """
    Ajouter un module à app.module.ts
    
    Args:
        module_name: Nom du module (ex: "ReviewsModule")
        app_module_path: Chemin vers app.module.ts (optionnel)
    
    Returns:
        True si succès, False sinon
    """
    if app_module_path is None:
        # Chercher app.module.ts dans backend/src
        base_path = Path(__file__).parent.parent.parent.parent / "backend" / "src"
        app_module_path = base_path / "app.module.ts"
    
    if not app_module_path.exists():
        return False
    
    content = app_module_path.read_text(encoding='utf-8')
    
    # Vérifier si le module est déjà importé
    import_pattern = rf'import\s+{{\s*{module_name}\s*}}\s+from'
    if re.search(import_pattern, content):
        # Module déjà importé, vérifier s'il est dans imports
        imports_pattern = r'imports:\s*\[(.*?)\]'
        match = re.search(imports_pattern, content, re.DOTALL)
        if match:
            imports_content = match.group(1)
            if module_name in imports_content:
                return True  # Déjà présent
    
    # Ajouter l'import
    # Trouver la dernière ligne d'import de module
    import_lines = []
    last_import_line = 0
    for i, line in enumerate(content.split('\n')):
        if re.match(r'import\s+.*Module.*from.*modules', line):
            import_lines.append((i, line))
            last_import_line = i
    
    if import_lines:
        # Insérer après la dernière ligne d'import
        lines = content.split('\n')
        module_name_lower = module_name.replace('Module', '').lower()
        new_import = f"import {{ {module_name} }} from './modules/{module_name_lower}/{module_name_lower}.module';"
        lines.insert(last_import_line + 1, new_import)
        content = '\n'.join(lines)
    else:
        # Ajouter après CloudinaryModule
        cloudinary_import = "import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';"
        module_name_lower = module_name.replace('Module', '').lower()
        new_import = f"import {{ {module_name} }} from './modules/{module_name_lower}/{module_name_lower}.module';"
        content = content.replace(cloudinary_import, f"{cloudinary_import}\n{new_import}")
    
    # Ajouter dans imports array
    # Trouver la ligne CloudinaryModule dans imports
    imports_pattern = r'(imports:\s*\[[^\]]*CloudinaryModule,?\s*)'
    replacement = rf'\1    {module_name},\n'
    
    if not re.search(imports_pattern, content):
        # Pattern alternatif
        imports_pattern = r'(imports:\s*\[[^\]]*CloudinaryModule\s*)'
        replacement = rf'\1    {module_name},\n'
    
    if re.search(imports_pattern, content):
        content = re.sub(imports_pattern, replacement, content, flags=re.DOTALL)
    else:
        # Ajouter à la fin de la liste
        imports_pattern = r'(imports:\s*\[[^\]]*)(\s*\])'
        replacement = rf'\1    {module_name},\n\2'
        content = re.sub(imports_pattern, replacement, content, flags=re.DOTALL)
    
    # Écrire le fichier
    app_module_path.write_text(content, encoding='utf-8')
    return True

