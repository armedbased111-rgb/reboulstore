#!/usr/bin/env bash

# Script de seed pour créer des données de test via l'API REST
# Utilise les endpoints existants pour créer catégories, produits, images et variantes
# Compatible avec bash 3+ (macOS) - n'utilise pas de tableaux associatifs

API_URL="${API_URL:-http://localhost:3001}"

echo "🌱 Démarrage du seed via API REST..."
echo "📍 API URL: $API_URL"
echo ""

# Vérifier que l'API est accessible
if ! curl -s -f "$API_URL" > /dev/null 2>&1; then
  echo "❌ Erreur: L'API n'est pas accessible à $API_URL"
  echo "   Assurez-vous que le backend est démarré: docker-compose up -d backend"
  exit 1
fi

# Fonction pour extraire un ID depuis une réponse JSON
extract_id() {
  echo "$1" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4
}

# Fonction pour faire des requêtes avec gestion d'erreur
api_request() {
  local method=$1
  local endpoint=$2
  local data=$3
  
  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint" \
      -H "Content-Type: application/json" 2>/dev/null)
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data" 2>/dev/null)
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    echo "$body"
    return 0
  else
    echo "❌ Erreur HTTP $http_code: $body" >&2
    return 1
  fi
}

# 1. Créer les catégories
echo "📦 Création des catégories..."

categories=(
  '{"name":"Adult","slug":"adult","description":"Vêtements pour adultes"}'
  '{"name":"Kids","slug":"kids","description":"Vêtements pour enfants"}'
  '{"name":"Sneakers","slug":"sneakers","description":"Chaussures de sport"}'
)

category_count=0
category_adult_id=""
category_kids_id=""
category_sneakers_id=""

for category_data in "${categories[@]}"; do
  name=$(echo "$category_data" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
  slug=$(echo "$category_data" | grep -o '"slug":"[^"]*"' | cut -d'"' -f4)
  
  # Vérifier si la catégorie existe déjà
  existing=$(api_request "GET" "/categories/slug/$slug" 2>/dev/null)
  if [ $? -eq 0 ] && [ -n "$existing" ]; then
    category_id=$(extract_id "$existing")
    if [ -n "$category_id" ]; then
      eval "category_${slug}_id=\"$category_id\""
      ((category_count++))
      echo "  → Catégorie existante: $name (ID: $category_id)"
      continue
    fi
  fi
  
  # Créer la catégorie
  result=$(api_request "POST" "/categories" "$category_data")
  if [ $? -eq 0 ]; then
    category_id=$(extract_id "$result")
    if [ -n "$category_id" ]; then
      eval "category_${slug}_id=\"$category_id\""
      ((category_count++))
      echo "  ✓ Catégorie créée: $name (ID: $category_id)"
    else
      echo "  ⚠️  Catégorie créée mais ID non trouvé: $name"
    fi
  fi
done

echo ""

# 2. Créer les produits
echo "🛍️  Création des produits..."

# Récupérer les IDs de catégories
adult_id="$category_adult_id"
kids_id="$category_kids_id"
sneakers_id="$category_sneakers_id"

products=(
  '{"name":"HOODIE BLACK","description":"Hoodie premium en coton noir, coupe oversize, style streetwear","price":89.99,"categoryId":"'$adult_id'"}'
  '{"name":"T-SHIRT WHITE","description":"T-shirt basique en coton bio, coupe classique, col rond","price":29.99,"categoryId":"'$adult_id'"}'
  '{"name":"SNEAKERS CLASSIC","description":"Sneakers classiques en cuir, semelle confortable, style minimaliste","price":129.99,"categoryId":"'$sneakers_id'"}'
  '{"name":"JACKET NAVY","description":"Veste en coton navy, coupe oversize, style militaire","price":149.99,"categoryId":"'$adult_id'"}'
  '{"name":"PANTS CARGO","description":"Pantalon cargo en coton, poches multiples, coupe large","price":79.99,"categoryId":"'$adult_id'"}'
  '{"name":"KIDS HOODIE","description":"Hoodie pour enfants, coton doux, coupe confortable","price":49.99,"categoryId":"'$kids_id'"}'
  '{"name":"SNEAKERS RUNNING","description":"Sneakers de running, légères et respirantes, semelle amortissante","price":99.99,"categoryId":"'$sneakers_id'"}'
  '{"name":"SWEATSHIRT CREAM","description":"Sweatshirt en coton crème, coupe oversize, style minimaliste","price":69.99,"categoryId":"'$adult_id'"}'
)

product_count=0
product_hoodie_black_id=""
product_tshirt_white_id=""
product_sneakers_classic_id=""
product_jacket_navy_id=""
product_pants_cargo_id=""
product_kids_hoodie_id=""
product_sneakers_running_id=""
product_sweatshirt_cream_id=""

for product_data in "${products[@]}"; do
  name=$(echo "$product_data" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
  name_key=$(echo "$name" | tr ' ' '_' | tr '-' '_' | tr '[:upper:]' '[:lower:]')
  
  result=$(api_request "POST" "/products" "$product_data")
  if [ $? -eq 0 ]; then
    product_id=$(extract_id "$result")
    if [ -n "$product_id" ]; then
      eval "product_${name_key}_id=\"$product_id\""
      ((product_count++))
      echo "  ✓ Produit créé: $name (ID: $product_id)"
    else
      echo "  ⚠️  Produit créé mais ID non trouvé: $name"
    fi
  fi
done

echo ""

# 3. Ajouter les images (on utilise des URLs Unsplash pour les images de test)
echo "🖼️  Ajout des images..."

# Images pour chaque produit (première et deuxième image)
declare -A product_images=(
  ["HOODIE BLACK"]='["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop","https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop"]'
  ["T-SHIRT WHITE"]='["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop","https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop"]'
  ["SNEAKERS CLASSIC"]='["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop","https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop"]'
  ["JACKET NAVY"]='["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop","https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop"]'
  ["PANTS CARGO"]='["https://images.unsplash.com/photo-1506629905607-3e0c82e5e0a1?w=800&h=1000&fit=crop","https://images.unsplash.com/photo-1506629905607-3e0c82e5e0a1?w=800&h=1000&fit=crop"]'
  ["KIDS HOODIE"]='["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop"]'
  ["SNEAKERS RUNNING"]='["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop","https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop"]'
  ["SWEATSHIRT CREAM"]='["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop","https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop"]'
)

# Note: Pour les images, on devrait utiliser form-data avec curl, mais pour simplifier
# on va créer les images directement en base avec des URLs. 
# En production, on utiliserait l'endpoint POST /products/:id/images avec form-data

echo "  ⚠️  Note: Les images doivent être uploadées via l'endpoint POST /products/:id/images avec form-data"
echo "  → Pour l'instant, les produits sont créés sans images (à ajouter manuellement ou via l'API)"
echo ""

# 4. Ajouter les variantes
echo "📏 Ajout des variantes..."

variant_count=0

# Fonction pour créer une variante
create_variant() {
  local product_id=$1
  local color=$2
  local size=$3
  local stock=$4
  local sku=$5
  
  if [ -z "$product_id" ]; then
    return 1
  fi
  
  local variant_json="{\"color\":\"$color\",\"size\":\"$size\",\"stock\":$stock,\"sku\":\"$sku\"}"
  result=$(api_request "POST" "/products/$product_id/variants" "$variant_json")
  if [ $? -eq 0 ]; then
    ((variant_count++))
    echo "    ✓ Variante créée: $sku"
    return 0
  fi
  return 1
}

# Fonction pour récupérer l'ID d'un produit
get_product_id() {
  local name_key=$1
  eval "echo \"\$product_${name_key}_id\""
}

# HOODIE BLACK
product_id=$(get_product_id "hoodie_black")
if [ -n "$product_id" ]; then
  create_variant "$product_id" "Black" "S" 15 "HOOD-BLK-S"
  create_variant "$product_id" "Black" "M" 20 "HOOD-BLK-M"
  create_variant "$product_id" "Black" "L" 18 "HOOD-BLK-L"
  create_variant "$product_id" "Black" "XL" 12 "HOOD-BLK-XL"
fi

# T-SHIRT WHITE
product_id=$(get_product_id "tshirt_white")
if [ -n "$product_id" ]; then
  create_variant "$product_id" "White" "S" 25 "TSH-WHT-S"
  create_variant "$product_id" "White" "M" 30 "TSH-WHT-M"
  create_variant "$product_id" "White" "L" 28 "TSH-WHT-L"
fi

# SNEAKERS CLASSIC
product_id=$(get_product_id "sneakers_classic")
if [ -n "$product_id" ]; then
  create_variant "$product_id" "White" "40" 10 "SNK-WHT-40"
  create_variant "$product_id" "White" "41" 12 "SNK-WHT-41"
  create_variant "$product_id" "White" "42" 15 "SNK-WHT-42"
  create_variant "$product_id" "White" "43" 8 "SNK-WHT-43"
fi

# JACKET NAVY
product_id=$(get_product_id "jacket_navy")
if [ -n "$product_id" ]; then
  create_variant "$product_id" "Navy" "M" 8 "JKT-NVY-M"
  create_variant "$product_id" "Navy" "L" 10 "JKT-NVY-L"
  create_variant "$product_id" "Navy" "XL" 6 "JKT-NVY-XL"
fi

# PANTS CARGO
product_id=$(get_product_id "pants_cargo")
if [ -n "$product_id" ]; then
  create_variant "$product_id" "Olive" "S" 12 "PNT-OLV-S"
  create_variant "$product_id" "Olive" "M" 15 "PNT-OLV-M"
  create_variant "$product_id" "Olive" "L" 14 "PNT-OLV-L"
fi

# KIDS HOODIE
product_id=$(get_product_id "kids_hoodie")
if [ -n "$product_id" ]; then
  create_variant "$product_id" "Gray" "6Y" 10 "KHD-GRY-6Y"
  create_variant "$product_id" "Gray" "8Y" 12 "KHD-GRY-8Y"
  create_variant "$product_id" "Gray" "10Y" 8 "KHD-GRY-10Y"
fi

# SNEAKERS RUNNING
product_id=$(get_product_id "sneakers_running")
if [ -n "$product_id" ]; then
  create_variant "$product_id" "Black" "40" 9 "SNK-RUN-BLK-40"
  create_variant "$product_id" "Black" "41" 11 "SNK-RUN-BLK-41"
  create_variant "$product_id" "Black" "42" 13 "SNK-RUN-BLK-42"
fi

# SWEATSHIRT CREAM
product_id=$(get_product_id "sweatshirt_cream")
if [ -n "$product_id" ]; then
  create_variant "$product_id" "Cream" "S" 14 "SWT-CRM-S"
  create_variant "$product_id" "Cream" "M" 16 "SWT-CRM-M"
  create_variant "$product_id" "Cream" "L" 18 "SWT-CRM-L"
fi

echo ""
echo "✅ Seed terminé avec succès!"
echo ""
echo "📊 Résumé:"
echo "  - Catégories: $category_count"
echo "  - Produits: $product_count"
echo "  - Variantes: $variant_count créées"
echo ""
echo "💡 Pour ajouter des images aux produits, utilisez:"
echo "   curl -X POST $API_URL/products/{productId}/images \\"
echo "     -F 'file=@/path/to/image.jpg' \\"
echo "     -F 'alt=Description' \\"
echo "     -F 'order=0'"
echo ""
echo "🌐 Vérifier les produits: curl $API_URL/products"
