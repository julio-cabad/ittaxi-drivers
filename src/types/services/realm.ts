/**
 * Realm service types
 * Types for Realm service operations
 */

export interface RealmServiceConfig {
  schemaVersion: number;
  encryptionKey?: string;
  deleteRealmIfMigrationNeeded?: boolean;
}

export interface RealmSyncOptions {
  batchSize: number;
  syncInterval: number;
  retryAttempts: number;
}

// Placeholder - add specific Realm service types when needed