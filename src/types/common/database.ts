/**
 * Common database types and interfaces
 * Used across all database operations
 */

export type SyncStatus = 'synced' | 'pending' | 'error' | 'offline';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyncableEntity extends BaseEntity {
  syncStatus: SyncStatus;
  lastSyncAt?: Date;
}

export interface DatabaseConfig {
  name: string;
  version: number;
  encryptionKey?: string;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface DatabaseOperation<T = any> {
  type: 'create' | 'read' | 'update' | 'delete';
  collection: string;
  data?: T;
  id?: string;
  options?: QueryOptions;
}

export type DatabaseResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
};