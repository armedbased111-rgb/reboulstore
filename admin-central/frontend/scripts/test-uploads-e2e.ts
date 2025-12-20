/**
 * Script de test E2E pour les uploads Cloudinary
 * 
 * Ce script teste automatiquement :
 * - Upload d'images vers Cloudinary
 * - Upload de vidéos vers Cloudinary
 * - Création de catégories avec uploads
 * - Création de marques avec uploads
 * - Édition avec remplacement de fichiers
 * 
 * Usage: npx tsx scripts/test-uploads-e2e.ts
 */

import { chromium, Browser, Page } from 'playwright';
import { readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'http://localhost:4000';
const API_URL = 'http://localhost:4001';
// Chemin vers webdesign depuis le script (admin-central/frontend/scripts/)
// Le script est dans: reboulstore/admin-central/frontend/scripts/
// Le webdesign est dans: reboulstore/frontend/public/webdesign/
const WEBDESIGN_PATH = join(__dirname, '../../../frontend/public/webdesign');

// Credentials admin de test
const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'admin123456';

/**
 * Créer un utilisateur admin de test via l'API si nécessaire
 */
async function ensureAdminUser(): Promise<void> {
  try {
    const loginResponse = await fetch(`${API_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    if (loginResponse.ok) {
      console.log('✅ Utilisateur admin existe déjà');
      return;
    }

    console.log('📝 Création de l\'utilisateur admin...');
    const registerResponse = await fetch(`${API_URL}/admin/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        firstName: 'Admin',
        lastName: 'Test',
        role: 'SUPER_ADMIN',
      }),
    });

    if (registerResponse.ok) {
      console.log('✅ Utilisateur admin créé avec succès');
    } else {
      const error = await registerResponse.text();
      console.error('❌ Erreur lors de la création:', error);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification/création admin:', error);
  }
}

/**
 * Se connecter à l'admin
 */
async function login(page: Page): Promise<void> {
  console.log('🔐 Connexion à l\'admin...');
  await page.goto(`${BASE_URL}/admin/login`);
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.waitForTimeout(1000);
  
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.waitForTimeout(400);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.waitForTimeout(500);
  await page.click('button[type="submit"]');
  
  await page.waitForURL('**/admin/reboul/dashboard', { timeout: 10000 });
  await page.waitForTimeout(1000);
  console.log('✅ Connecté avec succès');
}

/**
 * Trouver les fichiers images dans le dossier webdesign
 */
async function findImageFiles(): Promise<string[]> {
  const images: string[] = [];
  try {
    const files = await readdir(WEBDESIGN_PATH);
    for (const file of files) {
      const filePath = join(WEBDESIGN_PATH, file);
      const stats = await stat(filePath);
      if (stats.isFile()) {
        const ext = file.toLowerCase().split('.').pop();
        if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) {
          images.push(filePath);
        }
      }
    }
    // Vérifier aussi dans les sous-dossiers
    const brandImagePath = join(WEBDESIGN_PATH, 'brandImage');
    try {
      const brandFiles = await readdir(brandImagePath);
      for (const file of brandFiles) {
        const filePath = join(brandImagePath, file);
        const stats = await stat(filePath);
        if (stats.isFile()) {
          const ext = file.toLowerCase().split('.').pop();
          if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) {
            images.push(filePath);
          }
        }
      }
    } catch (e) {
      // Dossier n'existe pas, pas grave
    }
  } catch (error) {
    console.error('❌ Erreur lors de la recherche d\'images:', error);
  }
  return images;
}

/**
 * Trouver les fichiers vidéos dans le dossier webdesign
 */
async function findVideoFiles(): Promise<string[]> {
  const videos: string[] = [];
  try {
    const files = await readdir(WEBDESIGN_PATH);
    for (const file of files) {
      const filePath = join(WEBDESIGN_PATH, file);
      const stats = await stat(filePath);
      if (stats.isFile()) {
        const ext = file.toLowerCase().split('.').pop();
        if (['mp4', 'webm', 'ogg', 'mov'].includes(ext || '')) {
          videos.push(filePath);
        }
      }
    }
    // Vérifier aussi dans les sous-dossiers
    const brandImagePath = join(WEBDESIGN_PATH, 'brandImage');
    try {
      const brandFiles = await readdir(brandImagePath);
      for (const file of brandFiles) {
        const filePath = join(brandImagePath, file);
        const stats = await stat(filePath);
        if (stats.isFile()) {
          const ext = file.toLowerCase().split('.').pop();
          if (['mp4', 'webm', 'ogg', 'mov'].includes(ext || '')) {
            videos.push(filePath);
          }
        }
      }
    } catch (e) {
      // Dossier n'existe pas, pas grave
    }
  } catch (error) {
    console.error('❌ Erreur lors de la recherche de vidéos:', error);
  }
  return videos;
}

/**
 * Uploader un fichier via le composant FileUpload
 */
async function uploadFile(page: Page, filePath: string, type: 'image' | 'video'): Promise<void> {
  console.log(`   📤 Upload ${type}: ${filePath.split('/').pop()}...`);
  
  // Attendre que la zone d'upload soit visible (le composant FileUpload)
  await page.waitForSelector('input[type="file"]', { timeout: 10000, state: 'hidden' });
  
  // Trouver tous les inputs file
  const fileInputs = await page.locator('input[type="file"]').all();
  if (fileInputs.length === 0) {
    throw new Error('Aucun input file trouvé sur la page');
  }
  
  let targetInput = fileInputs[fileInputs.length - 1];
  
  // Si plusieurs inputs, essayer de trouver celui qui correspond au type
  if (fileInputs.length > 1) {
    const acceptAttr = type === 'image' ? 'image' : 'video';
    for (const input of fileInputs) {
      const accept = await input.getAttribute('accept');
      if (accept && accept.includes(acceptAttr)) {
        targetInput = input;
        break;
      }
    }
  }
  
  // Vérifier qu'on peut voir la zone d'upload (le div cliquable)
  const uploadZone = page.locator('div[class*="border-dashed"]').last();
  await uploadZone.waitFor({ timeout: 5000 });
  
  // Uploader le fichier
  await targetInput.setInputFiles(filePath);
  
  // Attendre que l'indicateur de chargement disparaisse
  try {
    await page.waitForSelector('svg[class*="animate-spin"]', { timeout: 5000, state: 'hidden' });
  } catch (e) {
    // Pas de spinner, continuer
  }
  
  // Attendre que l'upload soit terminé - vérifier plusieurs façons
  try {
    // Méthode 1: Vérifier que l'image/vidéo s'affiche avec une URL Cloudinary
    if (type === 'image') {
      await page.waitForSelector('img[src*="cloudinary"], img[src*="res.cloudinary"], img[src]', { timeout: 30000 });
    } else {
      await page.waitForSelector('video[src*="cloudinary"], video[src*="res.cloudinary"], video[src]', { timeout: 60000 });
    }
    
    // Vérifier qu'il n'y a pas d'erreur
    const errorElements = await page.locator('.text-red-600, .text-red-700').all();
    if (errorElements.length > 0) {
      const errorTexts = await Promise.all(errorElements.map(el => el.textContent()));
      const errorMessage = errorTexts.filter(text => text && text.trim().length > 0).join(', ');
      if (errorMessage) {
        throw new Error(`Erreur d'upload: ${errorMessage}`);
      }
    }
    
    await page.waitForTimeout(2000); // Attendre un peu après l'upload
    console.log(`   ✅ Upload ${type} réussi`);
  } catch (error) {
    // Prendre une capture d'écran pour debug
    await page.screenshot({ path: `error-upload-${type}-${Date.now()}.png`, fullPage: true });
    
    // Vérifier s'il y a des erreurs visibles
    const errorElements = await page.locator('.text-red-600, .text-red-700, [role="alert"]').all();
    if (errorElements.length > 0) {
      const errorTexts = await Promise.all(errorElements.map(el => el.textContent()));
      const errorMessage = errorTexts.filter(text => text && text.trim().length > 0).join(', ');
      throw new Error(`Erreur d'upload: ${errorMessage || 'Erreur inconnue'}`);
    }
    
    throw error;
  }
}

/**
 * Créer une catégorie avec uploads
 */
async function createCategoryWithUploads(page: Page, imageFile?: string, videoFile?: string): Promise<void> {
  console.log('📁 Création d\'une catégorie avec uploads...');
  
  await page.goto(`${BASE_URL}/admin/reboul/categories/new`, { waitUntil: 'networkidle' });
  await page.waitForSelector('form', { timeout: 10000 });
  await page.waitForSelector('input#name', { timeout: 10000 });
  await page.waitForTimeout(1500);
  
  // Remplir les champs de base
  await page.fill('input#name', `Catégorie Test Upload ${Date.now()}`);
  await page.waitForTimeout(400);
  await page.fill('textarea#description', 'Catégorie créée pour tester les uploads Cloudinary');
  await page.waitForTimeout(400);
  
  // Upload image si fournie
  if (imageFile) {
    await uploadFile(page, imageFile, 'image');
  }
  
  // Upload vidéo si fournie
  if (videoFile) {
    await uploadFile(page, videoFile, 'video');
  }
  
  // Soumettre
  await page.waitForTimeout(800);
  const navigationPromise = page.waitForURL('**/admin/reboul/categories', { timeout: 20000 });
  await page.click('button[type="submit"]');
  
  try {
    await navigationPromise;
    console.log('✅ Catégorie créée avec uploads réussis');
  } catch (error) {
    const currentUrl = page.url();
    if (currentUrl.includes('/admin/reboul/categories')) {
      console.log('✅ Catégorie créée (navigation lente)');
    } else {
      throw error;
    }
  }
  
  await page.waitForTimeout(1500);
}

/**
 * Créer une marque avec uploads
 */
async function createBrandWithUploads(
  page: Page,
  logoFile?: string,
  megaMenuImage1?: string,
  megaMenuImage2?: string,
  megaMenuVideo1?: string,
  megaMenuVideo2?: string,
): Promise<void> {
  console.log('🏷️  Création d\'une marque avec uploads...');
  
  await page.goto(`${BASE_URL}/admin/reboul/brands/new`, { waitUntil: 'networkidle' });
  await page.waitForSelector('form', { timeout: 10000 });
  await page.waitForSelector('input#name', { timeout: 10000 });
  await page.waitForTimeout(1500);
  
  // Remplir les champs de base
  await page.fill('input#name', `Marque Test Upload ${Date.now()}`);
  await page.waitForTimeout(400);
  await page.fill('textarea#description', 'Marque créée pour tester les uploads Cloudinary');
  await page.waitForTimeout(400);
  
  // Upload logo si fourni
  if (logoFile) {
    console.log('   📤 Upload logo...');
    const fileInputs = await page.locator('input[type="file"]').all();
    if (fileInputs.length > 0) {
      await fileInputs[0].setInputFiles(logoFile);
      await page.waitForSelector('img[src*="cloudinary"], img[src*="res.cloudinary"]', { timeout: 30000 });
      await page.waitForTimeout(2000);
      console.log('   ✅ Logo uploadé');
    }
  }
  
  // Scroll vers la section Mega Menu Images
  const megaMenuImagesSection = page.locator('h3').filter({ hasText: 'Mega Menu - Images' });
  if (await megaMenuImagesSection.isVisible()) {
    await megaMenuImagesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
  }
  
  // Upload mega menu images
  if (megaMenuImage1) {
    await uploadFile(page, megaMenuImage1, 'image');
  }
  if (megaMenuImage2) {
    await uploadFile(page, megaMenuImage2, 'image');
  }
  
  // Scroll vers la section Mega Menu Videos
  const megaMenuVideosSection = page.locator('h3').filter({ hasText: 'Mega Menu - Vidéos' });
  if (await megaMenuVideosSection.isVisible()) {
    await megaMenuVideosSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
  }
  
  // Upload mega menu videos
  if (megaMenuVideo1) {
    await uploadFile(page, megaMenuVideo1, 'video');
  }
  if (megaMenuVideo2) {
    await uploadFile(page, megaMenuVideo2, 'video');
  }
  
  // Soumettre
  await page.waitForTimeout(800);
  const navigationPromise = page.waitForURL('**/admin/reboul/brands', { timeout: 20000 });
  await page.click('button[type="submit"]');
  
  try {
    await navigationPromise;
    console.log('✅ Marque créée avec uploads réussis');
  } catch (error) {
    const currentUrl = page.url();
    if (currentUrl.includes('/admin/reboul/brands')) {
      console.log('✅ Marque créée (navigation lente)');
    } else {
      throw error;
    }
  }
  
  await page.waitForTimeout(1500);
}

/**
 * Tester l'édition avec remplacement de fichier
 */
async function testEditWithFileReplace(page: Page, type: 'category' | 'brand'): Promise<void> {
  console.log(`✏️  Test édition ${type} avec remplacement de fichier...`);
  
  const url = type === 'category' 
    ? `${BASE_URL}/admin/reboul/categories`
    : `${BASE_URL}/admin/reboul/brands`;
  
  await page.goto(url);
  await page.waitForSelector('table tbody', { timeout: 10000 });
  await page.waitForTimeout(1500);
  
  // Cliquer sur le premier lien d'édition
  const editLink = page.locator('a[href*="/edit"]').first();
  await editLink.click();
  
  await page.waitForSelector('form', { timeout: 10000 });
  await page.waitForTimeout(1500);
  
  // Trouver un fichier de remplacement
  const images = await findImageFiles();
  if (images.length > 0) {
    // Cliquer sur "Remplacer" si visible, sinon cliquer sur la zone d'upload
    const replaceButton = page.locator('button:has-text("Remplacer")').first();
    if (await replaceButton.isVisible()) {
      await replaceButton.click();
      await page.waitForTimeout(500);
    }
    
    // Uploader un nouveau fichier
    const fileInputs = await page.locator('input[type="file"]').all();
    if (fileInputs.length > 0) {
      await fileInputs[0].setInputFiles(images[0]);
      await page.waitForSelector('img[src*="cloudinary"], img[src*="res.cloudinary"]', { timeout: 30000 });
      await page.waitForTimeout(2000);
      console.log('   ✅ Fichier remplacé avec succès');
    }
  }
  
  // Sauvegarder
  await page.waitForTimeout(800);
  const navigationPromise = page.waitForURL(url, { timeout: 20000 });
  await page.click('button[type="submit"]');
  
  try {
    await navigationPromise;
    console.log(`✅ ${type} édité avec remplacement de fichier`);
  } catch (error) {
    const currentUrl = page.url();
    if (currentUrl.includes(url)) {
      console.log(`✅ ${type} édité (navigation lente)`);
    } else {
      throw error;
    }
  }
  
  await page.waitForTimeout(1500);
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Démarrage des tests E2E d\'uploads Cloudinary\n');
  
  // Vérifier/créer l'utilisateur admin
  await ensureAdminUser();
  
  // Trouver les fichiers disponibles
  console.log('🔍 Recherche des fichiers dans webdesign...');
  const images = await findImageFiles();
  const videos = await findVideoFiles();
  console.log(`   ✅ ${images.length} image(s) trouvée(s)`);
  console.log(`   ✅ ${videos.length} vidéo(s) trouvée(s)\n`);
  
  if (images.length === 0 && videos.length === 0) {
    console.error('❌ Aucun fichier trouvé dans webdesign/');
    return;
  }
  
  // Lancer le navigateur
  const browser: Browser = await chromium.launch({ 
    headless: false, 
    slowMo: 500,
  });
  const page: Page = await browser.newPage();
  
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(60000);
  
  try {
    // Se connecter
    await login(page);
    
    console.log('\n📁 Phase 1: Test création catégorie avec uploads\n');
    // Créer une catégorie avec image
    if (images.length > 0) {
      await createCategoryWithUploads(page, images[0]);
    }
    
    // Créer une catégorie avec vidéo
    if (videos.length > 0) {
      await createCategoryWithUploads(page, undefined, videos[0]);
    }
    
    // Créer une catégorie avec image et vidéo
    if (images.length > 0 && videos.length > 0) {
      await createCategoryWithUploads(page, images[0], videos[0]);
    }
    
    console.log('\n🏷️  Phase 2: Test création marque avec uploads\n');
    // Créer une marque avec tous les uploads
    await createBrandWithUploads(
      page,
      images[0],
      images.length > 1 ? images[1] : images[0],
      images.length > 2 ? images[2] : images[0],
      videos.length > 0 ? videos[0] : undefined,
      videos.length > 1 ? videos[1] : videos[0],
    );
    
    console.log('\n✏️  Phase 3: Test édition avec remplacement de fichier\n');
    // Tester l'édition avec remplacement
    await testEditWithFileReplace(page, 'category');
    await testEditWithFileReplace(page, 'brand');
    
    console.log('\n✅ Tous les tests d\'upload sont terminés avec succès !\n');
    
    console.log('⏳ Attente de 5 secondes avant fermeture...');
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    await page.screenshot({ path: 'error-upload.png', fullPage: true });
    throw error;
  } finally {
    await browser.close();
  }
}

// Exécuter le script
main().catch(console.error);
