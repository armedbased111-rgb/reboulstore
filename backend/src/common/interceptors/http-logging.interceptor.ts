import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, finalize } from 'rxjs';
import { Request } from 'express';
import { logEvent } from '../log-event';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const started = Date.now();

    return next.handle().pipe(
      finalize(() => {
        const res = context.switchToHttp().getResponse<{ statusCode: number }>();
        const status = res.statusCode;
        const path = req.url;

        if (path.includes('/checkout') && status >= 400 && status < 500) {
          logEvent(this.logger, 'warn', {
            event: 'checkout_error',
            method: req.method,
            path,
            status,
            durationMs: Date.now() - started,
          });
        }
      }),
    );
  }
}
