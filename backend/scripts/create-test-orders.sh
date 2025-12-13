#!/bin/bash

# Script pour créer 3 commandes de test
# Usage: ./scripts/create-test-orders.sh

echo "🔧 Création de 3 commandes de test..."

# Vérifier si on est dans Docker ou en local
if docker ps | grep -q reboulstore-postgres; then
    echo "📦 Exécution dans Docker..."
    docker exec -i reboulstore-postgres psql -U reboulstore -d reboulstore_db < backend/scripts/create-test-orders.sql
else
    echo "💻 Exécution en local..."
    psql -U reboulstore -d reboulstore_db -f backend/scripts/create-test-orders.sql
fi

echo "✅ Script terminé!"

