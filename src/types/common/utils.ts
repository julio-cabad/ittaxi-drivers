/**
 * Common utility types
 * TypeScript utility types used across the application
 */

// Make specific fields optional
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific fields required
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Deep partial - make all nested properties optional
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep required - make all nested properties required
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Extract keys of a specific type
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// Create a type with only specific keys
export type PickByType<T, U> = Pick<T, KeysOfType<T, U>>;

// Exclude specific keys by type
export type OmitByType<T, U> = Omit<T, KeysOfType<T, U>>;

// Make properties nullable
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// Remove null from properties
export type NonNullable<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

// Function types
export type AsyncFunction<T = any, R = any> = (arg: T) => Promise<R>;
export type VoidFunction = () => void;
export type AsyncVoidFunction = () => Promise<void>;

// Event handler types
export type EventHandler<T = any> = (event: T) => void;
export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;

// Generic callback types
export type Callback<T = void> = (result: T) => void;
export type ErrorCallback = (error: Error) => void;
export type SuccessCallback<T = any> = (data: T) => void;

// ID types
export type ID = string | number;
export type UUID = string;
export type Timestamp = string; // ISO string

// Status types
export type Status = 'active' | 'inactive' | 'pending' | 'suspended';
export type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'failed';

// Generic response wrapper
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Environment types
export type Environment = 'development' | 'staging' | 'production';

// Platform types
export type Platform = 'ios' | 'android' | 'web';