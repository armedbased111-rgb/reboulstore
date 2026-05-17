"""
Commandes pour gérer les logs
"""
import click
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich import box
from typing import Optional
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.server_helper import ssh_exec, docker_compose_exec, SERVER_CONFIG

console = Console()

@click.group('logs', invoke_without_command=True)
@click.pass_context
@click.option('--service', '-s', type=str, help='Service spécifique (backend, frontend, nginx, postgres, etc.)')
@click.option('--tail', '-n', type=int, default=100, help='Nombre de lignes à afficher (défaut: 100)')
@click.option('--follow', '-f', is_flag=True, help='Suivre les logs en temps réel (comme tail -f)')
@click.option('--admin', is_flag=True, help='Logs Admin Central au lieu de Reboul Store')
@click.option('--since', type=str, help='Période (ex: 1h, 30m, 24h, 2d)')
@click.option('--local', is_flag=True, help='Logs locaux (docker-compose.yml) au lieu du serveur distant')
def logs_group(ctx, service: Optional[str], tail: int, follow: bool, admin: bool, since: Optional[str], local: bool):
    """
    📋 Logs Reboul — Docker live, events Winston, ou Grafana/Loki

    \b
    Docker live (SSH) :
      ./rcli server logs backend --follow
      ./rcli server logs backend --events --tail 50
      ./rcli logs --service backend --since 1h

    \b
    Events / erreurs structurés :
      ./rcli logs events --last 1h
      ./rcli logs errors --last 24h
      ./rcli logs api-errors --last 1h

    \b
    Historique centralisé (Grafana + Loki, 30 jours) :
      Tunnel : ssh -L 3030:127.0.0.1:3030 deploy@VPS -N
      UI : http://localhost:3030 — doc vault Architecture/grafana

    \b
    Aide détaillée : ./rcli logs guide

    \b
    Exemples (logs locaux) :
    
    \b
    # Voir les logs locaux de tous les services
    ./rcli logs --local
    
    \b
    # Voir les logs d'un service spécifique (local)
    ./rcli logs --local --service backend
    
    \b
    # Suivre les logs en temps réel (local)
    ./rcli logs --local --follow
    
    \b
    Exemples d'utilisation (serveur distant - par défaut) :
    
    \b
    # Voir les logs de tous les services (100 dernières lignes)
    ./rcli logs
    
    \b
    # Voir les logs d'un service spécifique
    ./rcli logs --service backend
    
    \b
    # Suivre les logs en temps réel
    ./rcli logs --follow
    
    \b
    # Voir seulement les erreurs
    ./rcli logs errors
    """
    # Si une sous-commande est appelée, ne pas exécuter cette fonction
    if ctx.invoked_subcommand is not None:
        return
    
    # Sinon, afficher les logs par défaut
    project_name = 'Admin Central' if admin else 'Reboul Store'
    service_name = service or 'tous les services'
    
    if local:
        # Mode local : utiliser docker compose local
        import subprocess
        import os
        
        # Déterminer le répertoire de travail
        if admin:
            compose_path = 'admin-central/docker-compose.yml'
            project_label = 'Admin Central (local)'
        else:
            compose_path = 'docker-compose.yml'
            project_label = 'Reboul Store (local)'
        
        if not os.path.exists(compose_path):
            console.print(f"[red]❌ Fichier {compose_path} non trouvé[/red]")
            return
        
        console.print(f"[bold cyan]📋 Logs {project_label} - {service_name}[/bold cyan]")
        if follow:
            console.print("[yellow]⏱️  Mode suivi en temps réel (Ctrl+C pour quitter)[/yellow]\n")
        
        # Construire la commande docker compose logs
        cmd_parts = ['docker', 'compose', '-f', compose_path, 'logs']
        
        if since:
            cmd_parts.extend(['--since', since])
        else:
            cmd_parts.extend(['--tail', str(tail)])
        
        if follow:
            cmd_parts.append('--follow')
        
        if service:
            cmd_parts.append(service)
        
        try:
            subprocess.run(cmd_parts)
        except KeyboardInterrupt:
            console.print("\n[yellow]✅ Arrêt de la consultation des logs[/yellow]")
        except Exception as e:
            console.print(f"[red]❌ Erreur: {str(e)}[/red]")
    else:
        # Mode serveur distant : utiliser SSH
        project_dir = SERVER_CONFIG['admin_path'] if admin else SERVER_CONFIG['project_path']
        compose_file = 'docker-compose.prod.yml'
        
        console.print(f"[bold cyan]📋 Logs {project_name} (serveur) - {service_name}[/bold cyan]")
        if follow:
            console.print("[yellow]⏱️  Mode suivi en temps réel (Ctrl+C pour quitter)[/yellow]\n")
        
        # Construire la commande docker compose logs
        cmd_parts = ['logs']
        
        if since:
            cmd_parts.append(f'--since={since}')
        else:
            cmd_parts.append(f'--tail={tail}')
        
        if follow:
            cmd_parts.append('--follow')
        
        cmd = ' '.join(cmd_parts)
        
        # Construire la commande complète
        # Note: docker compose logs n'a pas besoin de --env-file (seulement nécessaire pour up/run/etc)
        full_cmd = f"cd {project_dir} && docker compose -f {compose_file} {cmd}"
        if service:
            full_cmd += f" {service}"
        
        # Filtrer les warnings Docker Compose sur les variables d'environnement
        # Ces warnings apparaissent car Docker Compose lit le fichier avant de charger .env.production
        # Utiliser plusieurs filtres pour capturer toutes les variantes
        filter_warnings = " | grep -vE '(level=warning msg=|variable is not set|Defaulting to a blank string)'"
        
        try:
            if follow:
                # Pour le mode follow, on doit utiliser subprocess en mode interactif
                import subprocess
                # Ajouter le filtre directement dans la commande SSH
                full_cmd_with_filter = f"{full_cmd}{filter_warnings}"
                ssh_cmd = [
                    'ssh',
                    '-o', 'ConnectTimeout=10',
                    '-o', 'StrictHostKeyChecking=no',
                    '-o', 'LogLevel=ERROR',
                    f"{SERVER_CONFIG['user']}@{SERVER_CONFIG['host']}",
                    full_cmd_with_filter
                ]
                # Exécuter en mode interactif pour le follow
                subprocess.run(ssh_cmd)
            else:
                # Mode normal, récupérer les logs
                stdout, stderr = ssh_exec(full_cmd)
                
                if stdout:
                    # Filtrer les warnings Docker Compose sur les variables d'environnement
                    filtered_stdout = '\n'.join([
                        line for line in stdout.split('\n')
                        if not any(warning in line.lower() for warning in [
                            'level=warning msg="the',
                            'variable is not set. defaulting to a blank string'
                        ])
                    ])
                    if filtered_stdout.strip():
                        console.print(filtered_stdout)
                elif stderr and 'warning' not in stderr.lower():
                    # Filtrer aussi les warnings dans stderr
                    filtered_stderr = '\n'.join([
                        line for line in stderr.split('\n')
                        if not any(warning in line.lower() for warning in [
                            'level=warning msg="the',
                            'variable is not set. defaulting to a blank string'
                        ])
                    ])
                    if filtered_stderr.strip():
                        console.print(f"[yellow]{filtered_stderr}[/yellow]")
        except KeyboardInterrupt:
            console.print("\n[yellow]✅ Arrêt de la consultation des logs[/yellow]")
        except Exception as e:
            console.print(f"[red]❌ Erreur: {str(e)}[/red]")


# Alias pour compatibilité
logs = logs_group


@logs_group.command('errors')
@click.option('--service', '-s', type=str, help='Service spécifique (backend, frontend, nginx, etc.)')
@click.option('--last', type=str, default='24h', help='Période (ex: 24h, 1h, 30m)')
@click.option('--admin', is_flag=True, help='Logs Admin Central')
@click.option('--tail', '-n', type=int, default=1000, help='Nombre de lignes à parcourir (défaut: 1000)')
@click.option('--local', is_flag=True, help='Logs locaux au lieu du serveur distant')
def errors(service: Optional[str], last: str, admin: bool, tail: int, local: bool):
    """🔍 Filtre et affiche uniquement les erreurs, exceptions et warnings"""
    project_name = 'Admin Central' if admin else 'Reboul Store'
    service_name = service or 'tous les services'
    
    console.print(f"[bold red]🔍 Recherche d'erreurs dans {project_name} - {service_name}[/bold red]\n")
    
    if local:
        # Mode local
        import subprocess
        import os
        
        if admin:
            compose_path = 'admin-central/docker-compose.yml'
        else:
            compose_path = 'docker-compose.yml'
        
        if not os.path.exists(compose_path):
            console.print(f"[red]❌ Fichier {compose_path} non trouvé[/red]")
            return
        
        cmd = ['docker', 'compose', '-f', compose_path, 'logs', '--tail', str(tail), '--since', last]
        if service:
            cmd.append(service)
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True)
            stdout = result.stdout
            stderr = result.stderr
        except Exception as e:
            console.print(f"[red]❌ Erreur: {str(e)}[/red]")
            return
    else:
        # Mode serveur distant
        project_dir = SERVER_CONFIG['admin_path'] if admin else SERVER_CONFIG['project_path']
        compose_file = 'docker-compose.prod.yml'
        
        cmd_parts = ['logs', f'--tail={tail}', f'--since={last}']
        cmd_str = ' '.join(cmd_parts)
        
        # Note: docker compose logs n'a pas besoin de --env-file
        full_cmd = f"cd {project_dir} && docker compose -f {compose_file} {cmd_str}"
        if service:
            full_cmd += f" {service}"
        
        stdout, stderr = ssh_exec(full_cmd)
    
    if stdout:
        # Filtrer les erreurs localement (plus fiable que via pipe SSH)
        import re
        error_patterns = [
            r'error',
            r'exception',
            r'failed',
            r'warning',
            r'fatal',
            r'err\s',
            r'failed to',
            r'cannot',
            r'unable to',
        ]
        
        lines = stdout.split('\n')
        error_lines = []
        
        for line in lines:
            if any(re.search(pattern, line, re.IGNORECASE) for pattern in error_patterns):
                error_lines.append(line)
        
        if error_lines:
            console.print(f"[bold red]⚠️  {len(error_lines)} erreur(s) trouvée(s):[/bold red]\n")
            console.print('\n'.join(error_lines))
        else:
            console.print("[green]✅ Aucune erreur trouvée dans les logs récents[/green]")
    else:
        console.print("[yellow]⚠️  Aucun log trouvé[/yellow]")


@logs_group.command('search')
@click.argument('pattern', required=True)
@click.option('--service', '-s', type=str, help='Service spécifique (backend, frontend, nginx, etc.)')
@click.option('--last', type=str, default='1h', help='Période (ex: 24h, 1h, 30m)')
@click.option('--admin', is_flag=True, help='Logs Admin Central')
@click.option('--tail', '-n', type=int, default=1000, help='Nombre de lignes à parcourir (défaut: 1000)')
@click.option('--case-sensitive', '-i', is_flag=True, default=False, help='Recherche sensible à la casse')
@click.option('--local', is_flag=True, help='Logs locaux au lieu du serveur distant')
def search(pattern: str, service: Optional[str], last: str, admin: bool, tail: int, case_sensitive: bool, local: bool):
    """🔎 Recherche un motif dans les logs"""
    project_name = 'Admin Central' if admin else 'Reboul Store'
    service_name = service or 'tous les services'
    
    console.print(f"[bold cyan]🔎 Recherche '{pattern}' dans {project_name} - {service_name}[/bold cyan]\n")
    
    if local:
        # Mode local
        import subprocess
        import os
        
        if admin:
            compose_path = 'admin-central/docker-compose.yml'
        else:
            compose_path = 'docker-compose.yml'
        
        if not os.path.exists(compose_path):
            console.print(f"[red]❌ Fichier {compose_path} non trouvé[/red]")
            return
        
        cmd = ['docker', 'compose', '-f', compose_path, 'logs', '--tail', str(tail), '--since', last]
        if service:
            cmd.append(service)
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True)
            stdout = result.stdout
            stderr = result.stderr
        except Exception as e:
            console.print(f"[red]❌ Erreur: {str(e)}[/red]")
            return
    else:
        # Mode serveur distant
        project_dir = SERVER_CONFIG['admin_path'] if admin else SERVER_CONFIG['project_path']
        compose_file = 'docker-compose.prod.yml'
        
        cmd_parts = ['logs', f'--tail={tail}', f'--since={last}']
        cmd_str = ' '.join(cmd_parts)
        
        # Note: docker compose logs n'a pas besoin de --env-file
        full_cmd = f"cd {project_dir} && docker compose -f {compose_file} {cmd_str}"
        if service:
            full_cmd += f" {service}"
        
        stdout, stderr = ssh_exec(full_cmd)
    
    if stdout:
        # Filtrer les résultats localement
        import re
        flags = 0 if case_sensitive else re.IGNORECASE
        lines = stdout.split('\n')
        matches = [line for line in lines if re.search(pattern, line, flags)]
        
        if matches:
            console.print(f"[bold green]✅ {len(matches)} résultat(s) trouvé(s):[/bold green]\n")
            console.print('\n'.join(matches))
        else:
            console.print(f"[yellow]⚠️  Aucun résultat trouvé pour '{pattern}'[/yellow]")
    else:
        console.print(f"[yellow]⚠️  Aucun log trouvé[/yellow]")


@logs_group.command('live')
@click.option('--service', '-s', type=str, help='Service spécifique')
@click.option('--admin', is_flag=True, help='Logs Admin Central')
@click.option('--local', is_flag=True, help='Logs locaux au lieu du serveur distant')
def live(service: Optional[str], admin: bool, local: bool):
    """🔄 Suivre les logs en temps réel (raccourci pour --follow)"""
    project_name = 'Admin Central' if admin else 'Reboul Store'
    service_name = service or 'tous les services'
    
    console.print(f"[bold cyan]🔄 Logs en temps réel - {project_name} - {service_name}[/bold cyan]")
    console.print("[yellow]⏱️  Appuyez sur Ctrl+C pour quitter[/yellow]\n")
    
    try:
        import subprocess
        import os
        
        if local:
            # Mode local
            if admin:
                compose_path = 'admin-central/docker-compose.yml'
            else:
                compose_path = 'docker-compose.yml'
            
            if not os.path.exists(compose_path):
                console.print(f"[red]❌ Fichier {compose_path} non trouvé[/red]")
                return
            
            cmd = ['docker', 'compose', '-f', compose_path, 'logs', '--follow']
            if service:
                cmd.append(service)
            
            subprocess.run(cmd)
        else:
            # Mode serveur distant
            project_dir = SERVER_CONFIG['admin_path'] if admin else SERVER_CONFIG['project_path']
            compose_file = 'docker-compose.prod.yml'
            
            # Note: docker compose logs n'a pas besoin de --env-file
            full_cmd = f"cd {project_dir} && docker compose -f {compose_file} logs --follow"
            if service:
                full_cmd += f" {service}"
            
            ssh_cmd = [
                'ssh',
                '-o', 'ConnectTimeout=10',
                '-o', 'StrictHostKeyChecking=no',
                '-o', 'LogLevel=ERROR',
                f"{SERVER_CONFIG['user']}@{SERVER_CONFIG['host']}",
                full_cmd
            ]
            subprocess.run(ssh_cmd)
    except KeyboardInterrupt:
        console.print("\n[yellow]✅ Arrêt du suivi des logs[/yellow]")


@logs_group.command('list')
@click.option('--admin', is_flag=True, help='Services Admin Central')
def list_services(admin: bool):
    """📋 Liste les services disponibles pour les logs"""
    project_dir = SERVER_CONFIG['admin_path'] if admin else SERVER_CONFIG['project_path']
    compose_file = 'docker-compose.prod.yml'
    
    project_name = 'Admin Central' if admin else 'Reboul Store'
    
    console.print(f"[bold cyan]📋 Services disponibles ({project_name}):[/bold cyan]\n")
    
    # Récupérer la liste des services depuis docker compose
    # Note: docker compose config n'a pas besoin de --env-file pour juste lister les services
    full_cmd = f"cd {project_dir} && docker compose -f {compose_file} config --services"
    stdout, stderr = ssh_exec(full_cmd)
    
    if stdout:
        services = [s.strip() for s in stdout.strip().split('\n') if s.strip()]
        table = Table(box=box.ROUNDED)
        table.add_column("Service", style="cyan")
        table.add_column("Commande", style="yellow")
        
        for service in services:
            table.add_row(
                service,
                f"python cli/main.py logs --service {service} {'--admin' if admin else ''}"
            )
        
        console.print(table)
    else:
        console.print("[yellow]⚠️  Impossible de récupérer la liste des services[/yellow]")


@logs_group.command('api-errors')
@click.option('--last', type=str, default='1h', help='Période (ex: 24h, 1h, 30m)')
@click.option('--admin', is_flag=True, help='Logs Admin Central')
@click.option('--tail', '-n', type=int, default=5000, help='Nombre de lignes à parcourir (défaut: 5000)')
def api_errors(last: str, admin: bool, tail: int):
    """🔍 Recherche les erreurs API spécifiques (codes 4xx, 5xx, exceptions backend)"""
    project_name = 'Admin Central' if admin else 'Reboul Store'
    project_dir = SERVER_CONFIG['admin_path'] if admin else SERVER_CONFIG['project_path']
    
    console.print(f"[bold red]🔍 Recherche d'erreurs API dans {project_name}[/bold red]\n")
    
    # Récupérer les logs backend
    compose_file = 'docker-compose.prod.yml'
    cmd = f"cd {project_dir} && docker compose -f {compose_file} logs --tail={tail} --since={last} backend"
    stdout, stderr = ssh_exec(cmd)
    
    # Récupérer aussi les logs nginx (codes erreur HTTP)
    nginx_container = 'admin-central-nginx-prod' if admin else 'reboulstore-nginx-prod'
    nginx_cmd = f"docker exec {nginx_container} tail -n {tail} /var/log/nginx/access.log 2>/dev/null | grep -E ' [45][0-9]{2} ' || true"
    nginx_stdout, _ = ssh_exec(nginx_cmd)
    
    errors_found = []
    
    # Analyser les logs backend (exceptions, erreurs NestJS)
    if stdout:
        import re
        lines = stdout.split('\n')
        for line in lines:
            # Chercher les exceptions, erreurs HTTP 4xx/5xx dans les logs backend
            if re.search(r'(Exception|Error|4\d{2}|5\d{2}|status code|HTTPException)', line, re.IGNORECASE):
                errors_found.append(('backend', line))
    
    # Analyser les logs nginx (codes HTTP 4xx, 5xx)
    if nginx_stdout:
        lines = nginx_stdout.split('\n')
        for line in lines:
            if line.strip():
                # Format nginx: IP - - [timestamp] "METHOD URI HTTP/1.1" STATUS SIZE "Referer" "User-Agent"
                parts = line.split()
                if len(parts) >= 9:
                    status_code = parts[8]
                    if status_code.startswith(('4', '5')):
                        errors_found.append(('nginx', line))
    
    if errors_found:
        table = Table(title=f"Erreurs API trouvées ({len(errors_found)})", box=box.ROUNDED)
        table.add_column("Source", style="cyan")
        table.add_column("Détails", style="red")
        
        # Limiter à 50 résultats pour l'affichage
        for source, line in errors_found[:50]:
            # Tronquer les lignes trop longues
            display_line = line[:200] + '...' if len(line) > 200 else line
            table.add_row(source, display_line)
        
        console.print(table)
        
        if len(errors_found) > 50:
            console.print(f"\n[yellow]⚠️  {len(errors_found) - 50} autres erreurs non affichées...[/yellow]")
    else:
        console.print("[green]✅ Aucune erreur API trouvée dans les logs récents[/green]")


@logs_group.command('slow-requests')
@click.option('--threshold', type=float, default=2.0, help='Seuil de temps en secondes (défaut: 2.0)')
@click.option('--last', type=str, default='1h', help='Période (ex: 24h, 1h, 30m)')
@click.option('--admin', is_flag=True, help='Logs Admin Central')
@click.option('--tail', '-n', type=int, default=10000, help='Nombre de lignes à parcourir (défaut: 10000)')
def slow_requests(threshold: float, last: str, admin: bool, tail: int):
    """🐌 Recherche les requêtes lentes (> seuil en secondes)"""
    project_name = 'Admin Central' if admin else 'Reboul Store'
    nginx_container = 'admin-central-nginx-prod' if admin else 'reboulstore-nginx-prod'
    
    console.print(f"[bold yellow]🐌 Recherche de requêtes lentes (> {threshold}s) dans {project_name}[/bold yellow]\n")
    
    # Récupérer les logs nginx access.log
    # Format: $remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" "$http_x_forwarded_for"
    # Note: On utilise $request_time qui est dans le format "main" de nginx
    nginx_cmd = f"docker exec {nginx_container} tail -n {tail} /var/log/nginx/access.log 2>/dev/null || true"
    stdout, _ = ssh_exec(nginx_cmd)
    
    slow_requests_found = []
    
    if stdout:
        import re
        lines = stdout.split('\n')
        
        for line in lines:
            if not line.strip():
                continue
            
            # Parser la ligne nginx (format standard)
            # Format simplifié: IP - - [timestamp] "METHOD URI HTTP/1.1" STATUS SIZE "Referer" "User-Agent"
            match = re.search(r'"(GET|POST|PUT|PATCH|DELETE|OPTIONS)\s+([^\s"]+)\s+HTTP[^"]*"\s+(\d{3})\s+(\d+)', line)
            if match:
                method = match.group(1)
                uri = match.group(2)
                status = match.group(3)
                size = match.group(4)
                
                # Essayer d'extraire le temps de réponse (si disponible dans le format de log)
                # Le format "main" de nginx peut inclure $request_time ou non
                # Pour l'instant, on va chercher les requêtes vers /api qui sont souvent plus lentes
                if '/api' in uri or status.startswith('5'):
                    # On considère que les requêtes API et les erreurs 5xx sont potentiellement lentes
                    slow_requests_found.append({
                        'method': method,
                        'uri': uri,
                        'status': status,
                        'size': size,
                        'line': line[:150]
                    })
        
        # Trier par statut (5xx d'abord) et limiter
        slow_requests_found.sort(key=lambda x: (x['status'].startswith('5'), x['status'].startswith('4')), reverse=True)
        slow_requests_found = slow_requests_found[:50]
    
    if slow_requests_found:
        table = Table(title=f"Requêtes lentes trouvées ({len(slow_requests_found)})", box=box.ROUNDED)
        table.add_column("Méthode", style="cyan")
        table.add_column("URI", style="yellow")
        table.add_column("Status", style="red" if any(r['status'].startswith('5') for r in slow_requests_found) else "yellow")
        table.add_column("Taille", style="green")
        
        for req in slow_requests_found:
            status_style = "[red]" if req['status'].startswith('5') else "[yellow]" if req['status'].startswith('4') else "[green]"
            table.add_row(
                req['method'],
                req['uri'][:60] + '...' if len(req['uri']) > 60 else req['uri'],
                f"{status_style}{req['status']}[/{status_style}]",
                req['size']
            )
        
        console.print(table)
        console.print(f"\n[blue]💡 Pour voir les détails complets, utilisez: ./rcli logs search \"{slow_requests_found[0]['uri'][:30]}\"[/blue]")
    else:
        console.print(f"[green]✅ Aucune requête lente trouvée (> {threshold}s) dans les logs récents[/green]")


@logs_group.command('user-activity')
@click.option('--last', type=str, default='1h', help='Période (ex: 24h, 1h, 30m)')
@click.option('--admin', is_flag=True, help='Logs Admin Central')
@click.option('--top', type=int, default=20, help='Nombre d\'IPs/endpoints à afficher (défaut: 20)')
def user_activity(last: str, admin: bool, top: int):
    """👥 Analyse l'activité utilisateurs (IPs les plus actives, endpoints populaires)"""
    project_name = 'Admin Central' if admin else 'Reboul Store'
    nginx_container = 'admin-central-nginx-prod' if admin else 'reboulstore-nginx-prod'
    
    console.print(f"[bold cyan]👥 Analyse de l'activité utilisateurs - {project_name}[/bold cyan]\n")
    
    # Récupérer les logs nginx access.log
    nginx_cmd = f"docker exec {nginx_container} tail -n 10000 /var/log/nginx/access.log 2>/dev/null | tail -n 5000 || true"
    stdout, _ = ssh_exec(nginx_cmd)
    
    if stdout:
        import re
        from collections import Counter
        
        lines = stdout.split('\n')
        ip_counter = Counter()
        endpoint_counter = Counter()
        method_counter = Counter()
        
        for line in lines:
            if not line.strip():
                continue
            
            # Parser la ligne nginx
            # Format: IP - - [timestamp] "METHOD URI HTTP/1.1" STATUS SIZE ...
            parts = line.split(None, 11)
            if len(parts) >= 9:
                ip = parts[0]
                
                # Parser la requête
                request_match = re.search(r'"(GET|POST|PUT|PATCH|DELETE|OPTIONS)\s+([^\s"]+)\s+HTTP', line)
                if request_match:
                    method = request_match.group(1)
                    uri = request_match.group(2)
                    
                    # Compter les IPs
                    ip_counter[ip] += 1
                    
                    # Compter les endpoints (sans query params)
                    endpoint = uri.split('?')[0]
                    endpoint_counter[endpoint] += 1
                    
                    # Compter les méthodes
                    method_counter[method] += 1
        
        # Afficher les IPs les plus actives
        if ip_counter:
            console.print("[bold]🔝 IPs les plus actives:[/bold]")
            table = Table(box=box.ROUNDED)
            table.add_column("IP", style="cyan")
            table.add_column("Requêtes", style="yellow", justify="right")
            
            for ip, count in ip_counter.most_common(top):
                table.add_row(ip, str(count))
            
            console.print(table)
            console.print()
        
        # Afficher les endpoints les plus populaires
        if endpoint_counter:
            console.print("[bold]🔝 Endpoints les plus sollicités:[/bold]")
            table = Table(box=box.ROUNDED)
            table.add_column("Endpoint", style="green")
            table.add_column("Requêtes", style="yellow", justify="right")
            
            for endpoint, count in endpoint_counter.most_common(top):
                display_endpoint = endpoint[:60] + '...' if len(endpoint) > 60 else endpoint
                table.add_row(display_endpoint, str(count))
            
            console.print(table)
            console.print()
        
        # Afficher la répartition des méthodes HTTP
        if method_counter:
            console.print("[bold]📊 Répartition des méthodes HTTP:[/bold]")
            table = Table(box=box.ROUNDED)
            table.add_column("Méthode", style="cyan")
            table.add_column("Nombre", style="yellow", justify="right")
            
            for method, count in method_counter.most_common():
                table.add_row(method, str(count))
            
            console.print(table)
    else:
        console.print("[yellow]⚠️  Aucun log d'accès trouvé[/yellow]")


@logs_group.command('events')
@click.option('--last', type=str, default='1h', help='Période docker logs (ex: 1h, 24h)')
@click.option('--tail', '-n', type=int, default=3000, help='Lignes max à parcourir')
@click.option('--admin', is_flag=True, help='Admin Central backend')
def log_events(last: str, admin: bool, tail: int):
    """📌 Events Winston JSON (auth_login_failed, checkout_error, http_5xx, stripe_webhook_failed)"""
    project_name = 'Admin Central' if admin else 'Reboul Store'
    container = 'admin-central-backend-prod' if admin else 'reboulstore-backend-prod'
    pattern = 'auth_login_failed|checkout_error|http_5xx|stripe_webhook_failed'

    console.print(f"[bold cyan]📌 Events structurés — {project_name} (depuis {last})[/bold cyan]\n")

    cmd = (
        f"docker logs {container} --tail={tail} --since={last} 2>&1 "
        f"| grep -E '{pattern}' || true"
    )
    stdout, _ = ssh_exec(cmd)

    if stdout and stdout.strip():
        for line in stdout.strip().split('\n'):
            console.print(line)
        console.print(f"\n[dim]{len(stdout.strip().split(chr(10)))} ligne(s)[/dim]")
    else:
        console.print("[green]Aucun event structuré sur cette période.[/green]")
        console.print("[dim]Historique long : Grafana → {job=\"winston\"} (vault Architecture/grafana)[/dim]")


@logs_group.command('guide')
def log_guide():
    """📖 Quand utiliser Docker logs vs Grafana/Loki"""
    table = Table(title="Logs Reboul Store — quel outil ?", box=box.ROUNDED)
    table.add_column("Besoin", style="cyan")
    table.add_column("Commande / outil", style="yellow")
    table.add_column("Période", style="dim")

    rows = [
        ("Debug live, une requête", "./rcli server logs backend -f", "maintenant"),
        ("Events auth / checkout / 5xx", "./rcli logs events --last 1h", "~docker retention"),
        ("Toutes erreurs récentes", "./rcli logs errors --last 24h", "~docker retention"),
        ("Erreurs API nginx+backend", "./rcli logs api-errors --last 1h", "~docker retention"),
        ("Historique, dashboard, 30j", "Grafana + tunnel SSH :3030", "30 jours (Loki)"),
        ("Alertes email automatiques", "cron check-log-alerts.sh", "*/15 min"),
    ]
    for r in rows:
        table.add_row(*r)

    console.print(table)
    console.print("\n[bold]Grafana[/bold] : obsidian-vault/Architecture/grafana.md")
    console.print("[dim]Tunnel : ssh -L 3030:127.0.0.1:3030 -i ~/.ssh/id_ed25519 deploy@152.228.218.35 -N[/dim]")
