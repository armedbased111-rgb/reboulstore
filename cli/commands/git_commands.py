"""
Commandes Git pour le CLI
"""
import subprocess
import re
from pathlib import Path
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

console = Console()


def get_git_status():
    """Récupère le statut Git"""
    try:
        result = subprocess.run(
            ['git', 'status', '--porcelain'],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip().split('\n') if result.stdout.strip() else []
    except subprocess.CalledProcessError:
        return None


def get_current_branch():
    """Récupère la branche actuelle"""
    try:
        result = subprocess.run(
            ['git', 'branch', '--show-current'],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        return None


def get_git_log(count=10):
    """Récupère les derniers commits"""
    try:
        result = subprocess.run(
            ['git', 'log', f'--oneline', '-n', str(count)],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip().split('\n') if result.stdout.strip() else []
    except subprocess.CalledProcessError:
        return []


def status():
    """Affiche le statut Git"""
    branch = get_current_branch()
    if not branch:
        console.print("[red]❌ Erreur : Pas un dépôt Git[/red]")
        return
    
    console.print(f"\n[bold]🌿 Branche actuelle :[/bold] [green]{branch}[/green]\n")
    
    # Statut des fichiers
    files = get_git_status()
    if files is None:
        console.print("[red]❌ Erreur lors de la récupération du statut[/red]")
        return
    
    if not files:
        console.print("[green]✅ Working directory propre[/green]\n")
    else:
        table = Table(show_header=True, header_style="bold magenta")
        table.add_column("Statut", style="cyan")
        table.add_column("Fichier", style="white")
        
        for file in files:
            if file:
                status = file[:2]
                filename = file[3:]
                table.add_row(status, filename)
        
        console.print(table)
        console.print(f"\n[yellow]⚠️  {len(files)} fichier(s) modifié(s)[/yellow]\n")
    
    # Derniers commits
    commits = get_git_log(5)
    if commits:
        console.print("[bold]📝 Derniers commits :[/bold]\n")
        for commit in commits[:5]:
            console.print(f"  {commit}")
        console.print()


def create_branch(branch_name: str):
    """Crée une nouvelle branche"""
    if not branch_name:
        console.print("[red]❌ Nom de branche requis[/red]")
        return
    
    # Valider le nom de branche
    if not re.match(r'^(feature|fix|hotfix|test)/[a-z0-9-]+$', branch_name):
        console.print("[yellow]⚠️  Format recommandé : feature/nom-branche, fix/nom-branche, etc.[/yellow]")
        response = input("Continuer quand même ? (y/N): ")
        if response.lower() != 'y':
            return
    
    try:
        # Vérifier que le working directory est propre
        files = get_git_status()
        if files:
            console.print("[yellow]⚠️  Working directory non propre. Voulez-vous continuer ?[/yellow]")
            response = input("(y/N): ")
            if response.lower() != 'y':
                return
        
        # Créer la branche
        subprocess.run(['git', 'checkout', '-b', branch_name], check=True)
        console.print(f"[green]✅ Branche '{branch_name}' créée et basculée[/green]")
        
        # Pousser la branche ?
        response = input("Pousser la branche sur origin ? (y/N): ")
        if response.lower() == 'y':
            subprocess.run(['git', 'push', '-u', 'origin', branch_name], check=True)
            console.print(f"[green]✅ Branche '{branch_name}' poussée sur origin[/green]")
    
    except subprocess.CalledProcessError as e:
        console.print(f"[red]❌ Erreur : {e}[/red]")


def commit(message: str, scope: str = None):
    """Crée un commit avec convention"""
    if not message:
        console.print("[red]❌ Message de commit requis[/red]")
        return
    
    # Vérifier qu'il y a des changements
    files = get_git_status()
    if not files:
        console.print("[yellow]⚠️  Aucun fichier modifié à commiter[/yellow]")
        return
    
    # Construire le message de commit
    types = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci', 'build', 'revert']
    
    console.print("[bold]Types de commit disponibles :[/bold]")
    for i, t in enumerate(types, 1):
        console.print(f"  {i}. {t}")
    
    type_input = input("\nType de commit (feat/fix/docs/etc.) [feat]: ").strip() or 'feat'
    
    if scope:
        scope_part = f"({scope})"
    else:
        scope_input = input("Scope (frontend/backend/docs/etc.) [optionnel]: ").strip()
        scope_part = f"({scope_input})" if scope_input else ""
    
    full_message = f"{type_input}{scope_part}: {message}"
    
    # Confirmer
    console.print(f"\n[bold]Message de commit :[/bold] [cyan]{full_message}[/cyan]")
    confirm = input("\nConfirmer ? (Y/n): ").strip().lower()
    
    if confirm and confirm != 'y':
        console.print("[yellow]Commit annulé[/yellow]")
        return
    
    try:
        # Ajouter tous les fichiers modifiés
        subprocess.run(['git', 'add', '.'], check=True)
        
        # Créer le commit
        subprocess.run(['git', 'commit', '-m', full_message], check=True)
        console.print(f"[green]✅ Commit créé : {full_message}[/green]")
        
        # Pousser ?
        response = input("\nPousser le commit ? (y/N): ")
        if response.lower() == 'y':
            branch = get_current_branch()
            subprocess.run(['git', 'push', 'origin', branch], check=True)
            console.print(f"[green]✅ Commit poussé sur {branch}[/green]")
    
    except subprocess.CalledProcessError as e:
        console.print(f"[red]❌ Erreur : {e}[/red]")


def deploy(environment: str = 'production'):
    """Déploie sur l'environnement spécifié"""
    branch = get_current_branch()
    
    if branch != 'main' and environment == 'production':
        console.print("[red]❌ Déploiement production uniquement depuis main[/red]")
        return
    
    console.print(f"[bold]🚀 Déploiement sur {environment}[/bold]\n")
    console.print(f"Branche actuelle : {branch}\n")
    
    # Vérifier que tout est commité
    files = get_git_status()
    if files:
        console.print("[yellow]⚠️  Working directory non propre. Commits en attente.[/yellow]")
        response = input("Continuer quand même ? (y/N): ")
        if response.lower() != 'y':
            return
    
    # Pousser les commits
    try:
        console.print("[cyan]📤 Poussage des commits...[/cyan]")
        subprocess.run(['git', 'push', 'origin', branch], check=True)
        console.print("[green]✅ Commits poussés[/green]\n")
        
        if environment == 'production' and branch == 'main':
            console.print("[bold]🚀 Déploiement automatique via GitHub Actions...[/bold]")
            console.print("[yellow]Vérifiez l'état du déploiement sur GitHub Actions[/yellow]")
        else:
            console.print(f"[yellow]⚠️  Déploiement manuel requis pour {environment}[/yellow]")
    
    except subprocess.CalledProcessError as e:
        console.print(f"[red]❌ Erreur : {e}[/red]")

