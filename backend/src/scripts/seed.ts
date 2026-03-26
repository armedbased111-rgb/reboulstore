import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { Image } from '../entities/image.entity';
import { Variant } from '../entities/variant.entity';
import { Brand } from '../entities/brand.entity';
import { Shop } from '../entities/shop.entity';
import { Collection } from '../entities/collection.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Script de seed pour créer des données de test
 *
 * Ce script crée :
 * - Des catégories (Adult, Kids, Sneakers)
 * - Des produits avec images et variantes
 *
 * Pour l'exécuter :
 * npm run seed
 * ou
 * ts-node src/scripts/seed.ts
 */

// IMPORTANT: Ne PAS charger de fichier .env ici
// Le script utilise UNIQUEMENT les variables d'environnement déjà chargées
// par docker-compose depuis .env.production à la racine du projet
// Les variables sont disponibles via process.env

// Afficher la configuration utilisée (sans le mot de passe)
console.log('📋 Configuration base de données (depuis .env.production):');
console.log(`   DB_HOST: ${process.env.DB_HOST || 'NON DÉFINI'}`);
console.log(`   DB_PORT: ${process.env.DB_PORT || 'NON DÉFINI'}`);
console.log(`   DB_DATABASE: ${process.env.DB_DATABASE || 'NON DÉFINI'}`);
console.log(`   DB_USERNAME: ${process.env.DB_USERNAME || 'NON DÉFINI'}`);
if (
  !process.env.DB_HOST ||
  process.env.DB_HOST === 'postgres' ||
  process.env.DB_HOST === 'localhost'
) {
  console.error(
    '   ⚠️  ATTENTION: DB_HOST pointe vers localhost/postgres au lieu du VPS!',
  );
  console.error(
    "   ⚠️  Vérifiez votre fichier .env.production - il doit contenir l'adresse du VPS",
  );
}

async function seed() {
  // UTILISER UNIQUEMENT LES VARIABLES D'ENVIRONNEMENT DU .env (VPS)
  // Ne jamais utiliser localhost ou détection automatique
  const dbHost = process.env.DB_HOST;
  const dbPort = process.env.DB_PORT || '5432';
  const dbUsername = process.env.DB_USERNAME;
  const dbPassword = process.env.DB_PASSWORD;
  const dbDatabase = process.env.DB_DATABASE;

  // Vérifier que toutes les variables sont définies
  if (!dbHost || !dbUsername || !dbPassword || !dbDatabase) {
    console.error(
      "❌ Variables d'environnement manquantes pour la connexion à la base de données",
    );
    console.error(
      '   Variables requises: DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE',
    );
    console.error('   Vérifiez votre fichier .env');
    process.exit(1);
  }

  // Configuration de la connexion à la base de données (compatible TypeORM)
  const dataSource = new DataSource({
    type: 'postgres',
    host: dbHost, // Utilise directement DB_HOST du .env (VPS)
    port: parseInt(dbPort, 10),
    username: dbUsername,
    password: dbPassword,
    database: dbDatabase,
    entities: [Category, Product, Image, Variant, Brand, Shop, Collection],
    synchronize: false, // Ne pas synchroniser automatiquement dans le seed
    logging: process.env.NODE_ENV === 'development',
  });

  console.log(`🔌 Connexion à PostgreSQL: ${dbHost}:${dbPort}/${dbDatabase}`);
  console.log(
    `   📍 Utilisation de la base de données du serveur VPS (pas de localhost)`,
  );

  try {
    await dataSource.initialize();
    console.log('✅ Connexion à la base de données établie');

    const categoryRepository = dataSource.getRepository(Category);
    const productRepository = dataSource.getRepository(Product);
    const imageRepository = dataSource.getRepository(Image);
    const variantRepository = dataSource.getRepository(Variant);
    const brandRepository = dataSource.getRepository(Brand);
    const collectionRepository = dataSource.getRepository(Collection);

    // 1. Créer ou récupérer les catégories
    console.log('📦 Création des catégories...');

    const categoriesData = [
      { name: 'Adult', slug: 'adult', description: 'Vêtements pour adultes' },
      { name: 'Kids', slug: 'kids', description: 'Vêtements pour enfants' },
      {
        name: 'Sneakers',
        slug: 'sneakers',
        description: 'Chaussures de sport',
      },
    ];

    const categories: Category[] = [];
    for (const catData of categoriesData) {
      let category = await categoryRepository.findOne({
        where: { slug: catData.slug },
      });
      if (!category) {
        category = categoryRepository.create(catData);
        category = await categoryRepository.save(category);
        console.log(`  ✓ Catégorie créée: ${category.name}`);
      } else {
        console.log(`  → Catégorie existante: ${category.name}`);
      }
      categories.push(category);
    }

    // 2. Trouver ou créer une collection active
    console.log('\n📚 Vérification de la collection active...');
    let activeCollection = await collectionRepository.findOne({
      where: { isActive: true },
    });

    if (!activeCollection) {
      // Créer une collection active par défaut
      activeCollection = collectionRepository.create({
        name: 'current',
        displayName: 'Collection Actuelle',
        isActive: true,
        description: 'Collection active par défaut',
      });
      activeCollection = await collectionRepository.save(activeCollection);
      console.log(`  ✓ Collection active créée: ${activeCollection.name}`);
    } else {
      console.log(`  → Collection active existante: ${activeCollection.name}`);
    }

    // 3. Créer des produits de test
    console.log('\n🛍️  Création des produits...');

    const productsData = [
      {
        name: 'HOODIE BLACK',
        description:
          'Hoodie premium en coton noir, coupe oversize, style streetwear',
        price: 89.99,
        categorySlug: 'adult',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop',
            alt: 'Hoodie Black - Vue avant',
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop',
            alt: 'Hoodie Black - Vue dos',
            order: 1,
          },
        ],
        variants: [
          { color: 'Black', size: 'S', stock: 15, sku: 'HOOD-BLK-S' },
          { color: 'Black', size: 'M', stock: 20, sku: 'HOOD-BLK-M' },
          { color: 'Black', size: 'L', stock: 18, sku: 'HOOD-BLK-L' },
          { color: 'Black', size: 'XL', stock: 12, sku: 'HOOD-BLK-XL' },
        ],
      },
      {
        name: 'T-SHIRT WHITE',
        description: 'T-shirt basique en coton bio, coupe classique, col rond',
        price: 29.99,
        categorySlug: 'adult',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop',
            alt: 'T-Shirt White - Vue avant',
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop',
            alt: 'T-Shirt White - Vue dos',
            order: 1,
          },
        ],
        variants: [
          { color: 'White', size: 'S', stock: 25, sku: 'TSH-WHT-S' },
          { color: 'White', size: 'M', stock: 30, sku: 'TSH-WHT-M' },
          { color: 'White', size: 'L', stock: 28, sku: 'TSH-WHT-L' },
        ],
      },
      {
        name: 'SNEAKERS CLASSIC',
        description:
          'Sneakers classiques en cuir, semelle confortable, style minimaliste',
        price: 129.99,
        categorySlug: 'sneakers',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop',
            alt: 'Sneakers Classic - Vue de face',
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop',
            alt: 'Sneakers Classic - Vue de profil',
            order: 1,
          },
        ],
        variants: [
          { color: 'White', size: '40', stock: 10, sku: 'SNK-WHT-40' },
          { color: 'White', size: '41', stock: 12, sku: 'SNK-WHT-41' },
          { color: 'White', size: '42', stock: 15, sku: 'SNK-WHT-42' },
          { color: 'White', size: '43', stock: 8, sku: 'SNK-WHT-43' },
        ],
      },
      {
        name: 'JACKET NAVY',
        description: 'Veste en coton navy, coupe oversize, style militaire',
        price: 149.99,
        categorySlug: 'adult',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop',
            alt: 'Jacket Navy - Vue avant',
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop',
            alt: 'Jacket Navy - Vue dos',
            order: 1,
          },
        ],
        variants: [
          { color: 'Navy', size: 'M', stock: 8, sku: 'JKT-NVY-M' },
          { color: 'Navy', size: 'L', stock: 10, sku: 'JKT-NVY-L' },
          { color: 'Navy', size: 'XL', stock: 6, sku: 'JKT-NVY-XL' },
        ],
      },
      {
        name: 'PANTS CARGO',
        description: 'Pantalon cargo en coton, poches multiples, coupe large',
        price: 79.99,
        categorySlug: 'adult',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1506629905607-3e0c82e5e0a1?w=800&h=1000&fit=crop',
            alt: 'Pants Cargo - Vue avant',
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1506629905607-3e0c82e5e0a1?w=800&h=1000&fit=crop',
            alt: 'Pants Cargo - Vue dos',
            order: 1,
          },
        ],
        variants: [
          { color: 'Olive', size: 'S', stock: 12, sku: 'PNT-OLV-S' },
          { color: 'Olive', size: 'M', stock: 15, sku: 'PNT-OLV-M' },
          { color: 'Olive', size: 'L', stock: 14, sku: 'PNT-OLV-L' },
        ],
      },
      {
        name: 'KIDS HOODIE',
        description: 'Hoodie pour enfants, coton doux, coupe confortable',
        price: 49.99,
        categorySlug: 'kids',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop',
            alt: 'Kids Hoodie - Vue avant',
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop',
            alt: 'Kids Hoodie - Vue dos',
            order: 1,
          },
        ],
        variants: [
          { color: 'Gray', size: '6Y', stock: 10, sku: 'KHD-GRY-6Y' },
          { color: 'Gray', size: '8Y', stock: 12, sku: 'KHD-GRY-8Y' },
          { color: 'Gray', size: '10Y', stock: 8, sku: 'KHD-GRY-10Y' },
        ],
      },
      {
        name: 'SNEAKERS RUNNING',
        description:
          'Sneakers de running, légères et respirantes, semelle amortissante',
        price: 99.99,
        categorySlug: 'sneakers',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop',
            alt: 'Sneakers Running - Vue de face',
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop',
            alt: 'Sneakers Running - Vue de profil',
            order: 1,
          },
        ],
        variants: [
          { color: 'Black', size: '40', stock: 9, sku: 'SNK-RUN-BLK-40' },
          { color: 'Black', size: '41', stock: 11, sku: 'SNK-RUN-BLK-41' },
          { color: 'Black', size: '42', stock: 13, sku: 'SNK-RUN-BLK-42' },
        ],
      },
      {
        name: 'SWEATSHIRT CREAM',
        description:
          'Sweatshirt en coton crème, coupe oversize, style minimaliste',
        price: 69.99,
        categorySlug: 'adult',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop',
            alt: 'Sweatshirt Cream - Vue avant',
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop',
            alt: 'Sweatshirt Cream - Vue dos',
            order: 1,
          },
        ],
        variants: [
          { color: 'Cream', size: 'S', stock: 14, sku: 'SWT-CRM-S' },
          { color: 'Cream', size: 'M', stock: 16, sku: 'SWT-CRM-M' },
          { color: 'Cream', size: 'L', stock: 18, sku: 'SWT-CRM-L' },
        ],
      },
    ];

    for (const productData of productsData) {
      // Vérifier si le produit existe déjà
      const existingProduct = await productRepository.findOne({
        where: { name: productData.name },
      });

      if (existingProduct) {
        console.log(`  → Produit existant: ${productData.name}`);
        continue;
      }

      // Trouver la catégorie
      const category = categories.find(
        (c) => c.slug === productData.categorySlug,
      );
      if (!category) {
        console.log(`  ✗ Catégorie non trouvée: ${productData.categorySlug}`);
        continue;
      }

      // Créer le produit
      const product = productRepository.create({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        categoryId: category.id,
      });

      const savedProduct = await productRepository.save(product);
      console.log(`  ✓ Produit créé: ${savedProduct.name}`);

      // Créer les images
      for (const imageData of productData.images) {
        const image = imageRepository.create({
          productId: savedProduct.id,
          url: imageData.url,
          alt: imageData.alt,
          order: imageData.order,
        });
        await imageRepository.save(image);
      }
      console.log(`    → ${productData.images.length} image(s) ajoutée(s)`);

      // Créer les variantes
      for (const variantData of productData.variants) {
        const variant = variantRepository.create({
          productId: savedProduct.id,
          color: variantData.color,
          size: variantData.size,
          stock: variantData.stock,
          sku: variantData.sku,
        });
        await variantRepository.save(variant);
      }
      console.log(
        `    → ${productData.variants.length} variante(s) ajoutée(s)`,
      );
    }

    // 3. Créer 1 produit pour CHAQUE marque avec la même image
    console.log(
      "\n🏷️  Création d'un produit pour chaque marque (même image)...",
    );

    const brands = await brandRepository.find({
      order: { name: 'ASC' },
    });

    if (brands.length === 0) {
      console.log("  ⚠️  Aucune marque trouvée. Créez d'abord des marques.");
    } else {
      const defaultCategory =
        categories.find((c) => c.slug === 'adult') || categories[0];

      if (!defaultCategory) {
        console.log(
          "  ⚠️  Aucune catégorie trouvée. Créez d'abord des catégories.",
        );
      } else {
        // Lire l'URL de l'image depuis le fichier seed-image-url.txt ou utiliser une variable d'environnement
        let productImageUrl: string | null = null;

        // Essayer de lire depuis le fichier (plusieurs chemins possibles)
        const possiblePaths = [
          path.join(__dirname, '..', '..', 'scripts', 'seed-image-url.txt'), // Depuis src/scripts vers backend/scripts
          path.join(__dirname, '..', 'scripts', 'seed-image-url.txt'), // Depuis src/scripts vers backend/src/scripts
          path.join(process.cwd(), 'scripts', 'seed-image-url.txt'), // Depuis la racine backend
        ];

        for (const imageUrlPath of possiblePaths) {
          if (fs.existsSync(imageUrlPath)) {
            productImageUrl = fs.readFileSync(imageUrlPath, 'utf-8').trim();
            console.log(`  📷 Image trouvée: ${productImageUrl}`);
            break;
          }
        }

        // Si pas trouvé dans les fichiers, essayer depuis la variable d'environnement
        if (!productImageUrl) {
          productImageUrl = process.env.SEED_PRODUCT_IMAGE_URL || null;
          if (productImageUrl) {
            console.log(
              `  📷 Image depuis variable d'environnement: ${productImageUrl}`,
            );
          } else {
            console.log(
              '  ⚠️  Aucune image trouvée. Utilisez npm run upload-seed-image pour uploader une image.',
            );
            console.log('  ⚠️  Ou définissez SEED_PRODUCT_IMAGE_URL dans .env');
          }
        }

        // Type de produit par défaut - MÊME NOM POUR TOUTES LES MARQUES
        const defaultProductType = {
          name: 'HOODIE',
          basePrice: 89.99,
          color: 'Black',
        };

        const productName = `${defaultProductType.name} ${defaultProductType.color}`; // Même nom pour toutes les marques

        // Supprimer tous les anciens produits "HOODIE Black" pour toutes les marques
        console.log('  🗑️  Suppression des anciens produits "HOODIE Black"...');
        const oldProducts = await productRepository.find({
          where: { name: productName },
          relations: ['images', 'variants'],
        });

        for (const oldProduct of oldProducts) {
          // Supprimer les images
          await imageRepository.delete({ productId: oldProduct.id });
          // Supprimer les variantes
          await variantRepository.delete({ productId: oldProduct.id });
          // Supprimer le produit
          await productRepository.remove(oldProduct);
        }
        console.log(
          `    → ${oldProducts.length} ancien(s) produit(s) supprimé(s)`,
        );

        for (const brand of brands) {
          console.log(`\n  📦 Marque: ${brand.name}`);

          // Créer le produit pour cette marque (on a déjà supprimé les anciens)
          const product = productRepository.create({
            name: productName, // Même nom pour toutes les marques
            description: `${defaultProductType.name} premium, qualité supérieure, style streetwear`,
            price: defaultProductType.basePrice,
            categoryId: defaultCategory.id,
            brandId: brand.id, // Associé à cette marque
            collectionId: activeCollection.id, // IMPORTANT: Assigner à la collection active
          });

          const savedProduct = await productRepository.save(product);
          console.log(`    ✓ Produit créé: ${savedProduct.name}`);

          // Créer l'image du produit (MÊME IMAGE pour toutes les marques)
          if (productImageUrl) {
            const image = imageRepository.create({
              productId: savedProduct.id,
              url: productImageUrl, // Même URL d'image pour tous
              alt: `${productName} - Vue avant`,
              order: 0,
            });
            await imageRepository.save(image);
            console.log(`      → 1 image ajoutée`);
          } else {
            console.log(`      ⚠️  Aucune image ajoutée (image non trouvée)`);
          }

          // Créer des variantes (3 tailles)
          const sizes = ['S', 'M', 'L'];
          for (const size of sizes) {
            // Générer un SKU unique avec le slug de la marque
            const brandSlugPrefix = brand.slug
              .substring(0, 5)
              .toUpperCase()
              .replace(/[^A-Z0-9]/g, '');
            const productTypePrefix = defaultProductType.name
              .substring(0, 3)
              .toUpperCase();
            const colorPrefix = defaultProductType.color
              .substring(0, 3)
              .toUpperCase();
            const productIdShort = String(savedProduct.id).padStart(8, '0');
            const sku = `${productTypePrefix}-${colorPrefix}-${size}-${brandSlugPrefix}-${productIdShort}`;

            const variant = variantRepository.create({
              productId: savedProduct.id,
              color: defaultProductType.color,
              size: size,
              stock: 10,
              sku: sku,
            });
            await variantRepository.save(variant);
          }
          console.log(`      → 3 variante(s) ajoutée(s)`);
        }
      }
    }

    console.log('\n✅ Seed terminé avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    throw error;
  } finally {
    // Détruire la connexion seulement si elle a été initialisée
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Connexion fermée');
    }
  }
}

// Exécuter le seed
seed()
  .then(() => {
    console.log('🎉 Script de seed terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
