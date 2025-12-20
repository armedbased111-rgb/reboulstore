/**
 * Configuration Winston pour les logs centralisés
 * 
 * ⚠️ INSTALLATION REQUISE :
 * npm install winston nest-winston
 * 
 * Formats :
 * - Development : Console avec couleurs
 * - Production : JSON structuré dans fichiers
 * 
 * Pour activer :
 * 1. Installer : npm install winston nest-winston
 * 2. Importer dans app.module.ts : WinstonModule.forRoot(getLoggerConfig())
 * 3. Décommenter le code ci-dessous
 */

// Décommenter quand Winston est installé
/*
import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import { format } from 'winston';

export const getLoggerConfig = (): WinstonModuleOptions => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  // Format pour développement (console colorée)
  const developmentFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.colorize({ all: true }),
    format.printf(({ timestamp, level, message, context, stack }) => {
      const contextStr = context ? `[${context}]` : '';
      const stackStr = stack ? `\n${stack}` : '';
      return `${timestamp} ${level} ${contextStr} ${message}${stackStr}`;
    })
  );

  // Format pour production (JSON structuré)
  const productionFormat = format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  );

  const transports: winston.transport[] = [];

  // Console (toujours actif)
  transports.push(
    new winston.transports.Console({
      format: isDevelopment ? developmentFormat : productionFormat,
      level: isDevelopment ? 'debug' : 'info',
    })
  );

  // Fichiers en production uniquement
  if (isProduction) {
    // Logs d'erreur
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: productionFormat,
        maxsize: 10485760, // 10MB
        maxFiles: 5,
      })
    );

    // Tous les logs
    transports.push(
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: productionFormat,
        maxsize: 10485760, // 10MB
        maxFiles: 5,
      })
    );
  }

  return {
    transports,
    // Niveau de log global
    level: isDevelopment ? 'debug' : 'info',
  };
};
*/

// Export vide pour l'instant (sera utilisé quand Winston est installé)
export const getLoggerConfig = () => {
  // Configuration vide - sera remplie quand Winston est installé
  return {};
};
