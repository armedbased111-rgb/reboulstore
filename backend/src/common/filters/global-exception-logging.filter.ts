import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logEvent } from '../log-event';

@Catch()
export class GlobalExceptionLoggingFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      if (status >= 500) {
        logEvent(this.logger, 'error', {
          event: 'http_5xx',
          method: request.method,
          path: request.url,
          status,
          message: exception.message,
        });
      } else if (
        status >= 400 &&
        status < 500 &&
        request.url.includes('/checkout')
      ) {
        logEvent(this.logger, 'warn', {
          event: 'checkout_error',
          method: request.method,
          path: request.url,
          status,
          message: exception.message,
        });
      }
      response.status(status).json(exception.getResponse());
      return;
    }

    const err = exception as { message?: string };
    if (err.message?.includes('Only image files are allowed')) {
      response.status(400).json({
        statusCode: 400,
        message: 'Only image files are allowed!',
        error: 'Bad Request',
      });
      return;
    }
    if (err.message?.includes('File too large')) {
      response.status(400).json({
        statusCode: 400,
        message: 'File size exceeds the maximum allowed size (10MB)',
        error: 'Bad Request',
      });
      return;
    }

    logEvent(this.logger, 'error', {
      event: 'http_5xx',
      method: request.method,
      path: request.url,
      status: 500,
      message: err.message || 'Unknown error',
    });
    if (exception instanceof Error && exception.stack) {
      this.logger.error(exception.stack);
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
