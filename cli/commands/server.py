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
@click.option('--all', is_flag=True, help='Afficher tous les containers (Reboul Store + Admin Central)')
@click.option('--watch', '-w', is_flag=True, help='Mode watch : met à jour en temps réel (toutes les 2 secondes)')
@click.option('--interval', '-i', type=int, default=2, help='Intervalle de mise à jour en secondes (défaut: 2)')
def status(service: Optional[str], admin: bool, all: bool, watch: bool, interval: int):
    """Affiche l'état de tous les containers"""
    import time
    
    # Si --all est spécifié, on affiche les deux projets
    if all:
        projects = [
            ('Reboul Store', SERVER_CONFIG['project_path']),
            ('Admin Central', SERVER_CONFIG['admin_path'])
        ]
    elif admin:
        projects = [('Admin Central', SERVER_CONFIG['admin_path'])]
    else:
        projects = [('Reboul Store', SERVER_CONFIG['project_path'])]
    
    compose_file = 'docker-compose.prod.yml'
    
    def get_status():
        """Récupère et affiche le statut des containers"""
        from utils.server_helper import ssh_exec
        
        # Afficher un tableau pour chaque projet
        for project_name, project_dir in projects:
            # Vérifier si le répertoire existe
            stdout_check, stderr_check = ssh_exec(f'test -d {project_dir} && echo "exists"', return_code=False)
            if not stdout_check.strip() or 'exists' not in stdout_check:
                console.print(f"[yellow]⚠️  {project_name}: Répertoire {project_dir} n'existe pas encore[/yellow]\n")
                continue
            
            # Vérifier si docker-compose.prod.yml existe
            stdout_check, stderr_check = ssh_exec(f'test -f {project_dir}/{compose_file} && echo "exists"', return_code=False)
            if not stdout_check.strip() or 'exists' not in stdout_check:
                console.print(f"[yellow]⚠️  {project_name}: {compose_file} n'existe pas encore[/yellow]\n")
                continue
            
            # Récupérer le statut des containers (sans format personnalisé pour plus de compatibilité)
    stdout, stderr = docker_compose_exec(
                'ps',
        compose_file=compose_file,
        cwd=project_dir
    )
    
            if stderr and 'warning' not in stderr.lower() and 'invalid key' not in stderr.lower():
                # Ignorer les erreurs de .env.production manquant si le répertoire existe mais n'est pas configuré
                if '.env.production' in stderr.lower() or 'env file' in stderr.lower():
                    console.print(f"[yellow]⚠️  {project_name}: Pas encore configuré (.env.production manquant)[/yellow]\n")
                    continue
                console.print(f"[red]Erreur pour {project_name}: {stderr}[/red]\n")
                continue
    
    # Créer un tableau formaté
            table = Table(
                title=f"État des containers ({project_name}) - {__import__('datetime').datetime.now().strftime('%H:%M:%S')}", 
                box=box.ROUNDED
            )
    table.add_column("Container", style="cyan")
    table.add_column("Status", style="green")
    table.add_column("Ports", style="yellow")
    
            # Parser la sortie - docker compose ps retourne un tableau avec colonnes séparées par espaces
            if not stdout or not stdout.strip():
                console.print(f"[yellow]⚠️  {project_name}: Aucun container en cours d'exécution[/yellow]\n")
                continue
            
            lines = [l.strip() for l in stdout.strip().split('\n') if l.strip()]
            
            if len(lines) <= 1:
                console.print(f"[yellow]⚠️  {project_name}: Aucun container trouvé[/yellow]\n")
                continue
            
            # Format docker compose ps: NAME | IMAGE | COMMAND | SERVICE | CREATED | STATUS | PORTS
            # Les colonnes sont séparées par des espaces multiples
            
            # Parser les lignes de données (ignorer la première ligne = header)
            import re
            for line in lines[1:]:
                if not line.strip() or '──' in line or 'NAME' in line:
                    continue
                
                # Split par espaces multiples (format tableau de docker compose)
                parts = [p.strip() for p in re.split(r'\s{2,}', line) if p.strip()]
                
                # Format: NAME | IMAGE | COMMAND | SERVICE | CREATED | STATUS | PORTS
                # INDEX:    0       1        2         3         4         5       6
                if len(parts) >= 6:
                    name = parts[0]
                    status_text = parts[5]  # STATUS est la 6ème colonne (index 5)
                    ports = parts[6] if len(parts) > 6 else ""
                    
                    # Colorier le status
                    if 'healthy' in status_text.lower() or ('up' in status_text.lower() and 'unhealthy' not in status_text.lower()):
                        status_style = "green"
                    elif 'unhealthy' in status_text.lower() or 'down' in status_text.lower() or 'exited' in status_text.lower():
                        status_style = "red"
                    else:
                        status_style = "yellow"
                    
                    table.add_row(name, f"[{status_style}]{status_text}[/{status_style}]", ports)
    
            # Afficher le tableau pour ce projet
            if watch and project_name == projects[0][0]:
                # Effacer l'écran seulement pour le premier projet en mode watch
                import os
                os.system('clear' if os.name != 'nt' else 'cls')
            
    console.print(table)
            if len(projects) > 1 and project_name != projects[-1][0]:
                console.print()  # Ligne vide entre les projets
        
        if watch:
            console.print(f"\n[yellow]⏱️  Mise à jour toutes les {interval}s (Ctrl+C pour quitter)[/yellow]")
        return True
    
    if watch:
        console.print("[bold yellow]🔄 Mode watch activé[/bold yellow]")
        console.print("[yellow]Le statut sera mis à jour toutes les {} secondes...[/yellow]\n".format(interval))
        try:
            while True:
                get_status()
                time.sleep(interval)
        except KeyboardInterrupt:
            console.print("\n[bold yellow]✅ Arrêt du mode watch[/bold yellow]")
    else:
        get_status()


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
