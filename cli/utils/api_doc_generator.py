"""
Générateur de documentation API
Extrait les endpoints des controllers NestJS et génère de la documentation
"""

from pathlib import Path
from typing import Dict, List, Optional
import re
import json
from datetime import datetime


def _get_backend_path() -> Optional[Path]:
    """Trouver le chemin du dossier backend"""
    base = Path(__file__).parent.parent.parent
    backend = base / "backend"
    if backend.exists():
        return backend
    fallback = base.parent / "backend"
    return fallback if fallback.exists() else None


def _extract_controller_info(controller_file: Path) -> Optional[Dict]:
    """Extraire les informations d'un controller"""
    try:
        content = controller_file.read_text(encoding='utf-8')
    except Exception:
        return None
    
    # Extraire le nom du controller et la route de base
    controller_match = re.search(r"@Controller\(['\"]([^'\"]+)['\"]\)", content)
    if not controller_match:
        return None
    
    base_route = controller_match.group(1)
    controller_name = controller_file.stem.replace('.controller', '')
    
    # Extraire les endpoints
    endpoints = []
    
    # Pattern pour trouver les méthodes HTTP avec leurs routes
    # @Get(':id/images') ou @Get() ou @Post('register')
    http_methods = ['Get', 'Post', 'Put', 'Patch', 'Delete', 'Options', 'Head']
    
    for method in http_methods:
        # Pattern: @Get('route') ou @Get() ou @Get(':id')
        pattern = rf"@({method})\s*\(['\"]?([^'\"\)]*)?['\"]?\)"
        matches = re.finditer(pattern, content)
        
        for match in matches:
            route = match.group(2) if match.group(2) else ''
            method_name = method.upper()
            
            # Trouver la méthode TypeScript associée (la fonction qui suit)
            # Chercher après le décorateur jusqu'à la prochaine méthode ou fin de classe
            start_pos = match.end()
            
            # Chercher le nom de la méthode en gérant :
            # - Plusieurs décorateurs entre @Get/@Post et la méthode (@UseGuards, @HttpCode, etc.)
            # - Le mot-clé async optionnel
            # - Les méthodes sur plusieurs lignes
            
            # Mots-clés à ignorer (ce ne sont pas des noms de méthodes)
            keywords_to_ignore = {'if', 'for', 'while', 'switch', 'try', 'catch', 'return', 'throw', 'const', 'let', 'var', 'this', 'async'}
            
            # Approche en deux étapes :
            # 1. Chercher "async methodName(" ou "methodName(" suivi de @Param/@Body
            # 2. Vérifier que c'est bien une déclaration (pas un appel)
            
            handler_name = 'unknown'
            
            # Limiter la recherche jusqu'au prochain décorateur HTTP pour éviter de prendre la mauvaise méthode
            next_decorator_match = re.search(r'@(?:Get|Post|Put|Patch|Delete|Options|Head)\s*\(', content[start_pos:start_pos+2000])
            if next_decorator_match:
                search_limit = start_pos + next_decorator_match.start()
            else:
                search_limit = start_pos + 2000
            
            search_window = content[start_pos:search_limit]
            
            # Pattern 1: async methodName(@Param ou @Body...)
            pattern1 = r'async\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*@(?:Param|Body|Query|Request|Response|UploadedFile|UploadedFiles)'
            match1 = re.search(pattern1, search_window, re.MULTILINE)
            if match1:
                potential_name = match1.group(1)
                if potential_name not in keywords_to_ignore:
                    handler_name = potential_name
            
            # Pattern 2: methodName(@Param ou @Body...) sans async
            if handler_name == 'unknown':
                pattern2 = r'^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*@(?:Param|Body|Query|Request|Response|UploadedFile|UploadedFiles)'
                match2 = re.search(pattern2, search_window, re.MULTILINE)
                if match2:
                    potential_name = match2.group(1)
                    if potential_name not in keywords_to_ignore:
                        handler_name = potential_name
            
            # Pattern 3: Fallback - chercher simplement async methodName( ou methodName(
            # On prend la PREMIÈRE occurrence valide dans la fenêtre limitée
            if handler_name == 'unknown':
                pattern3 = r'(?:async\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\s*\('
                match3 = re.search(pattern3, search_window, re.MULTILINE)
                if match3:
                    potential_name = match3.group(1)
                    if potential_name not in keywords_to_ignore:
                        # Vérifier que ce n'est pas un appel (pas de "this." ou "=" avant)
                        match_start = start_pos + match3.start()
                        context_before = content[max(0, match_start-30):match_start]
                        if not re.search(r'(?:this\.|=\s*)$', context_before.strip()):
                            handler_name = potential_name
            
            # Extraire les paramètres
            # Chercher directement dans le contenu après le décorateur HTTP
            params = []
            body_dto = None
            query_params = []
            path_params = []
            
            # Chercher la signature de la méthode (handler_name suivi de paramètres)
            # Chercher dans une fenêtre plus large pour gérer les décorateurs entre @Post et la méthode
            search_window = content[start_pos:start_pos+2000]
            
            # Chercher directement @Body, @Param, @Query dans la fenêtre (plus fiable)
            # Extraire @Body directement
            body_match = re.search(r"@Body\(\)\s+(\w+):\s*(\w+)", search_window)
            if body_match:
                var_name = body_match.group(1)
                dto_name = body_match.group(2)
                body_dto = dto_name
                params.append(f"{var_name}: {dto_name}")
            
            # Chercher la signature complète pour @Param et @Query (avec gestion des parenthèses)
            method_signature_pattern = rf"{re.escape(handler_name)}\s*\("
            method_start = re.search(method_signature_pattern, search_window)
            if method_start:
                # Trouver la fin des paramètres en comptant les parenthèses
                param_start = start_pos + method_start.end()
                paren_count = 1
                param_end = param_start
                for i, char in enumerate(content[param_start:param_start+500]):
                    if char == '(':
                        paren_count += 1
                    elif char == ')':
                        paren_count -= 1
                        if paren_count == 0:
                            param_end = param_start + i
                            break
                
                params_str = content[param_start:param_end]
                
                if params_str:
                
                    # Extraire @Param
                    param_matches = re.findall(r"@Param\(['\"]?(\w+)['\"]?\)\s+(\w+):", params_str)
                    for param_name, var_name in param_matches:
                        path_params.append(param_name)
                        params.append(f"{var_name}: string")
                    
                    # Extraire @Body si pas déjà trouvé
                    if not body_dto:
                        body_match = re.search(r"@Body\(\)\s+(\w+):\s*(\w+)", params_str)
                        if body_match:
                            var_name = body_match.group(1)
                            dto_name = body_match.group(2)
                            body_dto = dto_name
                            params.append(f"{var_name}: {dto_name}")
                    
                    # Extraire @Query
                    query_match = re.search(r"@Query\(\)\s+(\w+):\s*(\w+)", params_str)
                    if query_match:
                        var_name = query_match.group(1)
                        query_dto = query_match.group(2)
                        query_params.append(query_dto)
                        params.append(f"{var_name}: {query_dto}")
            
            # Extraire les décorateurs supplémentaires
            decorators = []
            
            # @HttpCode
            http_code_match = re.search(r"@HttpCode\(HttpStatus\.(\w+)\)", content[start_pos:start_pos+200])
            if http_code_match:
                decorators.append(f"HttpCode({http_code_match.group(1)})")
            
            # @UseGuards
            guards_match = re.findall(r"@UseGuards\((\w+)\)", content[start_pos:start_pos+200])
            for guard in guards_match:
                decorators.append(f"UseGuards({guard})")
            
            # @UseInterceptors
            interceptors_match = re.findall(r"@UseInterceptors\(([^)]+)\)", content[start_pos:start_pos+200])
            for interceptor in interceptors_match:
                decorators.append(f"UseInterceptors({interceptor})")
            
            # Construire la route complète
            full_route = f"/{base_route}"
            if route:
                if route.startswith('/'):
                    full_route = route
                else:
                    full_route = f"{full_route}/{route}"
            
            endpoints.append({
                'method': method_name,
                'route': full_route,
                'handler': handler_name,
                'params': params,
                'body_dto': body_dto,
                'query_params': query_params,
                'path_params': path_params,
                'decorators': decorators,
            })
    
    return {
        'name': controller_name,
        'base_route': f"/{base_route}",
        'endpoints': endpoints,
    }


def _extract_dto_fields(dto_file: Path) -> Optional[Dict]:
    """Extraire les champs d'un DTO"""
    try:
        content = dto_file.read_text(encoding='utf-8')
    except Exception:
        return None
    
    # Chercher la classe DTO
    class_match = re.search(r'export class (\w+)', content)
    if not class_match:
        return None
    
    dto_name = class_match.group(1)
    fields = []
    
    # Extraire les champs avec leurs types et validations
    # Pattern: fieldName: type; ou fieldName?: type;
    field_pattern = r'(\w+)\??\s*:\s*([^;]+);'
    field_matches = re.finditer(field_pattern, content)
    
    for field_match in field_matches:
        field_name = field_match.group(1)
        field_type = field_match.group(2).strip()
        is_optional = '?' in field_match.group(0)
        
        # Chercher les décorateurs de validation avant le champ
        field_start = field_match.start()
        context_before = content[max(0, field_start-200):field_start]
        
        validations = []
        if '@IsNotEmpty()' in context_before or '@IsRequired()' in context_before:
            validations.append('required')
        if '@IsOptional()' in context_before:
            validations.append('optional')
        if '@IsEmail()' in context_before:
            validations.append('email')
        if '@MinLength(' in context_before:
            min_match = re.search(r'@MinLength\((\d+)\)', context_before)
            if min_match:
                validations.append(f'minLength: {min_match.group(1)}')
        if '@Min(' in context_before:
            min_match = re.search(r'@Min\((\d+)\)', context_before)
            if min_match:
                validations.append(f'min: {min_match.group(1)}')
        if '@IsUUID()' in context_before:
            validations.append('uuid')
        if '@IsNumber()' in context_before:
            validations.append('number')
        if '@IsString()' in context_before:
            validations.append('string')
        if '@IsArray()' in context_before:
            validations.append('array')
        
        fields.append({
            'name': field_name,
            'type': field_type,
            'optional': is_optional or 'optional' in validations,
            'validations': validations,
        })
    
    return {
        'name': dto_name,
        'fields': fields,
    }


def _find_dto_file(backend_path: Path, dto_name: str) -> Optional[Path]:
    """Trouver le fichier DTO"""
    # Chercher dans tous les modules
    modules_dir = backend_path / "src" / "modules"
    if not modules_dir.exists():
        return None
    
    # Convertir CreateProductDto -> create-product.dto.ts
    # ou UpdateProductDto -> update-product.dto.ts
    dto_name_clean = dto_name.replace('Dto', '').replace('DTO', '')
    # Convertir PascalCase en kebab-case
    import re as re_module
    kebab_name = re_module.sub(r'(?<!^)(?=[A-Z])', '-', dto_name_clean).lower()
    dto_file_name = f"{kebab_name}.dto.ts"
    
    for module_dir in modules_dir.iterdir():
        if module_dir.is_dir():
            dto_dir = module_dir / "dto"
            if dto_dir.exists():
                # Chercher le fichier DTO avec le nom kebab-case
                dto_file = dto_dir / dto_file_name
                if dto_file.exists():
                    return dto_file
                # Fallback: chercher tous les fichiers DTO et comparer le nom de classe
                for dto_file_path in dto_dir.glob("*.dto.ts"):
                    try:
                        content = dto_file_path.read_text(encoding='utf-8')
                        class_match = re.search(r'export class (\w+)', content)
                        if class_match and class_match.group(1) == dto_name:
                            return dto_file_path
                    except Exception:
                        continue
    
    return None


def _generate_request_example(method: str, route: str, endpoint: Dict, base_url: str = "http://localhost:3000") -> str:
    """Générer un exemple de requête curl"""
    url = f"{base_url}{route}"
    
    # Remplacer les paramètres path par des exemples
    example_url = route
    for param in endpoint.get('path_params', []):
        if param == 'id':
            example_url = example_url.replace(f':{param}', '123e4567-e89b-12d3-a456-426614174000')
        elif param == 'slug':
            example_url = example_url.replace(f':{param}', 'example-slug')
        else:
            example_url = example_url.replace(f':{param}', f'example-{param}')
    
    full_url = f"{base_url}{example_url}"
    
    curl_parts = [f"curl -X {method}"]
    
    # Headers
    if endpoint.get('body_dto'):
        curl_parts.append('-H "Content-Type: application/json"')
    
    # Auth si UseGuards
    if any('UseGuards' in d for d in endpoint.get('decorators', [])):
        curl_parts.append('-H "Authorization: Bearer YOUR_TOKEN"')
    
    # Body
    if endpoint.get('body_dto'):
        # Générer un exemple de body basique
        body_example = "{\n"
        dto_name = endpoint['body_dto']
        backend_path = _get_backend_path()
        if backend_path:
            dto_file = _find_dto_file(backend_path, dto_name)
            if dto_file:
                dto_info = _extract_dto_fields(dto_file)
                if dto_info:
                    for field in dto_info['fields']:
                        if not field['optional']:
                            if 'uuid' in field['validations']:
                                body_example += f'  "{field["name"]}": "123e4567-e89b-12d3-a456-426614174000",\n'
                            elif 'number' in field['validations']:
                                body_example += f'  "{field["name"]}": 0,\n'
                            elif 'email' in field['validations']:
                                body_example += f'  "{field["name"]}": "user@example.com",\n'
                            else:
                                body_example += f'  "{field["name"]}": "string",\n'
        body_example = body_example.rstrip(',\n') + "\n}"
        curl_parts.append(f"-d '{body_example}'")
    elif method in ['POST', 'PUT', 'PATCH']:
        curl_parts.append('-d "{}"')
    
    curl_parts.append(f'"{full_url}"')
    
    return " \\\n  ".join(curl_parts)


def _generate_openapi_spec(controllers_info: List[Dict], base_url: str = "http://localhost:3000") -> Dict:
    """Générer une spécification OpenAPI 3.0"""
    paths = {}
    
    for controller_info in controllers_info:
        for endpoint in controller_info['endpoints']:
            method = endpoint['method'].lower()
            route = endpoint['route']
            
            # Normaliser la route pour OpenAPI (remplacer :param par {param})
            openapi_route = re.sub(r':(\w+)', r'{\1}', route)
            
            if openapi_route not in paths:
                paths[openapi_route] = {}
            
            operation = {
                'summary': f"{endpoint['handler']}",
                'operationId': endpoint['handler'],
                'tags': [controller_info['name'].capitalize()],
            }
            
            # Parameters
            parameters = []
            for param in endpoint.get('path_params', []):
                parameters.append({
                    'name': param,
                    'in': 'path',
                    'required': True,
                    'schema': {'type': 'string'},
                })
            
            if endpoint.get('query_params'):
                for query_dto in endpoint['query_params']:
                    parameters.append({
                        'name': 'query',
                        'in': 'query',
                        'required': False,
                        'schema': {'type': 'object'},
                    })
            
            if parameters:
                operation['parameters'] = parameters
            
            # Request body
            if endpoint.get('body_dto'):
                operation['requestBody'] = {
                    'required': True,
                    'content': {
                        'application/json': {
                            'schema': {
                                '$ref': f"#/components/schemas/{endpoint['body_dto']}"
                            }
                        }
                    }
                }
            
            # Responses
            operation['responses'] = {
                '200': {'description': 'Success'},
            }
            if method == 'post':
                operation['responses']['201'] = {'description': 'Created'}
            if method == 'delete':
                operation['responses']['204'] = {'description': 'No Content'}
            
            # Security
            if any('UseGuards' in d for d in endpoint.get('decorators', [])):
                operation['security'] = [{'bearerAuth': []}]
            
            paths[openapi_route][method] = operation
    
    spec = {
        'openapi': '3.0.0',
        'info': {
            'title': 'Reboul Store API',
            'version': '1.0.0',
            'description': 'API documentation for Reboul Store backend',
        },
        'servers': [
            {'url': base_url, 'description': 'Development server'},
        ],
        'paths': paths,
        'components': {
            'securitySchemes': {
                'bearerAuth': {
                    'type': 'http',
                    'scheme': 'bearer',
                    'bearerFormat': 'JWT',
                }
            },
            'schemas': {},
        },
    }
    
    return spec


def _find_all_controllers(backend_path: Path) -> List[Path]:
    """Trouver tous les controllers"""
    controllers = []
    modules_dir = backend_path / "src" / "modules"
    
    if not modules_dir.exists():
        return controllers
    
    for module_dir in modules_dir.iterdir():
        if module_dir.is_dir():
            controller_file = module_dir / f"{module_dir.name}.controller.ts"
            if controller_file.exists():
                controllers.append(controller_file)
    
    # Ajouter le controller principal si existe
    app_controller = backend_path / "src" / "app.controller.ts"
    if app_controller.exists():
        controllers.append(app_controller)
    
    return sorted(controllers)


def generate_api_documentation(output_path: Optional[Path] = None) -> str:
    """Générer la documentation API complète"""
    backend_path = _get_backend_path()
    if not backend_path:
        return None
    
    controllers_files = _find_all_controllers(backend_path)
    
    if not controllers_files:
        return None
    
    # Extraire les informations de tous les controllers
    controllers_info = []
    for controller_file in controllers_files:
        info = _extract_controller_info(controller_file)
        if info:
            controllers_info.append(info)
    
    # Générer le Markdown
    md_content = f"""# Documentation API - Reboul Store

> Documentation générée automatiquement le {datetime.now().strftime('%d/%m/%Y à %H:%M')}

## Vue d'ensemble

Cette documentation liste tous les endpoints disponibles dans l'API backend.

**Total** : {sum(len(c['endpoints']) for c in controllers_info)} endpoints dans {len(controllers_info)} controllers

---

"""
    
    # Générer la documentation par controller
    for controller_info in sorted(controllers_info, key=lambda x: x['name']):
        controller_name = controller_info['name']
        base_route = controller_info['base_route']
        endpoints = controller_info['endpoints']
        
        md_content += f"## {controller_name.capitalize()} Controller\n\n"
        md_content += f"**Route de base** : `{base_route}`\n\n"
        
        if not endpoints:
            md_content += "*Aucun endpoint trouvé*\n\n"
            continue
        
        # Tableau des endpoints
        md_content += "| Méthode | Route | Handler | Paramètres |\n"
        md_content += "|---------|-------|---------|------------|\n"
        
        for endpoint in endpoints:
            method = endpoint['method']
            route = endpoint['route']
            handler = endpoint['handler']
            params_str = ", ".join(endpoint['params']) if endpoint['params'] else "-"
            
            md_content += f"| `{method}` | `{route}` | `{handler}()` | {params_str} |\n"
        
        md_content += "\n### Détails des endpoints\n\n"
        
        for endpoint in endpoints:
            method = endpoint['method']
            route = endpoint['route']
            handler = endpoint['handler']
            
            md_content += f"#### `{method} {route}`\n\n"
            md_content += f"- **Handler** : `{handler}()`\n"
            
            if endpoint['path_params']:
                md_content += f"- **Path Parameters** : {', '.join(endpoint['path_params'])}\n"
            
            if endpoint['body_dto']:
                md_content += f"- **Body** : `{endpoint['body_dto']}`\n"
                # Documenter les champs du DTO
                backend_path = _get_backend_path()
                if backend_path:
                    dto_file = _find_dto_file(backend_path, endpoint['body_dto'])
                    if dto_file:
                        dto_info = _extract_dto_fields(dto_file)
                        if dto_info and dto_info['fields']:
                            md_content += f"\n  **Champs du DTO `{endpoint['body_dto']}`** :\n\n"
                            md_content += "  | Champ | Type | Requis | Validations |\n"
                            md_content += "  |-------|------|--------|-------------|\n"
                            for field in dto_info['fields']:
                                required = "✅" if not field['optional'] else "❌"
                                validations = ", ".join(field['validations']) if field['validations'] else "-"
                                md_content += f"  | `{field['name']}` | `{field['type']}` | {required} | {validations} |\n"
                            md_content += "\n"
            
            if endpoint['query_params']:
                md_content += f"- **Query Parameters** : {', '.join(endpoint['query_params'])}\n"
            
            if endpoint['decorators']:
                md_content += f"- **Decorators** : {', '.join(endpoint['decorators'])}\n"
            
            # Exemple de requête
            md_content += f"- **Exemple de requête** :\n\n"
            md_content += "  ```bash\n"
            md_content += f"  {_generate_request_example(method, route, endpoint)}\n"
            md_content += "  ```\n\n"
            
            md_content += "\n"
        
        md_content += "---\n\n"
    
    # Sauvegarder si un chemin est fourni
    if output_path:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(md_content, encoding='utf-8')
        
        # Générer aussi le fichier OpenAPI/Swagger
        openapi_path = output_path.parent / "openapi.json"
        openapi_spec = _generate_openapi_spec(controllers_info)
        openapi_path.write_text(json.dumps(openapi_spec, indent=2, ensure_ascii=False), encoding='utf-8')
    
    return md_content

