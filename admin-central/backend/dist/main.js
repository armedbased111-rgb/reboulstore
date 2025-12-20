"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const isProduction = process.env.NODE_ENV === 'production';
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: isProduction
                ? ['error', 'warn', 'log']
                : ['error', 'warn', 'log', 'debug', 'verbose'],
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.enableCors({
            origin: process.env.FRONTEND_URL || 'http://localhost:4000',
            credentials: true,
        });
        const port = process.env.PORT || 4001;
        await app.listen(port);
        logger.log(`🎛️ Admin Backend running on http://localhost:${port}`);
        logger.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        logger.log(`🏥 Health check: http://localhost:${port}/health`);
    }
    catch (error) {
        logger.error('❌ Error starting Admin application', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map