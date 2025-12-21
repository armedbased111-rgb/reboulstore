"""
Commandes pour déployer sur le serveur VPS
"""
import click
from rich.console import Console
from rich.table import Table
from rich import box
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.server_helper import ssh_exec, docker_compose_exec, check_url, SERVER_CONFIG

console = Console()

@click.group('deploy')
def deploy_group():
    """Commandes pour déployer sur le serveur"""
    pass

# Alias pour compatibilité
deploy = deploy_group


@deploy_group.command('check')
@click.option('--service', type=click.Choice(['reboul', 'admin', 'all']), default='all', help='Service à vérifier')
def check(service: str):
    """Vérifie que le déploiement fonctionne (healthchecks, APIs)"""
    console.print("[bold]🔍 Vérification du déploiement...[/bold]\n")
    
    results = {}
    
    if service in ['reboul', 'all']:
        console.print("[cyan]Reboul Store:[/cyan]")
        results['reboul_frontend'] = check_url('http://www.reboulstore.com')
        results['reboul_backend'] = check_url('http://www.reboulstore.com/health')
        results['reboul_api'] = check_url('http://www.reboulstore.com/api/products')
    
    if service in ['admin', 'all']:
        console.print("[cyan]Admin Central:[/cyan]")
        results['admin_frontend'] = check_url('http://admin.reboulstore.com')
        results['admin_backend'] = check_url('http://admin.reboulstore.com/health')
    
    # Afficher les résultats
    table = Table(title="Résultats de vérification", box=box.ROUNDED)
    table.add_column("Service", style="cyan")
    table.add_column("Status", style="green")
    table.add_column("HTTP Code", style="yellow")
    
    for name, (success, code, _) in results.items():
        status = "✅ OK" if success else "❌ ERREUR"
        style = "green" if success else "red"
        table.add_row(
            name.replace('_', ' ').title(),
            f"[{style}]{status}[/{style}]",
            str(code) if code else "N/A"
        )
    
    console.print(table)
    
    # Résumé
    total = len(results)
    passed = sum(1 for s, _, _ in results.values() if s)
    
    if passed == total:
        console.print(f"\n[green]✅ Tous les tests passent ({passed}/{total})[/green]")
    else:
        console.print(f"\n[red]❌ {total - passed} test(s) échoué(s) ({passed}/{total})[/red]")


@deploy_group.command('deploy')
@click.option('--service', type=click.Choice(['reboul', 'admin', 'all']), default='all', help='Service à déployer')
@click.option('--build', is_flag=True, help='Rebuild les images Docker')
@click.option('--pull', is_flag=True, help='Pull les dernières modifications git')
def deploy(service: str, build: bool, pull: bool):
    """Déploie les services sur le serveur"""
    console.print(f"[bold]🚀 Déploiement de {service}...[/bold]\n")
    
    if pull:
        console.print("[yellow]Pull des dernières modifications git...[/yellow]")
        stdout, stderr = ssh_exec("git pull origin main", cwd=SERVER_CONFIG['project_path'])
        if stdout:
            console.print(f"[green]✅ {stdout}[/green]")
        if stderr and 'warning' not in stderr.lower():
            console.print(f"[yellow]{stderr}[/yellow]")
    
    project_dir = SERVER_CONFIG['project_path']
    compose_file = 'docker-compose.prod.yml'
    
    if service == 'admin':
        project_dir = SERVER_CONFIG['admin_path']
    
    cmd_parts = ['up', '-d']
    if build:
        cmd_parts.append('--build')
    
    if service == 'all':
        # Déployer Reboul Store
        console.print("[cyan]Déploiement Reboul Store...[/cyan]")
        stdout, stderr = docker_compose_exec(' '.join(cmd_parts), compose_file=compose_file, cwd=SERVER_CONFIG['project_path'])
        if stdout:
            console.print(f"[green]✅ Reboul Store déployé[/green]")
        
        # Déployer Admin Central
        console.print("[cyan]Déploiement Admin Central...[/cyan]")
        stdout, stderr = docker_compose_exec(' '.join(cmd_parts), compose_file=compose_file, cwd=SERVER_CONFIG['admin_path'])
        if stdout:
            console.print(f"[green]✅ Admin Central déployé[/green]")
    else:
        stdout, stderr = docker_compose_exec(' '.join(cmd_parts), compose_file=compose_file, cwd=project_dir)
        if stdout:
            console.print(f"[green]✅ {service} déployé avec succès[/green]")
    
    if stderr and 'warning' not in stderr.lower():
        console.print(f"[yellow]{stderr}[/yellow]")


@deploy_group.command('update')
@click.option('--pull', is_flag=True, help='Pull git avant déploiement')
@click.option('--rebuild', is_flag=True, help='Rebuild les images')
def update(pull: bool, rebuild: bool):
    """Met à jour le code depuis git et redémarre"""
    console.print("[bold]🔄 Mise à jour du serveur...[/bold]\n")
    
    if pull:
        console.print("[yellow]Pull des modifications...[/yellow]")
        stdout, stderr = ssh_exec("git pull origin main", cwd=SERVER_CONFIG['project_path'])
        if stdout:
            console.print(f"[green]✅ {stdout}[/green]")
    
    # Redémarrer avec rebuild si demandé
    cmd_parts = ['up', '-d']
    if rebuild:
        cmd_parts.append('--build')
        console.print("[yellow]Rebuild des images...[/yellow]")
    
    # Reboul Store
    console.print("[cyan]Mise à jour Reboul Store...[/cyan]")
    stdout, stderr = docker_compose_exec(' '.join(cmd_parts), cwd=SERVER_CONFIG['project_path'])
    
    # Admin Central
    console.print("[cyan]Mise à jour Admin Central...[/cyan]")
    stdout, stderr = docker_compose_exec(' '.join(cmd_parts), cwd=SERVER_CONFIG['admin_path'])
    
    console.print("\n[green]✅ Mise à jour terminée[/green]")
