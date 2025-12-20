#!/bin/bash

# Script de test pour l'upload d'images produits
# 
# Usage:
#   ./scripts/test-images-upload.sh <productId> <image1> <image2> <image3> <image4> <image5> <image6> [non-image-file]
#
# Exemple:
#   ./scripts/test-images-upload.sh abc-123 img1.jpg img2.jpg img3.jpg img4.jpg img5.jpg img6.jpg test.txt

cd "$(dirname "$0")/.." || exit 1

ts-node -r tsconfig-paths/register scripts/test-images-upload.ts "$@"

