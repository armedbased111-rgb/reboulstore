#!/bin/bash

# Script pour installer le service launchd qui démarre automatiquement le tunnel SSH
# Usage: ./scripts/install-tunnel-service.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLIST_FILE="$SCRIPT_DIR/com.reboulstore.db-tunnel.plist"
LAUNCHD_DIR="$HOME/Library/LaunchAgents"
LAUNCHD_FILE="$LAUNCHD_DIR/com.reboulstore.db-tunnel.plist"

echo "🔧 Installation du service de tunnel SSH automatique..."

# Vérifier que le fichier plist existe
if [ ! -f "$PLIST_FILE" ]; then
    echo "❌ Erreur: $PLIST_FILE introuvable"
    exit 1
fi

# Obtenir le chemin absolu de la clé SSH
SSH_KEY="$HOME/.ssh/id_ed25519"
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ Erreur: Clé SSH introuvable à $SSH_KEY"
    exit 1
fi

# Créer une version du plist avec le chemin absolu de la clé SSH
sed "s|~/.ssh/id_ed25519|$SSH_KEY|g" "$PLIST_FILE" > "$LAUNCHD_FILE"
echo "✅ Fichier plist créé avec le chemin absolu de la clé SSH: $SSH_KEY"

# Créer le répertoire LaunchAgents s'il n'existe pas
mkdir -p "$LAUNCHD_DIR"

# Désinstaller l'ancien service s'il existe
if [ -f "$LAUNCHD_FILE" ]; then
    launchctl unload "$LAUNCHD_FILE" 2>/dev/null
fi

# Charger le service
launchctl load "$LAUNCHD_FILE" 2>/dev/null || launchctl load -w "$LAUNCHD_FILE"
echo "✅ Service chargé"

# Démarrer le service
launchctl start com.reboulstore.db-tunnel
echo "✅ Service démarré"

# Vérifier le statut
sleep 2
if launchctl list | grep -q "com.reboulstore.db-tunnel"; then
    echo "✅ Service actif"
    echo ""
    echo "📋 Commandes utiles:"
    echo "  - Vérifier le statut: launchctl list | grep reboulstore"
    echo "  - Arrêter: launchctl stop com.reboulstore.db-tunnel"
    echo "  - Redémarrer: launchctl stop com.reboulstore.db-tunnel && launchctl start com.reboulstore.db-tunnel"
    echo "  - Désinstaller: launchctl unload $LAUNCHD_FILE && rm $LAUNCHD_FILE"
    echo ""
    echo "📝 Logs:"
    echo "  - Sortie: tail -f /tmp/com.reboulstore.db-tunnel.log"
    echo "  - Erreurs: tail -f /tmp/com.reboulstore.db-tunnel.error.log"
else
    echo "⚠️  Le service ne semble pas être actif. Vérifiez les logs."
fi
