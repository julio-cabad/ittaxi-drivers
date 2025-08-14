import type { EndpointBuilder } from '@reduxjs/toolkit/query/react';

/**
 * Common endpoint utilities and helpers
 */

/**
 * Standard cache times (in seconds)
 */
export const CACHE_TIMES = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes
  LONG: 900,        // 15 minutes
  VERY_LONG: 3600,  // 1 hour
} as const;

/**
 * Common query parameters interface
 */
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

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Error response interface
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: string;
}

/**
 * Helper to create standardized query endpoints
 */
export const createQueryEndpoint = <ResultType, ArgType = void>(
  builder: EndpointBuilder<any, any, any>,
  config: {
    query: (arg: ArgType) => string | { url: string; method?: string; body?: any };
    providesTags?: any;
    keepUnusedDataFor?: number;
    transformResponse?: (response: any) => ResultType;
  }
) => {
  return builder.query<ResultType, ArgType>({
    keepUnusedDataFor: CACHE_TIMES.MEDIUM,
    ...config,
  });
};

/**
 * Helper to create standardized mutation endpoints
 */
export const createMutationEndpoint = <ResultType, ArgType>(
  builder: EndpointBuilder<any, any, any>,
  config: {
    query: (arg: ArgType) => { url: string; method: string; body?: any };
    invalidatesTags?: any;
    transformResponse?: (response: any) => ResultType;
  }
) => {
  return builder.mutation<ResultType, ArgType>(config);
};

/**
 * Helper to build query strings from parameters
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Helper to create paginated endpoints
 */
export const createPaginatedEndpoint = <ItemType>(
  builder: EndpointBuilder<any, any, any>,
  baseUrl: string,
  tagType: string
) => {
  return builder.query<PaginatedResponse<ItemType>, PaginationParams & SortParams & FilterParams>({
    query: (params) => {
      const queryString = buildQueryString(params);
      return `${baseUrl}${queryString}`;
    },
    providesTags: (result) => [
      { type: tagType, id: 'LIST' },
      ...(result?.data || []).map((item: any) => ({ type: tagType, id: item.id })),
    ],
    keepUnusedDataFor: CACHE_TIMES.MEDIUM,
  });
};