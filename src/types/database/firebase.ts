/**
 * Firebase database specific types
 * Types for Firebase/Firestore operations
 */

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface FirestoreDocument {
  id: string;
  data: any;
  exists: boolean;
}

export interface FirestoreQuery {
  collection: string;
  where?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  limit?: number;
}

// Placeholder - add specific Firebase types when needed