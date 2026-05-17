import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import { format } from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const logDir = process.env.LOG_DIR || join(process.cwd(), 'logs');

function ensureLogDir() {
  if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true });
  }
}

export const getLoggerConfig = (): WinstonModuleOptions => {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  const developmentFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.colorize({ all: true }),
    format.printf(({ timestamp, level, message, context, stack }) => {
      const contextStr = context ? `[${context}]` : '';
      const stackStr = stack ? `\n${stack}` : '';
      return `${timestamp} ${level} ${contextStr} ${message}${stackStr}`;
    }),
  );

  const productionFormat = format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  );

  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: isDevelopment ? developmentFormat : productionFormat,
      level: isDevelopment ? 'debug' : 'info',
    }),
  ];

  if (!isDevelopment) {
    ensureLogDir();
    transports.push(
      new winston.transports.File({
        filename: join(logDir, 'error.log'),
        level: 'error',
        format: productionFormat,
        maxsize: 10 * 1024 * 1024,
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: join(logDir, 'combined.log'),
        format: productionFormat,
        maxsize: 10 * 1024 * 1024,
        maxFiles: 5,
      }),
    );
  }

  return {
    transports,
    level: isDevelopment ? 'debug' : 'info',
  };
};
