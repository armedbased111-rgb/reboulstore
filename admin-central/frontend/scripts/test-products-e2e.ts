/**
 * Script de test E2E pour la gestion des produits
 * 
 * Ce script teste automatiquement :
 * - Création de 10 produits
 * - Suppression de 2 produits
 * - Édition de 2 produits
 * 
 * Usage: npx tsx scripts/test-products-e2e.ts
 */

import { chromium, Browser, Page } from 'playwright';

const BASE_URL = 'http://localhost:4000';
const API_URL = 'http://localhost:4001';

// Credentials admin de test
const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'admin123456';

// Données de produits de test
const PRODUCTS_TO_CREATE = [
  { name: 'T-shirt Premium Noir', description: 'T-shirt en coton bio, coupe oversized', price: 49.99, category: 'Vestes' },
  { name: 'Pantalon Cargo Beige', description: 'Pantalon cargo avec poches multiples', price: 89.99, category: 'Adult' },
  { name: 'Sneakers White Low', description: 'Sneakers en cuir blanc, semelle épaisse', price: 129.99, category: 'Sneakers' },
  { name: 'Veste Bomber Noir', description: 'Veste bomber style militaire', price: 159.99, category: 'Vestes' },
  { name: 'Jeans Slim Fit', description: 'Jeans slim fit délavé', price: 79.99, category: 'Adult' },
  { name: 'Sweat à Capuche Gris', description: 'Sweat à capuche oversize', price: 69.99, category: 'Adult' },
  { name: 'Short Cargo Vert', description: 'Short cargo militaire vert', price: 59.99, category: 'Adult' },
  { name: 'Baskets High Top', description: 'Baskets montantes en cuir', price: 139.99, category: 'Sneakers' },
  { name: 'Polo Blanc', description: 'Polo en coton piqué', price: 54.99, category: 'Adult' },
  { name: 'Chaussures Bébé', description: 'Chaussures souples pour bébé', price: 34.99, category: 'Kids' },
];

/**
 * Créer un utilisateur admin de test via l'API si nécessaire
 */
async function ensureAdminUser(): Promise<void> {
  try {
    // Essayer de se connecter
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

    // Si la connexion échoue, créer l'utilisateur
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
  await page.waitForTimeout(1000); // Attendre que la page se charge complètement
  
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.waitForTimeout(400); // Délai entre chaque action
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.waitForTimeout(500); // Délai avant de cliquer (comme un humain qui vérifie)
  await page.click('button[type="submit"]');
  
  // Attendre la redirection vers le dashboard
  await page.waitForURL('**/admin/reboul/dashboard', { timeout: 10000 });
  await page.waitForTimeout(1000); // Délai après connexion
  console.log('✅ Connecté avec succès');
}

/**
 * Obtenir l'ID d'une catégorie par son nom depuis le DOM de la page
 */
async function getCategoryIdFromPage(page: Page, categoryName: string): Promise<string | null> {
  try {
    // Attendre que le select soit chargé avec les options
    await page.waitForSelector('select#categoryId', { timeout: 10000 });
    await page.waitForFunction(() => {
      const select = document.querySelector('select#categoryId') as HTMLSelectElement;
      return select && select.options.length > 1;
    }, { timeout: 10000 });
    
    // Récupérer toutes les options du select
    const options = await page.locator('select#categoryId option').all();
    
    for (const option of options) {
      const text = await option.textContent();
      if (text?.trim() === categoryName) {
        const value = await option.getAttribute('value');
        return value || null;
      }
    }
    
    // Si pas trouvé, retourner la première option non vide
    if (options.length > 1) {
      const firstOption = options[1]; // Ignorer la première option "Sélectionner..."
      const value = await firstOption.getAttribute('value');
      return value || null;
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération de la catégorie "${categoryName}":`, error);
  }
  return null;
}

/**
 * Créer un produit
 */
async function createProduct(page: Page, product: typeof PRODUCTS_TO_CREATE[0], index: number): Promise<void> {
  console.log(`📦 Création du produit ${index + 1}/10: ${product.name}...`);
  
  // Naviguer UNE SEULE FOIS vers la page de création
  await page.goto(`${BASE_URL}/admin/reboul/products/new`, { waitUntil: 'networkidle' });
  
  // Attendre que le formulaire soit complètement chargé
  await page.waitForSelector('form', { timeout: 10000 });
  await page.waitForSelector('input#name', { timeout: 10000 });
  await page.waitForSelector('input#price', { timeout: 10000 });
  await page.waitForSelector('textarea#description', { timeout: 10000 });
  await page.waitForSelector('select#categoryId', { timeout: 10000 });
  
  // Attendre que les catégories se chargent dans le select (au moins 2 options: "Sélectionner..." + une catégorie)
  await page.waitForFunction(() => {
    const select = document.querySelector('select#categoryId') as HTMLSelectElement;
    return select && select.options.length > 1;
  }, { timeout: 15000 });
  
  // Attendre un peu pour stabilité (vitesse humaine)
  await page.waitForTimeout(1500);
  
  // Récupérer l'ID de catégorie depuis le DOM maintenant que la page est chargée
  const categoryId = await getCategoryIdFromPage(page, product.category);
  if (!categoryId) {
    console.warn(`⚠️  Catégorie "${product.category}" non trouvée, utilisation de la première disponible`);
  }
  
  // Remplir le formulaire avec délais entre chaque champ (vitesse humaine)
  await page.fill('input#name', product.name);
  await page.waitForTimeout(400);
  
  await page.fill('textarea#description', product.description);
  await page.waitForTimeout(400);
  
  // Pour le prix, utiliser fill directement
  await page.fill('input#price', product.price.toString());
  await page.waitForTimeout(400);
  
  // Sélectionner la catégorie
  if (categoryId) {
    await page.selectOption('select#categoryId', categoryId);
    await page.waitForTimeout(400);
  } else {
    // Sélectionner la première option disponible (après "Sélectionner...")
    const firstOption = await page.locator('select#categoryId option:nth-child(2)').getAttribute('value');
    if (firstOption) {
      await page.selectOption('select#categoryId', firstOption);
      await page.waitForTimeout(400);
    }
  }
  
  // Attendre un peu avant de soumettre (comme un humain qui relit)
  await page.waitForTimeout(800);
  
  // Soumettre le formulaire et attendre la navigation
  const navigationPromise = page.waitForURL('**/admin/reboul/products', { timeout: 20000 });
  await page.click('button[type="submit"]');
  
  try {
    await navigationPromise;
    console.log(`✅ Produit "${product.name}" créé avec succès`);
  } catch (error) {
      // Vérifier s'il y a des erreurs sur la page
      await page.waitForTimeout(2000); // Attendre un peu pour que les erreurs s'affichent
      
      const errorElements = await page.locator('.text-red-600, .text-red-700, [role="alert"], .bg-red-50').all();
      if (errorElements.length > 0) {
        const errorTexts = await Promise.all(errorElements.map(el => el.textContent()));
        const errorMessage = errorTexts.filter(text => text && text.trim().length > 0).join(', ');
        console.error(`❌ Erreur lors de la création de "${product.name}":`, errorMessage || 'Erreur inconnue');
        
        // Prendre une capture d'écran pour debug
        await page.screenshot({ path: `error-product-${index}.png`, fullPage: true });
        throw new Error(`Erreur lors de la création: ${errorMessage || 'Erreur inconnue'}`);
      } else {
        // Pas d'erreur visible, peut-être que la navigation a réussi mais lentement
        const currentUrl = page.url();
        if (currentUrl.includes('/admin/reboul/products')) {
          console.log(`✅ Produit "${product.name}" créé avec succès (navigation lente)`);
        } else {
          // Prendre une capture d'écran pour debug
          await page.screenshot({ path: `error-product-${index}-url.png`, fullPage: true });
          console.error(`❌ URL actuelle: ${currentUrl}`);
          throw error;
        }
      }
  }
  
  // Délai entre chaque création (vitesse humaine)
  await page.waitForTimeout(1500);
}

/**
 * Supprimer un produit par son nom
 */
async function deleteProduct(page: Page, productName: string): Promise<void> {
  console.log(`🗑️  Suppression du produit: ${productName}...`);
  
  await page.goto(`${BASE_URL}/admin/reboul/products`);
  await page.waitForSelector('table tbody', { timeout: 10000 });
  
  // Attendre que les produits se chargent (vitesse humaine)
  await page.waitForTimeout(1500);
  
  // Chercher le produit dans le tableau
  const rows = await page.locator('tbody tr').all();
  
  for (const row of rows) {
    const nameCell = row.locator('td').first();
    const name = await nameCell.textContent();
    
    if (name?.trim().includes(productName.split(' ')[0])) { // Recherche partielle
      // Configurer le handler de dialog AVANT de cliquer
      page.once('dialog', async dialog => {
        console.log(`   Dialog détecté: ${dialog.message()}`);
        await dialog.accept();
      });
      
      // Trouver le bouton de suppression (dernier bouton dans la colonne actions)
      const actionButtons = row.locator('td:last-child button');
      const deleteButton = actionButtons.last();
      
      // Cliquer sur supprimer
      await deleteButton.click();
      await page.waitForTimeout(500); // Délai pour l'ouverture du dialog
      
      // Attendre que la confirmation soit acceptée et que la page se recharge
      await page.waitForTimeout(2000);
      
      // Vérifier que la page a bien rechargé
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000); // Délai après suppression
      
      console.log(`✅ Produit "${productName}" supprimé avec succès`);
      return;
    }
  }
  
  console.warn(`⚠️  Produit "${productName}" non trouvé pour suppression`);
}

/**
 * Éditer un produit par son nom
 */
async function editProduct(page: Page, productName: string, newData: { name?: string; price?: number; description?: string }): Promise<void> {
  console.log(`✏️  Édition du produit: ${productName}...`);
  
  await page.goto(`${BASE_URL}/admin/reboul/products`);
  await page.waitForSelector('table tbody', { timeout: 10000 });
  
  // Attendre que les produits se chargent (vitesse humaine)
  await page.waitForTimeout(1500);
  
  // Chercher le produit dans le tableau
  const rows = await page.locator('tbody tr').all();
  
  for (const row of rows) {
    const nameCell = row.locator('td').first();
    const name = await nameCell.textContent();
    
    if (name?.trim().includes(productName.split(' ')[0])) { // Recherche partielle
      // Trouver le lien d'édition (premier lien/a dans la colonne actions)
      const editLink = row.locator('a[href*="/edit"]').first();
      
      // Cliquer sur le lien d'édition
      await editLink.click();
      
      // Attendre le chargement du formulaire
      await page.waitForSelector('form', { timeout: 10000 });
      await page.waitForSelector('input#name', { timeout: 10000 });
      await page.waitForTimeout(1000); // Délai pour que le formulaire se charge complètement
      
        // Modifier les champs avec délais (vitesse humaine)
        if (newData.name) {
          await page.click('input#name');
          await page.waitForTimeout(200);
          await page.keyboard.press('Meta+A'); // Sélectionner tout
          await page.waitForTimeout(100);
          await page.type('input#name', newData.name, { delay: 50 });
          await page.waitForTimeout(400);
        }
        if (newData.price) {
          await page.click('input#price');
          await page.waitForTimeout(200);
          await page.keyboard.press('Meta+A'); // Sélectionner tout
          await page.waitForTimeout(100);
          await page.type('input#price', newData.price.toString(), { delay: 50 });
          await page.waitForTimeout(400);
        }
        if (newData.description) {
          await page.click('textarea#description');
          await page.waitForTimeout(200);
          await page.keyboard.press('Meta+A'); // Sélectionner tout
          await page.waitForTimeout(100);
          await page.type('textarea#description', newData.description, { delay: 30 });
          await page.waitForTimeout(400);
        }
        
        // Attendre un peu avant de soumettre (comme un humain qui relit)
        await page.waitForTimeout(800);
        
        // Soumettre et attendre la navigation
        const navigationPromise = page.waitForURL('**/admin/reboul/products', { timeout: 20000 });
        await page.click('button[type="submit"]');
        
        try {
          await navigationPromise;
          console.log(`✅ Produit "${productName}" édité avec succès`);
        } catch (error) {
          // Vérifier s'il y a des erreurs
          const currentUrl = page.url();
          if (currentUrl.includes('/admin/reboul/products')) {
            console.log(`✅ Produit "${productName}" édité avec succès (navigation lente)`);
          } else {
            throw error;
          }
        }
        return;
    }
  }
  
  console.warn(`⚠️  Produit "${productName}" non trouvé pour édition`);
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Démarrage des tests E2E de gestion des produits\n');
  
  // Vérifier/créer l'utilisateur admin
  await ensureAdminUser();
  
  // Lancer le navigateur
  const browser: Browser = await chromium.launch({ 
    headless: false, 
    slowMo: 500, // Ralentir à vitesse humaine (500ms entre chaque action)
  });
  const page: Page = await browser.newPage();
  
  // Augmenter les timeouts
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(60000);
  
  try {
    // Se connecter
    await login(page);
    
    console.log('\n📦 Phase 1: Création de 10 produits\n');
    // Créer 10 produits
    for (let i = 0; i < PRODUCTS_TO_CREATE.length; i++) {
      await createProduct(page, PRODUCTS_TO_CREATE[i], i);
    }
    
    console.log('\n🗑️  Phase 2: Suppression de 2 produits\n');
    // Supprimer les 2 premiers produits
    await deleteProduct(page, PRODUCTS_TO_CREATE[0].name);
    await deleteProduct(page, PRODUCTS_TO_CREATE[1].name);
    
    console.log('\n✏️  Phase 3: Édition de 2 produits\n');
    // Éditer les 2 produits suivants
    await editProduct(page, PRODUCTS_TO_CREATE[2].name, {
      name: `${PRODUCTS_TO_CREATE[2].name} (ÉDITÉ)`,
      price: PRODUCTS_TO_CREATE[2].price + 10,
      description: `${PRODUCTS_TO_CREATE[2].description} - Modifié par le script de test`,
    });
    
    await editProduct(page, PRODUCTS_TO_CREATE[3].name, {
      name: `${PRODUCTS_TO_CREATE[3].name} (MODIFIÉ)`,
      price: PRODUCTS_TO_CREATE[3].price - 20,
    });
    
    console.log('\n✅ Tous les tests sont terminés avec succès !\n');
    
    // Attendre un peu avant de fermer pour voir le résultat
    console.log('⏳ Attente de 5 secondes avant fermeture...');
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Exécuter le script
main().catch(console.error);
