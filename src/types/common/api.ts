/**
 * Common API types and interfaces
 * Used across all API integrations
 */

export interface BaseApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends BaseApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ApiState<T = any> {
  data: T | null;
  status: ApiStatus;
  error: string | null;
  lastFetch?: string;
}