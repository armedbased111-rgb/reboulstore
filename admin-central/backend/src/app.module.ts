import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  getReboulDatabaseConfig,
  getCpCompanyDatabaseConfig,
  getOutletDatabaseConfig,
} from './config/databases.config';
import { ReboulModule } from './modules/reboul/reboul.module';
import { AdminAuthModule } from './shared/auth/admin-auth.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';

/**
 * Module principal de l'Admin Centrale
 * 
 * Ce module configure les connexions TypeORM multiples :
 * - 'reboul' : Connexion active (MVP - Février 2025)
 * - 'cpcompany' : Connexion future (commentée)
 * - 'outlet' : Connexion future (commentée)
 * 
 * Pour activer une connexion future :
 * 1. Décommenter le TypeOrmModule.forRootAsync correspondant
 * 2. Créer les modules/services pour ce site
 * 3. Ajouter le module dans les imports
 */
@Module({
  imports: [
    // Configuration globale (variables d'environnement)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '/app/.env'], // Chercher dans le répertoire courant et /app
      expandVariables: true,
    }),

    // ✅ Connexion Reboul (ACTIVE - MVP)
    TypeOrmModule.forRootAsync({
      name: 'reboul', // ⚠️ Nom de la connexion (doit correspondre à databases.config.ts)
      imports: [ConfigModule],
      useFactory: getReboulDatabaseConfig,
      inject: [ConfigService],
    }),

    // 🔜 Connexion CP Company (FUTUR - Commentée)
    // TypeOrmModule.forRootAsync({
    //   name: 'cpcompany',
    //   imports: [ConfigModule],
    //   useFactory: getCpCompanyDatabaseConfig,
    //   inject: [ConfigService],
    // }),

    // 🔜 Connexion Outlet (FUTUR - Commentée)
    // TypeOrmModule.forRootAsync({
    //   name: 'outlet',
    //   imports: [ConfigModule],
    //   useFactory: getOutletDatabaseConfig,
    //   inject: [ConfigService],
    // }),

    // Modules admin
    AdminAuthModule, // ✅ Phase 16.2 - Module authentification admin
    ReboulModule, // ✅ Phase 16 - Module Reboul créé
    CloudinaryModule, // ✅ Phase 17.7 - Module Cloudinary pour uploads
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
