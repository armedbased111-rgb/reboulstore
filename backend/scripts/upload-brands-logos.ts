/**
 * Script pour uploader les logos des marques sur Cloudinary
 * 
 * Usage: npx ts-node -r tsconfig-paths/register backend/scripts/upload-brands-logos.ts
 */

import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import brandsData from './brands-data.json';

// Charger les variables d'environnement
// Essayer backend/.env d'abord (contient Cloudinary), puis .env.local, puis .env
const backendEnvPath = path.join(__dirname, '../.env');
const envLocalPath = path.join(__dirname, '../../.env.local');
const envPath = path.join(__dirname, '../../.env');

if (fs.existsSync(backendEnvPath)) {
  config({ path: backendEnvPath });
}
if (fs.existsSync(envLocalPath)) {
  config({ path: envLocalPath, override: false }); // Ne pas écraser les valeurs existantes
}
if (fs.existsSync(envPath)) {
  config({ path: envPath, override: false });
}

// Configurer Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadResult {
  brandName: string;
  success: boolean;
  publicId?: string;
  url?: string;
  error?: string;
}

/**
 * Uploader un logo sur Cloudinary
 */
async function uploadLogo(
  logoPath: string,
  brandSlug: string,
): Promise<{ publicId: string; url: string }> {
  return new Promise((resolve, reject) => {
    // Chemin depuis le conteneur Docker ou local
    // Dans Docker, le volume est monté à /app
    const archivePath = path.join(__dirname, '../../frontend/public/archive reboul 2024');
    const fullPath = path.join(archivePath, logoPath);

    if (!fs.existsSync(fullPath)) {
      reject(new Error(`Logo not found: ${fullPath}`));
      return;
    }

    const publicId = `brands/logos/${brandSlug}`;

    cloudinary.uploader.upload(
      fullPath,
      {
        public_id: publicId,
        folder: 'brands/logos',
        overwrite: true,
        resource_type: 'image',
        transformation: [
          {
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error('Upload failed: empty result'));
          return;
        }

        resolve({
          publicId: result.public_id,
          url: result.secure_url,
        });
      },
    );
  });
}

/**
 * Uploader tous les logos
 */
async function uploadAllLogos(): Promise<void> {
  console.log('🚀 Début upload logos marques sur Cloudinary...\n');

  const results: UploadResult[] = [];
  const total = brandsData.brands.length;

  for (let i = 0; i < brandsData.brands.length; i++) {
    const brand = brandsData.brands[i];
    console.log(`[${i + 1}/${total}] Upload ${brand.name}...`);

    try {
      const { publicId, url } = await uploadLogo(brand.logoPath, brand.slug);
      results.push({
        brandName: brand.name,
        success: true,
        publicId,
        url,
      });
      console.log(`  ✅ ${brand.name} uploadé: ${publicId}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      results.push({
        brandName: brand.name,
        success: false,
        error: errorMessage,
      });
      console.log(`  ❌ ${brand.name} erreur: ${errorMessage}`);
    }
  }

  // Résumé
  console.log('\n📊 Résumé:');
  const successCount = results.filter((r) => r.success).length;
  const errorCount = results.filter((r) => !r.success).length;

  console.log(`✅ Succès: ${successCount}/${total}`);
  console.log(`❌ Erreurs: ${errorCount}/${total}`);

  if (errorCount > 0) {
    console.log('\n❌ Erreurs détaillées:');
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.brandName}: ${r.error}`);
      });
  }

  // Sauvegarder les résultats avec URLs Cloudinary
  const brandsWithUrls = brandsData.brands.map((brand) => {
    const result = results.find((r) => r.brandName === brand.name);
    return {
      ...brand,
      logoUrl: result?.success ? result.url : null,
      publicId: result?.success ? result.publicId : null,
    };
  });

  const outputPath = path.join(__dirname, 'brands-data-with-urls.json');
  fs.writeFileSync(
    outputPath,
    JSON.stringify({ brands: brandsWithUrls }, null, 2),
  );
  console.log(`\n💾 Données avec URLs sauvegardées dans: ${outputPath}`);
}

// Exécuter
uploadAllLogos()
  .then(() => {
    console.log('\n✅ Upload terminé !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  });

