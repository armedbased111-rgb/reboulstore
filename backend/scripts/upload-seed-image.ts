/**
 * Script pour uploader une image sur Cloudinary et obtenir son URL
 * Cette image sera utilisée pour tous les produits dans le seed
 * 
 * Usage:
 * 1. Placez votre image dans backend/seed-image/ (nom: product-image.jpg)
 * 2. Exécutez: npm run upload-seed-image
 * 3. L'URL sera affichée et sauvegardée dans seed-image-url.txt
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

async function uploadSeedImage() {
  // Charger les variables d'environnement
  dotenv.config({ path: path.join(__dirname, '../.env') });

  const seedImageDir = path.join(__dirname, 'seed-image');
  const outputPath = path.join(__dirname, 'seed-image-url.txt');

  // Chercher un fichier image dans le dossier
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  let imagePath: string | null = null;

  const files = fs.readdirSync(seedImageDir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (imageExtensions.includes(ext)) {
      imagePath = path.join(seedImageDir, file);
      break;
    }
  }

  // Vérifier que l'image existe
  if (!imagePath || !fs.existsSync(imagePath)) {
    console.error(`❌ Aucune image trouvée dans: ${seedImageDir}`);
    console.log('📝 Veuillez placer votre image dans: backend/scripts/seed-image/');
    console.log('   Formats acceptés: .jpg, .jpeg, .png, .gif, .webp');
    process.exit(1);
  }

  console.log(`📷 Image trouvée: ${path.basename(imagePath)}`);

  // Configurer Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Vérifier la configuration
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Configuration Cloudinary manquante dans .env');
    console.log('   Variables requises: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  try {
    console.log('📤 Upload de l\'image sur Cloudinary...');

    // Uploader sur Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        imagePath!,
        {
          folder: 'products/seed',
          resource_type: 'image',
          use_filename: true,
          unique_filename: true,
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
    }) as any;

    const imageUrl = uploadResult.secure_url;

    console.log('✅ Image uploadée avec succès!');
    console.log(`📎 URL: ${imageUrl}`);

    // Sauvegarder l'URL dans un fichier
    fs.writeFileSync(outputPath, imageUrl);
    console.log(`💾 URL sauvegardée dans: ${outputPath}`);

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'upload:', error.message || error);
    process.exit(1);
  }
}

uploadSeedImage();

