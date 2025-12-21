"""
Commandes pour vérifier la santé des services
"""
import click
from rich.console import Console
from rich.table import Table
from rich import box
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.server_helper import ssh_exec, docker_compose_exec, check_url, get_container_status, SERVER_CONFIG
import sys

console = Console()

@click.group('health')
def health_group():
    """Commandes pour vérifier la santé des services"""
    pass

# Alias pour compatibilité
health = health_group


@health.command('check')
@click.option('--service', type=click.Choice(['reboul', 'admin', 'all']), default='all', help='Service à vérifier')
def check(service: str):
    """Vérifie la santé de tous les services"""
    console.print("[bold]🏥 Vérification de santé...[/bold]\n")
    
    table = Table(title="Health Check", box=box.ROUNDED)
    table.add_column("Service", style="cyan")
    table.add_column("Type", style="yellow")
    table.add_column("Status", style="green")
    table.add_column("Details", style="white")
    
    def check_frontend(url: str, name: str):
        success, code, _ = check_url(url)
        status = "✅ OK" if success else "❌ DOWN"
        style = "green" if success else "red"
        table.add_row(name, "Frontend", f"[{style}]{status}[/{style}]", f"HTTP {code}" if code else "N/A")
        return success
    
    def check_backend(url: str, name: str):
        success, code, response = check_url(url)
        status = "✅ OK" if success else "❌ DOWN"
        style = "green" if success else "red"
        details = f"HTTP {code}"
        if success and 'status' in response.lower():
            details += " (Healthcheck OK)"
        table.add_row(name, "Backend", f"[{style}]{status}[/{style}]", details)
        return success
    
    def check_database():
        # Vérifier connexion DB via container
        # Méthode 1: Tenter psql direct
        stdout, stderr = docker_compose_exec(
            "exec -T postgres psql -U reboulstore -d reboulstore_db -c 'SELECT 1;' 2>&1",
            cwd=SERVER_CONFIG['project_path']
        )
        
        # Le résultat peut contenir "1" ou "(1 row)"
        success_psql = '1' in stdout or '(1 row)' in stdout or 'SELECT 1' in stdout
        
        # Méthode 2: Si psql échoue, vérifier que le container est healthy
        if not success_psql:
            ps_stdout, _ = docker_compose_exec("ps postgres --format '{{.Status}}'", cwd=SERVER_CONFIG['project_path'])
            container_healthy = 'healthy' in ps_stdout.lower() or 'up' in ps_stdout.lower()
            
            # Si le container est healthy ET que le backend fonctionne, la DB fonctionne
            backend_ok = results.get('reboul_backend', False) or results.get('admin_backend', False)
            success = container_healthy and backend_ok
        else:
            success = True
        
        status = "✅ OK" if success else "❌ ERROR"
        style = "green" if success else "red"
        details = "Connected" if success else (stderr[:50] if stderr else "Container check")
        table.add_row("PostgreSQL", "Database", f"[{style}]{status}[/{style}]", details)
        return success
    
    results = {}
    
    if service in ['reboul', 'all']:
        results['reboul_frontend'] = check_frontend('http://www.reboulstore.com', 'Reboul Store')
        results['reboul_backend'] = check_backend('http://www.reboulstore.com/health', 'Reboul Store')
    
    if service in ['admin', 'all']:
        results['admin_frontend'] = check_frontend('http://admin.reboulstore.com', 'Admin Central')
        results['admin_backend'] = check_backend('http://admin.reboulstore.com/health', 'Admin Central')
    
    if service == 'all':
        # Vérifier la DB après les backends pour avoir accès à results
        results['database'] = check_database()
    
    console.print(table)
    
    # Résumé
    total = len(results)
    passed = sum(1 for v in results.values() if v)
    
    console.print(f"\n[bold]Résumé:[/bold] {passed}/{total} services OK")
    
    if passed == total:
        console.print("[green]✅ Tous les services sont en bonne santé[/green]")
    else:
        console.print(f"[red]❌ {total - passed} service(s) en panne[/red]")


@health_group.command('containers')
def containers():
    """Vérifie l'état des containers Docker"""
    console.print("[bold]🐳 État des containers...[/bold]\n")
    
    # Reboul Store
    console.print("[cyan]Reboul Store:[/cyan]")
    status_reboul = get_container_status()
    if status_reboul.get('containers'):
        for container in status_reboul['containers']:
            name = container.get('Name', 'N/A')
            status = container.get('Status', 'N/A')
            style = "green" if 'healthy' in status.lower() or 'up' in status.lower() else "yellow"
            console.print(f"  [{style}]{name}: {status}[/{style}]")
    
    # Admin Central
    console.print("\n[cyan]Admin Central:[/cyan]")
    stdout, _ = docker_compose_exec('ps --format "table {{.Name}}\\t{{.Status}}"', cwd=SERVER_CONFIG['admin_path'])
    if stdout:
        console.print(stdout)
