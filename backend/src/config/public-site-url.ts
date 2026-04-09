import { Logger } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';

const logger = new Logger('PublicSiteUrl');

/**
 * URL publique de la boutique (sans slash final).
 * Utilisée pour CORS, liens dans les e-mails, Stripe, SMS (logo mail : voir `EMAIL_LOGO_URL` / `getEmailLogoUrl`).
 * En production : doit être l’URL HTTPS réelle du site, pas localhost.
 */
export function getPublicSiteUrl(config: ConfigService): string {
  const raw = (config.get<string>('FRONTEND_URL') || 'http://localhost:3000')
    .trim()
    .replace(/\/+$/, '');

  if (process.env.NODE_ENV === 'production') {
    if (!raw.startsWith('https://')) {
      logger.warn(
        `FRONTEND_URL devrait être en HTTPS en production (actuel : "${raw}"). Risque : Stripe et liens dans les e-mails.`,
      );
    }
    if (/localhost|127\.0\.0\.1/i.test(raw)) {
      logger.error(
        `FRONTEND_URL pointe vers localhost en production ("${raw}"). Corriger .env.production — les liens dans les e-mails seront invalides.`,
      );
    }
  }

  return raw;
}
