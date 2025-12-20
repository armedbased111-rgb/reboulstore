/**
 * Configuration monitoring et health checks - Admin Central
 */

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  version?: string;
  services?: {
    reboulDatabase?: 'connected' | 'disconnected';
    [key: string]: string | undefined;
  };
}

/**
 * Vérifier la santé de l'application Admin
 */
export const getHealthStatus = async (): Promise<HealthCheckResponse> => {
  const startTime = process.uptime();
  
  // Vérifier la connexion DB Reboul (optionnel, à implémenter si besoin)
  // const dbStatus = await checkReboulDatabaseConnection();
  
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(startTime),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.APP_VERSION || '1.0.0',
    // services: {
    //   reboulDatabase: dbStatus ? 'connected' : 'disconnected',
    // },
  };
};
