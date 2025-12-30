#!/usr/bin/env ts-node
/**
 * Script batch upload d'images vers Cloudinary avec association automatique aux produits
 * 
 * Usage:
 *   ts-node scripts/batch-upload-images.ts <dossier-images> [--collection <nom>] [--dry-run]
 * 
 * Fonctionnalités:
 * - Upload multiple images vers Cloudinary
 * - Association automatique aux produits par SKU (convention nommage)
 * - Organisation par collection
 * - Validation avant upload
 */

import * as fs from 'fs';
import * as path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Product } from '../src/entities/product.entity';
import { Collection } from '../src/entities/collection.entity';

// Charger variables d'environnement
config();

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuration base de données
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'reboulstore_db',
  entities: [Product, Collection],
  synchronize: false,
});

interface ImageFile {
  path: string;
  filename: string;
  sku: string | null;
  number: number | null;
  type: string | null;
}

interface UploadResult {
  file: ImageFile;
  success: boolean;
  productId?: string;
  productName?: string;
  url?: string;
  publicId?: string;
  error?: string;
}

/**
 * Parser le nom de fichier selon la convention: [SKU]_[numero]_[type].jpg
 */
function parseFilename(filename: string): ImageFile {
  const ext = path.extname(filename);
  const basename = path.basename(filename, ext);

  // Pattern: SKU_numero_type ou SKU_numero
  const match = basename.match(/^([A-Z0-9-]+)_(\d+)(?:_(.+))?$/i);

  if (!match) {
    return {
      path: filename,
      filename,
      sku: null,
      number: null,
      type: null,
    };
  }

  return {
    path: filename,
    filename,
    sku: match[1].toUpperCase(),
    number: parseInt(match[2], 10),
    type: match[3] || null,
  };
}

/**
 * Trouver le produit par SKU
 */
async function findProductBySku(sku: string): Promise<Product | null> {
  // Chercher dans les variants (SKU peut être dans variant)
  const product = await AppDataSource.manager
    .createQueryBuilder(Product, 'product')
    .leftJoinAndSelect('product.variants', 'variant')
    .where('variant.sku = :sku', { sku })
    .orWhere('product.name ILIKE :sku', { sku: `%${sku}%` })
    .getOne();

  return product;
}

/**
 * Upload une image vers Cloudinary
 */
async function uploadToCloudinary(
  filePath: string,
  sku: string,
  collectionName: string | null,
  number: number,
): Promise<{ url: string; publicId: string }> {
  const folder = collectionName
    ? `products/${collectionName}/${sku}`
    : `products/${sku}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder,
        resource_type: 'image',
        overwrite: false,
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
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } else {
          reject(new Error('Upload failed: no result'));
        }
      },
    );
  });
}

/**
 * Traiter un dossier d'images
 */
async function processDirectory(
  inputDir: string,
  collectionName: string | null,
  dryRun: boolean,
): Promise<UploadResult[]> {
  const files = await fs.promises.readdir(inputDir);
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|webp)$/i.test(file),
  );

  console.log(`\n📸 Trouvé ${imageFiles.length} image(s) à uploader\n`);

  const results: UploadResult[] = [];

  for (const file of imageFiles) {
    const filePath = path.join(inputDir, file);
    const imageInfo = parseFilename(file);

    console.log(`\n🔄 Traitement: ${file}`);

    if (!imageInfo.sku) {
      console.log(`   ⚠️  SKU non trouvé dans le nom de fichier`);
      results.push({
        file: imageInfo,
        success: false,
        error: 'SKU non trouvé dans le nom de fichier',
      });
      continue;
    }

    // Trouver le produit
    const product = await findProductBySku(imageInfo.sku);

    if (!product) {
      console.log(`   ⚠️  Produit non trouvé pour SKU: ${imageInfo.sku}`);
      results.push({
        file: imageInfo,
        success: false,
        error: `Produit non trouvé pour SKU: ${imageInfo.sku}`,
      });
      continue;
    }

    console.log(`   ✅ Produit trouvé: ${product.name} (${product.id})`);

    if (dryRun) {
      console.log(`   🔍 [DRY RUN] Serait uploadé vers: products/${collectionName || 'default'}/${imageInfo.sku}/`);
      results.push({
        file: imageInfo,
        success: true,
        productId: product.id,
        productName: product.name,
      });
      continue;
    }

    // Upload vers Cloudinary
    try {
      console.log(`   📤 Upload vers Cloudinary...`);
      const { url, publicId } = await uploadToCloudinary(
        filePath,
        imageInfo.sku,
        collectionName,
        imageInfo.number || 1,
      );

      console.log(`   ✅ Upload réussi: ${url}`);

      // TODO: Créer l'entrée Image en base de données
      // await createImageInDatabase(product.id, url, publicId, imageInfo.number || 1);

      results.push({
        file: imageInfo,
        success: true,
        productId: product.id,
        productName: product.name,
        url,
        publicId,
      });
    } catch (error) {
      console.error(`   ❌ Erreur upload:`, error);
      results.push({
        file: imageInfo,
        success: false,
        productId: product.id,
        productName: product.name,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  return results;
}

/**
 * Main
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage: ts-node scripts/batch-upload-images.ts <dossier-images> [options]

Options:
  --collection <nom>    Nom de la collection (ex: SS2025)
  --dry-run            Simulation sans upload réel

Exemples:
  ts-node scripts/batch-upload-images.ts ./images
  ts-node scripts/batch-upload-images.ts ./images --collection SS2025
  ts-node scripts/batch-upload-images.ts ./images --collection SS2025 --dry-run
    `);
    process.exit(1);
  }

  const inputDir = args[0];
  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Dossier introuvable: ${inputDir}`);
    process.exit(1);
  }

  // Options
  const collectionIndex = args.indexOf('--collection');
  const collectionName =
    collectionIndex !== -1 && args[collectionIndex + 1]
      ? args[collectionIndex + 1]
      : null;

  const dryRun = args.includes('--dry-run');

  console.log(`\n🚀 Batch Upload Images`);
  console.log(`📁 Dossier: ${inputDir}`);
  console.log(`📦 Collection: ${collectionName || 'default'}`);
  console.log(`🔍 Mode: ${dryRun ? 'DRY RUN (simulation)' : 'UPLOAD RÉEL'}\n`);

  // Connexion base de données
  try {
    await AppDataSource.initialize();
    console.log('✅ Connexion base de données établie\n');
  } catch (error) {
    console.error('❌ Erreur connexion base de données:', error);
    process.exit(1);
  }

  // Traiter les images
  const results = await processDirectory(inputDir, collectionName, dryRun);

  // Résumé
  console.log(`\n📊 Résumé:`);
  const successCount = results.filter((r) => r.success).length;
  const errorCount = results.filter((r) => !r.success).length;
  console.log(`   ✅ ${successCount} image(s) uploadée(s) avec succès`);
  console.log(`   ❌ ${errorCount} erreur(s)`);

  if (errorCount > 0) {
    console.log(`\n❌ Erreurs:`);
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`   - ${r.file.filename}: ${r.error}`);
      });
  }

  // Fermer connexion
  await AppDataSource.destroy();
}

main().catch(console.error);

