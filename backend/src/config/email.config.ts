import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const getEmailConfig = (
  configService: ConfigService,
): MailerOptions => {
  // En développement : __dirname pointe vers src/config
  // En production : __dirname pointe vers dist/config
  // Les templates sont copiés dans dist/templates lors du build (nest-cli.json)
  const rootDir = process.cwd();
  const templateDir =
    process.env.NODE_ENV === 'production'
      ? join(rootDir, 'dist', 'templates', 'emails')
      : join(rootDir, 'src', 'templates', 'emails');

  return {
    transport: {
      host: configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: configService.get<number>('SMTP_PORT', 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: configService.get<string>('SMTP_USER'),
        pass: configService.get<string>('SMTP_PASSWORD'),
      },
    },
    defaults: {
      from: `"Reboul Store" <${configService.get<string>('SMTP_USER')}>`,
    },
    template: {
      dir: templateDir,
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
};
