import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'reboulstore_db',
  entities: [path.join(__dirname, 'src', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'src', 'migrations', '*.{.ts,.js}')],
  synchronize: false, // Jamais true en production
  logging: process.env.NODE_ENV === 'development',
});
