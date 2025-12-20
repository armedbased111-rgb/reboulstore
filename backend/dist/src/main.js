"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const multer_exception_filter_1 = require("./filters/multer-exception.filter");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const isProduction = process.env.NODE_ENV === 'production';
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            rawBody: true,
            logger: isProduction
                ? ['error', 'warn', 'log']
                : ['error', 'warn', 'log', 'debug', 'verbose'],
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.useGlobalFilters(new multer_exception_filter_1.MulterExceptionFilter());
        app.enableCors({
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        });
        app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
            prefix: '/uploads/',
        });
        const port = process.env.PORT || 3001;
        await app.listen(port);
        logger.log(`🚀 Backend running on http://localhost:${port}`);
        logger.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        logger.log(`🏥 Health check: http://localhost:${port}/health`);
    }
    catch (error) {
        logger.error('❌ Error starting application', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map