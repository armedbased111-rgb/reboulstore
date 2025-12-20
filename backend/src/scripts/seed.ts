import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { Image } from '../entities/image.entity';
import { Variant } from '../entities/variant.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';

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

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function seed() {
  // Détecter si on est dans Docker ou en local
  // Si DB_HOST est 'postgres' et qu'on n'est pas dans Docker, utiliser 'localhost'
  let dbHost = process.env.DB_HOST || 'localhost';
  if (dbHost === 'postgres' && !process.env.DOCKER_ENV) {
    dbHost = 'localhost';
    console.log(
      '⚠️  Détection: exécution en local, utilisation de localhost au lieu de postgres',
    );
  }

  // Configuration de la connexion à la base de données (compatible TypeORM)
  const dataSource = new DataSource({
    type: 'postgres',
    host: dbHost,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'reboulstore',
    password: process.env.DB_PASSWORD || 'reboulstore_password',
    database: process.env.DB_DATABASE || 'reboulstore_db',
    entities: [Category, Product, Image, Variant],
    synchronize: false, // Ne pas synchroniser automatiquement dans le seed
    logging: process.env.NODE_ENV === 'development',
  });

  console.log(
    `🔌 Connexion à PostgreSQL: ${dbHost}:${process.env.DB_PORT || '5432'}/${process.env.DB_DATABASE || 'reboulstore_db'}`,
  );

  try {
    await dataSource.initialize();
    console.log('✅ Connexion à la base de données établie');

    const categoryRepository = dataSource.getRepository(Category);
    const productRepository = dataSource.getRepository(Product);
    const imageRepository = dataSource.getRepository(Image);
    const variantRepository = dataSource.getRepository(Variant);

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

    // 2. Créer des produits de test
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
