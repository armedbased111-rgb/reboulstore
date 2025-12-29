import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Si c'est une HttpException de NestJS (NotFoundException, BadRequestException, etc.), la renvoyer telle quelle
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      response.status(status).json(exceptionResponse);
      return;
    }

    // Gérer les erreurs multer (fichier non-image, taille trop grande, etc.)
    if (exception.message && exception.message.includes('Only image files are allowed')) {
      response.status(400).json({
        statusCode: 400,
        message: 'Only image files are allowed!',
        error: 'Bad Request',
      });
      return;
    }

    if (exception.message && exception.message.includes('File too large')) {
      response.status(400).json({
        statusCode: 400,
        message: 'File size exceeds the maximum allowed size (10MB)',
        error: 'Bad Request',
      });
      return;
    }

    // Pour les autres erreurs, renvoyer une erreur 500 générique
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}

