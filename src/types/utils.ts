/**
 * Utility types for the application
 */

/**
 * Extracts URLs from a data structure that contains objects with uploadUrl property
 * Useful for tracking upload states in forms
 */
export type ExtractUrls<T> = {
  [K in keyof T]: T[K] extends { uploadUrl?: string | null } | null 
    ? string | null 
    : never;
};

/**
 * Makes all properties of an object nullable
 */
export type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

/**
 * Makes all properties of an object required and non-nullable
 */
export type RequiredNonNullable<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

/**
 * Extracts only the keys of type T that have values of type V
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Creates a partial type with specific required fields
 */
export type PartialWithRequired<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Deeply makes all properties optional
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * Type guard to check if a value is not null or undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard to check if all required fields are present
 */
export function hasRequiredFields<T extends object, K extends keyof T>(
  obj: Partial<T>,
  requiredFields: K[]
): obj is T & Required<Pick<T, K>> {
  return requiredFields.every(field => isDefined(obj[field]));
}