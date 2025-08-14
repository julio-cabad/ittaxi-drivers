/**
 * Photo database schema types
 */

export interface PhotoSchema {
  _id: string;
  userId: string;
  type: string;
  name: string;
  uri: string;
  uploadUrl?: string;
  uploadStatus: string;
  createdAt: Date;
}

// Placeholder - add specific photo schema types when needed