import { NestFactory } from '@nestjs/core';
import {
  ValidationPipe,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { getPublicSiteUrl } from './config/public-site-url';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const bootstrapLogger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      rawBody: true,
      bufferLogs: true,
    });
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    const logger = bootstrapLogger;

    // Helmet — headers sécurité HTTP (X-Frame-Options, X-Content-Type-Options, etc.)
    // CSP et HSTS désactivés : configurés manuellement plus bas
    app.use(helmet({ contentSecurityPolicy: false, hsts: false }));

    // Configuration globale de la validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const configService = app.get(ConfigService);
    const frontendUrl = getPublicSiteUrl(configService);
    const allowedOrigins = [
      frontendUrl,
      'https://reboulstore.com',
      'https://www.reboulstore.com',
      'http://localhost:3000', // Dev local
    ];

    app.enableCors({
      origin: (origin, callback) => {
        // Autoriser les requêtes sans origin (ex: mobile apps, Postman)
        if (!origin) return callback(null, true);

        // Autoriser si l'origine est dans la liste
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // En production, accepter seulement les origines autorisées
        callback(new HttpException('CORS non autorisé', HttpStatus.FORBIDDEN));
      },
      credentials: true,
    });

    // Headers de sécurité HTTP
    app.use((_req: any, res: any, next: any) => {
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=63072000; includeSubDomains; preload',
      );
      res.setHeader(
        'Content-Security-Policy',
        [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https://res.cloudinary.com",
          "connect-src 'self' https://api.stripe.com https://www.google-analytics.com",
          'frame-src https://js.stripe.com',
          "font-src 'self'",
          "object-src 'none'",
          "base-uri 'self'",
        ].join('; '),
      );
      res.setHeader(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=()',
      );
      next();
    });

    // Servir les fichiers statiques pour les images
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });

    const port = process.env.PORT || 3001;
    await app.listen(port);

    logger.log(`🚀 Backend running on http://localhost:${port}`);
    logger.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`🏥 Health check: http://localhost:${port}/health`);
  } catch (error) {
    bootstrapLogger.error('❌ Error starting application', error);
    process.exit(1);
  }
}
bootstrap();
