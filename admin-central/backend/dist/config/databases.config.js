"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutletDatabaseConfig = exports.getCpCompanyDatabaseConfig = exports.getReboulDatabaseConfig = void 0;
const getReboulDatabaseConfig = (configService) => ({
    name: 'reboul',
    type: 'postgres',
    host: configService.get('REBOUL_DB_HOST', 'reboulstore-postgres'),
    port: configService.get('REBOUL_DB_PORT', 5432),
    username: configService.get('REBOUL_DB_USER', 'reboulstore'),
    password: configService.get('REBOUL_DB_PASSWORD', 'reboulstore_password'),
    database: configService.get('REBOUL_DB_NAME', 'reboulstore_db'),
    entities: [
        __dirname + '/../modules/reboul/**/*.entity{.ts,.js}',
        __dirname + '/../shared/**/*.entity{.ts,.js}',
    ],
    synchronize: configService.get('NODE_ENV') === 'development',
    logging: configService.get('NODE_ENV') === 'development',
    autoLoadEntities: true,
});
exports.getReboulDatabaseConfig = getReboulDatabaseConfig;
const getCpCompanyDatabaseConfig = (configService) => ({
    name: 'cpcompany',
    type: 'postgres',
    host: configService.get('CPCOMPANY_DB_HOST', 'cpcompany-postgres'),
    port: configService.get('CPCOMPANY_DB_PORT', 5433),
    username: configService.get('CPCOMPANY_DB_USER', 'cpcompany'),
    password: configService.get('CPCOMPANY_DB_PASSWORD', 'cpcompany_password'),
    database: configService.get('CPCOMPANY_DB_NAME', 'cpcompany_db'),
    entities: [__dirname + '/../modules/cpcompany/**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    autoLoadEntities: true,
});
exports.getCpCompanyDatabaseConfig = getCpCompanyDatabaseConfig;
const getOutletDatabaseConfig = (configService) => ({
    name: 'outlet',
    type: 'postgres',
    host: configService.get('OUTLET_DB_HOST', 'outlet-postgres'),
    port: configService.get('OUTLET_DB_PORT', 5434),
    username: configService.get('OUTLET_DB_USER', 'outlet'),
    password: configService.get('OUTLET_DB_PASSWORD', 'outlet_password'),
    database: configService.get('OUTLET_DB_NAME', 'outlet_db'),
    entities: [__dirname + '/../modules/outlet/**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    autoLoadEntities: true,
});
exports.getOutletDatabaseConfig = getOutletDatabaseConfig;
//# sourceMappingURL=databases.config.js.map