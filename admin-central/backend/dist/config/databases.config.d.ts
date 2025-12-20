import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
export declare const getReboulDatabaseConfig: (configService: ConfigService) => TypeOrmModuleOptions;
export declare const getCpCompanyDatabaseConfig: (configService: ConfigService) => TypeOrmModuleOptions;
export declare const getOutletDatabaseConfig: (configService: ConfigService) => TypeOrmModuleOptions;
