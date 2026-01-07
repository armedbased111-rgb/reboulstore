import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';

/**
 * Configuration du cache Redis
 */
export const getCacheConfig = (
  configService: ConfigService,
): CacheModuleOptions<RedisClientOptions> => {
  const redisHost = configService.get<string>('REDIS_HOST', 'redis');
  const redisPort = configService.get<number>('REDIS_PORT', 6379);

  return {
    store: redisStore as any, // Type assertion nécessaire pour compatibilité
    host: redisHost,
    port: redisPort,
    ttl: 300, // TTL par défaut : 5 minutes (300 secondes)
    max: 1000, // Nombre maximum d'éléments en cache
  } as CacheModuleOptions<RedisClientOptions>;
};

