/**
 * Document database schema types
 */

export interface DocumentSchema {
  _id: string;
  userId: string;
  type: string;
  name: string;
  uri: string;
  uploadUrl?: string;
  uploadStatus: string;
  createdAt: Date;
}

// Placeholder - add specific document schema types when needed