"""
Outil pour corriger automatiquement les erreurs de build TypeScript
"""

import re
from pathlib import Path
from typing import Dict, List, Tuple

class BuildErrorFixer:
    """Corriger automatiquement les erreurs de build"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent.parent.parent
    
    def fix_all(self, errors: List[str], file_path: Path) -> Tuple[bool, List[str]]:
        """Tenter de corriger toutes les erreurs d'un fichier"""
        if not file_path.exists():
            return False, []
        
        try:
            content = file_path.read_text(encoding='utf-8')
            original_content = content
            fixes_applied = []
            
            # Fix 1: Import type errors (verbatimModuleSyntax)
            content, fixes = self._fix_import_type_errors(content, errors)
            fixes_applied.extend(fixes)
            
            # Fix 2: Unused imports/variables
            content, fixes = self._fix_unused_imports(content, errors)
            fixes_applied.extend(fixes)
            
            # Fix 3: RefObject null issues
            content, fixes = self._fix_refobject_null_issues(content, errors)
            fixes_applied.extend(fixes)
            
            # Fix 4: Lucide props issues
            content, fixes = self._fix_lucide_props(content, errors)
            fixes_applied.extend(fixes)
            
            # Sauvegarder si des corrections ont été faites
            if content != original_content:
                file_path.write_text(content, encoding='utf-8')
                return True, fixes_applied
            
            return False, []
        except Exception as e:
            return False, [f"Erreur lors de la correction: {str(e)}"]
    
    def _fix_import_type_errors(self, content: str, errors: List[str]) -> Tuple[str, List[str]]:
        """Corriger les erreurs d'import type (verbatimModuleSyntax)"""
        fixes = []
        
        # Pattern: 'RefObject' is a type and must be imported using a type-only import
        type_imports_to_fix = set()
        for error in errors:
            match = re.search(r"'(\w+)' is a type and must be imported using a type-only import", error)
            if match:
                type_imports_to_fix.add(match.group(1))
        
        if not type_imports_to_fix:
            return content, fixes
        
        # Remplacer les imports normaux par des imports type
        for type_name in type_imports_to_fix:
            # Pattern: import { ..., TypeName, ... } from '...'
            pattern1 = rf'import\s+{{([^}}]*)\b{re.escape(type_name)}\b([^}}]*)}}\s+from\s+["\']([^"\']+)["\']'
            
            def replace_import(match):
                before = match.group(1).strip()
                after = match.group(2).strip()
                source = match.group(3)
                
                # Nettoyer les virgules
                before_clean = re.sub(r',\s*$', '', before).strip()
                after_clean = re.sub(r'^\s*,', '', after).strip()
                
                # Construire le nouvel import - séparer en deux imports
                other_imports = []
                if before_clean:
                    # Parser les imports avant
                    for imp in before_clean.split(','):
                        imp_clean = imp.strip()
                        if imp_clean and imp_clean != type_name:
                            other_imports.append(imp_clean)
                
                if after_clean:
                    # Parser les imports après
                    for imp in after_clean.split(','):
                        imp_clean = imp.strip()
                        if imp_clean and imp_clean != type_name:
                            other_imports.append(imp_clean)
                
                # Construire les deux imports séparés
                if other_imports:
                    other_imports_str = ', '.join(other_imports)
                    return f'import {{ {other_imports_str} }} from \'{source}\';\nimport type {{ {type_name} }} from \'{source}\';'
                else:
                    return f'import type {{ {type_name} }} from \'{source}\';'
            
            new_content = re.sub(pattern1, replace_import, content)
            if new_content != content:
                content = new_content
                fixes.append(f"Corrigé import type pour {type_name}")
        
        return content, fixes
    
    def _fix_unused_imports(self, content: str, errors: List[str]) -> Tuple[str, List[str]]:
        """Corriger les imports/variables non utilisés"""
        fixes = []
        
        # Pattern: 'X' is declared but its value is never read
        unused_items = set()
        for error in errors:
            match = re.search(r"'(\w+)' is declared but its value is never read", error)
            if match:
                unused_items.add(match.group(1))
        
        if not unused_items:
            return content, fixes
        
        for unused_item in unused_items:
            # Pattern: import { ..., UnusedItem, ... } from '...'
            pattern1 = rf'import\s+{{([^}}]*)\b{re.escape(unused_item)}\b([^}}]*)}}\s+from\s+["\']([^"\']+)["\']'
            
            def remove_unused(match):
                before = match.group(1).strip()
                after = match.group(2).strip()
                source = match.group(3)
                
                # Parser tous les imports
                all_imports = []
                if before:
                    for imp in before.split(','):
                        imp_clean = imp.strip()
                        if imp_clean and imp_clean != unused_item:
                            all_imports.append(imp_clean)
                
                if after:
                    for imp in after.split(','):
                        imp_clean = imp.strip()
                        if imp_clean and imp_clean != unused_item:
                            # Vérifier que ce n'est pas un "as" cassé (ex: "Image as")
                            if imp_clean != 'as':
                                all_imports.append(imp_clean)
                
                # Si c'était le seul import, supprimer toute la ligne
                if not all_imports:
                    return ''
                
                # Sinon, garder les autres imports
                return f'import {{ {", ".join(all_imports)} }} from \'{source}\''
            
            new_content = re.sub(pattern1, remove_unused, content)
            if new_content != content:
                content = new_content
                fixes.append(f"Supprimé import inutilisé: {unused_item}")
            
            # Aussi chercher les imports de type avec type
            pattern2 = rf'import\s+type\s+{{([^}}]*)\b{re.escape(unused_item)}\b([^}}]*)}}\s+from\s+["\']([^"\']+)["\']'
            new_content = re.sub(pattern2, remove_unused, content)
            if new_content != content:
                content = new_content
                fixes.append(f"Supprimé import type inutilisé: {unused_item}")
        
        return content, fixes
    
    def _fix_refobject_null_issues(self, content: str, errors: List[str]) -> Tuple[str, List[str]]:
        """Corriger les problèmes RefObject<Type | null> vs RefObject<Type>"""
        fixes = []
        
        # Chercher les erreurs RefObject null dans le code (pas seulement les erreurs)
        # Pattern: useRef<HTMLDivElement>(null) crée RefObject<HTMLDivElement | null>
        # Mais on veut RefObject<HTMLDivElement>
        
        # Solution: useRef<HTMLDivElement | null>(null) devrait être useRef<HTMLDivElement>(null)
        # Mais le vrai problème est dans le type de retour qui doit accepter null
        
        # Chercher les patterns de type de retour qui doivent accepter null
        # Pattern: ) -> RefObject<HTMLDivElement> avec useRef<HTMLDivElement>(null)
        
        # Pour l'instant, on cherche les erreurs spécifiques dans les messages
        for error in errors:
            if 'RefObject' in error and 'null' in error.lower() and 'not assignable' in error.lower():
                # C'est un problème de type de retour
                # On doit trouver la ligne avec le type de retour et la modifier
                # Pattern: ): RefObject<HTMLDivElement> -> ): RefObject<HTMLDivElement | null>
                pattern = r'(\):\s*RefObject<(\w+)>)'
                def add_null(match):
                    type_name = match.group(2)
                    return f'): RefObject<{type_name} | null>'
                new_content = re.sub(pattern, add_null, content)
                if new_content != content:
                    content = new_content
                    fixes.append("Corrigé type de retour RefObject pour accepter null")
                    break
        
        return content, fixes
    
    def _fix_lucide_props(self, content: str, errors: List[str]) -> Tuple[str, List[str]]:
        """Corriger les props incorrectes pour les composants Lucide"""
        fixes = []
        
        # Chercher les erreurs Lucide props
        has_lucide_error = any('LucideProps' in error or 'SVGSVGElement' in error for error in errors)
        
        if not has_lucide_error:
            return content, fixes
        
        # Pattern: <IconComponent className="..." title="..." />
        # Supprimer les props non supportées comme 'title'
        # Note: Cette correction est plus délicate, on peut seulement suggérer
        # Pour l'instant, on laisse comme suggestion manuelle
        
        return content, fixes

# Export
build_error_fixer = BuildErrorFixer()
