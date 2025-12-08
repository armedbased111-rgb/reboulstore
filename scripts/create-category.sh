#!/bin/bash

# Script pour créer une catégorie via l'API backend
# Usage: ./scripts/create-category.sh "Nom de la catégorie" [description]

# Configuration
API_URL="http://localhost:3001"
ENDPOINT="/categories"

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier qu'un nom est fourni
if [ -z "$1" ]; then
  echo -e "${RED}❌ Erreur: Tu dois fournir un nom de catégorie${NC}"
  echo ""
  echo "Usage: ./scripts/create-category.sh \"Nom de la catégorie\" [description]"
  echo ""
  echo "Exemples:"
  echo "  ./scripts/create-category.sh \"T-Shirts\""
  echo "  ./scripts/create-category.sh \"Pulls\" \"Collection de pulls premium\""
  exit 1
fi

# Récupérer les paramètres
CATEGORY_NAME="$1"
DESCRIPTION="$2"

# Générer le slug automatiquement depuis le nom
# Convertir en minuscules, remplacer espaces par tirets, supprimer caractères spéciaux
SLUG=$(echo "$CATEGORY_NAME" | \
  tr '[:upper:]' '[:lower:]' | \
  sed 's/[àáâãäå]/a/g; s/[èéêë]/e/g; s/[ìíîï]/i/g; s/[òóôõö]/o/g; s/[ùúûü]/u/g; s/[ç]/c/g' | \
  sed 's/[^a-z0-9]/-/g' | \
  sed 's/--*/-/g' | \
  sed 's/^-\|-$//g')

# Préparer le JSON
if [ -z "$DESCRIPTION" ]; then
  JSON_PAYLOAD=$(cat <<EOF
{
  "name": "$CATEGORY_NAME",
  "slug": "$SLUG"
}
EOF
)
else
  JSON_PAYLOAD=$(cat <<EOF
{
  "name": "$CATEGORY_NAME",
  "slug": "$SLUG",
  "description": "$DESCRIPTION"
}
EOF
)
fi

# Afficher les informations
echo -e "${YELLOW}📦 Création de la catégorie...${NC}"
echo ""
echo "  Nom: $CATEGORY_NAME"
echo "  Slug: $SLUG"
if [ -n "$DESCRIPTION" ]; then
  echo "  Description: $DESCRIPTION"
fi
echo ""

# Envoyer la requête POST
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "${API_URL}${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD")

# Séparer le body et le code HTTP
HTTP_BODY=$(echo "$RESPONSE" | sed '$d')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

# Vérifier le résultat
if [ "$HTTP_CODE" -eq 201 ] || [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}✅ Catégorie créée avec succès !${NC}"
  echo ""
  echo "$HTTP_BODY" | python3 -m json.tool 2>/dev/null || echo "$HTTP_BODY"
else
  echo -e "${RED}❌ Erreur lors de la création (HTTP $HTTP_CODE)${NC}"
  echo ""
  echo "$HTTP_BODY" | python3 -m json.tool 2>/dev/null || echo "$HTTP_BODY"
  exit 1
fi
