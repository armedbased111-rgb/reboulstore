"""
Utilitaires pour gérer le serveur VPS via SSH
"""
import subprocess
import os
from typing import Dict, Optional, Tuple
import json

# Configuration serveur
SERVER_CONFIG = {
    'host': os.getenv('VPS_HOST', '152.228.218.35'),
    'user': os.getenv('VPS_USER', 'deploy'),
    'project_path': os.getenv('VPS_PROJECT_PATH', '/var/www/reboulstore'),
    'admin_path': os.getenv('VPS_ADMIN_PATH', '/var/www/reboulstore/admin-central'),
}

def ssh_exec(command: str, cwd: Optional[str] = None, return_code: bool = False) -> Tuple[str, str, Optional[int]]:
    """
    Exécute une commande sur le serveur via SSH (utilise la commande ssh du système)
    
    Args:
        command: Commande à exécuter
        cwd: Répertoire de travail
        return_code: Si True, retourne aussi le code de retour
        
    Returns:
        (stdout, stderr, exit_code) si return_code=True
        (stdout, stderr) sinon
    """
    try:
        if cwd:
            command = f"cd {cwd} && {command}"
        
        # Construire la commande SSH
        ssh_cmd = [
            'ssh',
            '-o', 'ConnectTimeout=10',
            '-o', 'StrictHostKeyChecking=no',
            '-o', 'UserKnownHostsFile=/dev/null',
            '-o', 'LogLevel=ERROR',
            f"{SERVER_CONFIG['user']}@{SERVER_CONFIG['host']}",
            command
        ]
        
        # Exécuter via subprocess (utilise la config SSH standard de l'utilisateur)
        result = subprocess.run(
            ssh_cmd,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if return_code:
            return result.stdout, result.stderr, result.returncode
        return result.stdout, result.stderr
        
    except subprocess.TimeoutExpired:
        error_msg = "Timeout lors de l'exécution de la commande SSH"
        if return_code:
            return "", error_msg, 1
        return "", error_msg
    except Exception as e:
        error_msg = str(e)
        if return_code:
            return "", error_msg, 1
        return "", error_msg


def docker_compose_exec(command: str, compose_file: str = 'docker-compose.prod.yml', 
                       service: Optional[str] = None, cwd: Optional[str] = None) -> Tuple[str, str]:
    """
    Exécute une commande docker compose sur le serveur
    
    Args:
        command: Commande docker compose
        compose_file: Fichier compose à utiliser
        service: Service spécifique (optionnel)
        cwd: Répertoire de travail
        
    Returns:
        (stdout, stderr)
    """
    project_dir = cwd or SERVER_CONFIG['project_path']
    
    full_command = f"docker compose -f {compose_file} --env-file .env.production {command}"
    if service:
        full_command += f" {service}"
    
    return ssh_exec(full_command, cwd=project_dir)


def get_container_status(service: Optional[str] = None) -> Dict:
    """
    Récupère l'état des containers Docker
    
    Args:
        service: Service spécifique (optionnel)
        
    Returns:
        Dict avec statut des containers
    """
    if service:
        cmd = f"docker compose ps {service} --format json"
    else:
        cmd = "docker compose ps --format json"
    
    stdout, stderr = docker_compose_exec(cmd.split()[2], service=service if not service else None)
    
    if not stdout.strip():
        return {}
    
    containers = []
    for line in stdout.strip().split('\n'):
        if line.strip():
            try:
                containers.append(json.loads(line))
            except:
                pass
    
    return {'containers': containers, 'raw': stdout}


def check_url(url: str, timeout: int = 5) -> Tuple[bool, int, str]:
    """
    Vérifie qu'une URL est accessible
    
    Args:
        url: URL à vérifier
        timeout: Timeout en secondes
        
    Returns:
        (success, status_code, response)
    """
    import urllib.request
    import urllib.error
    
    try:
        req = urllib.request.Request(url)
        req.add_header('User-Agent', 'Reboul-Store-CLI/1.0')
        response = urllib.request.urlopen(req, timeout=timeout)
        status_code = response.getcode()
        return True, status_code, response.read().decode('utf-8', errors='ignore')[:200]
    except urllib.error.HTTPError as e:
        return False, e.code, str(e)
    except Exception as e:
        return False, 0, str(e)


def format_size(size_bytes: int) -> str:
    """Formate une taille en bytes en format lisible"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} PB"
