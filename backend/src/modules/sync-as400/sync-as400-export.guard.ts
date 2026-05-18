import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';
import { Request } from 'express';

@Injectable()
export class SyncAs400ExportGuard implements CanActivate {
  private readonly logger = new Logger(SyncAs400ExportGuard.name);

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const secret = this.configService.get<string>('AS400_EXPORT_SECRET');
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';

    if (!secret) {
      if (isProd) {
        throw new ServiceUnavailableException(
          'AS400_EXPORT_SECRET is not configured',
        );
      }
      this.logger.warn(
        'AS400_EXPORT_SECRET unset — export allowed in non-production only',
      );
      return true;
    }

    const provided = req.header('x-as400-export-secret') ?? '';
    if (!this.secretsMatch(provided, secret)) {
      throw new UnauthorizedException('Invalid export secret');
    }
    return true;
  }

  private secretsMatch(provided: string, expected: string): boolean {
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length) {
      return false;
    }
    return timingSafeEqual(a, b);
  }
}
