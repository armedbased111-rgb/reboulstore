"""
Commandes pour gérer les logs
"""
import click
from rich.console import Console
from rich.table import Table
from rich import box
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.server_helper import ssh_exec, docker_compose_exec, SERVER_CONFIG

console = Console()

@click.group('logs')
def logs_group():
    """Commandes pour gérer les logs"""
    pass

# Alias pour compatibilité
logs = logs_group


@logs_group.command('errors')
@click.option('--service', type=str, help='Service spécifique')
@click.option('--last', type=str, default='24h', help='Période (ex: 24h, 1h, 30m)')
@click.option('--admin', is_flag=True, help='Logs Admin Central')
def errors(service: str, last: str, admin: bool):
    """Filtre et affiche uniquement les erreurs"""
    project_dir = SERVER_CONFIG['admin_path'] if admin else SERVER_CONFIG['project_path']
    compose_file = 'docker-compose.prod.yml'
    
    # Construire la commande pour filtrer les erreurs
    cmd = f"logs --tail=1000 {'--since=' + last if last else ''} | grep -i 'error\\|exception\\|failed\\|warning\\|fatal'"
    
    if service:
        stdout, stderr = docker_compose_exec(cmd, compose_file=compose_file, service=service, cwd=project_dir)
    else:
        stdout, stderr = docker_compose_exec(cmd, compose_file=compose_file, cwd=project_dir)
    
    if stdout:
        console.print("[bold red]Erreurs trouvées:[/bold red]\n")
        console.print(stdout)
    else:
        console.print("[green]✅ Aucune erreur trouvée[/green]")


@logs_group.command('search')
@click.argument('pattern', required=True)
@click.option('--service', type=str, help='Service spécifique')
@click.option('--last', type=str, default='1h', help='Période (ex: 24h, 1h, 30m)')
@click.option('--admin', is_flag=True, help='Logs Admin Central')
def search(pattern: str, service: str, last: str, admin: bool):
    """Recherche dans les logs"""
    project_dir = SERVER_CONFIG['admin_path'] if admin else SERVER_CONFIG['project_path']
    compose_file = 'docker-compose.prod.yml'
    
    cmd = f"logs --tail=1000 {'--since=' + last if last else ''} | grep -i '{pattern}'"
    
    if service:
        stdout, stderr = docker_compose_exec(cmd, compose_file=compose_file, service=service, cwd=project_dir)
    else:
        stdout, stderr = docker_compose_exec(cmd, compose_file=compose_file, cwd=project_dir)
    
    if stdout:
        console.print(f"[bold]Résultats pour '{pattern}':[/bold]\n")
        console.print(stdout)
    else:
        console.print(f"[yellow]Aucun résultat trouvé pour '{pattern}'[/yellow]")
