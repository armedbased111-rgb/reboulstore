#!/usr/bin/env python3
"""
CLI Python pour Reboul Store
Automatise les tâches répétitives et améliore le contexte pour Cursor
"""

import click
import re
from typing import Dict
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

console = Console()

@click.group()
def cli():
    """🚀 CLI Python - Reboul Store"""
    pass

@cli.group()
def roadmap():
    """Commandes pour gérer la roadmap"""
    pass

@roadmap.command()
@click.option('--phase', type=int, help='Numéro de phase')
@click.option('--task', type=str, help='Tâche à cocher (ex: "15.1 Configuration Cloudinary")')
@click.option('--complete', is_flag=True, help='Marquer la phase comme complète')
def update(phase, task, complete):
    """Mettre à jour la roadmap"""
    from commands.roadmap import update_roadmap
    
    if complete and phase:
        update_roadmap.mark_phase_complete(phase)
        console.print(f"[green]✅ Phase {phase} marquée comme complète[/green]")
    elif task:
        update_roadmap.check_task(task)
        console.print(f"[green]✅ Tâche '{task}' cochée[/green]")
    else:
        console.print("[yellow]⚠️  Spécifiez --phase et --task ou --complete[/yellow]")

@roadmap.command()
def check():
    """Vérifier la cohérence de la roadmap"""
    from commands.roadmap import check_roadmap
    
    issues = check_roadmap.validate()
    
    if not issues:
        console.print("[green]✅ Roadmap cohérente[/green]")
    else:
        table = Table(title="Problèmes détectés")
        table.add_column("Type", style="cyan")
        table.add_column("Description", style="yellow")
        
        for issue in issues:
            table.add_row(issue['type'], issue['message'])
        
        console.print(table)

@roadmap.command()
@click.argument('phase_num', type=int)
def phase(phase_num):
    """Afficher les détails d'une phase"""
    from commands.roadmap import get_phase
    
    phase_info = get_phase.details(phase_num)
    
    if phase_info:
        panel = Panel(
            f"[bold]Phase {phase_num}: {phase_info['title']}[/bold]\n\n"
            f"État: {phase_info['status']}\n"
            f"Tâches: {phase_info['completed']}/{phase_info['total']}\n\n"
            f"{phase_info['description']}",
            title=f"Phase {phase_num}",
            border_style="blue"
        )
        console.print(panel)
    else:
        console.print(f"[red]❌ Phase {phase_num} non trouvée[/red]")

@cli.group()
def context():
    """Commandes pour gérer le contexte"""
    pass

@context.command()
@click.option('--output', type=str, default='.cursor/context-summary.md', help='Fichier de sortie')
def generate(output):
    """Générer un résumé de contexte pour Cursor"""
    from commands.context import generate_context
    
    summary = generate_context.create_summary()
    
    with open(output, 'w', encoding='utf-8') as f:
        f.write(summary)
    
    console.print(f"[green]✅ Résumé généré: {output}[/green]")

@context.command()
def sync():
    """Synchroniser tous les fichiers de contexte"""
    from commands.context import sync_context
    
    results = sync_context.synchronize()
    
    table = Table(title="Synchronisation")
    table.add_column("Fichier", style="cyan")
    table.add_column("Statut", style="green")
    
    for file, status in results.items():
        table.add_row(file, status)
    
    console.print(table)

@cli.group()
def code():
    """Commandes pour générer du code"""
    pass

@code.command()
@click.argument('name')
@click.option('--domain', type=str, help='Domaine (UI, Product, etc.)')
@click.option('--shadcn', is_flag=True, help='Utiliser le template shadcn/ui avec variants')
@click.option('--use', multiple=True, help='Composants shadcn/ui requis (ex: --use card --use button). Installation automatique si manquants.')
def component(name, domain, shadcn, use):
    """Générer un composant React"""
    from commands.code import generate_component
    
    required_components = list(use) if use else None
    
    result = generate_component.create(name, domain, use_shadcn=shadcn, required_components=required_components)
    
    # Gérer le retour (dict ou liste)
    if isinstance(result, dict):
        files = result.get('files', [])
        warning = result.get('warning')
        installed_components = result.get('installed_components', [])
        
        if warning:
            console.print(f"[yellow]⚠️  {warning}[/yellow]")
        else:
            console.print(f"[green]✅ Composant '{name}' créé:[/green]")
        
        for file in files:
            console.print(f"  - {file}")
        
        if installed_components:
            console.print(f"\n[green]✅ Composants shadcn/ui installés automatiquement:[/green]")
            for comp in installed_components:
                console.print(f"  - {comp}")
    else:
        # Ancien format (liste)
        console.print(f"[green]✅ Composant '{name}' créé:[/green]")
        for file in result:
            console.print(f"  - {file}")
    
    if shadcn:
        console.print(f"[yellow]💡 Utilise les variants shadcn/ui (variant, size)[/yellow]")
    
    if use:
        console.print(f"[yellow]💡 Utilise les composants shadcn/ui: {', '.join(use)}[/yellow]")

@code.command()
@click.argument('name')
@click.option('--full', is_flag=True, help='Générer un module complet (Entity + DTOs + Service + Controller + Module)')
def module(name, full):
    """Générer un module NestJS"""
    from commands.code import generate_module
    
    if full:
        files = generate_module.create_full(name)
        console.print(f"[green]✅ Module complet '{name}' créé:[/green]")
    else:
        files = generate_module.create(name)
        console.print(f"[green]✅ Module '{name}' créé:[/green]")
    
    for file in files:
        console.print(f"  - {file}")

@code.command()
@click.argument('name')
def entity(name):
    """Générer une entité TypeORM"""
    from commands.code import generate_entity
    
    files = generate_entity.create(name)
    
    console.print(f"[green]✅ Entité '{name}' créée:[/green]")
    for file in files:
        console.print(f"  - {file}")

@code.command()
@click.argument('entity_name')
@click.option('--type', type=click.Choice(['create', 'update', 'all']), default='all', help='Type de DTO à générer')
def dto(entity_name, type):
    """Générer des DTOs (create, update)"""
    from commands.code import generate_dto
    
    files = generate_dto.create(entity_name, type)
    
    console.print(f"[green]✅ DTOs '{entity_name}' créés:[/green]")
    for file in files:
        console.print(f"  - {file}")

@code.command()
@click.argument('name')
def service(name):
    """Générer un service NestJS"""
    from commands.code import generate_service
    
    files = generate_service.create(name)
    
    console.print(f"[green]✅ Service '{name}' créé:[/green]")
    for file in files:
        console.print(f"  - {file}")

@code.command()
@click.argument('name')
def controller(name):
    """Générer un controller NestJS"""
    from commands.code import generate_controller
    
    files = generate_controller.create(name)
    
    console.print(f"[green]✅ Controller '{name}' créé:[/green]")
    for file in files:
        console.print(f"  - {file}")

@code.command()
@click.argument('name')
@click.option('--entity', type=str, help='Nom de l\'entité associée (optionnel)')
def page(name, entity):
    """Générer une page React"""
    from commands.code import generate_page
    
    files = generate_page.create(name, entity)
    
    console.print(f"[green]✅ Page '{name}' créée:[/green]")
    for file in files:
        console.print(f"  - {file}")

@code.command()
@click.argument('name')
def hook(name):
    """Générer un hook React"""
    from commands.code import generate_hook
    
    files = generate_hook.create(name)
    
    console.print(f"[green]✅ Hook 'use{name.capitalize()}' créé:[/green]")
    for file in files:
        console.print(f"  - {file}")

@code.command()
@click.argument('name')
def api_service(name):
    """Générer un service API"""
    from commands.code import generate_api_service
    
    files = generate_api_service.create(name)
    
    console.print(f"[green]✅ Service API '{name}s' créé:[/green]")
    for file in files:
        console.print(f"  - {file}")

@code.command()
@click.argument('name')
@click.option('--type', type=click.Choice(['fade-in', 'slide-up', 'slide-down', 'scale']), default='fade-in', help='Type d\'animation')
def animation(name, type):
    """Générer une animation AnimeJS"""
    from commands.code import generate_animation
    
    files = generate_animation.create(name, type)
    
    console.print(f"[green]✅ Animation '{name}' créée:[/green]")
    for file in files:
        console.print(f"  - {file}")

@cli.group()
def shadcn():
    """Commandes pour gérer shadcn/ui"""
    pass

@shadcn.command('list')
def list_installed():
    """Lister les composants shadcn/ui installés"""
    from commands.shadcn import manage_shadcn
    
    components = manage_shadcn.list_installed()
    
    if components:
        console.print(f"[green]✅ Composants shadcn/ui installés ({len(components)}):[/green]")
        for comp in components:
            console.print(f"  - {comp}")
    else:
        console.print("[yellow]⚠️  Aucun composant shadcn/ui installé[/yellow]")

@shadcn.command('install')
@click.argument('component_name')
@click.option('--force', is_flag=True, help='Forcer l\'installation même si déjà installé (non recommandé)')
def install_component(component_name, force):
    """Installer un composant shadcn/ui"""
    from commands.shadcn import manage_shadcn
    
    # Vérifier si déjà installé
    if manage_shadcn.is_installed(component_name) and not force:
        console.print(f"[yellow]⚠️  Composant '{component_name}' déjà installé[/yellow]")
        console.print(f"[yellow]💡 Utilisez --force pour forcer l'installation (non recommandé)[/yellow]")
        return
    
    console.print(f"[cyan]📦 Installation de '{component_name}'...[/cyan]")
    
    result = manage_shadcn.install(component_name, force=force)
    
    if result['status'] == 'success':
        console.print(f"[green]✅ {result['message']}[/green]")
    elif result['status'] == 'already_installed' or result['status'] == 'already_exists':
        console.print(f"[yellow]⚠️  {result['message']}[/yellow]")
    else:
        console.print(f"[red]❌ {result['message']}[/red]")
        if 'error' in result:
            console.print(f"[red]   Détails: {result['error']}[/red]")

@shadcn.command('available')
def list_available():
    """Lister les composants shadcn/ui disponibles"""
    from commands.shadcn import manage_shadcn
    
    components = manage_shadcn.list_available()
    
    console.print(f"[green]📋 Composants shadcn/ui disponibles ({len(components)}):[/green]")
    for comp in components:
        console.print(f"  - {comp}")

@cli.group()
def figma():
    """Commandes pour l'intégration avec Figma"""
    pass

@figma.command('analyze')
@click.argument('figma_url')
@click.argument('component_name')
def analyze_design(figma_url, component_name):
    """Créer un template d'analyse pour un design Figma"""
    from commands.figma import help_figma
    
    console.print(f"[cyan]📐 Analyse du design Figma pour '{component_name}'...[/cyan]")
    
    file_path = help_figma.create_analysis_template(figma_url, component_name)
    
    console.print(f"[green]✅ Template d'analyse créé:[/green]")
    console.print(f"  - {file_path}")
    console.print(f"[yellow]💡 Remplis le template avec les détails du design[/yellow]")

@figma.command('suggest')
@click.argument('description')
def suggest_components(description):
    """Suggérer des composants shadcn/ui basés sur une description"""
    from commands.figma import help_figma
    
    suggestions = help_figma.suggest_components(description)
    
    if suggestions['shadcn_components']:
        console.print(f"[green]💡 Composants shadcn/ui suggérés:[/green]")
        for comp in suggestions['shadcn_components']:
            console.print(f"  - {comp}")
        console.print(f"\n[yellow]💡 Pour installer: python main.py shadcn install [nom][/yellow]")
    else:
        console.print("[yellow]⚠️  Aucun composant shadcn/ui suggéré[/yellow]")
    
    if suggestions['notes']:
        console.print(f"\n[cyan]📝 Notes:[/cyan]")
        for note in suggestions['notes']:
            console.print(f"  - {note}")

@cli.group()
def suggest():
    """Commandes pour suggérer des phases et améliorations"""
    pass

@cli.group()
def build():
    """Commandes pour analyser les builds"""
    pass

@build.command('analyze')
@click.option('--fix', is_flag=True, help='Essayer de corriger automatiquement les erreurs simples')
@click.option('--verify', is_flag=True, help='Analyser, corriger et vérifier jusqu\'à ce qu\'il n\'y ait plus d\'erreurs')
def analyze_builds(fix, verify):
    """Analyser tous les builds pour détecter les erreurs"""
    from commands.build_analyzer import build_analyzer
    
    if verify:
        # Mode vérification avec boucle
        max_iterations = 10
        iteration = 0
        
        while iteration < max_iterations:
            iteration += 1
            console.print(f"[blue]🔨 Analyse des builds (itération {iteration})...[/blue]\n")
            
            result = build_analyzer.analyze_all()
            
            # Vérifier s'il y a des erreurs
            if result['summary']['total_errors'] == 0:
                console.print(Panel(
                    f"[green]✅ Tous les builds sont réussis ![/green]\n\n"
                    f"Warnings: {result['summary']['total_warnings']}\n"
                    f"Itérations nécessaires: {iteration}",
                    title="Succès",
                    border_style="green"
                ))
                return
            
            # Corriger les erreurs
            console.print("[yellow]🔧 Correction automatique des erreurs...[/yellow]\n")
            fixes_applied = fix_build_errors(result)
            
            if not fixes_applied:
                console.print("[red]❌ Aucune correction automatique possible. Erreurs restantes:[/red]")
                break
            
            console.print(f"[green]✅ {fixes_applied} corrections appliquées. Vérification...[/green]\n")
        
        if iteration >= max_iterations:
            console.print(f"[red]❌ Maximum d'itérations ({max_iterations}) atteint. Erreurs restantes:[/red]")
        
        # Afficher les résultats finaux
        result = build_analyzer.analyze_all()
    else:
        console.print("[blue]🔨 Analyse des builds...[/blue]\n")
        result = build_analyzer.analyze_all()
        
        if fix and result['summary']['total_errors'] > 0:
            console.print("[yellow]🔧 Correction automatique des erreurs...[/yellow]\n")
            fix_build_errors(result)
    
    # Afficher les résultats
    for key, build_result in result['results'].items():
        name = build_result.get('name', key)
        status = build_result.get('status', 'unknown')
        
        if status == 'success':
            icon = "[green]✅[/green]"
        elif status == 'error':
            icon = "[red]❌[/red]"
        else:
            icon = "[yellow]⚠️[/yellow]"
        
        console.print(f"{icon} [bold]{name}[/bold]")
        
        if status == 'error':
            if 'error' in build_result:
                console.print(f"  [red]Erreur: {build_result['error']}[/red]")
            else:
                errors_count = build_result.get('errors_count', 0)
                warnings_count = build_result.get('warnings_count', 0)
                console.print(f"  [red]Erreurs: {errors_count}[/red] | [yellow]Warnings: {warnings_count}[/yellow]")
                
                if errors_count > 0 and 'errors' in build_result:
                    console.print("\n  [red]Premières erreurs:[/red]")
                    for err in build_result['errors'][:5]:
                        console.print(f"    • {err}")
        elif status == 'warning':
            console.print(f"  [yellow]⚠️  {build_result.get('warning', '')}[/yellow]")
        else:
            errors_count = build_result.get('errors_count', 0)
            warnings_count = build_result.get('warnings_count', 0)
            if errors_count > 0:
                console.print(f"  [red]Erreurs: {errors_count}[/red]")
            if warnings_count > 0:
                console.print(f"  [yellow]Warnings: {warnings_count}[/yellow]")
            if errors_count == 0 and warnings_count == 0:
                console.print(f"  [green]✓ Build réussi sans erreurs ni warnings[/green]")
        
        console.print()
    
    # Résumé
    summary = result['summary']
    if summary['all_passed']:
        console.print(Panel(
            f"[green]✅ Tous les builds sont réussis ![/green]\n\n"
            f"Warnings: {summary['total_warnings']}",
            title="Résumé",
            border_style="green"
        ))
    else:
        console.print(Panel(
            f"[red]❌ Erreurs détectées: {summary['total_errors']}[/red]\n"
            f"[yellow]⚠️  Warnings: {summary['total_warnings']}[/yellow]",
            title="Résumé",
            border_style="red"
        ))

def fix_build_errors(result: Dict) -> int:
    """Corriger automatiquement les erreurs de build"""
    from commands.build_analyzer import build_analyzer
    from utils.build_error_fixer import build_error_fixer
    from pathlib import Path
    
    total_fixes = 0
    project_root = Path(__file__).parent.parent
    
    for key, build_result in result['results'].items():
        if build_result.get('status') != 'error' or 'errors' not in build_result:
            continue
        
        errors = build_result.get('errors', [])
        if not errors:
            continue
        
        # Déterminer le chemin du projet
        if 'backend' in key and 'reboul' in key:
            project_path = project_root / "backend"
        elif 'frontend' in key and 'reboul' in key:
            project_path = project_root / "frontend"
        elif 'backend' in key and 'admin' in key:
            project_path = project_root / "admin-central" / "backend"
        elif 'frontend' in key and 'admin' in key:
            project_path = project_root / "admin-central" / "frontend"
        else:
            continue
        
        # Extraire les fichiers avec erreurs
        file_errors = build_analyzer.extract_file_paths_from_errors(errors)
        
        # Corriger chaque fichier
        for file_path_str, file_errors_list in file_errors.items():
            file_path = project_path / file_path_str
            if not file_path.exists():
                # Essayer avec src/
                file_path = project_path / "src" / file_path_str
            
            if file_path.exists():
                fixed, fixes = build_error_fixer.fix_all(file_errors_list, file_path)
                if fixed:
                    total_fixes += len(fixes)
                    for fix_msg in fixes:
                        console.print(f"  [green]✓[/green] {file_path.relative_to(project_root)}: {fix_msg}")
    
    return total_fixes

@build.command('fix')
def fix_builds():
    """Corriger automatiquement les erreurs de build"""
    from commands.build_analyzer import build_analyzer
    
    console.print("[blue]🔨 Analyse des builds...[/blue]\n")
    result = build_analyzer.analyze_all()
    
    if result['summary']['total_errors'] == 0:
        console.print("[green]✅ Aucune erreur à corriger[/green]")
        return
    
    console.print("[yellow]🔧 Correction automatique des erreurs...[/yellow]\n")
    fixes_applied = fix_build_errors(result)
    
    if fixes_applied > 0:
        console.print(f"\n[green]✅ {fixes_applied} corrections appliquées[/green]")
        console.print("\n[blue]💡 Relancez 'build analyze' pour vérifier[/blue]")
    else:
        console.print("\n[yellow]⚠️  Aucune correction automatique possible. Erreurs nécessitent une intervention manuelle.[/yellow]")

@build.command('verify')
@click.option('--max-iterations', default=10, help='Nombre maximum d\'itérations (défaut: 10)')
def verify_builds(max_iterations):
    """Analyser, corriger et vérifier jusqu'à ce qu'il n'y ait plus d'erreurs"""
    from commands.build_analyzer import build_analyzer
    
    iteration = 0
    
    while iteration < max_iterations:
        iteration += 1
        console.print(f"[blue]🔨 Analyse des builds (itération {iteration}/{max_iterations})...[/blue]\n")
        
        result = build_analyzer.analyze_all()
        
        # Vérifier s'il y a des erreurs
        if result['summary']['total_errors'] == 0:
            console.print(Panel(
                f"[green]✅ Tous les builds sont réussis ![/green]\n\n"
                f"Warnings: {result['summary']['total_warnings']}\n"
                f"Itérations nécessaires: {iteration}",
                title="Succès",
                border_style="green"
            ))
            return
        
        # Afficher les erreurs
        console.print(f"[red]❌ {result['summary']['total_errors']} erreur(s) détectée(s)[/red]\n")
        
        # Corriger les erreurs
        console.print("[yellow]🔧 Correction automatique des erreurs...[/yellow]\n")
        fixes_applied = fix_build_errors(result)
        
        if not fixes_applied:
            console.print("[red]❌ Aucune correction automatique possible. Erreurs restantes:[/red]\n")
            # Afficher les résultats pour voir les erreurs restantes
            for key, build_result in result['results'].items():
                if build_result.get('status') == 'error' and 'errors' in build_result:
                    name = build_result.get('name', key)
                    console.print(f"\n[red]{name}:[/red]")
                    for err in build_result['errors'][:5]:
                        console.print(f"  • {err}")
            break
        
        console.print(f"[green]✅ {fixes_applied} correction(s) appliquée(s). Nouvelle vérification...[/green]\n")
    
    if iteration >= max_iterations:
        console.print(Panel(
            f"[red]❌ Maximum d'itérations ({max_iterations}) atteint.[/red]\n"
            f"Il reste des erreurs qui nécessitent une intervention manuelle.",
            title="Erreurs Restantes",
            border_style="red"
        ))

@cli.group()
def analyze():
    """Commandes pour analyser et valider le code"""
    pass

@analyze.command('dependencies')
def analyze_dependencies():
    """Analyser les dépendances du projet"""
    from commands.analyze import analyze_manager
    
    console.print("[cyan]📊 Analyse des dépendances...[/cyan]")
    
    result = analyze_manager.dependencies()
    
    # Afficher le graphe
    console.print("\n[green]📦 Entités:[/green]")
    for entity, info in result['graph']['entities'].items():
        relations = info.get('relations', [])
        if relations:
            console.print(f"  - {entity}: relations avec {', '.join(relations)}")
        else:
            console.print(f"  - {entity}")
    
    console.print("\n[green]📦 Modules:[/green]")
    for module, info in result['graph']['modules'].items():
        completeness = info.get('completeness', {})
        missing = [k for k, v in completeness.items() if not v]
        if missing:
            console.print(f"  - {module}: ⚠️  manque {', '.join(missing)}")
        else:
            console.print(f"  - {module}: ✅ complet")
    
    # Afficher les dépendances manquantes
    missing = result['missing']
    if missing.get('entities_without_modules'):
        console.print(f"\n[yellow]⚠️  Entités sans modules:[/yellow]")
        for entity in missing['entities_without_modules']:
            console.print(f"  - {entity}")
    
    if missing.get('incomplete_modules'):
        console.print(f"\n[yellow]⚠️  Modules incomplets:[/yellow]")
        for item in missing['incomplete_modules']:
            console.print(f"  - {item['module']}: manque {', '.join(item['missing'])}")

@analyze.command('code')
def validate_code():
    """Valider la cohérence du code"""
    from commands.analyze import analyze_manager
    
    console.print("[cyan]🔍 Validation de la cohérence du code...[/cyan]")
    
    result = analyze_manager.code_consistency()
    
    # Afficher les problèmes de cohérence
    consistency = result['consistency']
    
    if consistency.get('entities_without_modules'):
        console.print(f"\n[yellow]⚠️  Entités sans modules:[/yellow]")
        for entity in consistency['entities_without_modules']:
            console.print(f"  - {entity}")
    
    if consistency.get('modules_without_entities'):
        console.print(f"\n[yellow]⚠️  Modules sans entités:[/yellow]")
        for module in consistency['modules_without_entities']:
            console.print(f"  - {module}")
    
    if consistency.get('incomplete_modules'):
        console.print(f"\n[yellow]⚠️  Modules incomplets:[/yellow]")
        for item in consistency['incomplete_modules']:
            console.print(f"  - {item['module']}: manque {', '.join(item['missing'])}")
    
    # Afficher les problèmes de relations
    if result['relations']:
        console.print(f"\n[yellow]⚠️  Problèmes de relations TypeORM:[/yellow]")
        for issue in result['relations']:
            console.print(f"  - {issue['entity']}: {issue['issue']}")
    
    if not any([consistency.get('entities_without_modules'), 
                consistency.get('modules_without_entities'),
                consistency.get('incomplete_modules'),
                result['relations']]):
        console.print("\n[green]✅ Aucun problème de cohérence détecté[/green]")

@analyze.command('dead-code')
def analyze_dead_code():
    """Analyser le code mort"""
    from commands.analyze import analyze_manager
    
    console.print("[cyan]🧹 Analyse du code mort...[/cyan]")
    
    result = analyze_manager.dead_code()
    
    # Afficher les fichiers inutilisés
    unused = result['unused_files']
    if unused.get('backend'):
        console.print(f"\n[yellow]📁 Fichiers backend inutilisés:[/yellow]")
        for file in unused['backend']:
            console.print(f"  - {file}")
    
    if unused.get('frontend'):
        console.print(f"\n[yellow]📁 Fichiers frontend inutilisés:[/yellow]")
        for file in unused['frontend']:
            console.print(f"  - {file}")
    
    # Afficher les composants isolés
    if result['isolated_components']:
        console.print(f"\n[yellow]🧩 Composants isolés:[/yellow]")
        for component in result['isolated_components']:
            console.print(f"  - {component}")
    
    # Afficher les suggestions
    suggestions = result['suggestions']
    if suggestions.get('can_delete'):
        console.print(f"\n[green]🗑️  Fichiers pouvant être supprimés:[/green]")
        for file in suggestions['can_delete']:
            console.print(f"  - {file}")
    
    if not any([unused.get('backend'), unused.get('frontend'), result['isolated_components']]):
        console.print("\n[green]✅ Aucun code mort détecté[/green]")

@analyze.command('patterns')
@click.option('--dir', type=str, help='Dossier spécifique à analyser (défaut: backend + frontend)')
def analyze_patterns_cmd(dir):
    """Analyser les patterns répétitifs et le code dupliqué"""
    from commands.analyze import analyze_manager
    
    console.print("[cyan]🔍 Analyse des patterns et du code dupliqué...[/cyan]")
    
    result = analyze_manager.patterns(dir)
    
    # Afficher les patterns détectés
    if result['patterns']:
        console.print(f"\n[yellow]📊 Patterns détectés ({len(result['patterns'])}):[/yellow]")
        
        pattern_types = {}
        for pattern in result['patterns']:
            pattern_type = pattern['type']
            if pattern_type not in pattern_types:
                pattern_types[pattern_type] = []
            pattern_types[pattern_type].append(pattern)
        
        for pattern_type, patterns in pattern_types.items():
            console.print(f"\n  [bold]{pattern_type}[/bold]:")
            for pattern in patterns[:5]:  # Limiter à 5 par type
                severity_color = {
                    'high': 'red',
                    'medium': 'yellow',
                    'low': 'blue',
                }.get(pattern['severity'], 'white')
                console.print(f"    - [{severity_color}]{pattern['description']}[/{severity_color}]")
                console.print(f"      💡 {pattern['suggestion']}")
                console.print(f"      📁 {pattern['file']}")
    
    # Afficher le code dupliqué
    if result['duplicates']:
        console.print(f"\n[yellow]🔄 Code dupliqué ({len(result['duplicates'])} blocs):[/yellow]")
        for dup in result['duplicates'][:10]:  # Limiter à 10
            console.print(f"  - {dup['count']} occurrences dans {dup['file']}")
            for occ in dup['occurrences'][:3]:  # Afficher les 3 premières
                console.print(f"    Ligne {occ[0]}")
    
    # Afficher les suggestions de refactoring
    if result['suggestions']:
        console.print(f"\n[green]💡 Suggestions de refactoring:[/green]")
        for suggestion in result['suggestions']:
            priority_color = {
                'high': 'red',
                'medium': 'yellow',
                'low': 'blue',
            }.get(suggestion['priority'], 'white')
            console.print(f"  [{priority_color}]● {suggestion['title']}[/{priority_color}]")
            console.print(f"    {suggestion['description']}")
            console.print(f"    → {suggestion['action']}")
    
    console.print(f"\n[blue]📊 {result['files_analyzed']} fichiers analysés[/blue]")
    
    if not result['patterns'] and not result['duplicates']:
        console.print("\n[green]✅ Aucun pattern répétitif ou code dupliqué détecté[/green]")

@suggest.command('phase')
@click.argument('domain', required=False)
def suggest_phase(domain):
    """Suggérer des phases basées sur un domaine ou l'état actuel"""
    from utils.phase_suggester import suggest_phases
    
    console.print("[cyan]💡 Analyse des besoins et suggestions de phases...[/cyan]")
    
    result = suggest_phases(domain)
    
    # Afficher l'état actuel
    state = result['current_state']
    console.print(f"\n[blue]📊 État actuel du projet:[/blue]")
    console.print(f"  - Entités: {state['entities']}")
    console.print(f"  - Modules: {state['modules']}")
    console.print(f"  - Composants: {state['components']}")
    console.print(f"  - Pages: {state['pages']}")
    console.print(f"  - Hooks: {state['hooks']}")
    console.print(f"  - Phases complétées: {state['completed_phases']}")
    
    # Afficher les suggestions
    suggestions = result['suggestions']
    if suggestions:
        console.print(f"\n[green]💡 Suggestions ({len(suggestions)}):[/green]")
        
        for i, suggestion in enumerate(suggestions, 1):
            complexity_color = {
                'high': 'red',
                'medium': 'yellow',
                'low': 'green',
            }.get(suggestion['complexity'], 'white')
            
            console.print(f"\n  [bold]{i}. {suggestion['title']}[/bold]")
            console.print(f"     {suggestion['description']}")
            console.print(f"     [cyan]Complexité:[/cyan] [{complexity_color}]{suggestion['complexity']}[/{complexity_color}]")
            console.print(f"     [cyan]Temps estimé:[/cyan] {suggestion['estimated_time']}")
            
            if suggestion['dependencies']:
                console.print(f"     [yellow]Dépendances:[/yellow] {', '.join(suggestion['dependencies'])}")
            
            console.print(f"     [blue]Tâches principales:[/blue]")
            for task in suggestion['tasks'][:5]:
                console.print(f"       - {task}")
    else:
        console.print("\n[yellow]⚠️  Aucune suggestion pour ce domaine[/yellow]")

@context.command('optimize')
def optimize_context_cmd():
    """Optimiser le contexte pour Cursor"""
    from utils.context_optimizer import optimize_context
    
    console.print("[cyan]🔧 Analyse et optimisation du contexte...[/cyan]")
    
    result = optimize_context()
    
    analysis = result['analysis']
    
    # Afficher l'analyse
    if analysis['exists']:
        console.print(f"\n[blue]📊 Analyse du contexte:[/blue]")
        console.print(f"  - Taille: {analysis['size']:.1f} KB")
        console.print(f"  - Sections: {len(analysis['sections'])}")
        console.print(f"  - Liens: {analysis.get('link_count', 0)}")
        
        if analysis['sections']:
            console.print(f"\n  Sections détectées:")
            for section in analysis['sections'][:10]:
                console.print(f"    - {section}")
    else:
        console.print("\n[red]❌ Fichier CONTEXT.md introuvable[/red]")
    
    # Afficher les problèmes
    if analysis.get('issues'):
        console.print(f"\n[yellow]⚠️  Problèmes détectés ({len(analysis['issues'])}):[/yellow]")
        for issue in analysis['issues'][:5]:
            console.print(f"  - {issue}")
    
    # Afficher les suggestions
    suggestions = result['suggestions']
    if suggestions:
        console.print(f"\n[green]💡 Suggestions d'optimisation:[/green]")
        for suggestion in suggestions:
            type_color = {
                'critical': 'red',
                'warning': 'yellow',
                'info': 'blue',
            }.get(suggestion['type'], 'white')
            
            console.print(f"  [{type_color}]● {suggestion['title']}[/{type_color}]")
            console.print(f"    {suggestion['description']}")
            console.print(f"    → {suggestion['action']}")
    
    # Afficher les informations manquantes
    if result.get('missing_info'):
        console.print(f"\n[yellow]📝 Informations manquantes:[/yellow]")
        for info in result['missing_info']:
            console.print(f"  - {info}")
    
    # Afficher le résumé optimisé
    if result.get('optimized_summary'):
        console.print(f"\n[green]📄 Résumé optimisé:[/green]")
        console.print(Panel(result['optimized_summary'], title="Résumé", border_style="green"))
    
    if not analysis.get('issues') and not suggestions:
        console.print("\n[green]✅ Contexte optimal[/green]")

@cli.group()
def db():
    """Commandes pour la base de données"""
    pass

@db.command('generate')
@click.argument('type', type=click.Choice(['migration', 'seed']))
@click.argument('name')
@click.option('--entity', type=str, help='Nom de l\'entité (pour migration)')
@click.option('--entities', multiple=True, help='Entités à inclure (pour seed)')
@click.option('--cloudinary', is_flag=True, help='Support Cloudinary (pour seed)')
def generate_db(type, name, entity, entities, cloudinary):
    """Générer une migration ou un seed"""
    from commands.db import db_manager
    
    if type == 'migration':
        file = db_manager.generate_migration(name, entity)
        console.print(f"[green]✅ Migration créée: {file}[/green]")
        console.print(f"[yellow]💡 Note: En développement, synchronize: true est actif. Les migrations sont pour la production.[/yellow]")
    elif type == 'seed':
        entities_list = list(entities) if entities else None
        file = db_manager.generate_seed(name, entities_list, cloudinary)
        console.print(f"[green]✅ Script de seed créé: {file}[/green]")
        console.print(f"[yellow]💡 Exécuter avec: ts-node {file}[/yellow]")

@db.command('analyze')
@click.argument('type', type=click.Choice(['schema']))
def analyze_db(type):
    """Analyser le schéma de la base de données"""
    from commands.db import db_manager
    
    if type == 'schema':
        console.print("[cyan]📊 Analyse du schéma de la base de données...[/cyan]\n")
        
        result = db_manager.analyze_schema()
        
        if 'error' in result:
            console.print(f"[red]❌ Erreur: {result['error']}[/red]")
            return
        
        # Résumé
        summary = result.get('summary', {})
        console.print(Panel.fit(
            f"[bold]Résumé[/bold]\n"
            f"Entités: {summary.get('total_entities', 0)}\n"
            f"Migrations: {summary.get('total_migrations', 0)}\n"
            f"Entités seedées: {summary.get('total_seeded', 0)}\n"
            f"Tables dans migrations: {summary.get('total_tables_in_migrations', 0)}",
            title="📊 Schéma",
            border_style="cyan"
        ))
        
        # Tableau des entités
        if result.get('entities'):
            table = Table(title="Entités")
            table.add_column("Entité", style="cyan")
            table.add_column("Table", style="green")
            table.add_column("Seed", style="yellow")
            table.add_column("Migration", style="magenta")
            
            for entity_info in result['entities']:
                seed_status = "✅" if entity_info['seeded'] else "❌"
                migration_status = "✅" if entity_info['has_migration_table'] or summary.get('total_migrations', 0) == 0 else "❌"
                table.add_row(
                    entity_info['entity'],
                    entity_info['table'] or "N/A",
                    seed_status,
                    migration_status
                )
            
            console.print("\n")
            console.print(table)
        
        # Problèmes détectés
        issues = result.get('issues', {})
        has_issues = any(issues.values())
        
        if has_issues:
            console.print("\n[yellow]⚠️  Problèmes détectés:[/yellow]")
            
            if issues.get('entities_without_seed'):
                console.print(f"  • Entités sans seed: {', '.join(issues['entities_without_seed'])}")
            
            if issues.get('entities_without_migration') and summary.get('total_migrations', 0) > 0:
                console.print(f"  • Entités sans migration: {', '.join(issues['entities_without_migration'])}")
            
            if issues.get('tables_without_entities'):
                console.print(f"  • Tables sans entité: {', '.join(issues['tables_without_entities'])}")
        else:
            console.print("\n[green]✅ Aucun problème détecté[/green]")
        
        # Suggestions
        suggestions = result.get('suggestions', [])
        if suggestions:
            console.print("\n[cyan]💡 Suggestions:[/cyan]")
            for suggestion in suggestions:
                msg_type = suggestion.get('type', 'info')
                message = suggestion.get('message', '')
                if msg_type == 'warning':
                    console.print(f"  [yellow]⚠️  {message}[/yellow]")
                else:
                    console.print(f"  [blue]ℹ️  {message}[/blue]")

@cli.group()
def test():
    """Commandes pour générer des tests"""
    pass

@test.command('generate')
@click.argument('type', type=click.Choice(['e2e', 'unit', 'functional']))
@click.argument('name')
@click.option('--method', type=str, default='GET', help='Méthode HTTP (pour e2e)')
@click.option('--route', type=str, help='Route (pour e2e)')
@click.option('--module', type=str, help='Nom du module (pour unit)')
@click.option('--auth', is_flag=True, help='Support authentification (pour functional)')
@click.option('--upload', is_flag=True, help='Support upload (pour functional)')
def generate_test(type, name, method, route, module, auth, upload):
    """Générer un test"""
    from commands.test import generate_test
    
    if type == 'e2e':
        file = generate_test.create_e2e(name, method, route)
        console.print(f"[green]✅ Test E2E créé: {file}[/green]")
    elif type == 'unit':
        file = generate_test.create_unit_service(name, module)
        if file:
            console.print(f"[green]✅ Test unitaire créé: {file}[/green]")
        else:
            console.print(f"[red]❌ Module '{module or name}' introuvable[/red]")
    elif type == 'functional':
        file = generate_test.create_functional(name, supports_auth=auth, supports_upload=upload)
        console.print(f"[green]✅ Script de test fonctionnel créé: {file}[/green]")
        console.print(f"[yellow]💡 Exécuter avec: ts-node {file}[/yellow]")

@cli.group()
def docs():
    """Commandes pour la documentation"""
    pass

@docs.command()
def validate():
    """Valider la cohérence de la documentation"""
    from commands.docs import validate_docs
    
    console.print("[cyan]📝 Validation de la documentation...[/cyan]")
    
    issues = validate_docs.check()
    
    if issues.get('broken_links'):
        console.print(f"\n[yellow]⚠️  Liens cassés ({len(issues['broken_links'])}):[/yellow]")
        for link in issues['broken_links'][:10]:  # Limiter à 10
            console.print(f"  - {link['file']}: {link['text']} → {link['link']}")
        if len(issues['broken_links']) > 10:
            console.print(f"  ... et {len(issues['broken_links']) - 10} autres")
    
    if issues.get('obsolete_sections'):
        console.print(f"\n[yellow]⚠️  Sections obsolètes:[/yellow]")
        for section in issues['obsolete_sections']:
            console.print(f"  - {section}")
    
    if not any(issues.values()):
        console.print("\n[green]✅ Documentation valide[/green]")

@docs.command()
def sync():
    """Synchroniser toute la documentation (ROADMAP ↔ BACKEND.md ↔ FRONTEND.md)"""
    from commands.docs import sync_docs
    
    console.print("[cyan]🔄 Synchronisation de la documentation...[/cyan]")
    
    results = sync_docs.synchronize()
    
    table = Table(title="Synchronisation")
    table.add_column("Action", style="cyan")
    table.add_column("Statut", style="green")
    
    for action, status in results.items():
        # Formater le statut avec des couleurs
        if "✅" in status:
            style = "green"
        elif "⚠️" in status:
            style = "yellow"
        elif "❌" in status:
            style = "red"
        else:
            style = "white"
        table.add_row(action.replace('_', ' ').title(), f"[{style}]{status}[/{style}]")
    
    console.print(table)
    
    # Afficher un résumé
    backend_phases = sum(1 for k, v in results.items() if 'backend' in k.lower() and '✅' in v)
    frontend_phases = sum(1 for k, v in results.items() if 'frontend' in k.lower() and '✅' in v)
    if backend_phases > 0 or frontend_phases > 0:
        console.print(f"\n[blue]📊 Résumé: {backend_phases} phases backend, {frontend_phases} phases frontend synchronisées[/blue]")

@docs.command('changelog')
@click.option('--output', type=str, help='Chemin du fichier de sortie (défaut: docs/CHANGELOG.md)')
def generate_changelog(output):
    """Générer un changelog depuis ROADMAP_COMPLETE.md"""
    from commands.docs import sync_docs
    
    console.print("[cyan]📝 Génération du changelog...[/cyan]")
    
    file_path = sync_docs.generate_changelog_doc(output)
    
    if file_path:
        console.print(f"[green]✅ Changelog généré: {file_path}[/green]")
        
        # Afficher un résumé
        try:
            from pathlib import Path
            base_path = Path(__file__).parent.parent.parent
            full_path = base_path / file_path
            if full_path.exists():
                content = full_path.read_text(encoding='utf-8')
                # Extraire le résumé
                total_match = re.search(r'\*\*Total phases complétées\*\* : (\d+)', content)
                if total_match:
                    phases_count = total_match.group(1)
                    console.print(f"[blue]📊 Résumé: {phases_count} phases complétées documentées[/blue]")
        except Exception:
            pass
    else:
        console.print("[red]❌ Erreur lors de la génération du changelog[/red]")

@docs.group()
def generate():
    """Générer de la documentation"""
    pass

@generate.command('api')
@click.option('--output', type=str, help='Chemin du fichier de sortie (défaut: docs/API.md)')
def generate_api(output):
    """Générer la documentation API depuis les controllers NestJS"""
    from commands.docs import sync_docs
    
    console.print("[cyan]📚 Génération de la documentation API...[/cyan]")
    
    file_path = sync_docs.generate_api(output)
    
    if file_path:
        console.print(f"[green]✅ Documentation API générée: {file_path}[/green]")
        
        # Afficher un résumé
        try:
            from pathlib import Path
            base_path = Path(__file__).parent.parent.parent
            full_path = base_path / file_path
            if full_path.exists():
                content = full_path.read_text(encoding='utf-8')
                # Extraire le résumé depuis le contenu (déjà calculé)
                total_match = re.search(r'\*\*Total\*\* : (\d+) endpoints dans (\d+) controllers', content)
                if total_match:
                    endpoints_count = total_match.group(1)
                    controllers_count = total_match.group(2)
                    console.print(f"[blue]📊 Résumé: {endpoints_count} endpoints dans {controllers_count} controllers[/blue]")
        except Exception:
            pass
    else:
        console.print("[red]❌ Erreur lors de la génération de la documentation[/red]")

@generate.command('components')
@click.option('--output', type=str, help='Chemin du fichier de sortie (défaut: docs/COMPONENTS.md)')
def generate_components(output):
    """Générer la documentation des composants React et hooks"""
    from commands.docs import sync_docs
    
    console.print("[cyan]📚 Génération de la documentation des composants...[/cyan]")
    
    file_path = sync_docs.generate_components(output)
    
    if file_path:
        console.print(f"[green]✅ Documentation composants générée: {file_path}[/green]")
        
        # Afficher un résumé
        try:
            from pathlib import Path
            base_path = Path(__file__).parent.parent.parent
            full_path = base_path / file_path
            if full_path.exists():
                content = full_path.read_text(encoding='utf-8')
                # Extraire le résumé
                total_match = re.search(r'\*\*Total\*\* : (\d+) composants et (\d+) hooks', content)
                if total_match:
                    components_count = total_match.group(1)
                    hooks_count = total_match.group(2)
                    console.print(f"[blue]📊 Résumé: {components_count} composants et {hooks_count} hooks[/blue]")
        except Exception:
            pass
    else:
        console.print("[red]❌ Erreur lors de la génération de la documentation[/red]")

# Importer les commandes serveur
try:
    from commands.server import server as server_group
    from commands.deploy import deploy as deploy_group
    from commands.health import health as health_group
    from commands.logs import logs as logs_group
    cli.add_command(server_group, 'server')
    cli.add_command(deploy_group, 'deploy')
    cli.add_command(health_group, 'health')
    cli.add_command(logs_group, 'logs')
    
    # Analytics commands
    from commands.analytics import analytics
    cli.add_command(analytics, 'analytics')
except ImportError as e:
    # Les commandes serveur sont optionnelles si les dépendances ne sont pas installées
    pass

if __name__ == '__main__':
    cli()

