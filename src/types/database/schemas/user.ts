/**
 * User database schema types
 */

export interface UserSchema {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Placeholder - add specific user schema types when needed