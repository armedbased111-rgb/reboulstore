import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

/**
 * Configuration de la connexion à la base de données Reboul
 * 
 * Cette connexion permet à l'admin d'accéder directement à la base Reboul
 * via le réseau Docker partagé (reboulstore-network).
 * 
 * Le nom de la connexion 'reboul' sera utilisé dans les services pour
 * injecter les repositories avec @InjectRepository(Entity, 'reboul')
 */
export const getReboulDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  name: 'reboul', // ⚠️ Nom unique de la connexion (utilisé dans @InjectRepository)
  type: 'postgres',
  host: configService.get<string>('REBOUL_DB_HOST', 'reboulstore-postgres'), // Nom du container Docker
  port: configService.get<number>('REBOUL_DB_PORT', 5432),
  username: configService.get<string>('REBOUL_DB_USER', 'reboulstore'),
  password: configService.get<string>('REBOUL_DB_PASSWORD', 'reboulstore_password'),
  database: configService.get<string>('REBOUL_DB_NAME', 'reboulstore_db'),
  entities: [
    __dirname + '/../modules/reboul/**/*.entity{.ts,.js}', // Entités Reboul
    __dirname + '/../shared/**/*.entity{.ts,.js}', // Entités partagées (AdminUser)
  ],
  synchronize: configService.get<string>('NODE_ENV') === 'development', // ⚠️ true en dev pour créer tables automatiquement, false en prod (utiliser migrations)
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
