import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { MulterExceptionFilter } from './filters/multer-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const isProduction = process.env.NODE_ENV === 'production';

  try {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true, // Nécessaire pour les webhooks Stripe (vérification signature)
      logger: isProduction
        ? ['error', 'warn', 'log'] // Production : moins de logs
        : ['error', 'warn', 'log', 'debug', 'verbose'], // Dev : tous les logs
  });

  // Configuration globale de la validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtre d'exception global pour gérer les erreurs multer
  app.useGlobalFilters(new MulterExceptionFilter());

  // Configuration CORS pour le frontend
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
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
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
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
    logger.error('❌ Error starting application', error);
    process.exit(1);
  }
}
bootstrap();
