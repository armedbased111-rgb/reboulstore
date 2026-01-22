#!/bin/bash
# Script de nettoyage Cursor IDE

echo "🧹 Nettoyage Cursor IDE..."

# Fermer Cursor (optionnel, demander confirmation)
read -p "Fermer Cursor maintenant ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    killall Cursor 2>/dev/null
    sleep 2
fi

# Nettoyer les logs process-monitor (> 7 jours)
echo "📋 Nettoyage des logs process-monitor..."
find ~/Library/Application\ Support/Cursor/process-monitor -name "*.log" -mtime +7 -delete 2>/dev/null
echo "✅ Logs nettoyés"

# Afficher l'espace utilisé
echo ""
echo "📊 Espace utilisé :"
du -sh ~/Library/Application\ Support/Cursor 2>/dev/null
du -sh ~/.cursor 2>/dev/null

echo ""
echo "✅ Nettoyage terminé !"
echo "💡 Redémarrer Cursor pour appliquer les changements"
