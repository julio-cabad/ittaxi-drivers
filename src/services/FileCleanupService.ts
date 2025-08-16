/**
 * File Cleanup Service
 * Professional service for managing temporary files and cache cleanup
 */

import { Platform } from 'react-native';
import { logger } from '../utils/logger';

interface FileCleanupOptions {
  maxAge?: number; // Maximum age in milliseconds
  extensions?: string[]; // File extensions to clean
  preserveCount?: number; // Number of recent files to preserve
}

class FileCleanupService {
  private static instance: FileCleanupService;
  private temporaryFiles: Map<string, { uri: string; timestamp: number; size?: number }> = new Map();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;
  private readonly CLEANUP_INTERVAL = 300000; // 5 minutes
  private readonly MAX_TEMP_FILE_AGE = 3600000; // 1 hour

  private constructor() {
    this.startPeriodicCleanup();
  }

  static getInstance(): FileCleanupService {
    if (!FileCleanupService.instance) {
      FileCleanupService.instance = new FileCleanupService();
    }
    return FileCleanupService.instance;
  }

  /**
   * Register a temporary file for tracking
   */
  registerTemporaryFile(uri: string, size?: number): void {
    const fileId = this.generateFileId(uri);
    this.temporaryFiles.set(fileId, {
      uri,
      timestamp: Date.now(),
      size,
    });
    
    logger.debug('Registered temporary file', { fileId, uri, size });
  }

  /**
   * Unregister a temporary file (when it's been uploaded successfully)
   */
  unregisterTemporaryFile(uri: string): void {
    const fileId = this.generateFileId(uri);
    if (this.temporaryFiles.delete(fileId)) {
      logger.debug('Unregistered temporary file', { fileId, uri });
    }
  }

  /**
   * Clean up old temporary files
   */
  async cleanupOldFiles(options: FileCleanupOptions = {}): Promise<number> {
    const {
      maxAge = this.MAX_TEMP_FILE_AGE,
      extensions,
      preserveCount = 0,
    } = options;

    const now = Date.now();
    const filesToDelete: string[] = [];
    const sortedFiles = Array.from(this.temporaryFiles.entries())
      .sort((a, b) => b[1].timestamp - a[1].timestamp);

    let preserved = 0;
    for (const [fileId, fileInfo] of sortedFiles) {
      // Preserve recent files if requested
      if (preserved < preserveCount) {
        preserved++;
        continue;
      }

      // Check file age
      const age = now - fileInfo.timestamp;
      if (age > maxAge) {
        // Check file extension if filter provided
        if (extensions && extensions.length > 0) {
          const hasValidExtension = extensions.some(ext => 
            fileInfo.uri.toLowerCase().endsWith(ext.toLowerCase())
          );
          if (!hasValidExtension) continue;
        }

        filesToDelete.push(fileId);
      }
    }

    // Clean up files
    for (const fileId of filesToDelete) {
      const fileInfo = this.temporaryFiles.get(fileId);
      if (fileInfo) {
        await this.deleteFile(fileInfo.uri);
        this.temporaryFiles.delete(fileId);
      }
    }

    logger.info('Cleaned up temporary files', {
      cleaned: filesToDelete.length,
      remaining: this.temporaryFiles.size,
    });

    return filesToDelete.length;
  }

  /**
   * Clean up all temporary files
   */
  async cleanupAllFiles(): Promise<void> {
    const fileCount = this.temporaryFiles.size;
    
    for (const [fileId, fileInfo] of this.temporaryFiles.entries()) {
      await this.deleteFile(fileInfo.uri);
    }
    
    this.temporaryFiles.clear();
    
    logger.info('Cleaned up all temporary files', { count: fileCount });
  }

  /**
   * Get statistics about temporary files
   */
  getStatistics(): {
    totalFiles: number;
    totalSize: number;
    oldestFile: Date | null;
    newestFile: Date | null;
  } {
    let totalSize = 0;
    let oldestTimestamp = Infinity;
    let newestTimestamp = 0;

    for (const fileInfo of this.temporaryFiles.values()) {
      totalSize += fileInfo.size || 0;
      oldestTimestamp = Math.min(oldestTimestamp, fileInfo.timestamp);
      newestTimestamp = Math.max(newestTimestamp, fileInfo.timestamp);
    }

    return {
      totalFiles: this.temporaryFiles.size,
      totalSize,
      oldestFile: oldestTimestamp === Infinity ? null : new Date(oldestTimestamp),
      newestFile: newestTimestamp === 0 ? null : new Date(newestTimestamp),
    };
  }

  /**
   * Start periodic cleanup
   */
  private startPeriodicCleanup(): void {
    if (this.cleanupInterval) return;

    this.cleanupInterval = setInterval(async () => {
      try {
        await this.cleanupOldFiles();
      } catch (error) {
        logger.error('Periodic cleanup failed', error);
      }
    }, this.CLEANUP_INTERVAL);

    logger.debug('Started periodic cleanup service');
  }

  /**
   * Stop periodic cleanup
   */
  stopPeriodicCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      logger.debug('Stopped periodic cleanup service');
    }
  }

  /**
   * Delete a file (platform-specific implementation needed)
   */
  private async deleteFile(uri: string): Promise<void> {
    try {
      // In React Native, actual file deletion depends on the library used
      // For now, we just log the intention
      // In production, you'd use a library like react-native-fs
      
      if (Platform.OS === 'ios') {
        // iOS specific deletion
        logger.debug('Would delete iOS file', { uri });
      } else if (Platform.OS === 'android') {
        // Android specific deletion
        logger.debug('Would delete Android file', { uri });
      }
      
      // TODO: Implement actual file deletion using react-native-fs
      // Example:
      // await RNFS.unlink(uri);
      
    } catch (error) {
      logger.error('Failed to delete file', { uri, error });
      throw error;
    }
  }

  /**
   * Generate a unique file ID
   */
  private generateFileId(uri: string): string {
    return `${uri}_${Date.now()}`;
  }

  /**
   * Cleanup on app termination
   */
  async destroy(): Promise<void> {
    this.stopPeriodicCleanup();
    await this.cleanupAllFiles();
  }
}

export const fileCleanupService = FileCleanupService.getInstance();