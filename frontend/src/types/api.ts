// Types pour les réponses API
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  statusCode?: number;
}

// Types pour les erreurs API
export interface ApiError {
  error?: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

// Types pour les réponses paginées
export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
