/**
 * Common API request types
 * Generic request interfaces used across external APIs
 */

export interface BaseRequest {
  timestamp?: string;
  requestId?: string;
}

export interface AuthenticatedRequest extends BaseRequest {
  token: string;
}

// Placeholder - add specific request types when needed