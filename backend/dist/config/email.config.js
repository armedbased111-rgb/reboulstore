"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailConfig = void 0;
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const path_1 = require("path");
const getEmailConfig = (configService) => {
    const rootDir = process.cwd();
    const templateDir = process.env.NODE_ENV === 'production'
        ? (0, path_1.join)(rootDir, 'dist', 'templates', 'emails')
        : (0, path_1.join)(rootDir, 'src', 'templates', 'emails');
    return {
        transport: {
            host: configService.get('SMTP_HOST', 'smtp.gmail.com'),
            port: configService.get('SMTP_PORT', 587),
            secure: false,
            auth: {
                user: configService.get('SMTP_USER'),
                pass: configService.get('SMTP_PASSWORD'),
            },
        },
        defaults: {
            from: `"Reboul Store" <${configService.get('SMTP_USER')}>`,
        },
        template: {
            dir: templateDir,
            adapter: new handlebars_adapter_1.HandlebarsAdapter(),
            options: {
                strict: true,
            },
        },
    };
};
exports.getEmailConfig = getEmailConfig;
//# sourceMappingURL=email.config.js.map