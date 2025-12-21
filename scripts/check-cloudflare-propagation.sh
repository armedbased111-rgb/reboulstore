#!/bin/bash

# Script pour vérifier la propagation DNS Cloudflare
# Usage: ./scripts/check-cloudflare-propagation.sh

set +e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Vérification de la propagation DNS Cloudflare${NC}\n"

# Vérifier les nameservers
NS_RESULT=$(dig NS reboulstore.com +short 2>/dev/null | head -2)

if echo "$NS_RESULT" | grep -q "cloudflare.com"; then
    echo -e "${GREEN}✅ Nameservers Cloudflare actifs !${NC}"
    echo "$NS_RESULT" | while read ns; do
        echo "   → $ns"
    done
    echo ""
    
    # Vérifier les headers Cloudflare
    echo -e "${BLUE}Vérification des headers Cloudflare...${NC}"
    CF_HEADERS=$(curl -sI https://www.reboulstore.com 2>/dev/null | grep -i "cf-ray\|server.*cloudflare")
    
    if [ ! -z "$CF_HEADERS" ]; then
        echo -e "${GREEN}✅ Cloudflare actif ! Headers détectés :${NC}"
        echo "$CF_HEADERS" | sed 's/^/   /'
    else
        echo -e "${YELLOW}⚠️  Cloudflare propagé mais headers pas encore visibles (peut prendre quelques minutes de plus)${NC}"
    fi
else
    echo -e "${YELLOW}⏳ Propagation en cours...${NC}"
    echo "Nameservers actuels :"
    echo "$NS_RESULT" | while read ns; do
        echo "   → $ns"
    done
    echo ""
    echo -e "${YELLOW}Attendre quelques minutes et réessayer${NC}"
fi

echo ""
echo -e "${BLUE}💡 Pour vérifier manuellement :${NC}"
echo "   dig NS reboulstore.com +short"
echo "   curl -I https://www.reboulstore.com | grep -i cf-ray"
