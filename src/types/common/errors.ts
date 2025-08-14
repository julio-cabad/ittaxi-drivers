/**
 * Common error types and interfaces
 * Used for consistent error handling across the application
 */

export interface ErrorContext {
  operation: string;
  userId?: string;
  additionalInfo?: any;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
}

export interface BaseError {
  code: string;
  message: string;
  timestamp: string;
  stack?: string;
}

export interface TypedError<T = any> extends BaseError {
  data?: T;
  context?: Record<string, any>;
}

export interface ValidationError extends BaseError {
  field: string;
  value: any;
  constraint: string;
}

export interface NetworkError extends BaseError {
  status?: number;
  statusText?: string;
  url?: string;
  method?: string;
}

export interface DatabaseError extends BaseError {
  operation: 'create' | 'read' | 'update' | 'delete';
  collection?: string;
  documentId?: string;
}

export interface AuthenticationError extends BaseError {
  reason: 'invalid_credentials' | 'token_expired' | 'unauthorized' | 'forbidden';
}

export interface FileError extends BaseError {
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  operation: 'upload' | 'download' | 'delete' | 'read';
}

// Error severity levels
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorReport {
  error: BaseError;
  severity: ErrorSeverity;
  userId?: string;
  sessionId?: string;
  deviceInfo?: Record<string, any>;
  breadcrumbs?: string[];
}

// Error handler function types
export type ErrorHandler<T extends BaseError = BaseError> = (error: T) => void;
export type AsyncErrorHandler<T extends BaseError = BaseError> = (error: T) => Promise<void>;

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

// Common error codes
export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  CONNECTION_LOST: 'CONNECTION_LOST',
  
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Database errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  DATABASE_ERROR: 'DATABASE_ERROR',
  
  // File errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  
  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];