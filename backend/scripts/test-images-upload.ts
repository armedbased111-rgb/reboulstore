#!/usr/bin/env ts-node

/**
 * Script de test pour l'upload d'images produits
 * 
 * Usage:
 *   ts-node scripts/test-images-upload.ts <productId> <image1> <image2> <image3> <image4> <image5> <image6> [non-image-file]
 * 
 * Exemple:
 *   ts-node scripts/test-images-upload.ts abc-123 img1.jpg img2.jpg img3.jpg img4.jpg img5.jpg img6.jpg test.txt
 */

import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message: string) {
  log(`✅ ${message}`, 'green');
}

function logError(message: string) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message: string) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logWarning(message: string) {
  log(`⚠️  ${message}`, 'yellow');
}

async function makeRequest(
  method: string,
  url: string,
  formData?: FormData,
): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const httpModule = parsedUrl.protocol === 'https:' ? require('https') : require('http');

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method,
      headers: formData ? formData.getHeaders() : { 'Content-Type': 'application/json' },
    };

    const req = httpModule.request(options, (res: any) => {
      let data = '';

      res.on('data', (chunk: Buffer) => {
        data += chunk.toString();
      });

      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode || 500, data: jsonData });
        } catch {
          resolve({ status: res.statusCode || 500, data });
        }
      });
    });

    req.on('error', (error: Error) => {
      reject(error);
    });

    if (formData) {
      formData.pipe(req);
    } else {
      req.end();
    }
  });
}

async function testUploadSimple(productId: string, imagePath: string) {
  logInfo(`\n📤 Test 1: Upload simple - ${path.basename(imagePath)}`);

  if (!fs.existsSync(imagePath)) {
    logError(`Fichier introuvable: ${imagePath}`);
    return null;
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(imagePath));
  formData.append('alt', 'Test upload simple');
  formData.append('order', '0');

  try {
    const response = await makeRequest(
      'POST',
      `${API_BASE_URL}/products/${productId}/images`,
      formData,
    );

    if (response.status === 201) {
      logSuccess(`Upload réussi! Image ID: ${response.data.id}`);
      logInfo(`URL: ${response.data.url}`);
      logInfo(`PublicId: ${response.data.publicId}`);
      return response.data;
    } else {
      logError(`Échec upload (${response.status}): ${JSON.stringify(response.data)}`);
      return null;
    }
  } catch (error: any) {
    logError(`Erreur: ${error.message}`);
    return null;
  }
}

async function testDeleteImage(productId: string, imageId: string) {
  logInfo(`\n🗑️  Test 2: Suppression d'image - ${imageId}`);

  try {
    const response = await makeRequest(
      'DELETE',
      `${API_BASE_URL}/products/${productId}/images/${imageId}`,
    );

    if (response.status === 204) {
      logSuccess('Suppression réussie!');
      return true;
    } else {
      logError(`Échec suppression (${response.status}): ${JSON.stringify(response.data)}`);
      return false;
    }
  } catch (error: any) {
    logError(`Erreur: ${error.message}`);
    return false;
  }
}

async function testUploadMultiple(
  productId: string,
  imagePaths: string[],
  alts?: string[],
  orders?: number[],
) {
  logInfo(`\n📤 Test 3: Upload multiple - ${imagePaths.length} images`);

  const formData = new FormData();

  for (const imagePath of imagePaths) {
    if (!fs.existsSync(imagePath)) {
      logError(`Fichier introuvable: ${imagePath}`);
      return null;
    }
    formData.append('files', fs.createReadStream(imagePath));
  }

  if (alts) {
    for (const alt of alts) {
      formData.append('alts[]', alt);
    }
  }

  if (orders) {
    for (const order of orders) {
      formData.append('orders[]', order.toString());
    }
  }

  try {
    const response = await makeRequest(
      'POST',
      `${API_BASE_URL}/products/${productId}/images/bulk`,
      formData,
    );

    if (response.status === 201) {
      logSuccess(`Upload multiple réussi! ${response.data.length} images créées`);
      response.data.forEach((img: any, idx: number) => {
        logInfo(`  Image ${idx + 1}: ID=${img.id}, order=${img.order}, alt="${img.alt}"`);
      });
      return response.data;
    } else {
      logError(`Échec upload multiple (${response.status}): ${JSON.stringify(response.data)}`);
      return null;
    }
  } catch (error: any) {
    logError(`Erreur: ${error.message}`);
    return null;
  }
}

async function testUploadMultipleAutoOrder(productId: string, imagePaths: string[]) {
  logInfo(`\n📤 Test 4: Upload multiple avec ordre automatique - ${imagePaths.length} images`);

  const formData = new FormData();

  for (const imagePath of imagePaths) {
    if (!fs.existsSync(imagePath)) {
      logError(`Fichier introuvable: ${imagePath}`);
      return null;
    }
    formData.append('files', fs.createReadStream(imagePath));
  }

  formData.append('alts[]', 'Détail matière');
  formData.append('alts[]', 'Zoom logo');

  try {
    const response = await makeRequest(
      'POST',
      `${API_BASE_URL}/products/${productId}/images/bulk`,
      formData,
    );

    if (response.status === 201) {
      logSuccess(`Upload multiple réussi! ${response.data.length} images créées`);
      response.data.forEach((img: any, idx: number) => {
        logInfo(`  Image ${idx + 1}: ID=${img.id}, order=${img.order}, alt="${img.alt}"`);
      });
      return response.data;
    } else {
      logError(`Échec upload multiple (${response.status}): ${JSON.stringify(response.data)}`);
      return null;
    }
  } catch (error: any) {
    logError(`Erreur: ${error.message}`);
    return null;
  }
}

async function testUploadTooManyFiles(productId: string, imagePaths: string[]) {
  logInfo(`\n📤 Test 5: Upload multiple - trop de fichiers (${imagePaths.length} fichiers)`);

  const formData = new FormData();

  for (const imagePath of imagePaths) {
    if (fs.existsSync(imagePath)) {
      formData.append('files', fs.createReadStream(imagePath));
    }
  }

  try {
    const response = await makeRequest(
      'POST',
      `${API_BASE_URL}/products/${productId}/images/bulk`,
      formData,
    );

    if (response.status === 400) {
      logSuccess(`Erreur attendue reçue (${response.status})`);
      logInfo(`Message: ${JSON.stringify(response.data)}`);
      return true;
    } else {
      logError(`Erreur inattendue (${response.status}): ${JSON.stringify(response.data)}`);
      return false;
    }
  } catch (error: any) {
    logError(`Erreur: ${error.message}`);
    return false;
  }
}

async function testUploadWrongFormat(productId: string, filePath: string) {
  logInfo(`\n📤 Test 6: Upload fichier non-image - ${path.basename(filePath)}`);

  if (!fs.existsSync(filePath)) {
    logError(`Fichier introuvable: ${filePath}`);
    return false;
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  try {
    const response = await makeRequest(
      'POST',
      `${API_BASE_URL}/products/${productId}/images`,
      formData,
    );

    if (response.status === 400) {
      logSuccess(`Erreur attendue reçue (${response.status})`);
      logInfo(`Message: ${JSON.stringify(response.data)}`);
      return true;
    } else {
      logError(`Erreur inattendue (${response.status}): ${JSON.stringify(response.data)}`);
      return false;
    }
  } catch (error: any) {
    logError(`Erreur: ${error.message}`);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 8) {
    logError('Usage: ts-node scripts/test-images-upload.ts <productId> <img1> <img2> <img3> <img4> <img5> <img6> [non-image-file]');
    logInfo('Exemple: ts-node scripts/test-images-upload.ts abc-123 img1.jpg img2.jpg img3.jpg img4.jpg img5.jpg img6.jpg test.txt');
    process.exit(1);
  }

  const [productId, img1, img2, img3, img4, img5, img6, nonImageFile] = args;

  log('\n' + '='.repeat(60), 'blue');
  log('🧪 Tests d\'upload d\'images produits', 'blue');
  log('='.repeat(60), 'blue');
  logInfo(`Product ID: ${productId}`);
  logInfo(`API Base URL: ${API_BASE_URL}`);

  const results: { test: string; passed: boolean }[] = [];

  // Test 1: Upload simple
  const uploadedImage = await testUploadSimple(productId, img1);
  results.push({ test: 'Upload simple', passed: uploadedImage !== null });

  if (!uploadedImage) {
    logWarning('⚠️  Impossible de continuer sans image uploadée. Vérifiez que le backend est lancé et que le productId est valide.');
    process.exit(1);
  }

  // Test 2: Suppression
  const deleted = await testDeleteImage(productId, uploadedImage.id);
  results.push({ test: 'Suppression image', passed: deleted });

  // Test 3: Upload multiple (3 images avec alts et orders)
  const multipleImages = await testUploadMultiple(
    productId,
    [img2, img3, img4],
    ['Vue face', 'Vue profil', 'Vue dos'],
    [0, 1, 2],
  );
  results.push({ test: 'Upload multiple (3 images)', passed: multipleImages !== null });

  // Test 4: Upload multiple avec ordre auto (2 images)
  const autoOrderImages = await testUploadMultipleAutoOrder(productId, [img5, img6]);
  results.push({ test: 'Upload multiple ordre auto', passed: autoOrderImages !== null });

  // Test 5: Trop de fichiers (8 fichiers)
  const tooManyFiles = await testUploadTooManyFiles(productId, [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img1,
    img2,
  ]);
  results.push({ test: 'Erreur: trop de fichiers', passed: tooManyFiles });

  // Test 6: Fichier non-image
  if (nonImageFile) {
    const wrongFormat = await testUploadWrongFormat(productId, nonImageFile);
    results.push({ test: 'Erreur: fichier non-image', passed: wrongFormat });
  } else {
    logWarning('⚠️  Test fichier non-image ignoré (fichier non fourni)');
  }

  // Résumé
  log('\n' + '='.repeat(60), 'blue');
  log('📊 Résumé des tests', 'blue');
  log('='.repeat(60), 'blue');

  results.forEach(({ test, passed }) => {
    if (passed) {
      logSuccess(`${test}: PASSÉ`);
    } else {
      logError(`${test}: ÉCHOUÉ`);
    }
  });

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;

  log(`\n${passedCount}/${totalCount} tests réussis`, passedCount === totalCount ? 'green' : 'yellow');

  process.exit(passedCount === totalCount ? 0 : 1);
}

main().catch((error) => {
  logError(`Erreur fatale: ${error.message}`);
  process.exit(1);
});

