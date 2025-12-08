// Types pour les réponses API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  statusCode?: number;
}

// Types pour les erreurs API
export interface ApiError {
  error?: string;
  message: string;
  statusCode: number;
  details?: any;
}

// Types pour les réponses paginées
export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
