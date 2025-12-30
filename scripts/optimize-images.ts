#!/usr/bin/env ts-node
/**
 * Script d'optimisation d'images produits
 * 
 * Usage:
 *   ts-node scripts/optimize-images.ts <dossier-images> [--output <dossier-output>]
 * 
 * Fonctionnalités:
 * - Compression JPG/PNG
 * - Conversion WebP (optionnel)
 * - Redimensionnement si nécessaire
 * - Validation qualité
 */

import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

interface OptimizeOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  targetSizeKB: number;
  generateWebP: boolean;
}

const DEFAULT_OPTIONS: OptimizeOptions = {
  maxWidth: 2048,
  maxHeight: 2048,
  quality: 85,
  targetSizeKB: 300,
  generateWebP: true,
};

interface ImageStats {
  original: {
    path: string;
    size: number;
    width: number;
    height: number;
  };
  optimized: {
    path: string;
    size: number;
    width: number;
    height: number;
  };
  webp?: {
    path: string;
    size: number;
  };
  reduction: number; // Pourcentage de réduction
}

/**
 * Optimiser une image
 */
async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options: OptimizeOptions,
): Promise<ImageStats> {
  const originalStats = await fs.promises.stat(inputPath);
  const originalSize = originalStats.size;

  // Lire métadonnées de l'image originale
  const metadata = await sharp(inputPath).metadata();
  const originalWidth = metadata.width || 0;
  const originalHeight = metadata.height || 0;

  // Calculer les dimensions optimales (maintenir ratio)
  let targetWidth = originalWidth;
  let targetHeight = originalHeight;

  if (originalWidth > options.maxWidth || originalHeight > options.maxHeight) {
    const ratio = Math.min(
      options.maxWidth / originalWidth,
      options.maxHeight / originalHeight,
    );
    targetWidth = Math.round(originalWidth * ratio);
    targetHeight = Math.round(originalHeight * ratio);
  }

  // Optimiser l'image
  const image = sharp(inputPath)
    .resize(targetWidth, targetHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });

  // Déterminer le format
  const ext = path.extname(inputPath).toLowerCase();
  let outputImage = image;

  if (ext === '.png') {
    outputImage = image.png({ quality: options.quality, compressionLevel: 9 });
  } else {
    outputImage = image.jpeg({ quality: options.quality, mozjpeg: true });
  }

  // Sauvegarder l'image optimisée
  await outputImage.toFile(outputPath);

  // Statistiques de l'image optimisée
  const optimizedStats = await fs.promises.stat(outputPath);
  const optimizedSize = optimizedStats.size;
  const reduction = ((originalSize - optimizedSize) / originalSize) * 100;

  const result: ImageStats = {
    original: {
      path: inputPath,
      size: originalSize,
      width: originalWidth,
      height: originalHeight,
    },
    optimized: {
      path: outputPath,
      size: optimizedSize,
      width: targetWidth,
      height: targetHeight,
    },
    reduction,
  };

  // Générer WebP si demandé
  if (options.generateWebP) {
    const webpPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    await sharp(outputPath)
      .webp({ quality: options.quality })
      .toFile(webpPath);

    const webpStats = await fs.promises.stat(webpPath);
    result.webp = {
      path: webpPath,
      size: webpStats.size,
    };
  }

  return result;
}

/**
 * Valider qu'une image respecte les standards
 */
function validateImage(stats: ImageStats): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Vérifier la taille
  const sizeKB = stats.optimized.size / 1024;
  if (sizeKB > DEFAULT_OPTIONS.targetSizeKB) {
    warnings.push(
      `Image trop lourde: ${sizeKB.toFixed(2)}KB (cible: ${DEFAULT_OPTIONS.targetSizeKB}KB)`,
    );
  }

  // Vérifier les dimensions
  if (
    stats.optimized.width < 1920 ||
    stats.optimized.height < 1080
  ) {
    warnings.push(
      `Résolution faible: ${stats.optimized.width}x${stats.optimized.height} (min: 1920x1080)`,
    );
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

/**
 * Traiter un dossier d'images
 */
async function processDirectory(
  inputDir: string,
  outputDir: string,
  options: OptimizeOptions,
): Promise<ImageStats[]> {
  const files = await fs.promises.readdir(inputDir);
  const imageFiles = files.filter(
    (file) =>
      /\.(jpg|jpeg|png)$/i.test(file) &&
      !file.startsWith('.') &&
      !file.includes('_optimized'),
  );

  console.log(`\n📸 Trouvé ${imageFiles.length} image(s) à optimiser\n`);

  const results: ImageStats[] = [];

  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    try {
      console.log(`🔄 Optimisation: ${file}...`);
      const stats = await optimizeImage(inputPath, outputPath, options);
      const validation = validateImage(stats);

      console.log(`   ✅ Optimisé: ${(stats.reduction).toFixed(1)}% de réduction`);
      console.log(`   📏 Dimensions: ${stats.optimized.width}x${stats.optimized.height}`);
      console.log(`   💾 Taille: ${(stats.optimized.size / 1024).toFixed(2)}KB`);

      if (stats.webp) {
        console.log(`   🌐 WebP: ${(stats.webp.size / 1024).toFixed(2)}KB`);
      }

      if (!validation.valid) {
        console.log(`   ⚠️  Avertissements:`);
        validation.warnings.forEach((w) => console.log(`      - ${w}`));
      }

      results.push(stats);
    } catch (error) {
      console.error(`   ❌ Erreur lors de l'optimisation de ${file}:`, error);
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
Usage: ts-node scripts/optimize-images.ts <dossier-images> [options]

Options:
  --output <dossier>    Dossier de sortie (défaut: <dossier-images>_optimized)
  --no-webp            Ne pas générer de fichiers WebP
  --quality <1-100>    Qualité JPEG/PNG (défaut: 85)
  --max-size <KB>      Taille cible en KB (défaut: 300)

Exemples:
  ts-node scripts/optimize-images.ts ./images
  ts-node scripts/optimize-images.ts ./images --output ./optimized
  ts-node scripts/optimize-images.ts ./images --quality 90 --no-webp
    `);
    process.exit(1);
  }

  const inputDir = args[0];
  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Dossier introuvable: ${inputDir}`);
    process.exit(1);
  }

  // Options
  const outputIndex = args.indexOf('--output');
  const outputDir =
    outputIndex !== -1 && args[outputIndex + 1]
      ? args[outputIndex + 1]
      : `${inputDir}_optimized`;

  const qualityIndex = args.indexOf('--quality');
  const quality =
    qualityIndex !== -1 && args[qualityIndex + 1]
      ? parseInt(args[qualityIndex + 1], 10)
      : DEFAULT_OPTIONS.quality;

  const maxSizeIndex = args.indexOf('--max-size');
  const targetSizeKB =
    maxSizeIndex !== -1 && args[maxSizeIndex + 1]
      ? parseInt(args[maxSizeIndex + 1], 10)
      : DEFAULT_OPTIONS.targetSizeKB;

  const generateWebP = !args.includes('--no-webp');

  const options: OptimizeOptions = {
    ...DEFAULT_OPTIONS,
    quality,
    targetSizeKB,
    generateWebP,
  };

  // Créer le dossier de sortie
  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir, { recursive: true });
  }

  console.log(`\n🚀 Optimisation d'images`);
  console.log(`📁 Dossier source: ${inputDir}`);
  console.log(`📁 Dossier sortie: ${outputDir}`);
  console.log(`⚙️  Options: qualité=${quality}%, taille cible=${targetSizeKB}KB, WebP=${generateWebP}\n`);

  const results = await processDirectory(inputDir, outputDir, options);

  // Résumé
  console.log(`\n📊 Résumé:`);
  console.log(`   ✅ ${results.length} image(s) optimisée(s)`);
  const totalReduction = results.reduce((sum, r) => sum + r.reduction, 0) / results.length;
  console.log(`   📉 Réduction moyenne: ${totalReduction.toFixed(1)}%`);
  const totalSize = results.reduce((sum, r) => sum + r.optimized.size, 0);
  console.log(`   💾 Taille totale: ${(totalSize / 1024 / 1024).toFixed(2)}MB\n`);
}

main().catch(console.error);

