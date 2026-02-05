import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

/**
 * Configuration de la connexion à la base de données Reboul
 * 
 * ⚠️ IMPORTANT : La base Reboul est TOUJOURS sur le VPS, même en développement
 * 
 * Cette connexion permet à l'admin d'accéder à la base Reboul via le tunnel SSH :
 * - Le tunnel SSH expose PostgreSQL du VPS sur localhost:5433 de la machine locale
 * - Le container Docker utilise host.docker.internal:5433 pour accéder au tunnel
 * - En développement : host.docker.internal:5433 (via tunnel SSH)
 * - En production : connexion directe au VPS (selon configuration)
 * 
 * Le nom de la connexion 'reboul' sera utilisé dans les services pour
 * injecter les repositories avec @InjectRepository(Entity, 'reboul')
 */
export const getReboulDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  name: 'reboul', // ⚠️ Nom unique de la connexion (utilisé dans @InjectRepository)
  type: 'postgres',
  host: configService.get<string>('REBOUL_DB_HOST', 'host.docker.internal'), // Tunnel SSH vers VPS
  port: configService.get<number>('REBOUL_DB_PORT', 5433), // Port du tunnel SSH
  username: configService.get<string>('REBOUL_DB_USER', 'reboulstore'),
  password: configService.get<string>('REBOUL_DB_PASSWORD', 'reboulstore_password'),
  database: configService.get<string>('REBOUL_DB_NAME', 'reboulstore_db'),
  entities: [
    __dirname + '/../modules/reboul/**/*.entity{.ts,.js}', // Entités Reboul
    __dirname + '/../shared/**/*.entity{.ts,.js}', // Entités partagées (AdminUser)
  ],
  synchronize: false, // Base Reboul gérée par le backend principal (migrations/schema). Ne pas modifier depuis l'admin.
  logging: configService.get<string>('NODE_ENV') === 'development',
  autoLoadEntities: true,
});

/**
 * Configuration de la connexion à la base de données CP Company (FUTUR)
 * 
 * Cette connexion sera activée quand CP Company sera créé.
 * Pour l'instant, elle est commentée dans app.module.ts
 */
export const getCpCompanyDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  name: 'cpcompany', // Nom unique de la connexion
  type: 'postgres',
  host: configService.get<string>('CPCOMPANY_DB_HOST', 'cpcompany-postgres'),
  port: configService.get<number>('CPCOMPANY_DB_PORT', 5433),
  username: configService.get<string>('CPCOMPANY_DB_USER', 'cpcompany'),
  password: configService.get<string>('CPCOMPANY_DB_PASSWORD', 'cpcompany_password'),
  database: configService.get<string>('CPCOMPANY_DB_NAME', 'cpcompany_db'),
  entities: [__dirname + '/../modules/cpcompany/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: configService.get<string>('NODE_ENV') === 'development',
  autoLoadEntities: true,
});

/**
 * Configuration de la connexion à la base de données Outlet (FUTUR)
 * 
 * Cette connexion sera activée quand Outlet sera créé.
 * Pour l'instant, elle est commentée dans app.module.ts
 */
export const getOutletDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  name: 'outlet', // Nom unique de la connexion
  type: 'postgres',
  host: configService.get<string>('OUTLET_DB_HOST', 'outlet-postgres'),
  port: configService.get<number>('OUTLET_DB_PORT', 5434),
  username: configService.get<string>('OUTLET_DB_USER', 'outlet'),
  password: configService.get<string>('OUTLET_DB_PASSWORD', 'outlet_password'),
  database: configService.get<string>('OUTLET_DB_NAME', 'outlet_db'),
  entities: [__dirname + '/../modules/outlet/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: configService.get<string>('NODE_ENV') === 'development',
  autoLoadEntities: true,
});
