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
import re

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
            
            # Ignorer les warnings/erreurs sur .env.production - ce n'est pas bloquant si les containers tournent
            # Les containers peuvent tourner même si .env.production génère un warning/erreur
            if stderr:
                # Si c'est juste un warning ou une erreur sur .env.production, on l'ignore
                if '.env.production' in stderr.lower() or 'env file' in stderr.lower():
                    # C'est juste un warning/erreur sur .env.production, on continue quand même
                    # Les containers peuvent tourner malgré ça
                    pass
                elif 'warning' not in stderr.lower() and 'invalid key' not in stderr.lower():
                    # C'est une vraie erreur (pas un warning et pas liée à .env.production)
                    console.print(f"[red]Erreur pour {project_name}: {stderr}[/red]\n")
                    continue
            
            # Si stdout est vide, pas de containers trouvés
            if not stdout or not stdout.strip():
                console.print(f"[yellow]⚠️  {project_name}: Aucun container en cours d'exécution[/yellow]\n")
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


@server_group.command('ssl')
@click.option('--check', is_flag=True, help='Vérifier l\'expiration des certificats SSL')
@click.option('--domain', type=str, help='Domaine spécifique à vérifier')
@click.option('--admin', is_flag=True, help='Vérifier les certificats Admin Central')
def ssl(check: bool, domain: Optional[str], admin: bool):
    """🔐 Gère les certificats SSL"""
    from datetime import datetime
    import re
    
    if not check:
        console.print("[yellow]Utilisez --check pour vérifier les certificats[/yellow]")
        return
    
    console.print("[bold cyan]🔐 Vérification des certificats SSL...[/bold cyan]\n")
    
    # Domaines à vérifier
    if domain:
        domains = [domain]
    elif admin:
        domains = ['admin.reboulstore.com']
    else:
        domains = ['reboulstore.com', 'www.reboulstore.com', 'admin.reboulstore.com']
    
    table = Table(title="État des certificats SSL", box=box.ROUNDED)
    table.add_column("Domaine", style="cyan")
    table.add_column("Expiration", style="green")
    table.add_column("Jours restants", style="yellow", justify="right")
    table.add_column("Statut", style="white")
    
    today = datetime.now()
    all_valid = True
    
    for domain_name in domains:
        try:
            # Vérifier le certificat via openssl (depuis le serveur)
            openssl_cmd = f"echo | openssl s_client -connect {domain_name}:443 -servername {domain_name} 2>/dev/null | openssl x509 -noout -dates -subject 2>/dev/null"
            
            stdout, stderr = ssh_exec(openssl_cmd)
            
            if not stdout or 'notAfter' not in stdout:
                # Si ça ne marche pas, essayer depuis le container nginx
                docker_cmd = f"docker exec reboulstore-nginx-prod openssl s_client -connect {domain_name}:443 -servername {domain_name} < /dev/null 2>/dev/null | openssl x509 -noout -dates -subject 2>/dev/null || true"
                stdout, stderr = ssh_exec(docker_cmd)
            
            if stdout and 'notAfter' in stdout:
                # Extraire la date d'expiration
                match = re.search(r'notAfter=([^\n]+)', stdout)
                if match:
                    exp_date_str = match.group(1).strip()
                    # Format: Dec 30 23:59:59 2025 GMT
                    try:
                        exp_date = datetime.strptime(exp_date_str, "%b %d %H:%M:%S %Y %Z")
                        days_left = (exp_date - today).days
                        
                        # Style selon les jours restants
                        if days_left < 0:
                            status = "[red]❌ EXPIRÉ[/red]"
                            style = "red"
                            all_valid = False
                        elif days_left < 7:
                            status = "[red]⚠️  EXPIRE BIENTÔT[/red]"
                            style = "red"
                            all_valid = False
                        elif days_left < 30:
                            status = "[yellow]⚠️  EXPIRE DANS 30 JOURS[/yellow]"
                            style = "yellow"
                        else:
                            status = "[green]✅ VALIDE[/green]"
                            style = "green"
                        
                        table.add_row(
                            f"[{style}]{domain_name}[/{style}]",
                            exp_date.strftime("%Y-%m-%d %H:%M:%S"),
                            f"[{style}]{days_left} jours[/{style}]",
                            status
                        )
                    except ValueError:
                        table.add_row(domain_name, "Format inconnu", "-", "[yellow]⚠️  Erreur parsing[/yellow]")
                        all_valid = False
                else:
                    table.add_row(domain_name, "N/A", "-", "[yellow]⚠️  Date non trouvée[/yellow]")
                    all_valid = False
            else:
                # Essayer de vérifier via le fichier de certificat directement
                cert_path = f"/etc/nginx/ssl/fullchain.pem"
                check_cert_cmd = f"openssl x509 -in {cert_path} -noout -dates -subject 2>/dev/null || docker exec reboulstore-nginx-prod openssl x509 -in /etc/nginx/ssl/fullchain.pem -noout -dates -subject 2>/dev/null || true"
                stdout, stderr = ssh_exec(check_cert_cmd)
                
                if stdout and 'notAfter' in stdout:
                    match = re.search(r'notAfter=([^\n]+)', stdout)
                    if match:
                        exp_date_str = match.group(1).strip()
                        try:
                            exp_date = datetime.strptime(exp_date_str, "%b %d %H:%M:%S %Y %Z")
                            days_left = (exp_date - today).days
                            
                            if days_left < 0:
                                status = "[red]❌ EXPIRÉ[/red]"
                                style = "red"
                                all_valid = False
                            elif days_left < 7:
                                status = "[red]⚠️  EXPIRE BIENTÔT[/red]"
                                style = "red"
                                all_valid = False
                            elif days_left < 30:
                                status = "[yellow]⚠️  EXPIRE DANS 30 JOURS[/yellow]"
                                style = "yellow"
                            else:
                                status = "[green]✅ VALIDE[/green]"
                                style = "green"
                            
                            table.add_row(
                                f"[{style}]{domain_name}[/{style}]",
                                exp_date.strftime("%Y-%m-%d %H:%M:%S"),
                                f"[{style}]{days_left} jours[/{style}]",
                                status
                            )
                        except ValueError:
                            table.add_row(domain_name, "Format inconnu", "-", "[yellow]⚠️  Erreur parsing[/yellow]")
                            all_valid = False
                    else:
                        table.add_row(domain_name, "N/A", "-", "[yellow]⚠️  Date non trouvée[/yellow]")
                        all_valid = False
                else:
                    table.add_row(domain_name, "N/A", "-", "[red]❌ Certificat non accessible[/red]")
                    all_valid = False
        except Exception as e:
            table.add_row(domain_name, "N/A", "-", f"[red]❌ Erreur: {str(e)}[/red]")
            all_valid = False
    
    console.print(table)
    
    # Résumé
    if all_valid:
        console.print("\n[green]✅ Tous les certificats sont valides[/green]")
    else:
        console.print("\n[yellow]⚠️  Certains certificats nécessitent une attention[/yellow]")
        console.print("[cyan]💡 Pour renouveler: certbot renew sur le serveur[/cyan]")


@server_group.command('cron')
@click.option('--list', 'list_crons', is_flag=True, help='Lister tous les cron jobs')
@click.option('--add', type=str, help='Ajouter un cron job (format: "0 2 * * * commande")')
@click.option('--description', type=str, help='Description du cron job (pour --add)')
@click.option('--remove', type=int, help='Supprimer un cron job (numéro de ligne)')
@click.option('--enable-backup', is_flag=True, help='Activer le backup automatique de la DB (quotidien à 2h)')
@click.option('--disable-backup', is_flag=True, help='Désactiver le backup automatique de la DB')
def cron(list_crons: bool, add: Optional[str], description: Optional[str], remove: Optional[int], enable_backup: bool, disable_backup: bool):
    """⏰ Gère les cron jobs (tâches automatiques)"""
    from utils.cron_helper import (
        list_cron_jobs, add_cron_job, remove_cron_job,
        enable_backup_automatic, disable_backup_automatic
    )
    
    # Lister les cron jobs
    if list_crons:
        console.print("[bold cyan]⏰ Liste des cron jobs...[/bold cyan]\n")
        
        stdout, stderr = ssh_exec("crontab -l 2>/dev/null || echo '# Aucun cron job configuré'")
        
        if stdout.strip() and stdout.strip() != '# Aucun cron job configuré':
            # Parser les cron jobs
            lines = stdout.strip().split('\n')
            cron_jobs = []
            
            for i, line in enumerate(lines, 1):
                line = line.strip()
                # Ignorer les commentaires et lignes vides
                if line and not line.startswith('#') and line:
                    cron_jobs.append({'line_num': i, 'line': line})
            
            if cron_jobs:
                table = Table(title=f"Cron Jobs ({len(cron_jobs)})", box=box.ROUNDED)
                table.add_column("#", style="cyan", justify="right")
                table.add_column("Programmation", style="yellow")
                table.add_column("Commande", style="green")
                
                for job in cron_jobs:
                    parts = job['line'].split(None, 5)  # 5 premiers mots = schedule
                    if len(parts) >= 6:
                        schedule = ' '.join(parts[:5])
                        command = parts[5]
                        table.add_row(str(job['line_num']), schedule, command)
                    else:
                        table.add_row(str(job['line_num']), "", job['line'])
                
                console.print(table)
            else:
                console.print("[yellow]⚠️  Aucun cron job trouvé[/yellow]")
        else:
            console.print("[yellow]⚠️  Aucun cron job configuré[/yellow]")
        
        return
    
    # Ajouter un cron job
    if add:
        console.print(f"[cyan]➕ Ajout d'un cron job...[/cyan]\n")
        
        success, message = add_cron_job(add, description)
        
        if success:
            console.print(f"[green]✅ Cron job ajouté avec succès[/green]")
            if description:
                console.print(f"[blue]Description: {description}[/blue]")
        else:
            console.print(f"[red]❌ {message}[/red]")
        
        return
    
    # Supprimer un cron job
    if remove:
        console.print(f"[cyan]🗑️  Suppression du cron job #{remove}...[/cyan]\n")
        
        cron_jobs = list_cron_jobs()
        if remove < 1 or remove > len(cron_jobs):
            console.print(f"[red]❌ Numéro invalide. Il y a {len(cron_jobs)} cron job(s)[/red]")
            console.print("[blue]💡 Utilisez './rcli server cron --list' pour voir les numéros[/blue]")
            return
        
        removed_job = cron_jobs[remove - 1]
        success, message = remove_cron_job(remove)
        
        if success:
            console.print(f"[green]✅ Cron job #{remove} supprimé[/green]")
            console.print(f"[blue]Commande supprimée: {removed_job['command']}[/blue]")
        else:
            console.print(f"[red]❌ {message}[/red]")
        
        return
    
    # Activer le backup automatique
    if enable_backup:
        console.print("[bold cyan]💾 Activation du backup automatique de la base de données...[/bold cyan]\n")
        
        success, message = enable_backup_automatic()
        
        if success:
            console.print(f"[green]✅ {message}[/green]")
            console.print("[blue]📋 Backup quotidien programmé à 2h du matin[/blue]")
            from utils.server_helper import SERVER_CONFIG
            console.print(f"[blue]📁 Backups: {SERVER_CONFIG['project_path']}/backups/[/blue]")
        else:
            console.print(f"[red]❌ {message}[/red]")
            if "existe déjà" in message:
                console.print("[blue]💡 Utilisez './rcli server cron --list' pour le voir[/blue]")
        
        return
    
    # Désactiver le backup automatique
    if disable_backup:
        console.print("[bold cyan]💾 Désactivation du backup automatique...[/bold cyan]\n")
        
        success, message, count = disable_backup_automatic()
        
        if success:
            console.print(f"[green]✅ {message}[/green]")
        else:
            console.print(f"[yellow]⚠️  {message}[/yellow]")
        
        return
    
    # Si aucune option n'est spécifiée, afficher l'aide
    console.print("[yellow]Utilisez une option: --list, --add, --remove, --enable-backup, ou --disable-backup[/yellow]")
    console.print("[cyan]Exemples:[/cyan]")
    console.print("  ./rcli server cron --list")
    console.print("  ./rcli server cron --enable-backup")
    console.print("  ./rcli server cron --add '0 3 * * * /path/to/script.sh' --description 'Mon script'")


@server_group.command('file')
@click.option('--upload', type=str, nargs=2, metavar='<local> <remote>', help='Uploader un fichier (local remote)')
@click.option('--download', type=str, nargs=2, metavar='<remote> <local>', help='Télécharger un fichier (remote local)')
@click.option('--list', 'list_files', type=str, metavar='<path>', help='Lister les fichiers d\'un répertoire')
@click.option('--backup', type=str, metavar='<dir>', help='Backup d\'un répertoire (ex: uploads)')
@click.option('--backup-all', is_flag=True, help='Backup complet (uploads + configs)')
def file(upload: Optional[tuple], download: Optional[tuple], list_files: Optional[str], backup: Optional[str], backup_all: bool):
    """📁 Gère les fichiers sur le serveur (upload/download/list/backup)"""
    import subprocess
    import os
    from utils.server_helper import SERVER_CONFIG
    
    # Upload
    if upload:
        local_path, remote_path = upload
        console.print(f"[cyan]📤 Upload: {local_path} → {remote_path}[/cyan]\n")
        
        if not os.path.exists(local_path):
            console.print(f"[red]❌ Fichier local introuvable: {local_path}[/red]")
            return
        
        # Utiliser scp pour uploader
        scp_cmd = [
            'scp',
            '-o', 'ConnectTimeout=10',
            '-o', 'StrictHostKeyChecking=no',
            '-o', 'LogLevel=ERROR',
            local_path,
            f"{SERVER_CONFIG['user']}@{SERVER_CONFIG['host']}:{remote_path}"
        ]
        
        try:
            result = subprocess.run(scp_cmd, capture_output=True, text=True, timeout=60)
            if result.returncode == 0:
                console.print(f"[green]✅ Fichier uploadé avec succès[/green]")
                console.print(f"[blue]📁 {remote_path}[/blue]")
            else:
                console.print(f"[red]❌ Erreur: {result.stderr}[/red]")
        except subprocess.TimeoutExpired:
            console.print(f"[red]❌ Timeout lors de l'upload[/red]")
        except Exception as e:
            console.print(f"[red]❌ Erreur: {str(e)}[/red]")
        
        return
    
    # Download
    if download:
        remote_path, local_path = download
        console.print(f"[cyan]📥 Download: {remote_path} → {local_path}[/cyan]\n")
        
        # Créer le dossier local si nécessaire
        local_dir = os.path.dirname(local_path)
        if local_dir and not os.path.exists(local_dir):
            os.makedirs(local_dir, exist_ok=True)
        
        # Utiliser scp pour télécharger
        scp_cmd = [
            'scp',
            '-o', 'ConnectTimeout=10',
            '-o', 'StrictHostKeyChecking=no',
            '-o', 'LogLevel=ERROR',
            f"{SERVER_CONFIG['user']}@{SERVER_CONFIG['host']}:{remote_path}",
            local_path
        ]
        
        try:
            result = subprocess.run(scp_cmd, capture_output=True, text=True, timeout=60)
            if result.returncode == 0:
                console.print(f"[green]✅ Fichier téléchargé avec succès[/green]")
                console.print(f"[blue]📁 {local_path}[/blue]")
            else:
                console.print(f"[red]❌ Erreur: {result.stderr}[/red]")
        except subprocess.TimeoutExpired:
            console.print(f"[red]❌ Timeout lors du téléchargement[/red]")
        except Exception as e:
            console.print(f"[red]❌ Erreur: {str(e)}[/red]")
        
        return
    
    # List
    if list_files:
        console.print(f"[cyan]📋 Liste des fichiers: {list_files}[/cyan]\n")
        
        # Utiliser ssh pour lister
        cmd = f"ls -lh {list_files} 2>/dev/null || find {list_files} -maxdepth 1 -type f -exec ls -lh {{}} \\; 2>/dev/null || echo 'Répertoire introuvable ou vide'"
        stdout, stderr = ssh_exec(cmd)
        
        if stdout and 'Répertoire introuvable' not in stdout:
            # Essayer de formater la sortie
            lines = stdout.strip().split('\n')
            table = Table(title=f"Fichiers dans {list_files}", box=box.ROUNDED)
            table.add_column("Permissions", style="cyan")
            table.add_column("Taille", style="yellow")
            table.add_column("Nom", style="green")
            
            for line in lines:
                if line.strip() and not line.startswith('total'):
                    parts = line.split(None, 8)
                    if len(parts) >= 9:
                        perms = parts[0]
                        size = parts[4]
                        name = parts[8]
                        table.add_row(perms, size, name)
            
            console.print(table)
        else:
            console.print(f"[yellow]⚠️  {stdout or stderr}[/yellow]")
        
        return
    
    # Backup d'un répertoire
    if backup:
        console.print(f"[bold cyan]💾 Backup du répertoire: {backup}[/bold cyan]\n")
        
        project_dir = SERVER_CONFIG['project_path']
        backup_dir = f"{project_dir}/backups"
        timestamp = __import__('datetime').datetime.now().strftime('%Y%m%d_%H%M%S')
        
        if backup == "uploads":
            source_dir = f"{project_dir}/backend/uploads"
            backup_file = f"{backup_dir}/uploads_{timestamp}.tar.gz"
        else:
            source_dir = f"{project_dir}/{backup}"
            backup_file = f"{backup_dir}/{backup}_{timestamp}.tar.gz"
        
        # Créer le backup avec tar
        cmd = f"mkdir -p {backup_dir} && tar -czf {backup_file} -C {project_dir} {backup} && ls -lh {backup_file}"
        stdout, stderr = ssh_exec(cmd)
        
        if stdout and '.tar.gz' in stdout:
            console.print(f"[green]✅ Backup créé avec succès[/green]")
            console.print(f"[blue]📁 {backup_file}[/blue]")
            console.print(stdout)
        else:
            console.print(f"[red]❌ Erreur lors de la création du backup[/red]")
            if stderr:
                console.print(f"[yellow]{stderr}[/yellow]")
        
        return
    
    # Backup complet (uploads + configs)
    if backup_all:
        console.print("[bold cyan]💾 Backup complet (uploads + configs)[/bold cyan]\n")
        
        project_dir = SERVER_CONFIG['project_path']
        backup_dir = f"{project_dir}/backups"
        timestamp = __import__('datetime').datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_file = f"{backup_dir}/full_backup_{timestamp}.tar.gz"
        
        # Backup uploads + configs
        cmd = f"""
        mkdir -p {backup_dir} && 
        tar -czf {backup_file} \
            -C {project_dir} backend/uploads \
            -C {project_dir} .env.production \
            -C {SERVER_CONFIG['admin_path']} .env.production 2>/dev/null && 
        ls -lh {backup_file}
        """
        
        stdout, stderr = ssh_exec(cmd)
        
        if stdout and '.tar.gz' in stdout:
            console.print(f"[green]✅ Backup complet créé avec succès[/green]")
            console.print(f"[blue]📁 {backup_file}[/blue]")
            console.print(stdout)
            
            # Afficher le contenu
            console.print("\n[cyan]Contenu du backup:[/cyan]")
            list_cmd = f"tar -tzf {backup_file} | head -20"
            list_stdout, _ = ssh_exec(list_cmd)
            if list_stdout:
                console.print(list_stdout)
                list_count_cmd = f"tar -tzf {backup_file} | wc -l"
                count_stdout, _ = ssh_exec(list_count_cmd)
                if count_stdout.strip().isdigit():
                    console.print(f"[blue]Total: {count_stdout.strip()} fichiers[/blue]")
        else:
            console.print(f"[red]❌ Erreur lors de la création du backup complet[/red]")
            if stderr:
                console.print(f"[yellow]{stderr}[/yellow]")
        
        return
    
    # Si aucune option n'est spécifiée, afficher l'aide
    console.print("[yellow]Utilisez une option: --upload, --download, --list, --backup, ou --backup-all[/yellow]")
    console.print("\n[cyan]Exemples:[/cyan]")
    console.print("  ./rcli server file --upload ./image.jpg /var/www/reboulstore/uploads/")
    console.print("  ./rcli server file --download /var/log/nginx/error.log ./logs/error.log")
    console.print("  ./rcli server file --list /var/www/reboulstore/backups")
    console.print("  ./rcli server file --backup uploads")
    console.print("  ./rcli server file --backup-all")


@server_group.command('exec')
@click.argument('command', type=str, required=True)
@click.option('--cwd', type=str, help='Répertoire de travail (optionnel)')
def exec_cmd(command: str, cwd: Optional[str]):
    """🖥️ Exécute une commande sur le serveur via SSH"""
    console.print(f"[cyan]🖥️  Exécution: {command}[/cyan]\n")
    
    if cwd:
        console.print(f"[blue]📁 Répertoire: {cwd}[/blue]\n")
    
    stdout, stderr = ssh_exec(command, cwd=cwd)
    
    if stdout:
        console.print("[bold green]Sortie:[/bold green]")
        console.print(stdout)
    
    if stderr:
        console.print("\n[bold yellow]Erreurs:[/bold yellow]")
        console.print(stderr)


@server_group.command('monitor')
@click.option('--cpu-threshold', type=float, default=80.0, help='Seuil d\'alerte CPU en % (défaut: 80)')
@click.option('--ram-threshold', type=float, default=90.0, help='Seuil d\'alerte RAM en % (défaut: 90)')
@click.option('--disk-threshold', type=float, default=85.0, help='Seuil d\'alerte disque en % (défaut: 85)')
@click.option('--interval', type=int, default=5, help='Intervalle de vérification en secondes (défaut: 5)')
@click.option('--once', is_flag=True, help='Afficher une seule fois au lieu de surveiller en continu')
def monitor(cpu_threshold: float, ram_threshold: float, disk_threshold: float, interval: int, once: bool):
    """📊 Surveille les ressources serveur (CPU, RAM, Disque) avec alertes"""
    import time
    import re
    
    if once:
        # Mode une seule vérification
        console.print("[bold cyan]📊 État des ressources serveur[/bold cyan]\n")
        _display_resources(cpu_threshold, ram_threshold, disk_threshold, alert=True)
    else:
        # Mode surveillance continue
        console.print("[bold cyan]📊 Monitoring continu des ressources serveur[/bold cyan]")
        console.print(f"[yellow]Seuils: CPU > {cpu_threshold}%, RAM > {ram_threshold}%, Disque > {disk_threshold}%[/yellow]")
        console.print(f"[yellow]Intervalle: {interval} secondes | Ctrl+C pour arrêter[/yellow]\n")
        
        try:
            while True:
                _display_resources(cpu_threshold, ram_threshold, disk_threshold, alert=True)
                time.sleep(interval)
                console.print()  # Ligne vide entre les vérifications
        except KeyboardInterrupt:
            console.print("\n[yellow]✅ Monitoring arrêté[/yellow]")


def _display_resources(cpu_threshold: float, ram_threshold: float, disk_threshold: float, alert: bool = False):
    """Affiche les ressources serveur avec alertes"""
    from datetime import datetime
    
    # Récupérer les métriques
    timestamp = datetime.now().strftime("%H:%M:%S")
    
    # CPU
    cpu_cmd = "top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\([0-9.]*\)%* id.*/\\1/' | awk '{print 100 - $1}'"
    cpu_stdout, _ = ssh_exec(cpu_cmd)
    cpu_usage = 0.0
    try:
        cpu_usage = float(cpu_stdout.strip())
    except:
        # Alternative: utiliser /proc/loadavg ou vmstat
        cpu_alt_cmd = "vmstat 1 2 | tail -1 | awk '{print 100 - $15}'"
        cpu_alt_stdout, _ = ssh_exec(cpu_alt_cmd)
        try:
            cpu_usage = float(cpu_alt_stdout.strip())
        except:
            pass
    
    # RAM
    ram_cmd = "free | grep Mem | awk '{printf \"%.1f\", ($3/$2) * 100.0}'"
    ram_stdout, _ = ssh_exec(ram_cmd)
    ram_usage = 0.0
    try:
        ram_usage = float(ram_stdout.strip())
    except:
        pass
    
    # Disque
    disk_cmd = "df -h / | tail -1 | awk '{print $5}' | sed 's/%//'"
    disk_stdout, _ = ssh_exec(disk_cmd)
    disk_usage = 0.0
    try:
        disk_usage = float(disk_stdout.strip())
    except:
        pass
    
    # Afficher dans un tableau
    table = Table(title=f"Ressources serveur - {timestamp}", box=box.ROUNDED)
    table.add_column("Ressource", style="cyan")
    table.add_column("Utilisation", style="yellow", justify="right")
    table.add_column("Seuil", style="blue", justify="right")
    table.add_column("Statut", style="white")
    
    # CPU
    cpu_color = "red" if cpu_usage > cpu_threshold else "yellow" if cpu_usage > cpu_threshold * 0.8 else "green"
    cpu_status = "🔴 ALERTE" if cpu_usage > cpu_threshold else "🟡 ATTENTION" if cpu_usage > cpu_threshold * 0.8 else "🟢 OK"
    table.add_row(
        "CPU",
        f"[{cpu_color}]{cpu_usage:.1f}%[/{cpu_color}]",
        f"{cpu_threshold}%",
        cpu_status
    )
    
    # RAM
    ram_color = "red" if ram_usage > ram_threshold else "yellow" if ram_usage > ram_threshold * 0.8 else "green"
    ram_status = "🔴 ALERTE" if ram_usage > ram_threshold else "🟡 ATTENTION" if ram_usage > ram_threshold * 0.8 else "🟢 OK"
    table.add_row(
        "RAM",
        f"[{ram_color}]{ram_usage:.1f}%[/{ram_color}]",
        f"{ram_threshold}%",
        ram_status
    )
    
    # Disque
    disk_color = "red" if disk_usage > disk_threshold else "yellow" if disk_usage > disk_threshold * 0.8 else "green"
    disk_status = "🔴 ALERTE" if disk_usage > disk_threshold else "🟡 ATTENTION" if disk_usage > disk_threshold * 0.8 else "🟢 OK"
    table.add_row(
        "Disque",
        f"[{disk_color}]{disk_usage:.1f}%[/{disk_color}]",
        f"{disk_threshold}%",
        disk_status
    )
    
    console.print(table)
    
    # Alertes
    if alert:
        alerts = []
        if cpu_usage > cpu_threshold:
            alerts.append(f"🚨 CPU à {cpu_usage:.1f}% (> {cpu_threshold}%)")
        if ram_usage > ram_threshold:
            alerts.append(f"🚨 RAM à {ram_usage:.1f}% (> {ram_threshold}%)")
        if disk_usage > disk_threshold:
            alerts.append(f"🚨 Disque à {disk_usage:.1f}% (> {disk_threshold}%)")
        
        if alerts:
            console.print("\n[bold red]" + "\n".join(alerts) + "[/bold red]")


@server_group.command('security')
@click.option('--audit', is_flag=True, help='Effectuer un audit de sécurité complet')
def security(audit: bool):
    """🔒 Audit de sécurité du serveur"""
    if not audit:
        console.print("[yellow]Utilisez --audit pour effectuer un audit de sécurité[/yellow]")
        return
    
    console.print("[bold cyan]🔒 Audit de sécurité du serveur...[/bold cyan]\n")
    
    issues = []
    warnings = []
    
    # 1. Vérifier les ports ouverts
    console.print("[cyan]1. Vérification des ports ouverts...[/cyan]")
    ports_cmd = "ss -tuln | grep LISTEN | awk '{print $5}' | cut -d: -f2 | sort -u"
    ports_stdout, _ = ssh_exec(ports_cmd)
    
    if ports_stdout:
        open_ports = [p.strip() for p in ports_stdout.strip().split('\n') if p.strip()]
        
        # Ports suspects (ports système communs qui ne devraient pas être exposés)
        suspicious_ports = ['22', '80', '443', '5432']  # SSH, HTTP, HTTPS, PostgreSQL
        public_ports = []
        
        for port in open_ports:
            if port not in suspicious_ports:
                public_ports.append(port)
        
        if public_ports:
            warnings.append(f"Ports ouverts détectés: {', '.join(public_ports)}")
            console.print(f"  [yellow]⚠️  Ports ouverts: {', '.join(public_ports)}[/yellow]")
        else:
            console.print("  [green]✅ Ports système standards uniquement[/green]")
    else:
        console.print("  [yellow]⚠️  Impossible de vérifier les ports[/yellow]")
    
    console.print()
    
    # 2. Vérifier les permissions des fichiers sensibles
    console.print("[cyan]2. Vérification des permissions des fichiers sensibles...[/cyan]")
    
    sensitive_files = [
        (f"{SERVER_CONFIG['project_path']}/.env.production", "600", "Fichier .env production"),
        (f"{SERVER_CONFIG['admin_path']}/.env.production", "600", "Fichier .env admin"),
        ("/etc/nginx/ssl/privkey.pem", "600", "Clé privée SSL"),
    ]
    
    for file_path, expected_perm, description in sensitive_files:
        perm_cmd = f"test -f {file_path} && stat -c '%a' {file_path} 2>/dev/null || echo 'missing'"
        perm_stdout, _ = ssh_exec(perm_cmd)
        
        if perm_stdout.strip() == 'missing':
            warnings.append(f"Fichier non trouvé: {file_path}")
            console.print(f"  [yellow]⚠️  {description}: Fichier non trouvé[/yellow]")
        else:
            actual_perm = perm_stdout.strip()
            if actual_perm != expected_perm:
                issues.append(f"Permissions incorrectes sur {file_path}: {actual_perm} (attendu: {expected_perm})")
                console.print(f"  [red]❌ {description}: Permissions {actual_perm} (attendu: {expected_perm})[/red]")
            else:
                console.print(f"  [green]✅ {description}: Permissions OK ({actual_perm})[/green]")
    
    console.print()
    
    # 3. Vérifier les certificats SSL (utiliser la commande ssl existante)
    console.print("[cyan]3. Vérification des certificats SSL...[/cyan]")
    try:
        from datetime import datetime
        import re
        
        domains = ['reboulstore.com', 'www.reboulstore.com', 'admin.reboulstore.com']
        all_valid = True
        
        for domain in domains:
            openssl_cmd = f"echo | openssl s_client -connect {domain}:443 -servername {domain} 2>/dev/null | openssl x509 -noout -dates 2>/dev/null"
            stdout, _ = ssh_exec(openssl_cmd)
            
            if stdout and 'notAfter' in stdout:
                match = re.search(r'notAfter=([^\n]+)', stdout)
                if match:
                    exp_date_str = match.group(1).strip()
                    try:
                        exp_date = datetime.strptime(exp_date_str, "%b %d %H:%M:%S %Y %Z")
                        days_left = (exp_date - datetime.now()).days
                        
                        if days_left < 30:
                            all_valid = False
                            if days_left < 0:
                                issues.append(f"Certificat SSL {domain} expiré")
                                console.print(f"  [red]❌ {domain}: Certificat expiré[/red]")
                            elif days_left < 7:
                                issues.append(f"Certificat SSL {domain} expire dans {days_left} jours")
                                console.print(f"  [red]❌ {domain}: Expire dans {days_left} jours[/red]")
                            else:
                                warnings.append(f"Certificat SSL {domain} expire dans {days_left} jours")
                                console.print(f"  [yellow]⚠️  {domain}: Expire dans {days_left} jours[/yellow]")
                        else:
                            console.print(f"  [green]✅ {domain}: Certificat valide ({days_left} jours)[/green]")
                    except ValueError:
                        pass
        
        if all_valid:
            console.print("  [green]✅ Tous les certificats SSL sont valides[/green]")
    except Exception as e:
        warnings.append(f"Erreur lors de la vérification SSL: {str(e)}")
        console.print(f"  [yellow]⚠️  Erreur lors de la vérification SSL[/yellow]")
    
    console.print()
    
    # 4. Vérifier les mises à jour de sécurité
    console.print("[cyan]4. Vérification des mises à jour de sécurité...[/cyan]")
    updates_cmd = "apt list --upgradable 2>/dev/null | grep -v 'Listing...' | wc -l"
    updates_stdout, _ = ssh_exec(updates_cmd)
    
    try:
        update_count = int(updates_stdout.strip())
        if update_count > 0:
            warnings.append(f"{update_count} mises à jour disponibles")
            console.print(f"  [yellow]⚠️  {update_count} mise(s) à jour disponible(s)[/yellow]")
            console.print("  [blue]💡 Exécutez: sudo apt update && sudo apt upgrade[/blue]")
        else:
            console.print("  [green]✅ Système à jour[/green]")
    except:
        console.print("  [yellow]⚠️  Impossible de vérifier les mises à jour[/yellow]")
    
    console.print()
    
    # 5. Vérifier la configuration firewall (UFW ou iptables)
    console.print("[cyan]5. Vérification de la configuration firewall...[/cyan]")
    
    # Vérifier UFW
    ufw_cmd = "ufw status | head -1"
    ufw_stdout, _ = ssh_exec(ufw_cmd)
    
    if 'Status: active' in ufw_stdout:
        console.print("  [green]✅ UFW est actif[/green]")
    elif 'Status: inactive' in ufw_stdout:
        warnings.append("Firewall UFW est inactif")
        console.print("  [yellow]⚠️  UFW est inactif[/yellow]")
        console.print("  [blue]💡 Exécutez: sudo ufw enable[/blue]")
    else:
        # Vérifier iptables
        iptables_cmd = "iptables -L -n | grep -q 'Chain INPUT' && echo 'active' || echo 'inactive'"
        iptables_stdout, _ = ssh_exec(iptables_cmd)
        
        if 'active' in iptables_stdout:
            console.print("  [green]✅ Iptables configuré[/green]")
        else:
            warnings.append("Aucun firewall actif détecté")
            console.print("  [yellow]⚠️  Aucun firewall actif détecté[/yellow]")
    
    console.print()
    
    # 6. Vérifier les services Docker (conteneurs non sécurisés)
    console.print("[cyan]6. Vérification des conteneurs Docker...[/cyan]")
    docker_cmd = "docker ps --format '{{.Names}}\t{{.Image}}' | grep -v 'reboulstore\\|admin-central' || echo ''"
    docker_stdout, _ = ssh_exec(docker_cmd)
    
    if docker_stdout.strip():
        warnings.append("Conteneurs Docker non-standard détectés")
        console.print("  [yellow]⚠️  Conteneurs non-standard détectés[/yellow]")
        for line in docker_stdout.strip().split('\n'):
            if line.strip():
                console.print(f"    {line.strip()}")
    else:
        console.print("  [green]✅ Seuls les conteneurs du projet sont actifs[/green]")
    
    console.print()
    
    # Résumé
    console.print("[bold]📊 Résumé de l'audit:[/bold]\n")
    
    if issues:
        console.print(f"[bold red]❌ {len(issues)} problème(s) critique(s) trouvé(s):[/bold red]")
        for issue in issues:
            console.print(f"  • {issue}")
        console.print()
    
    if warnings:
        console.print(f"[bold yellow]⚠️  {len(warnings)} avertissement(s):[/bold yellow]")
        for warning in warnings:
            console.print(f"  • {warning}")
        console.print()
    
    if not issues and not warnings:
        console.print("[bold green]✅ Aucun problème de sécurité détecté ![/bold green]")
    elif not issues:
        console.print(f"[bold green]✅ Aucun problème critique, mais {len(warnings)} avertissement(s) à vérifier[/bold green]")
    else:
        console.print("[bold red]❌ Des problèmes de sécurité nécessitent une attention immédiate[/bold red]")


@server_group.command('dns')
@click.option('--check', type=str, metavar='<domain>', help='Vérifier les enregistrements DNS d\'un domaine')
@click.option('--propagate', is_flag=True, help='Vérifier la propagation DNS pour les domaines du projet')
def dns(check: Optional[str], propagate: bool):
    """🌐 Gère les vérifications DNS et la propagation"""
    if check:
        console.print(f"[bold cyan]🌐 Vérification DNS pour: {check}[/bold cyan]\n")
        _check_dns(check)
    elif propagate:
        console.print("[bold cyan]🌐 Vérification de la propagation DNS...[/bold cyan]\n")
        domains = ['reboulstore.com', 'www.reboulstore.com', 'admin.reboulstore.com']
        for domain in domains:
            _check_dns(domain)
            console.print()
    else:
        console.print("[yellow]Utilisez --check <domain> ou --propagate[/yellow]")
        console.print("\n[cyan]Exemples:[/cyan]")
        console.print("  ./rcli server dns --check reboulstore.com")
        console.print("  ./rcli server dns --propagate")


@server_group.command('rollback')
@click.option('--list', 'list_rollbacks', is_flag=True, help='Lister les backups disponibles pour rollback')
@click.option('--to', type=str, metavar='<timestamp>', help='Rollback vers un backup spécifique (format: YYYYMMDD_HHMMSS)')
@click.option('--latest', is_flag=True, help='Rollback vers le dernier backup disponible')
@click.option('--db-only', is_flag=True, help='Restaurer uniquement la base de données')
@click.option('--yes', '-y', is_flag=True, help='Confirmer automatiquement (danger: pas de confirmation)')
def rollback(list_rollbacks: bool, to: Optional[str], latest: bool, db_only: bool, yes: bool):
    """🔄 Rollback vers une version précédente (depuis les backups)"""
    from utils.server_helper import SERVER_CONFIG
    
    project_dir = SERVER_CONFIG['project_path']
    backup_dir = f"{project_dir}/backups"
    
    if list_rollbacks:
        console.print("[bold cyan]📋 Liste des backups disponibles pour rollback...[/bold cyan]\n")
        
        # Lister les backups DB
        db_backup_cmd = f"ls -t {backup_dir}/reboulstore_db_*.sql.gz 2>/dev/null | head -20 || echo ''"
        db_stdout, _ = ssh_exec(db_backup_cmd)
        
        # Lister les backups complets
        full_backup_cmd = f"ls -t {backup_dir}/full_backup_*.tar.gz 2>/dev/null | head -20 || echo ''"
        full_stdout, _ = ssh_exec(full_backup_cmd)
        
        if db_stdout.strip() or full_stdout.strip():
            table = Table(title="Backups disponibles", box=box.ROUNDED)
            table.add_column("Type", style="cyan")
            table.add_column("Timestamp", style="yellow")
            table.add_column("Fichier", style="green")
            table.add_column("Taille", style="blue")
            
            # Afficher les backups complets d'abord
            if full_stdout.strip():
                for line in full_stdout.strip().split('\n'):
                    if line.strip():
                        # Extraire timestamp et taille
                        file_path = line.strip()
                        filename = file_path.split('/')[-1]
                        # Format: full_backup_YYYYMMDD_HHMMSS.tar.gz
                        if 'full_backup_' in filename:
                            timestamp = filename.replace('full_backup_', '').replace('.tar.gz', '')
                            size_cmd = f"ls -lh {file_path} | awk '{{print $5}}'"
                            size_stdout, _ = ssh_exec(size_cmd)
                            size = size_stdout.strip() if size_stdout else "N/A"
                            table.add_row("Full", timestamp, filename, size)
            
            # Afficher les backups DB
            if db_stdout.strip():
                for line in db_stdout.strip().split('\n'):
                    if line.strip() and '.sql.gz' in line:
                        file_path = line.strip()
                        filename = file_path.split('/')[-1]
                        # Format: reboulstore_db_YYYYMMDD_HHMMSS.sql.gz
                        if 'reboulstore_db_' in filename and '$' not in filename:
                            timestamp = filename.replace('reboulstore_db_', '').replace('.sql.gz', '')
                            # Vérifier que c'est un timestamp valide (format YYYYMMDD_HHMMSS)
                            if len(timestamp) == 15 and timestamp.replace('_', '').isdigit():
                                size_cmd = f"ls -lh {file_path} | awk '{{print $5}}'"
                                size_stdout, _ = ssh_exec(size_cmd)
                                size = size_stdout.strip() if size_stdout else "N/A"
                                table.add_row("DB", timestamp, filename, size)
            
            console.print(table)
            console.print("\n[cyan]💡 Utilisez: ./rcli server rollback --to <timestamp> pour restaurer[/cyan]")
        else:
            console.print("[yellow]⚠️  Aucun backup trouvé[/yellow]")
        
        return
    
    # Rollback vers un backup spécifique
    if to or latest:
        if latest:
            # Trouver le dernier backup complet ou DB
            latest_cmd = f"ls -t {backup_dir}/full_backup_*.tar.gz {backup_dir}/reboulstore_db_*.sql.gz 2>/dev/null | head -1 || echo ''"
            latest_stdout, _ = ssh_exec(latest_cmd)
            
            if not latest_stdout.strip():
                console.print("[red]❌ Aucun backup trouvé[/red]")
                return
            
            backup_file = latest_stdout.strip()
            # Extraire le timestamp
            filename = backup_file.split('/')[-1]
            if 'full_backup_' in filename:
                to = filename.replace('full_backup_', '').replace('.tar.gz', '')
            elif 'reboulstore_db_' in filename:
                to = filename.replace('reboulstore_db_', '').replace('.sql.gz', '')
        
        if not to:
            console.print("[red]❌ Timestamp invalide[/red]")
            return
        
        console.print(f"[bold yellow]🔄 Rollback vers le backup du {to}...[/bold yellow]\n")
        
        if not yes:
            confirm = click.confirm(f"[yellow]⚠️  ATTENTION: Cette action va restaurer la base de données depuis le backup. Continuer ?[/yellow]")
            if not confirm:
                console.print("[yellow]Rollback annulé[/yellow]")
                return
        
        # Chercher le backup
        # Essayer d'abord le backup complet
        full_backup = f"{backup_dir}/full_backup_{to}.tar.gz"
        db_backup = f"{backup_dir}/reboulstore_db_{to}.sql.gz"
        
        # Vérifier lequel existe
        check_full_cmd = f"test -f {full_backup} && echo 'exists' || echo 'missing'"
        check_db_cmd = f"test -f {db_backup} && echo 'exists' || echo 'missing'"
        
        full_exists = 'exists' in ssh_exec(check_full_cmd)[0]
        db_exists = 'exists' in ssh_exec(check_db_cmd)[0]
        
        if not full_exists and not db_exists:
            console.print(f"[red]❌ Aucun backup trouvé pour le timestamp: {to}[/red]")
            console.print("[blue]💡 Utilisez './rcli server rollback --list' pour voir les backups disponibles[/blue]")
            return
        
        # Restaurer depuis backup complet
        if full_exists and not db_only:
            console.print("[cyan]📦 Restauration depuis backup complet...[/cyan]\n")
            
            # Extraire le backup dans un dossier temporaire
            temp_dir = f"/tmp/rollback_{to}"
            extract_cmd = f"mkdir -p {temp_dir} && tar -xzf {full_backup} -C {temp_dir} && echo 'extracted'"
            extract_stdout, extract_stderr = ssh_exec(extract_cmd)
            
            if 'extracted' not in extract_stdout:
                console.print(f"[red]❌ Erreur lors de l'extraction: {extract_stderr}[/red]")
                return
            
            # Restaurer la DB
            console.print("[cyan]🗄️  Restauration de la base de données...[/cyan]")
            if ssh_exec(f"test -f {temp_dir}/reboulstore_db.sql.gz && echo 'exists' || echo 'missing'")[0] == 'exists':
                restore_db_cmd = f"""
                docker exec -i reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db < <(gunzip -c {temp_dir}/reboulstore_db.sql.gz) && 
                echo 'DB restored'
                """
                # Alternative: utiliser pg_restore si c'est un dump custom
                restore_db_cmd = f"gunzip -c {temp_dir}/reboulstore_db.sql.gz | docker exec -i reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db && echo 'DB restored'"
                restore_stdout, restore_stderr = ssh_exec(restore_db_cmd)
                
                if 'DB restored' in restore_stdout or not restore_stderr:
                    console.print("  [green]✅ Base de données restaurée[/green]")
                else:
                    console.print(f"  [red]❌ Erreur lors de la restauration DB: {restore_stderr}[/red]")
            
            # Nettoyer le dossier temporaire
            ssh_exec(f"rm -rf {temp_dir}")
            console.print("\n[green]✅ Rollback terminé[/green]")
        
        # Restaurer uniquement la DB
        elif db_exists:
            console.print("[cyan]🗄️  Restauration de la base de données uniquement...[/cyan]\n")
            
            restore_db_cmd = f"gunzip -c {db_backup} | docker exec -i reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db && echo 'DB restored'"
            restore_stdout, restore_stderr = ssh_exec(restore_db_cmd)
            
            if 'DB restored' in restore_stdout or (not restore_stderr or 'error' not in restore_stderr.lower()):
                console.print("  [green]✅ Base de données restaurée[/green]")
                console.print("\n[green]✅ Rollback terminé[/green]")
            else:
                console.print(f"  [red]❌ Erreur lors de la restauration DB: {restore_stderr}[/red]")
        else:
            console.print(f"[red]❌ Backup complet trouvé mais option --db-only spécifiée et pas de backup DB séparé[/red]")
        
        return
    
    # Si aucune option n'est spécifiée, afficher l'aide
    console.print("[yellow]Utilisez --list, --to <timestamp>, ou --latest[/yellow]")
    console.print("\n[cyan]Exemples:[/cyan]")
    console.print("  ./rcli server rollback --list")
    console.print("  ./rcli server rollback --to 20250129_120000")
    console.print("  ./rcli server rollback --latest")
    console.print("  ./rcli server rollback --latest --db-only")


@server_group.command('backup')
@click.option('--full', is_flag=True, help='Backup complet (DB + fichiers + configs)')
def backup(full: bool):
    """💾 Backup complet du système (DB + fichiers + configs)"""
    from datetime import datetime
    from utils.server_helper import SERVER_CONFIG
    
    if not full:
        console.print("[yellow]Utilisez --full pour créer un backup complet[/yellow]")
        console.print("\n[cyan]Exemples:[/cyan]")
        console.print("  ./rcli server backup --full")
        return
    
    console.print("[bold cyan]💾 Création d'un backup complet du système...[/bold cyan]\n")
    
    project_dir = SERVER_CONFIG['project_path']
    backup_dir = f"{project_dir}/backups"
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = f"{backup_dir}/full_backup_{timestamp}.tar.gz"
    temp_dir = f"/tmp/reboulstore_backup_{timestamp}"
    
    console.print("[cyan]📦 Étape 1/4: Backup de la base de données...[/cyan]")
    
    # 1. Backup DB
    db_backup_file = f"{temp_dir}/reboulstore_db.sql.gz"
    db_backup_cmd = f"""
    mkdir -p {temp_dir} && 
    docker exec reboulstore-postgres-prod pg_dump -U reboulstore -d reboulstore_db | gzip > {db_backup_file} &&
    echo "DB backup created: $(ls -lh {db_backup_file} | awk '{{print $5}}')"
    """
    
    db_stdout, db_stderr = ssh_exec(db_backup_cmd)
    if db_stderr and 'error' in db_stderr.lower():
        console.print(f"[red]❌ Erreur lors du backup DB: {db_stderr}[/red]")
        return
    
    db_size = db_stdout.strip().split('\n')[-1] if db_stdout else "N/A"
    console.print(f"  [green]✅ Backup DB créé: {db_size}[/green]")
    
    console.print("\n[cyan]📁 Étape 2/4: Backup des fichiers uploads...[/cyan]")
    
    # 2. Backup uploads
    uploads_backup_cmd = f"""
    if [ -d {project_dir}/backend/uploads ]; then
        tar -czf {temp_dir}/uploads.tar.gz -C {project_dir}/backend uploads 2>/dev/null
        echo "Uploads backup created: $(ls -lh {temp_dir}/uploads.tar.gz | awk '{{print $5}}')"
    else
        echo "No uploads directory found"
    fi
    """
    
    uploads_stdout, _ = ssh_exec(uploads_backup_cmd)
    if 'created' in uploads_stdout:
        uploads_size = uploads_stdout.strip().split('\n')[-1] if uploads_stdout else "N/A"
        console.print(f"  [green]✅ Backup uploads créé: {uploads_size}[/green]")
    else:
        console.print("  [yellow]⚠️  Aucun dossier uploads trouvé[/yellow]")
    
    console.print("\n[cyan]⚙️  Étape 3/4: Backup des fichiers de configuration...[/cyan]")
    
    # 3. Backup configs (.env.production files)
    configs_backup_cmd = f"""
    mkdir -p {temp_dir}/configs && 
    cp {project_dir}/.env.production {temp_dir}/configs/.env.production 2>/dev/null || true &&
    cp {SERVER_CONFIG['admin_path']}/.env.production {temp_dir}/configs/.env.admin.production 2>/dev/null || true &&
    tar -czf {temp_dir}/configs.tar.gz -C {temp_dir} configs 2>/dev/null &&
    rm -rf {temp_dir}/configs &&
    if [ -f {temp_dir}/configs.tar.gz ]; then
        echo "Configs backup created: $(ls -lh {temp_dir}/configs.tar.gz | awk '{{print $5}}')"
    else
        echo "No configs found"
    fi
    """
    
    configs_stdout, _ = ssh_exec(configs_backup_cmd)
    if 'created' in configs_stdout:
        configs_size = configs_stdout.strip().split('\n')[-1] if configs_stdout else "N/A"
        console.print(f"  [green]✅ Backup configs créé: {configs_size}[/green]")
    else:
        console.print("  [yellow]⚠️  Aucun fichier de config trouvé[/yellow]")
    
    console.print("\n[cyan]📦 Étape 4/4: Création de l'archive complète...[/cyan]")
    
    # 4. Créer l'archive complète
    archive_cmd = f"""
    mkdir -p {backup_dir} && 
    tar -czf {backup_file} -C {temp_dir} . && 
    rm -rf {temp_dir} &&
    ls -lh {backup_file}
    """
    
    archive_stdout, archive_stderr = ssh_exec(archive_cmd)
    
    if archive_stdout and '.tar.gz' in archive_stdout:
        console.print(f"[green]✅ Backup complet créé avec succès ![/green]\n")
        
        # Afficher les détails
        console.print("[bold]📋 Détails du backup:[/bold]")
        table = Table(box=box.ROUNDED)
        table.add_column("Composant", style="cyan")
        table.add_column("Fichier", style="green")
        
        table.add_row("Archive complète", backup_file)
        table.add_row("Base de données", "reboulstore_db.sql.gz")
        table.add_row("Uploads", "uploads.tar.gz (si existe)")
        table.add_row("Configurations", "configs.tar.gz (si existe)")
        
        console.print(table)
        console.print()
        console.print(f"[blue]📁 Emplacement: {backup_file}[/blue]")
        
        # Afficher la taille
        size_match = re.search(r'(\d+[KMGT]?)', archive_stdout)
        if size_match:
            console.print(f"[blue]💾 Taille: {size_match.group(1)}[/blue]")
        
        # Afficher le contenu
        console.print("\n[cyan]📂 Contenu de l'archive:[/cyan]")
        list_cmd = f"tar -tzf {backup_file} | head -20"
        list_stdout, _ = ssh_exec(list_cmd)
        if list_stdout:
            console.print(list_stdout)
            list_count_cmd = f"tar -tzf {backup_file} | wc -l"
            count_stdout, _ = ssh_exec(list_count_cmd)
            if count_stdout.strip().isdigit():
                console.print(f"[blue]Total: {count_stdout.strip()} fichiers[/blue]")
        
        console.print("\n[green]✅ Backup complet terminé avec succès ![/green]")
    else:
        console.print(f"[red]❌ Erreur lors de la création de l'archive complète[/red]")
        if archive_stderr:
            console.print(f"[yellow]{archive_stderr}[/yellow]")


def _check_dns(domain: str):
    """Vérifie les enregistrements DNS pour un domaine"""
    import re
    
    # A record (IPv4)
    console.print(f"[cyan]📋 Enregistrements DNS pour {domain}:[/cyan]")
    
    # A record
    a_cmd = f"dig +short {domain} A"
    a_stdout, _ = ssh_exec(a_cmd)
    
    if a_stdout and a_stdout.strip():
        a_records = [ip.strip() for ip in a_stdout.strip().split('\n') if ip.strip()]
        table = Table(box=box.ROUNDED)
        table.add_column("Type", style="cyan")
        table.add_column("Valeur", style="green")
        table.add_column("Statut", style="white")
        
        for ip in a_records:
            # Vérifier si c'est une IP valide
            ip_pattern = r'^(\d{1,3}\.){3}\d{1,3}$'
            if re.match(ip_pattern, ip):
                table.add_row("A", ip, "✅ Valide")
            else:
                table.add_row("A", ip, "⚠️ Format suspect")
        
        console.print(table)
    else:
        console.print(f"  [yellow]⚠️  Aucun enregistrement A trouvé pour {domain}[/yellow]")
    
    # AAAA record (IPv6) - optionnel
    aaaa_cmd = f"dig +short {domain} AAAA"
    aaaa_stdout, _ = ssh_exec(aaaa_cmd)
    
    if aaaa_stdout and aaaa_stdout.strip():
        aaaa_records = [ip.strip() for ip in aaaa_stdout.strip().split('\n') if ip.strip()]
        console.print("\n[cyan]Enregistrements AAAA (IPv6):[/cyan]")
        for ipv6 in aaaa_records:
            console.print(f"  [green]✅ AAAA: {ipv6}[/green]")
    
    # CNAME record
    cname_cmd = f"dig +short {domain} CNAME"
    cname_stdout, _ = ssh_exec(cname_cmd)
    
    if cname_stdout and cname_stdout.strip():
        console.print("\n[cyan]Enregistrement CNAME:[/cyan]")
        console.print(f"  [green]✅ CNAME: {cname_stdout.strip()}[/green]")
    
    # MX record (mail)
    mx_cmd = f"dig +short {domain} MX"
    mx_stdout, _ = ssh_exec(mx_cmd)
    
    if mx_stdout and mx_stdout.strip():
        mx_records = [mx.strip() for mx in mx_stdout.strip().split('\n') if mx.strip()]
        console.print("\n[cyan]Enregistrements MX (Mail):[/cyan]")
        for mx in mx_records[:5]:  # Limiter à 5
            console.print(f"  [green]✅ MX: {mx}[/green]")
    
    # TXT record (SPF, DKIM, etc.)
    txt_cmd = f"dig +short {domain} TXT"
    txt_stdout, _ = ssh_exec(txt_cmd)
    
    if txt_stdout and txt_stdout.strip():
        txt_records = [txt.strip() for txt in txt_stdout.strip().split('\n') if txt.strip()]
        console.print("\n[cyan]Enregistrements TXT:[/cyan]")
        for txt in txt_records[:3]:  # Limiter à 3
            # Tronquer les TXT trop longs
            display_txt = txt[:80] + '...' if len(txt) > 80 else txt
            console.print(f"  [green]✅ TXT: {display_txt}[/green]")
    
    # Vérifier la propagation (TTL)
    ttl_cmd = f"dig {domain} A | grep -E '^;; Query time|^;; SERVER'"
    ttl_stdout, _ = ssh_exec(ttl_cmd)
    
    if ttl_stdout:
        console.print("\n[cyan]Informations de résolution:[/cyan]")
        console.print(f"  [blue]{ttl_stdout.strip()}[/blue]")
    
    # Vérifier depuis plusieurs serveurs DNS pour voir la propagation
    dns_servers = ['8.8.8.8', '1.1.1.1', '208.67.222.222']  # Google, Cloudflare, OpenDNS
    console.print("\n[cyan]Vérification de propagation (depuis différents serveurs DNS):[/cyan]")
    
    propagation_table = Table(box=box.ROUNDED)
    propagation_table.add_column("Serveur DNS", style="cyan")
    propagation_table.add_column("IP résolue", style="green")
    propagation_table.add_column("Statut", style="white")
    
    all_ips = set()
    for dns_server in dns_servers:
        server_name = {
            '8.8.8.8': 'Google DNS',
            '1.1.1.1': 'Cloudflare DNS',
            '208.67.222.222': 'OpenDNS'
        }.get(dns_server, dns_server)
        
        check_cmd = f"dig @{dns_server} +short {domain} A"
        check_stdout, _ = ssh_exec(check_cmd)
        
        if check_stdout and check_stdout.strip():
            ip = check_stdout.strip().split('\n')[0]
            all_ips.add(ip)
            propagation_table.add_row(server_name, ip, "✅ Résolu")
        else:
            propagation_table.add_row(server_name, "N/A", "⚠️ Non résolu")
    
    console.print(propagation_table)
    
    # Résumé propagation
    if len(all_ips) == 1:
        console.print(f"\n[green]✅ Propagation OK: Tous les serveurs DNS résolvent vers {list(all_ips)[0]}[/green]")
    elif len(all_ips) > 1:
        console.print(f"\n[yellow]⚠️  Propagation partielle: Différentes IPs résolues ({len(all_ips)} différentes)[/yellow]")
        console.print("[blue]💡 Les changements DNS peuvent prendre jusqu'à 48h pour se propager complètement[/blue]")
    else:
        console.print(f"\n[red]❌ Aucune résolution DNS trouvée pour {domain}[/red]")
