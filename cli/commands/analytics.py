"""
Commandes pour vérifier GA4 / Analytics
"""
import click
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from datetime import datetime, timedelta
import re

console = Console()


@click.group()
def analytics():
    """Commandes pour vérifier GA4 / Analytics"""
    pass


@analytics.command()
@click.option('--minutes', default=5, help='Nombre de minutes à analyser (défaut: 5)')
def check(minutes):
    """Vérifier que GA4 envoie bien des requêtes (via logs nginx)"""
    from utils.server_helper import ssh_exec
    
    console.print(f"[blue]🔍 Analyse des logs nginx pour les requêtes GA4 (dernières {minutes} minutes)...[/blue]\n")
    
    # Compter les requêtes vers google-analytics dans les logs nginx
    since_time = (datetime.now() - timedelta(minutes=minutes)).strftime("%d/%b/%Y:%H:%M")
    
    # Chercher les requêtes vers google-analytics.com dans les logs
    command = f"""
    docker logs reboulstore-nginx-prod 2>&1 | grep -i "google-analytics\|gtag\|googletagmanager" | \
    grep -v "grep" | tail -50 | wc -l
    """
    
    stdout, stderr = ssh_exec(command)
    
    if stderr and "error" in stderr.lower():
        console.print(f"[red]❌ Erreur lors de la récupération des logs[/red]")
        console.print(f"[yellow]Note: Les requêtes GA4 sont envoyées depuis le navigateur, pas depuis le serveur.[/yellow]")
        console.print(f"[yellow]Cette méthode vérifie seulement si le site fonctionne.[/yellow]")
        return
    
    count = int(stdout.strip()) if stdout.strip().isdigit() else 0
    
    if count > 0:
        console.print(f"[green]✅ {count} requêtes GA4 détectées dans les logs récents[/green]")
    else:
        console.print(f"[yellow]⚠️  Aucune requête GA4 détectée dans les logs nginx[/yellow]")
        console.print(f"[yellow]Note: Les requêtes GA4 sont envoyées depuis le navigateur, pas le serveur.[/yellow]")
        console.print(f"[yellow]Cette méthode ne détecte que les requêtes interceptées par nginx.[/yellow]\n")
    
    console.print("\n[bold]💡 Pour vérifier GA4 réellement :[/bold]")
    console.print("1. Visiter https://analytics.google.com > Reports > Realtime")
    console.print("2. Ou utiliser: python cli/main.py analytics verify --url https://www.reboulstore.com")


@analytics.command()
@click.option('--url', default='https://www.reboulstore.com', help='URL à vérifier')
def verify(url):
    """Vérifier que le code GA4 est présent dans la page"""
    try:
        import requests
    except ImportError:
        console.print("[red]❌ La bibliothèque 'requests' n'est pas installée[/red]")
        console.print("[yellow]Installe avec: pip install requests[/yellow]")
        return
    
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        BeautifulSoup = None  # Optionnel, on peut vérifier sans
    
    console.print(f"[blue]🔍 Vérification de GA4 sur {url}...[/blue]\n")
    
    try:
        response = requests.get(url, timeout=10, verify=True)
        response.raise_for_status()
        
        html = response.text
        
        # Chercher le Measurement ID (peut être dans HTML ou dans les scripts chargés)
        measurement_id = "G-S8LMN95862"
        has_ga4_html = measurement_id in html or "gtag" in html.lower() or "google-analytics" in html.lower() or "googletagmanager" in html.lower()
        
        # Note: Avec Vite, le code GA4 est souvent dans les assets JS compilés, pas dans le HTML
        # On vérifie donc aussi les balises script qui chargent les assets
        
        if has_ga4_html:
            console.print(f"[green]✅ Code GA4 détecté dans la page[/green]")
            
            # Chercher le script gtag.js
            if "gtag" in html.lower() or "googletagmanager" in html.lower():
                console.print(f"[green]  ✓ Script GA4 présent[/green]")
            
            if measurement_id in html:
                console.print(f"[green]  ✓ Measurement ID {measurement_id} trouvé dans le HTML[/green]")
        else:
            # Vérifier si c'est un site React/Vite (code dans les assets JS)
            if "/assets/" in html or "react" in html.lower() or "vite" in html.lower():
                console.print(f"[yellow]⚠️  Code GA4 non détecté dans le HTML source[/yellow]")
                console.print(f"[yellow]Note: Avec Vite/React, le code GA4 est dans les assets JS compilés[/yellow]")
                console.print(f"[yellow]Pour vérifier: Ouvrir DevTools > Network > Filtrer 'gtag' ou 'google-analytics'[/yellow]")
                console.print(f"[yellow]Ou: Visiter https://analytics.google.com > Reports > Realtime[/yellow]")
            else:
                console.print(f"[red]❌ Code GA4 non détecté dans la page[/red]")
                console.print(f"[yellow]Vérifie que VITE_GA_MEASUREMENT_ID est bien défini et le frontend rebuild[/yellow]")
        
        # Vérifier aussi dans les scripts (si BeautifulSoup disponible)
        if BeautifulSoup:
            soup = BeautifulSoup(html, 'html.parser')
            scripts = soup.find_all('script')
            ga_scripts = [s for s in scripts if 'gtag' in str(s).lower() or 'google-analytics' in str(s).lower()]
            
            if ga_scripts:
                console.print(f"[green]  ✓ {len(ga_scripts)} script(s) GA4 trouvé(s)[/green]")
        
    except requests.exceptions.RequestException as e:
        console.print(f"[red]❌ Erreur lors de la vérification: {e}[/red]")
        console.print(f"[yellow]Assure-toi que l'URL est accessible[/yellow]")


@analytics.command()
def status():
    """Afficher le statut de la configuration GA4"""
    from utils.server_helper import ssh_exec
    
    console.print("[blue]📊 Statut de la configuration GA4[/blue]\n")
    
    # Vérifier les variables d'environnement
    console.print("[bold]Variables d'environnement :[/bold]")
    
    # Frontend Reboul Store
    command = "cat /opt/reboulstore/frontend/.env.production 2>/dev/null | grep 'VITE_GA_MEASUREMENT_ID'"
    stdout, stderr = ssh_exec(command)
    if stdout and "G-S8LMN95862" in stdout:
        console.print(f"[green]  ✅ Reboul Store: {stdout.strip()}[/green]")
    elif stdout:
        console.print(f"[yellow]  ⚠️  Reboul Store: {stdout.strip()}[/yellow]")
    else:
        console.print(f"[red]  ❌ Reboul Store: Variable non trouvée (fichier .env.production absent ou variable non définie)[/red]")
    
    # Frontend Admin Central
    command = "cat /opt/reboulstore/admin-central/frontend/.env.production 2>/dev/null | grep 'VITE_GA_MEASUREMENT_ID'"
    stdout, stderr = ssh_exec(command)
    if stdout and "G-S8LMN95862" in stdout:
        console.print(f"[green]  ✅ Admin Central: {stdout.strip()}[/green]")
    elif stdout:
        console.print(f"[yellow]  ⚠️  Admin Central: {stdout.strip()}[/yellow]")
    else:
        console.print(f"[yellow]  ⚠️  Admin Central: Variable non trouvée (optionnel)[/yellow]")
    
    console.print("\n[bold]💡 Pour vérifier que GA4 fonctionne :[/bold]")
    console.print("  → Visiter https://analytics.google.com > Reports > Realtime")
    console.print("  → Ou: python cli/main.py analytics verify")


@analytics.command()
@click.option('--test', is_flag=True, help='Test la connexion API')
@click.option('--detailed', is_flag=True, help='Afficher plus de détails')
@click.option('--json', is_flag=True, help='Exporter en JSON')
@click.option('--watch', is_flag=True, help='Monitoring continu (refresh toutes les 30 secondes)')
def realtime(test, detailed, json, watch):
    """Afficher les données GA4 Realtime (nécessite API credentials)"""
    import os
    from pathlib import Path
    
    # Vérifier la configuration
    property_id = os.getenv('GA4_PROPERTY_ID')
    credentials_path = os.getenv('GA4_CREDENTIALS_PATH')
    
    # Chercher aussi dans un fichier .env.ga4
    env_ga4_path = Path(__file__).parent.parent / '.env.ga4'
    if env_ga4_path.exists():
        from dotenv import load_dotenv
        load_dotenv(env_ga4_path)
        property_id = property_id or os.getenv('GA4_PROPERTY_ID')
        credentials_path = credentials_path or os.getenv('GA4_CREDENTIALS_PATH')
    
    # Si pas de credentials, afficher les instructions
    if not property_id or not credentials_path:
        console.print("[yellow]⚠️  Configuration API GA4 requise[/yellow]\n")
        console.print("[bold]Pour configurer l'API GA4 :[/bold]")
        console.print("  1. Suivre le guide: docs/GA4_API_SETUP.md")
        console.print("  2. Créer un Service Account dans Google Cloud Console")
        console.print("  3. Activer l'API Google Analytics Data API")
        console.print("  4. Configurer les variables d'environnement :")
        console.print("     export GA4_PROPERTY_ID=123456789")
        console.print("     export GA4_CREDENTIALS_PATH=credentials/ga4-service-account.json")
        console.print("\n[bold]Ou utiliser l'interface web :[/bold]")
        console.print("  → https://analytics.google.com > Reports > Realtime\n")
        return
    
    # Vérifier que le fichier credentials existe
    if not Path(credentials_path).exists():
        # Essayer un chemin relatif depuis le dossier cli
        cli_dir = Path(__file__).parent.parent
        credentials_path_abs = cli_dir / credentials_path
        if credentials_path_abs.exists():
            credentials_path = str(credentials_path_abs)
        else:
            console.print(f"[red]❌ Fichier credentials non trouvé: {credentials_path}[/red]")
            console.print(f"[yellow]Vérifie que GA4_CREDENTIALS_PATH pointe vers le bon fichier JSON[/yellow]")
            return
    
    # Importer la bibliothèque google-analytics-data
    try:
        from google.analytics.data_v1beta import BetaAnalyticsDataClient
        from google.analytics.data_v1beta.types import RunRealtimeReportRequest, Dimension, Metric
        from google.oauth2 import service_account
    except ImportError:
        console.print("[red]❌ Bibliothèque google-analytics-data non installée[/red]")
        console.print("[yellow]Installe avec: pip install google-analytics-data[/yellow]")
        return
    
    # Charger les credentials
    try:
        credentials = service_account.Credentials.from_service_account_file(
            credentials_path,
            scopes=['https://www.googleapis.com/auth/analytics.readonly']
        )
        client = BetaAnalyticsDataClient(credentials=credentials)
    except Exception as e:
        console.print(f"[red]❌ Erreur lors du chargement des credentials: {e}[/red]")
        console.print("[yellow]Vérifie que le fichier JSON est valide[/yellow]")
        return
    
    # Test de connexion
    if test:
        console.print("[blue]🔍 Test de connexion à l'API GA4...[/blue]\n")
        try:
            request = RunRealtimeReportRequest(
                property=f"properties/{property_id}",
                metrics=[Metric(name="activeUsers")],
            )
            response = client.run_realtime_report(request)
            console.print("[green]✅ Connexion réussie ![/green]")
            console.print(f"  Property ID: {property_id}")
            console.print(f"  Utilisateurs actifs: {response.rows[0].metric_values[0].value if response.rows else 0}")
        except Exception as e:
            console.print(f"[red]❌ Erreur de connexion: {e}[/red]")
        return
    
    # Fonction pour récupérer les données realtime
    def get_realtime_data():
        try:
            request = RunRealtimeReportRequest(
                property=f"properties/{property_id}",
                metrics=[
                    Metric(name="activeUsers"),
                    Metric(name="screenPageViews"),
                    Metric(name="eventCount"),
                ],
                dimensions=[Dimension(name="country")] if detailed else None,
            )
            response = client.run_realtime_report(request)
            return response
        except Exception as e:
            console.print(f"[red]❌ Erreur API: {e}[/red]")
            return None
    
    # Monitoring continu
    if watch:
        import time
        console.print("[blue]📊 Monitoring GA4 Realtime (Ctrl+C pour arrêter)...[/blue]\n")
        try:
            while True:
                response = get_realtime_data()
                if response:
                    display_realtime_data(response, detailed, json)
                time.sleep(30)
                console.print()  # Ligne vide pour séparer
        except KeyboardInterrupt:
            console.print("\n[yellow]Monitoring arrêté[/yellow]")
        return
    
    # Affichage unique
    console.print("[blue]📊 Données GA4 Realtime[/blue]\n")
    response = get_realtime_data()
    if response:
        display_realtime_data(response, detailed, json)


def display_realtime_data(response, detailed, json_format):
    """Affiche les données realtime GA4"""
    if json_format:
        import json
        data = {
            "activeUsers": 0,
            "screenPageViews": 0,
            "eventCount": 0,
        }
        if response.rows:
            for i, metric in enumerate(response.metric_headers):
                data[metric.name] = response.rows[0].metric_values[i].value
        
        console.print(json.dumps(data, indent=2))
        return
    
    # Affichage formaté
    table = Table(title="GA4 Realtime")
    table.add_column("Métrique", style="cyan")
    table.add_column("Valeur", style="green")
    
    if response.rows:
        for i, metric in enumerate(response.metric_headers):
            value = response.rows[0].metric_values[i].value
            metric_name = metric.name.replace("activeUsers", "Utilisateurs actifs")
            metric_name = metric_name.replace("screenPageViews", "Vues de pages")
            metric_name = metric_name.replace("eventCount", "Événements")
            table.add_row(metric_name, value)
    else:
        table.add_row("Utilisateurs actifs", "0")
        table.add_row("Vues de pages", "0")
        table.add_row("Événements", "0")
    
    console.print(table)
    
    if detailed and response.rows and len(response.rows) > 1:
        console.print("\n[bold]Détails par pays :[/bold]")
        detail_table = Table()
        for header in response.dimension_headers:
            detail_table.add_column(header.name, style="cyan")
        for header in response.metric_headers:
            detail_table.add_column(header.name, style="green")
        
        for row in response.rows[:10]:  # Limiter à 10 résultats
            row_data = [dim.value for dim in row.dimension_values]
            row_data.extend([mv.value for mv in row.metric_values])
            detail_table.add_row(*row_data)
        
        console.print(detail_table)
