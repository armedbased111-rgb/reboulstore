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
export declare const getHealthStatus: () => Promise<HealthCheckResponse>;
