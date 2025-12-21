"""
Commandes pour gérer le serveur VPS
"""
import click
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich import box
from typing import Optional
import sys
import os

# Ajouter le répertoire parent au path pour les imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.server_helper import (
    ssh_exec, docker_compose_exec, get_container_status, 
    SERVER_CONFIG, format_size
)

console = Console()

@click.group('server')
def server_group():
    """Commandes pour gérer le serveur VPS"""
    pass

# Alias pour compatibilité
server = server_group


@server.command('status')
@click.option('--service', type=str, help='Service spécifique à vérifier')
@click.option('--admin', is_flag=True, help='Vérifier Admin Central au lieu de Reboul Store')
def status(service: Optional[str], admin: bool):
    """Affiche l'état de tous les containers"""
    project_dir = SERVER_CONFIG['admin_path'] if admin else SERVER_CONFIG['project_path']
    compose_file = 'docker-compose.prod.yml'
    
    # Récupérer le statut des containers
    stdout, stderr = docker_compose_exec(
        'ps --format "table {{.Name}}\\t{{.Status}}\\t{{.Ports}}"',
        compose_file=compose_file,
        cwd=project_dir
    )
    
    if stderr and 'warning' not in stderr.lower():
        console.print(f"[red]Erreur: {stderr}[/red]")
        return
    
    # Créer un tableau formaté
    table = Table(title=f"État des containers ({'Admin Central' if admin else 'Reboul Store'})", box=box.ROUNDED)
    table.add_column("Container", style="cyan")
    table.add_column("Status", style="green")
    table.add_column("Ports", style="yellow")
    
    # Parser la sortie
    lines = stdout.strip().split('\n')
    if len(lines) > 1:
        for line in lines[1:]:  # Skip header
            if line.strip():
                parts = line.split('\t')
                if len(parts) >= 2:
                    name = parts[0].strip()
                    status_text = parts[1].strip()
                    ports = parts[2].strip() if len(parts) > 2 else ""
                    
                    # Colorier le status
                    if 'healthy' in status_text.lower() or 'up' in status_text.lower():
                        status_style = "green"
                    elif 'unhealthy' in status_text.lower() or 'down' in status_text.lower():
                        status_style = "red"
                    else:
                        status_style = "yellow"
                    
                    table.add_row(name, f"[{status_style}]{status_text}[/{status_style}]", ports)
    
    console.print(table)


@server_group.command('logs')
@click.argument('service', required=False)
@click.option('--tail', type=int, default=100, help='Nombre de lignes à afficher')
@click.option('--follow', '-f', is_flag=True, help='Suivre les logs en temps réel')
@click.option('--errors', is_flag=True, help='Filtrer uniquement les erreurs')
@click.option('--admin', is_flag=True, help='Logs Admin Central')
def logs(service: Optional[str], tail: int, follow: bool, errors: bool, admin: bool):
    """Affiche les logs d'un service ou tous les services"""
    project_dir = SERVER_CONFIG['admin_path'] if admin else SERVER_CONFIG['project_path']
    compose_file = 'docker-compose.prod.yml'
    
    cmd_parts = ['logs', f'--tail={tail}']
    
    if follow:
        cmd_parts.append('--follow')
    
    if errors:
        cmd_parts.append('| grep -i "error\\|exception\\|failed\\|warning"')
    
    cmd = ' '.join(cmd_parts)
    
    if service:
        stdout, stderr = docker_compose_exec(cmd, compose_file=compose_file, service=service, cwd=project_dir)
    else:
        stdout, stderr = docker_compose_exec(cmd, compose_file=compose_file, cwd=project_dir)
    
    if stdout:
        console.print(stdout)
    if stderr and 'warning' not in stderr.lower():
        console.print(f"[yellow]{stderr}[/yellow]")


@server.command('restart')
@click.argument('service', required=False)
@click.option('--admin', is_flag=True, help='Redémarrer Admin Central')
def restart(service: Optional[str], admin: bool):
    """Redémarre un service ou tous les services"""
    project_dir = SERVER_CONFIG['admin_path'] if admin else SERVER_CONFIG['project_path']
    compose_file = 'docker-compose.prod.yml'
    
    service_name = service or 'all services'
    console.print(f"[yellow]Redémarrage de {service_name}...[/yellow]")
    
    stdout, stderr = docker_compose_exec('restart', compose_file=compose_file, service=service, cwd=project_dir)
    
    if stdout:
        console.print(f"[green]✅ {service_name} redémarré avec succès[/green]")
        console.print(stdout)
    if stderr and 'warning' not in stderr.lower():
        console.print(f"[red]Erreur: {stderr}[/red]")


@server_group.command('ps')
@click.option('--admin', is_flag=True, help='Containers Admin Central')
def ps(admin: bool):
    """Liste les containers avec détails (ports, status, uptime)"""
    project_dir = SERVER_CONFIG['admin_path'] if admin else SERVER_CONFIG['project_path']
    compose_file = 'docker-compose.prod.yml'
    
    stdout, stderr = docker_compose_exec('ps', compose_file=compose_file, cwd=project_dir)
    
    if stdout:
        console.print(f"\n[bold]{'Admin Central' if admin else 'Reboul Store'} Containers:[/bold]")
        console.print(stdout)
    if stderr and 'warning' not in stderr.lower():
        console.print(f"[red]Erreur: {stderr}[/red]")


@server.command('resources')
def resources():
    """Affiche l'utilisation des ressources (CPU, RAM, disque, réseau)"""
    # Docker stats
    console.print("[bold]Docker Containers Resources:[/bold]")
    stdout, stderr = ssh_exec("docker stats --no-stream --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}'", 
                             cwd=SERVER_CONFIG['project_path'])
    
    if stdout:
        console.print(stdout)
    
    # System resources
    console.print("\n[bold]System Resources:[/bold]")
    
    # CPU
    cpu_cmd = "top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1\"%\"}'"
    cpu, _ = ssh_exec(cpu_cmd)
    console.print(f"CPU Usage: [cyan]{cpu.strip()}[/cyan]")
    
    # Memory
    mem_cmd = "free -h | awk '/^Mem:/ {print $3\"/\"$2}'"
    mem, _ = ssh_exec(mem_cmd)
    console.print(f"Memory: [cyan]{mem.strip()}[/cyan]")
    
    # Disk
    disk_cmd = "df -h / | awk 'NR==2 {print $3\"/\"$2\" (\"$5\" utilisé)\"}'"
    disk, _ = ssh_exec(disk_cmd)
    console.print(f"Disk: [cyan]{disk.strip()}[/cyan]")


@server_group.command('cleanup')
@click.option('--volumes', is_flag=True, help='Supprimer volumes non utilisés')
@click.option('--images', is_flag=True, help='Supprimer images non utilisées')
@click.option('--all', is_flag=True, help='Tout nettoyer (volumes + images + containers arrêtés)')
@click.option('--yes', '-y', is_flag=True, help='Confirmer automatiquement')
def cleanup(volumes: bool, images: bool, all: bool, yes: bool):
    """Nettoie les ressources Docker inutilisées"""
    if not (volumes or images or all):
        console.print("[yellow]Spécifiez --volumes, --images ou --all[/yellow]")
        return
    
    commands = []
    
    if all or volumes:
        if not yes:
            confirm = click.confirm("Supprimer les volumes non utilisés ?")
            if not confirm:
                return
        commands.append("docker volume prune -f")
    
    if all or images:
        if not yes:
            confirm = click.confirm("Supprimer les images non utilisées ?")
            if not confirm:
                return
        commands.append("docker image prune -a -f")
    
    if all:
        if not yes:
            confirm = click.confirm("Supprimer les containers arrêtés ?")
            if not confirm:
                return
        commands.append("docker container prune -f")
    
    for cmd in commands:
        console.print(f"[yellow]Exécution: {cmd}[/yellow]")
        stdout, stderr = ssh_exec(cmd)
        if stdout:
            console.print(f"[green]✅ {stdout}[/green]")
        if stderr:
            console.print(f"[yellow]{stderr}[/yellow]")


@server_group.command('env')
@click.option('--check', is_flag=True, help='Vérifier les variables d\'environnement')
@click.option('--backup', is_flag=True, help='Backup des fichiers .env')
def env(check: bool, backup: bool):
    """Gère les variables d'environnement"""
    if check:
        # Vérifier que les fichiers .env existent
        env_files = [
            f"{SERVER_CONFIG['project_path']}/.env.production",
            f"{SERVER_CONFIG['admin_path']}/.env.production"
        ]
        
        table = Table(title="Variables d'environnement", box=box.ROUNDED)
        table.add_column("Fichier", style="cyan")
        table.add_column("Status", style="green")
        table.add_column("Variables", style="yellow")
        
        for env_file in env_files:
            stdout, _ = ssh_exec(f"test -f {env_file} && echo 'exists' || echo 'missing'")
            exists = 'exists' in stdout
            
            if exists:
                # Compter les variables (sans valeurs pour sécurité)
                stdout, _ = ssh_exec(f"grep -c '^[A-Z_]' {env_file} 2>/dev/null || echo '0'")
                var_count = stdout.strip()
                table.add_row(env_file, "[green]✅ Existe[/green]", f"{var_count} variables")
            else:
                table.add_row(env_file, "[red]❌ Manquant[/red]", "-")
        
        console.print(table)
    
    if backup:
        timestamp = __import__('datetime').datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_dir = f"{SERVER_CONFIG['project_path']}/backups/env"
        
        # Créer le dossier
        ssh_exec(f"mkdir -p {backup_dir}")
        
        # Backup
        stdout, stderr = ssh_exec(
            f"cp {SERVER_CONFIG['project_path']}/.env.production {backup_dir}/.env.production.{timestamp} && "
            f"cp {SERVER_CONFIG['admin_path']}/.env.production {backup_dir}/.env.admin.production.{timestamp} && "
            f"echo 'Backup créé: {backup_dir}'"
        )
        
        console.print(f"[green]✅ {stdout}[/green]")
        if stderr:
            console.print(f"[yellow]{stderr}[/yellow]")
