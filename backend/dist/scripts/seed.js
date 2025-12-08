"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const category_entity_1 = require("../entities/category.entity");
const product_entity_1 = require("../entities/product.entity");
const image_entity_1 = require("../entities/image.entity");
const variant_entity_1 = require("../entities/variant.entity");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.join(__dirname, '../../.env') });
async function seed() {
    let dbHost = process.env.DB_HOST || 'localhost';
    if (dbHost === 'postgres' && !process.env.DOCKER_ENV) {
        dbHost = 'localhost';
        console.log('⚠️  Détection: exécution en local, utilisation de localhost au lieu de postgres');
    }
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: dbHost,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'reboulstore',
        password: process.env.DB_PASSWORD || 'reboulstore_password',
        database: process.env.DB_DATABASE || 'reboulstore_db',
        entities: [category_entity_1.Category, product_entity_1.Product, image_entity_1.Image, variant_entity_1.Variant],
        synchronize: false,
        logging: process.env.NODE_ENV === 'development',
    });
    console.log(`🔌 Connexion à PostgreSQL: ${dbHost}:${process.env.DB_PORT || '5432'}/${process.env.DB_DATABASE || 'reboulstore_db'}`);
    try {
        await dataSource.initialize();
        console.log('✅ Connexion à la base de données établie');
        const categoryRepository = dataSource.getRepository(category_entity_1.Category);
        const productRepository = dataSource.getRepository(product_entity_1.Product);
        const imageRepository = dataSource.getRepository(image_entity_1.Image);
        const variantRepository = dataSource.getRepository(variant_entity_1.Variant);
        console.log('📦 Création des catégories...');
        const categoriesData = [
            { name: 'Adult', slug: 'adult', description: 'Vêtements pour adultes' },
            { name: 'Kids', slug: 'kids', description: 'Vêtements pour enfants' },
            { name: 'Sneakers', slug: 'sneakers', description: 'Chaussures de sport' },
        ];
        const categories = [];
        for (const catData of categoriesData) {
            let category = await categoryRepository.findOne({ where: { slug: catData.slug } });
            if (!category) {
                category = categoryRepository.create(catData);
                category = await categoryRepository.save(category);
                console.log(`  ✓ Catégorie créée: ${category.name}`);
            }
            else {
                console.log(`  → Catégorie existante: ${category.name}`);
            }
            categories.push(category);
        }
        console.log('\n🛍️  Création des produits...');
        const productsData = [
            {
                name: 'HOODIE BLACK',
                description: 'Hoodie premium en coton noir, coupe oversize, style streetwear',
                price: 89.99,
                categorySlug: 'adult',
                images: [
                    { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop', alt: 'Hoodie Black - Vue avant', order: 0 },
                    { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop', alt: 'Hoodie Black - Vue dos', order: 1 },
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
                    { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop', alt: 'T-Shirt White - Vue avant', order: 0 },
                    { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop', alt: 'T-Shirt White - Vue dos', order: 1 },
                ],
                variants: [
                    { color: 'White', size: 'S', stock: 25, sku: 'TSH-WHT-S' },
                    { color: 'White', size: 'M', stock: 30, sku: 'TSH-WHT-M' },
                    { color: 'White', size: 'L', stock: 28, sku: 'TSH-WHT-L' },
                ],
            },
            {
                name: 'SNEAKERS CLASSIC',
                description: 'Sneakers classiques en cuir, semelle confortable, style minimaliste',
                price: 129.99,
                categorySlug: 'sneakers',
                images: [
                    { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop', alt: 'Sneakers Classic - Vue de face', order: 0 },
                    { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop', alt: 'Sneakers Classic - Vue de profil', order: 1 },
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
                    { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop', alt: 'Jacket Navy - Vue avant', order: 0 },
                    { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop', alt: 'Jacket Navy - Vue dos', order: 1 },
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
                    { url: 'https://images.unsplash.com/photo-1506629905607-3e0c82e5e0a1?w=800&h=1000&fit=crop', alt: 'Pants Cargo - Vue avant', order: 0 },
                    { url: 'https://images.unsplash.com/photo-1506629905607-3e0c82e5e0a1?w=800&h=1000&fit=crop', alt: 'Pants Cargo - Vue dos', order: 1 },
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
                    { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop', alt: 'Kids Hoodie - Vue avant', order: 0 },
                    { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop', alt: 'Kids Hoodie - Vue dos', order: 1 },
                ],
                variants: [
                    { color: 'Gray', size: '6Y', stock: 10, sku: 'KHD-GRY-6Y' },
                    { color: 'Gray', size: '8Y', stock: 12, sku: 'KHD-GRY-8Y' },
                    { color: 'Gray', size: '10Y', stock: 8, sku: 'KHD-GRY-10Y' },
                ],
            },
            {
                name: 'SNEAKERS RUNNING',
                description: 'Sneakers de running, légères et respirantes, semelle amortissante',
                price: 99.99,
                categorySlug: 'sneakers',
                images: [
                    { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop', alt: 'Sneakers Running - Vue de face', order: 0 },
                    { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop', alt: 'Sneakers Running - Vue de profil', order: 1 },
                ],
                variants: [
                    { color: 'Black', size: '40', stock: 9, sku: 'SNK-RUN-BLK-40' },
                    { color: 'Black', size: '41', stock: 11, sku: 'SNK-RUN-BLK-41' },
                    { color: 'Black', size: '42', stock: 13, sku: 'SNK-RUN-BLK-42' },
                ],
            },
            {
                name: 'SWEATSHIRT CREAM',
                description: 'Sweatshirt en coton crème, coupe oversize, style minimaliste',
                price: 69.99,
                categorySlug: 'adult',
                images: [
                    { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop', alt: 'Sweatshirt Cream - Vue avant', order: 0 },
                    { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop', alt: 'Sweatshirt Cream - Vue dos', order: 1 },
                ],
                variants: [
                    { color: 'Cream', size: 'S', stock: 14, sku: 'SWT-CRM-S' },
                    { color: 'Cream', size: 'M', stock: 16, sku: 'SWT-CRM-M' },
                    { color: 'Cream', size: 'L', stock: 18, sku: 'SWT-CRM-L' },
                ],
            },
        ];
        for (const productData of productsData) {
            const existingProduct = await productRepository.findOne({
                where: { name: productData.name },
            });
            if (existingProduct) {
                console.log(`  → Produit existant: ${productData.name}`);
                continue;
            }
            const category = categories.find((c) => c.slug === productData.categorySlug);
            if (!category) {
                console.log(`  ✗ Catégorie non trouvée: ${productData.categorySlug}`);
                continue;
            }
            const product = productRepository.create({
                name: productData.name,
                description: productData.description,
                price: productData.price,
                categoryId: category.id,
            });
            const savedProduct = await productRepository.save(product);
            console.log(`  ✓ Produit créé: ${savedProduct.name}`);
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
            console.log(`    → ${productData.variants.length} variante(s) ajoutée(s)`);
        }
        console.log('\n✅ Seed terminé avec succès!');
    }
    catch (error) {
        console.error('❌ Erreur lors du seed:', error);
        throw error;
    }
    finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('🔌 Connexion fermée');
        }
    }
}
seed()
    .then(() => {
    console.log('🎉 Script de seed terminé');
    process.exit(0);
})
    .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map