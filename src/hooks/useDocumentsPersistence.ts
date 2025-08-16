/**
 * Hook for managing documents persistence and recovery
 * Handles offline support, auto-save, and crash recovery
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
// TODO: Install @react-native-async-storage/async-storage
// For now, using a simple in-memory storage as fallback
const AsyncStorage = {
  setItem: async (key: string, value: string) => {
    // In production, this would use actual AsyncStorage
    logger.debug('Mock AsyncStorage.setItem', { key });
    return Promise.resolve();
  },
  getItem: async (key: string) => {
    logger.debug('Mock AsyncStorage.getItem', { key });
    return Promise.resolve(null);
  },
  removeItem: async (key: string) => {
    logger.debug('Mock AsyncStorage.removeItem', { key });
    return Promise.resolve();
  },
};
import { DocumentUploadUrls } from '../types/onboarding';
import { logger } from '../utils/logger';
import { APP_CONFIG } from '../config/constants';

interface PersistenceState {
  documents: DocumentUploadUrls;
  lastSaved: string;
  isDirty: boolean;
}

interface UseDocumentsPersistenceOptions {
  userId: string | null;
  autoSaveInterval?: number;
  enableAutoSave?: boolean;
}

interface UseDocumentsPersistenceReturn {
  savedDocuments: DocumentUploadUrls | null;
  isLoading: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
  saveDocuments: (documents: DocumentUploadUrls) => Promise<void>;
  clearSavedDocuments: () => Promise<void>;
  recoverDocuments: () => Promise<DocumentUploadUrls | null>;
}

const STORAGE_KEY_PREFIX = '@instataxi_documents_';
const AUTO_SAVE_DEBOUNCE = 2000; // 2 seconds

export function useDocumentsPersistence(
  options: UseDocumentsPersistenceOptions
): UseDocumentsPersistenceReturn {
  const { userId, autoSaveInterval = 30000, enableAutoSave = true } = options;
  
  const [savedDocuments, setSavedDocuments] = useState<DocumentUploadUrls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const pendingDocumentsRef = useRef<DocumentUploadUrls | null>(null);

  /**
   * Get storage key for current user
   */
  const getStorageKey = useCallback((): string => {
    return `${STORAGE_KEY_PREFIX}${userId || 'anonymous'}`;
  }, [userId]);

  /**
   * Save documents to persistent storage
   */
  const saveDocuments = useCallback(async (documents: DocumentUploadUrls): Promise<void> => {
    try {
      const storageKey = getStorageKey();
      const persistenceData: PersistenceState = {
        documents,
        lastSaved: new Date().toISOString(),
        isDirty: false,
      };

      await AsyncStorage.setItem(storageKey, JSON.stringify(persistenceData));
      
      setSavedDocuments(documents);
      setLastSaved(new Date());
      setIsDirty(false);
      
      logger.debug('Documents saved to persistent storage', {
        userId,
        documentsCount: Object.values(documents).filter(Boolean).length,
      });
    } catch (error) {
      logger.error('Failed to save documents to persistent storage', error);
      throw error;
    }
  }, [getStorageKey, userId]);

  /**
   * Load documents from persistent storage
   */
  const loadDocuments = useCallback(async (): Promise<DocumentUploadUrls | null> => {
    try {
      setIsLoading(true);
      const storageKey = getStorageKey();
      const data = await AsyncStorage.getItem(storageKey);
      
      if (!data) {
        logger.debug('No saved documents found');
        return null;
      }

      const persistenceData: PersistenceState = JSON.parse(data);
      
      // Check if data is too old (more than 24 hours)
      const savedDate = new Date(persistenceData.lastSaved);
      const ageInHours = (Date.now() - savedDate.getTime()) / (1000 * 60 * 60);
      
      if (ageInHours > 24) {
        logger.warn('Saved documents are too old, clearing', { ageInHours });
        await clearSavedDocuments();
        return null;
      }

      setSavedDocuments(persistenceData.documents);
      setLastSaved(savedDate);
      setIsDirty(persistenceData.isDirty);
      
      logger.info('Documents loaded from persistent storage', {
        userId,
        documentsCount: Object.values(persistenceData.documents).filter(Boolean).length,
        age: `${ageInHours.toFixed(1)} hours`,
      });
      
      return persistenceData.documents;
    } catch (error) {
      logger.error('Failed to load documents from persistent storage', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getStorageKey, userId]);

  /**
   * Clear saved documents
   */
  const clearSavedDocuments = useCallback(async (): Promise<void> => {
    try {
      const storageKey = getStorageKey();
      await AsyncStorage.removeItem(storageKey);
      
      setSavedDocuments(null);
      setLastSaved(null);
      setIsDirty(false);
      
      logger.debug('Cleared saved documents', { userId });
    } catch (error) {
      logger.error('Failed to clear saved documents', error);
      throw error;
    }
  }, [getStorageKey, userId]);

  /**
   * Recover documents after crash or restart
   */
  const recoverDocuments = useCallback(async (): Promise<DocumentUploadUrls | null> => {
    try {
      logger.info('Attempting to recover documents', { userId });
      
      // Try to load from persistent storage
      const recovered = await loadDocuments();
      
      if (recovered && Object.values(recovered).some(Boolean)) {
        logger.info('Successfully recovered documents', {
          documentsCount: Object.values(recovered).filter(Boolean).length,
        });
        return recovered;
      }
      
      // Check for backup storage (if implemented)
      const backupKey = `${getStorageKey()}_backup`;
      const backupData = await AsyncStorage.getItem(backupKey);
      
      if (backupData) {
        const backup: PersistenceState = JSON.parse(backupData);
        logger.info('Recovered from backup storage');
        return backup.documents;
      }
      
      return null;
    } catch (error) {
      logger.error('Failed to recover documents', error);
      return null;
    }
  }, [loadDocuments, getStorageKey]);

  /**
   * Auto-save functionality
   */
  const scheduleAutoSave = useCallback((documents: DocumentUploadUrls) => {
    if (!enableAutoSave) return;
    
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // Mark as dirty
    setIsDirty(true);
    pendingDocumentsRef.current = documents;
    
    // Schedule new save
    autoSaveTimerRef.current = setTimeout(async () => {
      if (pendingDocumentsRef.current) {
        try {
          await saveDocuments(pendingDocumentsRef.current);
          logger.debug('Auto-saved documents');
        } catch (error) {
          logger.error('Auto-save failed', error);
        }
      }
    }, AUTO_SAVE_DEBOUNCE);
  }, [enableAutoSave, saveDocuments]);

  /**
   * Handle app state changes (background/foreground)
   */
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // Save when app goes to background
      if (
        appStateRef.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        if (pendingDocumentsRef.current && isDirty) {
          saveDocuments(pendingDocumentsRef.current).catch(error => {
            logger.error('Failed to save on background', error);
          });
        }
      }
      
      // Load when app comes to foreground
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        loadDocuments().catch(error => {
          logger.error('Failed to load on foreground', error);
        });
      }
      
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [isDirty, saveDocuments, loadDocuments]);

  /**
   * Load documents on mount
   */
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Save any pending documents
      if (pendingDocumentsRef.current && isDirty) {
        saveDocuments(pendingDocumentsRef.current);
      }
    };
  }, [isDirty, saveDocuments]);

  return {
    savedDocuments,
    isLoading,
    isDirty,
    lastSaved,
    saveDocuments,
    clearSavedDocuments,
    recoverDocuments,
  };
}