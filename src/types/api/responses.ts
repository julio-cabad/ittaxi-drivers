/**
 * Common API response types
 * Generic response interfaces used across external APIs
 */

export interface BaseResponse {
  success: boolean;
  timestamp: string;
  requestId?: string;
}

export interface SuccessResponse<T = any> extends BaseResponse {
  success: true;
  data: T;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Placeholder - add specific response types when needed