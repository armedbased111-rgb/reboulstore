#!/bin/bash

# Script pour mettre un produit en rupture de stock
# Usage: ./scripts/set-product-out-of-stock.sh <product_id>

PRODUCT_ID=$1

if [ -z "$PRODUCT_ID" ]; then
  echo "Usage: $0 <product_id>"
  echo "Example: $0 15e76c7e-1ca3-4757-904b-2bb562106cfb"
  exit 1
fi

# Vérifier si le conteneur existe
CONTAINER_NAME="reboulstore-postgres"

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Erreur: Le conteneur PostgreSQL ${CONTAINER_NAME} n'est pas en cours d'exécution."
  exit 1
fi

# Exécuter le script SQL
docker exec -i ${CONTAINER_NAME} psql -U postgres -d reboulstore_db <<EOF
\set product_id '${PRODUCT_ID}'
\i /tmp/set-product-out-of-stock.sql
EOF

echo "✅ Produit ${PRODUCT_ID} mis en rupture de stock (tous les variants à stock = 0)"

