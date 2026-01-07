#!/bin/bash

# Script pour désinstaller le service launchd du tunnel SSH
# Usage: ./scripts/uninstall-tunnel-service.sh

LAUNCHD_FILE="$HOME/Library/LaunchAgents/com.reboulstore.db-tunnel.plist"

echo "🔧 Désinstallation du service de tunnel SSH..."

if [ -f "$LAUNCHD_FILE" ]; then
    # Arrêter et décharger le service
    launchctl stop com.reboulstore.db-tunnel 2>/dev/null
    launchctl unload "$LAUNCHD_FILE" 2>/dev/null
    
    # Supprimer le fichier
    rm "$LAUNCHD_FILE"
    echo "✅ Service désinstallé"
else
    echo "⚠️  Service non trouvé: $LAUNCHD_FILE"
fi

