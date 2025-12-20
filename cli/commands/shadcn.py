"""
Commandes pour gérer shadcn/ui
"""

from pathlib import Path
from typing import List
from utils.shadcn_helper import (
    get_installed_components,
    install_shadcn_component,
    list_available_components,
    get_shadcn_config,
    is_component_installed,
    ensure_shadcn_components,
)

class ShadcnManager:
    """Gérer les composants shadcn/ui"""
    
    @staticmethod
    def list_installed():
        """Lister les composants shadcn/ui installés"""
        return get_installed_components()
    
    @staticmethod
    def install(component_name: str, force: bool = False):
        """Installer un composant shadcn/ui"""
        return install_shadcn_component(component_name, force=force)
    
    @staticmethod
    def list_available():
        """Lister les composants shadcn/ui disponibles"""
        return list_available_components()
    
    @staticmethod
    def get_config():
        """Récupérer la configuration shadcn/ui"""
        return get_shadcn_config()
    
    @staticmethod
    def is_installed(component_name: str):
        """Vérifier si un composant est installé"""
        return is_component_installed(component_name)
    
    @staticmethod
    def ensure_installed(component_names: List[str], auto_install: bool = True):
        """S'assurer que les composants sont installés"""
        return ensure_shadcn_components(component_names, auto_install=auto_install)

# Export pour main.py
manage_shadcn = ShadcnManager()

