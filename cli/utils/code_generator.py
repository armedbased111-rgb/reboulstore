"""
Générateur de code pour entités, DTOs, services, controllers
"""

from pathlib import Path
from jinja2 import Environment, FileSystemLoader, Template
from typing import Dict, List, Optional

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

class EntityGenerator:
    """Générer une entité TypeORM"""
    
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    
    def generate(self, name: str, fields: List[Dict], relations: Optional[List[Dict]] = None) -> str:
        """Générer le code d'une entité"""
        template = self.env.get_template('entity.ts.j2')
        
        entity_name = name.capitalize()
        table_name = name.lower() + 's'
        
        # Préparer les imports pour les relations
        imports = set()
        import_paths = {}
        if relations:
            for rel in relations:
                if 'target' in rel:
                    imports.add(rel['target'])
                    import_paths[rel['target']] = f"./{rel['target'].lower()}.entity"
        
        return template.render(
            entity_name=entity_name,
            table_name=table_name,
            fields=fields,
            relations=relations or [],
            imports=list(imports),
            import_paths=import_paths,
        )

class DTOGenerator:
    """Générer des DTOs"""
    
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    
    def generate_create(self, entity_name: str, fields: List[Dict]) -> str:
        """Générer un CreateDto"""
        template = self.env.get_template('create-dto.ts.j2')
        
        # Mapper les types vers les validateurs
        validator_map = {
            'string': 'IsString',
            'text': 'IsString',
            'number': 'IsNumber',
            'uuid': 'IsUUID',
            'jsonb': 'IsArray',
        }
        
        dto_fields = []
        validators = set(['IsNotEmpty', 'IsOptional'])
        
        for field in fields:
            # Ignorer id, createdAt, updatedAt
            if field['name'] in ['id', 'createdAt', 'updatedAt']:
                continue
            
            validator = validator_map.get(field['type'], 'IsString')
            validators.add(validator)
            
            dto_fields.append({
                'name': field['name'],
                'ts_type': field['ts_type'],
                'validator': validator,
                'required': not field.get('nullable', False),
                'description': field.get('description', field['name']),
            })
        
        entity_name_cap = entity_name.capitalize()
        entity_name_lower = entity_name.lower()
        
        return template.render(
            entity_name=entity_name_cap,
            entity_name_lower=entity_name_lower,
            fields=dto_fields,
            validators=sorted(validators),
        )
    
    def generate_update(self, entity_name: str) -> str:
        """Générer un UpdateDto"""
        template = self.env.get_template('update-dto.ts.j2')
        
        entity_name_cap = entity_name.capitalize()
        entity_name_lower = entity_name.lower()
        
        return template.render(
            entity_name=entity_name_cap,
            entity_name_lower=entity_name_lower,
        )

class ServiceGenerator:
    """Générer un service NestJS"""
    
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    
    def generate(self, entity_name: str, relations: Optional[List[Dict]] = None) -> str:
        """Générer le code d'un service"""
        template = self.env.get_template('service.ts.j2')
        
        entity_name_cap = entity_name.capitalize()
        entity_name_lower = entity_name.lower()
        
        return template.render(
            entity_name=entity_name_cap,
            entity_name_lower=entity_name_lower,
            has_bad_request=False,  # À améliorer selon les besoins
            has_relations=bool(relations),
            relations=relations or [],
        )

class ControllerGenerator:
    """Générer un controller NestJS"""
    
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    
    def generate(self, entity_name: str) -> str:
        """Générer le code d'un controller"""
        template = self.env.get_template('controller.ts.j2')
        
        entity_name_cap = entity_name.capitalize()
        entity_name_lower = entity_name.lower()
        route_name = entity_name_lower + 's'  # Plural
        
        return template.render(
            entity_name=entity_name_cap,
            entity_name_lower=entity_name_lower,
            route_name=route_name,
        )

class ModuleGenerator:
    """Générer un module NestJS"""
    
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    
    def generate(self, entity_name: str) -> str:
        """Générer le code d'un module"""
        template = self.env.get_template('module.ts.j2')
        
        entity_name_cap = entity_name.capitalize()
        entity_name_lower = entity_name.lower()
        
        return template.render(
            entity_name=entity_name_cap,
            entity_name_lower=entity_name_lower,
        )

class HookGenerator:
    """Générer un hook React"""
    
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    
    def generate(self, entity_name: str) -> str:
        """Générer le code d'un hook React"""
        template = self.env.get_template('hook.ts.j2')
        
        entity_name_cap = entity_name.capitalize()
        entity_name_lower = entity_name.lower()
        service_function = f"get{entity_name_cap}s"
        service_name = entity_name_lower + "s"
        entity_type = entity_name_cap
        query_type = f"{entity_name_cap}Query"
        response_type = f"Paginated{entity_name_cap}sResponse"
        
        return template.render(
            entity_name=entity_name_cap,
            entity_name_lower=entity_name_lower,
            service_function=service_function,
            service_name=service_name,
            entity_type=entity_type,
            query_type=query_type,
            response_type=response_type,
        )

class APIServiceGenerator:
    """Générer un service API"""
    
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    
    def generate(self, entity_name: str) -> str:
        """Générer le code d'un service API"""
        template = self.env.get_template('api-service.ts.j2')
        
        entity_name_cap = entity_name.capitalize()
        entity_name_lower = entity_name.lower()
        route_name = entity_name_lower + "s"
        entity_type = entity_name_cap
        query_type = f"{entity_name_cap}Query"
        response_type = f"Paginated{entity_name_cap}sResponse"
        
        return template.render(
            entity_name=entity_name_cap,
            entity_name_lower=entity_name_lower,
            route_name=route_name,
            entity_type=entity_type,
            query_type=query_type,
            response_type=response_type,
        )

class AnimationGenerator:
    """Générer une animation AnimeJS"""
    
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    
    def generate(self, animation_name: str, animation_type: str = "fade-in") -> str:
        """Générer le code d'une animation GSAP"""
        template = self.env.get_template('animation.ts.j2')
        
        # Convertir kebab-case en PascalCase
        animation_name_pascal = ''.join(word.capitalize() for word in animation_name.split('-'))
        
        # Définir les propriétés selon le type (syntaxe AnimeJS : [from, to])
        animation_configs = {
            "fade-in": {
                "description": "Fait apparaître un élément en fondu (opacity: 0 → 1)",
                "from_props": "opacity: [0, 1]",
            },
            "slide-up": {
                "description": "Fait glisser un élément vers le haut avec fondu",
                "from_props": "opacity: [0, 1],\n    translateY: [50, 0]",
            },
            "slide-down": {
                "description": "Fait glisser un élément vers le bas avec fondu",
                "from_props": "opacity: [0, 1],\n    translateY: [-50, 0]",
            },
            "scale": {
                "description": "Fait apparaître un élément avec un effet de zoom",
                "from_props": "opacity: [0, 1],\n    scale: [0.8, 1]",
            },
        }
        
        config = animation_configs.get(animation_type, animation_configs["fade-in"])
        
        return template.render(
            animation_name=animation_name,
            AnimationName=animation_name_pascal,
            description=config["description"],
            from_props=config["from_props"],
        )

class PageGenerator:
    """Générer une page React"""
    
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    
    def generate(self, page_name: str, entity_name: str = None) -> str:
        """Générer le code d'une page React"""
        template = self.env.get_template('page.tsx.j2')
        
        # Si entity_name n'est pas fourni, l'extraire du page_name
        if not entity_name:
            # Exemple: "Orders" -> "Order", "ProductList" -> "Product"
            entity_name = page_name.replace("List", "").replace("s", "")
        
        entity_name_cap = entity_name.capitalize()
        entity_name_lower = entity_name.lower()
        page_name_cap = page_name
        # Convertir PascalCase en titre
        import re
        page_title = re.sub(r'([A-Z])', r' \1', page_name).strip()
        description = f"Gestion des {entity_name_lower}s"
        
        return template.render(
            page_name=page_name_cap,
            page_title=page_title,
            entity_name=entity_name_cap,
            entity_name_lower=entity_name_lower,
            description=description,
        )

class ShadcnComponentGenerator:
    """Générer un composant basé sur shadcn/ui"""
    
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    
    def generate(self, component_name: str, variants: Dict = None) -> str:
        """Générer le code d'un composant shadcn/ui"""
        template = self.env.get_template('shadcn-component.tsx.j2')
        
        component_name_lower = component_name.lower()
        
        # Classes par défaut (style A-COLD-WALL*)
        base_classes = "inline-flex items-center justify-center transition-colors"
        default_variant = "bg-black text-white hover:bg-gray-800"
        secondary_variant = "bg-gray-100 text-black hover:bg-gray-200"
        outline_variant = "border border-black bg-transparent hover:bg-gray-50"
        ghost_variant = "hover:bg-gray-100"
        
        default_size = "h-10 px-4 py-2"
        sm_size = "h-8 px-3 py-1 text-sm"
        lg_size = "h-12 px-6 py-3"
        
        # Utiliser les variants fournis ou les defaults
        if variants:
            base_classes = variants.get('base', base_classes)
            default_variant = variants.get('default', default_variant)
            secondary_variant = variants.get('secondary', secondary_variant)
            outline_variant = variants.get('outline', outline_variant)
            ghost_variant = variants.get('ghost', ghost_variant)
            default_size = variants.get('size_default', default_size)
            sm_size = variants.get('size_sm', sm_size)
            lg_size = variants.get('size_lg', lg_size)
        
        description = f"Composant {component_name} avec variants shadcn/ui"
        
        return template.render(
            component_name=component_name,
            component_name_lower=component_name_lower,
            base_classes=base_classes,
            default_variant_classes=default_variant,
            secondary_variant_classes=secondary_variant,
            outline_variant_classes=outline_variant,
            ghost_variant_classes=ghost_variant,
            default_size_classes=default_size,
            sm_size_classes=sm_size,
            lg_size_classes=lg_size,
            description=description,
        )

