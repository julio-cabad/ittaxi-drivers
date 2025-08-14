import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../store';
import { errorInterceptor } from '../../interceptors/errorInterceptor';

/**
 * Base API configuration for all external API integrations
 * This provides common functionality like authentication, error handling, and caching
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    prepareHeaders: (headers, { getState }) => {
      // Add common headers
      headers.set('content-type', 'application/json');
      headers.set('accept', 'application/json');
      
      // Add authentication if available
      const state = getState() as RootState;
      // TODO: Add auth slice and uncomment when ready
      // const token = state.auth?.token;
      
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`);
      // }
      
      // Add user agent for mobile apps
      headers.set('user-agent', 'InstaTaxi-Driver-App/1.0');
      
      return headers;
    },
    // Global error handling
    responseHandler: async (response) => {
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
  }),
  
  // Global tag types for cache invalidation
  tagTypes: [
    'License',      // Driver license validation
    'Location',     // Geolocation services
    'Payment',      // Payment processing
    'Vehicle',      // Vehicle information
    'Document',     // Document verification
    'User',         // User profile data
  ],
  
  // Base API has no endpoints - they are injected by specific APIs
  endpoints: () => ({}),
});

/**
 * Enhanced base query with error interceptor
 */
export const baseQueryWithInterceptor = async (args: any, api: any, extraOptions: any) => {
  const baseQuery = fetchBaseQuery({
    prepareHeaders: (headers, { getState }) => {
      headers.set('content-type', 'application/json');
      headers.set('accept', 'application/json');
      headers.set('user-agent', 'InstaTaxi-Driver-App/1.0');
      return headers;
    },
  });

  try {
    const result = await baseQuery(args, api, extraOptions);
    
    if (result.error) {
      const errorResponse = errorInterceptor.handleError(result.error, {
        operation: `External API: ${args.url || args}`,
        // TODO: Add auth slice and uncomment when ready
        // userId: (api.getState() as RootState).auth?.userId,
        additionalInfo: { args, extraOptions },
      });
      
      return { error: errorResponse };
    }
    
    return result;
  } catch (error) {
    const errorResponse = errorInterceptor.handleError(error, {
      operation: `External API: ${args.url || args}`,
      // TODO: Add auth slice and uncomment when ready
      // userId: (api.getState() as RootState).auth?.userId,
      additionalInfo: { args, extraOptions },
    });
    
    return { error: errorResponse };
  }
};

/**
 * Create a new API with enhanced error handling
 */
export const createEnhancedApi = (config: Parameters<typeof createApi>[0]) => {
  return createApi({
    ...config,
    baseQuery: baseQueryWithInterceptor,
  });
};