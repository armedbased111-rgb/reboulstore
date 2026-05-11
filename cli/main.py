#!/usr/bin/env python3
"""
CLI Python pour Reboul Store
Automatise les tâches répétitives et améliore le contexte pour Cursor
"""

from pathlib import Path

try:
    from dotenv import load_dotenv
    _env_path = Path(__file__).resolve().parent.parent / ".env"
    load_dotenv(_env_path)
except Exception:
    pass

import click
import re
import json
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

@cli.group()
def git():
    """Commandes Git"""
    pass

@git.command()
def status():
    """Affiche le statut Git"""
    from commands.git_commands import status as git_status
    git_status()

@git.command()
@click.argument('branch_name')
def create_branch(branch_name):
    """Crée une nouvelle branche (format: feature/nom, fix/nom, etc.)"""
    from commands.git_commands import create_branch as git_create_branch
    git_create_branch(branch_name)

@git.command()
@click.argument('message')
@click.option('--scope', help='Scope du commit (frontend, backend, etc.)')
def commit(message, scope):
    """Crée un commit avec convention (type(scope): message)"""
    from commands.git_commands import commit as git_commit
    git_commit(message, scope)

@git.command()
@click.option('--env', default='production', help='Environnement de déploiement')
def deploy(env):
    """Déploie sur l'environnement spécifié"""
    from commands.git_commands import deploy as git_deploy
    git_deploy(env)

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

@cli.group('import')
def import_cmd():
    """Commandes pour préparer les imports (feuilles de stock → CSV BDD)"""
    pass

@import_cmd.command('feuille-to-csv')
@click.option('--input', '-i', 'input_path', required=True, type=click.Path(exists=True), help='CSV feuille de stock (colonnes: Marque, Genre, Référence, Stock)')
@click.option('--output', '-o', 'output_path', type=click.Path(), help='Fichier de sortie (défaut: stdout)')
@click.option('--collection', default='SS26', help='Valeur collection pour toutes les lignes')
@click.option('--stock', default=2, type=int, help='Valeur stock pour toutes les lignes')
@click.option('--price', default=100, type=int, help='Valeur price pour toutes les lignes')
@click.option('--delimiter', default='auto', help='Séparateur CSV: ; ou , ou auto (détecté)')
def import_feuille_to_csv(input_path, output_path, collection, stock, price, delimiter):
    """Convertir une feuille de stock Reboul en CSV d'import BDD (name;reference;brand;category;collection;stock;price).
    Réutilisable pour toutes les pages de stock (ex. Stone Island : 7 pages)."""
    import csv
    with open(input_path, 'r', encoding='utf-8') as f:
        first = f.readline()
        sep = ';' if (';' in first and (',' not in first or first.index(';') < first.index(','))) else ','
        if delimiter != 'auto':
            sep = ';' if delimiter == ';' else ','
        f.seek(0)
        reader = csv.DictReader(f, delimiter=sep)
        if not reader.fieldnames:
            console.print('[red]❌ Fichier CSV vide ou sans en-tête[/red]')
            return
        import unicodedata
        def norm(s):
            s = s.strip().lower()
            n = unicodedata.normalize('NFD', s)
            return ''.join(c for c in n if not unicodedata.combining(c))
        lower = {}
        for k in reader.fieldnames:
            key = k.strip()
            lower[key.lower()] = key
            lower[norm(k)] = key
        def get(row, *keys):
            for k in keys:
                for alias in (k.strip().lower(), norm(k)):
                    if alias in lower and lower[alias] in row:
                        v = row[lower[alias]].strip()
                        if v:
                            return v
            return ''
        rows_out = []
        for row in reader:
            marque = get(row, 'marque', 'brand')
            genre = get(row, 'genre', 'category', 'categorie')
            ref = get(row, 'reference', 'ref', 'référence')
            if not ref:
                continue
            name = f"{marque} {genre}".strip() if (marque and genre) else (marque or genre or ref)
            name = ' '.join(w.capitalize() for w in name.split())
            rows_out.append({
                'name': name,
                'reference': ref,
                'brand': marque,
                'category': genre.lower() if genre else '',
                'collection': collection,
                'stock': str(stock),
                'price': str(price),
            })
        if not rows_out:
            console.print('[yellow]⚠️ Aucune ligne avec Référence trouvée[/yellow]')
            return
        out_header = ['name', 'reference', 'brand', 'category', 'collection', 'stock', 'price']
        buf = []
        buf.append(';'.join(out_header))
        for r in rows_out:
            buf.append(';'.join(str(r[k]) for k in out_header))
        result = '\n'.join(buf)
        if output_path:
            with open(output_path, 'w', encoding='utf-8', newline='') as out:
                out.write(result)
            console.print(f"[green]✅ {len(rows_out)} lignes → {output_path}[/green]")
        else:
            console.print(result)


@import_cmd.command('merge-pages')
@click.option('--input', '-i', 'input_paths', required=True, type=click.Path(exists=True), multiple=True, help='CSV à fusionner (2 ou plus, même format BDD)')
@click.option('--output', '-o', 'output_path', required=True, type=click.Path(), help='Fichier CSV fusionné (dédupliqué par référence)')
def import_merge_pages(input_paths, output_path):
    """Fusionner plusieurs pages CSV en un seul fichier, dédupliqué par référence.
    Quand la même référence apparaît sur plusieurs pages (ex. fin page 1 = début page 2), la dernière occurrence gagne (stock mis à jour)."""
    import csv
    out_header = ['name', 'reference', 'brand', 'category', 'collection', 'stock', 'price']

    def ref_key(ref):
        return (ref or '').strip()

    by_ref = {}
    total_lines = 0
    for path in input_paths:
        with open(path, 'r', encoding='utf-8') as f:
            first = f.readline()
            sep = ';' if (';' in first and (',' not in first or first.find(';') < first.find(','))) else ','
            f.seek(0)
            reader = csv.DictReader(f, delimiter=sep)
            if not reader.fieldnames:
                continue
            for row in reader:
                ref = (row.get('reference') or row.get('Reference') or row.get('référence') or '').strip()
                if not ref:
                    continue
                total_lines += 1
                key = ref_key(ref)
                name = (row.get('name') or row.get('Name') or '').strip()
                brand = (row.get('brand') or row.get('Brand') or '').strip()
                category = (row.get('category') or row.get('Category') or '').strip().lower()
                collection = (row.get('collection') or row.get('Collection') or 'SS26').strip()
                stock = (row.get('stock') or row.get('Stock') or '2').strip()
                price = (row.get('price') or row.get('Price') or '100').strip()
                by_ref[key] = {
                    'name': name or by_ref.get(key, {}).get('name', ''),
                    'reference': ref,
                    'brand': brand or by_ref.get(key, {}).get('brand', ''),
                    'category': category or by_ref.get(key, {}).get('category', ''),
                    'collection': collection or by_ref.get(key, {}).get('collection', 'SS26'),
                    'stock': stock,
                    'price': price,
                }

    if not by_ref:
        console.print('[red]❌ Aucune ligne avec référence trouvée dans les fichiers[/red]')
        return
    rows_out = list(by_ref.values())
    dup_removed = total_lines - len(rows_out)
    buf = [';'.join(out_header)]
    for r in rows_out:
        buf.append(';'.join(str(r.get(k, '')) for k in out_header))
    with open(output_path, 'w', encoding='utf-8', newline='') as out:
        out.write('\n'.join(buf))
    console.print(f"[green]✅ {len(rows_out)} lignes uniques → {output_path}[/green]")
    if dup_removed > 0:
        console.print(f"[dim]   (chevauchement pages : {dup_removed} doublon(s) retiré(s), dernière occurrence conservée)[/dim]")


@import_cmd.command('compare-csv')
@click.option('--input', '-i', 'input_path', required=True, type=click.Path(exists=True), help='CSV de mise à jour (même format: name;reference;brand;category;collection;stock;price)')
@click.option('--collection', type=str, required=True, help='Nom de la collection (ex: SS26) pour comparer à la BDD')
@click.option('--brand', type=str, default=None, help='Filtrer aussi par marque (optionnel)')
@click.option('--output', '-o', 'output_path', type=click.Path(), default=None, help='Exporter le rapport en fichier texte')
def import_compare_csv(input_path, collection, brand, output_path):
    """Comparer un CSV de mise à jour avec la BDD : nouveaux ajouts, mises à jour stocks, retraits à supprimer."""
    import csv as csv_module

    def _lower_map(reader_fieldnames):
        m = {}
        for k in (reader_fieldnames or []):
            key = k.strip().lower()
            m[key] = k
        return m

    with open(input_path, 'r', encoding='utf-8') as f:
        first = f.readline()
        sep = ';' if (';' in first and (',' not in first or first.find(';') < first.find(','))) else ','
        f.seek(0)
        reader = csv_module.DictReader(f, delimiter=sep)
        lower = _lower_map(reader.fieldnames)
        def get(row, *keys):
            for k in keys:
                key = k.strip().lower()
                if key in lower and lower[key] in row:
                    v = (row.get(lower[key]) or '').strip()
                    if v:
                        return v
            return ''
        csv_rows = []
        for row in reader:
            ref_full = get(row, 'reference', 'ref', 'référence')
            if not ref_full:
                continue
            try:
                stock_val = int(get(row, 'stock') or '0')
            except ValueError:
                stock_val = 0
            try:
                price_val = float((get(row, 'price') or '0').replace(',', '.'))
            except ValueError:
                price_val = 0.0
            csv_rows.append({
                'reference': ref_full,
                'name': get(row, 'name'),
                'brand': get(row, 'brand'),
                'category': get(row, 'category'),
                'collection': get(row, 'collection'),
                'stock': stock_val,
                'price': price_val,
            })

    if not csv_rows:
        console.print('[red]❌ Aucune ligne avec référence dans le CSV[/red]')
        return

    csv_by_key = {}
    for r in csv_rows:
        key = (r['reference'] or '').strip().replace('\r', '')
        csv_by_key[key] = r

    where_clauses = ["c.name ILIKE '%" + collection.replace("'", "''") + "%'"]
    if brand:
        where_clauses.append("b.name ILIKE '%" + brand.replace("'", "''") + "%'")
    where_sql = " AND ".join(where_clauses)
    sql = (
        "SELECT p.id AS product_id, p.reference AS product_ref, p.price AS product_price, "
        "v.id AS variant_id, v.size, v.stock "
        "FROM products p "
        "JOIN variants v ON v.product_id = p.id "
        "JOIN collections c ON c.id = p.collection_id "
        "LEFT JOIN brands b ON b.id = p.brand_id "
        "WHERE " + where_sql + " ORDER BY p.reference, v.size;"
    )
    try:
        db_rows = _run_db_query(sql)
    except Exception as e:
        console.print(f"[red]❌ Erreur BDD: {e}[/red]")
        return

    db_by_key = {}
    for r in db_rows:
        if len(r) < 6:
            continue
        p_ref = (r[1] or '').strip()
        size = (r[4] or '').strip()
        key = (p_ref + " " + size).strip()
        try:
            stock_db = int(r[5]) if r[5] else 0
        except (ValueError, TypeError):
            stock_db = 0
        try:
            price_db = float(r[2]) if r[2] else 0.0
        except (ValueError, TypeError):
            price_db = 0.0
        db_by_key[key] = {
            'product_id': int(r[0]),
            'variant_id': int(r[3]),
            'product_ref': p_ref,
            'size': size,
            'stock': stock_db,
            'price': price_db,
        }

    csv_keys = set(csv_by_key)
    db_keys = set(db_by_key)

    new_keys = csv_keys - db_keys
    remove_keys = db_keys - csv_keys
    common_keys = csv_keys & db_keys

    updates_stock = []
    updates_price = []
    for k in common_keys:
        csv_row = csv_by_key[k]
        db_row = db_by_key[k]
        if csv_row['stock'] != db_row['stock']:
            updates_stock.append({
                'key': k,
                'name': csv_row.get('name', ''),
                'variant_id': db_row['variant_id'],
                'stock_old': db_row['stock'],
                'stock_new': csv_row['stock'],
            })
        if abs((csv_row.get('price') or 0) - (db_row.get('price') or 0)) > 0.001:
            updates_price.append({
                'key': k,
                'name': csv_row.get('name', ''),
                'product_id': db_row['product_id'],
                'price_old': db_row.get('price', 0),
                'price_new': csv_row.get('price', 0),
            })

    lines_out = []
    def out(s):
        lines_out.append(s)
        console.print(s)

    out("[bold]Rapport : CSV vs BDD (collection %s)[/bold]" % collection)
    if brand:
        out("[dim]Marque : %s[/dim]" % brand)
    out("")

    out("[green]Nouveaux (dans le CSV, pas en BDD) — à ajouter[/green]")
    if not new_keys:
        out("  Aucun.")
    else:
        for k in sorted(new_keys):
            r = csv_by_key[k]
            out("  %s  |  %s  |  stock=%s  price=%s" % (k, (r.get('name') or '')[:40], r.get('stock'), r.get('price')))
    out("")

    out("[yellow]Mises à jour de stock (référence présente des deux côtés)[/yellow]")
    if not updates_stock:
        out("  Aucune.")
    else:
        for u in updates_stock:
            out("  %s  |  variant_id=%s  stock: %s → %s  (%s)" % (
                u['key'], u['variant_id'], u['stock_old'], u['stock_new'], (u.get('name') or '')[:30]))
    out("")

    out("[yellow]Mises à jour de prix (produit)[/yellow]")
    seen_product_price = set()
    if not updates_price:
        out("  Aucune.")
    else:
        for u in updates_price:
            pid = u['product_id']
            if pid in seen_product_price:
                continue
            seen_product_price.add(pid)
            out("  product_id=%s  |  %s  |  prix: %s → %s" % (pid, (u.get('name') or '')[:30], u['price_old'], u['price_new']))
    out("")

    out("[red]Retraits (en BDD, plus dans le CSV) — à supprimer[/red]")
    if not remove_keys:
        out("  Aucun.")
    else:
        for k in sorted(remove_keys):
            d = db_by_key[k]
            out("  %s  |  variant_id=%s  (product_id=%s, stock actuel=%s)" % (k, d['variant_id'], d['product_id'], d['stock']))
    out("")

    out("[dim]Résumé : %d nouveau(x), %d mise(s) à jour stock, %d retrait(s)[/dim]" % (
        len(new_keys), len(updates_stock), len(remove_keys)))

    if output_path:
        with open(output_path, 'w', encoding='utf-8') as f:
            for line in lines_out:
                plain = re.sub(r'\[/?[^\]]*\]', '', line) + '\n'
                f.write(plain)
        console.print(f"[green]Rapport enregistré → %s[/green]" % output_path)


def _image_to_csv_one(api_key, input_path, collection, brand, stock, price):
    """Envoie une image à Gemini Vision, retourne la liste des lignes CSV (sans en-tête)."""
    import base64
    import requests
    from pathlib import Path

    path = Path(input_path)
    with open(path, "rb") as f:
        data = f.read()
    b64 = base64.standard_b64encode(data).decode("ascii")
    suffix = (path.suffix or "").lower()
    mime = "image/jpeg" if suffix in (".jpg", ".jpeg") else "image/png"

    prompt = (
        "You see a photo or scan of a STOCK SHEET (feuille de stock) from a clothing store. "
        "Extract EVERY row from the table. "
        "Columns usually: Marque (brand), Genre (category), Référence (reference = product code + space + size, e.g. 'L100001/V09A 29' or '6100014/V29 L'). "
        "If a Stock column is visible, use it; otherwise use %d. If Price is visible use it; otherwise use %d. "
        "Output ONLY a CSV with this exact header (semicolon separator): name;reference;brand;category;collection;stock;price\n"
        "Rules: name = Brand + space + Category (e.g. Stone Island Bermuda). reference = full ref with size (exactly as printed). "
        "brand = Marque. category = Genre in lowercase. collection = %s. stock = number. price = number. "
        "One line per row; no extra text, no markdown, no code block."
    ) % (stock, price, collection)
    if brand:
        prompt += " If brand is not clearly visible, use \"%s\" for brand and adjust name accordingly." % brand.replace('"', '\\"')

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    body = {
        "contents": [{"parts": [{"text": prompt}, {"inline_data": {"mime_type": mime, "data": b64}}]}],
        "generationConfig": {"responseModalities": ["TEXT"]},
    }
    resp = requests.post(
        url,
        headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
        json=body,
        timeout=60,
    )
    resp.raise_for_status()
    text = ""
    for part in resp.json().get("candidates", [{}])[0].get("content", {}).get("parts", []):
        if "text" in part:
            text += part.get("text", "")
    text = text.strip()
    if not text:
        return []
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    out_header = "name;reference;brand;category;collection;stock;price"
    if lines and "name" in lines[0].lower() and "reference" in lines[0].lower():
        data_lines = [ln for ln in lines[1:] if ln and not ln.startswith("```")]
    else:
        data_lines = [ln for ln in lines if ln and not ln.startswith("```")]
    return data_lines


@import_cmd.command('image-to-csv')
@click.option('--input', '-i', 'input_paths', required=True, type=click.Path(exists=True), multiple=True, help='Photo(s) ou scan(s) de feuille(s) de stock (jpg/png). Plusieurs -i pour plusieurs pages.')
@click.option('--output', '-o', 'output_path', required=True, type=click.Path(), help='Fichier CSV de sortie (format BDD, dédupliqué si plusieurs images)')
@click.option('--collection', default='SS26', help='Valeur collection pour toutes les lignes')
@click.option('--brand', default=None, help='Marque par défaut si non lisible sur la feuille (ex: Stone Island)')
@click.option('--stock', default=2, type=int, help='Stock par défaut si non lisible')
@click.option('--price', default=100, type=int, help='Prix par défaut si non lisible')
def import_image_to_csv(input_paths, output_path, collection, brand, stock, price):
    """Extraire le tableau de une ou plusieurs photos/scans via Gemini Vision → un seul CSV BDD (dédupliqué par référence)."""
    import os

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        console.print("[red]❌ GEMINI_API_KEY manquante. Ajoute-la dans .env à la racine.[/red]")
        return

    paths = list(input_paths)
    out_header = "name;reference;brand;category;collection;stock;price"
    by_ref = {}
    total_rows = 0
    for i, p in enumerate(paths):
        console.print("[dim]Image %d/%d : %s[/dim]" % (i + 1, len(paths), p))
        try:
            data_lines = _image_to_csv_one(api_key, p, collection, brand, stock, price)
        except Exception as e:
            console.print(f"[red]❌ Erreur pour {p}: {e}[/red]")
            continue
        for ln in data_lines:
            parts = ln.split(";", 6)
            if len(parts) >= 2:
                ref = (parts[1] or "").strip()
                if ref:
                    by_ref[ref] = ln
                    total_rows += 1
        console.print("[green]  → %d lignes[/green]" % len(data_lines))
    if not by_ref:
        console.print("[red]❌ Aucune ligne extraite.[/red]")
        return
    csv_content = out_header + "\n" + "\n".join(by_ref.values())
    with open(output_path, "w", encoding="utf-8", newline="") as f:
        f.write(csv_content)
    console.print(f"[green]✅ %d lignes uniques (%d images) → %s[/green]" % (len(by_ref), len(paths), output_path))


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

@analyze.command('verbosity')
@click.option('--file', type=str, help='Fichier spécifique à analyser (ex: frontend/src/pages/Home.tsx)')
@click.option('--dir', type=str, help='Dossier spécifique à analyser (défaut: backend + frontend)')
def analyze_verbosity_cmd(file, dir):
    """Analyser la verbosité du code (commentaires redondants, répétitions, etc.)"""
    from commands.analyze import analyze_manager
    
    console.print("[cyan]🔍 Analyse de la verbosité du code...[/cyan]")
    
    result = analyze_manager.verbosity(file, dir)
    
    # Afficher le résumé
    summary = result['summary']
    console.print(f"\n[blue]📊 Résumé:[/blue]")
    console.print(f"  - Commentaires redondants: {summary['redundant_comments']}")
    console.print(f"  - Blocs dupliqués: {summary['duplicate_blocks']}")
    console.print(f"  - Fonctions verbeuses: {summary['verbose_functions']}")
    console.print(f"  - Code répétitif: {summary['repetitive_code']}")
    
    # Afficher les issues par sévérité
    if result['issues']:
        console.print(f"\n[yellow]⚠️  Problèmes détectés ({len(result['issues'])}):[/yellow]")
        
        # Grouper par type
        issues_by_type = {}
        for issue in result['issues']:
            issue_type = issue['type']
            if issue_type not in issues_by_type:
                issues_by_type[issue_type] = []
            issues_by_type[issue_type].append(issue)
        
        for issue_type, issues in issues_by_type.items():
            console.print(f"\n  [bold]{issue_type}[/bold]:")
            for issue in issues[:10]:  # Limiter à 10 par type
                severity_color = {
                    'high': 'red',
                    'medium': 'yellow',
                    'low': 'blue',
                }.get(issue['severity'], 'white')
                console.print(f"    [{severity_color}]● Ligne {issue['line']}: {issue['description']}[/{severity_color}]")
                if 'suggestion' in issue:
                    console.print(f"      💡 {issue['suggestion']}")
                console.print(f"      📁 {issue['file']}")
                if 'code' in issue:
                    console.print(f"      📝 {issue['code'][:60]}...")
    
    console.print(f"\n[blue]📊 {result['files_analyzed']} fichiers analysés[/blue]")
    
    if not result['issues']:
        console.print("\n[green]✅ Aucun problème de verbosité détecté[/green]")
    else:
        total_issues = len(result['issues'])
        high_issues = sum(1 for i in result['issues'] if i.get('severity') == 'high')
        if high_issues > 0:
            console.print(f"\n[red]⚠️  {high_issues} problème(s) critique(s) à corriger[/red]")

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

def _run_db_query(sql: str):
    """
    Exécuter une requête SQL en lecture seule sur la base Reboul (VPS).
    Retourne une liste de lignes, chaque ligne étant une liste de colonnes (strings).
    """
    from utils.server_helper import ssh_exec, SERVER_CONFIG

    # Format TSV simple pour parsing côté Python
    safe_sql = sql.replace('"', '\\"')
    project_dir = SERVER_CONFIG['project_path']
    remote_cmd = (
        f"cd {project_dir} && "
        f"docker exec reboulstore-postgres-prod "
        f"psql -U reboulstore -d reboulstore_db -t -A -F '|' -c \"{safe_sql}\""
    )

    stdout, stderr = ssh_exec(remote_cmd)

    if stderr and stderr.strip():
        raise RuntimeError(stderr.strip())

    lines = [line.strip() for line in (stdout or "").splitlines() if line.strip()]
    rows = [line.split("|") for line in lines]
    return rows


def _exec_db_sql(sql: str):
    """
    Exécuter une requête SQL (UPDATE/INSERT/DELETE) sur la base Reboul (VPS).
    """
    from utils.server_helper import ssh_exec, SERVER_CONFIG

    safe_sql = sql.replace('"', '\\"')
    project_dir = SERVER_CONFIG['project_path']
    remote_cmd = (
        f"cd {project_dir} && "
        f"docker exec reboulstore-postgres-prod "
        f"psql -U reboulstore -d reboulstore_db -c \"{safe_sql}\""
    )

    stdout, stderr, code = ssh_exec(remote_cmd, return_code=True)
    if code != 0:
        raise RuntimeError(stderr.strip() or stdout.strip() or f"psql exit code {code}")


def _create_server_backup():
    """
    Créer un backup rapide sur le VPS avant une modification DB.
    Utilise la même logique que les autres backups (pg_dump + gzip).
    """
    from utils.server_helper import ssh_exec, SERVER_CONFIG
    from datetime import datetime

    project_dir = SERVER_CONFIG['project_path']
    backup_dir = f"{project_dir}/backups"
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = f"{backup_dir}/reboulstore_db_{timestamp}.sql"

    backup_cmd = (
        f"cd {project_dir} && "
        f"mkdir -p {backup_dir} && "
        f"docker exec reboulstore-postgres-prod pg_dump -U reboulstore -d reboulstore_db > \"{backup_file}\" && "
        f"gzip \"{backup_file}\" && "
        f"echo 'Backup créé: {backup_file}.gz'"
    )

    stdout, stderr, code = ssh_exec(backup_cmd, return_code=True)
    if code != 0 or 'Backup créé:' not in (stdout or ''):
        raise RuntimeError(stderr.strip() or stdout.strip() or "Échec backup serveur")

    console.print("[green]💾 Backup serveur créé avant modification DB[/green]")


@db.command('product-find')
@click.option('--ref', 'reference', type=str, help='Référence produit (sans taille)')
@click.option('--id', 'product_id', type=int, help='ID numérique du produit')
@click.option('--sku', type=str, help='SKU de variant (optionnel)')
@click.option('--json', 'as_json', is_flag=True, help='Sortie JSON')
def db_product_find(reference, product_id, sku, as_json):
    """🔍 Inspecter un produit (lecture seule sur VPS)"""
    if not reference and not product_id and not sku:
        console.print("[red]❌ Spécifiez au moins --ref, --id ou --sku[/red]")
        return
    # Priorité à la référence produit, puis id, puis sku
    if reference:
        ref_esc = reference.replace("'", "''")
        where = f"p.reference = '{ref_esc}'"
    elif product_id:
        where = f"p.id = {product_id}"
    else:
        # Recherche par SKU de variant
        sku_esc = sku.replace("'", "''")
        where = (
            f"EXISTS (SELECT 1 FROM variants v WHERE v.product_id = p.id AND v.sku = '{sku_esc}')"
        )

    sql = (
        "SELECT p.id, p.name, p.reference, p.price, "
        "p.category_id, p.brand_id, p.collection_id "
        "FROM products p "
        f"WHERE {where} "
        "ORDER BY p.id "
        "LIMIT 20;"
    )

    try:
        rows = _run_db_query(sql)
    except Exception as e:
        console.print(f"[red]❌ Erreur lors de la requête: {e}[/red]")
        return

    if not rows:
        console.print("[yellow]⚠️ Aucun produit trouvé[/yellow]")
        return

    if as_json:
        result = [
            {
                "id": int(r[0]),
                "name": r[1],
                "reference": r[2],
                "price": float(r[3]) if r[3] else 0,
                "category_id": int(r[4]) if r[4] else None,
                "brand_id": int(r[5]) if r[5] else None,
                "collection_id": int(r[6]) if r[6] else None,
            }
            for r in rows
        ]
        console.print_json(json.dumps(result, ensure_ascii=False))
        return

    table = Table(title="Produits")
    table.add_column("ID", style="cyan", justify="right")
    table.add_column("Nom", style="green")
    table.add_column("Ref", style="yellow")
    table.add_column("Prix", style="magenta", justify="right")
    table.add_column("Cat.", justify="right")
    table.add_column("Marque", justify="right")
    table.add_column("Coll.", justify="right")

    for r in rows:
        table.add_row(
            r[0],
            r[1],
            r[2] or "",
            r[3] or "",
            r[4] or "",
            r[5] or "",
            r[6] or "",
        )

    console.print(table)


@db.command('product-list')
@click.option('--brand', type=str, help='Nom de la marque (ex: "Stone Island")')
@click.option('--collection', type=str, help='Nom de la collection (optionnel)')
@click.option('--limit', type=int, default=100, show_default=True, help='Nombre max de produits')
@click.option('--json', 'as_json', is_flag=True, help='Sortie JSON')
def db_product_list(brand, collection, limit, as_json):
    """🔍 Lister des produits par marque / collection (lecture seule sur VPS)"""
    if not brand and not collection:
        console.print("[red]❌ Spécifiez au moins --brand ou --collection[/red]")
        return

    where_clauses = []

    if brand:
        brand_esc = brand.replace("'", "''")
        where_clauses.append(f"b.name ILIKE '%{brand_esc}%'")

    if collection:
        coll_esc = collection.replace("'", "''")
        where_clauses.append(f"c.name ILIKE '%{coll_esc}%'")

    where_sql = " AND ".join(where_clauses)

    sql = (
        "SELECT p.id, p.name, p.reference, p.price, "
        "COALESCE(b.name, '') AS brand_name, "
        "COALESCE(c.name, '') AS collection_name, "
        "COUNT(v.id) AS variants_count "
        "FROM products p "
        "LEFT JOIN brands b ON b.id = p.brand_id "
        "LEFT JOIN collections c ON c.id = p.collection_id "
        "LEFT JOIN variants v ON v.product_id = p.id "
        f"WHERE {where_sql} "
        "GROUP BY p.id, p.name, p.reference, p.price, b.name, c.name "
        "ORDER BY p.id "
        f"LIMIT {max(1, min(limit, 500))};"
    )

    try:
        rows = _run_db_query(sql)
    except Exception as e:
        console.print(f"[red]❌ Erreur lors de la requête: {e}[/red]")
        return

    if not rows:
        console.print("[yellow]⚠️ Aucun produit trouvé pour ces critères[/yellow]")
        return

    product_ids = [int(r[0]) for r in rows if len(r) >= 7]
    ids_sql = ",".join(str(i) for i in product_ids)
    variants_sql = (
        "SELECT product_id, color, size, stock "
        f"FROM variants WHERE product_id IN ({ids_sql}) ORDER BY product_id, color, size;"
    )
    try:
        variant_rows = _run_db_query(variants_sql)
    except Exception as e:
        variant_rows = []
    by_product: Dict[int, Dict[str, Dict]] = {}
    for v in variant_rows:
        if len(v) < 4:
            continue
        pid, color, size, stock_str = int(v[0]), v[1], v[2], v[3]
        try:
            stock_val = int(stock_str) if stock_str else 0
        except ValueError:
            stock_val = 0
        if pid not in by_product:
            by_product[pid] = {}
        if color not in by_product[pid]:
            by_product[pid][color] = {"min_size": size, "max_size": size, "total_stock": stock_val}
        else:
            info = by_product[pid][color]
            if size < info["min_size"]:
                info["min_size"] = size
            if size > info["max_size"]:
                info["max_size"] = size
            info["total_stock"] += stock_val

    def _format_summary(pid: int) -> str:
        if pid not in by_product:
            return ""
        parts_out = []
        for color, info in by_product[pid].items():
            mn, mx, tot = info["min_size"], info["max_size"], info["total_stock"]
            if mn == mx:
                parts_out.append(f"{color} {mn} ({tot})")
            else:
                parts_out.append(f"{color} {mn}->{mx} ({tot})")
        return " | ".join(parts_out)

    if as_json:
        result = []
        for r in rows:
            if len(r) < 7:
                continue
            pid = int(r[0])
            result.append(
                {
                    "id": pid,
                    "name": r[1],
                    "reference": r[2],
                    "price": float(r[3]) if r[3] else 0,
                    "brand": r[4],
                    "collection": r[5],
                    "variants_count": int(r[6]) if r[6] else 0,
                    "variants_summary": _format_summary(pid),
                }
            )
        console.print_json(json.dumps(result, ensure_ascii=False))
        return

    title_parts = []
    if brand:
        title_parts.append(f"Marque ~ {brand}")
    if collection:
        title_parts.append(f"Collection ~ {collection}")
    title = "Produits"
    if title_parts:
        title += " (" + ", ".join(title_parts) + ")"

    table = Table(title=title)
    table.add_column("ID", style="cyan", justify="right")
    table.add_column("Nom", style="green")
    table.add_column("Ref", style="yellow")
    table.add_column("Prix", style="magenta", justify="right")
    table.add_column("Marque")
    table.add_column("Collection")
    table.add_column("Variants", justify="right")
    table.add_column("variants (summary)", overflow="fold", max_width=50)

    for r in rows:
        if len(r) < 7:
            continue
        pid = int(r[0])
        summary = _format_summary(pid)
        table.add_row(
            r[0],
            r[1],
            r[2] or "",
            r[3] or "",
            r[4] or "",
            r[5] or "",
            r[6] or "0",
            summary,
        )

    console.print(table)

@db.command('variant-list')
@click.option('--ref', 'reference', type=str, help='Référence produit (sans taille)')
@click.option('--product-id', type=int, help='ID produit')
@click.option('--json', 'as_json', is_flag=True, help='Sortie JSON')
def db_variant_list(reference, product_id, as_json):
    """🔍 Lister les variants d'un produit (lecture seule sur VPS)"""
    # Résoudre product_id à partir de la référence si besoin
    if not product_id and not reference:
        console.print("[red]❌ Spécifiez --ref ou --product-id[/red]")
        return

    if not product_id and reference:
        ref_esc = reference.replace("'", "''")
        try:
            rows = _run_db_query(
                "SELECT id FROM products "
                f"WHERE reference = '{ref_esc}' "
                "ORDER BY id LIMIT 1;"
            )
        except Exception as e:
            console.print(f"[red]❌ Erreur lors de la recherche produit: {e}[/red]")
            return
        if not rows:
            console.print("[yellow]⚠️ Aucun produit trouvé pour cette référence[/yellow]")
            return
        product_id = int(rows[0][0])

    sql = (
        "SELECT v.id, v.sku, v.size, v.color, v.stock "
        "FROM variants v "
        f"WHERE v.product_id = {product_id} "
        "ORDER BY v.id;"
    )

    try:
        rows = _run_db_query(sql)
    except Exception as e:
        console.print(f"[red]❌ Erreur lors de la requête: {e}[/red]")
        return

    if not rows:
        console.print("[yellow]⚠️ Aucun variant trouvé pour ce produit[/yellow]")
        return

    if as_json:
        result = [
            {
                "id": int(r[0]),
                "sku": r[1],
                "size": r[2],
                "color": r[3],
                "stock": int(r[4]) if r[4] else 0,
            }
            for r in rows
        ]
        console.print_json(json.dumps(result, ensure_ascii=False))
        return

    table = Table(title=f"Variants produit {product_id}")
    table.add_column("ID", style="cyan", justify="right")
    table.add_column("SKU", style="green")
    table.add_column("Taille", style="yellow")
    table.add_column("Couleur", style="magenta")
    table.add_column("Stock", justify="right")

    for r in rows:
        table.add_row(
            r[0],
            r[1],
            r[2] or "",
            r[3] or "",
            r[4] or "0",
        )

    console.print(table)
    console.print("[dim]--- Édition[/dim]")
    console.print("[dim]  • Stock (un variant)    : variant-set-stock --id <ID> --stock <n> [--yes][/dim]")
    console.print("[dim]  • Stock (tous variants) : product-set-all-stock --ref <REF> --stock <n> [--yes][/dim]")
    console.print("[dim]  • Couleur (tous)        : product-set-all-color --ref <REF> --color <COULEUR> [--yes][/dim]")
    console.print("[dim]  • Taille                 : variant-set-size --id <ID> --size <TAILLE> [--yes][/dim]")
    console.print("[dim]  • Couleur (un variant)  : variant-set-color --id <ID> --color <COULEUR> [--yes][/dim]")
    console.print("[dim]  • Ajouter un variant    : variant-add --ref <REF> --sku <SKU> --size <S> --color <C> [--stock <n>] [--yes][/dim]")
    console.print("[dim]  • Supprimer un variant  : variant-delete --id <ID> [--yes][/dim]")


@db.command('ref')
@click.argument('reference', type=str)
def db_ref(reference):
    """🔍 Reference Finder : affiche produit + variants et commandes d'édition prêtes à l'emploi"""
    ref = (reference or "").strip()
    if not ref:
        console.print("[red]❌ Indiquez une référence (ex: 4100111/V34)[/red]")
        return
    ref_esc = ref.replace("'", "''")
    ref_shell = f'"{ref}"' if " " in ref or "/" in ref else ref

    sql_product = (
        "SELECT p.id, p.name, p.reference, p.price, p.is_published, "
        "p.category_id, p.brand_id, p.collection_id, "
        "COALESCE(cat.name, '') AS cat_name, COALESCE(b.name, '') AS brand_name, COALESCE(coll.name, '') AS coll_name "
        "FROM products p "
        "LEFT JOIN categories cat ON cat.id = p.category_id "
        "LEFT JOIN brands b ON b.id = p.brand_id "
        "LEFT JOIN collections coll ON coll.id = p.collection_id "
        f"WHERE p.reference = '{ref_esc}' LIMIT 1;"
    )
    try:
        rows = _run_db_query(sql_product)
    except Exception as e:
        console.print(f"[red]❌ Erreur: {e}[/red]")
        return
    if not rows:
        sql_like = (
            "SELECT p.id, p.name, p.reference FROM products p "
            f"WHERE p.reference ILIKE '%{ref_esc}%' ORDER BY p.reference LIMIT 5;"
        )
        try:
            rows_like = _run_db_query(sql_like)
        except Exception:
            rows_like = []
        if rows_like:
            console.print(f"[yellow]⚠️ Aucun produit avec la ref exacte « {ref} ». Références proches :[/yellow]")
            for r in rows_like:
                console.print(f"  [dim]./rcli db ref {r[2]}[/dim]")
            return
        console.print("[yellow]⚠️ Aucun produit trouvé pour cette référence[/yellow]")
        return

    r = rows[0]
    pid = int(r[0])
    name, pref, price = r[1], r[2], r[3]
    published = r[4]
    cat_id, brand_id, coll_id = r[5], r[6], r[7]
    cat_name, brand_name, coll_name = r[8], r[9], r[10]

    variants_sql = (
        "SELECT v.id, v.sku, v.size, v.color, v.stock "
        f"FROM variants v WHERE v.product_id = {pid} ORDER BY v.id;"
    )
    try:
        var_rows = _run_db_query(variants_sql)
    except Exception as e:
        console.print(f"[red]❌ Erreur variants: {e}[/red]")
        var_rows = []

    product_text = (
        f"ID {pid}  |  {name or '-'}\n"
        f"Ref: {pref or '-'}  |  Prix: {price} €  |  Publié: {'Oui' if published else 'Non'}\n"
        f"Cat: {cat_name or '-'}  |  Marque: {brand_name or '-'}  |  Collection: {coll_name or '-'}"
    )
    console.print(Panel(product_text, title="Produit", border_style="cyan"))
    if not var_rows:
        console.print("[yellow]Aucun variant[/yellow]")
    else:
        vt = Table(title=f"Variants ({len(var_rows)})")
        vt.add_column("ID", style="cyan", justify="right")
        vt.add_column("SKU", style="green")
        vt.add_column("Taille", style="yellow")
        vt.add_column("Couleur", style="magenta")
        vt.add_column("Stock", justify="right")
        for v in var_rows:
            vt.add_row(str(v[0]), v[1] or "", v[2] or "", v[3] or "", str(v[4]) if v[4] is not None else "0")
        console.print(vt)

    console.print("[bold]Actions (copier-coller)[/bold]")
    console.print("[dim]Produit[/dim]")
    console.print(f"  ./rcli db product-set-name --id {pid} --name \"<nom>\" -y")
    console.print(f"  ./rcli db product-set-ref --id {pid} --ref {ref_shell} -y")
    console.print(f"  ./rcli db product-set-price --id {pid} --price <prix> -y")
    console.print(f"  ./rcli db product-set-active --id {pid} --active -y   # ou --inactive")
    if cat_id:
        console.print(f"  ./rcli db product-set-category --id {pid} --category-id {cat_id} -y")
    if brand_id:
        console.print(f"  ./rcli db product-set-brand --id {pid} --brand-id {brand_id} -y")
    if coll_id:
        console.print(f"  ./rcli db product-set-collection --id {pid} --collection-id {coll_id} -y")
    console.print(f"  ./rcli db product-set-all-stock --ref {ref_shell} --stock <n> -y")
    console.print(f"  ./rcli db product-set-all-color --ref {ref_shell} --color \"<couleur>\" -y")
    console.print("[dim]Variants[/dim]")
    console.print(f"  ./rcli db variant-add --ref {ref_shell} --sku <SKU> --size <S> --color \"<C>\" --stock <n> -y")
    for v in var_rows:
        console.print(f"  ./rcli db variant-set-stock --id {v[0]} --stock <n> -y   # {v[1]}")
    console.print(f"  ./rcli db variant-set-size --id <ID> --size \"<T>\" -y")
    console.print(f"  ./rcli db variant-set-color --id <ID> --color \"<C>\" -y")
    for v in var_rows:
        console.print(f"  ./rcli db variant-delete --id {v[0]} -y   # {v[1]}")


@db.command('check-sequences')
def db_check_sequences():
    """🔍 Vérifier l'état des séquences critiques (lecture seule)"""
    queries = {
        "carts_id_seq": (
            "SELECT last_value, "
            "(SELECT COALESCE(MAX(id),0) FROM carts) AS max_id "
            "FROM carts_id_seq;"
        ),
        "orders_id_seq": (
            "SELECT last_value, "
            "(SELECT COALESCE(MAX(id),0) FROM orders) AS max_id "
            "FROM orders_id_seq;"
        ),
        "products_id_seq": (
            "SELECT last_value, "
            "(SELECT COALESCE(MAX(id),0) FROM products) AS max_id "
            "FROM products_id_seq;"
        ),
    }

    table = Table(title="Séquences PostgreSQL (lecture seule)")
    table.add_column("Séquence", style="cyan")
    table.add_column("last_value", style="green", justify="right")
    table.add_column("max(id)", style="yellow", justify="right")
    table.add_column("État", style="magenta")

    for name, sql in queries.items():
        try:
            rows = _run_db_query(sql)
            if not rows:
                table.add_row(name, "N/A", "N/A", "[red]Aucune donnée[/red]")
                continue
            last_val, max_id = rows[0]
            status = "[green]OK[/green]"
            if max_id and last_val and int(last_val) <= int(max_id):
                status = "[yellow]⚠️ last_value <= max(id)[/yellow]"
            table.add_row(name, last_val or "0", max_id or "0", status)
        except Exception as e:
            table.add_row(name, "ERR", "ERR", f"[red]{e}[/red]")

    console.print(table)


@db.command('order-list')
@click.option('--last', type=int, default=20, help='Nombre de commandes (défaut 20)')
@click.option('--json', 'as_json', is_flag=True)
def db_order_list(last, as_json):
    """🔍 Lister les dernières commandes (lecture seule)"""
    limit = max(1, min(last, 200))
    sql = (
        "SELECT o.id, o.status, o.total, o.created_at, "
        "o.customer_info->>'email' AS email "
        "FROM orders o ORDER BY o.id DESC LIMIT %d;" % limit
    )
    try:
        rows = _run_db_query(sql)
    except Exception as e:
        console.print(f"[red]❌ Erreur: {e}[/red]")
        return
    if not rows:
        console.print("[yellow]⚠️ Aucune commande[/yellow]")
        return
    if as_json:
        result = []
        for r in rows:
            if len(r) < 5:
                continue
            result.append({
                "id": int(r[0]),
                "status": r[1],
                "total": float(r[2]) if r[2] else 0,
                "created_at": r[3],
                "email": r[4] or "",
            })
        console.print_json(json.dumps(result, ensure_ascii=False))
        return
    table = Table(title="Dernières commandes")
    table.add_column("ID", style="cyan", justify="right")
    table.add_column("Statut", style="green")
    table.add_column("Total", style="yellow", justify="right")
    table.add_column("Créé", style="magenta")
    table.add_column("Email")
    for r in rows:
        table.add_row(r[0], r[1] or "", r[2] or "", r[3] or "", (r[4] or "")[:30])
    console.print(table)


@db.command('order-detail')
@click.option('--id', 'order_id', type=int, required=True)
@click.option('--json', 'as_json', is_flag=True)
def db_order_detail(order_id, as_json):
    """🔍 Détail d'une commande (lecture seule)"""
    sql = (
        "SELECT id, status, total, customer_info, items, created_at "
        "FROM orders WHERE id = %d;" % order_id
    )
    try:
        rows = _run_db_query(sql)
    except Exception as e:
        console.print(f"[red]❌ Erreur: {e}[/red]")
        return
    if not rows:
        console.print("[yellow]⚠️ Commande introuvable[/yellow]")
        return
    r = rows[0]
    if as_json:
        cust, items = r[3], r[4]
        try:
            cust = json.loads(cust) if isinstance(cust, str) and cust.strip() else (cust if cust else {})
            items = json.loads(items) if isinstance(items, str) and items.strip() else (items if items else [])
        except Exception:
            pass
        console.print_json(json.dumps({
            "id": int(r[0]),
            "status": r[1],
            "total": float(r[2]) if r[2] else 0,
            "customer_info": cust,
            "items": items,
            "created_at": r[5],
        }, ensure_ascii=False))
        return
    table = Table(title="Commande %d" % order_id)
    table.add_column("Champ", style="cyan")
    table.add_column("Valeur", style="green")
    table.add_row("id", str(r[0]))
    table.add_row("status", str(r[1]))
    table.add_row("total", str(r[2]))
    table.add_row("customer_info", (str(r[3]) or "")[:60])
    table.add_row("items", (str(r[4]) or "")[:60])
    table.add_row("created_at", str(r[5]))
    console.print(table)


@db.command('cart-list')
@click.option('--last', type=int, default=20, help='Nombre de paniers (défaut 20)')
@click.option('--json', 'as_json', is_flag=True)
def db_cart_list(last, as_json):
    """🔍 Lister les derniers paniers (lecture seule, debug)"""
    limit = max(1, min(last, 200))
    sql = "SELECT id, session_id, created_at FROM carts ORDER BY id DESC LIMIT %d;" % limit
    try:
        rows = _run_db_query(sql)
    except Exception as e:
        console.print(f"[red]❌ Erreur: {e}[/red]")
        return
    if not rows:
        console.print("[yellow]⚠️ Aucun panier[/yellow]")
        return
    if as_json:
        result = [{"id": int(r[0]), "session_id": r[1], "created_at": r[2]} for r in rows]
        console.print_json(json.dumps(result, ensure_ascii=False))
        return
    table = Table(title="Derniers paniers")
    table.add_column("ID", style="cyan", justify="right")
    table.add_column("session_id", style="green")
    table.add_column("created_at", style="yellow")
    for r in rows:
        table.add_row(r[0], (r[1] or "")[:36], r[2] or "")
    console.print(table)


@db.command('export-csv')
@click.option('--brand', type=str, default=None, help='Filtrer par nom de marque')
@click.option('--collection', type=str, default=None, help='Filtrer par nom de collection')
@click.option('--output', '-o', type=click.Path(), default=None, help='Fichier CSV de sortie (défaut: stdout)')
def db_export_csv(brand, collection, output):
    """📤 Export produits/variants en CSV (une ligne par variant) pour Excel / traitement externe"""
    if not brand and not collection:
        console.print("[red]❌ Indiquer au moins --brand ou --collection[/red]")
        return
    cond_parts = []
    if brand:
        cond_parts.append("b.name = '%s'" % str(brand).replace("'", "''"))
    if collection:
        cond_parts.append("c.name = '%s'" % str(collection).replace("'", "''"))
    where_sql = " AND ".join(cond_parts)
    sql = (
        "SELECT p.reference, p.name, p.price, v.sku, v.size, v.color, v.stock "
        "FROM products p "
        "JOIN variants v ON v.product_id = p.id "
        "JOIN brands b ON b.id = p.brand_id "
        "JOIN collections c ON c.id = p.collection_id "
        "WHERE " + where_sql + " ORDER BY p.reference, v.sku;"
    )
    try:
        rows = _run_db_query(sql)
    except Exception as e:
        console.print(f"[red]❌ Erreur: {e}[/red]")
        return
    if not rows:
        console.print("[yellow]⚠️ Aucun variant trouvé[/yellow]")
        return
    import csv
    import io
    buf = io.StringIO()
    w = csv.writer(buf, delimiter=";", lineterminator="\n")
    w.writerow(["reference", "name", "price", "sku", "size", "color", "stock"])
    for r in rows:
        w.writerow([(x or "").strip() for x in r])
    csv_content = buf.getvalue()
    if output:
        with open(output, "w", encoding="utf-8", newline="") as f:
            f.write(csv_content)
        console.print(f"[green]✅ Exporté %d lignes → %s[/green]" % (len(rows), output))
    else:
        console.print(csv_content)


@db.command('count-products')
@click.option('--brand', type=str, help='Filtrer par nom de marque (optionnel)')
@click.option('--collection', type=str, help='Filtrer par nom de collection (optionnel)')
def db_count_products(brand, collection):
    """📊 Compter les produits (optionnellement par marque/collection)"""
    where_clauses = []
    joins = []

    if brand:
        brand_esc = brand.replace("'", "''")
        joins.append("JOIN brands b ON b.id = p.brand_id")
        where_clauses.append(f"b.name ILIKE '%{brand_esc}%'")

    if collection:
        coll_esc = collection.replace("'", "''")
        joins.append("JOIN collections c ON c.id = p.collection_id")
        where_clauses.append(f"c.name ILIKE '%{coll_esc}%'")

    joins_sql = ""
    if joins:
        # dict.fromkeys pour dédupliquer les JOIN si les deux filtres sont présents
        joins_sql = " " + " ".join(dict.fromkeys(joins))
    where_sql = ""
    if where_clauses:
        where_sql = "WHERE " + " AND ".join(where_clauses)

    sql = f"SELECT COUNT(*) FROM products p{joins_sql} {where_sql};"
    try:
        rows = _run_db_query(sql)
    except Exception as e:
        console.print(f"[red]❌ Erreur lors du comptage: {e}[/red]")
        return
    total = int(rows[0][0]) if rows and rows[0] else 0
    if brand or collection:
        console.print(f"[green]✅ {total} produit(s) pour ces critères[/green]")
    else:
        console.print(f"[green]✅ {total} produit(s) au total[/green]")


@db.command('list-empty-products')
def db_list_empty_products():
    """📊 Lister les produits Stone SS26 sans aucun variant"""
    sql = (
        "SELECT p.id, p.name, p.reference, "
        "COALESCE(cat.name, '') AS category_name, "
        "COALESCE(b.name, '') AS brand_name, "
        "COALESCE(c.name, '') AS collection_name "
        "FROM products p "
        "LEFT JOIN categories cat ON cat.id = p.category_id "
        "LEFT JOIN brands b ON b.id = p.brand_id "
        "LEFT JOIN collections c ON c.id = p.collection_id "
        "LEFT JOIN variants v ON v.product_id = p.id "
        "WHERE b.name = 'Stone Island' AND c.name = 'SS26' "
        "GROUP BY p.id, p.name, p.reference, cat.name, b.name, c.name "
        "HAVING COUNT(v.id) = 0 "
        "ORDER BY p.id;"
    )
    try:
        rows = _run_db_query(sql)
    except Exception as e:
        console.print(f"[red]❌ Erreur lors de la requête: {e}[/red]")
        return
    if not rows:
        console.print("[green]✅ Aucun produit vide (sans variants) pour Stone SS26[/green]")
        return
    table = Table(title="Produits Stone SS26 sans variants")
    table.add_column("ID", style="cyan", justify="right")
    table.add_column("Catégorie", style="yellow")
    table.add_column("Nom", style="green")
    table.add_column("Référence", style="magenta")
    table.add_column("Marque")
    table.add_column("Collection")
    for r in rows:
        table.add_row(str(r[0]), r[3] or "", r[1] or "", r[2] or "", r[4] or "", r[5] or "")
    console.print(table)


@db.command('delete-empty-products')
@click.option('--yes', '-y', is_flag=True, help='Ne pas demander de confirmation (supprimer directement)')
def db_delete_empty_products(yes):
    """🗑️ Supprimer les produits Stone SS26 sans variants (après backup)"""
    sql_ids = (
        "SELECT p.id FROM products p "
        "LEFT JOIN brands b ON b.id = p.brand_id "
        "LEFT JOIN collections c ON c.id = p.collection_id "
        "LEFT JOIN variants v ON v.product_id = p.id "
        "WHERE b.name = 'Stone Island' AND c.name = 'SS26' "
        "GROUP BY p.id "
        "HAVING COUNT(v.id) = 0;"
    )
    try:
        rows = _run_db_query(sql_ids)
    except Exception as e:
        console.print(f"[red]❌ Erreur lors de la requête: {e}[/red]")
        return
    ids = [str(int(r[0])) for r in rows if r and r[0]]
    if not ids:
        console.print("[green]✅ Aucun produit vide à supprimer pour Stone SS26[/green]")
        return
    ids_str = ", ".join(ids)
    console.print(f"[yellow]⚠️ Ceci va supprimer {len(ids)} produit(s) (IDs: {ids_str}) pour Stone SS26.[/yellow]")
    if not yes:
        if not click.confirm("Continuer ?"):
            console.print("[yellow]Annulé.[/yellow]")
            return
    try:
        _create_server_backup()
    except Exception as e:
        console.print(f"[red]❌ Backup serveur échoué, aucune suppression effectuée: {e}[/red]")
        return
    try:
        _exec_db_sql("DELETE FROM products WHERE id IN (%s);" % ", ".join(ids))
    except Exception as e:
        console.print(f"[red]❌ Erreur lors de la suppression: {e}[/red]")
        return
    console.print(f"[green]✅ {len(ids)} produit(s) supprimé(s) pour Stone SS26[/green]")


@db.command('variant-set-stock')
@click.option('--id', 'variant_id', type=int, required=True, help='ID du variant')
@click.option('--stock', type=int, required=True, help='Nouveau stock')
@click.option('--no-backup', is_flag=True, help='Ne pas créer de backup avant modification (déconseillé)')
@click.option('--yes', '-y', is_flag=True, help='Ne pas demander de confirmation')
def db_variant_set_stock(variant_id, stock, no_backup, yes):
    """✏️ Mettre à jour le stock d'un variant (VPS, avec backup)"""
    if stock < 0:
        console.print("[red]❌ Stock négatif interdit[/red]")
        return

    if not yes:
        if not click.confirm(f"Mettre le stock du variant {variant_id} à {stock} ?"):
            console.print("[yellow]Action annulée[/yellow]")
            return

    if not no_backup:
        try:
            _create_server_backup()
        except Exception as e:
            console.print(f"[red]❌ Backup serveur échoué, aucune modification effectuée: {e}[/red]")
            return

    try:
        _exec_db_sql(f"UPDATE variants SET stock = {stock} WHERE id = {variant_id};")
        rows = _run_db_query(
            "SELECT v.id, v.sku, v.size, v.color, v.stock "
            "FROM variants v "
            f"WHERE v.id = {variant_id};"
        )
    except Exception as e:
        console.print(f"[red]❌ Erreur lors de la mise à jour: {e}[/red]")
        return

    if not rows:
        console.print("[yellow]⚠️ Aucun variant trouvé avec cet ID[/yellow]")
        return

    r = rows[0]
    table = Table(title="Variant mis à jour")
    table.add_column("ID", style="cyan", justify="right")
    table.add_column("SKU", style="green")
    table.add_column("Taille", style="yellow")
    table.add_column("Couleur", style="magenta")
    table.add_column("Stock", justify="right")
    table.add_row(r[0], r[1], r[2] or "", r[3] or "", r[4] or "0")
    console.print(table)


def _variant_confirm_and_backup(yes: bool, msg: str, no_backup: bool) -> bool:
    if not yes and not click.confirm(msg):
        console.print("[yellow]Action annulée[/yellow]")
        return False
    if not no_backup:
        try:
            _create_server_backup()
        except Exception as e:
            console.print(f"[red]❌ Backup serveur échoué, aucune modification effectuée: {e}[/red]")
            return False
    return True


@db.command('variant-set-size')
@click.option('--id', 'variant_id', type=int, required=True, help='ID du variant')
@click.option('--size', type=str, required=True, help='Nouvelle taille')
@click.option('--no-backup', is_flag=True, help='Ne pas créer de backup (déconseillé)')
@click.option('--yes', '-y', is_flag=True, help='Ne pas demander de confirmation')
def db_variant_set_size(variant_id, size, no_backup, yes):
    """✏️ Changer la taille d'un variant (VPS, avec backup)"""
    if not _variant_confirm_and_backup(
        yes, f"Changer la taille du variant {variant_id} en « {size} » ?", no_backup
    ):
        return
    esc = size.replace("'", "''")
    try:
        _exec_db_sql("UPDATE variants SET size = '%s' WHERE id = %d;" % (esc, variant_id))
        rows = _run_db_query(
            "SELECT v.id, v.sku, v.size, v.color, v.stock FROM variants v WHERE v.id = %d;" % variant_id
        )
    except Exception as e:
        console.print(f"[red]❌ Erreur: {e}[/red]")
        return
    if not rows:
        console.print("[yellow]⚠️ Aucun variant trouvé[/yellow]")
        return
    r = rows[0]
    table = Table(title="Variant mis à jour (taille)")
    table.add_column("ID", style="cyan", justify="right")
    table.add_column("SKU", style="green")
    table.add_column("Taille", style="yellow")
    table.add_column("Couleur", style="magenta")
    table.add_column("Stock", justify="right")
    table.add_row(r[0], r[1], r[2] or "", r[3] or "", r[4] or "0")
    console.print(table)


@db.command('variant-set-color')
@click.option('--id', 'variant_id', type=int, required=True, help='ID du variant')
@click.option('--color', type=str, required=True, help='Nouvelle couleur')
@click.option('--no-backup', is_flag=True, help='Ne pas créer de backup (déconseillé)')
@click.option('--yes', '-y', is_flag=True, help='Ne pas demander de confirmation')
def db_variant_set_color(variant_id, color, no_backup, yes):
    """✏️ Changer la couleur d'un variant (VPS, avec backup)"""
    if not _variant_confirm_and_backup(
        yes, f"Changer la couleur du variant {variant_id} en « {color} » ?", no_backup
    ):
        return
    esc = color.replace("'", "''")
    try:
        _exec_db_sql("UPDATE variants SET color = '%s' WHERE id = %d;" % (esc, variant_id))
        rows = _run_db_query(
            "SELECT v.id, v.sku, v.size, v.color, v.stock FROM variants v WHERE v.id = %d;" % variant_id
        )
    except Exception as e:
        console.print(f"[red]❌ Erreur: {e}[/red]")
        return
    if not rows:
        console.print("[yellow]⚠️ Aucun variant trouvé[/yellow]")
        return
    r = rows[0]
    table = Table(title="Variant mis à jour (couleur)")
    table.add_column("ID", style="cyan", justify="right")
    table.add_column("SKU", style="green")
    table.add_column("Taille", style="yellow")
    table.add_column("Couleur", style="magenta")
    table.add_column("Stock", justify="right")
    table.add_row(r[0], r[1], r[2] or "", r[3] or "", r[4] or "0")
    console.print(table)


@db.command('variant-add')
@click.option('--ref', 'reference', type=str, help='Référence produit')
@click.option('--product-id', type=int, help='ID produit')
@click.option('--sku', type=str, required=True, help='SKU unique du variant')
@click.option('--size', type=str, required=True, help='Taille')
@click.option('--color', type=str, required=True, help='Couleur')
@click.option('--stock', type=int, default=0, help='Stock (défaut 0)')
@click.option('--no-backup', is_flag=True, help='Ne pas créer de backup (déconseillé)')
@click.option('--yes', '-y', is_flag=True, help='Ne pas demander de confirmation')
def db_variant_add(reference, product_id, sku, size, color, stock, no_backup, yes):
    """✏️ Ajouter un variant à un produit (VPS, avec backup)"""
    if stock < 0:
        console.print("[red]❌ Stock négatif interdit[/red]")
        return
    if not reference and not product_id:
        console.print("[red]❌ Spécifiez --ref ou --product-id[/red]")
        return
    if reference and product_id:
        console.print("[yellow]⚠️ Utilisez soit --ref, soit --product-id[/yellow]")
        return
    if reference:
        ref_esc = reference.replace("'", "''")
        try:
            rows = _run_db_query(
                "SELECT id FROM products WHERE reference = '" + ref_esc + "' ORDER BY id LIMIT 1;"
            )
        except Exception as e:
            console.print(f"[red]❌ Erreur: {e}[/red]")
            return
        if not rows:
            console.print("[yellow]⚠️ Aucun produit pour cette référence[/yellow]")
            return
        product_id = int(rows[0][0])
    if not _variant_confirm_and_backup(
        yes, f"Ajouter variant {sku} (taille {size}, couleur {color}, stock {stock}) au produit {product_id} ?", no_backup
    ):
        return
    sku_esc = sku.replace("'", "''")
    size_esc = size.replace("'", "''")
    color_esc = color.replace("'", "''")
    try:
        _exec_db_sql(
            "INSERT INTO variants (product_id, sku, size, color, stock, created_at, updated_at) "
            "VALUES (%d, '%s', '%s', '%s', %d, NOW(), NOW());" % (product_id, sku_esc, size_esc, color_esc, stock)
        )
        rows = _run_db_query(
            "SELECT v.id, v.sku, v.size, v.color, v.stock FROM variants v "
            "WHERE v.product_id = %d ORDER BY v.id DESC LIMIT 1;" % product_id
        )
    except Exception as e:
        console.print(f"[red]❌ Erreur: {e}[/red]")
        return
    if not rows:
        console.print("[yellow]⚠️ Variant créé mais lecture échouée[/yellow]")
        return
    r = rows[0]
    table = Table(title="Variant ajouté")
    table.add_column("ID", style="cyan", justify="right")
    table.add_column("SKU", style="green")
    table.add_column("Taille", style="yellow")
    table.add_column("Couleur", style="magenta")
    table.add_column("Stock", justify="right")
    table.add_row(r[0], r[1], r[2] or "", r[3] or "", r[4] or "0")
    console.print(table)
    console.print("[green]✅ Variant créé[/green]")


@db.command('variant-delete')
@click.option('--id', 'variant_id', type=int, required=True, help='ID du variant')
@click.option('--no-backup', is_flag=True, help='Ne pas créer de backup (déconseillé)')
@click.option('--yes', '-y', is_flag=True, help='Ne pas demander de confirmation')
def db_variant_delete(variant_id, no_backup, yes):
    """✏️ Supprimer un variant (VPS, avec backup)"""
    try:
        rows = _run_db_query(
            "SELECT v.id, v.sku, v.size, v.color, v.stock FROM variants v WHERE v.id = %d;" % variant_id
        )
    except Exception as e:
        console.print(f"[red]❌ Erreur: {e}[/red]")
        return
    if not rows:
        console.print("[yellow]⚠️ Aucun variant avec cet ID[/yellow]")
        return
    r = rows[0]
    if not _variant_confirm_and_backup(
        yes, f"Supprimer le variant {variant_id} ({r[1]}, {r[2]}, {r[3]}) ?", no_backup
    ):
        return
    try:
        _exec_db_sql("DELETE FROM variants WHERE id = %d;" % variant_id)
    except Exception as e:
        console.print(f"[red]❌ Erreur: {e}[/red]")
        return
    console.print("[green]✅ Variant %d supprimé[/green]" % variant_id)


@db.command('product-delete')
@click.option('--id', 'product_id', type=int, help='ID du produit')
@click.option('--ref', 'reference', type=str, help='Référence produit (ex: GEL1130/LAV2)')
@click.option('--no-backup', is_flag=True, help='Ne pas créer de backup (déconseillé)')
@click.option('--yes', '-y', is_flag=True, help='Ne pas demander de confirmation')
def db_product_delete(product_id, reference, no_backup, yes):
    """🗑️ Supprimer un produit et tous ses variants (VPS, avec backup)"""
    if not product_id and not reference:
        console.print("[red]❌ Spécifiez --id ou --ref[/red]")
        return
    if reference:
        ref_esc = reference.replace("'", "''")
        try:
            rows = _run_db_query(
                "SELECT id, name, reference FROM products WHERE reference = '" + ref_esc + "' LIMIT 1;"
            )
        except Exception as e:
            console.print(f"[red]❌ Erreur: {e}[/red]")
            return
        if not rows:
            console.print("[yellow]⚠️ Aucun produit trouvé pour cette référence[/yellow]")
            return
        product_id = int(rows[0][0])
        name, ref = rows[0][1], rows[0][2]
    else:
        try:
            rows = _run_db_query(
                "SELECT id, name, reference FROM products WHERE id = %d;" % product_id
            )
        except Exception as e:
            console.print(f"[red]❌ Erreur: {e}[/red]")
            return
        if not rows:
            console.print("[yellow]⚠️ Aucun produit avec cet ID[/yellow]")
            return
        name, ref = rows[0][1], rows[0][2]
    try:
        count_rows = _run_db_query(
            "SELECT COUNT(*) FROM variants WHERE product_id = %d;" % product_id
        )
        variant_count = int(count_rows[0][0]) if count_rows else 0
    except Exception as e:
        console.print(f"[red]❌ Erreur: {e}[/red]")
        return
    if not yes:
        if not click.confirm(
            f"Supprimer le produit [bold]{name}[/bold] (ref: {ref}, {variant_count} variant(s)) ? Cette action est irréversible."
        ):
            console.print("[yellow]Action annulée[/yellow]")
            return
    if not no_backup:
        try:
            _create_server_backup()
        except Exception as e:
            console.print(f"[red]❌ Backup serveur échoué, aucune modification effectuée: {e}[/red]")
            return
    try:
        _exec_db_sql("DELETE FROM variants WHERE product_id = %d;" % product_id)
        _exec_db_sql("DELETE FROM products WHERE id = %d;" % product_id)
    except Exception as e:
        console.print(f"[red]❌ Erreur lors de la suppression: {e}[/red]")
        return
    console.print(f"[green]✅ Produit {product_id} ({ref}) et ses {variant_count} variant(s) supprimés[/green]")


@db.command('product-set-all-color')
@click.option('--ref', 'reference', type=str, help='Référence produit (ex: L100001/V09A)')
@click.option('--product-id', type=int, help='ID du produit')
@click.option('--color', type=str, required=True, help='Couleur à appliquer à tous les variants')
@click.option('--no-backup', is_flag=True, help='Ne pas créer de backup (déconseillé)')
@click.option('--yes', '-y', is_flag=True, help='Ne pas demander de confirmation')
def db_product_set_all_color(reference, product_id, color, no_backup, yes):
    """✏️ Mettre la même couleur à tous les variants d'un produit (VPS, avec backup)"""
    if not reference and not product_id:
        console.print("[red]❌ Spécifiez --ref ou --product-id[/red]")
        return
    if reference and product_id:
        console.print("[yellow]⚠️ Utilisez soit --ref, soit --product-id, pas les deux[/yellow]")
        return
    if reference:
        ref_esc = reference.replace("'", "''")
        try:
            rows = _run_db_query(
                "SELECT id FROM products WHERE reference = '" + ref_esc + "' ORDER BY id LIMIT 1;"
            )
        except Exception as e:
            console.print(f"[red]❌ Erreur: {e}[/red]")
            return
        if not rows:
            console.print("[yellow]⚠️ Aucun produit pour cette référence[/yellow]")
            return
        product_id = int(rows[0][0])
    try:
        count_rows = _run_db_query(
            "SELECT COUNT(*) FROM variants WHERE product_id = %d;" % product_id
        )
        count = int(count_rows[0][0]) if count_rows else 0
    except Exception as e:
        console.print(f"[red]❌ Erreur: {e}[/red]")
        return
    if count == 0:
        console.print("[yellow]⚠️ Aucun variant pour ce produit[/yellow]")
        return
    if not _variant_confirm_and_backup(
        yes, f"Mettre la couleur « {color} » pour les {count} variant(s) du produit {product_id} ?", no_backup
    ):
        return
    color_esc = color.replace("'", "''")
    try:
        _exec_db_sql("UPDATE variants SET color = '%s' WHERE product_id = %d;" % (color_esc, product_id))
        rows = _run_db_query(
            "SELECT v.id, v.sku, v.size, v.color, v.stock FROM variants v "
            "WHERE v.product_id = %d ORDER BY v.id;" % product_id
        )
    except Exception as e:
        console.print(f"[red]❌ Erreur: {e}[/red]")
        return
    table = Table(title=f"Produit {product_id} — tous les variants en « {color} »")
    table.add_column("ID", style="cyan", justify="right")
    table.add_column("SKU", style="green")
    table.add_column("Taille", style="yellow")
    table.add_column("Couleur", style="magenta")
    table.add_column("Stock", justify="right")
    for r in rows:
        table.add_row(r[0], r[1], r[2] or "", r[3] or "", r[4] or "0")
    console.print(table)
    console.print("[green]✅ %d variant(s) mis à jour[/green]" % len(rows))


@db.command('product-set-all-stock')
@click.option('--ref', 'reference', type=str, help='Référence produit (ex: L100001/V09A)')
@click.option('--product-id', type=int, help='ID du produit')
@click.option('--stock', type=int, required=True, help='Stock à appliquer à tous les variants')
@click.option('--no-backup', is_flag=True, help='Ne pas créer de backup avant modification (déconseillé)')
@click.option('--yes', '-y', is_flag=True, help='Ne pas demander de confirmation')
def db_product_set_all_stock(reference, product_id, stock, no_backup, yes):
    """✏️ Mettre le même stock à tous les variants d'un produit (VPS, avec backup)"""
    if stock < 0:
        console.print("[red]❌ Stock négatif interdit[/red]")
        return
    if not reference and not product_id:
        console.print("[red]❌ Spécifiez --ref ou --product-id[/red]")
        return
    if reference and product_id:
        console.print("[yellow]⚠️ Utilisez soit --ref, soit --product-id, pas les deux[/yellow]")
        return

    if reference:
        ref_esc = reference.replace("'", "''")
        try:
            rows = _run_db_query(
                "SELECT id, name FROM products WHERE reference = '" + ref_esc + "' ORDER BY id LIMIT 1;"
            )
        except Exception as e:
            console.print(f"[red]❌ Erreur: {e}[/red]")
            return
        if not rows:
            console.print("[yellow]⚠️ Aucun produit trouvé pour cette référence[/yellow]")
            return
        product_id = int(rows[0][0])
        product_name = rows[0][1] or ""

    try:
        count_rows = _run_db_query(
            "SELECT COUNT(*) FROM variants WHERE product_id = %d;" % product_id
        )
        count = int(count_rows[0][0]) if count_rows else 0
    except Exception as e:
        console.print(f"[red]❌ Erreur: {e}[/red]")
        return
    if count == 0:
        console.print("[yellow]⚠️ Aucun variant pour ce produit[/yellow]")
        return

    if not yes:
        if not click.confirm(
            f"Mettre le stock à {stock} pour les {count} variant(s) du produit {product_id} ?"
        ):
            console.print("[yellow]Action annulée[/yellow]")
            return

    if not no_backup:
        try:
            _create_server_backup()
        except Exception as e:
            console.print(f"[red]❌ Backup serveur échoué, aucune modification effectuée: {e}[/red]")
            return

    try:
        _exec_db_sql("UPDATE variants SET stock = %d WHERE product_id = %d;" % (stock, product_id))
        rows = _run_db_query(
            "SELECT v.id, v.sku, v.size, v.color, v.stock FROM variants v "
            "WHERE v.product_id = %d ORDER BY v.id;" % product_id
        )
    except Exception as e:
        console.print(f"[red]❌ Erreur lors de la mise à jour: {e}[/red]")
        return

    table = Table(title=f"Produit {product_id} — tous les variants à stock {stock}")
    table.add_column("ID", style="cyan", justify="right")
    table.add_column("SKU", style="green")
    table.add_column("Taille", style="yellow")
    table.add_column("Couleur", style="magenta")
    table.add_column("Stock", justify="right")
    for r in rows:
        table.add_row(r[0], r[1], r[2] or "", r[3] or "", r[4] or "0")
    console.print(table)
    console.print("[green]✅ %d variant(s) mis à jour[/green]" % len(rows))


@db.command('product-set-active')
@click.option('--id', 'product_id', type=int, required=True, help='ID du produit')
@click.option('--active/--inactive', default=True, help='Activer ou désactiver le produit')
@click.option('--no-backup', is_flag=True, help='Ne pas créer de backup avant modification (déconseillé)')
@click.option('--yes', '-y', is_flag=True, help='Ne pas demander de confirmation')
def db_product_set_active(product_id, active, no_backup, yes):
    """✏️ Activer / désactiver un produit (VPS, avec backup)"""
    state_label = "activer" if active else "désactiver"

    if not yes:
        if not click.confirm(f"{state_label.capitalize()} le produit {product_id} ?"):
            console.print("[yellow]Action annulée[/yellow]")
            return

    if not no_backup:
        try:
            _create_server_backup()
        except Exception as e:
            console.print(f"[red]❌ Backup serveur échoué, aucune modification effectuée: {e}[/red]")
            return

    try:
        _exec_db_sql(
            f"UPDATE products SET is_published = {'TRUE' if active else 'FALSE'} "
            f"WHERE id = {product_id};"
        )
        rows = _run_db_query(
            "SELECT id, name, reference, is_published "
            "FROM products "
            f"WHERE id = {product_id};"
        )
    except Exception as e:
        console.print(f"[red]❌ Erreur lors de la mise à jour: {e}[/red]")
        return

    if not rows:
        console.print("[yellow]⚠️ Aucun produit trouvé avec cet ID[/yellow]")
        return

    r = rows[0]
    table = Table(title="Produit mis à jour (is_published)")
    table.add_column("ID", style="cyan", justify="right")
    table.add_column("Nom", style="green")
    table.add_column("Ref", style="yellow")
    table.add_column("Publié", style="magenta")
    table.add_row(r[0], r[1], r[2] or "", r[3] or "")
    console.print(table)


@db.command('product-set-price')
@click.option('--id', 'product_id', type=int, required=True, help='ID du produit')
@click.option('--price', type=float, required=True, help='Nouveau prix (en EUR)')
@click.option('--no-backup', is_flag=True, help='Ne pas créer de backup avant modification (déconseillé)')
@click.option('--yes', '-y', is_flag=True, help='Ne pas demander de confirmation')
def db_product_set_price(product_id, price, no_backup, yes):
    """✏️ Mettre à jour le prix d'un produit (VPS, avec backup)"""
    if price < 0:
        console.print("[red]❌ Prix négatif interdit[/red]")
        return

    if not yes:
        if not click.confirm(f"Mettre le prix du produit {product_id} à {price:.2f} EUR ?"):
            console.print("[yellow]Action annulée[/yellow]")
            return

    if not no_backup:
        try:
            _create_server_backup()
        except Exception as e:
            console.print(f"[red]❌ Backup serveur échoué, aucune modification effectuée: {e}[/red]")
            return

    try:
        _exec_db_sql(
            f"UPDATE products SET price = {price} "
            f"WHERE id = {product_id};"
        )
        rows = _run_db_query(
            "SELECT id, name, reference, price "
            "FROM products "
            f"WHERE id = {product_id};"
        )
    except Exception as e:
        console.print(f"[red]❌ Erreur lors de la mise à jour: {e}[/red]")
        return

    if not rows:
        console.print("[yellow]⚠️ Aucun produit trouvé avec cet ID[/yellow]")
        return

    r = rows[0]
    table = Table(title="Produit mis à jour (price)")
    table.add_column("ID", style="cyan", justify="right")
    table.add_column("Nom", style="green")
    table.add_column("Ref", style="yellow")
    table.add_column("Prix", style="magenta", justify="right")
    table.add_row(r[0], r[1], r[2] or "", r[3] or "")
    console.print(table)


def _product_edit_string(product_id: int, field: str, value: str, label: str, no_backup: bool, yes: bool) -> bool:
    if not yes and not click.confirm(f"Mettre {label} du produit {product_id} à « {value} » ?"):
        console.print("[yellow]Action annulée[/yellow]")
        return False
    if not no_backup:
        try:
            _create_server_backup()
        except Exception as e:
            console.print(f"[red]❌ Backup serveur échoué: {e}[/red]")
            return False
    esc = value.replace("'", "''")
    _exec_db_sql("UPDATE products SET %s = '%s' WHERE id = %d;" % (field, esc, product_id))
    return True


@db.command('product-set-name')
@click.option('--id', 'product_id', type=int, required=True)
@click.option('--name', type=str, required=True)
@click.option('--no-backup', is_flag=True)
@click.option('--yes', '-y', is_flag=True)
def db_product_set_name(product_id, name, no_backup, yes):
    """✏️ Changer le nom d'un produit (VPS, avec backup)"""
    if not _product_edit_string(product_id, "name", name, "le nom", no_backup, yes):
        return
    rows = _run_db_query("SELECT id, name, reference FROM products WHERE id = %d;" % product_id)
    if rows:
        r = rows[0]
        table = Table(title="Produit mis à jour (name)")
        table.add_column("ID", style="cyan", justify="right")
        table.add_column("Nom", style="green")
        table.add_column("Ref", style="yellow")
        table.add_row(r[0], r[1], r[2] or "")
        console.print(table)


@db.command('product-set-ref')
@click.option('--id', 'product_id', type=int, required=True)
@click.option('--ref', 'reference', type=str, required=True)
@click.option('--no-backup', is_flag=True)
@click.option('--yes', '-y', is_flag=True)
def db_product_set_ref(product_id, reference, no_backup, yes):
    """✏️ Changer la référence d'un produit (VPS, avec backup)"""
    if not _product_edit_string(product_id, "reference", reference, "la référence", no_backup, yes):
        return
    rows = _run_db_query("SELECT id, name, reference FROM products WHERE id = %d;" % product_id)
    if rows:
        r = rows[0]
        table = Table(title="Produit mis à jour (reference)")
        table.add_column("ID", style="cyan", justify="right")
        table.add_column("Nom", style="green")
        table.add_column("Ref", style="yellow")
        table.add_row(r[0], r[1], r[2] or "")
        console.print(table)


@db.command('product-set-category')
@click.option('--id', 'product_id', type=int, required=True)
@click.option('--category-id', type=int, required=True)
@click.option('--no-backup', is_flag=True)
@click.option('--yes', '-y', is_flag=True)
def db_product_set_category(product_id, category_id, no_backup, yes):
    """✏️ Changer la catégorie d'un produit (VPS, avec backup)"""
    if not yes and not click.confirm(f"Mettre la catégorie du produit {product_id} à {category_id} ?"):
        console.print("[yellow]Action annulée[/yellow]")
        return
    if not no_backup:
        try:
            _create_server_backup()
        except Exception as e:
            console.print(f"[red]❌ Backup serveur échoué: {e}[/red]")
            return False
    _exec_db_sql("UPDATE products SET category_id = %d WHERE id = %d;" % (category_id, product_id))
    rows = _run_db_query(
        "SELECT p.id, p.name, p.category_id, c.name FROM products p "
        "LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = %d;" % product_id
    )
    if rows:
        r = rows[0]
        table = Table(title="Produit mis à jour (category)")
        table.add_column("ID", style="cyan", justify="right")
        table.add_column("Nom", style="green")
        table.add_column("category_id", justify="right")
        table.add_column("Catégorie", style="yellow")
        table.add_row(r[0], r[1], r[2] or "", r[3] or "")
        console.print(table)


@db.command('product-set-brand')
@click.option('--id', 'product_id', type=int, required=True)
@click.option('--brand-id', type=int, required=True)
@click.option('--no-backup', is_flag=True)
@click.option('--yes', '-y', is_flag=True)
def db_product_set_brand(product_id, brand_id, no_backup, yes):
    """✏️ Changer la marque d'un produit (VPS, avec backup)"""
    if not yes and not click.confirm(f"Mettre la marque du produit {product_id} à {brand_id} ?"):
        console.print("[yellow]Action annulée[/yellow]")
        return
    if not no_backup:
        try:
            _create_server_backup()
        except Exception as e:
            console.print(f"[red]❌ Backup serveur échoué: {e}[/red]")
            return
    _exec_db_sql("UPDATE products SET brand_id = %d WHERE id = %d;" % (brand_id, product_id))
    rows = _run_db_query(
        "SELECT p.id, p.name, p.brand_id, b.name FROM products p "
        "LEFT JOIN brands b ON b.id = p.brand_id WHERE p.id = %d;" % product_id
    )
    if rows:
        r = rows[0]
        table = Table(title="Produit mis à jour (brand)")
        table.add_column("ID", style="cyan", justify="right")
        table.add_column("Nom", style="green")
        table.add_column("brand_id", justify="right")
        table.add_column("Marque", style="yellow")
        table.add_row(r[0], r[1], r[2] or "", r[3] or "")
        console.print(table)


@db.command('product-set-collection')
@click.option('--id', 'product_id', type=int, required=True)
@click.option('--collection-id', type=int, required=True)
@click.option('--no-backup', is_flag=True)
@click.option('--yes', '-y', is_flag=True)
def db_product_set_collection(product_id, collection_id, no_backup, yes):
    """✏️ Changer la collection d'un produit (VPS, avec backup)"""
    if not yes and not click.confirm(f"Mettre la collection du produit {product_id} à {collection_id} ?"):
        console.print("[yellow]Action annulée[/yellow]")
        return
    if not no_backup:
        try:
            _create_server_backup()
        except Exception as e:
            console.print(f"[red]❌ Backup serveur échoué: {e}[/red]")
            return
    _exec_db_sql("UPDATE products SET collection_id = %d WHERE id = %d;" % (collection_id, product_id))
    rows = _run_db_query(
        "SELECT p.id, p.name, p.collection_id, c.name FROM products p "
        "LEFT JOIN collections c ON c.id = p.collection_id WHERE p.id = %d;" % product_id
    )
    if rows:
        r = rows[0]
        table = Table(title="Produit mis à jour (collection)")
        table.add_column("ID", style="cyan", justify="right")
        table.add_column("Nom", style="green")
        table.add_column("collection_id", justify="right")
        table.add_column("Collection", style="yellow")
        table.add_row(r[0], r[1], r[2] or "", r[3] or "")
        console.print(table)


@db.group()
def seed():
    """Commandes pour seed la base de données"""
    pass

@seed.command('brands')
@click.option('--local', is_flag=True, help='Utiliser le container local (reboulstore-postgres)')
@click.option('--container', type=str, help='Nom du container PostgreSQL (override)')
def seed_brands(local, container):
    """🌱 Importer les brands depuis brands-data-with-urls.json"""
    from commands.db_seed import seed_brands as seed_brands_func
    
    seed_brands_func(local=local, container_name=container)

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

@db.command('backup')
@click.option('--local', is_flag=True, help='Backup de la base de données locale (docker-compose.yml)')
@click.option('--server', is_flag=True, help='Backup sur le serveur distant (VPS)')
@click.option('--container', type=str, help='Nom du container PostgreSQL (par défaut: auto-détecté)')
@click.option('--db-name', type=str, help='Nom de la base de données (par défaut: reboulstore_db)')
@click.option('--db-user', type=str, help='Utilisateur PostgreSQL (par défaut: reboulstore)')
@click.option('--backup-dir', type=str, default='./backups', help='Répertoire de sauvegarde (défaut: ./backups)')
@click.option('--keep', type=int, default=30, help='Nombre de backups à conserver (défaut: 30)')
def backup_db(local, server, container, db_name, db_user, backup_dir, keep):
    """💾 Créer un backup de la base de données"""
    from utils.backup_helper import create_backup, get_container_name
    
    if server:
        # Backup sur serveur distant
        from utils.server_helper import ssh_exec, SERVER_CONFIG
        import subprocess
        
        container_name = container or get_container_name(local=False)
        db_name = db_name or 'reboulstore_db'
        db_user = db_user or 'reboulstore'
        project_dir = SERVER_CONFIG['project_path']
        server_backup_dir = f"{project_dir}/backups"
        
        console.print(f"[cyan]💾 Création du backup sur le serveur distant...[/cyan]")
        console.print(f"[blue]Container: {container_name}[/blue]")
        console.print(f"[blue]Base de données: {db_name}[/blue]\n")
        
        # Exécuter le backup sur le serveur
        # Générer le timestamp en Python pour éviter le problème $TIMESTAMP littéral
        from datetime import datetime
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_file = f"{server_backup_dir}/reboulstore_db_{timestamp}.sql"
        backup_cmd = (
            f"cd {project_dir} && "
            f"mkdir -p {server_backup_dir} && "
            f"docker exec {container_name} pg_dump -U {db_user} -d {db_name} > \"{backup_file}\" && "
            f"gzip \"{backup_file}\" && "
            f"echo 'Backup créé: {backup_file}.gz' && "
            f"ls -lh \"{backup_file}.gz\" | awk '{{print $5}}'"
        )
        
        stdout, stderr = ssh_exec(backup_cmd)
        
        if stdout and 'Backup créé:' in stdout:
            console.print(f"[green]✅ Backup créé sur le serveur: {server_backup_dir}[/green]")
            console.print(stdout)
        else:
            console.print(f"[red]❌ Erreur lors du backup: {stderr or stdout}[/red]")
    else:
        # Backup local
        container_name = container or get_container_name(local)
        db_name = db_name or 'reboulstore_db'
        db_user = db_user or 'reboulstore'
        
        console.print(f"[cyan]💾 Création du backup de la base de données...[/cyan]")
        console.print(f"[blue]Container: {container_name}[/blue]")
        console.print(f"[blue]Base de données: {db_name}[/blue]\n")
        
        success, message, backup_file = create_backup(
            backup_dir=backup_dir,
            container_name=container_name,
            db_name=db_name,
            db_user=db_user,
            local=local,
            keep_count=keep
        )
        
        if success:
            console.print(f"[green]✅ {message}[/green]")
        else:
            console.print(f"[red]❌ {message}[/red]")

@db.command('backup-list')
@click.option('--backup-dir', type=str, default='./backups', help='Répertoire de sauvegarde (défaut: ./backups)')
def list_backups_cmd(backup_dir):
    """📋 Lister tous les backups disponibles"""
    from utils.backup_helper import list_backups
    from rich.table import Table
    
    console.print(f"[cyan]📋 Liste des backups disponibles...[/cyan]\n")
    
    backups = list_backups(backup_dir)
    
    if not backups:
        console.print(f"[yellow]⚠️  Aucun backup trouvé dans {backup_dir}[/yellow]")
        return
    
    table = Table(title=f"Backups disponibles ({len(backups)})")
    table.add_column("Date", style="cyan")
    table.add_column("Fichier", style="green")
    table.add_column("Taille", style="yellow", justify="right")
    
    for backup in backups:
        table.add_row(
            backup['date_str'],
            backup['name'],
            f"{backup['size_mb']:.2f} MB"
        )
    
    console.print(table)

@db.command('backup-restore')
@click.argument('backup_file', type=str)
@click.option('--local', is_flag=True, help='Restaurer sur la base de données locale')
@click.option('--container', type=str, help='Nom du container PostgreSQL')
@click.option('--db-name', type=str, help='Nom de la base de données')
@click.option('--db-user', type=str, help='Utilisateur PostgreSQL')
@click.option('--yes', '-y', is_flag=True, help='Confirmer automatiquement (danger!)')
def restore_backup_cmd(backup_file, local, container, db_name, db_user, yes):
    """🔄 Restaurer un backup de la base de données"""
    from utils.backup_helper import restore_backup, get_container_name
    
    container_name = container or get_container_name(local)
    db_name = db_name or 'reboulstore_db'
    db_user = db_user or 'reboulstore'
    
    console.print(f"[bold red]⚠️  ATTENTION: Cette opération va écraser la base de données actuelle ![/bold red]")
    console.print(f"[yellow]Container: {container_name}[/yellow]")
    console.print(f"[yellow]Base de données: {db_name}[/yellow]")
    console.print(f"[yellow]Fichier: {backup_file}[/yellow]\n")
    
    if not yes:
        confirm = click.confirm("Êtes-vous sûr de vouloir continuer ?")
        if not confirm:
            console.print("[yellow]Restauration annulée[/yellow]")
            return
    
    console.print(f"[cyan]🔄 Restauration en cours...[/cyan]\n")
    
    success, message = restore_backup(
        backup_file=backup_file,
        container_name=container_name,
        db_name=db_name,
        db_user=db_user,
        local=local
    )
    
    if success:
        console.print(f"[green]✅ {message}[/green]")
    else:
        console.print(f"[red]❌ {message}[/red]")

@db.command('backup-delete')
@click.argument('backup_file', type=str)
@click.option('--yes', '-y', is_flag=True, help='Confirmer automatiquement')
def delete_backup_cmd(backup_file, yes):
    """🗑️  Supprimer un backup"""
    from utils.backup_helper import delete_backup

    if not yes:
        confirm = click.confirm(f"Supprimer le backup {backup_file} ?")
        if not confirm:
            console.print("[yellow]Suppression annulée[/yellow]")
            return

    console.print(f"[cyan]🗑️  Suppression du backup...[/cyan]\n")

    success, message = delete_backup(backup_file)

    if success:
        console.print(f"[green]✅ {message}[/green]")
    else:
        console.print(f"[red]❌ {message}[/red]")


@db.command('wipe-products-by-collection')
@click.option('--collection', '-c', default='SS26', help='Nom de la collection (ex: SS26)')
@click.option('--no-backup', is_flag=True, help='Ne pas faire de backup avant (déconseillé)')
@click.option('--yes', '-y', is_flag=True, help='Confirmer sans demander')
def wipe_products_by_collection_cmd(collection, no_backup, yes):
    """🗑️ Supprimer uniquement les produits (et variants, images) d'une collection donnée (ex. SS26)."""
    coll_esc = collection.replace("'", "''")
    if not yes:
        console.print("[yellow]⚠️  Ceci va SUPPRIMER tous les produits de la collection « %s » (variants + images liés).[/yellow]" % collection)
        if not click.confirm("Continuer ?"):
            console.print("[yellow]Annulé.[/yellow]")
            return
    if not no_backup:
        console.print("[cyan]💾 Backup avant purge...[/cyan]")
        _create_server_backup()
        console.print("[green]✅ Backup créé[/green]")
    try:
        rows = _run_db_query("SELECT id FROM collections WHERE name = '%s' LIMIT 1;" % coll_esc)
        if not rows:
            console.print("[red]❌ Collection « %s » introuvable[/red]" % collection)
            return
        cid = rows[0][0]
        _exec_db_sql(
            "DELETE FROM cart_items WHERE variant_id IN "
            "(SELECT id FROM variants WHERE product_id IN (SELECT id FROM products WHERE collection_id = %s));" % cid
        )
        _exec_db_sql("DELETE FROM images WHERE product_id IN (SELECT id FROM products WHERE collection_id = %s);" % cid)
        _exec_db_sql("DELETE FROM variants WHERE product_id IN (SELECT id FROM products WHERE collection_id = %s);" % cid)
        _exec_db_sql("DELETE FROM products WHERE collection_id = %s;" % cid)
        console.print("[green]✅ Produits/variants/images de la collection « %s » supprimés[/green]" % collection)
    except Exception as e:
        console.print("[red]❌ %s[/red]" % e)


@db.command('category-create')
@click.option('--name', '-n', required=True, help='Nom de la catégorie (ex: bermuda, jogging molleton)')
@click.option('--no-backup', is_flag=True, help='Ne pas faire de backup avant')
@click.option('--yes', '-y', is_flag=True, help='Confirmer sans demander')
def db_category_create(name, no_backup, yes):
    """➕ Créer une catégorie si elle n'existe pas (slug = nom normalisé)."""
    slug = name.strip().lower().replace(' ', '-').replace("'", "")
    for c in ("/", "\\", "'"):
        slug = slug.replace(c, "")
    if not slug:
        console.print("[red]❌ Nom invalide[/red]")
        return
    try:
        rows = _run_db_query("SELECT id, name FROM categories WHERE slug = '%s' LIMIT 1;" % slug.replace("'", "''"))
        if rows:
            console.print("[green]✅ Catégorie déjà existante : %s (id=%s)[/green]" % (rows[0][1], rows[0][0]))
            return
        if not yes and not click.confirm("Créer la catégorie « %s » (slug=%s) ?" % (name, slug)):
            return
        if not no_backup:
            _create_server_backup()
        name_esc = name.strip().replace("'", "''")
        _exec_db_sql("INSERT INTO categories (name, slug) VALUES ('%s', '%s');" % (name_esc, slug.replace("'", "''")))
        rows = _run_db_query("SELECT id, name, slug FROM categories WHERE slug = '%s';" % slug.replace("'", "''"))
        if rows:
            console.print("[green]✅ Catégorie créée : %s (id=%s, slug=%s)[/green]" % (rows[0][1], rows[0][0], rows[0][2]))
    except Exception as e:
        console.print("[red]❌ %s[/red]" % e)


@db.command('wipe-products')
@click.option('--server', is_flag=True, help='Exécuter sur le serveur VPS (SSH)')
@click.option('--no-backup', is_flag=True, help='Ne pas faire de backup avant (déconseillé)')
@click.option('--yes', '-y', is_flag=True, help='Confirmer sans demander')
def wipe_products_cmd(server, no_backup, yes):
    """🗑️  Vider les tables produits, variants, images, collections (ordre FK respecté)"""
    from pathlib import Path
    import subprocess

    project_root = Path(__file__).resolve().parent.parent
    script_path = project_root / 'scripts' / 'wipe-products-collections.sql'
    if not script_path.exists():
        console.print(f"[red]❌ Script introuvable: {script_path}[/red]")
        return

    if not yes:
        console.print("[yellow]⚠️  Ceci va TRUNCATER : cart_items, stock_notifications, images, variants, products, collections.[/yellow]")
        if not click.confirm("Continuer ?"):
            console.print("[yellow]Annulé.[/yellow]")
            return

    if not no_backup:
        if server:
            console.print("[cyan]💾 Backup avant purge (serveur)...[/cyan]")
            from utils.server_helper import ssh_exec, SERVER_CONFIG
            from datetime import datetime
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            project_dir = SERVER_CONFIG['project_path']
            backup_dir = f"{project_dir}/backups"
            backup_cmd = (
                f"cd {project_dir} && mkdir -p {backup_dir} && "
                f"docker exec reboulstore-postgres-prod pg_dump -U reboulstore -d reboulstore_db | gzip > {backup_dir}/reboulstore_db_{timestamp}.sql.gz && "
                f"echo 'Backup créé'"
            )
            stdout, stderr = ssh_exec(backup_cmd)
            if 'Backup créé' not in (stdout or ''):
                console.print(f"[red]❌ Échec backup: {stderr or stdout}[/red]")
                return
            console.print("[green]✅ Backup serveur créé[/green]")
        else:
            console.print("[yellow]💡 Pour un backup avant purge (DB sur VPS) : ./rcli db backup --server[/yellow]")

    if server:
        from utils.server_helper import SERVER_CONFIG
        ssh_target = f"{SERVER_CONFIG['user']}@{SERVER_CONFIG['host']}"
        remote_cmd = "docker exec -i reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db"
        ssh_cmd = [
            'ssh', '-o', 'ConnectTimeout=10', '-o', 'StrictHostKeyChecking=no',
            '-o', 'UserKnownHostsFile=/dev/null', '-o', 'LogLevel=ERROR',
            ssh_target, remote_cmd,
        ]
        with open(script_path) as f:
            result = subprocess.run(ssh_cmd, stdin=f, capture_output=True, text=True, timeout=60)
        if result.returncode != 0:
            console.print(f"[red]❌ Erreur: {result.stderr or result.stdout}[/red]")
            return
        console.print("[green]✅ Tables produits/variants/images/collections vidées (serveur)[/green]")
    else:
        try:
            from dotenv import load_dotenv
            load_dotenv(project_root / '.env')
            import os
            host = os.getenv('DB_HOST', 'localhost')
            if host == 'host.docker.internal':
                host = 'localhost'
            port = os.getenv('DB_PORT', '5433' if host == 'localhost' else '5432')
            user = os.getenv('DB_USERNAME', 'reboulstore')
            dbname = os.getenv('DB_DATABASE', 'reboulstore_db')
            password = os.getenv('DB_PASSWORD', '')
            env = os.environ.copy()
            if password:
                env['PGPASSWORD'] = password
            result = subprocess.run(
                ['psql', '-h', host, '-p', str(port), '-U', user, '-d', dbname, '-f', str(script_path)],
                env=env,
                capture_output=True,
                text=True,
                timeout=30,
            )
            if result.returncode != 0:
                console.print(f"[red]❌ Erreur psql: {result.stderr or result.stdout}[/red]")
                return
            console.print("[green]✅ Tables produits/variants/images/collections vidées[/green]")
        except FileNotFoundError:
            console.print("[red]❌ psql non trouvé. Lancez le wipe sur le serveur : ./rcli db wipe-products --server -y[/red]")
        except Exception as e:
            console.print(f"[red]❌ {e}[/red]")


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

    # Images IA (phase 24.10 – Gemini)
    from commands.images import images as images_group
    cli.add_command(images_group, 'images')
except ImportError as e:
    # Les commandes serveur sont optionnelles si les dépendances ne sont pas installées
    pass

@cli.group()
def shop():
    """Gérer les shops (livraison, retours)"""
    pass


@shop.command('list')
@click.option('--backend', 'backend_url', default='http://localhost:3001', help='URL du backend')
def shop_list(backend_url):
    """Lister les shops et leurs politiques"""
    from commands.shop import list_shops
    shops = list_shops(backend_url)
    t = Table(title='Shops')
    t.add_column('ID', style='cyan', width=4)
    t.add_column('Nom', style='white')
    t.add_column('Livraison', style='green')
    t.add_column('Retours', style='yellow')
    for s in shops:
        ship = s.get('shippingPolicy') or {}
        ret = s.get('returnPolicy') or {}
        ship_str = f"gratuit dès {ship['freeShippingThreshold']}€ · {ship.get('deliveryTime','?')}" if ship else '—'
        ret_str = f"{ret['returnWindow']}j" if ret.get('returnWindow') else ('—' if not ret else 'configuré')
        t.add_row(str(s['id']), s['name'], ship_str, ret_str)
    console.print(t)


@shop.command('set-shipping')
@click.argument('shop_id', type=int)
@click.option('--free-above', type=float, help='Livraison gratuite au-dessus de X€')
@click.option('--cost', help='Frais de port (ex: "€4,90")')
@click.option('--delay', help='Délai de livraison (ex: "3-5 jours ouvrés")')
@click.option('--international/--no-international', default=None, help='Livraison internationale')
@click.option('--description', help='Texte libre (remplace tout)')
@click.option('--backend', 'backend_url', default='http://localhost:3001')
def shop_set_shipping(shop_id, free_above, cost, delay, international, description, backend_url):
    """Configurer la politique de livraison d'un shop"""
    from commands.shop import get_shop, patch_shop
    current = get_shop(backend_url, shop_id).get('shippingPolicy') or {}
    if free_above is not None: current['freeShippingThreshold'] = free_above
    if cost: current['shippingCost'] = cost
    if delay: current['deliveryTime'] = delay
    if international is not None: current['internationalShipping'] = international
    if description: current['description'] = description
    result = patch_shop(backend_url, shop_id, {'shippingPolicy': current})
    console.print(f"[green]✓ Livraison mise à jour — shop {shop_id}[/green]")
    console.print(json.dumps(result.get('shippingPolicy'), indent=2, ensure_ascii=False))


@shop.command('set-returns')
@click.argument('shop_id', type=int)
@click.option('--window', type=int, help='Délai de retour en jours (ex: 14)')
@click.option('--free/--no-free', default=None, help='Frais de retour offerts')
@click.option('--conditions', help='Conditions texte libre')
@click.option('--backend', 'backend_url', default='http://localhost:3001')
def shop_set_returns(shop_id, window, free, conditions, backend_url):
    """Configurer la politique de retour d'un shop"""
    from commands.shop import get_shop, patch_shop
    current = get_shop(backend_url, shop_id).get('returnPolicy') or {}
    if window is not None: current['returnWindow'] = window
    if free is not None: current['returnShippingFree'] = free
    if conditions: current['conditions'] = conditions
    result = patch_shop(backend_url, shop_id, {'returnPolicy': current})
    console.print(f"[green]✓ Retours mis à jour — shop {shop_id}[/green]")
    console.print(json.dumps(result.get('returnPolicy'), indent=2, ensure_ascii=False))


if __name__ == '__main__':
    cli()


