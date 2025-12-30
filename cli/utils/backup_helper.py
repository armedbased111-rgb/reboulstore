"""
Utilitaires pour gérer les backups de base de données
"""
import subprocess
import os
import sys
from pathlib import Path
from typing import Optional, Tuple, Dict, List
from datetime import datetime
from rich.console import Console

console = Console()

# Configuration par défaut
DEFAULT_CONTAINER_NAME_LOCAL = "reboulstore-postgres"
DEFAULT_CONTAINER_NAME_PROD = "reboulstore-postgres-prod"
DEFAULT_BACKUP_DIR = "./backups"
DEFAULT_DB_NAME = "reboulstore_db"
DEFAULT_DB_USER = "reboulstore"


def get_container_name(local: bool = False) -> str:
    """Retourne le nom du container selon l'environnement"""
    return DEFAULT_CONTAINER_NAME_LOCAL if local else DEFAULT_CONTAINER_NAME_PROD


def check_container_exists(container_name: str, local: bool = False) -> Tuple[bool, str]:
    """
    Vérifie si le container existe et est en cours d'exécution
    
    Returns:
        (exists, message)
    """
    try:
        # Vérifier que le container existe
        result = subprocess.run(
            ['docker', 'ps', '-a', '--format', '{{.Names}}'],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if container_name not in result.stdout:
            return False, f"Le container {container_name} n'existe pas"
        
        # Vérifier qu'il est en cours d'exécution
        result = subprocess.run(
            ['docker', 'ps', '--format', '{{.Names}}'],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if container_name not in result.stdout:
            return False, f"Le container {container_name} n'est pas en cours d'exécution"
        
        return True, "OK"
    except subprocess.TimeoutExpired:
        return False, "Timeout lors de la vérification du container"
    except Exception as e:
        return False, f"Erreur lors de la vérification: {str(e)}"


def create_backup(
    backup_dir: str = DEFAULT_BACKUP_DIR,
    container_name: Optional[str] = None,
    db_name: str = DEFAULT_DB_NAME,
    db_user: str = DEFAULT_DB_USER,
    local: bool = False,
    keep_count: int = 30
) -> Tuple[bool, str, Optional[str]]:
    """
    Crée un backup de la base de données
    
    Returns:
        (success, message, backup_file_path)
    """
    if container_name is None:
        container_name = get_container_name(local)
    
    # Vérifier le container
    exists, msg = check_container_exists(container_name, local)
    if not exists:
        return False, msg, None
    
    # Créer le dossier de backup s'il n'existe pas
    backup_path = Path(backup_dir)
    backup_path.mkdir(parents=True, exist_ok=True)
    
    # Générer le nom du fichier avec timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = backup_path / f"reboulstore_db_{timestamp}.sql"
    
    try:
        # Créer le backup
        with open(backup_file, 'w') as f:
            result = subprocess.run(
                ['docker', 'exec', container_name, 'pg_dump', '-U', db_user, '-d', db_name],
                stdout=f,
                stderr=subprocess.PIPE,
                text=True,
                timeout=300  # 5 minutes max
            )
        
        if result.returncode != 0:
            backup_file.unlink(missing_ok=True)
            return False, f"Erreur lors du backup: {result.stderr}", None
        
        # Compresser le backup
        compressed_file = f"{backup_file}.gz"
        subprocess.run(['gzip', str(backup_file)], check=True, timeout=60)
        
        # Obtenir la taille
        size = Path(compressed_file).stat().st_size
        size_mb = size / (1024 * 1024)
        
        # Nettoyer les anciens backups
        cleanup_old_backups(backup_dir, keep_count)
        
        return True, f"Backup créé: {compressed_file} ({size_mb:.2f} MB)", compressed_file
        
    except subprocess.TimeoutExpired:
        backup_file.unlink(missing_ok=True)
        return False, "Timeout lors de la création du backup", None
    except subprocess.CalledProcessError as e:
        backup_file.unlink(missing_ok=True)
        return False, f"Erreur lors de la compression: {str(e)}", None
    except Exception as e:
        backup_file.unlink(missing_ok=True)
        return False, f"Erreur inattendue: {str(e)}", None


def list_backups(backup_dir: str = DEFAULT_BACKUP_DIR) -> List[Dict]:
    """
    Liste tous les backups disponibles
    
    Returns:
        Liste de dictionnaires avec les infos des backups
    """
    backup_path = Path(backup_dir)
    
    if not backup_path.exists():
        return []
    
    backups = []
    for backup_file in sorted(backup_path.glob("reboulstore_db_*.sql.gz"), reverse=True):
        stat = backup_file.stat()
        size_mb = stat.st_size / (1024 * 1024)
        
        # Extraire le timestamp du nom de fichier
        timestamp_str = backup_file.stem.replace('reboulstore_db_', '').replace('.sql', '')
        try:
            timestamp = datetime.strptime(timestamp_str, "%Y%m%d_%H%M%S")
        except ValueError:
            timestamp = None
        
        backups.append({
            'file': str(backup_file),
            'name': backup_file.name,
            'size_mb': size_mb,
            'timestamp': timestamp,
            'date_str': timestamp.strftime("%Y-%m-%d %H:%M:%S") if timestamp else "Unknown"
        })
    
    return backups


def restore_backup(
    backup_file: str,
    container_name: Optional[str] = None,
    db_name: str = DEFAULT_DB_NAME,
    db_user: str = DEFAULT_DB_USER,
    local: bool = False
) -> Tuple[bool, str]:
    """
    Restaure un backup
    
    Returns:
        (success, message)
    """
    if container_name is None:
        container_name = get_container_name(local)
    
    backup_path = Path(backup_file)
    if not backup_path.exists():
        return False, f"Le fichier de backup n'existe pas: {backup_file}"
    
    # Vérifier le container
    exists, msg = check_container_exists(container_name, local)
    if not exists:
        return False, msg
    
    try:
        # Décompresser si nécessaire
        temp_file = None
        if backup_path.suffix == '.gz':
            import tempfile
            temp_file = tempfile.NamedTemporaryFile(mode='w+', delete=False, suffix='.sql')
            subprocess.run(['gunzip', '-c', str(backup_path)], stdout=temp_file, check=True, timeout=300)
            temp_file.close()
            restore_file = temp_file.name
        else:
            restore_file = str(backup_path)
        
        # Restaurer
        with open(restore_file, 'r') as f:
            result = subprocess.run(
                ['docker', 'exec', '-i', container_name, 'psql', '-U', db_user, '-d', db_name],
                stdin=f,
                stderr=subprocess.PIPE,
                text=True,
                timeout=600  # 10 minutes max
            )
        
        # Nettoyer le fichier temporaire
        if temp_file:
            Path(restore_file).unlink(missing_ok=True)
        
        if result.returncode != 0:
            return False, f"Erreur lors de la restauration: {result.stderr}"
        
        return True, "Restauration terminée avec succès"
        
    except subprocess.TimeoutExpired:
        if temp_file:
            Path(temp_file.name).unlink(missing_ok=True)
        return False, "Timeout lors de la restauration"
    except subprocess.CalledProcessError as e:
        if temp_file:
            Path(temp_file.name).unlink(missing_ok=True)
        return False, f"Erreur lors de la restauration: {str(e)}"
    except Exception as e:
        if temp_file:
            Path(temp_file.name).unlink(missing_ok=True)
        return False, f"Erreur inattendue: {str(e)}"


def delete_backup(backup_file: str) -> Tuple[bool, str]:
    """
    Supprime un backup
    
    Returns:
        (success, message)
    """
    backup_path = Path(backup_file)
    
    if not backup_path.exists():
        return False, f"Le fichier de backup n'existe pas: {backup_file}"
    
    try:
        backup_path.unlink()
        return True, f"Backup supprimé: {backup_file}"
    except Exception as e:
        return False, f"Erreur lors de la suppression: {str(e)}"


def cleanup_old_backups(backup_dir: str = DEFAULT_BACKUP_DIR, keep_count: int = 30):
    """Supprime les anciens backups en gardant seulement les N plus récents"""
    backup_path = Path(backup_dir)
    
    if not backup_path.exists():
        return
    
    backups = sorted(backup_path.glob("reboulstore_db_*.sql.gz"), key=lambda p: p.stat().st_mtime, reverse=True)
    
    # Garder seulement les N plus récents
    for old_backup in backups[keep_count:]:
        try:
            old_backup.unlink()
        except Exception as e:
            console.print(f"[yellow]⚠️  Erreur lors de la suppression de {old_backup}: {str(e)}[/yellow]")

