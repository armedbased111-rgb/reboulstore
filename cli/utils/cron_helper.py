"""
Utilitaires pour gérer les cron jobs sur le serveur
"""
import subprocess
from typing import List, Dict, Tuple, Optional
from utils.server_helper import SERVER_CONFIG, ssh_exec

def get_crontab() -> Tuple[str, bool]:
    """
    Récupère la crontab actuelle
    
    Returns:
        (crontab_content, success)
    """
    stdout, stderr = ssh_exec("crontab -l 2>/dev/null || echo ''")
    if stderr and 'no crontab' not in stderr.lower():
        return "", False
    return stdout.strip(), True

def set_crontab(content: str) -> Tuple[bool, str]:
    """
    Définit la nouvelle crontab
    
    Args:
        content: Contenu de la crontab (avec \n pour les retours à la ligne)
    
    Returns:
        (success, message)
    """
    # Utiliser une approche simple : passer le contenu via stdin avec heredoc
    # via SSH avec un pipe vers crontab
    
    import subprocess
    from utils.server_helper import SERVER_CONFIG
    
    # Utiliser ssh avec stdin pour passer le contenu
    ssh_cmd = [
        'ssh',
        '-o', 'ConnectTimeout=10',
        '-o', 'StrictHostKeyChecking=no',
        '-o', 'LogLevel=ERROR',
        f"{SERVER_CONFIG['user']}@{SERVER_CONFIG['host']}",
        'crontab -'
    ]
    
    try:
        result = subprocess.run(
            ssh_cmd,
            input=content,
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            return True, "Crontab mise à jour avec succès"
        else:
            return False, result.stderr or "Erreur inconnue"
    except subprocess.TimeoutExpired:
        return False, "Timeout lors de la mise à jour de la crontab"
    except Exception as e:
        return False, str(e)

def list_cron_jobs() -> List[Dict]:
    """
    Liste tous les cron jobs actifs (sans commentaires)
    
    Returns:
        Liste de dictionnaires avec {'line_num': int, 'line': str, 'schedule': str, 'command': str}
    """
    crontab, success = get_crontab()
    
    if not success or not crontab:
        return []
    
    lines = crontab.split('\n')
    cron_jobs = []
    
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        # Ignorer les commentaires et lignes vides
        if stripped and not stripped.startswith('#'):
            # Parser la ligne cron
            parts = stripped.split(None, 5)
            if len(parts) >= 6:
                schedule = ' '.join(parts[:5])
                command = parts[5]
                cron_jobs.append({
                    'line_num': i,
                    'line': stripped,
                    'schedule': schedule,
                    'command': command
                })
            else:
                # Ligne mal formatée mais on la garde
                cron_jobs.append({
                    'line_num': i,
                    'line': stripped,
                    'schedule': '',
                    'command': stripped
                })
    
    return cron_jobs

def add_cron_job(cron_line: str, description: Optional[str] = None) -> Tuple[bool, str]:
    """
    Ajoute un cron job
    
    Args:
        cron_line: Ligne cron complète (format: "0 2 * * * commande")
        description: Description optionnelle (sera ajoutée en commentaire)
    
    Returns:
        (success, message)
    """
    crontab, success = get_crontab()
    
    if not success:
        return False, "Impossible de récupérer la crontab"
    
    # Construire le nouveau contenu
    new_lines = []
    
    if crontab:
        new_lines.extend(crontab.split('\n'))
        new_lines.append('')  # Ligne vide
    
    if description:
        new_lines.append(f"# {description}")
    new_lines.append(cron_line)
    
    new_crontab = '\n'.join(new_lines) + '\n'
    
    return set_crontab(new_crontab)

def remove_cron_job(line_num: int) -> Tuple[bool, str]:
    """
    Supprime un cron job par numéro de ligne
    
    Args:
        line_num: Numéro de ligne (1-based, seulement les lignes de cron jobs actifs)
    
    Returns:
        (success, message)
    """
    cron_jobs = list_cron_jobs()
    
    if line_num < 1 or line_num > len(cron_jobs):
        return False, f"Numéro invalide. Il y a {len(cron_jobs)} cron job(s)"
    
    crontab, success = get_crontab()
    if not success:
        return False, "Impossible de récupérer la crontab"
    
    # Obtenir toutes les lignes
    all_lines = crontab.split('\n') if crontab else []
    
    # Filtrer : garder toutes les lignes sauf la ligne du cron job à supprimer
    new_lines = []
    cron_index = 0
    
    for line in all_lines:
        stripped = line.strip()
        if stripped and not stripped.startswith('#'):
            # C'est une ligne de cron job actif
            if cron_index != (line_num - 1):
                new_lines.append(line)
            cron_index += 1
        else:
            # Commentaire ou ligne vide, on garde
            new_lines.append(line)
    
    new_crontab = '\n'.join(new_lines)
    if new_crontab and not new_crontab.endswith('\n'):
        new_crontab += '\n'
    
    return set_crontab(new_crontab)

def enable_backup_automatic(project_dir: Optional[str] = None) -> Tuple[bool, str]:
    """
    Active le backup automatique de la base de données
    
    Args:
        project_dir: Répertoire du projet (optionnel, utilise SERVER_CONFIG par défaut)
    
    Returns:
        (success, message)
    """
    if project_dir is None:
        project_dir = SERVER_CONFIG['project_path']
    
    backup_script = f"{project_dir}/scripts/backup-db.sh"
    
    # Vérifier que le script existe
    stdout, _ = ssh_exec(f"test -f {backup_script} && echo 'exists' || echo 'missing'")
    if 'exists' not in stdout:
        return False, f"Le script {backup_script} n'existe pas"
    
    # Vérifier si le cron job existe déjà
    cron_jobs = list_cron_jobs()
    for job in cron_jobs:
        if 'backup-db.sh' in job['command'] or ('reboulstore' in job['command'].lower() and 'backup' in job['command'].lower()):
            return False, "Un cron job de backup existe déjà"
    
    # Créer le cron job (backup quotidien à 2h du matin)
    cron_cmd = f"0 2 * * * cd {project_dir} && {backup_script} >> {project_dir}/backups/backup.log 2>&1"
    
    success, msg = add_cron_job(cron_cmd, "Backup automatique DB Reboul Store (quotidien à 2h)")
    if success:
        return True, "Backup automatique activé"
    return False, msg

def disable_backup_automatic() -> Tuple[bool, str, int]:
    """
    Désactive le backup automatique
    
    Returns:
        (success, message, count_removed)
    """
    cron_jobs = list_cron_jobs()
    removed_count = 0
    
    # Trouver tous les cron jobs de backup
    jobs_to_remove = []
    for job in cron_jobs:
        if 'backup-db.sh' in job['command'] or ('reboulstore' in job['command'].lower() and 'backup' in job['command'].lower()):
            jobs_to_remove.append(job['line_num'])
    
    if not jobs_to_remove:
        return False, "Aucun cron job de backup trouvé", 0
    
    # Supprimer en commençant par le plus grand numéro (pour éviter les décalages)
    jobs_to_remove.sort(reverse=True)
    
    for line_num in jobs_to_remove:
        success, msg = remove_cron_job(line_num)
        if success:
            removed_count += 1
        else:
            return False, f"Erreur lors de la suppression: {msg}", removed_count
    
    return True, f"{removed_count} cron job(s) de backup supprimé(s)", removed_count

