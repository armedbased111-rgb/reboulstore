"""
Commandes pour générer du code
"""

from pathlib import Path
from jinja2 import Template, Environment, FileSystemLoader
import sys

# Ajouter le dossier utils au path
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.code_generator import (
    EntityGenerator,
    DTOGenerator,
    ServiceGenerator,
    ControllerGenerator,
    ModuleGenerator as ModuleCodeGenerator,
    HookGenerator,
    APIServiceGenerator,
    AnimationGenerator,
    PageGenerator as PageCodeGenerator,
    ShadcnComponentGenerator,
)
from utils.entity_parser import parse_entity_file
from utils.component_analyzer import detect_shadcn_imports_in_code

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

class ComponentGenerator:
    """Générer un composant React"""
    
    @staticmethod
    def create(name, domain=None, use_shadcn=False, variants=None, required_components=None):
        """Créer un composant React"""
        component_dir = Path(__file__).parent.parent.parent / "frontend" / "src" / "components"
        
        if domain:
            component_dir = component_dir / domain.lower()
            component_dir.mkdir(parents=True, exist_ok=True)
        
        # Si des composants shadcn sont requis, vérifier/installer automatiquement
        installed_components = []
        if required_components:
            from utils.shadcn_helper import ensure_shadcn_components
            results = ensure_shadcn_components(required_components, auto_install=True)
            
            for comp, info in results.items():
                if info['status'] == 'success' and info['installed']:
                    installed_components.append(comp)
                elif info['status'] == 'already_installed':
                    installed_components.append(comp)
        
        if use_shadcn:
            # Utiliser le template shadcn
            generator = ShadcnComponentGenerator()
            content = generator.generate(name, variants or {})
            
            # Détecter automatiquement les composants shadcn utilisés dans le code généré
            detected_components = detect_shadcn_imports_in_code(content)
            
            # Ajouter aux composants requis si détectés
            if detected_components and not required_components:
                required_components = detected_components
            elif detected_components and required_components:
                # Fusionner sans doublons
                required_components = list(set(required_components + detected_components))
        else:
            # Template de base
            template = """import React from 'react';

interface {{ name }}Props {
  // Props à définir
}

export const {{ name }}: React.FC<{{ name }}Props> = (props) => {
  return (
    <div className="{{ className }}">
      {/* Contenu */}
    </div>
  );
};
"""
        
            t = Template(template)
            # Convertir PascalCase en kebab-case
            import re
            className = re.sub(r'([A-Z])', r'-\1', name).lower().lstrip('-')
            content = t.render(
                name=name,
                className=className
            )
        
        file_path = component_dir / f"{name}.tsx"
        
        # Vérifier si le fichier existe déjà
        if file_path.exists():
            # Ne pas écraser, retourner un message
            return {
                'files': [str(file_path.relative_to(Path(__file__).parent.parent.parent))],
                'warning': f'Fichier {name}.tsx existe déjà (non écrasé)',
                'installed_components': installed_components,
            }
        
        file_path.write_text(content, encoding='utf-8')
        
        return {
            'files': [str(file_path.relative_to(Path(__file__).parent.parent.parent))],
            'installed_components': installed_components,
        }

class EntityGeneratorWrapper:
    """Générer une entité TypeORM"""
    
    @staticmethod
    def create(name, fields=None, relations=None):
        """Créer une entité TypeORM"""
        entities_dir = Path(__file__).parent.parent.parent / "backend" / "src" / "entities"
        entities_dir.mkdir(parents=True, exist_ok=True)
        
        generator = EntityGenerator()
        
        # Si fields non fourni, utiliser des champs par défaut
        if not fields:
            fields = [
                {'name': 'name', 'type': 'string', 'ts_type': 'string', 'length': 255, 'nullable': False, 'unique': False},
            ]
        
        code = generator.generate(name, fields, relations or [])
        
        file_path = entities_dir / f"{name.lower()}.entity.ts"
        file_path.write_text(code, encoding='utf-8')
        
        return [str(file_path.relative_to(Path(__file__).parent.parent.parent))]

class DTOGeneratorWrapper:
    """Générer des DTOs"""
    
    @staticmethod
    def create(entity_name, dto_type='create'):
        """Créer un DTO (create, update)"""
        module_dir = Path(__file__).parent.parent.parent / "backend" / "src" / "modules" / entity_name.lower()
        dto_dir = module_dir / "dto"
        dto_dir.mkdir(parents=True, exist_ok=True)
        
        generator = DTOGenerator()
        
        # Essayer de parser l'entité existante pour obtenir les fields
        entity_path = Path(__file__).parent.parent.parent / "backend" / "src" / "entities" / f"{entity_name.lower()}.entity.ts"
        fields = []
        
        if entity_path.exists():
            parsed = parse_entity_file(entity_path)
            if parsed:
                fields = parsed.get('fields', [])
        
        files_created = []
        
        if dto_type == 'create' or dto_type == 'all':
            code = generator.generate_create(entity_name, fields)
            file_path = dto_dir / f"create-{entity_name.lower()}.dto.ts"
            file_path.write_text(code, encoding='utf-8')
            files_created.append(str(file_path.relative_to(Path(__file__).parent.parent.parent)))
        
        if dto_type == 'update' or dto_type == 'all':
            code = generator.generate_update(entity_name)
            file_path = dto_dir / f"update-{entity_name.lower()}.dto.ts"
            file_path.write_text(code, encoding='utf-8')
            files_created.append(str(file_path.relative_to(Path(__file__).parent.parent.parent)))
        
        return files_created

class ServiceGeneratorWrapper:
    """Générer un service NestJS"""
    
    @staticmethod
    def create(name):
        """Créer un service NestJS"""
        module_dir = Path(__file__).parent.parent.parent / "backend" / "src" / "modules" / name.lower()
        module_dir.mkdir(parents=True, exist_ok=True)
        
        # Essayer de parser l'entité pour obtenir les relations
        entity_path = Path(__file__).parent.parent.parent / "backend" / "src" / "entities" / f"{name.lower()}.entity.ts"
        relations = None
        if entity_path.exists():
            from utils.entity_parser import parse_entity_file
            parsed = parse_entity_file(entity_path)
            if parsed:
                relations = parsed.get('relations', [])
        
        generator = ServiceGenerator()
        code = generator.generate(name, relations)
        
        file_path = module_dir / f"{name.lower()}.service.ts"
        file_path.write_text(code, encoding='utf-8')
        
        return [str(file_path.relative_to(Path(__file__).parent.parent.parent))]

class ControllerGeneratorWrapper:
    """Générer un controller NestJS"""
    
    @staticmethod
    def create(name):
        """Créer un controller NestJS"""
        module_dir = Path(__file__).parent.parent.parent / "backend" / "src" / "modules" / name.lower()
        module_dir.mkdir(parents=True, exist_ok=True)
        
        generator = ControllerGenerator()
        code = generator.generate(name)
        
        file_path = module_dir / f"{name.lower()}.controller.ts"
        file_path.write_text(code, encoding='utf-8')
        
        return [str(file_path.relative_to(Path(__file__).parent.parent.parent))]

class ModuleGenerator:
    """Générer un module NestJS (version améliorée)"""
    
    @staticmethod
    def create(name):
        """Créer un module NestJS complet"""
        module_dir = Path(__file__).parent.parent.parent / "backend" / "src" / "modules" / name.lower()
        module_dir.mkdir(parents=True, exist_ok=True)
        
        files_created = []
        
        # Vérifier si l'entité existe
        entity_path = Path(__file__).parent.parent.parent / "backend" / "src" / "entities" / f"{name.lower()}.entity.ts"
        entity_name = name.capitalize()
        
        if entity_path.exists():
            # Utiliser le générateur amélioré
            generator = ModuleCodeGenerator()
            code = generator.generate(name)
        else:
            # Version basique
            code = f"""import {{ Module }} from '@nestjs/common';
import {{ TypeOrmModule }} from '@nestjs/typeorm';
import {{ {entity_name}Controller }} from './{name.lower()}.controller';
import {{ {entity_name}Service }} from './{name.lower()}.service';

@Module({{
  imports: [TypeOrmModule.forFeature([])],
  controllers: [{entity_name}Controller],
  providers: [{entity_name}Service],
  exports: [{entity_name}Service],
}})
export class {entity_name}Module {{}}
"""
        
        module_file = module_dir / f"{name.lower()}.module.ts"
        module_file.write_text(code, encoding='utf-8')
        files_created.append(str(module_file.relative_to(Path(__file__).parent.parent.parent)))
        
        return files_created
    
    @staticmethod
    def create_full(name):
        """Créer un module complet : Entity + DTOs + Service + Controller + Module"""
        files_created = []
        
        # 1. Générer l'entité (basique)
        entity_files = EntityGeneratorWrapper.create(name)
        files_created.extend(entity_files)
        
        # 2. Générer les DTOs
        dto_files = DTOGeneratorWrapper.create(name, 'all')
        files_created.extend(dto_files)
        
        # 3. Générer le service
        service_files = ServiceGeneratorWrapper.create(name)
        files_created.extend(service_files)
        
        # 4. Générer le controller
        controller_files = ControllerGeneratorWrapper.create(name)
        files_created.extend(controller_files)
        
        # 5. Générer le module
        module_files = ModuleGenerator.create(name)
        files_created.extend(module_files)
        
        # 6. Enregistrer dans AppModule
        try:
            from utils.app_module_updater import add_module_to_app_module
            module_name = name.capitalize() + "Module"
            if add_module_to_app_module(module_name):
                files_created.append("backend/src/app.module.ts (mis à jour)")
        except Exception as e:
            # Ne pas faire échouer si l'enregistrement échoue
            print(f"⚠️  Impossible d'enregistrer dans AppModule: {e}")
        
        return files_created
        
        return files_created

class HookGeneratorWrapper:
    """Générer un hook React"""
    
    @staticmethod
    def create(name):
        """Créer un hook React"""
        hooks_dir = Path(__file__).parent.parent.parent / "frontend" / "src" / "hooks"
        hooks_dir.mkdir(parents=True, exist_ok=True)
        
        generator = HookGenerator()
        code = generator.generate(name)
        
        file_path = hooks_dir / f"use{name.capitalize()}.ts"
        file_path.write_text(code, encoding='utf-8')
        
        return [str(file_path.relative_to(Path(__file__).parent.parent.parent))]

class APIServiceGeneratorWrapper:
    """Générer un service API"""
    
    @staticmethod
    def create(name):
        """Créer un service API"""
        services_dir = Path(__file__).parent.parent.parent / "frontend" / "src" / "services"
        services_dir.mkdir(parents=True, exist_ok=True)
        
        generator = APIServiceGenerator()
        code = generator.generate(name)
        
        file_path = services_dir / f"{name.lower()}s.ts"
        file_path.write_text(code, encoding='utf-8')
        
        return [str(file_path.relative_to(Path(__file__).parent.parent.parent))]

class AnimationGeneratorWrapper:
    """Générer une animation AnimeJS"""
    
    @staticmethod
    def create(name, animation_type="fade-in"):
        """Créer une animation AnimeJS"""
        animations_dir = Path(__file__).parent.parent.parent / "frontend" / "src" / "animations" / "presets"
        animations_dir.mkdir(parents=True, exist_ok=True)
        
        generator = AnimationGenerator()
        code = generator.generate(name, animation_type)
        
        file_path = animations_dir / f"{name}.ts"
        file_path.write_text(code, encoding='utf-8')
        
        # Mettre à jour index.ts pour exporter l'animation
        index_path = animations_dir.parent / "index.ts"
        if index_path.exists():
            content = index_path.read_text(encoding='utf-8')
            animation_name_pascal = ''.join(word.capitalize() for word in name.split('-'))
            export_line = f"export {{ animate{animation_name_pascal}, type {animation_name_pascal}Options }} from './presets/{name}';"
            if export_line not in content:
                # Ajouter après les autres exports
                content = content.rstrip() + f"\n{export_line}\n"
                index_path.write_text(content, encoding='utf-8')
        
        return [str(file_path.relative_to(Path(__file__).parent.parent.parent))]

class PageGenerator:
    """Générer une page React"""
    
    @staticmethod
    def create(name, entity_name=None):
        """Créer une page React"""
        pages_dir = Path(__file__).parent.parent.parent / "frontend" / "src" / "pages"
        pages_dir.mkdir(parents=True, exist_ok=True)
        
        generator = PageCodeGenerator()
        code = generator.generate(name, entity_name)
        
        file_path = pages_dir / f"{name}.tsx"
        file_path.write_text(code, encoding='utf-8')
        
        return [str(file_path.relative_to(Path(__file__).parent.parent.parent))]

# Export pour main.py
generate_component = ComponentGenerator()
generate_module = ModuleGenerator()
generate_page = PageGenerator()
generate_entity = EntityGeneratorWrapper()
generate_dto = DTOGeneratorWrapper()
generate_service = ServiceGeneratorWrapper()
generate_controller = ControllerGeneratorWrapper()
generate_hook = HookGeneratorWrapper()
generate_api_service = APIServiceGeneratorWrapper()
generate_animation = AnimationGeneratorWrapper()

