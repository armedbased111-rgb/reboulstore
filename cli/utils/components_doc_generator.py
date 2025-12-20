"""
Générateur de documentation pour les composants React et hooks
Extrait les props, les hooks et génère de la documentation
"""

from pathlib import Path
from typing import Dict, List, Optional
import re
from datetime import datetime


def _get_frontend_path() -> Optional[Path]:
    """Trouver le chemin du dossier frontend"""
    base = Path(__file__).parent.parent.parent
    frontend = base / "frontend"
    if frontend.exists():
        return frontend
    fallback = base.parent / "frontend"
    return fallback if fallback.exists() else None


def _extract_component_props(component_file: Path) -> Optional[Dict]:
    """Extraire les props d'un composant React"""
    try:
        content = component_file.read_text(encoding='utf-8')
    except Exception:
        return None
    
    # Chercher le nom du composant (export const ComponentName ou export function ComponentName)
    # Priorité : export const ComponentName = ...
    component_match = re.search(r'export\s+const\s+(\w+)\s*=', content)
    if not component_match:
        # Fallback : export function ComponentName
        component_match = re.search(r'export\s+function\s+(\w+)', content)
    if not component_match:
        return None
    
    component_name = component_match.group(1)
    
    # Ignorer les noms qui ne sont pas des composants valides
    if component_name.lower() in ['title', 'default', 'type', 'interface']:
        return None
    
    # Chercher l'interface des props (interface ComponentNameProps ou Props)
    props_interfaces = []
    
    # Pattern 1: interface ComponentNameProps
    props_pattern1 = rf'interface\s+(\w*{component_name}\w*Props)\s*{{([^}}]+)}}'
    match1 = re.search(props_pattern1, content, re.DOTALL)
    if match1:
        props_interfaces.append({
            'name': match1.group(1),
            'content': match1.group(2),
        })
    
    # Pattern 2: interface Props (générique)
    props_pattern2 = r'interface\s+Props\s*{([^}]+)}'
    match2 = re.search(props_pattern2, content, re.DOTALL)
    if match2:
        props_interfaces.append({
            'name': 'Props',
            'content': match2.group(1),
        })
    
    # Pattern 3: type ComponentNameProps = { ... }
    props_pattern3 = rf'type\s+(\w*{component_name}\w*Props)\s*=\s*{{([^}}]+)}}'
    match3 = re.search(props_pattern3, content, re.DOTALL)
    if match3:
        props_interfaces.append({
            'name': match3.group(1),
            'content': match3.group(2),
        })
    
    if not props_interfaces:
        return {
            'name': component_name,
            'props': [],
            'has_props': False,
        }
    
    # Extraire les champs de la première interface trouvée
    props_interface = props_interfaces[0]
    props_content = props_interface['content']
    
    # Extraire les champs (fieldName: type; ou fieldName?: type;)
    props = []
    field_pattern = r'(\w+)\??\s*:\s*([^;]+);'
    field_matches = re.finditer(field_pattern, props_content)
    
    for field_match in field_matches:
        field_name = field_match.group(1)
        field_type = field_match.group(2).strip()
        is_optional = '?' in field_match.group(0)
        
        props.append({
            'name': field_name,
            'type': field_type,
            'optional': is_optional,
        })
    
    # Extraire la documentation JSDoc si présente
    jsdoc_match = re.search(r'/\*\*([^*]|(?:\*(?!/)))*\*/', content, re.DOTALL)
    description = None
    if jsdoc_match:
        jsdoc = jsdoc_match.group(0)
        # Extraire la description (lignes sans @ et sans *)
        lines = []
        for line in jsdoc.split('\n'):
            cleaned = line.strip().rstrip('*').strip()
            if cleaned and not cleaned.startswith('@') and cleaned != '/' and cleaned != '*/':
                # Nettoyer les balises markdown et les caractères spéciaux
                cleaned = re.sub(r'^\*+\s*', '', cleaned)
                if cleaned:
                    lines.append(cleaned)
        description = ' '.join(lines).strip()
        # Nettoyer les espaces multiples
        description = re.sub(r'\s+', ' ', description)
    
    return {
        'name': component_name,
        'props_interface': props_interface['name'],
        'props': props,
        'has_props': len(props) > 0,
        'description': description,
    }


def _extract_hook_info(hook_file: Path) -> Optional[Dict]:
    """Extraire les informations d'un hook React"""
    try:
        content = hook_file.read_text(encoding='utf-8')
    except Exception:
        return None
    
    # Chercher le nom du hook (export const useHookName)
    hook_match = re.search(r'export\s+const\s+(use\w+)', content)
    if not hook_match:
        return None
    
    hook_name = hook_match.group(1)
    
    # Chercher l'interface de retour (interface UseHookNameReturn)
    return_interface_match = re.search(rf'interface\s+(\w*{hook_name}\w*Return)\s*{{([^}}]+)}}', content, re.DOTALL)
    
    return_values = []
    if return_interface_match:
        return_content = return_interface_match.group(2)
        # Extraire les champs
        field_pattern = r'(\w+)\??\s*:\s*([^;]+);'
        field_matches = re.finditer(field_pattern, return_content)
        
        for field_match in field_matches:
            field_name = field_match.group(1)
            field_type = field_match.group(2).strip()
            is_optional = '?' in field_match.group(0)
            
            return_values.append({
                'name': field_name,
                'type': field_type,
                'optional': is_optional,
            })
    
    # Chercher les paramètres du hook
    # Pattern: export const useHook = (param1: Type1, param2?: Type2): ReturnType => {
    # Chercher dans une fenêtre plus large pour gérer les retours à la ligne
    hook_signature_match = re.search(rf'{re.escape(hook_name)}\s*\(([^)]*)\)\s*:', content, re.DOTALL)
    
    parameters = []
    if hook_signature_match:
        params_str = hook_signature_match.group(1).strip()
        # Si params_str n'est pas vide
        if params_str:
            # Extraire les paramètres (gérer les types complexes avec |, &, etc.)
            # Pattern: paramName?: Type ou paramName: Type
            param_pattern = r'(\w+)\??\s*:\s*([^,)]+(?:\s*[|&]\s*[^,)]+)*)'
            param_matches = re.finditer(param_pattern, params_str)
            
            for param_match in param_matches:
                param_name = param_match.group(1)
                param_type = param_match.group(2).strip()
                is_optional = '?' in param_match.group(0)
                
                parameters.append({
                    'name': param_name,
                    'type': param_type,
                    'optional': is_optional,
                })
    
    # Extraire la documentation JSDoc si présente
    jsdoc_match = re.search(r'/\*\*([^*]|(?:\*(?!/)))*\*/', content, re.DOTALL)
    description = None
    if jsdoc_match:
        jsdoc = jsdoc_match.group(0)
        lines = []
        for line in jsdoc.split('\n'):
            cleaned = line.strip().rstrip('*').strip()
            if cleaned and not cleaned.startswith('@') and cleaned != '/' and cleaned != '*/':
                # Nettoyer les balises markdown et les caractères spéciaux
                cleaned = re.sub(r'^\*+\s*', '', cleaned)
                if cleaned:
                    lines.append(cleaned)
        description = ' '.join(lines).strip()
        # Nettoyer les espaces multiples
        description = re.sub(r'\s+', ' ', description)
    
    return {
        'name': hook_name,
        'parameters': parameters,
        'return_values': return_values,
        'description': description,
    }


def _find_all_components(frontend_path: Path) -> List[Path]:
    """Trouver tous les composants React"""
    components = []
    components_dir = frontend_path / "src" / "components"
    
    if not components_dir.exists():
        return components
    
    # Chercher récursivement tous les fichiers .tsx
    for component_file in components_dir.rglob("*.tsx"):
        # Ignorer les fichiers de test et les fichiers dans node_modules
        if 'test' not in component_file.name.lower() and 'node_modules' not in str(component_file):
            components.append(component_file)
    
    return sorted(components)


def _find_all_hooks(frontend_path: Path) -> List[Path]:
    """Trouver tous les hooks React"""
    hooks = []
    hooks_dir = frontend_path / "src" / "hooks"
    
    if not hooks_dir.exists():
        return hooks
    
    for hook_file in hooks_dir.glob("*.ts"):
        if 'test' not in hook_file.name.lower():
            hooks.append(hook_file)
    
    return sorted(hooks)


def _generate_component_example(component_info: Dict) -> str:
    """Générer un exemple d'utilisation d'un composant"""
    component_name = component_info['name']
    
    if not component_info.get('has_props'):
        return f"<{component_name} />"
    
    # Générer des exemples de props basiques
    props_examples = []
    for prop in component_info['props'][:5]:  # Limiter à 5 props pour l'exemple
        prop_name = prop['name']
        prop_type = prop['type']
        
        # Générer une valeur d'exemple selon le type
        if 'string' in prop_type.lower():
            example_value = f'"{prop_name}"'
        elif 'number' in prop_type.lower() or 'int' in prop_type.lower():
            example_value = "{0}"
        elif 'boolean' in prop_type.lower() or 'bool' in prop_type.lower():
            example_value = "{true}"
        elif 'Product' in prop_type or 'product' in prop_type.lower():
            example_value = "{ product }"
        elif 'CartItem' in prop_type or 'cart' in prop_type.lower():
            example_value = "{ item }"
        elif '()' in prop_type or 'function' in prop_type.lower() or '=>' in prop_type:
            example_value = "{() => {}}"
        else:
            example_value = "{ }"
        
        if prop['optional']:
            # Props optionnelles peuvent être omises
            continue
        
        props_examples.append(f"{prop_name}={example_value}")
    
    props_str = " " + " ".join(props_examples) if props_examples else ""
    return f"<{component_name}{props_str} />"


def _generate_hook_example(hook_info: Dict) -> str:
    """Générer un exemple d'utilisation d'un hook"""
    hook_name = hook_info['name']
    
    # Générer les paramètres
    params = []
    for param in hook_info.get('parameters', []):
        param_name = param['name']
        if param['optional']:
            params.append(f"{param_name}={{}}")
        else:
            params.append(param_name)
    
    params_str = ", ".join(params) if params else ""
    
    # Générer la destructuration des valeurs de retour
    return_vars = [rv['name'] for rv in hook_info.get('return_values', [])[:5]]  # Limiter à 5
    if return_vars:
        return_str = ", ".join(return_vars)
    else:
        # Si pas de valeurs de retour documentées, utiliser des noms génériques
        return_str = "data, loading, error"
    
    return f"const {{{return_str}}} = {hook_name}({params_str});"


def generate_components_documentation(output_path: Optional[Path] = None) -> str:
    """Générer la documentation complète des composants et hooks"""
    frontend_path = _get_frontend_path()
    if not frontend_path:
        return None
    
    components_files = _find_all_components(frontend_path)
    hooks_files = _find_all_hooks(frontend_path)
    
    if not components_files and not hooks_files:
        return None
    
    # Extraire les informations
    components_info = []
    for component_file in components_files:
        info = _extract_component_props(component_file)
        if info:
            # Ajouter le chemin relatif
            info['path'] = str(component_file.relative_to(frontend_path / "src"))
            components_info.append(info)
    
    hooks_info = []
    for hook_file in hooks_files:
        info = _extract_hook_info(hook_file)
        if info:
            info['path'] = str(hook_file.relative_to(frontend_path / "src"))
            hooks_info.append(info)
    
    # Générer le Markdown
    md_content = f"""# Documentation Composants & Hooks - Reboul Store

> Documentation générée automatiquement le {datetime.now().strftime('%d/%m/%Y à %H:%M')}

## Vue d'ensemble

Cette documentation liste tous les composants React et hooks disponibles dans le frontend.

**Total** : {len(components_info)} composants et {len(hooks_info)} hooks

---

## Composants React

"""
    
    # Grouper les composants par dossier
    components_by_dir = {}
    for component in components_info:
        dir_path = '/'.join(component['path'].split('/')[:-1])
        if dir_path not in components_by_dir:
            components_by_dir[dir_path] = []
        components_by_dir[dir_path].append(component)
    
    # Générer la documentation par dossier
    for dir_path in sorted(components_by_dir.keys()):
        dir_name = dir_path.split('/')[-1] if '/' in dir_path else dir_path or 'root'
        md_content += f"### {dir_name.capitalize()}\n\n"
        
        for component in sorted(components_by_dir[dir_path], key=lambda x: x['name']):
            component_name = component['name']
            md_content += f"#### `{component_name}`\n\n"
            
            if component.get('description'):
                md_content += f"{component['description']}\n\n"
            
            md_content += f"- **Fichier** : `{component['path']}`\n"
            
            if component.get('has_props'):
                md_content += f"- **Props Interface** : `{component['props_interface']}`\n\n"
                md_content += "| Prop | Type | Requis |\n"
                md_content += "|------|------|--------|\n"
                
                for prop in component['props']:
                    required = "✅" if not prop['optional'] else "❌"
                    md_content += f"| `{prop['name']}` | `{prop['type']}` | {required} |\n"
                
                md_content += "\n"
            else:
                md_content += "- **Props** : Aucune\n\n"
            
            # Exemple d'utilisation
            example = _generate_component_example(component)
            md_content += f"- **Exemple d'utilisation** :\n\n"
            md_content += "  ```tsx\n"
            md_content += f"  {example}\n"
            md_content += "  ```\n\n"
            
            md_content += "---\n\n"
    
    # Générer la documentation des hooks
    md_content += "## Hooks React\n\n"
    
    for hook in sorted(hooks_info, key=lambda x: x['name']):
        hook_name = hook['name']
        md_content += f"### `{hook_name}`\n\n"
        
        if hook.get('description'):
            md_content += f"{hook['description']}\n\n"
        
        md_content += f"- **Fichier** : `{hook['path']}`\n"
        
        # Paramètres
        if hook.get('parameters'):
            md_content += "\n- **Paramètres** :\n\n"
            md_content += "| Paramètre | Type | Requis |\n"
            md_content += "|-----------|------|--------|\n"
            
            for param in hook['parameters']:
                required = "✅" if not param['optional'] else "❌"
                md_content += f"| `{param['name']}` | `{param['type']}` | {required} |\n"
            
            md_content += "\n"
        else:
            md_content += "- **Paramètres** : Aucun\n\n"
        
        # Valeurs de retour
        if hook.get('return_values'):
            md_content += "- **Valeurs de retour** :\n\n"
            md_content += "| Propriété | Type | Requis |\n"
            md_content += "|-----------|------|--------|\n"
            
            for rv in hook['return_values']:
                required = "✅" if not rv['optional'] else "❌"
                md_content += f"| `{rv['name']}` | `{rv['type']}` | {required} |\n"
            
            md_content += "\n"
        
        # Exemple d'utilisation
        example = _generate_hook_example(hook)
        md_content += f"- **Exemple d'utilisation** :\n\n"
        md_content += "  ```tsx\n"
        md_content += f"  {example}\n"
        md_content += "  ```\n\n"
        
        md_content += "---\n\n"
    
    # Sauvegarder si un chemin est fourni
    if output_path:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(md_content, encoding='utf-8')
    
    return md_content

