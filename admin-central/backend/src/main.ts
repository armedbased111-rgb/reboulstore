import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    const app = await NestFactory.create(AppModule, {
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

  // Configuration CORS pour le frontend admin
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4000',
    credentials: true,
  });

  const port = process.env.PORT || 4001;
  await app.listen(port);
    
    logger.log(`🎛️ Admin Backend running on http://localhost:${port}`);
    logger.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`🏥 Health check: http://localhost:${port}/health`);
  } catch (error) {
    logger.error('❌ Error starting Admin application', error);
    process.exit(1);
  }
}
bootstrap();
