#!/bin/bash

# Script pour assigner 3 commandes de test à un utilisateur
# Usage: ./scripts/assign-orders-to-user.sh [USER_ID]

echo "📋 Liste des utilisateurs disponibles:"
echo ""

# Lister les utilisateurs
docker exec -i reboulstore-postgres psql -U reboulstore -d reboulstore_db -c "SELECT id, email, \"firstName\", \"lastName\" FROM users ORDER BY \"createdAt\" DESC;" -t

echo ""
echo ""

# Si un USER_ID est fourni en argument, l'utiliser
if [ -n "$1" ]; then
    USER_ID=$1
    echo "🔧 Utilisation de l'ID fourni: $USER_ID"
else
    # Sinon, demander à l'utilisateur
    read -p "👉 Entrez l'ID de l'utilisateur: " USER_ID
fi

if [ -z "$USER_ID" ]; then
    echo "❌ Erreur: ID utilisateur requis"
    exit 1
fi

echo ""
echo "🔧 Création de 3 commandes pour l'utilisateur $USER_ID..."
echo ""

# Exécuter le script SQL avec l'ID utilisateur
# On doit d'abord définir la variable, puis exécuter le script
docker exec -i reboulstore-postgres psql -U reboulstore -d reboulstore_db <<EOF
\set user_id '$USER_ID'
$(cat backend/scripts/assign-orders-to-user.sql)
EOF

echo ""
echo "✅ Terminé!"

