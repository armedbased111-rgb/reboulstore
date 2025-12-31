"""
Commandes pour seed la base de données
"""
import json
import subprocess
import sys
from pathlib import Path
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

console = Console()

def seed_brands(local: bool = False, container_name: str = None):
    """
    Importer les brands depuis brands-data-with-urls.json
    
    Args:
        local: Si True, utilise le container local (reboulstore-postgres)
        container_name: Nom du container PostgreSQL (override)
    """
    # Déterminer le container
    if container_name is None:
        container_name = "reboulstore-postgres" if local else "reboulstore-postgres-prod"
    
    # Chemin vers le fichier JSON
    project_root = Path(__file__).parent.parent.parent.parent
    json_file = project_root / "backend" / "scripts" / "brands-data-with-urls.json"
    
    if not json_file.exists():
        console.print(f"[red]❌ Fichier JSON non trouvé: {json_file}[/red]")
        console.print(f"[yellow]💡 Exécutez d'abord: backend/scripts/upload-brands-logos.ts[/yellow]")
        sys.exit(1)
    
    # Lire le JSON
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        console.print(f"[red]❌ Erreur lors de la lecture du JSON: {e}[/red]")
        sys.exit(1)
    
    brands = data.get('brands', [])
    if not brands:
        console.print("[red]❌ Aucune brand trouvée dans le JSON[/red]")
        sys.exit(1)
    
    console.print(f"[cyan]📦 Import de {len(brands)} brands...[/cyan]")
    
    # Générer le SQL
    sql_lines = [
        "-- Import des brands",
        "BEGIN;",
        "DELETE FROM brands;",
        ""
    ]
    
    for brand in brands:
        name = brand.get('name', '').replace("'", "''")
        slug = brand.get('slug', '').replace("'", "''")
        description = brand.get('description')
        logo_url = brand.get('logoUrl')
        
        # Gérer les valeurs NULL
        description_sql = f"'{description.replace(\"'\", \"''\")}'" if description else 'NULL'
        logo_url_sql = f"'{logo_url.replace(\"'\", \"''\")}'" if logo_url else 'NULL'
        
        sql_lines.append(
            f"INSERT INTO brands (name, slug, description, \"logoUrl\", \"createdAt\", \"updatedAt\") "
            f"VALUES ('{name}', '{slug}', {description_sql}, {logo_url_sql}, NOW(), NOW());"
        )
    
    sql_lines.append("COMMIT;")
    sql_content = "\n".join(sql_lines)
    
    # Exécuter le SQL
    try:
        console.print(f"[cyan]🔄 Exécution du SQL sur le container {container_name}...[/cyan]")
        
        result = subprocess.run(
            ['docker', 'exec', '-i', container_name, 'psql', '-U', 'reboulstore', '-d', 'reboulstore_db'],
            input=sql_content.encode('utf-8'),
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            # Compter les brands avec logos
            brands_with_logos = sum(1 for b in brands if b.get('logoUrl'))
            brands_without_logos = len(brands) - brands_with_logos
            
            console.print(f"[green]✅ Import réussi ![/green]")
            console.print(f"  📊 {len(brands)} brands importées")
            console.print(f"  🖼️  {brands_with_logos} brands avec logos Cloudinary")
            if brands_without_logos > 0:
                console.print(f"  ⚠️  {brands_without_logos} brands sans logos")
        else:
            console.print(f"[red]❌ Erreur lors de l'exécution SQL:[/red]")
            console.print(result.stderr)
            sys.exit(1)
            
    except subprocess.TimeoutExpired:
        console.print("[red]❌ Timeout lors de l'exécution SQL[/red]")
        sys.exit(1)
    except FileNotFoundError:
        console.print("[red]❌ Docker n'est pas installé ou n'est pas dans le PATH[/red]")
        sys.exit(1)
    except Exception as e:
        console.print(f"[red]❌ Erreur: {e}[/red]")
        sys.exit(1)

