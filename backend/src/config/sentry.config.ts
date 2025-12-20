/**
 * Configuration Sentry pour le monitoring d'erreurs
 * 
 * Installation : npm install @sentry/node @sentry/integrations
 * 
 * Usage :
 * 1. Installer : npm install @sentry/node @sentry/integrations
 * 2. Ajouter SENTRY_DSN dans .env.production
 * 3. Décommenter l'initialisation dans main.ts
 */

export const initSentry = () => {
  // Décommenter quand Sentry est installé et configuré
  /*
  import * as Sentry from '@sentry/node';
  import { nodeProfilingIntegration } from '@sentry/profiling-node';

  const dsn = process.env.SENTRY_DSN;
  
  if (!dsn) {
    console.warn('⚠️  SENTRY_DSN not configured, Sentry monitoring disabled');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      nodeProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Profiling
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  });

  console.log('✅ Sentry initialized');
  */
};
