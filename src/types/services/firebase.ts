/**
 * Firebase service types
 * Types for Firebase service operations
 */

export interface FirebaseServiceConfig {
  timeout: number;
  retries: number;
  enableLogging: boolean;
}

export interface FirebaseUploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

export interface FirebaseUploadResult {
  downloadURL: string;
  fullPath: string;
  name: string;
}

// Placeholder - add specific Firebase service types when needed