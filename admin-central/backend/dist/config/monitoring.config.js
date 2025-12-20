"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthStatus = void 0;
const getHealthStatus = async () => {
    const startTime = process.uptime();
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(startTime),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.APP_VERSION || '1.0.0',
    };
};
exports.getHealthStatus = getHealthStatus;
//# sourceMappingURL=monitoring.config.js.map