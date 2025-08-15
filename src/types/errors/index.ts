/**
 * Centralized error types for the application
 */

export enum ErrorCode {
  // Network Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  
  // Authentication Errors
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',
  AUTH_ACCOUNT_LOCKED = 'AUTH_ACCOUNT_LOCKED',
  
  // Validation Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // File/Upload Errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_FORMAT = 'INVALID_FILE_FORMAT',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  
  // Business Logic Errors
  ONBOARDING_INCOMPLETE = 'ONBOARDING_INCOMPLETE',
  DRIVER_NOT_APPROVED = 'DRIVER_NOT_APPROVED',
  VEHICLE_NOT_VERIFIED = 'VEHICLE_NOT_VERIFIED',
  
  // System Errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  FEATURE_DISABLED = 'FEATURE_DISABLED',
}

export interface AppError extends Error {
  code: ErrorCode;
  message: string;
  details?: any;
  retryable?: boolean;
  userMessage?: string; // User-friendly message for display
}

export class CustomError extends Error implements AppError {
  code: ErrorCode;
  details?: any;
  retryable?: boolean;
  userMessage?: string;

  constructor(
    code: ErrorCode,
    message: string,
    details?: any,
    retryable = false,
    userMessage?: string
  ) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.details = details;
    this.retryable = retryable;
    this.userMessage = userMessage || message;
    
    // Maintains proper stack trace for where our error was thrown (V8 only)
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, CustomError);
    }
  }

  toJSON(): object {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      details: this.details,
      retryable: this.retryable,
      stack: this.stack,
    };
  }
}

// Error factory functions for common scenarios
export const ErrorFactory = {
  networkError: (message = 'Network error occurred', details?: any) =>
    new CustomError(
      ErrorCode.NETWORK_ERROR,
      message,
      details,
      true,
      'Please check your internet connection and try again'
    ),

  validationError: (field: string, message: string) =>
    new CustomError(
      ErrorCode.VALIDATION_ERROR,
      `Validation failed for field: ${field}`,
      { field, message },
      false,
      message
    ),

  authError: (message = 'Authentication failed') =>
    new CustomError(
      ErrorCode.AUTH_UNAUTHORIZED,
      message,
      undefined,
      false,
      'Please log in to continue'
    ),

  uploadError: (filename: string, reason?: string) =>
    new CustomError(
      ErrorCode.UPLOAD_FAILED,
      `Failed to upload ${filename}${reason ? `: ${reason}` : ''}`,
      { filename, reason },
      true,
      `Failed to upload ${filename}. Please try again.`
    ),

  unknownError: (error: any) =>
    new CustomError(
      ErrorCode.UNKNOWN_ERROR,
      error?.message || 'An unknown error occurred',
      error,
      false,
      'Something went wrong. Please try again later.'
    ),
};