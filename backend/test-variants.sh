#!/bin/bash

# Script de test pour les endpoints Variantes
# Usage: ./test-variants.sh

BASE_URL="http://localhost:3001"
PRODUCT_ID="86963b42-bc7c-497e-93c7-49c9bb6ad132"

echo "🧪 Test des endpoints Variantes"
echo "================================"
echo ""

# 1. Récupérer les variantes d'un produit (devrait être vide au début)
echo "1️⃣  Récupérer les variantes du produit..."
curl -s "$BASE_URL/products/$PRODUCT_ID/variants" | jq '.'
echo ""
echo ""

# 2. Créer une première variante
echo "2️⃣  Créer une variante Rouge M..."
VARIANT1=$(curl -s -X POST "$BASE_URL/products/$PRODUCT_ID/variants" \
  -H "Content-Type: application/json" \
  -d '{
    "color": "Rouge",
    "size": "M",
    "stock": 10,
    "sku": "PROD-001-RED-M"
  }')
echo "$VARIANT1" | jq '.'
VARIANT1_ID=$(echo "$VARIANT1" | jq -r '.id')
echo ""
echo ""

# 3. Créer une deuxième variante
echo "3️⃣  Créer une variante Bleu L..."
VARIANT2=$(curl -s -X POST "$BASE_URL/products/$PRODUCT_ID/variants" \
  -H "Content-Type: application/json" \
  -d '{
    "color": "Bleu",
    "size": "L",
    "stock": 5,
    "sku": "PROD-001-BLUE-L"
  }')
echo "$VARIANT2" | jq '.'
VARIANT2_ID=$(echo "$VARIANT2" | jq -r '.id')
echo ""
echo ""

# 4. Récupérer toutes les variantes
echo "4️⃣  Récupérer toutes les variantes du produit..."
curl -s "$BASE_URL/products/$PRODUCT_ID/variants" | jq '.'
echo ""
echo ""

# 5. Récupérer une variante spécifique
echo "5️⃣  Récupérer la variante $VARIANT1_ID..."
curl -s "$BASE_URL/products/$PRODUCT_ID/variants/$VARIANT1_ID" | jq '.'
echo ""
echo ""

# 6. Vérifier le stock disponible
echo "6️⃣  Vérifier le stock (quantité 5)..."
curl -s "$BASE_URL/products/$PRODUCT_ID/variants/$VARIANT1_ID/stock?quantity=5" | jq '.'
echo ""
echo ""

# 7. Vérifier le stock insuffisant
echo "7️⃣  Vérifier le stock insuffisant (quantité 20)..."
curl -s "$BASE_URL/products/$PRODUCT_ID/variants/$VARIANT1_ID/stock?quantity=20" | jq '.'
echo ""
echo ""

# 8. Mettre à jour une variante
echo "8️⃣  Mettre à jour le stock de la variante..."
curl -s -X PATCH "$BASE_URL/products/$PRODUCT_ID/variants/$VARIANT1_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 15
  }' | jq '.'
echo ""
echo ""

# 9. Tester la validation (SKU dupliqué)
echo "9️⃣  Tester la validation (SKU dupliqué)..."
curl -s -X POST "$BASE_URL/products/$PRODUCT_ID/variants" \
  -H "Content-Type: application/json" \
  -d '{
    "color": "Vert",
    "size": "S",
    "stock": 3,
    "sku": "PROD-001-RED-M"
  }' | jq '.'
echo ""
echo ""

# 10. Récupérer à nouveau toutes les variantes
echo "🔟 Récupérer toutes les variantes (après modifications)..."
curl -s "$BASE_URL/products/$PRODUCT_ID/variants" | jq '.'
echo ""
echo ""

echo "✅ Tests terminés!"
