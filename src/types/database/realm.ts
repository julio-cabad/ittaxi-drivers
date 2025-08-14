/**
 * Realm database specific types
 * Types for Realm database operations and schemas
 */

import type { BaseEntity, SyncableEntity } from '../common/database';

export interface RealmConfig {
  schemaVersion: number;
  encryptionKey?: string;
  path?: string;
}

export interface RealmEntity extends SyncableEntity {
  _id: string; // Realm primary key
}

export interface RealmQueryOptions {
  sorted?: string | [string, boolean];
  filtered?: string;
  limit?: number;
}

// Placeholder - add specific Realm types when needed