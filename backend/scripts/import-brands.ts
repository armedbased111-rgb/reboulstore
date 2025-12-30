/**
 * Script pour importer les marques en base de données
 * 
 * Usage: npx ts-node -r tsconfig-paths/register backend/scripts/import-brands.ts
 */

import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
// Charger toutes les entités automatiquement
import { Brand } from '../src/entities/brand.entity';

// Charger les variables d'environnement
// Essayer .env.local d'abord, puis .env
const envPath = path.join(__dirname, '../../.env.local');
const envPathFallback = path.join(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  config({ path: envPath });
} else if (fs.existsSync(envPathFallback)) {
  config({ path: envPathFallback });
} else {
  config(); // Charger depuis .env par défaut
}

// Configuration DataSource
// Utiliser localhost si on est en dehors de Docker, sinon utiliser DB_HOST
const dbHost = process.env.DB_HOST === 'host.docker.internal' 
  ? 'localhost' 
  : (process.env.DB_HOST || 'localhost');

// Utiliser le port 5432 par défaut (port standard PostgreSQL)
const dbPort = process.env.DB_PORT && process.env.DB_PORT !== '5433'
  ? parseInt(process.env.DB_PORT, 10)
  : 5432;

// Utiliser les credentials Docker par défaut
const dbUsername = process.env.DB_USERNAME || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbDatabase = process.env.DB_DATABASE || 'reboulstore_db';

const dataSource = new DataSource({
  type: 'postgres',
  host: dbHost,
  port: dbPort,
  username: dbUsername,
  password: dbPassword,
  database: dbDatabase,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: false, // Désactiver les logs pour plus de clarté
});

interface BrandData {
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  publicId?: string | null;
}

interface ImportResult {
  brandName: string;
  success: boolean;
  action: 'created' | 'updated' | 'skipped';
  error?: string;
}

/**
 * Importer toutes les marques
 */
async function importBrands(): Promise<void> {
  console.log('🚀 Début import marques en base de données...\n');

  // Charger les données avec URLs Cloudinary
  const dataPath = path.join(__dirname, 'brands-data-with-urls.json');
  let brandsData: { brands: BrandData[] };

  if (fs.existsSync(dataPath)) {
    brandsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`📁 Données chargées depuis: ${dataPath}\n`);
  } else {
    // Fallback sur brands-data.json si pas de URLs
    brandsData = require('./brands-data.json');
    console.log(
      '⚠️  Fichier brands-data-with-urls.json non trouvé, utilisation de brands-data.json (sans URLs)\n',
    );
  }

  await dataSource.initialize();
  console.log('✅ Connexion à la base de données établie\n');

  const brandRepository = dataSource.getRepository(Brand);
  const results: ImportResult[] = [];
  const total = brandsData.brands.length;

  for (let i = 0; i < brandsData.brands.length; i++) {
    const brandData = brandsData.brands[i];
    console.log(`[${i + 1}/${total}] Import ${brandData.name}...`);

    try {
      // Vérifier si la marque existe déjà
      const existingBrand = await brandRepository.findOne({
        where: { slug: brandData.slug },
      });

      if (existingBrand) {
        // Mettre à jour si logoUrl manquant ou différent
        if (
          !existingBrand.logoUrl ||
          existingBrand.logoUrl !== brandData.logoUrl
        ) {
          existingBrand.logoUrl = brandData.logoUrl || null;
          await brandRepository.save(existingBrand);
          results.push({
            brandName: brandData.name,
            success: true,
            action: 'updated',
          });
          console.log(`  ✅ ${brandData.name} mis à jour`);
        } else {
          results.push({
            brandName: brandData.name,
            success: true,
            action: 'skipped',
          });
          console.log(`  ⏭️  ${brandData.name} déjà présent, ignoré`);
        }
      } else {
        // Créer nouvelle marque
        const newBrand = brandRepository.create({
          name: brandData.name,
          slug: brandData.slug,
          description: brandData.description,
          logoUrl: brandData.logoUrl || null,
        });

        await brandRepository.save(newBrand);
        results.push({
          brandName: brandData.name,
          success: true,
          action: 'created',
        });
        console.log(`  ✅ ${brandData.name} créé`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      results.push({
        brandName: brandData.name,
        success: false,
        action: 'skipped',
        error: errorMessage,
      });
      console.log(`  ❌ ${brandData.name} erreur: ${errorMessage}`);
    }
  }

  // Résumé
  console.log('\n📊 Résumé:');
  const created = results.filter((r) => r.action === 'created').length;
  const updated = results.filter((r) => r.action === 'updated').length;
  const skipped = results.filter((r) => r.action === 'skipped').length;
  const errors = results.filter((r) => !r.success).length;

  console.log(`✅ Créées: ${created}`);
  console.log(`🔄 Mises à jour: ${updated}`);
  console.log(`⏭️  Ignorées: ${skipped}`);
  console.log(`❌ Erreurs: ${errors}`);

  if (errors > 0) {
    console.log('\n❌ Erreurs détaillées:');
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.brandName}: ${r.error}`);
      });
  }

  await dataSource.destroy();
}

// Exécuter
importBrands()
  .then(() => {
    console.log('\n✅ Import terminé !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  });

