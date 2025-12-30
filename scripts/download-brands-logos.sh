#!/bin/bash

# Script pour télécharger les logos des marques depuis GitHub
# Usage: ./download-brands-logos.sh <URL_REPO_GITHUB> <CHEMIN_DOSSIER_LOGOS>

set -e

REPO_URL=$1
LOGOS_PATH=$2  # Ex: "public/logos" ou "public/brands" ou "public/images/brands"

if [ -z "$REPO_URL" ] || [ -z "$LOGOS_PATH" ]; then
  echo "❌ Usage: ./download-brands-logos.sh <URL_REPO_GITHUB> <CHEMIN_DOSSIER_LOGOS>"
  echo "   Exemple: ./download-brands-logos.sh https://github.com/user/repo.git public/logos"
  exit 1
fi

# Créer le dossier de destination
DEST_DIR="assets/brands/logos"
mkdir -p "$DEST_DIR"

echo "📥 Téléchargement des logos depuis GitHub..."
echo "   Repo: $REPO_URL"
echo "   Chemin: $LOGOS_PATH"
echo "   Destination: $DEST_DIR"

# Cloner seulement le dossier spécifique
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

git clone --depth 1 --filter=blob:none --sparse "$REPO_URL" temp-repo
cd temp-repo
git sparse-checkout set "$LOGOS_PATH"

# Copier les fichiers
if [ -d "$LOGOS_PATH" ]; then
  cp -r "$LOGOS_PATH"/* "$OLDPWD/$DEST_DIR/"
  echo "✅ Logos copiés dans $DEST_DIR"
  echo "📊 Fichiers trouvés:"
  ls -lh "$OLDPWD/$DEST_DIR"
else
  echo "❌ Dossier $LOGOS_PATH non trouvé dans le repo"
  exit 1
fi

# Nettoyer
cd "$OLDPWD"
rm -rf "$TEMP_DIR"

echo "✅ Téléchargement terminé !"
echo "📁 Logos disponibles dans: $DEST_DIR"

